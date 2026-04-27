import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useSceneStore } from "../stores/sceneStore";
import { Select } from "./Select";
import "./SceneSettingsPopover.css";

interface Props {
  anchorRef: React.RefObject<HTMLButtonElement | null>;
  open: boolean;
  onClose: () => void;
}

export const SceneSettingsPopover: React.FC<Props> = ({
  anchorRef,
  open,
  onClose,
}) => {
  const scene = useSceneStore();
  const setS = useSceneStore((s) => s.set);
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<{ left: number; top: number }>({ left: 0, top: 0 });

  useLayoutEffect(() => {
    if (!open) return;
    const a = anchorRef.current;
    if (a) {
      const r = a.getBoundingClientRect();
      setPos({ left: Math.max(16, r.right - 320), top: r.bottom + 8 });
    }
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

  return createPortal(
    <div ref={ref} className="scene-popover" style={{ left: pos.left, top: pos.top }}>
      <div className="sp-header type-overline">Scene</div>
      <div className="sp-body">
        <Row label="Background">
          <input
            type="color"
            className="pp-color"
            value={rgbToHex(scene.backgroundColor)}
            onChange={(e) => setS({ backgroundColor: hexToRgb(e.target.value) })}
          />
        </Row>
        <Row label="Brightness">
          <RangeNum
            min={0}
            max={2}
            value={scene.brightness}
            onChange={(v) => setS({ brightness: v })}
          />
        </Row>
        <Row label="Contrast">
          <RangeNum
            min={0}
            max={3}
            value={scene.contrast}
            onChange={(v) => setS({ contrast: v })}
          />
        </Row>
        <Row label="Invert">
          <RangeNum
            min={0}
            max={1}
            value={scene.invert}
            onChange={(v) => setS({ invert: v })}
          />
        </Row>
        <Row label="Aspect">
          <Select
            value={scene.aspect}
            options={[
              { label: "Screen", value: "screen" },
              { label: "16:9", value: "16:9" },
              { label: "9:16", value: "9:16" },
              { label: "4:3", value: "4:3" },
              { label: "3:4", value: "3:4" },
              { label: "1:1", value: "1:1" },
            ]}
            onChange={(v) => setS({ aspect: v as never })}
          />
        </Row>
        <Row label="Render Scale">
          <Select
            value={scene.renderScale}
            options={[
              { label: "100%", value: 1 },
              { label: "75%", value: 0.75 },
              { label: "50%", value: 0.5 },
              { label: "25%", value: 0.25 },
            ]}
            onChange={(v) => setS({ renderScale: v })}
          />
        </Row>
        <Row label="DPI">
          <Select
            value={scene.dpi}
            options={[
              { label: "1.0", value: 1 },
              { label: "1.5", value: 1.5 },
              { label: "2.0", value: 2 },
            ]}
            onChange={(v) => setS({ dpi: v })}
          />
        </Row>
      </div>
    </div>,
    document.body,
  );
};

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="sp-row">
      <span className="sp-label">{label}</span>
      <div className="sp-control">{children}</div>
    </label>
  );
}

function RangeNum({
  min,
  max,
  value,
  onChange,
}: {
  min: number;
  max: number;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="sp-range-group">
      <input
        className="pp-range"
        type="range"
        min={min}
        max={max}
        step={(max - min) / 200}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
      />
      <input
        className="pp-num"
        type="number"
        min={min}
        max={max}
        step={(max - min) / 200}
        value={Number.isFinite(value) ? Number(value.toFixed(3)) : 0}
        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
      />
    </div>
  );
}

function rgbToHex([r, g, b]: [number, number, number]) {
  const to = (v: number) =>
    Math.max(0, Math.min(255, Math.round(v * 255))).toString(16).padStart(2, "0");
  return `#${to(r)}${to(g)}${to(b)}`;
}
function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  return [
    parseInt(h.slice(0, 2), 16) / 255,
    parseInt(h.slice(2, 4), 16) / 255,
    parseInt(h.slice(4, 6), 16) / 255,
  ];
}
