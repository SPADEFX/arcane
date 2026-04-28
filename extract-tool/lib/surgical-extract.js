// Surgical Section Extractor — runs inside page.evaluate()
// Extracts ONLY the CSS rules, keyframes, variables, media queries,
// fonts, images, and animations that apply to a specific section.
// Unlike computed styles, this preserves responsive behavior.

module.exports = async function surgicalExtract(rootSelector, rootTreePath) {
  // ── Find the root element ──────────────────────────────────────────
  let rootEl = null;
  if (rootSelector) try { rootEl = document.querySelector(rootSelector); } catch(e) {}
  if (!rootEl && rootTreePath) {
    const parts = rootTreePath.split(".").map(Number);
    rootEl = document.body;
    const skip = {script:1,noscript:1,style:1,link:1,meta:1,base:1,template:1};
    for (let i = 1; i < parts.length && rootEl; i++) {
      const filtered = Array.from(rootEl.children).filter(c => !skip[c.tagName.toLowerCase()]);
      rootEl = filtered[parts[i]] || null;
    }
  }
  if (!rootEl) return { error: "Element not found" };

  // ── Phase 1: Collect all elements in the section ───────────────────
  const sectionEls = new Set();
  sectionEls.add(rootEl);
  rootEl.querySelectorAll("*").forEach(el => sectionEls.add(el));

  // ── Phase 2: Iterate all stylesheets, collect matching rules ───────
  const matchedRules = [];
  const keyframesMap = {};
  const allKeyframes = {};
  const fontFaces = [];
  const allFontFaces = [];
  const keyframesNeeded = new Set();
  const fontsNeeded = new Set();
  const varsNeeded = new Set();
  const imagesNeeded = new Set();

  // Serialize a CSSStyleDeclaration using longhand iteration
  function serializeStyle(style) {
    const parts = [];
    for (let i = 0; i < style.length; i++) {
      const p = style.item(i);
      const v = style.getPropertyValue(p);
      if (v == null || v === "") continue;
      const prio = style.getPropertyPriority(p);
      parts.push(p + ":" + v + (prio ? " !" + prio : ""));
    }
    return parts.join(";") || style.cssText;
  }

  // Test if any element in the section matches a selector
  // Strips pseudo-classes/elements for matching, keeps full selector in output
  function sectionMatches(selector) {
    // Split compound selectors
    const selectors = selector.split(",").map(s => s.trim());
    for (const sel of selectors) {
      // Strip pseudo-elements and pseudo-classes for matching
      const base = sel
        .replace(/::[\w-]+(\([^)]*\))?/g, "")  // ::before, ::after, ::placeholder
        .replace(/:(?:hover|focus|active|focus-within|focus-visible|visited|checked|disabled|enabled|first-child|last-child|nth-child\([^)]*\)|nth-of-type\([^)]*\)|first-of-type|last-of-type|only-child|empty|not\([^)]*\)|where\([^)]*\)|is\([^)]*\)|has\([^)]*\))/g, "")
        .trim();
      if (!base) continue;
      try {
        for (const el of sectionEls) {
          if (el.matches(base)) return true;
        }
      } catch(e) {
        // Invalid selector, skip
      }
    }
    return false;
  }

  // Scan a CSS value for var() references, url() references, font-family, animation-name
  function scanValue(prop, value) {
    // CSS variables
    const varMatches = value.matchAll(/var\(\s*(--[\w-]+)/g);
    for (const m of varMatches) varsNeeded.add(m[1]);
    // URLs (images)
    const urlMatches = value.matchAll(/url\(["']?([^"')]+)["']?\)/g);
    for (const m of urlMatches) {
      if (!m[1].startsWith("data:")) imagesNeeded.add(m[1]);
    }
    // Animation name
    if (prop === "animation-name" || prop === "animation") {
      const names = value.split(",").map(s => s.trim().split(/\s+/)[0]);
      names.forEach(n => { if (n && n !== "none") keyframesNeeded.add(n); });
    }
    // Font family
    if (prop === "font-family") {
      const families = value.split(",").map(s => s.trim().replace(/["']/g, ""));
      families.forEach(f => fontsNeeded.add(f));
    }
  }

  // Process a style rule
  function processStyleRule(rule) {
    if (!sectionMatches(rule.selectorText)) return null;
    const css = serializeStyle(rule.style);
    // Scan all properties for references
    for (let i = 0; i < rule.style.length; i++) {
      const prop = rule.style.item(i);
      const val = rule.style.getPropertyValue(prop);
      scanValue(prop, val);
    }
    return { selector: rule.selectorText, css: css };
  }

  // Walk rules recursively
  function walkRules(rules, container) {
    for (const rule of Array.from(rules || [])) {
      if (rule.type === CSSRule.STYLE_RULE) {
        const matched = processStyleRule(rule);
        if (matched) matchedRules.push(matched);
      } else if (rule.type === CSSRule.MEDIA_RULE) {
        const mediaText = (rule.media && rule.media.mediaText) || "";
        // Skip prefers-reduced-motion: reduce
        if (/prefers-reduced-motion\s*:\s*reduce/i.test(mediaText)) continue;
        const innerMatched = [];
        for (const inner of Array.from(rule.cssRules || [])) {
          if (inner.type === CSSRule.STYLE_RULE) {
            const m = processStyleRule(inner);
            if (m) innerMatched.push(m);
          }
        }
        if (innerMatched.length > 0) {
          matchedRules.push({
            type: "media",
            mediaText: mediaText,
            rules: innerMatched,
          });
        }
      } else if (rule.type === CSSRule.SUPPORTS_RULE) {
        const innerMatched = [];
        for (const inner of Array.from(rule.cssRules || [])) {
          if (inner.type === CSSRule.STYLE_RULE) {
            const m = processStyleRule(inner);
            if (m) innerMatched.push(m);
          }
        }
        if (innerMatched.length > 0) {
          matchedRules.push({
            type: "supports",
            conditionText: rule.conditionText || "",
            rules: innerMatched,
          });
        }
      } else if (rule.type === CSSRule.KEYFRAMES_RULE) {
        allKeyframes[rule.name] = Array.from(rule.cssRules).map(r => ({
          keyText: r.keyText,
          css: serializeStyle(r.style),
        }));
      } else if (rule.type === CSSRule.FONT_FACE_RULE) {
        allFontFaces.push(rule.cssText);
      }
    }
  }

  for (const sheet of Array.from(document.styleSheets)) {
    try { walkRules(sheet.cssRules); } catch(e) { /* cross-origin */ }
  }

  // Also scan raw <style> tags we couldn't read via CSSOM
  for (const styleEl of document.querySelectorAll("style")) {
    let accessible = false;
    for (const sheet of document.styleSheets) {
      if (sheet.ownerNode === styleEl) { accessible = true; break; }
    }
    if (!accessible) {
      const text = (styleEl.textContent || "").trim();
      if (text) matchedRules.push({ type: "raw", css: text });
    }
  }

  // ── Phase 3: Resolve CSS variables chain ───────────────────────────
  const cssVars = {};
  const rootStyle = getComputedStyle(document.documentElement);
  // Also get vars from :root rules
  const rootVarRules = {};
  for (const sheet of Array.from(document.styleSheets)) {
    try {
      for (const rule of Array.from(sheet.cssRules || [])) {
        if (rule.type === CSSRule.STYLE_RULE && /^:root|^html/i.test(rule.selectorText)) {
          for (let i = 0; i < rule.style.length; i++) {
            const p = rule.style.item(i);
            if (p.startsWith("--")) rootVarRules[p] = rule.style.getPropertyValue(p).trim();
          }
        }
      }
    } catch(e) {}
  }

  // Transitive closure: resolve all needed vars
  let changed = true;
  let iterations = 0;
  while (changed && iterations < 20) {
    changed = false;
    iterations++;
    for (const varName of varsNeeded) {
      if (cssVars[varName]) continue;
      const val = rootVarRules[varName] || rootStyle.getPropertyValue(varName).trim();
      if (val) {
        cssVars[varName] = val;
        // Check if value references other vars
        const refs = val.matchAll(/var\(\s*(--[\w-]+)/g);
        for (const m of refs) {
          if (!varsNeeded.has(m[1])) {
            varsNeeded.add(m[1]);
            changed = true;
          }
        }
      }
    }
  }

  // ── Phase 4: Filter keyframes and fonts ────────────────────────────
  const keyframes = {};
  for (const name of keyframesNeeded) {
    if (allKeyframes[name]) keyframes[name] = allKeyframes[name];
  }

  const fonts = allFontFaces.filter(ff => {
    for (const f of fontsNeeded) {
      if (ff.includes(f)) return true;
    }
    return false;
  });

  // ── Phase 5: Asset collection ──────────────────────────────────────
  const images = [];
  // Inline images from the section
  for (const el of sectionEls) {
    if (el.tagName === "IMG" && el.src && !el.src.startsWith("data:")) {
      let base64 = null;
      try {
        const cvs = document.createElement("canvas");
        cvs.width = el.naturalWidth || el.width || 100;
        cvs.height = el.naturalHeight || el.height || 100;
        const ctx = cvs.getContext("2d");
        ctx.drawImage(el, 0, 0);
        base64 = cvs.toDataURL("image/png");
        if (base64.length < 200) base64 = null; // empty/tainted
      } catch(e) {}
      images.push({ original: el.src, base64: base64, type: "img" });
    }
  }
  // Background images from matched CSS
  for (const url of imagesNeeded) {
    const abs = url.startsWith("http") || url.startsWith("//")
      ? url
      : new URL(url, location.href).href;
    images.push({ original: abs, base64: null, type: "bg" });
  }

  // ── Phase 6: WAAPI animations ──────────────────────────────────────
  const wapiAnimations = [];
  try {
    const allAnims = document.getAnimations();
    for (const a of allAnims) {
      const target = a.effect && a.effect.target;
      if (!target || !sectionEls.has(target)) continue;
      const timing = a.effect.getComputedTiming ? a.effect.getComputedTiming() : {};
      const kfs = a.effect.getKeyframes ? a.effect.getKeyframes() : [];
      if (kfs.length === 0) continue;
      // Build a selector for the target
      let targetSel = target.tagName.toLowerCase();
      if (target.id) targetSel = "#" + target.id;
      else if (target.className && typeof target.className === "string") {
        const cls = target.className.trim().split(/\s+/).slice(0, 2).join(".");
        if (cls) targetSel += "." + cls;
      }
      wapiAnimations.push({
        targetSelector: targetSel,
        name: a.animationName || "anim-" + wapiAnimations.length,
        keyframes: kfs.map(kf => {
          const obj = {};
          for (const key in kf) {
            if (["offset", "computedOffset", "easing", "composite"].indexOf(key) === -1 && kf[key] != null) {
              obj[key] = kf[key];
            }
          }
          obj.offset = kf.offset;
          return obj;
        }),
        duration: timing.duration || 0,
        delay: timing.delay || 0,
        iterations: timing.iterations,
        direction: timing.direction,
        easing: timing.easing,
        fill: timing.fill,
      });
    }
  } catch(e) {}

  // ── Phase 7: CSS transitions on matched elements ───────────────────
  const transitions = [];
  for (const rule of matchedRules) {
    if (rule.type === "media" || rule.type === "supports" || rule.type === "raw") continue;
    if (rule.css && /transition/.test(rule.css)) {
      transitions.push({ selector: rule.selector, css: rule.css });
    }
  }

  // ── Build scoped CSS string ────────────────────────────────────────
  let scopedCss = "";
  // CSS variables
  if (Object.keys(cssVars).length > 0) {
    scopedCss += ":root {\n";
    for (const [k, v] of Object.entries(cssVars)) {
      scopedCss += "  " + k + ": " + v + ";\n";
    }
    scopedCss += "}\n\n";
  }
  // Font faces
  for (const ff of fonts) {
    scopedCss += ff + "\n\n";
  }
  // Keyframes
  for (const [name, stops] of Object.entries(keyframes)) {
    scopedCss += "@keyframes " + name + " {\n";
    for (const s of stops) {
      scopedCss += "  " + s.keyText + " { " + s.css + " }\n";
    }
    scopedCss += "}\n\n";
  }
  // Rules
  for (const rule of matchedRules) {
    if (rule.type === "media") {
      scopedCss += "@media " + rule.mediaText + " {\n";
      for (const r of rule.rules) {
        scopedCss += "  " + r.selector + " { " + r.css + " }\n";
      }
      scopedCss += "}\n\n";
    } else if (rule.type === "supports") {
      scopedCss += "@supports " + rule.conditionText + " {\n";
      for (const r of rule.rules) {
        scopedCss += "  " + r.selector + " { " + r.css + " }\n";
      }
      scopedCss += "}\n\n";
    } else if (rule.type === "raw") {
      scopedCss += "/* raw <style> tag */\n" + rule.css + "\n\n";
    } else {
      scopedCss += rule.selector + " { " + rule.css + " }\n";
    }
  }

  // ── Get HTML ───────────────────────────────────────────────────────
  const html = rootEl.outerHTML;
  const dimensions = {
    width: rootEl.offsetWidth,
    height: rootEl.offsetHeight,
  };

  return {
    html,
    scopedCss,
    cssVars,
    keyframes,
    fonts,
    images,
    wapiAnimations,
    transitions,
    dimensions,
    stats: {
      elements: sectionEls.size,
      cssRules: matchedRules.length,
      keyframeNames: Object.keys(keyframes).length,
      cssVarCount: Object.keys(cssVars).length,
      fontCount: fonts.length,
      imageCount: images.length,
      animationCount: wapiAnimations.length,
    },
  };
};
