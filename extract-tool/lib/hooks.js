// Browser-side recorder. Runs BEFORE any page JS via page.evaluateOnNewDocument.
// Two instrumentations:
//   1. Patch Element.prototype.animate → record exact keyframes + options on
//      every WAAPI creation. Source-of-truth for Framer Motion, el.animate(),
//      anything that routes through WAAPI.
//   2. MutationObserver on every `style` / `class` change with performance.now()
//      timestamps → captures rAF-driven libs (GSAP core, Lenis, hand-rolled
//      animation loops) at the exact commit time, not polling-bucketed.
//
// Each observed element is tagged with a stable `data-mx-hid` so the analyzer
// in capture.js can look it up after the fact.
module.exports = `(() => {
  if (window.__mxR) return;

  // Force all Shadow DOM attachments to 'open' mode so our capture can
  // read shadowRoot contents. Closed shadows are completely inaccessible.
  try {
    var origAttachShadow = Element.prototype.attachShadow;
    Element.prototype.attachShadow = function(init) {
      if (init && init.mode === 'closed') init = Object.assign({}, init, { mode: 'open' });
      return origAttachShadow.call(this, init);
    };
  } catch (e) {}

  const rec = window.__mxR = {
    startT: performance.now(),
    // Reverse engineering data
    shaders: [],          // { type, source } — captured GLSL shaders
    threeScene: null,     // Three.js scene JSON
    gsapTimeline: null,   // GSAP timeline dump
    animConfigs: [],      // anime.js / other lib configs
    mutations: [],
    animateCalls: [],
    nextId: 1,
    maxItems: 80000,
  };

  function eid(el) {
    if (!el || el.nodeType !== 1) return null;
    let hid = el.getAttribute && el.getAttribute('data-mx-hid');
    if (!hid) {
      hid = String(rec.nextId++);
      try { el.setAttribute('data-mx-hid', hid); } catch (e) { return null; }
    }
    return hid;
  }

  // Intercept WAAPI creation — perfect fidelity of keyframes + options.
  try {
    const orig = Element.prototype.animate;
    if (orig && !orig.__mx) {
      const patched = function(keyframes, options) {
        try {
          if (rec.animateCalls.length < rec.maxItems) {
            rec.animateCalls.push({
              hid: eid(this),
              t: performance.now() - rec.startT,
              keyframes: JSON.parse(JSON.stringify(keyframes || [])),
              options: JSON.parse(JSON.stringify(typeof options === 'number' ? { duration: options } : (options || {}))),
            });
          }
        } catch (e) {}
        return orig.apply(this, arguments);
      };
      patched.__mx = true;
      Element.prototype.animate = patched;
    }
  } catch (e) {}

  // Snapshot only the visually-relevant props. Keep strings short.
  // Force preserveDrawingBuffer on WebGL so canvas.toDataURL() works.
  try {
    var origGetCtx = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function(type, attrs) {
      if (type === 'webgl' || type === 'webgl2' || type === 'experimental-webgl') {
        attrs = Object.assign({}, attrs || {}, { preserveDrawingBuffer: true });
      }
      return origGetCtx.call(this, type, attrs);
    };
  } catch (e) {}

  // ── WebGL shader capture ──────────────────────────────────────────────
  // Intercept shaderSource() to capture GLSL code before compilation.
  try {
    ['WebGLRenderingContext', 'WebGL2RenderingContext'].forEach(function(ctxName) {
      var Proto = window[ctxName] && window[ctxName].prototype;
      if (!Proto || !Proto.shaderSource) return;
      var origShaderSource = Proto.shaderSource;
      Proto.shaderSource = function(shader, source) {
        var type = this.getShaderParameter(shader, this.SHADER_TYPE);
        var typeName = type === this.VERTEX_SHADER ? 'vertex' : type === this.FRAGMENT_SHADER ? 'fragment' : 'unknown';
        rec.shaders.push({ type: typeName, source: source, t: performance.now() - rec.startT });
        return origShaderSource.call(this, shader, source);
      };
    });
  } catch (e) {}

  // ── Three.js scene capture ────────────────────────────────────────────
  // Poll for window.THREE or scene objects after page load.
  try {
    var threeCheckCount = 0;
    var threeCheck = setInterval(function() {
      threeCheckCount++;
      if (threeCheckCount > 30) { clearInterval(threeCheck); return; }
      // Try common patterns: THREE.Scene instances, window.scene, etc.
      var scene = null;
      if (window.THREE) {
        // Search for Scene instances via renderer
        document.querySelectorAll('canvas').forEach(function(c) {
          try {
            if (c.__r3f && c.__r3f.store) {
              var state = c.__r3f.store.getState();
              if (state && state.scene) scene = state.scene;
            }
          } catch(e) {}
        });
        if (!scene && window.scene && window.scene.isScene) scene = window.scene;
      }
      if (scene && !rec.threeScene) {
        try {
          rec.threeScene = scene.toJSON();
          clearInterval(threeCheck);
        } catch(e) {}
      }
    }, 1000);
  } catch(e) {}

  // ── GSAP timeline capture ─────────────────────────────────────────────
  try {
    var gsapCheckCount = 0;
    var gsapCheck = setInterval(function() {
      gsapCheckCount++;
      if (gsapCheckCount > 30) { clearInterval(gsapCheck); return; }
      var g = window.gsap || window.TweenMax;
      if (!g) return;
      clearInterval(gsapCheck);
      try {
        var timeline = g.globalTimeline || (g.exportRoot && g.exportRoot());
        if (!timeline) return;
        var tweens = [];
        function walkTimeline(tl, depth) {
          if (!tl || depth > 5) return;
          var children = tl.getChildren ? tl.getChildren(false, true, true) : [];
          children.forEach(function(child) {
            if (child.targets && child.vars) {
              var targets = child.targets();
              tweens.push({
                targets: targets.map(function(t) {
                  return t.tagName ? (t.tagName.toLowerCase() + (t.className ? '.' + String(t.className).split(' ')[0] : '')) : String(t);
                }),
                vars: JSON.parse(JSON.stringify(child.vars || {})),
                duration: child.duration(),
                delay: child.delay(),
                startTime: child.startTime(),
              });
            }
            if (child.getChildren) walkTimeline(child, depth + 1);
          });
        }
        walkTimeline(timeline, 0);
        rec.gsapTimeline = { tweenCount: tweens.length, tweens: tweens.slice(0, 100) };
      } catch(e) {}
    }, 1000);
  } catch(e) {}

  // ── anime.js capture ──────────────────────────────────────────────────
  try {
    var animeCheckCount = 0;
    var animeCheck = setInterval(function() {
      animeCheckCount++;
      if (animeCheckCount > 20) { clearInterval(animeCheck); return; }
      if (!window.anime || !window.anime.running) return;
      clearInterval(animeCheck);
      rec.animConfigs = window.anime.running.map(function(a) {
        try { return { targets: String(a.animatables.map(function(x){return x.target.tagName})), duration: a.duration, delay: a.delay, easing: a.easing }; } catch(e) { return null; }
      }).filter(Boolean);
    }, 1000);
  } catch(e) {}

  function snap(el) {
    const cs = getComputedStyle(el);
    return {
      transform: cs.transform,
      opacity: cs.opacity,
      filter: cs.filter,
      bgPos: cs.backgroundPosition,
      bgColor: cs.backgroundColor,
      color: cs.color,
      clipPath: cs.clipPath,
    };
  }

  function installMO() {
    try {
      const mo = new MutationObserver((muts) => {
        if (rec.mutations.length >= rec.maxItems) return;
        const t = performance.now() - rec.startT;
        const seen = new Set();
        for (let i = 0; i < muts.length; i++) {
          const m = muts[i];
          if (m.type !== 'attributes') continue;
          if (m.attributeName !== 'style' && m.attributeName !== 'class') continue;
          if (seen.has(m.target)) continue;
          seen.add(m.target);
          const hid = eid(m.target);
          if (!hid) continue;
          const s = snap(m.target);
          rec.mutations.push({
            hid: hid, t: t,
            transform: s.transform, opacity: s.opacity, filter: s.filter,
            bgPos: s.bgPos, bgColor: s.bgColor,
            color: s.color, clipPath: s.clipPath,
          });
        }
      });
      mo.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['style', 'class'],
        subtree: true,
      });
      rec.observer = mo;
    } catch (e) {}
  }
  if (document.body) installMO();
  else {
    const tmp = new MutationObserver(() => {
      if (document.body) { installMO(); try { tmp.disconnect(); } catch (e) {} }
    });
    try { tmp.observe(document.documentElement, { childList: true }); } catch (e) {}
  }
})();`;
