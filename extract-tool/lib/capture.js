// Serialized and shipped to the browser via page.evaluate. Must be
// self-contained — no closure references, no requires.
module.exports = async function pageCapture(opts) {
  opts = opts || {};
  const out = { url: location.href, title: document.title, capturedAt: new Date().toISOString() };
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  // ── Tech report ────────────────────────────────────────────────────────────
  const tech = {
    gsap: !!(window.gsap || window.TweenMax || window.TweenLite || window.TimelineLite || window.ScrollTrigger),
    framerMotion: !!(window.__framer || document.querySelector("[data-framer-component-type]")),
    anime: !!window.anime,
    lottie: !!(window.lottie || window.bodymovin),
    three: !!window.THREE,
    react: !!document.querySelector("#__next, [data-reactroot], #root") || !!window.React,
    vue: !!window.__VUE__ || !!document.querySelector("[data-v-app]"),
    svgSmil: document.querySelectorAll("svg animate, svg animateTransform, svg animateMotion").length,
    canvasCount: document.querySelectorAll("canvas").length,
    videoCount: document.querySelectorAll("video").length,
    waapi: 0,
    cssKeyframes: 0,
    warnings: [],
  };
  try { tech.waapi = document.documentElement.getAnimations({ subtree: true }).length; } catch (e) {}
  try {
    for (const s of Array.from(document.styleSheets)) {
      try { tech.cssKeyframes += Array.from(s.cssRules).filter((r) => r.type === CSSRule.KEYFRAMES_RULE).length; } catch (e) {}
    }
  } catch (e) {}
  if (tech.canvasCount > 0) {
    const hasFramework = tech.react || tech.vue;
    if (hasFramework) {
      tech.warnings.push("canvas + React/Vue : le canvas dépend du JS framework → utilise Live Preview");
    } else {
      tech.warnings.push(opts.keepScripts
        ? "canvas/WebGL present — scripts kept, should run natively"
        : "canvas/WebGL present — enable 'Garder les scripts' to preserve");
    }
  }
  if (tech.three) {
    tech.warnings.push(tech.react || tech.vue
      ? "Three.js + framework : utilise Live Preview pour un rendu fidèle"
      : opts.keepScripts
        ? "Three.js detected — scripts kept, should render"
        : "Three.js detected — enable 'Garder les scripts'");
  }
  if (tech.lottie) tech.warnings.push("Lottie detected — frame-by-frame SVG may not replay fully");

  // ── Trigger scroll-based animations ──────────────────────────────────────
  // Scroll progressively through the page in small steps so every
  // IntersectionObserver threshold fires. Then scroll back to top so
  // "scroll-triggered once" animations have fired by the time we sample.
  if (opts.scrollTrigger !== false) {
    try {
      const totalH = document.body.scrollHeight;
      const viewH = window.innerHeight;
      const passes = opts.thorough ? 2 : 1;
      // Step size: ~25% viewport (thorough: ~15%). Larger steps than before
      // to keep total scroll time reasonable on long pages.
      const stepPx = Math.max(150, Math.round(viewH * (opts.thorough ? 0.15 : 0.25)));
      const dwellMs = opts.thorough ? 120 : 60;
      // Hard cap: max 8s scroll total (thorough: 15s) to avoid blocking capture.
      const scrollDeadline = performance.now() + (opts.thorough ? 15000 : 8000);

      for (let p = 0; p < passes; p++) {
        if (performance.now() > scrollDeadline) break;
        // Scroll down progressively.
        for (let y = 0; y <= totalH; y += stepPx) {
          if (performance.now() > scrollDeadline) break;
          window.scrollTo(0, y);
          await sleep(dwellMs);
        }
        window.scrollTo(0, totalH);
        await sleep(opts.thorough ? 300 : 150);
        // Scroll back up (faster).
        for (let y = totalH; y >= 0; y -= stepPx * 3) {
          if (performance.now() > scrollDeadline) break;
          window.scrollTo(0, y);
          await sleep(30);
        }
        window.scrollTo(0, 0);
        await sleep(opts.thorough ? 300 : 150);
      }

      // Trigger hover/focus states on interactive elements.
      try {
        const interactiveEls = Array.from(document.querySelectorAll(
          'a, button, [role="button"], [tabindex], details'
        )).slice(0, opts.thorough ? 30 : 10);
        for (const el of interactiveEls) {
          try {
            el.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
          } catch (e) {}
        }
        await sleep(150);
        for (const el of interactiveEls) {
          try {
            el.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));
          } catch (e) {}
        }
      } catch (e) {}
    } catch (e) {}
  }

  // ── Force scroll-triggered elements to visible state ────────────────────
  // Many sites use IntersectionObserver / GSAP ScrollTrigger / Framer Motion
  // to reveal elements on scroll (opacity:0→1, translateY:50px→0). After our
  // scroll pass, the JS has fired but in the static capture the elements may
  // still have their initial "hidden" inline styles. We force them visible.
  {
    const allEls = Array.from(document.querySelectorAll('*'));
    let revealCount = 0;
    for (const el of allEls) {
      try {
        const cs = getComputedStyle(el);
        const op = parseFloat(cs.opacity);
        const tf = cs.transform;
        const vis = cs.visibility;

        // Skip actually-hidden elements (display:none containers, etc.)
        if (cs.display === 'none') continue;

        // Force opacity to 1 if it's near-zero (scroll reveal initial state)
        if (op < 0.1 && el.style.opacity) {
          el.style.opacity = '1';
          revealCount++;
        }

        // Force transform to none if it's a translation (scroll reveal offset)
        if (tf && tf !== 'none' && el.style.transform) {
          // Only clear transforms that look like scroll-reveal offsets
          // (translateY, translateX with significant values)
          if (/translate[XY3d]*\([^)]*[2-9]\d|translate[XY3d]*\([^)]*1\d\d/.test(tf)) {
            el.style.transform = 'none';
            revealCount++;
          }
        }

        // Force visibility
        if (vis === 'hidden' && el.style.visibility) {
          el.style.visibility = 'visible';
          revealCount++;
        }
      } catch (e) {}
    }
    if (revealCount > 0) tech.warnings.push(`Scroll-reveal: forced ${revealCount} hidden elements to visible`);
  }

  // ── Harvest stylesheet rules ──────────────────────────────────────────────
  const keyframes = {};
  const cssRules = [];
  const atRulesText = [];
  // Iterate each longhand individually. `rule.style.cssText` re-serializes
  // shorthands (`grid-template`, `animation`, `border`, ...) and sometimes
  // produces malformed output — e.g. `grid-template: "area1 area1 area2" …`
  // that browsers reject as invalid. Longhand iteration preserves the exact
  // parsed values and lets the browser reconstruct behavior.
  function serializeRule(style) {
    const parts = [];
    for (let i = 0; i < style.length; i++) {
      const p = style.item(i);
      if (!p) continue;
      const v = style.getPropertyValue(p);
      if (v == null || v === "") continue;
      const prio = style.getPropertyPriority(p);
      parts.push(`${p}:${v}${prio ? " !" + prio : ""}`);
    }
    return parts.join(";") || style.cssText;
  }
  // orderedRules keeps ALL rules (style + @media + @supports) in their
  // original source order. This is critical for correct cascade behavior —
  // separating @media from style rules breaks responsive layouts.
  const orderedRules = [];

  function walkRules(rules) {
    for (const rule of Array.from(rules || [])) {
      if (rule.type === CSSRule.KEYFRAMES_RULE) {
        keyframes[rule.name] = Array.from(rule.cssRules).map((r) => ({
          keyText: r.keyText,
          cssText: serializeRule(r.style),
        }));
      } else if (rule.type === CSSRule.STYLE_RULE) {
        const entry = { selector: rule.selectorText, cssText: serializeRule(rule.style) };
        cssRules.push(entry);
        orderedRules.push({ type: 'rule', text: `${rule.selectorText}{${serializeRule(rule.style)}}` });
      } else if (rule.type === CSSRule.MEDIA_RULE) {
        const mediaText = (rule.media && rule.media.mediaText) || "";
        if (/prefers-reduced-motion\s*:\s*reduce/i.test(mediaText)) continue;
        const innerRules = [];
        for (const inner of Array.from(rule.cssRules || [])) {
          if (inner.type === CSSRule.STYLE_RULE) {
            innerRules.push(`${inner.selectorText}{${serializeRule(inner.style)}}`);
          } else if (inner.type === CSSRule.KEYFRAMES_RULE) {
            const body = Array.from(inner.cssRules).map(kr => `${kr.keyText}{${serializeRule(kr.style)}}`).join("");
            innerRules.push(`@keyframes ${inner.name}{${body}}`);
          } else {
            innerRules.push(inner.cssText);
          }
        }
        const mediaBlock = `@media ${mediaText}{${innerRules.join("\n")}}`;
        atRulesText.push(mediaBlock);
        orderedRules.push({ type: 'at', text: mediaBlock });
      } else if (rule.type === CSSRule.SUPPORTS_RULE) {
        const innerRules = [];
        for (const inner of Array.from(rule.cssRules || [])) {
          if (inner.type === CSSRule.STYLE_RULE) {
            innerRules.push(`${inner.selectorText}{${serializeRule(inner.style)}}`);
          } else {
            innerRules.push(inner.cssText);
          }
        }
        const supportsBlock = `@supports ${rule.conditionText || ""}{${innerRules.join("\n")}}`;
        atRulesText.push(supportsBlock);
        orderedRules.push({ type: 'at', text: supportsBlock });
      } else if (rule.type === CSSRule.FONT_FACE_RULE) {
        atRulesText.push({ type: 'font-face', text: rule.cssText });
        orderedRules.push({ type: 'at', text: rule.cssText });
      } else if (rule.type === CSSRule.IMPORT_RULE) {
        atRulesText.push({ type: 'import', text: rule.cssText });
        orderedRules.push({ type: 'at', text: rule.cssText });
      }
    }
  }
  // Track which <style>/<link> elements we successfully read via CSSOM.
  const readSheets = new Set();
  for (const sheet of Array.from(document.styleSheets)) {
    try {
      walkRules(sheet.cssRules);
      if (sheet.ownerNode) readSheets.add(sheet.ownerNode);
    } catch (e) {
      // SecurityError — cross-origin or CSP-blocked stylesheet.
      // We'll fall back to raw text below.
    }
  }

  // ── Trigger hover states to force CSS-in-JS to inject :hover styles ─────
  // CSS-in-JS libs (styled-components, Emotion) only inject hover rules into
  // the DOM when an element is actually hovered. We dispatch mouseenter on
  // interactive elements, wait for style injection, then collect everything.
  {
    const hoverTargets = Array.from(document.querySelectorAll(
      'a, button, [role="button"], nav a, nav button, [class*="nav"], [class*="menu"], [class*="dropdown"], [class*="link"], [class*="btn"], [class*="card"]'
    )).slice(0, 80);
    for (const el of hoverTargets) {
      try {
        el.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
        el.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
      } catch (e) {}
    }
    await sleep(300); // let CSS-in-JS inject hover styles
    for (const el of hoverTargets) {
      try {
        el.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));
        el.dispatchEvent(new MouseEvent('mouseout', { bubbles: true }));
      } catch (e) {}
    }
    await sleep(100);
  }

  // ── Fallback: grab raw text of <style> tags we couldn't read via CSSOM ──
  // CSS-in-JS frameworks (styled-components, Emotion, Tailwind JIT, Next.js)
  // inject <style> tags at runtime. If the CSSOM blocked access (cross-origin,
  // nonce mismatch), we capture the raw CSS text directly. This covers:
  //   • <style> tags in <head> and <body>
  //   • Dynamically injected <style data-styled>, <style data-emotion>, etc.
  const rawStyleFallbacks = [];
  for (const styleEl of Array.from(document.querySelectorAll('style'))) {
    if (readSheets.has(styleEl)) continue; // already parsed via CSSOM
    const text = (styleEl.textContent || '').trim();
    if (!text) continue;
    // Skip our own injected recorder/hooks scripts.
    if (text.includes('__mxR') || text.includes('data-mx-')) continue;
    rawStyleFallbacks.push(text);
  }

  // ── Inline @font-face src URLs as base64 data URIs ──────────────────────
  // Without this, offline captures lose all custom fonts and fall back to
  // system fonts — hugely degrading visual fidelity.
  const fontMimeMap = {
    woff2: 'font/woff2', woff: 'font/woff', ttf: 'font/ttf',
    otf: 'font/otf', eot: 'application/vnd.ms-fontobject',
  };
  async function inlineFontUrl(url) {
    try {
      const resp = await fetch(url, { mode: 'cors' });
      if (!resp.ok) return null;
      const blob = await resp.blob();
      const ext = (url.split('?')[0].split('.').pop() || '').toLowerCase();
      const mime = fontMimeMap[ext] || blob.type || 'font/woff2';
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => {
          // Replace the MIME type if FileReader guessed wrong (common for fonts).
          const result = reader.result.replace(/^data:[^;]*/, 'data:' + mime);
          resolve(result);
        };
        reader.onerror = () => resolve(null);
        reader.readAsDataURL(blob);
      });
    } catch (e) { return null; }
  }
  for (let ri = 0; ri < atRulesText.length; ri++) {
    const entry = atRulesText[ri];
    if (typeof entry === 'string') continue; // legacy plain text
    if (entry.type !== 'font-face') continue;
    let text = entry.text;
    // Match all url(...) references in the @font-face src descriptor.
    const urlPattern = /url\(["']?(https?:\/\/[^"')]+|\/\/[^"')]+|\/[^"')]+)["']?\)/g;
    let match;
    const replacements = [];
    while ((match = urlPattern.exec(text)) !== null) {
      let fontUrl = match[1];
      if (fontUrl.startsWith('//')) fontUrl = location.protocol + fontUrl;
      else if (fontUrl.startsWith('/')) fontUrl = location.origin + fontUrl;
      replacements.push({ full: match[0], url: fontUrl });
    }
    for (const r of replacements) {
      const dataUri = await inlineFontUrl(r.url);
      if (dataUri) {
        text = text.replace(r.full, `url("${dataUri}")`);
      }
    }
    atRulesText[ri] = text; // flatten to string
  }
  // Flatten any remaining entry objects to strings.
  for (let ri = 0; ri < atRulesText.length; ri++) {
    if (typeof atRulesText[ri] === 'object') atRulesText[ri] = atRulesText[ri].text;
  }

  // Also fetch Google Fonts <link> stylesheets inline — they contain
  // @font-face rules pointing to CDN woff2 files. We fetch the CSS,
  // inline every font URL, and merge into atRulesText so the capture is
  // fully self-contained.
  const googleFontLinks = Array.from(document.querySelectorAll('link[rel="stylesheet"]'))
    .map((l) => l.getAttribute("href"))
    .filter((h) => h && /fonts\.googleapis\.com/i.test(h));
  for (const gfHref of googleFontLinks) {
    try {
      const resp = await fetch(gfHref);
      if (!resp.ok) continue;
      let css = await resp.text();
      const urlPattern2 = /url\(["']?(https?:\/\/[^"')]+)["']?\)/g;
      let m2;
      const reps = [];
      while ((m2 = urlPattern2.exec(css)) !== null) reps.push({ full: m2[0], url: m2[1] });
      for (const r of reps) {
        const dataUri = await inlineFontUrl(r.url);
        if (dataUri) css = css.replace(r.full, `url("${dataUri}")`);
      }
      atRulesText.push(css);
    } catch (e) {}
  }

  const inlinedGoogleFonts = new Set(googleFontLinks);
  const externalStyles = Array.from(document.querySelectorAll('link[rel="stylesheet"]'))
    .map((l) => l.getAttribute("href"))
    .filter((h) => h && !inlinedGoogleFonts.has(h));

  // Script passthrough: capture <head> scripts so canvas/WebGL/JS-driven
  // animations keep running in the clone. Body scripts are already inside
  // rootOuterHTML. Only collected when opts.keepScripts is true.
  const headScripts = [];
  if (opts.keepScripts) {
    for (const s of Array.from(document.querySelectorAll("head script"))) {
      if (s.src) {
        const abs = s.src.startsWith("http") || s.src.startsWith("//") ? s.src : s.src;
        headScripts.push({ src: abs, type: s.type || "", async: s.async, defer: s.defer, crossOrigin: s.crossOrigin || "" });
      } else if ((s.textContent || "").trim()) {
        headScripts.push({ inline: s.textContent, type: s.type || "" });
      }
    }
  }

  const rootVars = {};
  for (const el of [document.documentElement, document.body]) {
    for (const s of Array.from(el.style || [])) {
      if (s.startsWith("--")) rootVars[s] = el.style.getPropertyValue(s).trim();
    }
  }
  const bodyCs = getComputedStyle(document.body);
  const rootComputed = {
    "font-family": bodyCs.fontFamily,
    "font-size": bodyCs.fontSize,
    "font-weight": bodyCs.fontWeight,
    "line-height": bodyCs.lineHeight,
    "background-color": bodyCs.backgroundColor,
    "color": bodyCs.color,
  };

  function pickRoot() {
    if (opts.selector) {
      const el = document.querySelector(opts.selector);
      if (el) return el;
    }
    return document.body;
  }
  const root = pickRoot();

  // Compute a CSS-selector-like path that survives page reload. Used by the
  // multi-pass merger to identify the "same element" across independent runs
  // (each run reassigns hids / ids, but the DOM structure is stable).
  function stablePath(el) {
    if (!el || el === document.body) return "body";
    if (el === document.documentElement) return "html";
    const segs = [];
    let cur = el;
    let depth = 0;
    while (cur && cur !== document.body && cur !== document.documentElement && depth < 30) {
      let seg = cur.tagName.toLowerCase();
      if (cur.id) { seg = `${seg}#${cur.id}`; segs.unshift(seg); break; }
      const parent = cur.parentElement;
      if (parent) {
        const sibs = Array.from(parent.children).filter((c) => c.tagName === cur.tagName);
        if (sibs.length > 1) {
          const idx = sibs.indexOf(cur);
          seg += `:nth-of-type(${idx + 1})`;
        }
      }
      segs.unshift(seg);
      cur = parent;
      depth++;
    }
    return "body>" + segs.join(">");
  }

  // ── Shadow DOM piercing ──────────────────────────────────────────────────
  // Web Components with Shadow DOM encapsulate their styles and DOM. Our
  // CSSOM walk and outerHTML grab can't see inside them. We "pierce" each
  // shadow root by:
  //   1. Extracting its internal <style> rules → scoped to a unique wrapper
  //   2. Cloning the shadow DOM content into the light DOM
  //   3. Doing it recursively for nested shadows
  // This is destructive to the live page, but we run it right before
  // grabbing outerHTML so it doesn't matter.
  {
    let shadowIdx = 0;
    function pierceShadow(hostEl, depth) {
      if (depth > 5) return; // prevent infinite recursion
      const sr = hostEl.shadowRoot;
      if (!sr) return;

      const scopeId = `mx-shadow-${shadowIdx++}`;
      hostEl.setAttribute('data-mx-shadow', scopeId);

      // 1. Extract shadow styles and scope them to this host
      const shadowStyles = [];
      for (const styleEl of Array.from(sr.querySelectorAll('style'))) {
        let css = styleEl.textContent || '';
        if (!css.trim()) continue;
        // Replace :host selectors with our scoped selector
        css = css.replace(/:host\b(\([^)]*\))?/g, `[data-mx-shadow="${scopeId}"]`);
        // Scope bare selectors by prepending the host selector
        // (naive but catches most cases — complex selectors may need manual fix)
        shadowStyles.push(css);
      }
      // Also try to read shadow's adoptedStyleSheets (Constructable Stylesheets)
      try {
        if (sr.adoptedStyleSheets && sr.adoptedStyleSheets.length > 0) {
          for (const sheet of sr.adoptedStyleSheets) {
            try {
              const rules = Array.from(sheet.cssRules);
              let css = rules.map(r => r.cssText).join('\n');
              css = css.replace(/:host\b(\([^)]*\))?/g, `[data-mx-shadow="${scopeId}"]`);
              shadowStyles.push(css);
            } catch (e) {}
          }
        }
      } catch (e) {}

      // Push shadow styles into our atRulesText (they'll get emitted in the final HTML)
      for (const css of shadowStyles) {
        atRulesText.push(`/* Shadow DOM: ${scopeId} */\n${css}`);
      }

      // 2. Recurse into nested shadow roots first
      for (const child of Array.from(sr.querySelectorAll('*'))) {
        if (child.shadowRoot) pierceShadow(child, depth + 1);
      }

      // 3. Clone shadow content into light DOM, replacing the host's children
      // Preserve the host element itself (it may have light DOM classes/attrs
      // that CSS targets). We move shadow children into a wrapper inside it.
      const wrapper = document.createElement('div');
      wrapper.setAttribute('data-mx-shadow-content', scopeId);
      wrapper.style.cssText = 'display:contents'; // invisible wrapper

      // Move all shadow DOM children into the wrapper
      for (const child of Array.from(sr.childNodes)) {
        if (child.tagName === 'STYLE' || child.tagName === 'LINK') continue; // already extracted
        try {
          wrapper.appendChild(child.cloneNode(true));
        } catch (e) {}
      }

      // Clear the host's existing light DOM children and inject shadow content
      hostEl.innerHTML = '';
      hostEl.appendChild(wrapper);
    }

    // Find all elements with open shadow roots and pierce them
    const shadowHosts = [];
    function findShadowHosts(root) {
      for (const el of Array.from(root.querySelectorAll('*'))) {
        if (el.shadowRoot) shadowHosts.push(el);
        // Can't querySelectorAll inside shadow without first accessing it
        if (el.shadowRoot) {
          for (const child of Array.from(el.shadowRoot.querySelectorAll('*'))) {
            if (child.shadowRoot) shadowHosts.push(child);
          }
        }
      }
    }
    findShadowHosts(root);

    if (shadowHosts.length > 0) {
      tech.warnings.push(`Shadow DOM: ${shadowHosts.length} shadow root(s) pierced and flattened`);
      // Process deepest-first to handle nesting correctly
      for (const host of shadowHosts) {
        try { pierceShadow(host, 0); } catch (e) {}
      }
    }
  }

  // ── Inline assets: convert images to base64 data URIs for offline use ────
  if (opts.inlineAssets !== false) {
    const imgs = Array.from(root.querySelectorAll("img[src]"));
    for (const img of imgs) {
      try {
        const src = img.src;
        if (!src || src.startsWith("data:")) continue;
        const resp = await fetch(src);
        if (!resp.ok) continue;
        const blob = await resp.blob();
        const reader = new FileReader();
        const dataUrl = await new Promise((resolve) => {
          reader.onload = () => resolve(reader.result);
          reader.readAsDataURL(blob);
        });
        img.setAttribute("src", dataUrl);
      } catch (e) {}
    }
    const elsWithBg = Array.from(root.querySelectorAll("[style]"));
    for (const el of elsWithBg) {
      const bgImg = el.style.backgroundImage;
      if (!bgImg || !bgImg.includes("url(") || bgImg.includes("data:")) continue;
      const urlMatch = /url\(["']?(https?:\/\/[^"')]+)["']?\)/.exec(bgImg);
      if (!urlMatch) continue;
      try {
        const resp = await fetch(urlMatch[1]);
        if (!resp.ok) continue;
        const blob = await resp.blob();
        const reader = new FileReader();
        const dataUrl = await new Promise((resolve) => {
          reader.onload = () => resolve(reader.result);
          reader.readAsDataURL(blob);
        });
        el.style.backgroundImage = `url("${dataUrl}")`;
      } catch (e) {}
    }
  }

  // NOTE: Computed-style inline fallback was removed — it injected fixed
  // pixel values on hundreds of elements, overriding responsive CSS rules
  // and bloating the HTML. The raw <style> tag fallback (rawStyleFallbacks)
  // handles CSS-in-JS capture without these side effects.

  // ── Temporal sampler with per-element period detection ────────────────────
  const thorough = !!opts.thorough;
  const SAMPLE_PROPS = ["transform", "opacity", "filter", "backgroundPosition", "backgroundColor", "color", "clipPath"];
  const SAMPLE_PROPS_CSS = ["transform", "opacity", "filter", "background-position", "background-color", "color", "clip-path"];
  const MAX_ELEMENTS = thorough ? 600 : 300;
  const MAX_STOPS = thorough ? 120 : 60;

  // Canonicalize a transform value via DOMMatrix. Collapses equivalent forms
  // (`rotate(0)`, `rotate(360deg)`, `rotate(720deg)`, `translateX(0)`, `none`,
  // all resolve to the identity matrix). Crucial for deciding whether a
  // @keyframes rule cleanly loops — a spin 0→360 must NOT get `alternate`.
  function canonicalTransform(v) {
    if (!v || v === "none") return "I";
    try {
      const m = new DOMMatrix(v);
      const r = (n) => Math.round(n * 1e4) / 1e4;
      if (m.is2D) return "2d(" + [m.a, m.b, m.c, m.d, m.e, m.f].map(r).join(",") + ")";
      return "3d(" + [m.m11,m.m12,m.m13,m.m14,m.m21,m.m22,m.m23,m.m24,m.m31,m.m32,m.m33,m.m34,m.m41,m.m42,m.m43,m.m44].map(r).join(",") + ")";
    } catch (e) { return String(v); }
  }
  function canonicalNumber(v) {
    const n = Number(v);
    return isFinite(n) ? String(Math.round(n * 1e4) / 1e4) : String(v);
  }
  // Parse a keyframe cssText into a normalized string. Equal canonical forms
  // ⇔ visually identical stops. Handles transforms, opacity, and preserves
  // everything else verbatim.
  function canonicalStop(cssText) {
    if (!cssText) return "";
    const props = {};
    for (const decl of String(cssText).split(";")) {
      const idx = decl.indexOf(":");
      if (idx < 0) continue;
      const k = decl.slice(0, idx).trim().toLowerCase();
      const v = decl.slice(idx + 1).trim();
      if (!k) continue;
      if (k === "transform") props[k] = canonicalTransform(v);
      else if (k === "opacity") props[k] = canonicalNumber(v);
      else if (k === "filter" && (v === "none" || !v)) props[k] = "none";
      else props[k] = v.toLowerCase();
    }
    const keys = Object.keys(props).sort();
    return keys.map((k) => k + ":" + props[k]).join(";");
  }
  function stopsLoopCleanly(a, b) {
    if (!a || !b) return false;
    return canonicalStop(a) === canonicalStop(b);
  }

  // Fuzzy signature — rounds matrix numbers so tiny subpixel drift doesn't
  // break equality. Needed to detect when an animation returns to its start.
  function makeSig(raw) {
    const t = raw.transform === "none" ? "" : (raw.transform || "");
    const tR = t.replace(/-?[\d.]+/g, (n) => (Math.round(Number(n) * 4) / 4).toString());
    const op = (Math.round(Number(raw.opacity || 1) * 100) / 100).toString();
    const fl = raw.filter === "none" ? "" : (raw.filter || "");
    const cp = raw.clipPath === "none" ? "" : (raw.clipPath || "");
    return tR + "|" + op + "|" + fl + "|" + (raw.backgroundPosition || "") + "|" + (raw.backgroundColor || "") + "|" + (raw.color || "") + "|" + cp;
  }
  function snapshotEl(el) {
    const cs = getComputedStyle(el);
    const r = {};
    for (let p = 0; p < SAMPLE_PROPS.length; p++) r[SAMPLE_PROPS[p]] = cs[SAMPLE_PROPS[p]];
    r.__sig = makeSig(r);
    return r;
  }

  // Read the animation's own reported duration (WAAPI or CSS). This is the
  // source-of-truth period when available — much better than guessing.
  function getKnownDurationMs(el) {
    try {
      const anims = el.getAnimations();
      for (const a of anims) {
        const t = a.effect && a.effect.getComputedTiming();
        if (t && typeof t.duration === "number" && isFinite(t.duration) && t.duration > 0) return t.duration;
      }
    } catch (e) {}
    const cs = getComputedStyle(el);
    if (cs.animationName && cs.animationName !== "none") {
      const first = (cs.animationDuration || "").split(",")[0].trim();
      const m = /^([\d.]+)(m?s)$/.exec(first);
      if (m) return Number(m[1]) * (m[2] === "s" ? 1000 : 1);
    }
    return null;
  }

  // State at time t → lookup last snap whose __t <= t.
  function sigAtTime(snaps, t) {
    if (t < 0 || !snaps.length) return null;
    let last = null;
    for (let k = 0; k < snaps.length; k++) {
      if (snaps[k].__t <= t) last = snaps[k].__sig;
      else break;
    }
    return last;
  }
  // A candidate period P is real only if state at (t) matches state at (t+P)
  // for several interior points. Rejects "echo" returns like a multi-step anim
  // that passes through the initial state mid-cycle (which would otherwise be
  // mistaken for the full period and produce the rush effect).
  function verifyPeriod(snaps, candP, maxT) {
    const mids = [0.2, 0.4, 0.6, 0.8];
    for (let m = 0; m < mids.length; m++) {
      const t1 = candP * mids[m];
      const t2 = candP * (1 + mids[m]);
      if (t2 > maxT + 10) return false;
      const a = sigAtTime(snaps, t1);
      const b = sigAtTime(snaps, t2);
      if (a == null || b == null || a !== b) return false;
    }
    return true;
  }
  function detectPeriod(snaps) {
    if (snaps.length < 2) return null;
    const s0 = snaps[0];
    const maxT = snaps[snaps.length - 1].__t;
    for (let j = 1; j < snaps.length; j++) {
      if (snaps[j].__t < 200) continue;
      if (snaps[j].__sig !== s0.__sig) continue;
      const candP = snaps[j].__t;
      if (candP * 1.8 > maxT) return null; // not enough data left to verify
      let varied = false;
      for (let k = 1; k < j; k++) { if (snaps[k].__sig !== s0.__sig) { varied = true; break; } }
      if (!varied) continue;
      if (verifyPeriod(snaps, candP, maxT)) return candP;
    }
    return null;
  }
  // True if a @keyframes rule returns to its start state (spinning, pulsing).
  // False for one-shots (fade-in, slide-in) — we'll need `alternate` to loop.
  // Uses canonical comparison so `rotate(0) → rotate(360deg)` counts as looping.
  function isKeyframesLooping(name) {
    const kf = keyframes[name];
    if (!kf || kf.length < 2) return false;
    let first = null, last = null;
    for (const stop of kf) {
      const kt = (stop.keyText || "").toLowerCase();
      if (kt === "0%" || kt === "from") first = stop;
      if (kt === "100%" || kt === "to") last = stop;
    }
    if (!first || !last) return false;
    return stopsLoopCleanly(first.cssText, last.cssText);
  }

  const allEls = Array.from(root.querySelectorAll("*")).slice(0, MAX_ELEMENTS);

  // Low-rate probe phase: sample every 100ms for 2s (or 4s thorough).
  // Catches delayed-start animations, scroll-timeline scrubs, staggered
  // intros — anything that hasn't fired yet during the first few hundred ms.
  const probeIntervalMs = 100;
  const probeDurationMs = thorough ? 4000 : 2000;
  const probeSigs = new Map(allEls.map((el) => [el, new Set()]));
  {
    const probeEnd = performance.now() + probeDurationMs;
    while (performance.now() < probeEnd) {
      for (const el of allEls) probeSigs.get(el).add(snapshotEl(el).__sig);
      await sleep(probeIntervalMs);
    }
  }
  let candidates = [];
  for (const el of allEls) {
    if (probeSigs.get(el).size > 1) candidates.push(el);
  }
  if (candidates.length > MAX_ELEMENTS) {
    tech.warnings.push(`too many animated elements (${candidates.length}), sampling first ${MAX_ELEMENTS}`);
    candidates = candidates.slice(0, MAX_ELEMENTS);
  }

  // Figure out needed sampling duration: max of known durations + buffer,
  // capped. We want to witness at least one full cycle of the slowest anim.
  const knownDur = new Map();
  for (const el of candidates) {
    const d = getKnownDurationMs(el);
    if (d) knownDur.set(el, d);
  }
  const defaultSamplingMs = thorough ? 12000 : 4000;
  const samplingCap = thorough ? 15000 : 6000;
  let samplingMs = opts.samplingMs != null ? opts.samplingMs : defaultSamplingMs;
  if (!thorough && (tech.gsap || tech.framerMotion || tech.anime)) samplingMs = Math.max(samplingMs, 5000);
  // Sampling must last at least 2× the longest known period so verifyPeriod()
  // has enough data on the far side of t+P to compare against.
  for (const d of knownDur.values()) samplingMs = Math.max(samplingMs, Math.min(d * 2.2 + 150, samplingCap));

  // Detect canvas elements for frame capture during sampling.
  const canvasEls = Array.from(root.querySelectorAll("canvas"));
  const canvasRecordings = canvasEls.map((c) => {
    const r = c.getBoundingClientRect();
    return { width: c.width || Math.round(r.width), height: c.height || Math.round(r.height), frames: [] };
  });
  const CANVAS_CAPTURE_INTERVAL = thorough ? 33 : 66; // ~30fps thorough, ~15fps normal

  // Sample candidates at rAF + capture canvas frames in parallel.
  const sampled = new Map(candidates.map((el) => [el, []]));
  {
    const startTs = performance.now();
    let lastCanvasT = -CANVAS_CAPTURE_INTERVAL;
    const needsSampling = candidates.length > 0 || canvasEls.length > 0;
    if (needsSampling) {
      await new Promise((resolve) => {
        const tick = () => {
          const t = performance.now() - startTs;
          for (const el of candidates) {
            const snap = snapshotEl(el);
            snap.__t = t;
            const list = sampled.get(el);
            const last = list[list.length - 1];
            if (!last || last.__sig !== snap.__sig) list.push(snap);
          }
          // Capture canvas frames at lower rate (~10fps).
          if (t - lastCanvasT >= CANVAS_CAPTURE_INTERVAL) {
            lastCanvasT = t;
            for (let ci = 0; ci < canvasEls.length; ci++) {
              try {
                const dataUrl = canvasEls[ci].toDataURL("image/jpeg", 0.65);
                if (dataUrl && dataUrl.length > 100) canvasRecordings[ci].frames.push(dataUrl);
              } catch (e) { /* tainted canvas */ }
            }
          }
          if (t < samplingMs) requestAnimationFrame(tick);
          else resolve();
        };
        requestAnimationFrame(tick);
      });
    }
  }

  // Track per-element animation metadata for the multi-pass merger. Each entry
  // ties a CSS-selector-based path (stable across reloads) to the keyframes +
  // quality signal of the animation we emitted for it.
  const animationBindings = [];
  function recordBinding(el, selector, keyframeNames, stopCount, isLoopClean, periodMs, source) {
    if (!el) return;
    try {
      animationBindings.push({
        path: stablePath(el),
        selector,
        keyframeNames: Array.isArray(keyframeNames) ? keyframeNames.slice() : [keyframeNames],
        stopCount: stopCount || 0,
        isLoopClean: !!isLoopClean,
        periodMs: Math.round(periodMs || 0),
        source: source || "unknown",
      });
    } catch (e) {}
  }

  // Build @keyframes + binding rules, element by element.
  let sampledIdx = 0;
  const sampledElements = new Set();
  for (const [el, snaps] of sampled.entries()) {
    if (snaps.length < 2) continue;

    // If the element is driven by a CSS animation whose @keyframes we
    // already captured, trust the source — our sampled approximation would
    // override the original declaration and replace it with a discretized,
    // period-detected reconstruction. The original is always better.
    try {
      const cs = getComputedStyle(el);
      const an = cs.animationName;
      if (an && an !== "none") {
        const names = an.split(",").map((n) => n.trim()).filter(Boolean);
        if (names.every((n) => keyframes[n])) continue;
      }
    } catch (e) {}

    // Determine period: verified sampling first (source-of-truth for
    // timelines & rAF libs that WAAPI mis-reports), known duration as
    // fallback, last-change time for one-shots, full sampling window as
    // absolute last resort.
    let periodMs = detectPeriod(snaps);
    if (!periodMs) periodMs = knownDur.get(el);
    const isLoopClean = !!periodMs;
    if (!periodMs) {
      // One-shot motion (fade-in, slide-in): cut at the last sig change so
      // the animation plays at its real speed, not stretched to samplingMs.
      let lastChangeMs = 0;
      for (const s of snaps) if (s.__t > lastChangeMs) lastChangeMs = s.__t;
      periodMs = Math.max(500, lastChangeMs);
    }

    // Trim samples to the period window.
    let frames = snaps.filter((s) => s.__t <= periodMs + 20);
    if (frames.length < 2) frames = snaps.slice();

    // Normalize offsets to [0, 1].
    frames = frames.map((s) => ({ ...s, __offset: Math.max(0, Math.min(1, s.__t / periodMs)) }));

    // Subsample to <= MAX_STOPS.
    if (frames.length > MAX_STOPS) {
      const step = (frames.length - 1) / (MAX_STOPS - 1);
      const reduced = [];
      for (let k = 0; k < MAX_STOPS; k++) reduced.push(frames[Math.round(k * step)]);
      frames = reduced;
    }

    // Bookend 0% and 100%. For clean loops, the end must equal the start so
    // the loop is seamless. Otherwise mirror the last frame.
    if (frames[0].__offset > 0.001) frames.unshift({ ...frames[0], __offset: 0 });
    if (frames[frames.length - 1].__offset < 0.999) {
      const closer = isLoopClean ? { ...frames[0], __offset: 1 } : { ...frames[frames.length - 1], __offset: 1 };
      frames.push(closer);
    } else if (isLoopClean) {
      frames[frames.length - 1] = { ...frames[0], __offset: 1 };
    }

    const name = `__mx_s${sampledIdx++}`;
    keyframes[name] = frames.map((s) => {
      const parts = [];
      for (let p = 0; p < SAMPLE_PROPS.length; p++) {
        const v = s[SAMPLE_PROPS[p]];
        // Skip defaults that would override inherited styles and clutter.
        if (!v || v === "none" || v === "normal" || v === "auto") continue;
        parts.push(`${SAMPLE_PROPS_CSS[p]}:${v}`);
      }
      return { keyText: `${(s.__offset * 100).toFixed(2)}%`, cssText: parts.join(";") };
    });

    let mxId = el.getAttribute("data-mx-id");
    if (!mxId) { mxId = `s${sampledIdx}`; el.setAttribute("data-mx-id", mxId); }
    // If we couldn't verify a clean loop (start ≠ end after bookending),
    // alternate the direction — the motion oscillates A↔B instead of
    // teleporting at the boundary.
    const dirKw = isLoopClean ? "" : "alternate ";
    const sampledSel = `[data-mx-id="${CSS.escape(mxId)}"]`;
    cssRules.push({
      selector: sampledSel,
      cssText: `animation: ${name} ${Math.round(periodMs)}ms linear infinite ${dirKw}!important`,
    });
    recordBinding(el, sampledSel, name, frames.length, isLoopClean, periodMs, "sampler");
    sampledElements.add(el);
  }

  // ── Walk the root subtree for node metadata + WAAPI fallback ──────────────
  const IMPORTANT = [
    "background","background-color","background-image","color",
    "font-family","font-size","font-weight","line-height","letter-spacing",
    "text-align","text-transform",
    "display","grid-template-areas","grid-template-columns","grid-template-rows",
    "grid-area","grid-column","grid-row","flex-direction","align-items","justify-content","gap",
    "width","height","min-width","min-height","max-width","max-height","aspect-ratio",
    "margin","margin-top","margin-right","margin-bottom","margin-left",
    "padding","padding-top","padding-right","padding-bottom","padding-left",
    "position","top","left","right","bottom","inset","z-index",
    "border","border-radius","border-width","border-color","border-style",
    "box-sizing","overflow","overflow-x","overflow-y","opacity","visibility",
    "transform","transform-origin","transform-style","perspective",
    "animation","animation-name","animation-duration","animation-timing-function",
    "animation-delay","animation-iteration-count","animation-direction","animation-fill-mode",
    "clip-path","mask","mask-image","filter","backdrop-filter",
    "will-change","mix-blend-mode",
  ];
  const SKIP_VALUES = new Set(["none", "auto", "normal", "0px", "rgba(0, 0, 0, 0)", "static", "visible"]);
  const camelToKebab = (s) => s.replace(/[A-Z]/g, (m) => "-" + m.toLowerCase());

  const synthAnimsByMxId = new Map();
  const synthRefsByMxId = new Map();
  const synthIsLoopingByMxId = new Map();
  const synthTotalStopsByMxId = new Map();

  const nodes = [];
  const walk = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT, null);
  let el = walk.currentNode;
  let i = 0;
  while (el) {
    const cs = getComputedStyle(el);
    const styles = {};
    for (const p of IMPORTANT) {
      const v = cs.getPropertyValue(p);
      if (v && !SKIP_VALUES.has(v)) styles[p] = v.trim();
    }
    const vars = {};
    for (const s of Array.from(el.style)) {
      if (s.startsWith("--")) vars[s] = el.style.getPropertyValue(s).trim();
    }
    const anims = [];
    try {
      let animIdx = 0;
      const covered = sampledElements.has(el);
      for (const a of el.getAnimations()) {
        const eff = a.effect;
        if (!eff) continue;
        const t = eff.getComputedTiming();
        const kfs = typeof eff.getKeyframes === "function" ? eff.getKeyframes() : [];
        anims.push({
          animationName: a.animationName || null,
          id: a.id || null,
          timing: {
            duration: t.duration, delay: t.delay, endDelay: t.endDelay,
            iterations: t.iterations, iterationStart: t.iterationStart,
            direction: t.direction, easing: t.easing, fill: t.fill,
          },
          keyframes: kfs.map((k) => ({ ...k })),
        });
        if (covered) { animIdx++; continue; }
        const hasCssKeyframes = a.animationName && keyframes[a.animationName];
        if (!hasCssKeyframes && kfs.length > 0 && typeof t.duration === "number" && t.duration > 0) {
          const kfName = `__mx_w${i}_${animIdx}`;
          const stops = kfs.map((kf) => {
            const off = kf.offset != null ? kf.offset : (kf.computedOffset != null ? kf.computedOffset : 0);
            const pct = `${(Math.max(0, Math.min(1, off)) * 100).toFixed(2)}%`;
            const cssText = Object.entries(kf)
              .filter(([k, v]) => v != null && !["offset", "computedOffset", "easing"].includes(k))
              .map(([k, v]) => `${camelToKebab(k)}:${v}`)
              .join(";");
            return { keyText: pct, cssText };
          });
          keyframes[kfName] = stops;
          let mxId = el.getAttribute("data-mx-id");
          if (!mxId) { mxId = `w${i}`; el.setAttribute("data-mx-id", mxId); }
          const del = t.delay || 0;
          const fill = t.fill && t.fill !== "auto" ? t.fill : "both";
          const easing = t.easing || "linear";
          // If start != end (fade-in, slide-in), forcing iterations=infinite
          // with the original direction would teleport — use alternate.
          const isLooping = stops.length >= 2 && stopsLoopCleanly(stops[0].cssText, stops[stops.length - 1].cssText);
          const dir = isLooping ? (t.direction || "normal") : "alternate";
          const spec = `${Math.round(t.duration)}ms ${easing} ${del}ms infinite ${dir} ${fill} ${kfName}`;
          const bucket = synthAnimsByMxId.get(mxId) || [];
          bucket.push(spec);
          synthAnimsByMxId.set(mxId, bucket);
          synthRefsByMxId.set(mxId, el);
          synthIsLoopingByMxId.set(mxId, (synthIsLoopingByMxId.get(mxId) !== false) && isLooping);
          synthTotalStopsByMxId.set(mxId, (synthTotalStopsByMxId.get(mxId) || 0) + stops.length);
        }
        animIdx++;
      }
    } catch (e) {}

    const an = cs.animationName;
    if (an && an !== "none" && !el.getAttribute("data-mx-id")) {
      el.setAttribute("data-mx-css-anim", "");
      const names = an.split(",").map((n) => n.trim()).filter(Boolean);
      const allNonLoop = names.length > 0 && names.every((n) => !isKeyframesLooping(n));
      const iter = cs.animationIterationCount || "";
      const iterList = iter.split(",").map((s) => s.trim());
      const allInfinite = iterList.length > 0 && iterList.every((i) => i === "infinite");

      if (allInfinite) {
        if (allNonLoop) el.setAttribute("data-mx-alt", "");
      } else if (allNonLoop) {
        el.setAttribute("data-mx-css-oneshot", "");
      } else {
        el.setAttribute("data-mx-force-loop", "");
      }

      // Per-element slowdown: multiply each source animation-duration by the
      // slowdown factor so ratios between anims are preserved (a 2x-longer
      // anim stays 2x longer). Short intros become visible instead of
      // appearing static at their original sub-100ms timings.
      const slowdown = typeof opts.slowdown === "number" && opts.slowdown > 0 ? opts.slowdown : 1;
      if (slowdown !== 1) {
        const durStrs = (cs.animationDuration || "").split(",").map((s) => s.trim()).filter(Boolean);
        if (durStrs.length > 0) {
          const slowed = durStrs.map((d) => {
            const m = /^([\d.]+)(m?s)$/.exec(d);
            if (!m) return d;
            const ms = Number(m[1]) * (m[2] === "s" ? 1000 : 1);
            return Math.round(ms * slowdown) + "ms";
          });
          let mxIdCss = el.getAttribute("data-mx-id");
          if (!mxIdCss) {
            mxIdCss = `css_${i}`;
            el.setAttribute("data-mx-id", mxIdCss);
          }
          cssRules.push({
            selector: `[data-mx-id="${CSS.escape(mxIdCss)}"]`,
            cssText: `animation-duration: ${slowed.join(", ")} !important`,
          });
        }
      }
    }

    nodes.push({
      i,
      tag: el.tagName.toLowerCase(),
      cls: typeof el.className === "string" ? el.className : null,
      attrs: Array.from(el.attributes || [])
        .filter((a) => a.name !== "style" && a.name !== "class")
        .reduce((o, a) => { o[a.name] = a.value; return o; }, {}),
      styles,
      vars: Object.keys(vars).length ? vars : undefined,
      animations: anims.length ? anims : undefined,
    });
    el = walk.nextNode();
    i++;
  }

  for (const [mxId, specs] of synthAnimsByMxId.entries()) {
    const synthSel = `[data-mx-id="${CSS.escape(mxId)}"]`;
    cssRules.push({
      selector: synthSel,
      cssText: `animation: ${specs.join(", ")} !important`,
    });
    const refEl = synthRefsByMxId.get(mxId);
    if (refEl) {
      recordBinding(
        refEl, synthSel,
        specs.map((s) => (s.match(/__mx_w\S+/) || [""])[0]).filter(Boolean),
        synthTotalStopsByMxId.get(mxId) || 0,
        !!synthIsLoopingByMxId.get(mxId),
        0,
        "waapi-synth"
      );
    }
  }
  cssRules.push({
    selector: "[data-mx-alt]",
    cssText: "animation-direction: alternate !important",
  });
  // Naturally-looping one-shot keyframes (spin, pulse) get force-looped so
  // the preview shows continuous motion.
  cssRules.push({
    selector: "[data-mx-force-loop]",
    cssText: "animation-iteration-count: infinite !important; animation-fill-mode: both !important",
  });
  // Non-looping one-shots (fade-in, slide-in): loop at source duration with
  // alternate → each anim keeps its own declared timing, the oscillation
  // just avoids the teleport back to 0%.
  cssRules.push({
    selector: "[data-mx-css-oneshot]",
    cssText: "animation-iteration-count: infinite !important; animation-fill-mode: both !important; animation-direction: alternate !important",
  });
  // Force running universally — pages that set inline
  // `animation-play-state: paused` waiting for JS to trigger play would
  // otherwise keep elements frozen in the clone.
  cssRules.push({
    selector: "*",
    cssText: "animation-play-state: running !important",
  });

  // ── Hooked-recording analyzer ────────────────────────────────────────────
  // Data accumulated since page load by lib/hooks.js:
  //   • Every `Element.prototype.animate()` call with declared keyframes/opts
  //   • Every `style`/`class` mutation snapshot with performance.now() stamp
  // Emitted LAST → overrides sampler/WAAPI-fallback rules for same elements.
  let recording = { mutations: [], animateCalls: [] };
  try {
    if (window.__mxR) {
      if (window.__mxR.observer) { try { window.__mxR.observer.disconnect(); } catch (e) {} }
      recording.mutations = window.__mxR.mutations || [];
      recording.animateCalls = window.__mxR.animateCalls || [];
    }
  } catch (e) {}

  // Process .animate() calls: exact declared keyframes → @keyframes rule.
  // Group by hid and keep the LONGEST duration call per element. Springy libs
  // (Framer Motion) create many tiny intermediate tweens (30-80ms) to build up
  // a spring; the meaningful "steady-state" animation is the longest one.
  // Shorter ones looped infinitely would just flicker.
  let animateProcessed = 0;
  const coveredHids = new Set();
  // Pick one call per hid. Preference order:
  //   1. iterations === null (JSON-round-trip of Infinity → that's a real loop)
  //   2. longer duration (more likely to be the meaningful animation, not a
  //      transition increment)
  const callsByHid = new Map();
  for (const call of recording.animateCalls) {
    if (!call.hid || !call.keyframes || !Array.isArray(call.keyframes) || call.keyframes.length < 1) continue;
    const opts0 = call.options || {};
    const dur = typeof opts0 === "number" ? opts0 : (opts0.duration != null ? opts0.duration : null);
    if (typeof dur !== "number" || dur < 200) continue;
    const isInf = opts0 && opts0.iterations === null;
    const existing = callsByHid.get(call.hid);
    if (!existing) { callsByHid.set(call.hid, call); continue; }
    const eOpts = existing.options || {};
    const eDur = typeof eOpts === "number" ? eOpts : (eOpts.duration || 0);
    const eIsInf = eOpts && eOpts.iterations === null;
    if (isInf && !eIsInf) callsByHid.set(call.hid, call);
    else if (!isInf && eIsInf) { /* keep existing */ }
    else if (dur > eDur) callsByHid.set(call.hid, call);
  }
  for (const [hid, call] of callsByHid.entries()) {
    const kfs = call.keyframes;
    const opts0 = call.options || {};
    const dur = typeof opts0 === "number" ? opts0 : opts0.duration;

    const stops = kfs.map((kf, idx) => {
      const offset = kf.offset != null ? kf.offset : (idx / Math.max(1, kfs.length - 1));
      const pct = `${(Math.max(0, Math.min(1, offset)) * 100).toFixed(2)}%`;
      const cssText = Object.entries(kf)
        .filter(([k, v]) => v != null && !["offset", "easing", "composite"].includes(k))
        .map(([k, v]) => `${camelToKebab(k)}:${v}`)
        .join(";");
      return { keyText: pct, cssText };
    });

    const name = `__mx_a${hid}`;
    keyframes[name] = stops;
    const del = opts0.delay && opts0.delay > 0 ? opts0.delay : 0;
    const easing = opts0.easing || "linear";
    const isLooping = stops.length >= 2 && stopsLoopCleanly(stops[0].cssText, stops[stops.length - 1].cssText);
    const dir = isLooping ? (opts0.direction || "normal") : "alternate";
    const spec = `${name} ${Math.round(dur)}ms ${easing} ${Math.round(del)}ms infinite ${dir}`;
    const aSel = `[data-mx-hid="${hid}"]`;
    cssRules.push({ selector: aSel, cssText: `animation: ${spec} !important` });
    try {
      const aEl = document.querySelector(aSel);
      if (aEl) recordBinding(aEl, aSel, name, stops.length, isLooping, dur, "animate-hook");
    } catch (e) {}
    coveredHids.add(hid);
    animateProcessed++;
  }

  // Process mutation timelines: per-hid, rebuild the state history from the
  // MO-recorded (t, sig) pairs, detect period, emit seamless keyframes.
  function mutSig(m) {
    const t = m.transform === "none" ? "" : (m.transform || "");
    const tR = t.replace(/-?[\d.]+/g, (n) => (Math.round(Number(n) * 4) / 4).toString());
    const op = (Math.round(Number(m.opacity || 1) * 100) / 100).toString();
    const fl = m.filter === "none" ? "" : (m.filter || "");
    const cp = m.clipPath === "none" ? "" : (m.clipPath || "");
    return tR + "|" + op + "|" + fl + "|" + (m.bgPos || "") + "|" + (m.bgColor || "") + "|" + (m.color || "") + "|" + cp;
  }
  function sigAtT(entries, t) {
    let last = null;
    for (const e of entries) { if (e.__t <= t) last = e.__sig; else break; }
    return last;
  }

  const mutByHid = new Map();
  for (const m of recording.mutations) {
    if (!m.hid) continue;
    const list = mutByHid.get(m.hid) || [];
    list.push(m);
    mutByHid.set(m.hid, list);
  }

  // Elements the rAF sampler already handled — trust it over the mutation
  // analyzer. The sampler has constant rAF density; mutations can come in
  // bursts (MO callback batching) that fool period detection.
  const sampledHids = new Set();
  for (const el of sampledElements) {
    const h = el.getAttribute && el.getAttribute("data-mx-hid");
    if (h) sampledHids.add(h);
  }

  let mutationsProcessed = 0;
  for (const [hid, muts] of mutByHid.entries()) {
    if (coveredHids.has(hid)) continue;
    if (sampledHids.has(hid)) continue;
    if (muts.length < 2) continue;

    const enriched = muts.map((m) => ({ ...m, __sig: mutSig(m) }));
    const deduped = [enriched[0]];
    for (let j = 1; j < enriched.length; j++) {
      if (enriched[j].__sig !== deduped[deduped.length - 1].__sig) deduped.push(enriched[j]);
    }
    if (deduped.length < 2) continue;

    const t0 = deduped[0].t;
    const tMax = deduped[deduped.length - 1].t;
    const totalMs = tMax - t0;
    // Reject bursts — mutations that all landed in one MO batch don't give us
    // enough time spread to reliably infer a period. 500ms is the minimum
    // useful window (≥ ~30 frames at 60fps).
    if (totalMs < 500) continue;

    const entries = deduped.map((d) => ({ ...d, __t: d.t - t0 }));

    // Period detection with midpoint verification.
    let periodMs = null;
    const s0Sig = entries[0].__sig;
    for (let j = 1; j < entries.length; j++) {
      if (entries[j].__t < 200) continue;
      if (entries[j].__sig !== s0Sig) continue;
      const candP = entries[j].__t;
      if (candP * 1.8 > totalMs) break;
      let varied = false;
      for (let k = 1; k < j; k++) { if (entries[k].__sig !== s0Sig) { varied = true; break; } }
      if (!varied) continue;
      const mids = [0.25, 0.5, 0.75];
      let ok = true;
      for (const f of mids) {
        const a = sigAtT(entries, candP * f);
        const b = sigAtT(entries, candP * (1 + f));
        if (!a || !b || a !== b) { ok = false; break; }
      }
      if (ok) { periodMs = candP; break; }
    }
    const isLoopClean = !!periodMs;
    if (!periodMs) periodMs = totalMs;

    let frames = entries.filter((s) => s.__t <= periodMs + 20);
    if (frames.length < 2) frames = entries.slice();
    frames = frames.map((s) => ({ ...s, __offset: Math.max(0, Math.min(1, s.__t / periodMs)) }));

    if (frames.length > MAX_STOPS) {
      const step = (frames.length - 1) / (MAX_STOPS - 1);
      const reduced = [];
      for (let k = 0; k < MAX_STOPS; k++) reduced.push(frames[Math.round(k * step)]);
      frames = reduced;
    }

    if (frames[0].__offset > 0.001) frames.unshift({ ...frames[0], __offset: 0 });
    if (frames[frames.length - 1].__offset < 0.999) {
      const closer = isLoopClean ? { ...frames[0], __offset: 1 } : { ...frames[frames.length - 1], __offset: 1 };
      frames.push(closer);
    } else if (isLoopClean) {
      frames[frames.length - 1] = { ...frames[0], __offset: 1 };
    }

    const name = `__mx_m${hid}`;
    keyframes[name] = frames.map((s) => {
      const parts = [];
      if (s.transform) parts.push(`transform:${s.transform}`);
      if (s.opacity) parts.push(`opacity:${s.opacity}`);
      if (s.filter) parts.push(`filter:${s.filter}`);
      if (s.bgPos) parts.push(`background-position:${s.bgPos}`);
      if (s.bgColor) parts.push(`background-color:${s.bgColor}`);
      if (s.color) parts.push(`color:${s.color}`);
      if (s.clipPath) parts.push(`clip-path:${s.clipPath}`);
      return { keyText: `${(s.__offset * 100).toFixed(2)}%`, cssText: parts.join(";") };
    });

    const dirKw = isLoopClean ? "" : "alternate ";
    const mSel = `[data-mx-hid="${hid}"]`;
    cssRules.push({
      selector: mSel,
      cssText: `animation: ${name} ${Math.round(periodMs)}ms linear infinite ${dirKw}!important`,
    });
    try {
      const mEl = document.querySelector(mSel);
      if (mEl) recordBinding(mEl, mSel, name, frames.length, isLoopClean, periodMs, "mutation-analyzer");
    } catch (e) {}
    coveredHids.add(hid);
    mutationsProcessed++;
  }

  // Replace <canvas> elements: flipbook placeholder if we have frames,
  // static screenshot if possible, or remove entirely.
  // Also catch ALL canvases on the page (not just the ones we tracked for
  // recording) — some may have been added dynamically after our initial scan.
  const allCanvases = Array.from(root.querySelectorAll("canvas"));
  for (const c of allCanvases) {
    // Check if this canvas has a recording with frames.
    const ci = canvasEls.indexOf(c);
    const hasFrames = ci >= 0 && canvasRecordings[ci] && canvasRecordings[ci].frames.length >= 2;

    // Detect decorative/overlay canvases: absolutely positioned canvases
    // that cover their parent are background decorations (animated shapes,
    // particles, gradients). Their low-FPS flipbook looks worse than nothing.
    // Detect decorative/overlay canvases: absolutely positioned, or with
    // overlay classes (inset-0, w-full h-full, etc.), or covering most of
    // their parent. Their low-FPS flipbook looks worse than nothing.
    let isOverlay = false;
    try {
      const cs = getComputedStyle(c);
      const pos = cs.position;
      const cls = (c.className || '').toString();
      // Check by class names (Tailwind patterns)
      if (/\b(inset-0|absolute|fixed)\b/.test(cls) && /\b(w-full|h-full)\b/.test(cls)) {
        isOverlay = true;
      }
      // Check by computed position + size
      if (!isOverlay && (pos === 'absolute' || pos === 'fixed')) {
        const pRect = c.parentElement ? c.parentElement.getBoundingClientRect() : null;
        const cRect = c.getBoundingClientRect();
        if (pRect && cRect.width >= pRect.width * 0.7 && cRect.height >= pRect.height * 0.7) {
          isOverlay = true;
        }
      }
    } catch (e) {}

    if (hasFrames && !isOverlay) {
      // Replace with flipbook placeholder.
      try {
        const rec = canvasRecordings[ci];
        const div = document.createElement("div");
        div.setAttribute("data-mx-canvas", String(ci));
        div.style.cssText = `width:${rec.width}px;height:${rec.height}px;position:relative;overflow:hidden`;
        c.parentNode.replaceChild(div, c);
      } catch (e) { try { c.remove(); } catch(e2) {} }
    } else {
      // No flipbook — try a static screenshot, or replace with an
      // invisible spacer that preserves the layout dimensions.
      let replaced = false;
      try {
        const dataUrl = c.toDataURL("image/png");
        if (dataUrl && dataUrl.length > 200) {
          const img = document.createElement("img");
          img.src = dataUrl;
          const r = c.getBoundingClientRect();
          img.style.width = (r.width || c.width) + "px";
          img.style.height = (r.height || c.height) + "px";
          c.parentNode.replaceChild(img, c);
          replaced = true;
        }
      } catch (e) {}
      if (!replaced) {
        // Replace with invisible spacer — no classes, no positioning.
        const spacer = document.createElement("div");
        spacer.setAttribute("aria-hidden", "true");
        spacer.style.cssText = "display:none";
        try { c.parentNode.replaceChild(spacer, c); } catch(e) {}
      }
    }
  }

  // ── Replace <video> with poster frame for offline capture ─────────────────
  // Videos can't play in an offline HTML clone. We capture the current frame
  // (via a canvas draw) or the poster attribute and replace with an <img>.
  const videos = Array.from(root.querySelectorAll("video"));
  for (const video of videos) {
    try {
      let posterUrl = null;
      // Try to capture the current video frame via canvas.
      if (video.readyState >= 2 && video.videoWidth > 0) {
        const cvs = document.createElement("canvas");
        cvs.width = video.videoWidth;
        cvs.height = video.videoHeight;
        const ctx = cvs.getContext("2d");
        ctx.drawImage(video, 0, 0);
        posterUrl = cvs.toDataURL("image/jpeg", 0.8);
      }
      // Fall back to the poster attribute.
      if (!posterUrl || posterUrl.length < 100) {
        const posterAttr = video.getAttribute("poster");
        if (posterAttr) {
          try {
            const pSrc = posterAttr.startsWith("http") || posterAttr.startsWith("data:") || posterAttr.startsWith("//")
              ? posterAttr : new URL(posterAttr, location.href).href;
            const resp = await fetch(pSrc);
            if (resp.ok) {
              const blob = await resp.blob();
              const reader = new FileReader();
              posterUrl = await new Promise((resolve) => {
                reader.onload = () => resolve(reader.result);
                reader.readAsDataURL(blob);
              });
            }
          } catch (e) {}
        }
      }
      if (posterUrl && posterUrl.length > 100) {
        const img = document.createElement("img");
        img.src = posterUrl;
        img.alt = "video frame";
        // Preserve dimensions & positioning.
        const r = video.getBoundingClientRect();
        img.style.width = video.style.width || (r.width + "px");
        img.style.height = video.style.height || (r.height + "px");
        img.style.objectFit = "cover";
        img.style.display = "block";
        // Copy classes and data attributes.
        for (const attr of Array.from(video.attributes)) {
          if (['src', 'poster', 'autoplay', 'muted', 'loop', 'controls', 'preload', 'playsinline'].includes(attr.name)) continue;
          try { img.setAttribute(attr.name, attr.value); } catch (e) {}
        }
        video.parentNode.replaceChild(img, video);
      }
    } catch (e) {}
  }

  // ── Design tokens: extract the site's visual DNA ──────────────────────────
  // Scans all elements for colors, fonts, spacing, radius, shadows, gradients.
  // Used by the AI section generator to produce new content that matches the
  // site's look & feel.
  const tokenSets = {
    colors: new Set(), fonts: new Set(), fontSizes: new Set(),
    fontWeights: new Set(), borderRadius: new Set(), spacing: new Set(),
    shadows: new Set(), gradients: new Set(), lineHeights: new Set(),
    letterSpacings: new Set(),
  };
  const tokenSkipColors = new Set(["rgba(0, 0, 0, 0)", "rgb(0, 0, 0)", "transparent"]);
  try {
    for (const el of Array.from(root.querySelectorAll("*")).slice(0, 500)) {
      const cs = getComputedStyle(el);
      if (cs.color && !tokenSkipColors.has(cs.color)) tokenSets.colors.add(cs.color);
      if (cs.backgroundColor && !tokenSkipColors.has(cs.backgroundColor)) tokenSets.colors.add(cs.backgroundColor);
      if (cs.borderTopColor && !tokenSkipColors.has(cs.borderTopColor)) tokenSets.colors.add(cs.borderTopColor);
      if (cs.fontFamily) tokenSets.fonts.add(cs.fontFamily);
      if (cs.fontSize) tokenSets.fontSizes.add(cs.fontSize);
      if (cs.fontWeight && cs.fontWeight !== "400") tokenSets.fontWeights.add(cs.fontWeight);
      if (cs.borderRadius && cs.borderRadius !== "0px") tokenSets.borderRadius.add(cs.borderRadius);
      if (cs.gap && cs.gap !== "normal" && cs.gap !== "0px") tokenSets.spacing.add(cs.gap);
      const paddings = [cs.paddingTop, cs.paddingRight, cs.paddingBottom, cs.paddingLeft].filter((v) => v && v !== "0px");
      paddings.forEach((v) => tokenSets.spacing.add(v));
      if (cs.boxShadow && cs.boxShadow !== "none") tokenSets.shadows.add(cs.boxShadow);
      if (cs.backgroundImage && cs.backgroundImage.includes("gradient")) tokenSets.gradients.add(cs.backgroundImage);
      if (cs.lineHeight && cs.lineHeight !== "normal") tokenSets.lineHeights.add(cs.lineHeight);
      if (cs.letterSpacing && cs.letterSpacing !== "normal" && cs.letterSpacing !== "0px") tokenSets.letterSpacings.add(cs.letterSpacing);
    }
  } catch (e) {}
  const designTokens = {};
  for (const [k, v] of Object.entries(tokenSets)) designTokens[k] = Array.from(v).slice(0, 30);

  // ── Strip fixed viewport-width inline styles from top-level containers ──
  // Frameworks, hydration, and our own computed-style fallback can bake
  // "width:1440px" into inline styles on wrapper divs. These must stay
  // fluid for the capture to reflow at any viewport size. We only strip
  // from the root and its first 2 levels of children — deeper elements
  // may legitimately have fixed widths (cards, modals, avatars, etc.).
  {
    const vw = window.innerWidth;
    function stripFixedWidth(el, depth) {
      if (depth > 2) return;
      if (!el || !el.style) return;
      // Strip width/max-width that matches or exceeds the capture viewport.
      const w = el.style.width;
      if (w) {
        const px = parseFloat(w);
        if (w.endsWith('px') && px >= vw * 0.9) el.style.removeProperty('width');
      }
      const mw = el.style.maxWidth;
      if (mw) {
        const px = parseFloat(mw);
        if (mw.endsWith('px') && px >= vw * 0.9) el.style.removeProperty('max-width');
      }
      // Also strip min-width that's viewport-sized
      const mnw = el.style.minWidth;
      if (mnw) {
        const px = parseFloat(mnw);
        if (mnw.endsWith('px') && px >= vw * 0.9) el.style.removeProperty('min-width');
      }
      for (const child of Array.from(el.children || [])) {
        stripFixedWidth(child, depth + 1);
      }
    }
    stripFixedWidth(root, 0);
  }

  const r = root.getBoundingClientRect();
  return {
    schema: 9,
    url: out.url,
    title: out.title,
    capturedAt: out.capturedAt,
    rootSelector: opts.selector || null,
    rootBBox: { width: r.width, height: r.height },
    rootOuterHTML: root.outerHTML.slice(0, 10000000),
    rootVars,
    rootComputed,
    externalStyles,
    keyframes,
    cssRules,
    atRulesText,
    orderedRules,
    rawStyleFallbacks,
    nodes,
    tech,
    sampledCount: sampledIdx,
    mutationsRecorded: recording.mutations.length,
    animateCallsRecorded: recording.animateCalls.length,
    mutationsProcessed,
    animateProcessed,
    animationBindings,
    headScripts,
    canvasRecordings: canvasRecordings.filter((c) => c.frames.length > 0),
    canvasFps: Math.round(1000 / CANVAS_CAPTURE_INTERVAL),
    designTokens,
    reverseData: {
      shaders: (recording && recording.shaders) || (window.__mxR && window.__mxR.shaders) || [],
      threeScene: (window.__mxR && window.__mxR.threeScene) || null,
      gsapTimeline: (window.__mxR && window.__mxR.gsapTimeline) || null,
      animConfigs: (window.__mxR && window.__mxR.animConfigs) || [],
    },
  };
};
