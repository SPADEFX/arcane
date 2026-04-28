// Local reverse proxy — serves a target site through localhost so all JS,
// canvas, WebGL, API calls, cookies run natively. The browser sees
// localhost:4000 but every request is forwarded to the real domain.
//
// Usage:  node proxy.js https://www.example.com
// Then open http://localhost:4000

const http = require("http");
const https = require("https");
const { URL } = require("url");

const target = process.argv[2];
if (!target) {
  console.error("Usage: node proxy.js <target-url>");
  console.error("  e.g. node proxy.js https://www.unkey.com");
  process.exit(1);
}

let targetUrl = new URL(target);

// Script injected into proxied HTML pages for DOM inspection from parent.
const INSPECT_SCRIPT = `<script>
(function(){
  var ov = document.createElement("div");
  ov.style.cssText = "position:absolute;pointer-events:none;border:2px dashed #7c9cff;border-radius:4px;box-shadow:0 0 0 4px rgba(124,156,255,0.12);z-index:999999;transition:top 0.3s ease,left 0.3s ease,width 0.3s ease,height 0.3s ease,opacity 0.2s ease;opacity:0;";
  document.body.appendChild(ov);
  function showOv(el) {
    if (!el) { ov.style.opacity = "0"; return; }
    var r = el.getBoundingClientRect();
    var sx = window.pageXOffset || 0, sy = window.pageYOffset || 0;
    ov.style.left = (r.left + sx - 4) + "px";
    ov.style.top = (r.top + sy - 4) + "px";
    ov.style.width = (r.width + 8) + "px";
    ov.style.height = (r.height + 8) + "px";
    ov.style.opacity = "1";
  }
  function findEl(sel, nth) {
    var el = null;
    if (sel) try { el = document.querySelector(sel); } catch(e) {}
    if (!el && nth) try { el = document.querySelector(nth); } catch(e) {}
    return el;
  }
  function smoothScroll(targetY, dur, cb) {
    var startY = window.pageYOffset || 0;
    var diff = targetY - startY;
    if (Math.abs(diff) < 2) { if (cb) cb(); return; }
    var t0 = performance.now();
    function step(now) {
      var t = Math.min(1, (now - t0) / dur);
      var ease = t < 0.5 ? 4*t*t*t : 1 - Math.pow(-2*t+2, 3) / 2;
      window.scrollTo(0, startY + diff * ease);
      if (t < 1) requestAnimationFrame(step);
      else { if (cb) cb(); }
    }
    requestAnimationFrame(step);
  }
  window.addEventListener("message", function(e) {
    if (!e.data || !e.data.type) return;
    if (e.data.type === "mx-highlight") {
      var el = findEl(e.data.selector, e.data.nthPath);
      showOv(el);
    }
    if (e.data.type === "mx-goto") {
      var el = findEl(e.data.selector, e.data.nthPath);
      if (!el) return;
      var r = el.getBoundingClientRect();
      var targetY = (window.pageYOffset || 0) + r.top - window.innerHeight / 2 + r.height / 2;
      smoothScroll(Math.max(0, targetY), 500, function() { showOv(el); });
      showOv(el);
    }
    if (e.data.type === "mx-pick-on") { document.body.style.cursor = "crosshair"; }
    if (e.data.type === "mx-pick-off") { document.body.style.cursor = ""; ov.style.opacity = "0"; }
    // Resolve path "0.1.2" to a real DOM element by walking filtered children.
    function resolvePathEl(pathStr) {
      var parts = pathStr.split(".").map(Number);
      var el = document.body;
      var skip = {script:1,noscript:1,style:1,link:1,meta:1,base:1,template:1};
      for (var i = 1; i < parts.length && el; i++) {
        var filtered = Array.from(el.children).filter(function(c) { return !skip[c.tagName.toLowerCase()]; });
        el = filtered[parts[i]] || null;
      }
      return el;
    }
    if (e.data.type === "mx-goto-path" && e.data.path) {
      var el = resolvePathEl(e.data.path);
      if (el) {
        var r = el.getBoundingClientRect();
        var targetY = (window.pageYOffset || 0) + r.top - window.innerHeight / 2 + r.height / 2;
        smoothScroll(Math.max(0, targetY), 400, function() { showOv(el); });
        showOv(el);
      }
    }
    if (e.data.type === "mx-highlight-path" && e.data.path) {
      var el = resolvePathEl(e.data.path);
      showOv(el);
    }
    if (e.data.type === "mx-clone-section") {
      try {
        var cel = findEl(e.data.selector, e.data.nthPath);
        if (!cel && e.data.path) cel = resolvePathEl(e.data.path);
        if (!cel) { window.parent.postMessage({ type: "mx-clone-result", error: "Element introuvable (sel=" + e.data.selector + " path=" + e.data.path + ")" }, "*"); return; }
        var allSt = [], ci = 0;
        var PROPS = "display,position,top,left,right,bottom,width,height,min-width,min-height,max-width,max-height,margin-top,margin-right,margin-bottom,margin-left,padding-top,padding-right,padding-bottom,padding-left,border-top-width,border-right-width,border-bottom-width,border-left-width,border-top-style,border-right-style,border-bottom-style,border-left-style,border-top-color,border-right-color,border-bottom-color,border-left-color,border-radius,background-color,background-image,background-size,background-position,background-repeat,color,font-family,font-size,font-weight,font-style,line-height,letter-spacing,text-align,text-decoration,text-transform,white-space,flex-direction,flex-wrap,flex-grow,flex-shrink,flex-basis,align-items,align-self,justify-content,gap,order,grid-template-columns,grid-template-rows,grid-template-areas,grid-column,grid-row,opacity,visibility,overflow,transform,transform-origin,box-shadow,text-shadow,filter,backdrop-filter,z-index,clip-path,object-fit,aspect-ratio".split(",");
        function walkClone(n, d) {
          if (n.nodeType !== 1 || d > 15) return;
          try {
            var cs = getComputedStyle(n);
            var cn = "mx-s" + (ci++);
            var st = {};
            for (var i = 0; i < PROPS.length; i++) {
              var v = cs.getPropertyValue(PROPS[i]);
              if (v) st[PROPS[i]] = v;
            }
            allSt.push({ c: cn, t: n.tagName.toLowerCase(), s: st });
            n.setAttribute("data-mx-clone", cn);
          } catch(ex) {}
          for (var j = 0; j < n.children.length; j++) walkClone(n.children[j], d + 1);
        }
        walkClone(cel, 0);
        var chtm = cel.outerHTML;
        cel.querySelectorAll("[data-mx-clone]").forEach(function(x) { x.removeAttribute("data-mx-clone"); });
        cel.removeAttribute("data-mx-clone");
        window.parent.postMessage({ type: "mx-clone-result", html: chtm, styles: allSt, animations: [], dimensions: { width: cel.offsetWidth, height: cel.offsetHeight } }, "*");
      } catch(err) {
        window.parent.postMessage({ type: "mx-clone-result", error: "Crash: " + err.message }, "*");
      }
    }
    if (e.data.type === "mx-toggle-vis") {
      var el = findEl(e.data.selector, e.data.nthPath);
      if (el) el.style.display = e.data.hidden ? "none" : "";
    }
    if (e.data.type === "mx-anim-init") {
      // Restart all CSS animations (they may have already finished)
      var toRestart = [];
      document.querySelectorAll("*").forEach(function(el) {
        var cs = getComputedStyle(el);
        if (cs.animationName && cs.animationName !== "none") toRestart.push(el);
      });
      toRestart.forEach(function(el) { el.style.animation = "none"; });
      void document.body.offsetHeight; // force reflow
      toRestart.forEach(function(el) { el.style.animation = ""; });
      // Enumerate and pause at t=0
      setTimeout(function() {
        var anims = document.getAnimations();
        anims.forEach(function(a) { a.pause(); a.currentTime = 0; });
        var info = anims.map(function(a, i) {
          var t = a.effect && a.effect.getComputedTiming ? a.effect.getComputedTiming() : {};
          var target = a.effect && a.effect.target;
          var tag = target ? target.tagName.toLowerCase() : "?";
          var cls = target && target.className && typeof target.className === "string" ? target.className.split(" ")[0] : "";
          return { i: i, name: a.animationName || a.id || ("anim-" + i), tag: tag, cls: cls, duration: t.duration || 0, delay: t.delay || 0, iterations: t.iterations, direction: t.direction, fill: t.fill, endTime: (t.delay || 0) + (t.duration || 0) * Math.min(t.iterations || 1, 10) };
        });
        window.parent.postMessage({ type: "mx-anim-data", animations: info }, "*");
      }, 50);
    }
    if (e.data.type === "mx-anim-play") { document.getAnimations().forEach(function(a) { a.play(); }); }
    if (e.data.type === "mx-anim-pause") { document.getAnimations().forEach(function(a) { a.pause(); }); }
    if (e.data.type === "mx-anim-seek") {
      var t = e.data.time || 0;
      document.getAnimations().forEach(function(a) { a.pause(); a.currentTime = t; });
    }
    if (e.data.type === "mx-anim-reset") {
      document.getAnimations().forEach(function(a) { a.pause(); a.currentTime = 0; });
    }
    if (e.data.type === "mx-get-dom") {
      function domToJson(node, depth) {
        if (node.nodeType !== 1 || depth > 12) return null;
        var tag = node.tagName.toLowerCase();
        var skip = {script:1,noscript:1,style:1,link:1,meta:1,base:1,template:1,iframe:1};
        if (skip[tag]) return null;
        if (tag === "svg" && node.children.length > 3 && node.querySelector("symbol")) return null;
        var children = [];
        for (var i = 0; i < node.children.length && children.length < 50; i++) {
          var c = domToJson(node.children[i], depth + 1);
          if (c) children.push(c);
        }
        // Visibility check
        var r = node.getBoundingClientRect();
        var cs = getComputedStyle(node);
        var hidden = (r.width === 0 && r.height === 0 && node.children.length === 0) ||
          cs.display === "none";
        // Analyze content to detect semantic role
        var text = (node.textContent || "").trim().slice(0, 80).replace(/\s+/g, " ");
        var innerTags = {};
        for (var j = 0; j < node.children.length; j++) {
          var ct = node.children[j].tagName.toLowerCase();
          innerTags[ct] = (innerTags[ct] || 0) + 1;
        }
        // Deep scan for key elements
        var has = {
          h1: !!node.querySelector("h1"),
          h2: !!node.querySelector("h2"),
          h3: !!node.querySelector("h3"),
          img: !!node.querySelector("img"),
          video: !!node.querySelector("video"),
          canvas: !!node.querySelector("canvas"),
          form: !!node.querySelector("form"),
          input: !!node.querySelector("input"),
          button: !!node.querySelector("button"),
          a: node.querySelectorAll("a").length,
          svg: !!node.querySelector("svg"),
        };
        var label = null;
        if (tag === "nav" || (has.a > 3 && r.height < 120)) label = "Navigation";
        else if (tag === "header" || (cs.position === "sticky" || cs.position === "fixed") && r.top < 10 && r.height < 150) label = "Header";
        else if (tag === "footer" || r.top > document.documentElement.scrollHeight - r.height - 100) label = "Footer";
        else if (tag === "video" || tag === "canvas") label = tag.charAt(0).toUpperCase() + tag.slice(1);
        else if (tag === "img" || tag === "picture") label = "Image";
        else if (tag === "form" || has.form || has.input) label = "Form";
        else if (has.h1 && r.height > 200) label = "Hero";
        else if (has.video) label = "Video Section";
        else if (has.canvas) label = "Canvas";
        else if (has.img && children.length > 2) label = "Gallery";
        else if (has.h2 && children.length >= 3) label = "Content Section";
        else if (has.h3 && children.length >= 3) label = "Cards";
        else if (has.button && !has.h2 && r.height < 300) label = "CTA";
        else if (tag === "section" || tag === "article") label = "Section";
        else if (tag === "a") label = "Link";
        else if (tag === "button") label = "Button";
        else if (/^h[1-6]$/.test(tag)) label = "Heading";
        else if (tag === "p") label = "Text";
        else if (tag === "ul" || tag === "ol") label = "List";
        // Detect by text content
        if (!label && text) {
          if (/pric|tarif|\\$|€/.test(text.toLowerCase()) || text.toLowerCase().indexOf("/mo") > -1) label = "Pricing";
          else if (/faq|question|asked/.test(text.toLowerCase())) label = "FAQ";
          else if (/testimoni|review|avis|client/.test(text.toLowerCase())) label = "Testimonials";
          else if (/feature|fonctionnalit/.test(text.toLowerCase())) label = "Features";
          else if (/contact|email|phone/.test(text.toLowerCase()) && has.form) label = "Contact";
        }
        return {
          tag: tag,
          id: node.id || "",
          cls: typeof node.className === "string" ? node.className.trim().split(/\\s+/).slice(0, 5).join(" ") : "",
          children: children,
          childCount: node.children.length,
          hidden: hidden,
          w: Math.round(r.width),
          h: Math.round(r.height),
          text: text.slice(0, 40),
          label: label,
        };
      }
      var tree = domToJson(document.body, 0);
      window.parent.postMessage({ type: "mx-dom-data", tree: tree }, "*");
    }
    if (e.data.type === "mx-reorder") {
      var src = findEl(e.data.srcSelector, e.data.srcNthPath);
      var dest = findEl(e.data.destSelector, e.data.destNthPath);
      if (src && dest && src !== dest && dest.parentNode) {
        dest.parentNode.insertBefore(src, dest);
      }
    }
  });
  // Pick mode
  document.addEventListener("mousemove", function(e) {
    if (document.body.style.cursor !== "crosshair") return;
    showOv(e.target);
  });
  document.addEventListener("click", function(e) {
    if (document.body.style.cursor !== "crosshair") return;
    e.preventDefault();
    e.stopPropagation();
    function cssPath(el) {
      if (!el || el === document.body) return "body";
      var segs = [], cur = el;
      for (var d = 0; cur && cur.tagName && cur.tagName !== "HTML" && cur.tagName !== "BODY" && d < 15; d++) {
        var seg = cur.tagName.toLowerCase();
        if (cur.id) { seg += "#" + cur.id; segs.unshift(seg); break; }
        if (cur.className && typeof cur.className === "string") {
          var cls = cur.className.trim().split(/\\s+/).filter(Boolean).slice(0, 2).join(".");
          if (cls) seg += "." + cls;
        }
        var p = cur.parentElement;
        if (p) { var sibs = Array.from(p.children).filter(function(c){return c.tagName===cur.tagName}); if (sibs.length>1) seg+=":nth-of-type("+(sibs.indexOf(cur)+1)+")"; }
        segs.unshift(seg);
        cur = p;
      }
      return segs.join(" > ");
    }
    window.parent.postMessage({ type: "mx-pick", selector: cssPath(e.target), html: e.target.outerHTML, tag: e.target.tagName.toLowerCase(), cls: e.target.className }, "*");
  }, true);
})();
<\/script>`;
const PORT = Number(process.env.PROXY_PORT) || 4000;

// Headers we strip from the proxied response (they'd block iframe/localhost).
const STRIP_RES = new Set([
  "content-security-policy",
  "content-security-policy-report-only",
  "x-frame-options",
  "strict-transport-security",
  "x-content-type-options",
  "cross-origin-opener-policy",
  "cross-origin-embedder-policy",
  "cross-origin-resource-policy",
  "permissions-policy",
  "feature-policy",
]);

// Headers we strip/rewrite on the outgoing request.
const STRIP_REQ = new Set(["host", "origin", "referer"]);

function proxyRequest(req, res) {
  // Build target URL: keep the path + query from the incoming request.
  const dest = new URL(req.url, targetUrl.origin);
  // Use the target's hostname for path-relative URLs.
  if (!req.url.startsWith("http")) {
    dest.hostname = targetUrl.hostname;
    dest.protocol = targetUrl.protocol;
    dest.port = targetUrl.port;
  }

  const headers = { ...req.headers };
  for (const h of STRIP_REQ) delete headers[h];
  headers["host"] = targetUrl.host;
  headers["origin"] = targetUrl.origin;
  headers["referer"] = targetUrl.href;

  const mod = dest.protocol === "https:" ? https : http;
  const proxyReq = mod.request(dest.href, {
    method: req.method,
    headers,
    rejectUnauthorized: false,
  }, (proxyRes) => {
    const resHeaders = {};
    for (const [k, v] of Object.entries(proxyRes.headers)) {
      if (!STRIP_RES.has(k.toLowerCase())) resHeaders[k] = v;
    }
    // Handle redirects: follow them server-side so the browser never sees
    // the external URL and stays inside the proxy iframe. For cross-domain
    // redirects (e.g. clerk.dev → clerk.com), also update the target.
    if (resHeaders.location && [301, 302, 303, 307, 308].includes(proxyRes.statusCode)) {
      try {
        const loc = new URL(resHeaders.location, targetUrl.origin);
        if (loc.hostname !== targetUrl.hostname && loc.hostname !== "localhost") {
          targetUrl = new URL(loc.origin);
        }
        // Follow the redirect server-side: rewrite to proxy and let
        // the browser re-request through us.
        loc.hostname = "localhost";
        loc.port = PORT;
        loc.protocol = "http:";
        resHeaders.location = loc.href;
        // Also strip the Refresh header that some CDNs add as backup.
        delete resHeaders.refresh;
        delete resHeaders.Refresh;
      } catch (e) {}
    }
    // Allow cross-origin from localhost.
    resHeaders["access-control-allow-origin"] = "*";
    resHeaders["access-control-allow-methods"] = "GET, POST, PUT, DELETE, OPTIONS";
    resHeaders["access-control-allow-headers"] = "*";

    const contentType = (resHeaders["content-type"] || "").toLowerCase();
    const isHtml = contentType.includes("text/html");

    if (isHtml) {
      // Buffer HTML responses to inject our inspection script.
      const chunks = [];
      const encoding = resHeaders["content-encoding"];
      // Remove content-encoding/length — we'll send uncompressed
      delete resHeaders["content-encoding"];
      delete resHeaders["content-length"];

      let stream = proxyRes;
      if (encoding === "gzip") {
        stream = proxyRes.pipe(require("zlib").createGunzip());
      } else if (encoding === "br") {
        stream = proxyRes.pipe(require("zlib").createBrotliDecompress());
      } else if (encoding === "deflate") {
        stream = proxyRes.pipe(require("zlib").createInflate());
      }

      stream.on("data", (c) => chunks.push(c));
      stream.on("end", () => {
        let html = Buffer.concat(chunks).toString("utf-8");
        // Inject frame-buster killer at the top of <head>
        html = html.replace(
          /<head[^>]*>/i,
          '$&<script>try{Object.defineProperty(window,"top",{get:function(){return window}});Object.defineProperty(window,"parent",{get:function(){return window}});Object.defineProperty(window,"frameElement",{get:function(){return null}});Object.defineProperty(window,"self",{get:function(){return window}});window.__iframeBypass=true}catch(e){}<\/script>'
        );
        // Strip meta CSP / X-Frame-Options that block iframe embedding
        html = html.replace(/<meta[^>]*http-equiv\s*=\s*["']?content-security-policy["']?[^>]*>/gi, "");
        html = html.replace(/<meta[^>]*http-equiv\s*=\s*["']?x-frame-options["']?[^>]*>/gi, "");
        // Inject inspection script before </body>
        html = html.replace(
          /<\/body>/i,
          INSPECT_SCRIPT + "\n</body>"
        );
        res.writeHead(proxyRes.statusCode, resHeaders);
        res.end(html);
      });
      stream.on("error", () => {
        res.writeHead(proxyRes.statusCode, resHeaders);
        res.end(Buffer.concat(chunks));
      });
    } else {
      res.writeHead(proxyRes.statusCode, resHeaders);
      proxyRes.pipe(res);
    }
  });
  proxyReq.on("error", (e) => {
    res.writeHead(502);
    res.end(`Proxy error: ${e.message}`);
  });
  req.pipe(proxyReq);
}

const server = http.createServer(proxyRequest);
server.listen(PORT, () => {
  console.log(`Proxy · ${targetUrl.origin} → http://localhost:${PORT}`);
  console.log(`Open http://localhost:${PORT} in your browser`);
});
