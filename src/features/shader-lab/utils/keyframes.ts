import type { Easing, KeyFrame, Layer, PropertyTrack } from "../types";

function ease(t: number, kind: Easing): number {
  switch (kind) {
    case "linear":
      return t;
    case "easeIn":
      return t * t;
    case "easeOut":
      return 1 - (1 - t) * (1 - t);
    case "easeInOut":
      return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
    case "bounce": {
      const n1 = 7.5625;
      const d1 = 2.75;
      let x = t;
      if (x < 1 / d1) return n1 * x * x;
      if (x < 2 / d1) return n1 * (x -= 1.5 / d1) * x + 0.75;
      if (x < 2.5 / d1) return n1 * (x -= 2.25 / d1) * x + 0.9375;
      return n1 * (x -= 2.625 / d1) * x + 0.984375;
    }
    case "spring": {
      return 1 - Math.exp(-6 * t) * Math.cos(12 * t);
    }
    default:
      return t;
  }
}

function sampleTrack(track: PropertyTrack, time: number): number | undefined {
  const kfs = track.keyframes;
  if (kfs.length === 0) return undefined;
  if (time <= kfs[0].time) return kfs[0].value;
  if (time >= kfs[kfs.length - 1].time) return kfs[kfs.length - 1].value;
  for (let i = 0; i < kfs.length - 1; i++) {
    const a = kfs[i];
    const b = kfs[i + 1];
    if (time >= a.time && time <= b.time) {
      const u = (time - a.time) / (b.time - a.time);
      const e = ease(u, a.easing ?? "easeInOut");
      return a.value + (b.value - a.value) * e;
    }
  }
  return kfs[kfs.length - 1].value;
}

export interface EvalContext {
  time: number;
  mouseX: number;
  mouseY: number;
  scrollY: number;
}

/**
 * Applies keyframe tracks and interaction bindings to a layer.
 * Property paths:
 *   "opacity"              -> layer.opacity
 *   "uniforms.<key>"       -> layer.uniforms[key] (must be number)
 */
export function evalLayer(layer: Layer, ctx: EvalContext): Layer {
  if (layer.tracks.length === 0 && layer.interactions.length === 0) return layer;

  const next: Layer = {
    ...layer,
    uniforms: { ...layer.uniforms },
  };

  for (const track of layer.tracks) {
    const v = sampleTrack(track, ctx.time);
    if (v === undefined) continue;
    applyValue(next, track.property, v);
  }

  for (const ib of layer.interactions) {
    const src =
      ib.source === "mouseX"
        ? ctx.mouseX
        : ib.source === "mouseY"
          ? ctx.mouseY
          : ib.source === "scrollY"
            ? ctx.scrollY
            : ctx.time;
    const v = ib.base + src * ib.amount;
    applyValue(next, ib.property, v);
  }

  return next;
}

export function kfMakeKey(
  time: number,
  value: number,
  easing: Easing = "easeInOut",
): KeyFrame {
  return { time, value, easing };
}

function applyValue(layer: Layer, path: string, value: number) {
  if (path === "opacity") {
    layer.opacity = value;
  } else if (path.startsWith("uniforms.")) {
    const key = path.slice("uniforms.".length);
    layer.uniforms[key] = value;
  }
}

export { sampleTrack };
