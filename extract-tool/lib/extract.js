const puppeteer = require("puppeteer");
const https = require("https");
const http = require("http");
const crypto = require("crypto");
const pageCapture = require("./capture");
const HOOKS = require("./hooks");

// Most permissive TLS agent — disables all OpenSSL security checks so we
// can reach servers with TLS 1.0/1.1, bad certs, weak ciphers, or that
// send "internal error" alerts during strict handshakes.
const LENIENT_HTTPS_AGENT = new https.Agent({
  rejectUnauthorized: false,
  secureOptions:
    crypto.constants.SSL_OP_LEGACY_SERVER_CONNECT |
    crypto.constants.SSL_OP_ALLOW_UNSAFE_LEGACY_RENEGOTIATION,
  ciphers: "DEFAULT:@SECLEVEL=0",
  minVersion: "TLSv1",
});

// Raw Node.js fetch used as last resort when Puppeteer's Chromium can't
// connect (bad TLS version, port-80-with-TLS, TLS alert internal error…).
function rawNodeFetch(url, maxRedirects = 6) {
  return new Promise((resolve, reject) => {
    if (maxRedirects <= 0) { reject(new Error("Too many redirects")); return; }
    const isHttps = url.startsWith("https");
    const mod = isHttps ? https : http;
    const reqOpts = {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
        "Accept-Encoding": "identity",
      },
    };
    if (isHttps) reqOpts.agent = LENIENT_HTTPS_AGENT;

    const req = mod.get(url, reqOpts, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        const redirectUrl = new URL(res.headers.location, url).href;
        res.resume();
        resolve(rawNodeFetch(redirectUrl, maxRedirects - 1));
        return;
      }
      const chunks = [];
      res.on("data", c => chunks.push(c));
      res.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
      res.on("error", reject);
    });
    req.on("error", reject);
    req.setTimeout(20000, () => { req.destroy(); reject(new Error("raw fetch timeout")); });
  });
}

async function launch() {
  return puppeteer.launch({
    headless: "new",
    // Bypass CSSOM same-origin so we can read cross-origin stylesheets (CDN
    // CSS, Google Fonts). Without this, most real sites capture as bare HTML.
    args: [
      "--disable-web-security",
      "--disable-features=IsolateOrigins,site-per-process",
      "--ignore-certificate-errors",
      "--ignore-certificate-errors-spki-list",
      "--allow-insecure-localhost",
    ],
    ignoreHTTPSErrors: true,
  });
}

const SSL_ERRORS = [
  "ERR_SSL_PROTOCOL_ERROR",
  "ERR_SSL_VERSION_OR_CIPHER_MISMATCH",
  "ERR_CERT_AUTHORITY_INVALID",
  "ERR_CERT_COMMON_NAME_INVALID",
  "ERR_CERT_DATE_INVALID",
  "ERR_SSL_HANDSHAKE_NOT_COMPLETED",
  "ERR_CONNECTION_CLOSED",
  "ERR_EMPTY_RESPONSE",
];

function isSslError(err) {
  const msg = (err && err.message) || "";
  return SSL_ERRORS.some(e => msg.includes(e));
}

// Fetch latest Wayback Machine snapshot URL for a given URL.
async function waybackUrl(url) {
  const apiUrl = `https://archive.org/wayback/available?url=${encodeURIComponent(url)}`;
  return new Promise((resolve) => {
    https.get(apiUrl, { headers: { "User-Agent": "Mozilla/5.0" } }, (res) => {
      const chunks = [];
      res.on("data", c => chunks.push(c));
      res.on("end", () => {
        try {
          const json = JSON.parse(Buffer.concat(chunks).toString());
          const snapshotUrl = json && json.archived_snapshots && json.archived_snapshots.closest && json.archived_snapshots.closest.url;
          resolve(snapshotUrl || null);
        } catch { resolve(null); }
      });
      res.on("error", () => resolve(null));
    }).on("error", () => resolve(null));
  });
}

// Four-tier navigation fallback for SSL-broken sites:
//   1. Normal HTTPS via Puppeteer
//   2. HTTP fallback via Puppeteer
//   3. Raw Node.js fetch (SSL fully disabled) → page.setContent
//   4. Wayback Machine latest snapshot → Puppeteer navigation
async function gotoWithFallback(page, url, gotoOpts) {
  // Tier 1: normal navigation
  try {
    return await page.goto(url, gotoOpts);
  } catch (err) {
    if (!isSslError(err)) throw err;
  }

  // Tier 2: HTTP fallback
  if (url.startsWith("https://")) {
    const httpUrl = "http://" + url.slice("https://".length);
    try {
      return await page.goto(httpUrl, gotoOpts);
    } catch (err) {
      if (!isSslError(err)) throw err;
    }
  }

  // Tier 3: raw Node fetch with SSL fully disabled → inject HTML
  try {
    const rawHtml = await rawNodeFetch(url);
    if (rawHtml && rawHtml.trim().length > 200) {
      const base = url.replace(/\?.*$/, "").replace(/\/[^/]*$/, "/");
      const injected = rawHtml.replace(/(<head[^>]*>)/i, `$1\n<base href="${base}">`);
      return await page.setContent(injected, { waitUntil: "domcontentloaded", timeout: gotoOpts.timeout || 30000 });
    }
  } catch {}

  // Tier 4: Wayback Machine snapshot
  const archiveUrl = await waybackUrl(url);
  if (archiveUrl) {
    return await page.goto(archiveUrl, { ...gotoOpts, waitUntil: "domcontentloaded" });
  }

  throw new Error(`Site inaccessible — SSL cassé côté serveur (TLS alert 80). Aucune archive Wayback Machine disponible. Essaie un autre site.`);
}

async function extractWith(browser, url, opts = {}) {
  // Default to a desktop viewport so responsive sites don't collapse grids
  // into mobile single-column layouts that we then render in a narrow iframe.
  const [vw, vh] = (opts.viewport || "1440x900").split("x").map(Number);
  const page = await browser.newPage();
  try {
    await page.setViewport({ width: vw, height: vh, deviceScaleFactor: 1 });
    // Realistic UA to bypass CloudFront / Cloudflare bot detection.
    await page.setUserAgent(
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
    );
    await page.setExtraHTTPHeaders({
      "Accept-Language": "en-US,en;q=0.9",
      "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
      "Sec-Ch-Ua": '"Chromium";v="131", "Not_A Brand";v="24"',
      "Sec-Ch-Ua-Mobile": "?0",
      "Sec-Ch-Ua-Platform": '"macOS"',
    });
    // Hide webdriver flag — common bot detection signal.
    await page.evaluateOnNewDocument(() => {
      Object.defineProperty(navigator, "webdriver", { get: () => undefined });
      Object.defineProperty(navigator, "plugins", { get: () => [1, 2, 3, 4, 5] });
      Object.defineProperty(navigator, "languages", { get: () => ["en-US", "en"] });
    });
    // Force media feature defaults so sites that gate animations behind
    // `@media (prefers-reduced-motion: no-preference)` actually run them in
    // headless. Headless Chromium's default varies by version.
    try {
      await page.emulateMediaFeatures([
        { name: "prefers-reduced-motion", value: "no-preference" },
        { name: "prefers-color-scheme", value: "light" },
      ]);
    } catch (e) {}
    // Install recorder hooks BEFORE the page's JS runs — intercepts every
    // .animate() call and every style/class mutation with precise timestamps.
    await page.evaluateOnNewDocument(HOOKS);
    await gotoWithFallback(page, url, { waitUntil: ["domcontentloaded", "networkidle2"], timeout: opts.timeoutMs || 120000 });
    // Thorough mode: wait longer for async JS (hydration, font swap, lazy
    // anims) to settle before we start timing-sensitive analysis.
    const waitMs = opts.waitMs ?? (opts.thorough ? 3000 : 1500);
    await new Promise((r) => setTimeout(r, waitMs));

    // ── CAPTCHA / challenge detection ───────────────────────────────────
    // Detect common bot challenges. We can't solve them, but we can warn
    // the user clearly instead of capturing a blank/challenge page.
    const challengeInfo = await page.evaluate(() => {
      const html = document.documentElement.innerHTML || "";
      const title = document.title || "";
      if (
        document.querySelector("[data-sitekey]") ||
        document.querySelector(".g-recaptcha, .h-captcha, #cf-challenge-running, #challenge-form, .cf-im-under-attack") ||
        /cf-chl-widget|cf_clearance|jschl_vc|jschl_answer/.test(html) ||
        /verifying you are human|checking your browser|ddos-guard|just a moment/i.test(title) ||
        /just a moment/i.test(html.slice(0, 2000))
      ) {
        return {
          detected: true,
          type: document.querySelector("[data-sitekey]")
            ? (document.querySelector(".h-captcha") ? "hCaptcha" : "reCAPTCHA")
            : /cf-chl|cf_clearance|jschl/.test(html) || /just a moment/i.test(title)
              ? "Cloudflare"
              : "CAPTCHA/challenge",
          title,
        };
      }
      return { detected: false };
    }).catch(() => ({ detected: false }));

    if (challengeInfo.detected) {
      throw new Error(
        `${challengeInfo.type} détecté — le site bloque les navigateurs automatisés. ` +
        `Utilise le proxy Live Preview pour accéder au site manuellement.`
      );
    }

    // ── Full Clone mode ─────────────────────────────────────────────────
    // Grab the full page HTML with <base href> pointing to the original
    // site. All CSS/JS/images load from the original CDN URLs. The HTML
    // is saved to a local file and served from localhost (not blob://)
    // so JS hydration works without origin mismatch.
    let rawHtml = null;
    let cloneId = null;
    if (opts.fullClone || opts.keepScripts) {
      const fs = require("fs");
      const pathMod = require("path");

      cloneId = "clone_" + Date.now();
      const cloneDir = pathMod.join(__dirname, "..", "public", "clones", cloneId);
      fs.mkdirSync(cloneDir, { recursive: true });

      rawHtml = await page.evaluate(() => {
        var origin = location.origin; // e.g. "https://clerk.com"

        // <base href> so relative URLs resolve to the original site
        document.querySelectorAll("base").forEach(function(b) { b.remove(); });
        var base = document.createElement("base");
        base.href = origin + "/";
        document.head.prepend(base);

        // Rewrite absolute-path URLs (start with /) to full URLs.
        // <base href> does NOT affect absolute paths like /foo — only
        // relative ones like foo. So /_next/image?... resolves to
        // localhost/_next/image instead of clerk.com/_next/image.
        function fixAbsolutePaths(el, attr) {
          var val = el.getAttribute(attr);
          if (!val) return;
          if (val.startsWith("/") && !val.startsWith("//")) {
            el.setAttribute(attr, origin + val);
          }
        }
        // Fix images src + srcset
        document.querySelectorAll("img").forEach(function(img) {
          fixAbsolutePaths(img, "src");
          var srcset = img.getAttribute("srcset");
          if (srcset) {
            img.setAttribute("srcset", srcset.replace(/(^|,\s*)(\/[^\s,]+)/g, function(m, prefix, path) {
              return prefix + origin + path;
            }));
          }
        });
        // Fix link hrefs (CSS, preload, etc.)
        document.querySelectorAll("link[href]").forEach(function(l) {
          fixAbsolutePaths(l, "href");
        });
        // Fix script srcs
        document.querySelectorAll("script[src]").forEach(function(sc) {
          fixAbsolutePaths(sc, "src");
        });
        // Fix video/source/audio
        document.querySelectorAll("video[src], source[src], audio[src]").forEach(function(el) {
          fixAbsolutePaths(el, "src");
        });
        // Fix background-image url(/) in inline styles
        document.querySelectorAll("[style]").forEach(function(el) {
          var s = el.style.backgroundImage;
          if (s && s.includes("url(") && /url\(["']?\/[^/]/.test(s)) {
            el.style.backgroundImage = s.replace(/url\(["']?(\/[^"')]+)["']?\)/g, function(m, path) {
              return 'url("' + origin + path + '")';
            });
          }
        });

        // Remove analytics/tracking
        document.querySelectorAll("script").forEach(function(sc) {
          var t = (sc.src || "") + " " + (sc.textContent || "");
          if (/google-analytics|googletagmanager|gtag|facebook|fbevents|hotjar|segment|mixpanel|intercom|sentry|datadog|newrelic/i.test(t)) sc.remove();
        });
        // Remove CSP
        document.querySelectorAll('meta[http-equiv="Content-Security-Policy"]').forEach(function(m) { m.remove(); });

        return "<!doctype html>\\n" + document.documentElement.outerHTML;
      });

      // Inject our picker/inspector script into the Full Clone HTML so
      // pick, goto, highlight, and animation controls work in Capturé view.
      if (rawHtml) {
        const { buildHtml } = require("./render");
        const INTERACTIONS = require("./interactions");
        // Extract the picker script from a dummy render to avoid duplicating it.
        // Simpler: just inject the minimal postMessage handler.
        const pickerScript = `<script>
(function(){
  var pickActive=false,highlighted=null;
  var ov=document.createElement("div");ov.style.cssText="position:fixed;pointer-events:none;border:2px dashed #7c9cff;border-radius:4px;z-index:999999;display:none;transition:all .08s ease-out";document.body.appendChild(ov);
  var lb=document.createElement("div");lb.style.cssText="position:fixed;pointer-events:none;z-index:999999;background:#7c9cff;color:#0b0c0f;font:600 11px system-ui;padding:2px 8px;border-radius:4px;display:none;white-space:nowrap";document.body.appendChild(lb);
  function showOv(el){if(!el||el===document.body){ov.style.display="none";lb.style.display="none";return}var r=el.getBoundingClientRect();ov.style.display="block";ov.style.left=r.left+"px";ov.style.top=r.top+"px";ov.style.width=r.width+"px";ov.style.height=r.height+"px";lb.style.display="block";lb.style.left=r.left+"px";lb.style.top=Math.max(0,r.top-22)+"px";lb.textContent=el.tagName.toLowerCase()+(el.className&&typeof el.className==="string"?"."+el.className.trim().split(/\\s+/)[0]:"")}
  function cssPath(el){if(!el||el===document.body)return"body";var s=[];var c=el;for(var d=0;c&&c!==document.body&&d<15;d++){var seg=c.tagName.toLowerCase();if(c.id){seg+="#"+c.id;s.unshift(seg);break}var p=c.parentElement;if(p){var sibs=Array.from(p.children).filter(function(x){return x.tagName===c.tagName});if(sibs.length>1)seg+=":nth-of-type("+(sibs.indexOf(c)+1)+")"}s.unshift(seg);c=p}return s.join(" > ")}
  document.addEventListener("mousemove",function(e){if(!pickActive)return;highlighted=e.target;showOv(highlighted)});
  document.addEventListener("click",function(e){if(!pickActive)return;e.preventDefault();e.stopPropagation();var el=highlighted||e.target;window.parent.postMessage({type:"mx-pick",selector:cssPath(el),html:el.outerHTML,tag:el.tagName.toLowerCase(),cls:el.className},"*")},true);
  window.addEventListener("message",function(e){
    if(e.data==="mx-pick-on"){pickActive=true;document.body.style.cursor="crosshair"}
    if(e.data==="mx-pick-off"){pickActive=false;document.body.style.cursor="";ov.style.display="none";lb.style.display="none"}
    if(e.data&&e.data.type==="mx-highlight"&&e.data.selector){try{var el=document.querySelector(e.data.selector);if(el)showOv(el)}catch(x){}}
    if(e.data&&e.data.type==="mx-highlight"&&!e.data.selector){ov.style.display="none";lb.style.display="none"}
    if(e.data&&e.data.type==="mx-goto"&&e.data.selector){try{var el=document.querySelector(e.data.selector);if(!el&&e.data.nthPath)el=document.querySelector(e.data.nthPath);if(el){el.scrollIntoView({behavior:"smooth",block:"center"});showOv(el)}}catch(x){}}
  });
})();
<\\/script>`;
        rawHtml = rawHtml.replace(/<\/body>/i, pickerScript + "\n</body>");
      }

      fs.writeFileSync(pathMod.join(cloneDir, "index.html"), rawHtml);
    }

    const data = await page.evaluate(pageCapture, {
      selector: opts.selector || null,
      thorough: !!opts.thorough,
      slowdown: typeof opts.slowdown === "number" ? opts.slowdown : 1,
      keepScripts: !!opts.keepScripts,
    });
    if (rawHtml) data.rawHtml = rawHtml;
    if (cloneId) data.cloneId = cloneId;
    return data;
  } finally {
    await page.close().catch(() => {});
  }
}

async function extractOne(url, opts = {}) {
  const browser = await launch();
  try {
    return await extractWith(browser, url, opts);
  } finally {
    await browser.close().catch(() => {});
  }
}

async function recordFrames(browser, url, opts = {}) {
  const [vw, vh] = (opts.viewport || "1280x900").split("x").map(Number);
  const fps = opts.fps || 15;
  const durationMs = opts.recordDuration || 5000;
  const page = await browser.newPage();
  try {
    await page.setViewport({ width: vw, height: vh, deviceScaleFactor: 1 });
    // Realistic UA to bypass CloudFront / Cloudflare bot detection.
    await page.setUserAgent(
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
    );
    await page.setExtraHTTPHeaders({
      "Accept-Language": "en-US,en;q=0.9",
      "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
      "Sec-Ch-Ua": '"Chromium";v="131", "Not_A Brand";v="24"',
      "Sec-Ch-Ua-Mobile": "?0",
      "Sec-Ch-Ua-Platform": '"macOS"',
    });
    // Hide webdriver flag — common bot detection signal.
    await page.evaluateOnNewDocument(() => {
      Object.defineProperty(navigator, "webdriver", { get: () => undefined });
      Object.defineProperty(navigator, "plugins", { get: () => [1, 2, 3, 4, 5] });
      Object.defineProperty(navigator, "languages", { get: () => ["en-US", "en"] });
    });
    try {
      await page.emulateMediaFeatures([
        { name: "prefers-reduced-motion", value: "no-preference" },
        { name: "prefers-color-scheme", value: "light" },
      ]);
    } catch (e) {}
    // Force preserveDrawingBuffer on WebGL so toDataURL() works.
    await page.evaluateOnNewDocument(() => {
      const orig = HTMLCanvasElement.prototype.getContext;
      HTMLCanvasElement.prototype.getContext = function(type, attrs) {
        if (type === "webgl" || type === "webgl2" || type === "experimental-webgl") {
          attrs = Object.assign({}, attrs, { preserveDrawingBuffer: true });
        }
        return orig.call(this, type, attrs);
      };
    });
    await gotoWithFallback(page, url, { waitUntil: ["domcontentloaded", "networkidle2"], timeout: opts.timeoutMs || 120000 });
    await new Promise((r) => setTimeout(r, 2000));
    // Capture each <canvas> element's frames via toDataURL inside the page.
    const result = await page.evaluate(async (opts) => {
      const canvases = Array.from(document.querySelectorAll("canvas"));
      if (canvases.length === 0) return { canvases: [] };
      const interval = Math.round(1000 / opts.fps);
      const results = canvases.map((c) => {
        const r = c.getBoundingClientRect();
        return {
          width: c.width || r.width,
          height: c.height || r.height,
          left: Math.round(r.left),
          top: Math.round(r.top),
          frames: [],
        };
      });
      const startT = performance.now();
      while (performance.now() - startT < opts.durationMs) {
        for (let i = 0; i < canvases.length; i++) {
          try {
            results[i].frames.push(canvases[i].toDataURL("image/jpeg", 0.7));
          } catch (e) { /* tainted canvas */ }
        }
        await new Promise((r) => setTimeout(r, interval));
      }
      return { canvases: results };
    }, { fps, durationMs });
    const title = await page.title();
    return { ...result, fps, durationMs, url, title };
  } finally {
    await page.close().catch(() => {});
  }
}

function buildRecordingHtml(rec) {
  const canvasBlocks = (rec.canvases || []).filter((c) => c.frames.length > 0).map((c, ci) => {
    const totalMs = c.frames.length * (1000 / rec.fps);
    const framePct = (100 / c.frames.length).toFixed(4);
    const imgs = c.frames.map((b64, i) => {
      const delayMs = Math.round(i * (1000 / rec.fps));
      return `<img style="animation-delay:${delayMs}ms" src="${b64}">`;
    }).join("\n");
    return {
      html: `<div class="canvas-player" style="width:${c.width}px;height:${c.height}px">\n${imgs}\n</div>`,
      css: `.canvas-player:nth-of-type(${ci + 1}) img { animation: mx-f${ci} ${totalMs}ms step-end infinite; }
@keyframes mx-f${ci} { 0%,${framePct}% { opacity:1 } ${(Number(framePct) + 0.01).toFixed(4)}%,100% { opacity:0 } }`,
      info: `canvas #${ci}: ${c.width}x${c.height}, ${c.frames.length} frames`,
    };
  });
  if (canvasBlocks.length === 0) return `<!doctype html><html><body><p>No canvas frames captured.</p></body></html>`;
  return `<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <title>${rec.title || "canvas recording"}</title>
  <style>
    body { margin:0; background:#111; display:flex; flex-wrap:wrap; gap:20px; justify-content:center; align-items:center; min-height:100vh; padding:20px; }
    .canvas-player { position:relative; border:1px solid #333; border-radius:8px; overflow:hidden; }
    .canvas-player img { position:absolute; top:0; left:0; width:100%; height:100%; object-fit:contain; opacity:0; }
    ${canvasBlocks.map((b) => b.css).join("\n    ")}
  </style>
</head>
<body>
  ${canvasBlocks.map((b) => b.html).join("\n  ")}
  <!-- source: ${rec.url} · ${canvasBlocks.map((b) => b.info).join(" | ")} -->
</body>
</html>`;
}

async function extractPasses(browser, url, opts = {}) {
  const passes = Math.max(1, Math.min(10, opts.passes || 1));
  const runs = [];
  for (let i = 0; i < passes; i++) {
    const data = await extractWith(browser, url, { ...opts, passIndex: i, totalPasses: passes });
    runs.push(data);
    if (typeof opts.onPassDone === "function") opts.onPassDone(i + 1);
  }
  return runs;
}

module.exports = { launch, extractWith, extractOne, extractPasses, recordFrames, buildRecordingHtml, gotoWithFallback };
