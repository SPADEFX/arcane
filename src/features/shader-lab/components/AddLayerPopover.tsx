import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useLayerStore } from "../stores/layerStore";
import type { LayerKind } from "../types";
import {
  CATEGORIES,
  EFFECTS,
  type EffectDef,
} from "../utils/effectCatalog";
import "./AddLayerPopover.css";

interface Props {
  anchorRef: React.RefObject<HTMLButtonElement | null>;
  open: boolean;
  onClose: () => void;
}

type CategoryKey = (typeof CATEGORIES)[number]["key"];

const SOURCE_PILLS: { label: string; kind: LayerKind }[] = [
  { label: "Image", kind: "image" },
  { label: "Video", kind: "video" },
  { label: "Webcam", kind: "webcam" },
  { label: "Text", kind: "text" },
  { label: "Mesh Gradient", kind: "meshGradient" },
  { label: "3D Model", kind: "model" },
  { label: "Custom Shader", kind: "customShader" },
];

export const AddLayerPopover: React.FC<Props> = ({
  anchorRef,
  open,
  onClose,
}) => {
  const addLayer = useLayerStore((s) => s.addLayer);
  const setAsset = useLayerStore((s) => s.setAsset);
  const popoverRef = useRef<HTMLDivElement>(null);
  const [category, setCategory] = useState<CategoryKey>("all");
  const [search, setSearch] = useState("");
  const [pos, setPos] = useState<{ left: number; top: number }>({
    left: 308,
    top: 84,
  });
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  useLayoutEffect(() => {
    if (!open) return;
    const a = anchorRef.current;
    if (a) {
      const r = a.getBoundingClientRect();
      setPos({ left: r.right + 12, top: r.top });
    }
  }, [open, anchorRef]);

  useEffect(() => {
    if (!open) return;
    const update = () => {
      const a = anchorRef.current;
      if (!a) return;
      const r = a.getBoundingClientRect();
      setPos({ left: r.right + 12, top: r.top });
    };
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, true);
    const handler = (e: MouseEvent) => {
      const t = e.target as Node;
      if (popoverRef.current?.contains(t) || anchorRef.current?.contains(t)) return;
      onClose();
    };
    const esc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("mousedown", handler);
    window.addEventListener("keydown", esc);
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update, true);
      window.removeEventListener("mousedown", handler);
      window.removeEventListener("keydown", esc);
    };
  }, [open, onClose, anchorRef]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return EFFECTS.filter((e) => {
      if (category !== "all" && e.category !== category) return false;
      if (q && !e.label.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [category, search]);

  if (!open) return null;

  const handleSource = async (kind: LayerKind) => {
    if (kind === "image") {
      imageInputRef.current?.click();
      return;
    }
    if (kind === "video") {
      videoInputRef.current?.click();
      return;
    }
    addLayer(kind);
    onClose();
  };

  const handleFile = (
    e: React.ChangeEvent<HTMLInputElement>,
    kind: "image" | "video",
  ) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    const url = URL.createObjectURL(file);
    const id = addLayer(kind, file.name);
    setAsset(id, { url });
    onClose();
  };

  const handleAdd = (def: EffectDef) => {
    addLayer(def.kind);
    onClose();
  };

  const node = (
    <div
      ref={popoverRef}
      className="add-popover"
      style={{ left: pos.left, top: pos.top }}
    >
      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={(e) => handleFile(e, "image")}
      />
      <input
        ref={videoInputRef}
        type="file"
        accept="video/*"
        style={{ display: "none" }}
        onChange={(e) => handleFile(e, "video")}
      />

      <div className="ap-section">
        <div className="ap-section-label type-overline">Source</div>
        <div className="ap-source-row">
          {SOURCE_PILLS.map((s) => (
            <button
              key={s.label}
              type="button"
              className="ap-pill"
              onClick={() => handleSource(s.kind)}
              title={`Add ${s.label}`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div className="ap-toolbar">
        <div className="ap-tabs">
          {CATEGORIES.map((c) => (
            <button
              key={c.key}
              type="button"
              className={`ap-tab ${category === c.key ? "active" : ""}`}
              onClick={() => setCategory(c.key)}
            >
              <span>{c.label}</span>
            </button>
          ))}
        </div>
        <input
          className="ap-search"
          type="text"
          placeholder="Search effects…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="ap-grid-wrap">
        <div className="ap-grid">
          {filtered.map((p) => (
            <button
              key={p.kind}
              type="button"
              className="ap-card"
              onClick={() => handleAdd(p)}
            >
              <div className="ap-thumb-wrap">
                <div className="ap-thumb" style={{ background: p.preview }} />
              </div>
              <div className="ap-card-label">{p.label}</div>
            </button>
          ))}
          {filtered.length === 0 && (
            <div className="ap-empty type-caption">No matches.</div>
          )}
        </div>
      </div>
    </div>
  );

  return createPortal(node, document.body);
};
