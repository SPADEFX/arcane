const http = require("http");
const fs = require("fs");
const path = require("path");
const { launch, extractWith, extractPasses, recordFrames, buildRecordingHtml } = require("./lib/extract");
const { buildHtml } = require("./lib/render");
const { mergeRuns } = require("./lib/merge");
const { convertCode, generateSection, getApiKey } = require("./lib/ai");
const { convert: convertLocal } = require("./lib/convert-local");
const siteAnalysis = require("./lib/analyze");
const surgicalExtract = require("./lib/surgical-extract");
const { generateComponent } = require("./lib/codegen");

const PORT = Number(process.env.PORT) || 3000;
const PUBLIC = path.join(__dirname, "public");

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".ico": "image/x-icon",
};

let browserPromise = null;
function getBrowser() {
  if (!browserPromise) browserPromise = launch();
  return browserPromise;
}

// ── Progress tracking ───────────────────────────────────────────────────
// Simple in-memory state polled by GET /api/progress.
const progressState = { step: "", pct: 0, detail: "", active: false };
function setProgress(step, pct, detail) {
  progressState.step = step;
  progressState.pct = Math.round(pct);
  progressState.detail = detail || "";
  progressState.active = true;
}
function clearProgress() {
  progressState.step = "";
  progressState.pct = 100;
  progressState.detail = "";
  progressState.active = false;
}

function sendJson(res, status, obj) {
  const body = JSON.stringify(obj);
  res.writeHead(status, { "content-type": "application/json; charset=utf-8", "content-length": Buffer.byteLength(body) });
  res.end(body);
}

function serveStatic(req, res) {
  const rawPath = decodeURIComponent(req.url.split("?")[0]);
  const rel = rawPath === "/" ? "/index.html" : rawPath;
  const full = path.normalize(path.join(PUBLIC, rel));
  if (!full.startsWith(PUBLIC)) { res.writeHead(403); res.end("forbidden"); return; }
  fs.stat(full, (err, stat) => {
    if (err || !stat.isFile()) { res.writeHead(404); res.end("not found"); return; }
    res.writeHead(200, { "content-type": MIME[path.extname(full).toLowerCase()] || "application/octet-stream" });
    fs.createReadStream(full).pipe(res);
  });
}

async function handleExtract(req, res) {
  let body = "";
  req.on("data", (c) => { body += c; if (body.length > 1e6) req.destroy(); });
  req.on("end", async () => {
    let payload;
    try { payload = JSON.parse(body); } catch { return sendJson(res, 400, { error: "invalid JSON" }); }
    const { url, selector, thorough, passes, slowdown, keepScripts, fullClone, viewport } = payload || {};
    if (!url || typeof url !== "string") return sendJson(res, 400, { error: "missing url" });
    const numPasses = Math.max(1, Math.min(10, Number(passes) || 1));
    try {
      setProgress("Lancement", 5, "Démarrage du navigateur...");
      const browser = await getBrowser();
      const t0 = Date.now();

      // Auto-start a reverse proxy for this URL so the preview iframe can
      // show the site with full JS/canvas/interactions.
      setProgress("Proxy", 10, "Démarrage du proxy...");
      let proxyUrl = null;
      try {
        if (proxies.has(url)) {
          proxyUrl = `http://localhost:${proxies.get(url).port}`;
        } else {
          const port = nextProxyPort++;
          const { spawn } = require("child_process");
          const child = spawn(process.execPath, [path.join(__dirname, "proxy.js"), url], {
            env: { ...process.env, PROXY_PORT: String(port) },
            stdio: "ignore",
            detached: false,
          });
          proxies.set(url, { port, child });
          child.on("exit", () => proxies.delete(url));
          proxyUrl = `http://localhost:${port}`;
          // Wait for proxy to be ready before proceeding.
          for (let attempt = 0; attempt < 20; attempt++) {
            try {
              await new Promise((resolve, reject) => {
                const r = http.get(proxyUrl, (res) => { res.resume(); resolve(); });
                r.on("error", reject);
                r.setTimeout(500, () => { r.destroy(); reject(); });
              });
              break;
            } catch (e) {
              await new Promise((r) => setTimeout(r, 300));
            }
          }
        }
      } catch (e) {}
      let data;
      const slowdownFactor = Math.max(0.5, Math.min(5, Number(slowdown) || 1));
      if (numPasses > 1) {
        setProgress("Extraction", 15, `Multi-pass: 0/${numPasses}`);
        const runs = await extractPasses(browser, url, {
          selector: selector || null,
          thorough: !!thorough,
          timeoutMs: 120000,
          passes: numPasses,
          slowdown: slowdownFactor,
          onPassDone: (i) => setProgress("Extraction", 15 + Math.round((i / numPasses) * 60), `Pass ${i}/${numPasses}`),
        });
        setProgress("Fusion", 80, "Synthèse des passes...");
        data = mergeRuns(runs);
      } else {
        setProgress("Extraction", 20, "Navigation + capture...");
        data = await extractWith(browser, url, {
          selector: selector || null,
          thorough: !!thorough,
          timeoutMs: 120000,
          slowdown: slowdownFactor,
          keepScripts: !!keepScripts,
          fullClone: !!fullClone,
          viewport: viewport || "1440x900",
        });
      }
      // When keepScripts is on, use the raw page HTML (grabbed before our
      // capture pipeline modified the DOM). This preserves React hydration,
      // canvas init, script execution order — everything runs natively.
      setProgress("Rendu", 85, "Construction du HTML...");
      // Full Clone: HTML is saved as files in public/clones/<id>/, served via
      // the static file server. We return the URL instead of the HTML blob.
      const cloneUrl = data.cloneId ? `/clones/${data.cloneId}/index.html` : null;
      const html = cloneUrl ? data.rawHtml : (data.rawHtml || buildHtml(data));
      // Cache CSS for conversion endpoint (don't send raw data to client — too heavy).
      lastCapturedCss = (data.cssRules || []).map((r) => r.selector + "{" + r.cssText + "}").join("\n");
      lastReverseData = data.reverseData || null;
      setProgress("Terminé", 100, "Envoi des résultats...");
      clearProgress();
      sendJson(res, 200, {
        ok: true,
        tookMs: Date.now() - t0,
        cloneUrl,
        proxyUrl,
        stats: {
          nodes: data.nodes.length,
          keyframes: Object.keys(data.keyframes).length,
          rules: data.cssRules.length,
          sampled: data.sampledCount || 0,
          mutations: data.mutationsRecorded || 0,
          mutationsProcessed: data.mutationsProcessed || 0,
          animateCalls: data.animateCallsRecorded || 0,
          animateProcessed: data.animateProcessed || 0,
          canvasCaptured: (data.canvasRecordings || []).length,
          canvasFrames: (data.canvasRecordings || []).reduce((s, c) => s + (c.frames || []).length, 0),
          passes: numPasses,
          merge: data.merge || null,
        },
        tech: data.tech || null,
        designTokens: data.designTokens || null,
        reverseData: data.reverseData ? {
          shaders: (data.reverseData.shaders || []).slice(0, 20),
          threeScene: data.reverseData.threeScene ? { type: "truncated", objectCount: JSON.stringify(data.reverseData.threeScene).length } : null,
          gsapTimeline: data.reverseData.gsapTimeline || null,
          animConfigs: (data.reverseData.animConfigs || []).slice(0, 20),
        } : null,
        hasApiKey: !!getApiKey(),
        html,
      });
    } catch (e) {
      clearProgress();
      sendJson(res, 500, { error: String((e && e.message) || e) });
    }
  });
}

async function handleRecord(req, res) {
  let body = "";
  req.on("data", (c) => { body += c; if (body.length > 1e6) req.destroy(); });
  req.on("end", async () => {
    let payload;
    try { payload = JSON.parse(body); } catch { return sendJson(res, 400, { error: "invalid JSON" }); }
    const { url, fps, duration } = payload || {};
    if (!url || typeof url !== "string") return sendJson(res, 400, { error: "missing url" });
    try {
      const browser = await getBrowser();
      const t0 = Date.now();
      const rec = await recordFrames(browser, url, {
        fps: Math.max(5, Math.min(30, Number(fps) || 15)),
        recordDuration: Math.max(2000, Math.min(15000, Number(duration) || 5000)),
      });
      const html = buildRecordingHtml(rec);
      const totalFrames = (rec.canvases || []).reduce((s, c) => s + c.frames.length, 0);
      sendJson(res, 200, {
        ok: true,
        tookMs: Date.now() - t0,
        canvasCount: (rec.canvases || []).length,
        frames: totalFrames,
        fps: rec.fps,
        html,
      });
    } catch (e) {
      sendJson(res, 500, { error: String((e && e.message) || e) });
    }
  });
}

// ── Proxy mode: spin up a reverse proxy for a target URL ──────────────────
const proxies = new Map(); // url → { port, process }
let nextProxyPort = 4001;
let lastCapturedCss = "";
let lastReverseData = null;

async function handleProxy(req, res) {
  let body = "";
  req.on("data", (c) => { body += c; });
  req.on("end", () => {
    let payload;
    try { payload = JSON.parse(body); } catch { return sendJson(res, 400, { error: "invalid JSON" }); }
    const { url } = payload || {};
    if (!url || typeof url !== "string") return sendJson(res, 400, { error: "missing url" });

    // Reuse existing proxy for same URL.
    if (proxies.has(url)) {
      const p = proxies.get(url);
      return sendJson(res, 200, { ok: true, proxyUrl: `http://localhost:${p.port}`, reused: true });
    }

    const port = nextProxyPort++;
    const { spawn } = require("child_process");
    const child = spawn(process.execPath, [path.join(__dirname, "proxy.js"), url], {
      env: { ...process.env, PROXY_PORT: String(port) },
      stdio: "ignore",
      detached: false,
    });
    proxies.set(url, { port, child });
    child.on("exit", () => proxies.delete(url));
    // Give it a moment to start.
    setTimeout(() => {
      sendJson(res, 200, { ok: true, proxyUrl: `http://localhost:${port}` });
    }, 800);
  });
}

async function handleConvert(req, res) {
  let body = "";
  req.on("data", (c) => { body += c; if (body.length > 10e6) req.destroy(); });
  req.on("end", async () => {
    try {
      const { html, css, language } = JSON.parse(body);
      if (!html || !language) return sendJson(res, 400, { error: "missing html or language" });
      let result, mode;
      const effectiveCss = css || lastCapturedCss || "";
      if (getApiKey()) {
        const trimHtml = html.length > 30000 ? html.slice(0, 30000) + "\n<!-- truncated -->" : html;
        const trimCss = effectiveCss.length > 15000 ? effectiveCss.slice(0, 15000) : effectiveCss;
        result = await convertCode(trimHtml, trimCss, language);
        mode = "claude";
      } else {
        result = convertLocal(html, effectiveCss, language);
        mode = "local";
      }
      sendJson(res, 200, { ok: true, code: result, mode });
    } catch (e) {
      sendJson(res, 500, { error: String(e.message || e) });
    }
  });
}

async function handleGenerate(req, res) {
  let body = "";
  req.on("data", (c) => { body += c; if (body.length > 1e6) req.destroy(); });
  req.on("end", async () => {
    try {
      const { tokens, prompt, language } = JSON.parse(body);
      if (!prompt) return sendJson(res, 400, { error: "missing prompt" });
      if (!getApiKey()) {
        return sendJson(res, 200, {
          ok: true,
          mode: "local",
          code: `<!-- La génération de sections nécessite ANTHROPIC_API_KEY -->\n<!-- Prompt: ${prompt} -->\n<!-- Tokens disponibles: ${JSON.stringify(tokens, null, 2)} -->\n\n<!-- Exporte ta clé API:\n  export ANTHROPIC_API_KEY="sk-ant-..." \npuis relance le serveur. -->`,
        });
      }
      const result = await generateSection(tokens || {}, prompt, language || "html");
      sendJson(res, 200, { ok: true, code: result, mode: "claude" });
    } catch (e) {
      sendJson(res, 500, { error: String(e.message || e) });
    }
  });
}

async function handleAnalyzeDom(req, res) {
  let body = "";
  req.on("data", (c) => { body += c; if (body.length > 500000) req.destroy(); });
  req.on("end", async () => {
    try {
      const { tree } = JSON.parse(body);
      if (!tree) return sendJson(res, 400, { error: "missing tree" });
      if (!getApiKey()) return sendJson(res, 200, { ok: false, error: "ANTHROPIC_API_KEY non définie." });
      const { callClaude } = require("./lib/ai");

      const system = `You are an expert UI/UX analyst. You receive a simplified DOM tree of a webpage. For each meaningful section, provide a short human-readable label describing what it is (e.g. "Hero Section", "Navigation Bar", "Pricing Cards", "Testimonials Carousel", "Footer", "CTA Banner", "Feature Grid", "Video Background", etc.).

Return a JSON object mapping node paths (like "0", "0.1", "0.1.2") to labels. Only label MEANINGFUL sections — skip generic wrappers. Be specific and concise. Output ONLY valid JSON, no markdown.`;

      const result = await callClaude(system, "DOM tree:\n" + tree, 4096);
      let labels = {};
      try { labels = JSON.parse(result.trim()); } catch(e) {
        const m = result.match(/\{[\s\S]*\}/);
        if (m) try { labels = JSON.parse(m[0]); } catch(e2) {}
      }
      sendJson(res, 200, { ok: true, labels });
    } catch (e) {
      sendJson(res, 500, { error: String(e.message || e) });
    }
  });
}

async function handleRecreate(req, res) {
  let body = "";
  req.on("data", (c) => { body += c; if (body.length > 5e6) req.destroy(); });
  req.on("end", async () => {
    try {
      const parsed = JSON.parse(body);
      const reverseData = parsed.reverseData || lastReverseData;
      const { tokens, language, prompt } = parsed;
      if (!getApiKey()) return sendJson(res, 200, { ok: false, error: "ANTHROPIC_API_KEY non définie." });
      const { callClaude } = require("./lib/ai");

      const parts = [];
      parts.push("Reverse-engineer and recreate the following web animation/effect.");
      if (prompt) parts.push(`User request: ${prompt}`);
      parts.push(`Target language/framework: ${language || "HTML + CSS + JS"}`);

      if (reverseData) {
        if (reverseData.shaders && reverseData.shaders.length) {
          parts.push("\n--- GLSL Shaders captured ---");
          reverseData.shaders.forEach((s, i) => {
            parts.push(`\n// Shader ${i} (${s.type}):\n${s.source}`);
          });
        }
        if (reverseData.gsapTimeline) {
          parts.push("\n--- GSAP Timeline ---");
          parts.push(JSON.stringify(reverseData.gsapTimeline, null, 2).slice(0, 8000));
        }
        if (reverseData.threeScene) {
          parts.push("\n--- Three.js Scene JSON ---");
          parts.push(JSON.stringify(reverseData.threeScene, null, 2).slice(0, 10000));
        }
        if (reverseData.animConfigs && reverseData.animConfigs.length) {
          parts.push("\n--- Animation configs ---");
          parts.push(JSON.stringify(reverseData.animConfigs, null, 2).slice(0, 4000));
        }
      }
      if (tokens) {
        parts.push("\n--- Design Tokens ---");
        parts.push(`Colors: ${(tokens.colors || []).join(", ")}`);
        parts.push(`Fonts: ${(tokens.fonts || []).join(", ")}`);
      }

      const system = `You are an expert frontend developer specializing in animations, WebGL, Three.js, GSAP, and CSS. Recreate the described effect as working, self-contained code. Output ONLY the code — no explanations, no markdown fences. The code must run standalone in a single HTML file.`;

      const result = await callClaude(system, parts.join("\n"), 16384);
      sendJson(res, 200, { ok: true, code: result });
    } catch (e) {
      sendJson(res, 500, { error: String(e.message || e) });
    }
  });
}

async function handleProxyStart(req, res) {
  let body = "";
  req.on("data", (c) => { body += c; });
  req.on("end", async () => {
    try {
      const { url } = JSON.parse(body);
      if (!url) return sendJson(res, 400, { error: "missing url" });
      if (proxies.has(url)) {
        return sendJson(res, 200, { ok: true, proxyUrl: `http://localhost:${proxies.get(url).port}`, reused: true });
      }
      const port = nextProxyPort++;
      const { spawn } = require("child_process");
      const child = spawn(process.execPath, [path.join(__dirname, "proxy.js"), url], {
        env: { ...process.env, PROXY_PORT: String(port) },
        stdio: "ignore",
        detached: false,
      });
      proxies.set(url, { port, child });
      child.on("exit", () => proxies.delete(url));
      // Wait for proxy ready
      for (let i = 0; i < 20; i++) {
        try {
          await new Promise((resolve, reject) => {
            const r = http.get(`http://localhost:${port}`, (res) => { res.resume(); resolve(); });
            r.on("error", reject);
            r.setTimeout(500, () => { r.destroy(); reject(); });
          });
          break;
        } catch (e) { await new Promise(r => setTimeout(r, 300)); }
      }
      sendJson(res, 200, { ok: true, proxyUrl: `http://localhost:${port}` });
    } catch (e) {
      sendJson(res, 500, { error: String(e.message || e) });
    }
  });
}

function handleProgress(req, res) {
  sendJson(res, 200, progressState);
}

async function handleAnalyzeSite(req, res) {
  let body = "";
  req.on("data", (c) => { body += c; if (body.length > 1e5) req.destroy(); });
  req.on("end", async () => {
    try {
      const { url } = JSON.parse(body);
      if (!url) return sendJson(res, 400, { error: "missing url" });
      const browser = await getBrowser();
      const page = await browser.newPage();
      try {
        await page.setViewport({ width: 1440, height: 900 });
        await page.goto(url, { waitUntil: ["domcontentloaded", "networkidle2"], timeout: 30000 });
        await new Promise((r) => setTimeout(r, 2000));
        const report = await page.evaluate(siteAnalysis);
        sendJson(res, 200, { ok: true, report });
      } finally {
        await page.close().catch(() => {});
      }
    } catch (e) {
      sendJson(res, 500, { error: String(e.message || e) });
    }
  });
}

async function handleSurgicalExtract(req, res) {
  let body = "";
  req.on("data", (c) => { body += c; if (body.length > 5e5) req.destroy(); });
  req.on("end", async () => {
    try {
      const { url, selector, nthPath, path: treePath } = JSON.parse(body);
      if (!url) return sendJson(res, 400, { error: "missing url" });

      const browser = await getBrowser();
      const page = await browser.newPage();
      try {
        await page.setViewport({ width: 1440, height: 900 });
        // Force preserveDrawingBuffer for canvas screenshots
        await page.evaluateOnNewDocument(() => {
          var orig = HTMLCanvasElement.prototype.getContext;
          HTMLCanvasElement.prototype.getContext = function(type, attrs) {
            if (type === "webgl" || type === "webgl2" || type === "experimental-webgl") {
              attrs = Object.assign({}, attrs || {}, { preserveDrawingBuffer: true });
            }
            return orig.call(this, type, attrs);
          };
        });
        await page.goto(url, { waitUntil: ["domcontentloaded", "networkidle2"], timeout: 30000 });
        await new Promise((r) => setTimeout(r, 3000));

        // Run surgical extraction in browser context
        const result = await page.evaluate(surgicalExtract, selector || null, treePath || null);

        if (result.error) return sendJson(res, 400, { error: result.error });

        // Take screenshot of the element
        let screenshot = "";
        try {
          const elHandle = await page.evaluateHandle((sel, tp) => {
            let el = null;
            if (sel) try { el = document.querySelector(sel); } catch(e) {}
            if (!el && tp) {
              const parts = tp.split(".").map(Number);
              el = document.body;
              const skip = {script:1,noscript:1,style:1,link:1,meta:1,base:1,template:1};
              for (let i = 1; i < parts.length && el; i++) {
                const filtered = Array.from(el.children).filter(c => !skip[c.tagName.toLowerCase()]);
                el = filtered[parts[i]] || null;
              }
            }
            return el;
          }, selector || null, treePath || null);
          if (elHandle) {
            screenshot = await elHandle.screenshot({ type: "png", encoding: "base64" }).catch(() => "");
          }
        } catch(e) {}

        sendJson(res, 200, {
          ok: true,
          ...result,
          screenshot: screenshot ? "data:image/png;base64," + screenshot : null,
        });
      } finally {
        await page.close().catch(() => {});
      }
    } catch (e) {
      sendJson(res, 500, { error: String(e.message || e) });
    }
  });
}

async function handleExtractToComponent(req, res) {
  let body = "";
  req.on("data", (c) => { body += c; if (body.length > 5e5) req.destroy(); });
  req.on("end", async () => {
    try {
      const { url, selector, nthPath, path: treePath, name } = JSON.parse(body);
      if (!url) return sendJson(res, 400, { error: "missing url" });

      const browser = await getBrowser();
      const page = await browser.newPage();
      try {
        await page.setViewport({ width: 1440, height: 900 });
        await page.evaluateOnNewDocument(() => {
          var orig = HTMLCanvasElement.prototype.getContext;
          HTMLCanvasElement.prototype.getContext = function(type, attrs) {
            if (type === "webgl" || type === "webgl2" || type === "experimental-webgl")
              attrs = Object.assign({}, attrs || {}, { preserveDrawingBuffer: true });
            return orig.call(this, type, attrs);
          };
        });
        await page.goto(url, { waitUntil: ["domcontentloaded", "networkidle2"], timeout: 30000 });
        await new Promise((r) => setTimeout(r, 3000));

        // Step 1: Surgical extraction
        const extraction = await page.evaluate(surgicalExtract, selector || null, treePath || null);
        if (extraction.error) return sendJson(res, 400, { error: extraction.error });

        // Step 1b: Screenshot
        let screenshot = "";
        try {
          const elHandle = await page.evaluateHandle((sel, tp) => {
            let el = null;
            if (sel) try { el = document.querySelector(sel); } catch(e) {}
            if (!el && tp) {
              const parts = tp.split(".").map(Number);
              el = document.body;
              const skip = {script:1,noscript:1,style:1,link:1,meta:1,base:1,template:1};
              for (let i = 1; i < parts.length && el; i++) {
                const filtered = Array.from(el.children).filter(c => !skip[c.tagName.toLowerCase()]);
                el = filtered[parts[i]] || null;
              }
            }
            return el;
          }, selector || null, treePath || null);
          if (elHandle) screenshot = await elHandle.screenshot({ type: "png", encoding: "base64" }).catch(() => "");
        } catch(e) {}

        // Step 2: Generate component
        const componentName = name || "ExtractedSection";
        const generated = generateComponent(extraction, componentName);

        sendJson(res, 200, {
          ok: true,
          // Extraction data
          extraction: {
            html: extraction.html,
            scopedCss: extraction.scopedCss,
            stats: extraction.stats,
            cssVars: extraction.cssVars,
            images: extraction.images,
            wapiAnimations: extraction.wapiAnimations,
          },
          // Generated component
          component: {
            tsx: generated.tsx,
            css: generated.css,
            props: generated.props,
            defaultProps: generated.defaultProps,
          },
          screenshot: screenshot ? "data:image/png;base64," + screenshot : null,
        });
      } finally {
        await page.close().catch(() => {});
      }
    } catch (e) {
      sendJson(res, 500, { error: String(e.message || e) });
    }
  });
}

async function handleCloneSection(req, res) {
  let body = "";
  req.on("data", (c) => { body += c; if (body.length > 1e5) req.destroy(); });
  req.on("end", async () => {
    try {
      const { url, selector, nthPath, path: treePath } = JSON.parse(body);
      if (!url) return sendJson(res, 400, { error: "missing url" });

      const browser = await getBrowser();
      const page = await browser.newPage();
      try {
        await page.setViewport({ width: 1440, height: 900 });
        // Force preserveDrawingBuffer for WebGL canvas screenshots
        await page.evaluateOnNewDocument(() => {
          var orig = HTMLCanvasElement.prototype.getContext;
          HTMLCanvasElement.prototype.getContext = function(type, attrs) {
            if (type === "webgl" || type === "webgl2" || type === "experimental-webgl") {
              attrs = Object.assign({}, attrs || {}, { preserveDrawingBuffer: true });
            }
            return orig.call(this, type, attrs);
          };
        });
        await page.goto(url, { waitUntil: ["domcontentloaded", "networkidle2"], timeout: 30000 });
        // Wait longer for JS animations/canvas to render
        await new Promise((r) => setTimeout(r, 3500));

        const result = await page.evaluate((opts) => {
          // Find the element
          var el = null;
          if (opts.selector) try { el = document.querySelector(opts.selector); } catch(e) {}
          if (!el && opts.nthPath) try { el = document.querySelector(opts.nthPath); } catch(e) {}
          if (!el && opts.treePath) {
            var parts = opts.treePath.split(".").map(Number);
            el = document.body;
            var skip = {script:1,noscript:1,style:1,link:1,meta:1,base:1,template:1};
            for (var i = 1; i < parts.length && el; i++) {
              var filtered = Array.from(el.children).filter(function(c) { return !skip[c.tagName.toLowerCase()]; });
              el = filtered[parts[i]] || null;
            }
          }
          if (!el) return { error: "Element introuvable" };

          // Extract computed styles for every element in the subtree
          var allStyles = [];
          var idx = 0;
          var PROPS = "display,position,top,left,right,bottom,width,height,min-width,min-height,max-width,max-height,margin-top,margin-right,margin-bottom,margin-left,padding-top,padding-right,padding-bottom,padding-left,border-top-width,border-right-width,border-bottom-width,border-left-width,border-top-style,border-right-style,border-bottom-style,border-left-style,border-top-color,border-right-color,border-bottom-color,border-left-color,border-radius,background-color,background-image,background-size,background-position,background-repeat,color,font-family,font-size,font-weight,font-style,line-height,letter-spacing,text-align,text-decoration,text-transform,white-space,flex-direction,flex-wrap,flex-grow,flex-shrink,flex-basis,align-items,align-self,justify-content,gap,order,grid-template-columns,grid-template-rows,grid-template-areas,grid-column,grid-row,opacity,visibility,overflow,transform,transform-origin,box-shadow,text-shadow,filter,backdrop-filter,z-index,clip-path,object-fit,aspect-ratio".split(",");

          function walk(n, depth) {
            if (n.nodeType !== 1 || depth > 15) return;
            try {
              var cs = getComputedStyle(n);
              var cn = "s" + (idx++);
              var st = {};
              for (var i = 0; i < PROPS.length; i++) {
                var v = cs.getPropertyValue(PROPS[i]);
                if (v) st[PROPS[i]] = v;
              }
              allStyles.push({ c: cn, s: st });
              n.setAttribute("data-mx-clone", cn);

              // Canvas → screenshot as inline image
              if (n.tagName === "CANVAS") {
                try {
                  var dataUrl = n.toDataURL("image/png");
                  if (dataUrl && dataUrl.length > 100) {
                    var img = document.createElement("img");
                    img.src = dataUrl;
                    img.style.width = n.width + "px";
                    img.style.height = n.height + "px";
                    img.setAttribute("data-mx-clone", cn);
                    n.parentNode.replaceChild(img, n);
                  }
                } catch(e) {}
              }

              // Images → inline as base64
              if (n.tagName === "IMG" && n.src && !n.src.startsWith("data:")) {
                try {
                  var cvs = document.createElement("canvas");
                  cvs.width = n.naturalWidth || n.width;
                  cvs.height = n.naturalHeight || n.height;
                  var ctx = cvs.getContext("2d");
                  ctx.drawImage(n, 0, 0);
                  var dataUrl = cvs.toDataURL("image/png");
                  if (dataUrl && dataUrl.length > 100) {
                    n.src = dataUrl;
                    n.removeAttribute("srcset");
                    n.removeAttribute("data-src");
                  }
                } catch(e) {}
              }

              // SVGs → keep as-is (they're already inline)

              // Background images with url() → try to inline via fetch
              if (cs.backgroundImage && cs.backgroundImage !== "none" && cs.backgroundImage.indexOf("url(") > -1) {
                // Keep the computed background-image — <base href> will resolve it
                st["background-image"] = cs.backgroundImage;
              }

            } catch(e) {}
            for (var j = 0; j < n.children.length; j++) walk(n.children[j], depth + 1);
          }
          walk(el, 0);

          var html = el.outerHTML;
          var w = el.offsetWidth;
          var h = el.offsetHeight;

          // Cleanup
          el.querySelectorAll("[data-mx-clone]").forEach(function(x) { x.removeAttribute("data-mx-clone"); });
          el.removeAttribute("data-mx-clone");

          return { html: html, styles: allStyles, width: w, height: h };
        }, { selector, nthPath, treePath });

        if (result.error) return sendJson(res, 400, { error: result.error });

        // Take a pixel-perfect screenshot of the section using Puppeteer
        let screenshotB64 = "";
        try {
          // Find the element handle for screenshot
          const elHandle = await page.evaluateHandle((opts) => {
            var el = null;
            if (opts.selector) try { el = document.querySelector(opts.selector); } catch(e) {}
            if (!el && opts.nthPath) try { el = document.querySelector(opts.nthPath); } catch(e) {}
            if (!el && opts.treePath) {
              var parts = opts.treePath.split(".").map(Number);
              el = document.body;
              var skip = {script:1,noscript:1,style:1,link:1,meta:1,base:1,template:1};
              for (var i = 1; i < parts.length && el; i++) {
                var filtered = Array.from(el.children).filter(function(c) { return !skip[c.tagName.toLowerCase()]; });
                el = filtered[parts[i]] || null;
              }
            }
            return el;
          }, { selector, nthPath, treePath });
          if (elHandle) {
            const screenshot = await elHandle.screenshot({ type: "png", encoding: "base64" });
            screenshotB64 = screenshot;
          }
        } catch(e) {}

        // Build standalone HTML
        let css = "";
        for (const s of result.styles) {
          const decls = Object.entries(s.s).map(([k, v]) => `  ${k}: ${v};`).join("\n");
          css += `[data-mx-clone="${s.c}"] {\n${decls}\n}\n`;
        }

        const screenshotHtml = screenshotB64
          ? `\n  <!-- Pixel-perfect screenshot of the original section -->\n  <div style="margin-bottom:20px;border:1px solid #333;border-radius:8px;overflow:hidden"><img src="data:image/png;base64,${screenshotB64}" style="width:100%;display:block" alt="Original screenshot"></div>\n  <hr style="border:none;border-top:1px solid #333;margin:20px 0">\n  <!-- Cloned HTML+CSS below -->\n`
          : "";

        const fullHtml = `<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Cloned Section</title>
  <base href="${url}">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { min-height: 100vh; background: #0a0a0a; padding: 20px; }
    ${css}
  </style>
</head>
<body>
  ${screenshotHtml}
  ${result.html}
</body>
</html>`;

        sendJson(res, 200, { ok: true, html: fullHtml, elementCount: result.styles.length, hasScreenshot: !!screenshotB64 });
      } finally {
        await page.close().catch(() => {});
      }
    } catch (e) {
      sendJson(res, 500, { error: String(e.message || e) });
    }
  });
}

function handleCloneFiles(req, res) {
  const url = new URL(req.url, "http://localhost");
  const cloneId = url.searchParams.get("id");
  if (!cloneId || /[^a-zA-Z0-9_]/.test(cloneId)) return sendJson(res, 400, { error: "invalid id" });
  const cloneDir = path.join(PUBLIC, "clones", cloneId);
  fs.stat(cloneDir, (err, stat) => {
    if (err || !stat.isDirectory()) return sendJson(res, 404, { error: "clone not found" });
    const assetsDir = path.join(cloneDir, "assets");
    fs.readdir(assetsDir, (err2, files) => {
      const assets = (files || []).map(f => {
        const ext = path.extname(f).toLowerCase();
        const type = [".js"].includes(ext) ? "js" : [".css"].includes(ext) ? "css" : [".png",".jpg",".jpeg",".webp",".avif",".gif",".svg",".ico"].includes(ext) ? "image" : "other";
        let size = 0;
        try { size = fs.statSync(path.join(assetsDir, f)).size; } catch(e) {}
        return { name: f, type, size, path: `/clones/${cloneId}/assets/${f}` };
      });
      const htmlSize = (() => { try { return fs.statSync(path.join(cloneDir, "index.html")).size; } catch(e) { return 0; } })();
      sendJson(res, 200, {
        ok: true,
        cloneId,
        htmlPath: `/clones/${cloneId}/index.html`,
        htmlSize,
        assets,
        summary: {
          js: assets.filter(a => a.type === "js").length,
          css: assets.filter(a => a.type === "css").length,
          images: assets.filter(a => a.type === "image").length,
          totalSize: htmlSize + assets.reduce((s, a) => s + a.size, 0),
        }
      });
    });
  });
}

// Save extracted component as Storybook story + component files
async function handleSaveToLibrary(req, res) {
  let body = "";
  req.on("data", (c) => { body += c; if (body.length > 5e6) req.destroy(); });
  req.on("end", () => {
    try {
      const { name, slug, tsx, css, rawHtml, props, screenshot, description } = JSON.parse(body);
      if (!name || !slug) return sendJson(res, 400, { error: "missing name or slug" });

      const studioRoot = path.join(__dirname, "..");
      const componentsDir = path.join(studioRoot, "ui-library", "components");
      const storiesDir = path.join(studioRoot, "ui-library", "stories");

      // 1. Write the component file
      const compFile = path.join(componentsDir, `extracted-${slug}.tsx`);
      fs.writeFileSync(compFile, tsx || `// Extracted: ${name}\nexport function ${name}() { return null; }`);

      // 2. Write the CSS file (if any)
      if (css && css.trim()) {
        fs.writeFileSync(path.join(componentsDir, `extracted-${slug}.css`), css);
      }

      // 3. Generate and write the Storybook story
      const storyContent = `import type { Meta, StoryObj } from "@storybook/react";

// Extracted component — rendered via raw HTML + scoped CSS in Shadow DOM
function ${name}Preview() {
  return (
    <div
      ref={(el) => {
        if (!el) return;
        let shadow = el.shadowRoot;
        if (!shadow) shadow = el.attachShadow({ mode: "open" });
        shadow.innerHTML = \`<style>${(css || "").replace(/`/g, "\\`")}</style>${(rawHtml || tsx || "").replace(/`/g, "\\`")}\`;
      }}
      style={{ width: "100%" }}
    />
  );
}

const meta = {
  title: "Extracted/${name}",
  component: ${name}Preview,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof ${name}Preview>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
`;
      fs.writeFileSync(path.join(storiesDir, `extracted-${slug}.stories.tsx`), storyContent);

      // 4. Save screenshot as thumbnail
      if (screenshot && screenshot.startsWith("data:image")) {
        const b64 = screenshot.replace(/^data:image\/\w+;base64,/, "");
        fs.writeFileSync(path.join(componentsDir, `extracted-${slug}.png`), Buffer.from(b64, "base64"));
      }

      sendJson(res, 200, {
        ok: true,
        files: {
          component: `ui-library/components/extracted-${slug}.tsx`,
          css: css ? `ui-library/components/extracted-${slug}.css` : null,
          story: `ui-library/stories/extracted-${slug}.stories.tsx`,
        },
      });
    } catch (e) {
      sendJson(res, 500, { error: String(e.message || e) });
    }
  });
}

const server = http.createServer((req, res) => {
  if (req.method === "POST" && req.url === "/api/extract") return handleExtract(req, res);
  if (req.method === "POST" && req.url === "/api/record") return handleRecord(req, res);
  if (req.method === "POST" && req.url === "/api/convert") return handleConvert(req, res);
  if (req.method === "POST" && req.url === "/api/generate") return handleGenerate(req, res);
  if (req.method === "POST" && req.url === "/api/recreate") return handleRecreate(req, res);
  if (req.method === "POST" && req.url === "/api/analyze-dom") return handleAnalyzeDom(req, res);
  if (req.method === "POST" && req.url === "/api/proxy") return handleProxyStart(req, res);
  if (req.method === "POST" && req.url === "/api/analyze-site") return handleAnalyzeSite(req, res);
  if (req.method === "POST" && req.url === "/api/clone-section") return handleCloneSection(req, res);
  if (req.method === "POST" && req.url === "/api/surgical-extract") return handleSurgicalExtract(req, res);
  if (req.method === "POST" && req.url === "/api/extract-to-component") return handleExtractToComponent(req, res);
  if (req.method === "POST" && req.url === "/api/save-to-library") return handleSaveToLibrary(req, res);
  if (req.method === "GET" && req.url === "/api/progress") return handleProgress(req, res);
  if (req.method === "GET" && req.url.startsWith("/api/clone-files")) return handleCloneFiles(req, res);
  if (req.method === "GET") return serveStatic(req, res);
  res.writeHead(405); res.end("method not allowed");
});

server.listen(PORT, () => {
  console.log(`Extract Tool · http://localhost:${PORT}`);
});

for (const sig of ["SIGINT", "SIGTERM"]) {
  process.on(sig, async () => {
    try { if (browserPromise) (await browserPromise).close(); } catch {}
    process.exit(0);
  });
}
