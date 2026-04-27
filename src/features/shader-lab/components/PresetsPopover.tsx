import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useLayerStore } from "../stores/layerStore";
import { materializePreset, PRESETS } from "../utils/presets";
import "./PresetsPopover.css";

interface Props {
  anchorRef: React.RefObject<HTMLButtonElement | null>;
  open: boolean;
  onClose: () => void;
}

export const PresetsPopover: React.FC<Props> = ({
  anchorRef,
  open,
  onClose,
}) => {
  const loadProject = useLayerStore((s) => s.loadProject);
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<{ left: number; top: number }>({ left: 0, top: 0 });

  useLayoutEffect(() => {
    if (!open || !anchorRef.current) return;
    const r = anchorRef.current.getBoundingClientRect();
    const w = 540;
    setPos({
      left: Math.max(16, Math.min(window.innerWidth - w - 16, r.left - w / 2 + r.width / 2)),
      top: r.bottom + 8,
    });
  }, [open, anchorRef]);

  useEffect(() => {
    if (!open) return;
    const h = (e: MouseEvent) => {
      const t = e.target as Node;
      if (ref.current?.contains(t) || anchorRef.current?.contains(t)) return;
      onClose();
    };
    const esc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("mousedown", h);
    window.addEventListener("keydown", esc);
    return () => {
      window.removeEventListener("mousedown", h);
      window.removeEventListener("keydown", esc);
    };
  }, [open, onClose, anchorRef]);

  if (!open) return null;

  const apply = (id: string) => {
    const preset = PRESETS.find((p) => p.id === id);
    if (!preset) return;
    loadProject(materializePreset(preset));
    onClose();
  };

  return createPortal(
    <div ref={ref} className="presets-popover" style={{ left: pos.left, top: pos.top }}>
      <div className="pr-header">
        <span className="type-overline">Presets</span>
        <span className="pr-subtitle type-caption">Replaces current layers.</span>
      </div>
      <div className="pr-grid">
        {PRESETS.map((p) => (
          <button
            key={p.id}
            type="button"
            className="pr-card"
            onClick={() => apply(p.id)}
            title={p.description}
          >
            <div className="pr-thumb" style={{ background: p.thumbnail }} />
            <div className="pr-meta">
              <span className="pr-name">{p.label}</span>
              <span className="pr-desc">{p.description}</span>
            </div>
          </button>
        ))}
      </div>
    </div>,
    document.body,
  );
};
