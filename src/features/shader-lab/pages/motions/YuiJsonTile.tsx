import { useEffect, useRef } from "react";

export interface YuiKeyframeStop {
  keyText: string;
  cssText: string;
}

export interface YuiNode {
  i: number;
  tag: string;
  cls: string | null;
  styles: Record<string, string>;
  vars?: Record<string, string>;
  animations?: unknown[];
}

export interface YuiMotionData {
  url: string;
  bodyHTML: string;
  keyframes: Record<string, YuiKeyframeStop[]>;
  nodes: YuiNode[];
}

interface Props {
  data: YuiMotionData;
  /** CSS scale factor applied to the imported tree (for tile fit). */
  scale?: number;
}

/**
 * Generic renderer: takes a motion-shaped JSON (see `extract-yui.js`) and
 * reconstructs the DOM with the extracted computed styles and @keyframes.
 *
 * This is plumbing — it does not contain motion-specific code. The behaviour of
 * any tile rendered through this component is entirely defined by the JSON
 * data passed in.
 */
export const YuiJsonTile: React.FC<Props> = ({ data, scale = 0.55 }) => {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    host.innerHTML = "";

    const styleEl = document.createElement("style");
    styleEl.textContent = Object.entries(data.keyframes)
      .map(([name, stops]) => {
        const body = stops.map((s) => `${s.keyText}{${s.cssText}}`).join("");
        return `@keyframes ${name}{${body}}`;
      })
      .join("\n");
    host.appendChild(styleEl);

    const wrapper = document.createElement("div");
    wrapper.className = "yui-motion-root";
    wrapper.innerHTML = data.bodyHTML;
    host.appendChild(wrapper);

    const all = wrapper.querySelectorAll("body *");
    for (const node of data.nodes) {
      const el = all[node.i] as HTMLElement | undefined;
      if (!el || !el.style) continue;
      for (const [k, v] of Object.entries(node.styles)) {
        try {
          el.style.setProperty(k, v);
        } catch {
          /* ignore invalid */
        }
      }
      if (node.vars) {
        for (const [k, v] of Object.entries(node.vars)) {
          el.style.setProperty(k, v);
        }
      }
    }

    return () => {
      host.innerHTML = "";
    };
  }, [data]);

  return (
    <div
      className="yui-json-outer"
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        ref={hostRef}
        style={{
          transform: `scale(${scale})`,
          transformOrigin: "center center",
        }}
      />
    </div>
  );
};
