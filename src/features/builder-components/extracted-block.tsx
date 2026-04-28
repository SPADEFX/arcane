/**
 * Runtime renderer for extracted components stored in IndexedDB.
 * Renders raw HTML + scoped CSS inside a Shadow DOM for isolation.
 */
import { useEffect, useRef } from "react";

export function createExtractedBlock(code: string, css: string, rawHtml?: string) {
  // Use raw HTML if available (from surgical extraction), otherwise try code
  const htmlContent = rawHtml || code;

  return function ExtractedBlock(_props: Record<string, unknown>) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
      if (!ref.current) return;
      // Use Shadow DOM to isolate the extracted CSS from the builder's styles
      let shadow = ref.current.shadowRoot;
      if (!shadow) shadow = ref.current.attachShadow({ mode: "open" });
      shadow.innerHTML = `<style>${css}</style>${htmlContent}`;
    }, []);

    return <div ref={ref} style={{ width: "100%" }} />;
  };
}
