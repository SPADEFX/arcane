const INTERACTIONS_SCRIPT = require("./interactions");

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

function buildHtml(data) {
  const keyframesCss = Object.entries(data.keyframes || {}).map(([name, stops]) => {
    const body = stops.map((s) => `${s.keyText}{${s.cssText}}`).join("");
    return `@keyframes ${name}{${body}}`;
  }).join("\n");

  // Use orderedRules (preserves original source order of style + @media rules)
  // when available, falling back to separate arrays for older cached captures.
  let allRulesCss;
  if (data.orderedRules && data.orderedRules.length > 0) {
    allRulesCss = data.orderedRules.map(r => r.text).join("\n");
  } else {
    const rulesCss = (data.cssRules || [])
      .map((r) => `${r.selector}{${r.cssText}}`)
      .join("\n");
    const atRulesCss = (data.atRulesText || []).join("\n");
    allRulesCss = rulesCss + "\n" + atRulesCss;
  }

  // Raw <style> tag contents that we couldn't parse via CSSOM (CSS-in-JS,
  // cross-origin <style> tags, nonce-blocked styles). Emitted as-is.
  const rawFallbackCss = (data.rawStyleFallbacks || []).join("\n");

  const linkTags = (data.externalStyles || [])
    .map((href) => {
      const abs = href.startsWith("http") || href.startsWith("//")
        ? href
        : new URL(href, data.url).toString();
      return `<link rel="stylesheet" href="${escapeHtml(abs)}" />`;
    })
    .join("\n  ");

  const rootVarsCss = Object.entries(data.rootVars || {})
    .map(([k, v]) => `${k}: ${v};`)
    .join(" ");

  const rc = data.rootComputed || {};

  // If the captured root is <body>, unwrap it so we don't emit nested body
  // tags. Preserve the original body's attributes (class, id, data-*) because
  // stylesheets often target them.
  const trimmed = (data.rootOuterHTML || "").trim();
  const bodyMatch = /^<body\b([^>]*)>([\s\S]*)<\/body>\s*$/i.exec(trimmed);
  const bodyAttrs = bodyMatch ? bodyMatch[1] : "";
  const innerHtml = bodyMatch ? bodyMatch[2] : data.rootOuterHTML;

  // Block layout (no flex-centering) — full-page captures expect natural flow.
  const bodyDefaults = `
    margin: 0; padding: 0; min-height: 100vh;
    background: ${rc["background-color"] || "#fff"};
    color: ${rc["color"] || "inherit"};
    font-family: ${rc["font-family"] || "system-ui, sans-serif"};
    font-size: ${rc["font-size"] || "16px"};
    font-weight: ${rc["font-weight"] || "normal"};
    line-height: ${rc["line-height"] || "1.5"};
  `;

  // Canvas flipbook injection: for each canvas we recorded during sampling,
  // generate a CSS animation that cycles through the captured frames. The
  // frames are inlined as base64 <img> tags inside the placeholder <div>.
  let canvasStyle = "";
  let canvasInject = "";
  const recs = data.canvasRecordings || [];
  // Track which canvas placeholders actually get a flipbook injected.
  const canvasWithFlipbook = new Set();
  for (let ci = 0; ci < recs.length; ci++) {
    const rec = recs[ci];
    if (!rec.frames || rec.frames.length < 2) continue;
    canvasWithFlipbook.add(ci);
    const msPerFrame = Math.round(1000 / (data.canvasFps || 15));
    const totalMs = rec.frames.length * msPerFrame;
    const framePct = (100 / rec.frames.length).toFixed(4);
    canvasStyle += `
[data-mx-canvas="${ci}"] img { position:absolute;top:0;left:0;width:100%;height:100%;opacity:0; animation: mx-cv${ci} ${totalMs}ms step-end infinite; }
@keyframes mx-cv${ci} { 0%,${framePct}% { opacity:1 } ${(Number(framePct) + 0.01).toFixed(4)}%,100% { opacity:0 } }
`;
    // Build img tags with staggered delay
    const imgs = rec.frames.map((b64, fi) => {
      const delayMs = fi * msPerFrame;
      return `<img style="animation-delay:${delayMs}ms" src="${b64}" alt="">`;
    }).join("");
    // Inject into the placeholder via a script that runs on load
    canvasInject += `
<script>
(function(){
  var p = document.querySelector('[data-mx-canvas="${ci}"]');
  if (p) { p.innerHTML = ${JSON.stringify(imgs)}; p.classList.add('mx-has-frames'); }
})();
<\/script>`;
  }
  // Hide canvas placeholders that didn't get a flipbook — they'd show as
  // empty blocks covering real content.
  canvasInject += `
<script>
(function(){
  document.querySelectorAll('[data-mx-canvas]').forEach(function(el) {
    if (!el.querySelector('img')) el.style.display = 'none';
  });
})();
<\/script>`;

  // Script passthrough: emit <head> scripts so canvas/WebGL/JS-driven
  // animations keep running in the clone.
  const scriptTags = (data.headScripts || []).map((s) => {
    if (s.src) {
      const abs = s.src.startsWith("http") || s.src.startsWith("//")
        ? s.src
        : new URL(s.src, data.url).toString();
      let tag = `<script src="${escapeHtml(abs)}"`;
      if (s.type) tag += ` type="${escapeHtml(s.type)}"`;
      if (s.async) tag += " async";
      if (s.defer) tag += " defer";
      if (s.crossOrigin) tag += ` crossorigin="${escapeHtml(s.crossOrigin)}"`;
      return tag + `><\/script>`;
    }
    return `<script${s.type ? ` type="${escapeHtml(s.type)}"` : ""}>${s.inline}<\/script>`;
  }).join("\n  ");

  return `<!doctype html>
<html style="${rootVarsCss}">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(data.title || "capture")}</title>
  <base href="${escapeHtml(data.url)}" />
  ${linkTags}
  <style>
    [data-mx-canvas] { display: none !important; }
    [data-mx-canvas].mx-has-frames { display: block !important; }
    html { ${rootVarsCss} }
    body { ${bodyDefaults} }
    ${allRulesCss}
    ${keyframesCss}
    ${canvasStyle}
  </style>
  ${rawFallbackCss ? `<style>/* CSS-in-JS / raw style fallback */\n${rawFallbackCss}\n  </style>` : ""}
  ${scriptTags}
</head>
<body${bodyAttrs}>
  ${innerHtml}
  <!-- source: ${escapeHtml(data.url)} · captured ${escapeHtml(data.capturedAt)} -->
  ${canvasInject}
  <script>
  (function() {
    var pickActive = false;
    var highlighted = null;
    var overlay = document.createElement("div");
    overlay.style.cssText = "position:fixed;pointer-events:none;border:2px dashed #7c9cff;border-radius:4px;z-index:999999;display:none;transition:all 0.08s ease-out;";
    document.body.appendChild(overlay);
    var label = document.createElement("div");
    label.style.cssText = "position:fixed;pointer-events:none;z-index:999999;background:#7c9cff;color:#0b0c0f;font:600 11px system-ui;padding:2px 8px;border-radius:4px;display:none;white-space:nowrap;";
    document.body.appendChild(label);

    function cssPath(el) {
      if (!el || el === document.body || el === document.documentElement) return "body";
      var segs = [];
      var cur = el;
      for (var d = 0; cur && cur !== document.body && d < 15; d++) {
        var seg = cur.tagName.toLowerCase();
        if (cur.id) { seg += "#" + cur.id; segs.unshift(seg); break; }
        if (cur.className && typeof cur.className === "string") {
          var cls = cur.className.trim().split(/\\s+/).filter(Boolean).slice(0, 2).join(".");
          if (cls) seg += "." + cls;
        }
        var parent = cur.parentElement;
        if (parent) {
          var sibs = Array.from(parent.children).filter(function(c) { return c.tagName === cur.tagName; });
          if (sibs.length > 1) seg += ":nth-of-type(" + (sibs.indexOf(cur) + 1) + ")";
        }
        segs.unshift(seg);
        cur = parent;
      }
      return segs.join(" > ");
    }
    function showOverlay(el) {
      if (!el || el === document.body || el === document.documentElement) { overlay.style.display = "none"; label.style.display = "none"; return; }
      var r = el.getBoundingClientRect();
      overlay.style.display = "block";
      overlay.style.left = r.left + "px"; overlay.style.top = r.top + "px";
      overlay.style.width = r.width + "px"; overlay.style.height = r.height + "px";
      label.style.display = "block";
      label.style.left = r.left + "px"; label.style.top = Math.max(0, r.top - 22) + "px";
      label.textContent = el.tagName.toLowerCase() + (el.className && typeof el.className === "string" ? "." + el.className.trim().split(/\\s+/)[0] : "");
    }
    document.addEventListener("mousemove", function(e) {
      if (!pickActive) return;
      highlighted = e.target;
      showOverlay(highlighted);
    });
    document.addEventListener("click", function(e) {
      if (!pickActive) return;
      e.preventDefault();
      e.stopPropagation();
      var el = highlighted || e.target;
      var html = el.outerHTML;
      var selector = cssPath(el);
      var cs = getComputedStyle(el);
      window.parent.postMessage({ type: "mx-pick", selector: selector, html: html, tag: el.tagName.toLowerCase(), cls: el.className }, "*");
    }, true);
    window.addEventListener("message", function(e) {
      if (e.data === "mx-pick-on") { pickActive = true; document.body.style.cursor = "crosshair"; }
      if (e.data === "mx-pick-off") {
        pickActive = false;
        document.body.style.cursor = "";
        overlay.style.display = "none";
        label.style.display = "none";
      }
      // Highlight from DOM tree hover
      if (e.data && e.data.type === "mx-highlight") {
        if (e.data.selector) {
          try {
            var el = document.querySelector(e.data.selector);
            if (el) showOverlay(el);
          } catch(ex) {}
        } else {
          overlay.style.display = "none";
          label.style.display = "none";
        }
      }
      // Scroll to + persistent highlight
      if (e.data && e.data.type === "mx-goto" && e.data.selector) {
        // Clear previous
        document.querySelectorAll(".__mx-selected").forEach(function(p) {
          p.classList.remove("__mx-selected");
          p.style.outline = "";
          p.style.outlineOffset = "";
        });
        var el = null;
        try { el = document.querySelector(e.data.selector); } catch(ex) {}
        // Fallback: try nth-path
        if (!el && e.data.nthPath) {
          try { el = document.querySelector(e.data.nthPath); } catch(ex) {}
        }
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "center" });
          el.classList.add("__mx-selected");
          el.style.outline = "2px dashed #7c9cff";
          el.style.outlineOffset = "4px";
          showOverlay(el);
        }
      }
      // Animation timeline control
      if (e.data && e.data.type === "mx-anim-init") {
        var toRestart = [];
        document.querySelectorAll("*").forEach(function(el) {
          var cs = getComputedStyle(el);
          if (cs.animationName && cs.animationName !== "none") toRestart.push(el);
        });
        toRestart.forEach(function(el) { el.style.animation = "none"; });
        void document.body.offsetHeight;
        toRestart.forEach(function(el) { el.style.animation = ""; });
        setTimeout(function() {
          var anims = document.getAnimations();
          anims.forEach(function(a) { a.pause(); a.currentTime = 0; });
          var info = anims.map(function(a, i) {
            var t = a.effect && a.effect.getComputedTiming ? a.effect.getComputedTiming() : {};
            var target = a.effect && a.effect.target;
            var tg = target ? target.tagName.toLowerCase() : "?";
            var cls = target && target.className && typeof target.className === "string" ? target.className.split(" ")[0] : "";
            return { i: i, name: a.animationName || a.id || ("anim-" + i), tag: tg, cls: cls, duration: t.duration || 0, delay: t.delay || 0, iterations: t.iterations, direction: t.direction, fill: t.fill, endTime: (t.delay || 0) + (t.duration || 0) * Math.min(t.iterations || 1, 10) };
          });
          window.parent.postMessage({ type: "mx-anim-data", animations: info }, "*");
        }, 50);
      }
      if (e.data && e.data.type === "mx-anim-play") document.getAnimations().forEach(function(a) { a.play(); });
      if (e.data && e.data.type === "mx-anim-pause") document.getAnimations().forEach(function(a) { a.pause(); });
      if (e.data && e.data.type === "mx-anim-seek") document.getAnimations().forEach(function(a) { a.pause(); a.currentTime = e.data.time || 0; });
      if (e.data && e.data.type === "mx-anim-reset") document.getAnimations().forEach(function(a) { a.pause(); a.currentTime = 0; });
      // Hide/show toggle
      if (e.data && e.data.type === "mx-toggle-vis") {
        var el = null;
        try { el = document.querySelector(e.data.selector); } catch(ex) {}
        if (!el && e.data.nthPath) try { el = document.querySelector(e.data.nthPath); } catch(ex) {}
        if (el) el.style.display = e.data.hidden ? "none" : "";
      }
      // Reorder
      if (e.data && e.data.type === "mx-reorder") {
        var src = null, dest = null;
        try { src = document.querySelector(e.data.srcSelector); } catch(ex) {}
        if (!src && e.data.srcNthPath) try { src = document.querySelector(e.data.srcNthPath); } catch(ex) {}
        try { dest = document.querySelector(e.data.destSelector); } catch(ex) {}
        if (!dest && e.data.destNthPath) try { dest = document.querySelector(e.data.destNthPath); } catch(ex) {}
        if (src && dest && src !== dest && dest.parentNode) dest.parentNode.insertBefore(src, dest);
      }
    });
  })();
  <\/script>
  ${INTERACTIONS_SCRIPT}
</body>
</html>`;
}

module.exports = { escapeHtml, buildHtml };
