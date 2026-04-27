import { useMemo, useRef, useState } from "react";
import { useLayerStore } from "../stores/layerStore";
import { useTimelineStore } from "../stores/timelineStore";
import type { Easing, Layer, PropertyTrack } from "../types";
import { EFFECTS_BY_KIND } from "../utils/effectCatalog";
import { layerColor } from "../utils/layerColor";
import "./Timeline.css";

function displayName(name: string): string {
  if (!name) return name;
  if (name.length <= 6 && name === name.toUpperCase() && /[A-Z]/.test(name)) {
    return name;
  }
  return name.charAt(0).toUpperCase() + name.slice(1);
}

interface Row {
  layer: Layer;
  depth: number;
  hasChildren: boolean;
}

const EASINGS: Easing[] = [
  "linear",
  "easeIn",
  "easeOut",
  "easeInOut",
  "bounce",
  "spring",
];

export const Timeline: React.FC = () => {
  const isPlaying = useTimelineStore((s) => s.isPlaying);
  const currentTime = useTimelineStore((s) => s.currentTime);
  const duration = useTimelineStore((s) => s.duration);
  const loop = useTimelineStore((s) => s.loop);
  const autoKey = useTimelineStore((s) => s.autoKey);
  const toggle = useTimelineStore((s) => s.toggle);
  const reset = useTimelineStore((s) => s.reset);
  const setCurrentTime = useTimelineStore((s) => s.setCurrentTime);
  const setDuration = useTimelineStore((s) => s.setDuration);
  const setLoop = useTimelineStore((s) => s.setLoop);
  const setAutoKey = useTimelineStore((s) => s.setAutoKey);
  const setPanelHeight = useTimelineStore((s) => s.setPanelHeight);

  const layers = useLayerStore((s) => s.layers);
  const selectedLayerId = useLayerStore((s) => s.selectedLayerId);
  const selectLayer = useLayerStore((s) => s.selectLayer);
  const updateLayer = useLayerStore((s) => s.updateLayer);
  const removeLayer = useLayerStore((s) => s.removeLayer);

  const [collapsed, setCollapsed] = useState(false);
  const [collapsePending, setCollapsePending] = useState(false);
  const [collapsedLayerIds, setCollapsedLayerIds] = useState<Set<string>>(
    () => new Set(),
  );
  const rulerRef = useRef<HTMLDivElement>(null);

  const toggleLayerCollapsed = (id: string) => {
    setCollapsedLayerIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Build nested, collapse-aware row list: roots top-first, descendants indented,
  // children of a collapsed parent skipped entirely.
  const rows = useMemo<Row[]>(() => {
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
      const kids = (childrenOf.get(layer.id) ?? []).slice().reverse();
      out.push({ layer, depth, hasChildren: kids.length > 0 });
      if (collapsedLayerIds.has(layer.id)) return;
      for (const k of kids) walk(k, depth + 1);
    };
    for (const r of rootsReversed) walk(r, 0);
    return out;
  }, [layers, collapsedLayerIds]);

  const ticks = buildTicks(duration);

  const onScrubMouse = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!rulerRef.current) return;
    const updateFromEvent = (clientX: number) => {
      if (!rulerRef.current) return;
      const rect = rulerRef.current.getBoundingClientRect();
      const pct = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      setCurrentTime(pct * duration);
    };
    updateFromEvent(e.clientX);
    const move = (ev: MouseEvent) => updateFromEvent(ev.clientX);
    const up = () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
    };
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
  };

  return (
    <div
      className={`timeline glass-panel ${collapsed ? "collapsed" : ""} ${
        collapsePending ? "collapse-pending" : ""
      }`}
      style={{ height: collapsed ? 48 : "100%" }}
    >
      <div
        className={`tl-resize-handle ${collapsed ? "on-collapsed" : ""} ${
          collapsePending ? "pending" : ""
        }`}
        title={
          collapsed
            ? "Drag up to expand"
            : "Drag to resize · drop near bottom to collapse"
        }
        onMouseDown={(e) => {
          e.preventDefault();
          const wasCollapsed = collapsed;
          const startY = e.clientY;
          const COLLAPSE_THRESHOLD = 150;
          let startH: number;
          if (wasCollapsed) {
            startH = 48;
            setPanelHeight(48);
            setCollapsed(false);
          } else {
            startH = useTimelineStore.getState().panelHeight;
          }
          const onMove = (ev: MouseEvent) => {
            const dy = startY - ev.clientY;
            const h = startH + dy;
            setPanelHeight(h);
            setCollapsePending(h <= COLLAPSE_THRESHOLD);
          };
          const onUp = () => {
            window.removeEventListener("mousemove", onMove);
            window.removeEventListener("mouseup", onUp);
            document.body.style.userSelect = "";
            document.body.style.cursor = "";
            setCollapsePending(false);
            const finalH = useTimelineStore.getState().panelHeight;
            if (finalH <= COLLAPSE_THRESHOLD) {
              setCollapsed(true);
              setPanelHeight(420);
            }
          };
          document.body.style.userSelect = "none";
          document.body.style.cursor = "ns-resize";
          window.addEventListener("mousemove", onMove);
          window.addEventListener("mouseup", onUp);
        }}
      >
        {collapsePending && <span className="tl-collapse-hint">Release to collapse</span>}
      </div>
      <div className="tl-topbar">
        <div className="tl-group">
          <button
            className={`icon-btn ${isPlaying ? "active" : ""}`}
            type="button"
            onClick={toggle}
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? (
              <svg width="14" height="14" viewBox="0 0 256 256" fill="currentColor">
                <path d="M216,48V208a16,16,0,0,1-16,16H160a16,16,0,0,1-16-16V48a16,16,0,0,1,16-16h40A16,16,0,0,1,216,48ZM96,32H56A16,16,0,0,0,40,48V208a16,16,0,0,0,16,16H96a16,16,0,0,0,16-16V48A16,16,0,0,0,96,32Z" />
              </svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 256 256" fill="currentColor">
                <path d="M232.4,114.49,88.32,26.35a16,16,0,0,0-16.2-.3A15.86,15.86,0,0,0,64,39.87V216.13A15.86,15.86,0,0,0,72.12,230a16.06,16.06,0,0,0,16.2-.3l144.08-88.14a15.88,15.88,0,0,0,0-27.06Z" />
              </svg>
            )}
          </button>
          <button
            className="icon-btn"
            type="button"
            onClick={reset}
            aria-label="Stop playback"
          >
            <svg width="14" height="14" viewBox="0 0 256 256" fill="currentColor">
              <path d="M216,56V200a16,16,0,0,1-16,16H56a16,16,0,0,1-16-16V56A16,16,0,0,1,56,40H200A16,16,0,0,1,216,56Z" />
            </svg>
          </button>
        </div>
        <span className="divider" />
        <div className="tl-group">
          <button
            className={`pill-btn ${loop ? "active" : ""}`}
            type="button"
            onClick={() => setLoop(!loop)}
          >
            Loop
          </button>
          <button
            className={`pill-btn ${autoKey ? "active" : ""}`}
            type="button"
            onClick={() => setAutoKey(!autoKey)}
            title="Auto-key changes at current time"
          >
            ● Auto-Key
          </button>
        </div>
        <span className="divider" />
        <div className="tl-group">
          <span className="type-mono-sm">Dur</span>
          <input
            aria-label="Timeline duration in seconds"
            className="tl-dur-input"
            type="number"
            min={1}
            max={120}
            step={1}
            value={duration}
            onChange={(e) => setDuration(parseFloat(e.target.value) || 1)}
          />
          <span className="type-mono-sm">sec</span>
        </div>
        <div className="tl-group tl-spacer">
          <span className="type-mono-md tl-time">
            {currentTime.toFixed(2)}s / {duration.toFixed(2)}s
          </span>
          <button
            className="icon-btn"
            type="button"
            onClick={() => setCollapsed(!collapsed)}
            aria-label={collapsed ? "Expand timeline panel" : "Collapse timeline panel"}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 256 256"
              fill="currentColor"
              style={{
                transform: collapsed ? "rotate(180deg)" : "none",
                transition: "transform 0.16s var(--ease-out-cubic)",
              }}
            >
              <path d="M216.49,104.49l-80,80a12,12,0,0,1-17,0l-80-80a12,12,0,0,1,17-17L128,159l71.51-71.52a12,12,0,0,1,17,17Z" />
            </svg>
          </button>
        </div>
      </div>

      {!collapsed && (
        <div className="tl-body">
          <div className="tl-sidebar">
            <div className="type-overline tl-sidebar-label">Tracks</div>
            {rows.length === 0 ? (
              <div className="tl-empty type-caption">No layers.</div>
            ) : (
              rows.map(({ layer: l, depth, hasChildren }) => {
                const color = layerColor(l.id);
                const isCollapsed = collapsedLayerIds.has(l.id);
                const canCollapse = hasChildren || l.tracks.length > 0;
                return (
                  <div key={l.id} className="tl-layer-group">
                    <div
                      className={`tl-layer-header ${l.id === selectedLayerId ? "selected" : ""} ${l.visible ? "" : "hidden-layer"}`}
                      onClick={() => selectLayer(l.id)}
                      title={displayName(l.name)}
                      style={{ paddingLeft: `${12 + depth * 14}px` }}
                    >
                      <button
                        type="button"
                        className={`tl-chev ${isCollapsed ? "collapsed" : ""} ${canCollapse ? "" : "empty"}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (canCollapse) toggleLayerCollapsed(l.id);
                        }}
                        tabIndex={canCollapse ? 0 : -1}
                        aria-label={isCollapsed ? "Expand" : "Collapse"}
                        title={isCollapsed ? "Expand" : "Collapse"}
                      >
                        {canCollapse && (
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                            <path d="M9 6l6 6-6 6" />
                          </svg>
                        )}
                      </button>
                      <span
                        className="tl-layer-dot"
                        style={{ background: color }}
                      />
                      <button
                        type="button"
                        className={`tl-eye ${l.visible ? "on" : "off"}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          updateLayer(l.id, { visible: !l.visible });
                        }}
                        title={l.visible ? "Hide layer" : "Show layer"}
                        aria-label={l.visible ? "Hide layer" : "Show layer"}
                      >
                        {l.visible ? (
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                            <circle cx="12" cy="12" r="3" />
                          </svg>
                        ) : (
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                            <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                            <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                            <line x1="2" y1="2" x2="22" y2="22" />
                          </svg>
                        )}
                      </button>
                      <span className="tl-layer-name">{displayName(l.name)}</span>
                      <button
                        type="button"
                        className="tl-layer-delete"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeLayer(l.id);
                        }}
                        title="Delete layer"
                        aria-label="Delete layer"
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                          <path d="M3 6h18" />
                          <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                          <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                          <line x1="10" y1="11" x2="10" y2="17" />
                          <line x1="14" y1="11" x2="14" y2="17" />
                        </svg>
                      </button>
                    </div>
                    {!isCollapsed &&
                      l.tracks.map((t) => (
                        <TrackLabel
                          key={t.property}
                          layer={l}
                          track={t}
                          color={color}
                          depth={depth}
                        />
                      ))}
                  </div>
                );
              })
            )}
          </div>

          <div className="tl-main">
            <div
              ref={rulerRef}
              className="tl-ruler"
              onMouseDown={onScrubMouse}
            >
              {ticks.map((t) => (
                <span
                  key={t.t}
                  className={`tl-tick ${t.major ? "major" : ""}`}
                  style={{ left: `${(t.t / duration) * 100}%` }}
                >
                  {t.major && (
                    <span className={`tl-tick-label align-${t.align}`}>
                      {t.label}
                    </span>
                  )}
                </span>
              ))}
            </div>

            {/* Vertical guide lines extending below the ruler through all track rows */}
            <div className="tl-grid" aria-hidden>
              {ticks
                .filter((t) => t.major)
                .map((t) => (
                  <span
                    key={t.t}
                    className="tl-grid-line"
                    style={{ left: `${(t.t / duration) * 100}%` }}
                  />
                ))}
            </div>

            <div className="tl-playhead-wrap">
              <div
                className="tl-playhead"
                style={{ left: `${(currentTime / duration) * 100}%` }}
              />
            </div>

            <div className="tl-tracks">
              {rows.map(({ layer: l }) => {
                const color = layerColor(l.id);
                const isCollapsed = collapsedLayerIds.has(l.id);
                return (
                  <div key={l.id} className="tl-layer-track-group">
                    <div className={`tl-layer-spacer ${l.visible ? "" : "hidden-layer"}`}>
                      <ClipBar layer={l} duration={duration} color={color} />
                    </div>
                    {!isCollapsed &&
                      l.tracks.map((track) => (
                        <TrackRow
                          key={track.property}
                          layer={l}
                          track={track}
                          duration={duration}
                          color={color}
                        />
                      ))}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

function TrackLabel({
  layer,
  track,
  color,
  depth,
}: {
  layer: Layer;
  track: PropertyTrack;
  color: string;
  depth: number;
}) {
  const clearTrack = useLayerStore((s) => s.clearTrack);
  const label = prettyPath(track.property, layer);
  // Parent layer dot's horizontal center (matches tl-layer-header layout:
  // paddingLeft 12 + depth*14 + chev 14 + gap 7 + dot halfWidth 4)
  const branchLeft = 12 + depth * 14 + 14 + 7 + 4;
  return (
    <div
      className="tl-track-label"
      title={track.property}
      style={
        {
          ["--tl-track-color" as string]: color,
          ["--tl-branch-left" as string]: `${branchLeft}px`,
          paddingLeft: `${branchLeft + 24}px`,
        } as React.CSSProperties
      }
    >
      <span className="tl-track-branch" aria-hidden />
      <span className="tl-track-name">{label}</span>
      <button
        type="button"
        className="tl-track-clear"
        onClick={() => clearTrack(layer.id, track.property)}
        title="Clear track"
        aria-label="Clear track"
      >
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 6 L6 18 M6 6 L18 18" />
        </svg>
      </button>
    </div>
  );
}

function TrackRow({
  layer,
  track,
  duration,
  color,
}: {
  layer: Layer;
  track: PropertyTrack;
  duration: number;
  color: string;
}) {
  const moveKeyframe = useLayerStore((s) => s.moveKeyframe);
  const removeKeyframe = useLayerStore((s) => s.removeKeyframe);
  const setKeyframeEasing = useLayerStore((s) => s.setKeyframeEasing);
  const [menuFor, setMenuFor] = useState<number | null>(null);
  const rowRef = useRef<HTMLDivElement>(null);

  const dragKeyframe = (
    e: React.MouseEvent<HTMLSpanElement>,
    time: number,
  ) => {
    e.stopPropagation();
    if (!rowRef.current) return;
    const rect = rowRef.current.getBoundingClientRect();
    let currentTime = time;
    const move = (ev: MouseEvent) => {
      const pct = Math.max(0, Math.min(1, (ev.clientX - rect.left) / rect.width));
      const newTime = pct * duration;
      moveKeyframe(layer.id, track.property, currentTime, newTime);
      currentTime = newTime;
    };
    const up = () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
    };
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
  };

  return (
    <div className="tl-track-row" ref={rowRef}>
      {track.keyframes.map((k) => (
        <span
          key={k.time}
          className="tl-kf"
          style={{
            left: `${(k.time / duration) * 100}%`,
            background: color,
            boxShadow: `0 0 0 1px rgba(0, 0, 0, 0.5), 0 0 8px ${color}55`,
          }}
          onMouseDown={(e) => dragKeyframe(e, k.time)}
          onContextMenu={(e) => {
            e.preventDefault();
            setMenuFor(menuFor === k.time ? null : k.time);
          }}
          onDoubleClick={(e) => {
            e.stopPropagation();
            removeKeyframe(layer.id, track.property, k.time);
          }}
          title={`${k.time.toFixed(2)}s · ${k.easing ?? "easeInOut"} (drag · right-click easing · dbl-click remove)`}
        />
      ))}
      {menuFor !== null &&
        (() => {
          const kf = track.keyframes.find(
            (k) => Math.abs(k.time - menuFor) < 0.005,
          );
          if (!kf) return null;
          return (
            <div
              className="tl-kf-menu"
              style={{ left: `${(kf.time / duration) * 100}%` }}
            >
              {EASINGS.map((ez) => (
                <button
                  key={ez}
                  type="button"
                  className={(kf.easing ?? "easeInOut") === ez ? "active" : ""}
                  onClick={() => {
                    setKeyframeEasing(layer.id, track.property, kf.time, ez);
                    setMenuFor(null);
                  }}
                >
                  {ez}
                </button>
              ))}
            </div>
          );
        })()}
    </div>
  );
}

function ClipBar({
  layer,
  duration,
  color,
}: {
  layer: Layer;
  duration: number;
  color: string;
}) {
  const setClip = useLayerStore((s) => s.setClip);
  const clipIn = layer.clipIn ?? 0;
  const clipOut = layer.clipOut ?? duration;
  const leftPct = (Math.max(0, Math.min(duration, clipIn)) / duration) * 100;
  const rightPct = (Math.max(0, Math.min(duration, clipOut)) / duration) * 100;
  const isTrimmed = layer.clipIn !== undefined || layer.clipOut !== undefined;

  const dragEdge = (
    e: React.MouseEvent<HTMLSpanElement>,
    edge: "in" | "out",
  ) => {
    e.preventDefault();
    e.stopPropagation();
    const rect = (
      e.currentTarget.parentElement as HTMLElement
    ).parentElement!.getBoundingClientRect();
    const move = (ev: MouseEvent) => {
      const pct = Math.max(0, Math.min(1, (ev.clientX - rect.left) / rect.width));
      const t = pct * duration;
      if (edge === "in") {
        const newIn = Math.min(t, clipOut - 0.05);
        setClip(layer.id, newIn, layer.clipOut ?? duration);
      } else {
        const newOut = Math.max(t, clipIn + 0.05);
        setClip(layer.id, layer.clipIn ?? 0, newOut);
      }
    };
    const up = () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
    };
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
  };

  const dragBody = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const rect = (e.currentTarget.parentElement as HTMLElement).getBoundingClientRect();
    const startX = e.clientX;
    const startIn = clipIn;
    const startOut = clipOut;
    const move = (ev: MouseEvent) => {
      const dxPct = (ev.clientX - startX) / rect.width;
      const dt = dxPct * duration;
      const span = startOut - startIn;
      let newIn = startIn + dt;
      let newOut = startOut + dt;
      if (newIn < 0) {
        newIn = 0;
        newOut = span;
      }
      if (newOut > duration) {
        newOut = duration;
        newIn = duration - span;
      }
      setClip(layer.id, newIn, newOut);
    };
    const up = () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
    };
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
  };

  return (
    <div className={`tl-clip ${isTrimmed ? "trimmed" : ""}`}>
      <div
        className="tl-clip-body"
        style={{
          left: `${leftPct}%`,
          right: `${100 - rightPct}%`,
          borderColor: `${color}55`,
          background: `${color}14`,
        }}
        onMouseDown={dragBody}
        onDoubleClick={() => setClip(layer.id, undefined, undefined)}
        title={`Clip: ${clipIn.toFixed(2)}s – ${clipOut.toFixed(2)}s · drag edges to trim · dbl-click to reset`}
      >
        <span
          className="tl-clip-edge left"
          onMouseDown={(e) => dragEdge(e, "in")}
        />
        <span className="tl-clip-length">{(clipOut - clipIn).toFixed(2)}s</span>
        <span
          className="tl-clip-edge right"
          onMouseDown={(e) => dragEdge(e, "out")}
        />
      </div>
    </div>
  );
}

function buildTicks(duration: number) {
  const out: { t: number; major: boolean; label: string; align: "start" | "center" | "end" }[] = [];
  const count = 16;
  for (let i = 0; i <= count; i++) {
    const t = (i / count) * duration;
    const major = i % 4 === 0;
    const align = i === 0 ? "start" : i === count ? "end" : "center";
    out.push({ t, major, label: t.toFixed(1), align });
  }
  return out;
}

function prettyPath(path: string, layer: Layer): string {
  if (path === "opacity") return "Opacity";
  if (path.startsWith("uniforms.")) {
    const key = path.slice("uniforms.".length);
    const def = EFFECTS_BY_KIND[layer.kind];
    const p = def?.params.find((pp) => pp.key === key);
    return p?.label ?? key;
  }
  return path;
}

