/**
 * Runtime renderer for extracted components stored in IndexedDB.
 * Renders raw HTML + scoped CSS inside a Shadow DOM for isolation.
 * Also injects external stylesheets into the main document for font loading.
 */
import { useEffect, useRef } from "react";

export function createExtractedBlock(code: string, css: string, rawHtml?: string) {
  const htmlContent = rawHtml || code;

  // Extract @import URLs from CSS to inject as <link> in main document
  // (fonts declared in @import inside Shadow DOM don't propagate)
  const importUrls: string[] = [];
  css.replace(/@import\s+url\(["']?([^"')]+)["']?\)/g, (_, url) => {
    importUrls.push(url);
    return _;
  });

  return function ExtractedBlock(_props: Record<string, unknown>) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
      if (!ref.current) return;

      // Inject external stylesheets into main document for font loading
      for (const url of importUrls) {
        const id = "ext-css-" + url.replace(/[^a-z0-9]/gi, "").slice(0, 32);
        if (!document.getElementById(id)) {
          const link = document.createElement("link");
          link.id = id;
          link.rel = "stylesheet";
          link.href = url;
          document.head.appendChild(link);
        }
      }

      // Render in Shadow DOM for CSS isolation
      let shadow = ref.current.shadowRoot;
      if (!shadow) shadow = ref.current.attachShadow({ mode: "open" });
      shadow.innerHTML = `<style>${css}</style>${htmlContent}`;
    }, []);

    return <div ref={ref} style={{ width: "100%" }} />;
  };
}
