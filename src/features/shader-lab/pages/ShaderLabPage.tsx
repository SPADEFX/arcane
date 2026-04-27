import { useEffect } from "react";
import { Canvas } from "../components/Canvas";
import { LayerManager } from "../components/LayerManager";
import { PropertiesPanel } from "../components/PropertiesPanel";
import { Timeline } from "../components/Timeline";
import { Toolbar } from "../components/Toolbar";
import { useTimelineStore } from "../stores/timelineStore";

export const ShaderLabPage: React.FC = () => {
  const panelHeight = useTimelineStore((s) => s.panelHeight);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== " " && e.code !== "Space") return;
      const t = e.target as HTMLElement | null;
      if (!t) return;
      const tag = t.tagName;
      if (tag === "TEXTAREA" || t.isContentEditable) return;
      if (tag === "INPUT") {
        const type = (t as HTMLInputElement).type;
        const textLikeTypes = [
          "text",
          "password",
          "email",
          "number",
          "tel",
          "url",
          "search",
          "date",
          "datetime-local",
          "month",
          "time",
          "week",
        ];
        if (textLikeTypes.includes(type)) return;
      }
      e.preventDefault();
      e.stopPropagation();
      const active = document.activeElement;
      if (active instanceof HTMLElement && active !== document.body) {
        active.blur();
      }
      useTimelineStore.getState().toggle();
    };
    window.addEventListener("keydown", onKey, { capture: true });
    return () =>
      window.removeEventListener("keydown", onKey, { capture: true });
  }, []);

  return (
    <>
      <div className="viewport-fullscreen">
        <Canvas />
      </div>

      <div className="toolbar-floating">
        <Toolbar />
      </div>

      <div className="sidebar-floating left">
        <LayerManager />
      </div>

      <div className="sidebar-floating right">
        <PropertiesPanel />
      </div>

      <div className="timeline-floating" style={{ height: panelHeight }}>
        <Timeline />
      </div>
    </>
  );
};
