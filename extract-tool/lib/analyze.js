// Deep site analysis — runs in Puppeteer browser context.
// Returns a comprehensive tech audit with capture-readiness scoring.

const analysisCode = async function () {
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  const report = {
    url: location.href,
    title: document.title,
    analyzedAt: new Date().toISOString(),
  };

  // ── 1. Framework detection ──────────────────────────────────────────────
  const frameworks = [];
  // React
  if (window.React || window.__REACT_DEVTOOLS_GLOBAL_HOOK__) frameworks.push({ name: "React", version: (window.React && window.React.version) || "?" });
  if (document.querySelector("#__next")) frameworks.push({ name: "Next.js", version: (window.__NEXT_DATA__ && window.__NEXT_DATA__.buildId) || "?" });
  if (document.querySelector("#__nuxt, [data-v-app]")) frameworks.push({ name: "Nuxt/Vue", version: "?" });
  if (window.__VUE__) frameworks.push({ name: "Vue", version: window.__VUE__.version || "?" });
  if (window.__SVELTE__) frameworks.push({ name: "Svelte", version: "?" });
  if (document.querySelector("[data-reactroot]") || document.querySelector("#root")) {
    if (!frameworks.some(f => f.name === "React")) frameworks.push({ name: "React (inferred)", version: "?" });
  }
  if (window.angular || document.querySelector("[ng-app], [ng-version]")) frameworks.push({ name: "Angular", version: document.querySelector("[ng-version]")?.getAttribute("ng-version") || "?" });
  if (window.Webflow) frameworks.push({ name: "Webflow", version: "?" });
  if (document.querySelector("meta[name='generator'][content*='WordPress']")) frameworks.push({ name: "WordPress", version: "?" });
  if (window.Shopify) frameworks.push({ name: "Shopify", version: "?" });
  if (window.Framer || document.querySelector("[data-framer-component-type]")) frameworks.push({ name: "Framer", version: "?" });
  if (window.__remixContext) frameworks.push({ name: "Remix", version: "?" });
  if (document.querySelector("meta[name='generator'][content*='Gatsby']")) frameworks.push({ name: "Gatsby", version: "?" });
  if (document.querySelector("meta[name='generator'][content*='Astro']")) frameworks.push({ name: "Astro", version: "?" });
  report.frameworks = frameworks;

  // ── 2. CSS architecture ────────────────────────────────────────────────
  const css = {
    externalSheets: 0,
    inlineStyleTags: 0,
    totalRules: 0,
    inaccessibleSheets: 0,
    cssInJs: false,
    cssInJsType: null,
    tailwind: false,
    cssModules: false,
    cssVars: 0,
    mediaQueries: 0,
    fontFaces: 0,
    keyframesRules: 0,
  };

  // Check for CSS-in-JS markers
  if (document.querySelector("style[data-styled]")) { css.cssInJs = true; css.cssInJsType = "styled-components"; }
  else if (document.querySelector("style[data-emotion]")) { css.cssInJs = true; css.cssInJsType = "Emotion"; }
  else if (document.querySelector("style[data-jss]")) { css.cssInJs = true; css.cssInJsType = "JSS / Material-UI"; }
  else if (document.querySelector("style[data-n-href]")) { css.cssInJs = true; css.cssInJsType = "Next.js CSS"; }

  // Tailwind detection
  const allClasses = new Set();
  document.querySelectorAll("*").forEach(el => {
    if (typeof el.className === "string") el.className.split(/\s+/).forEach(c => allClasses.add(c));
  });
  const twPatterns = ["flex", "grid", "p-", "m-", "text-", "bg-", "rounded", "shadow", "w-", "h-"];
  const twMatches = twPatterns.filter(p => Array.from(allClasses).some(c => c.startsWith(p)));
  if (twMatches.length >= 4) css.tailwind = true;

  // CSS modules (hashed classes)
  const hashedClasses = Array.from(allClasses).filter(c => /^[a-zA-Z][a-zA-Z0-9_-]*_[a-zA-Z0-9]{5,}$/.test(c) || /^css-[a-z0-9]+$/.test(c));
  if (hashedClasses.length > 10) css.cssModules = true;

  // Count style tags
  css.inlineStyleTags = document.querySelectorAll("style").length;
  css.externalSheets = document.querySelectorAll("link[rel='stylesheet']").length;

  // Walk stylesheets
  for (const sheet of Array.from(document.styleSheets)) {
    try {
      const rules = Array.from(sheet.cssRules);
      css.totalRules += rules.length;
      rules.forEach(r => {
        if (r.type === CSSRule.KEYFRAMES_RULE) css.keyframesRules++;
        if (r.type === CSSRule.FONT_FACE_RULE) css.fontFaces++;
        if (r.type === CSSRule.MEDIA_RULE) css.mediaQueries++;
      });
    } catch (e) {
      css.inaccessibleSheets++;
    }
  }

  // CSS custom properties on :root
  try {
    const rootStyle = getComputedStyle(document.documentElement);
    for (let i = 0; i < rootStyle.length; i++) {
      if (rootStyle.item(i).startsWith("--")) css.cssVars++;
    }
  } catch (e) {}

  report.css = css;

  // ── 3. Animation tech ─────────────────────────────────────────────────
  const anims = {
    cssAnimations: 0,
    cssTransitions: 0,
    waapi: 0,
    gsap: false,
    gsapPlugins: [],
    framerMotion: false,
    animejs: false,
    lottie: false,
    lottiePlayers: 0,
    scrollDriven: false,
    smil: 0,
  };

  // CSS animations on elements
  document.querySelectorAll("*").forEach(el => {
    try {
      const cs = getComputedStyle(el);
      if (cs.animationName && cs.animationName !== "none") anims.cssAnimations++;
      if (cs.transitionProperty && cs.transitionProperty !== "all" && cs.transitionProperty !== "none") anims.cssTransitions++;
    } catch (e) {}
  });

  try { anims.waapi = document.documentElement.getAnimations({ subtree: true }).length; } catch (e) {}

  // GSAP
  if (window.gsap || window.TweenMax) {
    anims.gsap = true;
    if (window.ScrollTrigger) anims.gsapPlugins.push("ScrollTrigger");
    if (window.MotionPathPlugin) anims.gsapPlugins.push("MotionPath");
    if (window.MorphSVGPlugin) anims.gsapPlugins.push("MorphSVG");
    if (window.DrawSVGPlugin) anims.gsapPlugins.push("DrawSVG");
    if (window.SplitText) anims.gsapPlugins.push("SplitText");
    if (window.ScrollSmoother) anims.gsapPlugins.push("ScrollSmoother");
    anims.scrollDriven = anims.scrollDriven || !!window.ScrollTrigger;
  }

  // Framer Motion
  if (window.__framer || document.querySelector("[data-framer-component-type]") || document.querySelector("[data-framer-appear-id]")) {
    anims.framerMotion = true;
  }

  // anime.js
  if (window.anime) anims.animejs = true;

  // Lottie
  if (window.lottie || window.bodymovin) {
    anims.lottie = true;
    anims.lottiePlayers = document.querySelectorAll("lottie-player, dotlottie-player, [data-animation-path]").length;
  }

  // Scroll-driven animations (CSS scroll-timeline)
  try {
    document.querySelectorAll("*").forEach(el => {
      const cs = getComputedStyle(el);
      if (cs.scrollTimeline || cs.viewTimeline || cs.animationTimeline) anims.scrollDriven = true;
    });
  } catch (e) {}

  // SMIL
  anims.smil = document.querySelectorAll("svg animate, svg animateTransform, svg animateMotion, svg set").length;

  report.animations = anims;

  // ── 4. Media & 3D ─────────────────────────────────────────────────────
  const media = {
    images: document.querySelectorAll("img").length,
    svgs: document.querySelectorAll("svg").length,
    videos: document.querySelectorAll("video").length,
    iframes: document.querySelectorAll("iframe").length,
    canvases: document.querySelectorAll("canvas").length,
    webgl: false,
    three: false,
    threeRenderer: null,
  };

  // WebGL detection
  document.querySelectorAll("canvas").forEach(c => {
    try {
      const ctx = c.getContext("webgl2") || c.getContext("webgl") || c.getContext("experimental-webgl");
      if (ctx) media.webgl = true;
    } catch (e) {}
  });

  if (window.THREE) {
    media.three = true;
    try {
      if (document.querySelector("canvas").__r3f) media.threeRenderer = "React Three Fiber (R3F)";
      else media.threeRenderer = "Three.js vanilla";
    } catch (e) {
      media.threeRenderer = "Three.js";
    }
  }

  report.media = media;

  // ── 5. JS complexity ──────────────────────────────────────────────────
  const js = {
    totalScripts: document.querySelectorAll("script").length,
    externalScripts: document.querySelectorAll("script[src]").length,
    inlineScripts: document.querySelectorAll("script:not([src])").length,
    moduleScripts: document.querySelectorAll("script[type='module']").length,
    hydration: false,
    spa: false,
    serviceWorker: false,
    webWorkers: false,
    webSockets: false,
  };

  // SPA detection
  if (document.querySelector("#__next, #__nuxt, #root, #app, [data-reactroot]")) js.spa = true;

  // Hydration markers
  if (window.__NEXT_DATA__ || window.__NUXT__ || document.querySelector("[data-reactroot]")) js.hydration = true;

  // Service worker
  try { if (navigator.serviceWorker && navigator.serviceWorker.controller) js.serviceWorker = true; } catch (e) {}

  report.js = js;

  // ── 6. Page structure ──────────────────────────────────────────────────
  const structure = {
    totalElements: document.querySelectorAll("*").length,
    maxDepth: 0,
    shadowDom: false,
    webComponents: false,
    dynamicContent: false,
    lazyLoaded: 0,
  };

  // Max DOM depth
  function getDepth(el, d) {
    if (d > structure.maxDepth) structure.maxDepth = d;
    if (d > 50) return; // cap recursion
    for (const child of el.children) getDepth(child, d + 1);
  }
  getDepth(document.body, 0);

  // Shadow DOM
  document.querySelectorAll("*").forEach(el => {
    if (el.shadowRoot) { structure.shadowDom = true; structure.webComponents = true; }
  });

  // Custom elements
  if (document.querySelectorAll(":not(:defined)").length > 0 || document.querySelectorAll("[is]").length > 0) {
    structure.webComponents = true;
  }

  // Lazy loading
  structure.lazyLoaded = document.querySelectorAll("img[loading='lazy'], [data-src], [data-lazy]").length;

  report.structure = structure;

  // ── 7. Fonts ───────────────────────────────────────────────────────────
  const fonts = {
    googleFonts: false,
    adobeFonts: false,
    customFonts: [],
    iconFonts: false,
    variableFonts: false,
  };

  document.querySelectorAll("link[href*='fonts.googleapis.com']").forEach(() => { fonts.googleFonts = true; });
  document.querySelectorAll("link[href*='use.typekit.net'], link[href*='fonts.adobe.com']").forEach(() => { fonts.adobeFonts = true; });
  document.querySelectorAll("link[href*='fontawesome'], link[href*='font-awesome'], [class*='fa-'], [class*='icon-'], .material-icons").forEach(() => { fonts.iconFonts = true; });

  // Collect @font-face families
  for (const sheet of Array.from(document.styleSheets)) {
    try {
      for (const rule of Array.from(sheet.cssRules)) {
        if (rule.type === CSSRule.FONT_FACE_RULE) {
          const family = rule.style.getPropertyValue("font-family").replace(/['"]/g, "").trim();
          if (family && !fonts.customFonts.includes(family)) fonts.customFonts.push(family);
        }
      }
    } catch (e) {}
  }
  fonts.customFonts = fonts.customFonts.slice(0, 20);

  report.fonts = fonts;

  // ── 8. Capture-readiness scoring ───────────────────────────────────────
  const issues = [];
  const tips = [];
  let score = 100; // start perfect, deduct for problems

  // Framework issues
  if (js.spa && js.hydration) {
    score -= 15;
    issues.push({ severity: "high", text: "SPA avec hydration JS — le DOM dépend du JS pour s'afficher correctement", tech: "SPA" });
    tips.push("Utilise le mode Live Preview (proxy) pour garder le JS actif");
  }

  // CSS-in-JS
  if (css.cssInJs) {
    score -= 10;
    issues.push({ severity: "medium", text: `CSS-in-JS (${css.cssInJsType}) — styles injectés dynamiquement, possiblement inaccessibles via CSSOM`, tech: "CSS-in-JS" });
    tips.push("Le fallback raw <style> capture devrait récupérer ces styles automatiquement");
  }
  if (css.inaccessibleSheets > 0) {
    score -= 5 * css.inaccessibleSheets;
    issues.push({ severity: "medium", text: `${css.inaccessibleSheets} feuille(s) CSS inaccessibles (cross-origin/CSP)`, tech: "CSS" });
  }
  if (css.tailwind) {
    tips.push("Tailwind détecté — les classes utilitaires se capturent bien via CSSOM");
  }

  // Animations
  if (anims.gsap && anims.gsapPlugins.includes("ScrollTrigger")) {
    score -= 15;
    issues.push({ severity: "high", text: "GSAP ScrollTrigger — animations liées au scroll, difficiles à capturer statiquement", tech: "GSAP" });
    tips.push("Active le mode Approfondi + plusieurs passes pour mieux capturer les anims scroll");
  }
  if (anims.framerMotion) {
    score -= 10;
    issues.push({ severity: "medium", text: "Framer Motion — animations JS springs via WAAPI, timing variable", tech: "Framer Motion" });
    tips.push("Les hooks WAAPI interceptent les .animate() calls de Framer Motion");
  }
  if (anims.lottie) {
    score -= 10;
    issues.push({ severity: "medium", text: "Lottie — animations SVG/Canvas complexes, frame-by-frame", tech: "Lottie" });
    tips.push("Lottie Canvas → capturé via flipbook. Lottie SVG → partiellement via DOM.");
  }
  if (anims.scrollDriven) {
    score -= 10;
    issues.push({ severity: "medium", text: "Animations scroll-driven détectées", tech: "Scroll" });
  }

  // Media
  if (media.canvases > 0) {
    score -= 10;
    issues.push({ severity: "medium", text: `${media.canvases} canvas — contenu runtime JS, capturé en flipbook`, tech: "Canvas" });
    if (media.webgl) {
      score -= 5;
      issues.push({ severity: "medium", text: "WebGL actif — shaders capturés via hooks, rendu en flipbook", tech: "WebGL" });
    }
  }
  if (media.three) {
    score -= 15;
    issues.push({ severity: "high", text: `Three.js (${media.threeRenderer}) — scène 3D complexe, JS-dépendante`, tech: "Three.js" });
    tips.push("Utilise Live Preview pour Three.js. Le mode capturé n'aura qu'un flipbook.");
  }
  if (media.videos > 0) {
    score -= 3;
    issues.push({ severity: "low", text: `${media.videos} vidéo(s) → remplacées par poster frame en capture offline`, tech: "Video" });
  }
  if (media.iframes > 0) {
    score -= 5;
    issues.push({ severity: "low", text: `${media.iframes} iframe(s) — contenu externe non capturé`, tech: "iframes" });
  }

  // Structure
  if (structure.shadowDom) {
    score -= 20;
    issues.push({ severity: "high", text: "Shadow DOM détecté — styles encapsulés, difficilement capturable", tech: "Shadow DOM" });
    tips.push("Shadow DOM détecté — le piercing automatique extrait les styles et le HTML encapsulés");
  }
  if (structure.webComponents) {
    score -= 10;
    issues.push({ severity: "medium", text: "Web Components / Custom Elements — dépendent du JS pour le rendu", tech: "Web Components" });
  }
  if (structure.totalElements > 5000) {
    score -= 5;
    issues.push({ severity: "low", text: `DOM très lourd (${structure.totalElements} éléments) — capture plus lente`, tech: "DOM" });
  }

  // Fonts
  if (fonts.iconFonts) {
    score -= 5;
    issues.push({ severity: "low", text: "Icon fonts détectées — doivent être inlinées pour l'offline", tech: "Fonts" });
    tips.push("Le font inlining convertit les @font-face en base64 automatiquement");
  }

  // Positives
  if (css.cssVars > 10) tips.push(`${css.cssVars} CSS variables sur :root — design system bien structuré`);
  if (anims.cssAnimations > 0 && !anims.gsap && !anims.framerMotion) {
    tips.push(`${anims.cssAnimations} animations CSS pures — se capturent parfaitement`);
  }
  if (!js.spa && !css.cssInJs && media.canvases === 0) {
    tips.push("Site statique classique — excellent candidat pour la capture fidèle");
  }

  report.score = Math.max(0, Math.min(100, score));
  report.issues = issues.sort((a, b) => ({ high: 0, medium: 1, low: 2 }[a.severity] - { high: 0, medium: 1, low: 2 }[b.severity]));
  report.tips = tips;

  return report;
};

module.exports = analysisCode;
