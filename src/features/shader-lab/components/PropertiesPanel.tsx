import { useMemo, useRef, useState } from "react";
import { useLayerStore } from "../stores/layerStore";
import { useTimelineStore } from "../stores/timelineStore";
import type { BlendMode, InteractionSource, Layer, UniformValue } from "../types";
import { EFFECTS_BY_KIND, type ParamDef } from "../utils/effectCatalog";
import { Select } from "./Select";
import "./PropertiesPanel.css";

const BLEND_OPTIONS = [
  { label: "Normal", value: "normal" },
  { label: "Additive", value: "additive" },
  { label: "Multiply", value: "multiply" },
  { label: "Screen", value: "screen" },
  { label: "Overlay", value: "overlay" },
  { label: "Lighten", value: "lighten" },
  { label: "Darken", value: "darken" },
  { label: "Color Dodge", value: "colorDodge" },
  { label: "Color Burn", value: "colorBurn" },
  { label: "Hard Light", value: "hardLight" },
  { label: "Soft Light", value: "softLight" },
  { label: "Difference", value: "difference" },
  { label: "Exclusion", value: "exclusion" },
  { label: "Hue", value: "hue" },
  { label: "Saturation", value: "saturation" },
  { label: "Color", value: "color" },
  { label: "Luminosity", value: "luminosity" },
] as const;

const COMPOSITE_OPTIONS = [
  { label: "Filter", value: "filter" },
  { label: "Mask", value: "mask" },
] as const;

const LOOP_MODE_OPTIONS = [
  { label: "Loop", value: "loop" },
  { label: "Once", value: "once" },
] as const;

const MASK_SOURCE_OPTIONS = [
  { label: "Luminance", value: "luminance" },
  { label: "Alpha", value: "alpha" },
  { label: "Red", value: "red" },
  { label: "Green", value: "green" },
  { label: "Blue", value: "blue" },
] as const;

const MASK_MODE_OPTIONS = [
  { label: "Multiply", value: "multiply" },
  { label: "Stencil", value: "stencil" },
] as const;

const INVERT_OPTIONS = [
  { label: "Off", value: 0 },
  { label: "On", value: 1 },
] as const;

export const PropertiesPanel: React.FC = () => {
  const layer = useLayerStore((s) => s.getSelectedLayer());
  if (!layer) {
    return (
      <div className="properties-panel glass-panel">
        <div className="pp-empty type-caption">Select a layer.</div>
      </div>
    );
  }

  return (
    <div className="properties-panel glass-panel">
      <div className="pp-header">
        <span className="type-overline">{layer.kind}</span>
        <span className="pp-name">{layer.name}</span>
      </div>
      <div className="pp-content">
        <AssetSectionIfAny layer={layer} />
        <CoreSection layer={layer} />
        <EffectSections layer={layer} />
      </div>
    </div>
  );
};

function CoreSection({ layer }: { layer: Layer }) {
  const updateLayer = useLayerStore((s) => s.updateLayer);
  const isMask = layer.compositeMode === "mask";
  return (
    <>
      <div className="pp-section">
        <div className="pp-section-label type-overline">General</div>
        <div className="pp-section-body">
          <NameInput layer={layer} />
          <Row label="Opacity">
            <Slider
              layer={layer}
              path="opacity"
              min={0}
              max={1}
              value={layer.opacity}
              onChange={(v) => updateLayer(layer.id, { opacity: v })}
            />
          </Row>
          <Row label="Composite">
            <Select
              value={layer.compositeMode}
              options={[...COMPOSITE_OPTIONS]}
              onChange={(v) =>
                updateLayer(layer.id, {
                  compositeMode: v as Layer["compositeMode"],
                })
              }
            />
          </Row>
          <Row label="Time">
            <Select
              value={layer.loopMode ?? "loop"}
              options={[...LOOP_MODE_OPTIONS]}
              onChange={(v) =>
                updateLayer(layer.id, { loopMode: v as "loop" | "once" })
              }
            />
          </Row>
          {!isMask && (
            <Row label="Blend">
              <Select
                value={layer.blendMode}
                options={[...BLEND_OPTIONS]}
                onChange={(v) =>
                  updateLayer(layer.id, { blendMode: v as BlendMode })
                }
              />
            </Row>
          )}
        </div>
      </div>
      {isMask && <MaskSection layer={layer} />}
    </>
  );
}

function MaskSection({ layer }: { layer: Layer }) {
  const updateLayer = useLayerStore((s) => s.updateLayer);
  const m = layer.mask;
  return (
    <div className="pp-section">
      <div className="pp-section-label type-overline">Mask</div>
      <div className="pp-section-body">
        <Row label="Source">
          <Select
            value={m.source}
            options={[...MASK_SOURCE_OPTIONS]}
            onChange={(v) =>
              updateLayer(layer.id, {
                mask: { ...m, source: v as Layer["mask"]["source"] },
              })
            }
          />
        </Row>
        <Row label="Mode">
          <Select
            value={m.mode}
            options={[...MASK_MODE_OPTIONS]}
            onChange={(v) =>
              updateLayer(layer.id, {
                mask: { ...m, mode: v as Layer["mask"]["mode"] },
              })
            }
          />
        </Row>
        {m.mode === "stencil" && (
          <Row label="Threshold">
            <Slider
              layer={layer}
              path="__maskThreshold"
              min={0}
              max={1}
              value={m.threshold}
              onChange={(v) =>
                updateLayer(layer.id, { mask: { ...m, threshold: v } })
              }
            />
          </Row>
        )}
        <Row label="Invert">
          <Select
            value={m.invert ? 1 : 0}
            options={[...INVERT_OPTIONS]}
            onChange={(v) =>
              updateLayer(layer.id, { mask: { ...m, invert: v === 1 } })
            }
          />
        </Row>
      </div>
    </div>
  );
}

function NameInput({ layer }: { layer: Layer }) {
  const updateLayer = useLayerStore((s) => s.updateLayer);
  return (
    <Row label="Name">
      <input
        className="pp-input"
        type="text"
        value={layer.name}
        onChange={(e) => updateLayer(layer.id, { name: e.target.value })}
      />
    </Row>
  );
}

function isParamVisible(p: ParamDef, layer: Layer): boolean {
  if (!p.visibleWhen) return true;
  const v = Number(layer.uniforms[p.visibleWhen.key] ?? 0);
  if (p.visibleWhen.equals !== undefined) return v === p.visibleWhen.equals;
  if (p.visibleWhen.in !== undefined) return p.visibleWhen.in.includes(v);
  return true;
}

function EffectSections({ layer }: { layer: Layer }) {
  const def = EFFECTS_BY_KIND[layer.kind];
  const sections = useMemo(() => {
    const map = new Map<string, ParamDef[]>();
    if (!def) return map;
    for (const p of def.params) {
      if (!isParamVisible(p, layer)) continue;
      const section = p.section ?? "Parameters";
      if (!map.has(section)) map.set(section, []);
      map.get(section)!.push(p);
    }
    return map;
  }, [def, layer]);

  return (
    <>
      {Array.from(sections.entries()).map(([section, params]) => (
        <div key={section} className="pp-section">
          <div className="pp-section-label type-overline">{section}</div>
          <div className="pp-section-body">
            {params.map((p) => (
              <ParamRow key={p.key} layer={layer} param={p} />
            ))}
          </div>
        </div>
      ))}
      {layer.kind === "customShader" ? <CustomShaderSection layer={layer} /> : null}
    </>
  );
}

function AssetSectionIfAny({ layer }: { layer: Layer }) {
  if (layer.kind === "image" || layer.kind === "video") {
    return <AssetUrlSection layer={layer} />;
  }
  if (layer.kind === "model" && Number(layer.uniforms.source ?? 0) !== 0) {
    return <AssetUrlSection layer={layer} />;
  }
  return null;
}

function ParamRow({ layer, param }: { layer: Layer; param: ParamDef }) {
  const setUniform = useLayerStore((s) => s.setUniform);
  const setAsset = useLayerStore((s) => s.setAsset);
  const value = layer.uniforms[param.key] ?? param.default;

  const commit = (v: UniformValue) => {
    if (param.kind === "text" || param.kind === "font") {
      // text/font stored in asset
      setAsset(layer.id, { [param.key]: v as string });
    } else {
      setUniform(layer.id, param.key, v);
    }
  };

  if (param.kind === "color") {
    return (
      <Row label={param.label}>
        <ColorPicker
          value={value as [number, number, number]}
          onChange={(c) => commit(c)}
        />
      </Row>
    );
  }
  if (param.kind === "select") {
    return (
      <Row label={param.label}>
        <Select
          value={Number(value)}
          options={(param.options ?? []).map((o) => ({
            label: o.label,
            value: o.value,
          }))}
          onChange={(v) => commit(v)}
        />
      </Row>
    );
  }
  if (param.kind === "vec2") {
    const v = (value as [number, number]) ?? [0, 0];
    return (
      <Row label={param.label}>
        <div className="pp-vec2">
          <input
            type="number"
            className="pp-input"
            step={0.05}
            value={v[0]}
            onChange={(e) =>
              commit([parseFloat(e.target.value) || 0, v[1]])
            }
          />
          <input
            type="number"
            className="pp-input"
            step={0.05}
            value={v[1]}
            onChange={(e) =>
              commit([v[0], parseFloat(e.target.value) || 0])
            }
          />
        </div>
      </Row>
    );
  }
  if (param.kind === "text") {
    // text param is stored on layer.asset (for text) or in uniform string (for custom)
    const textVal =
      layer.kind === "text" && param.key === "text"
        ? layer.asset?.text ?? ""
        : param.key === "fragment"
          ? layer.asset?.fragmentSource ?? ""
          : "";
    return (
      <Row label={param.label}>
        <input
          className="pp-input"
          type="text"
          value={textVal}
          onChange={(e) => {
            if (layer.kind === "text")
              setAsset(layer.id, { text: e.target.value });
            else if (param.key === "fragment")
              setAsset(layer.id, { fragmentSource: e.target.value });
          }}
        />
      </Row>
    );
  }
  // slider / int
  const fSize = layer.kind === "text" && param.key === "fontSize";
  const fWeight = layer.kind === "text" && param.key === "fontWeight";
  const actualValue = fSize
    ? (layer.asset?.fontSize ?? 240)
    : fWeight
      ? (layer.asset?.fontWeight ?? 700)
      : typeof value === "number"
        ? value
        : 0;
  const setVal = (v: number) => {
    if (fSize) return setAsset(layer.id, { fontSize: v });
    if (fWeight) return setAsset(layer.id, { fontWeight: v });
    commit(v);
  };
  return (
    <Row
      label={param.label}
      trailing={
        <KeyframeDot
          layer={layer}
          path={`uniforms.${param.key}`}
          value={typeof actualValue === "number" ? actualValue : 0}
        />
      }
      interactionAnchor={
        typeof actualValue === "number" ? (
          <InteractionMenu layer={layer} path={`uniforms.${param.key}`} base={actualValue} />
        ) : undefined
      }
    >
      <Slider
        layer={layer}
        path={`uniforms.${param.key}`}
        min={param.min ?? 0}
        max={param.max ?? 1}
        step={param.step}
        value={actualValue}
        onChange={setVal}
      />
    </Row>
  );
}

function Row({
  label,
  children,
  trailing,
  interactionAnchor,
}: {
  label: string;
  children: React.ReactNode;
  trailing?: React.ReactNode;
  interactionAnchor?: React.ReactNode;
}) {
  return (
    <label className="pp-row">
      <span className="pp-row-label">
        {label}
        {interactionAnchor}
      </span>
      {trailing ?? <span />}
      <div className="pp-row-control">{children}</div>
    </label>
  );
}

function Slider({
  layer,
  path,
  min,
  max,
  step,
  value,
  onChange,
}: {
  layer: Layer;
  path: string;
  min: number;
  max: number;
  step?: number;
  value: number;
  onChange: (v: number) => void;
}) {
  const autoKey = useTimelineStore((s) => s.autoKey);
  const currentTime = useTimelineStore((s) => s.currentTime);
  const addKeyframe = useLayerStore((s) => s.addKeyframe);
  const stepSize = step ?? (max - min) / 200;
  const handle = (v: number) => {
    onChange(v);
    if (autoKey) addKeyframe(layer.id, path, currentTime, v);
  };
  return (
    <div className="pp-slider-group">
      <input
        className="pp-range"
        type="range"
        min={min}
        max={max}
        step={stepSize}
        value={value}
        onChange={(e) => handle(parseFloat(e.target.value))}
      />
      <input
        className="pp-num"
        type="number"
        min={min}
        max={max}
        step={stepSize}
        value={Number.isFinite(value) ? Number(value.toFixed(3)) : 0}
        onChange={(e) => handle(parseFloat(e.target.value) || 0)}
      />
    </div>
  );
}

function ColorPicker({
  value,
  onChange,
}: {
  value: [number, number, number];
  onChange: (v: [number, number, number]) => void;
}) {
  const hex = rgbToHex(value);
  return (
    <input
      className="pp-color"
      type="color"
      value={hex}
      onChange={(e) => onChange(hexToRgb(e.target.value))}
    />
  );
}

function KeyframeDot({
  layer,
  path,
  value,
}: {
  layer: Layer;
  path: string;
  value: number;
}) {
  const currentTime = useTimelineStore((s) => s.currentTime);
  const addKeyframe = useLayerStore((s) => s.addKeyframe);
  const removeKeyframe = useLayerStore((s) => s.removeKeyframe);
  const track = layer.tracks.find((t) => t.property === path);
  const hasKfHere = track?.keyframes.some(
    (k) => Math.abs(k.time - currentTime) < 0.05,
  );
  return (
    <button
      type="button"
      className={`pp-kf-dot ${track ? "on" : ""} ${hasKfHere ? "active" : ""}`}
      title={hasKfHere ? "Remove keyframe" : "Add keyframe at current time"}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        if (hasKfHere) {
          const kf = track!.keyframes.find(
            (k) => Math.abs(k.time - currentTime) < 0.05,
          )!;
          removeKeyframe(layer.id, path, kf.time);
        } else {
          addKeyframe(layer.id, path, currentTime, value);
        }
      }}
    />
  );
}

function InteractionMenu({
  layer,
  path,
  base,
}: {
  layer: Layer;
  path: string;
  base: number;
}) {
  const addInteraction = useLayerStore((s) => s.addInteraction);
  const removeInteraction = useLayerStore((s) => s.removeInteraction);
  const anchorRef = useRef<HTMLButtonElement>(null);
  const active = layer.interactions.find((i) => i.property === path);
  const bind = (source: InteractionSource, amount = 0.5) => {
    if (active && active.source === source) {
      removeInteraction(layer.id, path, source);
    } else {
      addInteraction(layer.id, { property: path, source, amount, base });
    }
  };
  return (
    <span className="pp-inter-menu">
      <button
        ref={anchorRef}
        type="button"
        className={`pp-inter-btn ${active ? "on" : ""}`}
        title="Bind to mouse / scroll"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          const menu = document.createElement("div");
          menu.className = "pp-inter-popup";
          menu.style.position = "fixed";
          const r = anchorRef.current!.getBoundingClientRect();
          menu.style.left = `${r.right + 6}px`;
          menu.style.top = `${r.top}px`;
          menu.innerHTML = `
            <button data-src="mouseX">Mouse X</button>
            <button data-src="mouseY">Mouse Y</button>
            <button data-src="scrollY">Scroll</button>
            <button data-src="time">Time</button>
            <button data-src="clear" class="clear">Clear</button>
          `;
          const close = () => {
            menu.remove();
            document.removeEventListener("mousedown", onClick);
          };
          const onClick = (ev: MouseEvent) => {
            const t = ev.target as HTMLElement;
            if (!menu.contains(t)) {
              close();
              return;
            }
            const src = t.dataset.src;
            if (!src) return;
            if (src === "clear") {
              if (active) removeInteraction(layer.id, path, active.source);
            } else {
              bind(src as InteractionSource);
            }
            close();
          };
          document.body.appendChild(menu);
          setTimeout(
            () => document.addEventListener("mousedown", onClick),
            0,
          );
        }}
      >
        ↗
      </button>
    </span>
  );
}

const VIDEO_LIBRARY: { name: string; url: string }[] = [
  { name: "Neon City", url: "/samples/neon-city.mp4" },
  { name: "Aerial Forest", url: "/samples/aerial-forest.mp4" },
  { name: "Ink in Water", url: "/samples/ink-water.mp4" },
];

function VideoAssetPreview({ layer }: { layer: Layer }) {
  const setAsset = useLayerStore((s) => s.setAsset);
  const [libraryOpen, setLibraryOpen] = useState(false);
  const url = layer.asset?.url;
  return (
    <div className="pp-video-preview-wrap">
      <button
        type="button"
        className={`pp-video-thumb ${libraryOpen ? "open" : ""}`}
        onClick={() => setLibraryOpen((v) => !v)}
        title={libraryOpen ? "Close library" : "Click to pick from library"}
      >
        {url ? (
          <video
            key={url}
            src={url}
            muted
            loop
            playsInline
            autoPlay
            className="pp-video-thumb-media"
          />
        ) : (
          <span className="pp-video-empty">Click to choose a video</span>
        )}
        <span className="pp-video-thumb-hint">
          {libraryOpen ? "Close" : "Library"}
        </span>
      </button>
      {libraryOpen && (
        <div className="pp-video-library">
          {VIDEO_LIBRARY.map((item) => (
            <button
              key={item.url}
              type="button"
              className={`pp-lib-tile ${url === item.url ? "active" : ""}`}
              onClick={() => {
                setAsset(layer.id, { url: item.url });
                setLibraryOpen(false);
              }}
              title={item.name}
            >
              <video
                src={item.url}
                muted
                loop
                playsInline
                autoPlay
                className="pp-lib-tile-media"
              />
              <span className="pp-lib-tile-name">{item.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function AssetUrlSection({ layer }: { layer: Layer }) {
  const setAsset = useLayerStore((s) => s.setAsset);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const accept =
    layer.kind === "model"
      ? ".glb,.gltf,.svg"
      : layer.kind === "video"
        ? "video/*"
        : "image/*";
  return (
    <div className="pp-section">
      <div className="pp-section-label type-overline">Asset</div>
      <div className="pp-section-body">
        {layer.kind === "video" && <VideoAssetPreview layer={layer} />}
        <Row label="URL">
          <input
            className="pp-input"
            type="text"
            placeholder="Paste URL"
            value={layer.asset?.url ?? ""}
            onChange={(e) => setAsset(layer.id, { url: e.target.value })}
          />
        </Row>
        <button
          type="button"
          className="pp-browse-btn"
          onClick={() => fileInputRef.current?.click()}
        >
          Browse file…
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          style={{ display: "none" }}
          onChange={(e) => {
            const file = e.target.files?.[0];
            e.target.value = "";
            if (!file) return;
            setAsset(layer.id, { url: URL.createObjectURL(file) });
          }}
        />
      </div>
    </div>
  );
}

function CustomShaderSection({ layer }: { layer: Layer }) {
  const setAsset = useLayerStore((s) => s.setAsset);
  return (
    <div className="pp-section">
      <div className="pp-section-label type-overline">GLSL Fragment</div>
      <div className="pp-section-body">
        <textarea
          className="pp-code"
          spellCheck={false}
          value={layer.asset?.fragmentSource ?? ""}
          onChange={(e) => setAsset(layer.id, { fragmentSource: e.target.value })}
        />
        <p className="type-caption">
          Available: <code>vUv</code> · <code>uTime</code> · <code>uResolution</code> ·{" "}
          <code>uMouse</code> · <code>uScroll</code> · <code>uBackground</code>. Write{" "}
          <code>gl_FragColor = vec4(...)</code>.
        </p>
      </div>
    </div>
  );
}

function rgbToHex([r, g, b]: [number, number, number]) {
  const to = (v: number) =>
    Math.max(0, Math.min(255, Math.round(v * 255)))
      .toString(16)
      .padStart(2, "0");
  return `#${to(r)}${to(g)}${to(b)}`;
}

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16) / 255;
  const g = parseInt(h.slice(2, 4), 16) / 255;
  const b = parseInt(h.slice(4, 6), 16) / 255;
  return [r, g, b];
}
