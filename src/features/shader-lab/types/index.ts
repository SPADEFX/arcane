// Effect/source layer types
export type LayerKind =
  // Procedural sources
  | "solid"
  | "gradient"
  | "meshGradient"
  | "pattern"
  | "noise"
  | "voronoi"
  // Sampler sources
  | "image"
  | "video"
  | "webcam"
  | "text"
  | "customShader"
  // Post-process effects
  | "crt"
  | "ascii"
  | "halftone"
  | "dithering"
  | "pixelation"
  | "threshold"
  | "posterize"
  | "bloom"
  | "vignette"
  | "glitch"
  | "directionalBlur"
  | "chromaticAberration"
  | "ink"
  | "distortion"
  | "particleGrid"
  | "circuitBent"
  | "plotter"
  | "posterizeOutline"
  | "tiltShift"
  | "hueRotate"
  | "pixelSorting"
  | "slice"
  | "edgeDetect"
  | "displacementMap"
  | "progressiveBlur"
  | "flutedGlass"
  | "model";

export type BlendMode =
  | "normal"
  | "multiply"
  | "screen"
  | "overlay"
  | "lighten"
  | "darken"
  | "additive"
  | "colorDodge"
  | "colorBurn"
  | "hardLight"
  | "softLight"
  | "difference"
  | "exclusion"
  | "hue"
  | "saturation"
  | "color"
  | "luminosity";

export type Easing =
  | "linear"
  | "easeIn"
  | "easeOut"
  | "easeInOut"
  | "bounce"
  | "spring";

export type InteractionSource = "mouseX" | "mouseY" | "scrollY" | "time";

export interface KeyFrame {
  time: number;
  value: number;
  easing?: Easing;
}

export interface PropertyTrack {
  property: string; // "opacity" | "uniforms.uBloom" | etc
  keyframes: KeyFrame[];
}

export interface InteractionBinding {
  property: string;
  source: InteractionSource;
  amount: number; // multiplier
  base: number; // baseline value
}

export type UniformValue =
  | number
  | [number, number]
  | [number, number, number]
  | [number, number, number, number]
  | string; // for text strings, asset urls, etc

export interface AssetRef {
  // For image/video/webcam: data URL or blob URL
  url?: string;
  // For text layers
  text?: string;
  fontSize?: number;
  fontFamily?: string;
  fontWeight?: number;
  textColor?: [number, number, number];
  // For custom shader
  fragmentSource?: string;
}

export type CompositeMode = "filter" | "mask";
export type MaskSource = "luminance" | "alpha" | "red" | "green" | "blue";
export type MaskMode = "multiply" | "stencil";

export interface MaskConfig {
  source: MaskSource;
  mode: MaskMode;
  invert: boolean;
  threshold: number;
}

export type LoopMode = "loop" | "once";

export interface Layer {
  id: string;
  kind: LayerKind;
  name: string;
  visible: boolean;
  opacity: number;
  blendMode: BlendMode;
  compositeMode: CompositeMode;
  mask: MaskConfig;
  parentId?: string | null;
  loopMode?: LoopMode;
  // Active range on the global timeline (seconds). Undefined = always active.
  clipIn?: number;
  clipOut?: number;
  // Per-effect uniforms (key = uniform name without `u` prefix, value = number/vec)
  uniforms: Record<string, UniformValue>;
  // Asset for sampler/source layers
  asset?: AssetRef;
  // Animation tracks
  tracks: PropertyTrack[];
  // Interaction bindings
  interactions: InteractionBinding[];
}

export interface SceneSettings {
  width: number; // virtual canvas width
  height: number; // virtual canvas height
  backgroundColor: [number, number, number];
  dpi: number; // 0.5 / 1 / 1.5 / 2
  fps: number; // 30 / 60 / 120
}

export interface TimelineState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  loop: boolean;
  autoKey: boolean;
  loopCount: number;
}

export interface Project {
  version: 1;
  layers: Layer[];
  scene: SceneSettings;
  timeline: TimelineState;
}
