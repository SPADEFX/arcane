import { useEffect, useMemo, useRef, useState } from "react";
import { useLayerStore } from "../stores/layerStore";
import type { Layer } from "../types";
import { KindIcon } from "../utils/layerIcons";
import { AddLayerPopover } from "./AddLayerPopover";
import "./LayerManager.css";

function displayName(name: string): string {
  if (!name) return name;
  // Keep short all-uppercase acronyms as-is (CRT, VHS, RGB, ASCII)
  if (name.length <= 6 && name === name.toUpperCase() && /[A-Z]/.test(name)) {
    return name;
  }
  return name.charAt(0).toUpperCase() + name.slice(1);
}

type DropZone = "before" | "into" | "after";

interface Row {
  layer: Layer;
  depth: number;
  index: number; // flat index in store
}

export const LayerManager: React.FC = () => {
  const layers = useLayerStore((s) => s.layers);
  const selectedLayerId = useLayerStore((s) => s.selectedLayerId);
  const selectLayer = useLayerStore((s) => s.selectLayer);
  const removeLayer = useLayerStore((s) => s.removeLayer);
  const updateLayer = useLayerStore((s) => s.updateLayer);
  const reorderLayers = useLayerStore((s) => s.reorderLayers);
  const nestLayer = useLayerStore((s) => s.nestLayer);

  const addBtnRef = useRef<HTMLButtonElement>(null);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [dragId, setDragId] = useState<string | null>(null);
  const [overId, setOverId] = useState<string | null>(null);
  const [overZone, setOverZone] = useState<DropZone | null>(null);

  // Build top-down display rows: roots (top first) then their descendants
  const rows = useMemo(() => {
    const childrenOf = new Map<string, Layer[]>();
    for (const l of layers) {
      if (l.parentId) {
        const arr = childrenOf.get(l.parentId);
        if (arr) arr.push(l);
        else childrenOf.set(l.parentId, [l]);
      }
    }
    const rootsReversed = [...layers].filter((l) => !l.parentId).reverse();
    const out: Row[] = [];
    const walk = (layer: Layer, depth: number) => {
      out.push({ layer, depth, index: layers.findIndex((x) => x.id === layer.id) });
      const kids = (childrenOf.get(layer.id) ?? []).slice().reverse();
      for (const k of kids) walk(k, depth + 1);
    };
    for (const r of rootsReversed) walk(r, 0);
    return out;
  }, [layers]);

  // Force every element in the document to accept drop so the browser never
  // shows the "no-drop" cursor over layer children, even during the first
  // dragover event before state syncs. Uses capture phase so no child handler
  // can stop propagation before us.
  useEffect(() => {
    const onOver = (e: DragEvent) => {
      if (!e.dataTransfer) return;
      // Only hijack drag events that originated from our layer drag
      // (signaled by types containing text/plain we set in onDragStart).
      const types = e.dataTransfer.types;
      if (!types || !Array.from(types).includes("text/plain")) return;
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";
    };
    document.addEventListener("dragenter", onOver, { capture: true });
    document.addEventListener("dragover", onOver, { capture: true });
    return () => {
      document.removeEventListener("dragenter", onOver, { capture: true });
      document.removeEventListener("dragover", onOver, { capture: true });
    };
  }, []);

  const onDragStart = (e: React.DragEvent, id: string) => {
    setDragId(id);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", id);
  };

  const onDragOver = (e: React.DragEvent, id: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const y = e.clientY - rect.top;
    const h = rect.height;
    let zone: DropZone;
    if (y < h * 0.25) zone = "before";
    else if (y > h * 0.75) zone = "after";
    else zone = "into";
    if (overId !== id || overZone !== zone) {
      setOverId(id);
      setOverZone(zone);
    }
  };

  const onDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (!dragId || dragId === targetId) {
      cleanupDrag();
      return;
    }
    const target = layers.find((l) => l.id === targetId);
    const dragged = layers.find((l) => l.id === dragId);
    if (!target || !dragged) {
      cleanupDrag();
      return;
    }

    if (overZone === "into") {
      nestLayer(dragId, targetId);
    } else {
      if (dragged.parentId !== target.parentId) {
        nestLayer(dragId, target.parentId ?? null);
      }
      const freshLayers = useLayerStore.getState().layers;
      const fromIndex = freshLayers.findIndex((l) => l.id === dragId);
      const targetIndex = freshLayers.findIndex((l) => l.id === targetId);
      if (fromIndex >= 0 && targetIndex >= 0) {
        const toIndex = overZone === "before" ? targetIndex + 1 : targetIndex;
        reorderLayers(fromIndex, toIndex);
      }
    }
    cleanupDrag();
  };

  // Allow drop anywhere in the panel — silences the browser "no-drop" cursor
  const onPanelDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  // Drop onto empty space below list = drop after the bottom-most root (or unnest to top)
  const onTailDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (!dragId) {
      cleanupDrag();
      return;
    }
    const dragged = layers.find((l) => l.id === dragId);
    if (!dragged) {
      cleanupDrag();
      return;
    }
    if (dragged.parentId !== null) nestLayer(dragId, null);
    const fresh = useLayerStore.getState().layers;
    const fromIndex = fresh.findIndex((l) => l.id === dragId);
    if (fromIndex > 0) reorderLayers(fromIndex, 0);
    cleanupDrag();
  };

  const cleanupDrag = () => {
    setDragId(null);
    setOverId(null);
    setOverZone(null);
  };

  return (
    <div
      className="layer-manager glass-panel"
      onDragOver={onPanelDragOver}
      onDrop={(e) => e.preventDefault()}
    >
      <div className="lm-header" onDragOver={onPanelDragOver}>
        <span className="type-overline">Layers</span>
        <button
          ref={addBtnRef}
          type="button"
          className="lm-add-plus"
          onClick={() => setPopoverOpen((v) => !v)}
          aria-label="Add layer"
          title="Add layer"
        >
          <svg width="14" height="14" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true">
            <path d="M224,128a8,8,0,0,1-8,8H136v80a8,8,0,0,1-16,0V136H40a8,8,0,0,1,0-16h80V40a8,8,0,0,1,16,0v80h80A8,8,0,0,1,224,128Z" />
          </svg>
        </button>
        <AddLayerPopover
          anchorRef={addBtnRef}
          open={popoverOpen}
          onClose={() => setPopoverOpen(false)}
        />
      </div>

      <div className="lm-list" onDragOver={onPanelDragOver} onDrop={onTailDrop}>
        {rows.length === 0 ? (
          <p className="lm-empty type-caption">No layers.</p>
        ) : (
          rows.map(({ layer, depth }) => {
            const isDragging = dragId === layer.id;
            const isOverTarget = overId === layer.id && dragId !== null && !isDragging;
            const zoneCls = isOverTarget ? `drop-${overZone}` : "";
            return (
              <div
                key={layer.id}
                className={`lm-item ${selectedLayerId === layer.id ? "selected" : ""} ${
                  isDragging ? "dragging" : ""
                } ${layer.visible ? "" : "hidden-layer"} ${zoneCls}`}
                style={{ paddingLeft: `${10 + depth * 16}px` }}
                draggable
                onDragStart={(e) => onDragStart(e, layer.id)}
                onDragOver={(e) => onDragOver(e, layer.id)}
                onDrop={(e) => onDrop(e, layer.id)}
                onDragEnd={cleanupDrag}
                onClick={() => selectLayer(layer.id)}
                role="button"
                tabIndex={0}
              >
                {depth > 0 && <span className="lm-nest-indicator" aria-hidden />}
                <span className="lm-drag-handle" title="Drag to reorder or nest" aria-hidden="true">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="9" cy="5" r="1" />
                    <circle cx="9" cy="12" r="1" />
                    <circle cx="9" cy="19" r="1" />
                    <circle cx="15" cy="5" r="1" />
                    <circle cx="15" cy="12" r="1" />
                    <circle cx="15" cy="19" r="1" />
                  </svg>
                </span>
                <button
                  type="button"
                  className={`lm-eye ${layer.visible ? "on" : "off"}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    updateLayer(layer.id, { visible: !layer.visible });
                  }}
                  title={layer.visible ? "Hide layer" : "Show layer"}
                  aria-label={layer.visible ? "Hide layer" : "Show layer"}
                >
                  {layer.visible ? (
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  ) : (
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                      <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                      <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                      <line x1="2" y1="2" x2="22" y2="22" />
                    </svg>
                  )}
                </button>
                <span className="lm-name">{displayName(layer.name)}</span>
                {layer.compositeMode === "mask" && (
                  <span className="lm-mask-badge" title="Mask layer">M</span>
                )}
                <span className="lm-type-icon" title={layer.kind}>
                  <KindIcon kind={layer.kind} />
                </span>
                <button
                  type="button"
                  className="lm-action"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeLayer(layer.id);
                  }}
                  title="Delete"
                  aria-label="Delete layer"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 6h18" />
                    <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                    <line x1="10" y1="11" x2="10" y2="17" />
                    <line x1="14" y1="11" x2="14" y2="17" />
                  </svg>
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
