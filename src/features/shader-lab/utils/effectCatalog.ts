import type { LayerKind, UniformValue } from "../types";

export type ParamKind = "slider" | "color" | "vec2" | "int" | "select" | "text" | "font";

export interface ParamDef {
  key: string;
  label: string;
  kind: ParamKind;
  min?: number;
  max?: number;
  step?: number;
  default: UniformValue;
  options?: { label: string; value: number }[];
  section?: string;
  visibleWhen?: { key: string; equals?: number; in?: number[] };
}

export interface EffectDef {
  kind: LayerKind;
  label: string;
  category: "source" | "sampler" | "color" | "distort" | "stylize" | "blur" | "misc";
  params: ParamDef[];
  hasBackground: boolean;
  preview: string;
}

const TWO_PI = 6.2831853;


export const EFFECTS: EffectDef[] = [
  {
    kind: "solid",
    label: "Solid",
    category: "source",
    hasBackground: true,
    preview: "#ff2b2b",
    params: [
      { key: "color", label: "Color", kind: "color", default: [1, 0.2, 0.2], section: "Color" },
      { key: "brightness", label: "Brightness", kind: "slider", min: 0, max: 2, default: 1, section: "Color" },
      { key: "contrast", label: "Contrast", kind: "slider", min: 0, max: 3, default: 1, section: "Color" },
      { key: "noise", label: "Grain", kind: "slider", min: 0, max: 1, default: 0, section: "Texture" },
      { key: "noiseScale", label: "Grain Scale", kind: "slider", min: 1, max: 400, default: 80, section: "Texture" },
    ],
  },

  {
    kind: "gradient",
    label: "Gradient",
    category: "source",
    hasBackground: true,
    preview: "linear-gradient(135deg, #ff2b2b, #7a0099 50%, #000)",
    params: [
      {
        key: "mode",
        label: "Mode",
        kind: "select",
        default: 0,
        section: "Shape",
        options: [
          { label: "Linear", value: 0 },
          { label: "Radial", value: 1 },
          { label: "Conic", value: 2 },
          { label: "Diamond", value: 3 },
        ],
      },
      { key: "angle", label: "Angle", kind: "slider", min: 0, max: TWO_PI, default: 0, section: "Shape" },
      { key: "center", label: "Center", kind: "vec2", default: [0.5, 0.5], section: "Shape" },
      { key: "scale", label: "Scale", kind: "slider", min: 0.1, max: 4, default: 1, section: "Shape" },
      { key: "power", label: "Power", kind: "slider", min: 0.1, max: 5, default: 1, section: "Shape" },
      { key: "colorA", label: "Color A", kind: "color", default: [0, 0, 0], section: "Color" },
      { key: "colorB", label: "Color B", kind: "color", default: [1, 1, 1], section: "Color" },
      { key: "colorC", label: "Color C", kind: "color", default: [0.5, 0, 1], section: "Color" },
      { key: "stopB", label: "Stop B", kind: "slider", min: 0, max: 1, default: 0.5, section: "Color" },
      { key: "useC", label: "Enable C", kind: "select", default: 0, options: [
        { label: "Off", value: 0 }, { label: "On", value: 1 }
      ], section: "Color" },
      { key: "invert", label: "Invert", kind: "select", default: 0, options: [
        { label: "Off", value: 0 }, { label: "On", value: 1 }
      ], section: "Color" },
      { key: "noise", label: "Noise", kind: "slider", min: 0, max: 1, default: 0, section: "Noise" },
      { key: "noiseScale", label: "Noise Scale", kind: "slider", min: 0.5, max: 30, default: 4, section: "Noise" },
    ],
  },

  {
    kind: "meshGradient",
    label: "Mesh Gradient",
    category: "source",
    hasBackground: true,
    preview:
      "radial-gradient(ellipse at 20% 30%, #ff2b2b, transparent 50%), radial-gradient(ellipse at 80% 20%, #9d27ff, transparent 50%), radial-gradient(ellipse at 50% 80%, #00c2ff, transparent 50%), #0a0a0c",
    params: [
      { key: "c00", label: "Top Left", kind: "color", default: [1, 0.17, 0.17], section: "Colors" },
      { key: "c10", label: "Top Right", kind: "color", default: [0.61, 0.15, 1], section: "Colors" },
      { key: "c01", label: "Bot Left", kind: "color", default: [0, 0.76, 1], section: "Colors" },
      { key: "c11", label: "Bot Right", kind: "color", default: [0, 0, 0], section: "Colors" },
      { key: "anim", label: "Animation", kind: "slider", min: 0, max: 1, default: 0.4, section: "Animation" },
      { key: "speed", label: "Speed", kind: "slider", min: 0, max: 4, default: 1, section: "Animation" },
      { key: "softness", label: "Softness", kind: "slider", min: 0.1, max: 3, default: 1, section: "Shape" },
      { key: "distort", label: "Distortion", kind: "slider", min: 0, max: 0.5, default: 0.15, section: "Shape" },
      { key: "distortFreq", label: "Distort Freq", kind: "slider", min: 0.5, max: 30, default: 6, section: "Shape" },
      { key: "grain", label: "Grain", kind: "slider", min: 0, max: 0.3, default: 0, section: "Noise" },
    ],
  },

  {
    kind: "pattern",
    label: "Pattern",
    category: "source",
    hasBackground: true,
    preview:
      "radial-gradient(circle at 25% 25%, #fff 2px, transparent 3px) 0 0 / 8px 8px, #0a0a0c",
    params: [
      {
        key: "kind",
        label: "Kind",
        kind: "select",
        default: 0,
        section: "Shape",
        options: [
          { label: "Dots", value: 0 },
          { label: "Lines", value: 1 },
          { label: "Checker", value: 2 },
          { label: "Hex", value: 3 },
          { label: "Triangle", value: 4 },
          { label: "Crosses", value: 5 },
          { label: "Diamonds", value: 6 },
        ],
      },
      { key: "scale", label: "Scale", kind: "slider", min: 1, max: 200, default: 20, section: "Shape" },
      { key: "angle", label: "Angle", kind: "slider", min: -3.14, max: 3.14, default: 0, section: "Shape" },
      { key: "offset", label: "Offset", kind: "vec2", default: [0, 0], section: "Shape" },
      { key: "thickness", label: "Thickness", kind: "slider", min: 0.05, max: 0.95, default: 0.5, section: "Shape" },
      { key: "softness", label: "Softness", kind: "slider", min: 0, max: 0.5, default: 0.05, section: "Shape" },
      { key: "fg", label: "Foreground", kind: "color", default: [1, 1, 1], section: "Color" },
      { key: "bg", label: "Background", kind: "color", default: [0.04, 0.04, 0.05], section: "Color" },
      { key: "invert", label: "Invert", kind: "select", default: 0, section: "Color", options: [
        { label: "Off", value: 0 }, { label: "On", value: 1 },
      ]},
    ],
  },

  {
    kind: "noise",
    label: "Noise",
    category: "source",
    hasBackground: true,
    preview: "linear-gradient(45deg, #1a2040, #ff5d3b 70%)",
    params: [
      { key: "colA", label: "Color A", kind: "color", default: [0.1, 0.2, 0.5], section: "Color" },
      { key: "colB", label: "Color B", kind: "color", default: [1, 0.45, 0.25], section: "Color" },
      { key: "contrast", label: "Contrast", kind: "slider", min: 0.1, max: 5, default: 1, section: "Color" },
      { key: "scale", label: "Scale", kind: "slider", min: 0.1, max: 20, default: 3, section: "Shape" },
      { key: "octaves", label: "Octaves", kind: "slider", min: 1, max: 8, step: 1, default: 5, section: "Shape" },
      { key: "gain", label: "Gain", kind: "slider", min: 0.1, max: 0.9, default: 0.5, section: "Shape" },
      { key: "warp", label: "Warp", kind: "slider", min: 0, max: 3, default: 0.5, section: "Shape" },
      { key: "speed", label: "Speed", kind: "slider", min: 0, max: 3, default: 0.2, section: "Animation" },
      { key: "direction", label: "Direction", kind: "vec2", default: [1, 0.7], section: "Animation" },
    ],
  },

  {
    kind: "voronoi",
    label: "Voronoi",
    category: "source",
    hasBackground: true,
    preview:
      "conic-gradient(from 0deg, #0a0 0deg 60deg, #0aa 60deg 180deg, #a0a 180deg 260deg, #aa0 260deg 360deg)",
    params: [
      { key: "scale", label: "Scale", kind: "slider", min: 1, max: 50, default: 8, section: "Shape" },
      { key: "jitter", label: "Jitter", kind: "slider", min: 0, max: 1, default: 1, section: "Shape" },
      { key: "edgeWidth", label: "Edge Width", kind: "slider", min: 0, max: 0.3, default: 0.06, section: "Shape" },
      { key: "metric", label: "Metric", kind: "select", default: 0, options: [
        { label: "Euclidean", value: 0 },
        { label: "Manhattan", value: 1 },
        { label: "Chebyshev", value: 2 },
      ], section: "Shape" },
      { key: "speed", label: "Speed", kind: "slider", min: 0, max: 3, default: 0, section: "Animation" },
      { key: "cellCol", label: "Cell", kind: "color", default: [0.9, 0.9, 1], section: "Color" },
      { key: "edgeCol", label: "Edge", kind: "color", default: [0, 0, 0], section: "Color" },
      { key: "variation", label: "Cell Variation", kind: "slider", min: 0, max: 1, default: 0.5, section: "Color" },
    ],
  },

  {
    kind: "image",
    label: "Image",
    category: "sampler",
    hasBackground: true,
    preview:
      "linear-gradient(135deg, #333 25%, #222 25% 50%, #333 50% 75%, #222 75%) 0 0 / 16px 16px",
    params: [
      { key: "fit", label: "Fit", kind: "select", default: 1, options: [
        { label: "Stretch", value: 0 },
        { label: "Cover", value: 1 },
        { label: "Contain", value: 2 },
      ], section: "Transform" },
      { key: "offset", label: "Offset", kind: "vec2", default: [0, 0], section: "Transform" },
      { key: "scale", label: "Scale", kind: "vec2", default: [1, 1], section: "Transform" },
      { key: "rotation", label: "Rotation", kind: "slider", min: -3.14159, max: 3.14159, default: 0, section: "Transform" },
      { key: "mirror", label: "Mirror X", kind: "select", default: 0, options: [
        { label: "Off", value: 0 }, { label: "On", value: 1 },
      ], section: "Transform" },
      { key: "exposure", label: "Exposure", kind: "slider", min: -3, max: 3, default: 0, section: "Color" },
      { key: "contrast", label: "Contrast", kind: "slider", min: 0, max: 3, default: 1, section: "Color" },
      { key: "saturation", label: "Saturation", kind: "slider", min: 0, max: 2, default: 1, section: "Color" },
      { key: "tint", label: "Tint", kind: "color", default: [1, 1, 1], section: "Color" },
      { key: "tintMix", label: "Tint Mix", kind: "slider", min: 0, max: 1, default: 0, section: "Color" },
    ],
  },

  {
    kind: "video",
    label: "Video",
    category: "sampler",
    hasBackground: true,
    preview:
      "radial-gradient(circle at 50% 50%, #fff 6px, #333 7px, #222 70%)",
    params: [
      { key: "fit", label: "Fit", kind: "select", default: 1, options: [
        { label: "Stretch", value: 0 },
        { label: "Cover", value: 1 },
        { label: "Contain", value: 2 },
      ], section: "Transform" },
      { key: "offset", label: "Offset", kind: "vec2", default: [0, 0], section: "Transform" },
      { key: "scale", label: "Scale", kind: "vec2", default: [1, 1], section: "Transform" },
      { key: "rotation", label: "Rotation", kind: "slider", min: -3.14159, max: 3.14159, default: 0, section: "Transform" },
      { key: "mirror", label: "Mirror X", kind: "select", default: 0, options: [
        { label: "Off", value: 0 }, { label: "On", value: 1 },
      ], section: "Transform" },
      { key: "exposure", label: "Exposure", kind: "slider", min: -3, max: 3, default: 0, section: "Color" },
      { key: "contrast", label: "Contrast", kind: "slider", min: 0, max: 3, default: 1, section: "Color" },
      { key: "saturation", label: "Saturation", kind: "slider", min: 0, max: 2, default: 1, section: "Color" },
      { key: "tint", label: "Tint", kind: "color", default: [1, 1, 1], section: "Color" },
      { key: "tintMix", label: "Tint Mix", kind: "slider", min: 0, max: 1, default: 0, section: "Color" },
    ],
  },

  {
    kind: "webcam",
    label: "Webcam",
    category: "sampler",
    hasBackground: true,
    preview: "radial-gradient(circle at 50% 50%, #444 30%, #111 80%)",
    params: [
      { key: "fit", label: "Fit", kind: "select", default: 1, options: [
        { label: "Stretch", value: 0 },
        { label: "Cover", value: 1 },
        { label: "Contain", value: 2 },
      ], section: "Transform" },
      { key: "offset", label: "Offset", kind: "vec2", default: [0, 0], section: "Transform" },
      { key: "scale", label: "Scale", kind: "vec2", default: [1, 1], section: "Transform" },
      { key: "rotation", label: "Rotation", kind: "slider", min: -3.14159, max: 3.14159, default: 0, section: "Transform" },
      { key: "mirror", label: "Mirror X", kind: "select", default: 1, options: [
        { label: "Off", value: 0 }, { label: "On", value: 1 },
      ], section: "Transform" },
      { key: "exposure", label: "Exposure", kind: "slider", min: -3, max: 3, default: 0, section: "Color" },
      { key: "contrast", label: "Contrast", kind: "slider", min: 0, max: 3, default: 1, section: "Color" },
      { key: "saturation", label: "Saturation", kind: "slider", min: 0, max: 2, default: 1, section: "Color" },
      { key: "tint", label: "Tint", kind: "color", default: [1, 1, 1], section: "Color" },
      { key: "tintMix", label: "Tint Mix", kind: "slider", min: 0, max: 1, default: 0, section: "Color" },
    ],
  },

  {
    kind: "text",
    label: "Text",
    category: "sampler",
    hasBackground: true,
    preview:
      "radial-gradient(ellipse at center, rgba(255,43,43,0.6), #000 70%)",
    params: [
      { key: "text", label: "Text", kind: "text", default: "basement", section: "Content" },
      { key: "fontSize", label: "Size", kind: "slider", min: 32, max: 600, step: 1, default: 240, section: "Content" },
      { key: "fontWeight", label: "Weight", kind: "slider", min: 100, max: 900, step: 100, default: 700, section: "Content" },
      { key: "letterSpacing", label: "Letter Spacing", kind: "slider", min: -30, max: 60, step: 1, default: 0, section: "Content" },
      { key: "italic", label: "Italic", kind: "select", default: 0, options: [
        { label: "Off", value: 0 }, { label: "On", value: 1 },
      ], section: "Content" },
      { key: "align", label: "Align", kind: "select", default: 1, options: [
        { label: "Left", value: 0 },
        { label: "Center", value: 1 },
        { label: "Right", value: 2 },
      ], section: "Content" },
      { key: "color", label: "Color", kind: "color", default: [1, 0.17, 0.17], section: "Color" },
      { key: "stroke", label: "Stroke", kind: "slider", min: 0, max: 30, default: 0, section: "Color" },
      { key: "strokeColor", label: "Stroke Color", kind: "color", default: [0, 0, 0], section: "Color" },
      { key: "yOffset", label: "Vertical Offset", kind: "slider", min: -0.5, max: 0.5, default: 0, section: "Transform" },
      { key: "rotation", label: "Rotation", kind: "slider", min: -3.14159, max: 3.14159, default: 0, section: "Transform" },
      { key: "fit", label: "Fit", kind: "select", default: 0, options: [
        { label: "Native", value: 0 },
        { label: "Cover", value: 1 },
      ], section: "Transform" },
    ],
  },

  {
    kind: "customShader",
    label: "Custom Shader",
    category: "source",
    hasBackground: true,
    preview:
      "conic-gradient(from 90deg at 50% 50%, #ff2b2b, #0ff, #ff0, #ff2b2b)",
    params: [
      {
        key: "fragment",
        label: "GLSL Fragment",
        kind: "text",
        default:
          "vec3 col = vec3(vUv, 0.5 + 0.5*sin(uTime));\ngl_FragColor = vec4(col, 1.0);",
      },
      { key: "u1", label: "U1", kind: "slider", min: 0, max: 1, default: 0.5, section: "Uniforms" },
      { key: "u2", label: "U2", kind: "slider", min: 0, max: 1, default: 0.5, section: "Uniforms" },
      { key: "u3", label: "U3", kind: "slider", min: 0, max: 1, default: 0.5, section: "Uniforms" },
      { key: "u4", label: "U4", kind: "slider", min: 0, max: 1, default: 0.5, section: "Uniforms" },
      { key: "col1", label: "Col 1", kind: "color", default: [1, 0.2, 0.2], section: "Uniforms" },
      { key: "col2", label: "Col 2", kind: "color", default: [0, 0.8, 1], section: "Uniforms" },
    ],
  },

  {
    kind: "crt",
    label: "CRT",
    category: "distort",
    hasBackground: true,
    preview:
      "repeating-linear-gradient(0deg, rgba(255,43,43,0.9) 0 1px, rgba(10,0,0,0.9) 1px 3px), radial-gradient(ellipse at center, rgba(255,43,43,0.7), #000 72%)",
    params: [
      { key: "mode", label: "Mask Mode", kind: "select", default: 0, section: "Mask", options: [
        { label: "Aperture Grille", value: 0 },
        { label: "Slot-Mask Monitor", value: 1 },
        { label: "Shadow Mask", value: 2 },
        { label: "Composite TV", value: 3 },
        { label: "None", value: 4 },
      ]},
      { key: "maskScale", label: "Mask Scale", kind: "slider", min: 0.5, max: 12, default: 2, section: "Mask" },
      { key: "mask", label: "Mask Intensity", kind: "slider", min: 0, max: 1, default: 0.35, section: "Mask" },
      { key: "scanline", label: "Scanline Intensity", kind: "slider", min: 0, max: 1, default: 0.45, section: "Mask" },
      { key: "scanCount", label: "Scanline Count", kind: "slider", min: 100, max: 1500, default: 500, section: "Mask" },
      { key: "scanDir", label: "Scanline Dir", kind: "select", default: 0, section: "Mask", options: [
        { label: "Horizontal", value: 0 },
        { label: "Vertical", value: 1 },
      ]},
      { key: "barrel", label: "Barrel", kind: "slider", min: 0, max: 0.5, default: 0.12, section: "Distortion" },
      { key: "curvature", label: "Edge Curve", kind: "slider", min: 0, max: 1, default: 0.3, section: "Distortion" },
      { key: "converge", label: "Convergence", kind: "slider", min: 0, max: 0.04, default: 0.003, section: "Distortion" },
      { key: "beam", label: "Beam Focus", kind: "slider", min: 0, max: 2, default: 0.7, section: "Phosphor" },
      { key: "persist", label: "Persistence", kind: "slider", min: 0, max: 0.98, default: 0.3, section: "Phosphor" },
      { key: "flicker", label: "Flicker", kind: "slider", min: 0, max: 1, default: 0.08, section: "Phosphor" },
      { key: "flickerSpeed", label: "Flicker Speed", kind: "slider", min: 5, max: 120, default: 60, section: "Phosphor" },
      { key: "noise", label: "Noise Grain", kind: "slider", min: 0, max: 0.5, default: 0.04, section: "Phosphor" },
      { key: "bloom", label: "Bloom", kind: "slider", min: 0, max: 3, default: 0.75, section: "Effect" },
      { key: "bloomThresh", label: "Bloom Threshold", kind: "slider", min: 0, max: 1, default: 0.5, section: "Effect" },
      { key: "bloomRadius", label: "Bloom Radius", kind: "slider", min: 0.005, max: 0.15, default: 0.04, section: "Effect" },
      { key: "bloomSoft", label: "Bloom Softness", kind: "slider", min: 0.01, max: 0.4, default: 0.1, section: "Effect" },
      { key: "vignette", label: "Vignette", kind: "slider", min: 0, max: 1, default: 0.55, section: "Effect" },
      { key: "vigSoft", label: "Vignette Softness", kind: "slider", min: 0, max: 1, default: 0.6, section: "Effect" },
      { key: "glitch", label: "Glitch", kind: "slider", min: 0, max: 1, default: 0, section: "Effect" },
      { key: "glitchSpeed", label: "Glitch Speed", kind: "slider", min: 0, max: 10, default: 1, section: "Effect" },
      { key: "tint", label: "Tint", kind: "color", default: [1, 1, 1], section: "Tone" },
      { key: "brightness", label: "Brightness", kind: "slider", min: 0, max: 2, default: 1, section: "Tone" },
      { key: "contrast", label: "Contrast", kind: "slider", min: 0, max: 3, default: 1, section: "Tone" },
      { key: "chromaRetention", label: "Chroma", kind: "slider", min: 0, max: 1, default: 0.9, section: "Tone" },
    ],
  },

  {
    kind: "ascii",
    label: "ASCII",
    category: "stylize",
    hasBackground: true,
    preview:
      "repeating-linear-gradient(90deg, #fff 0 1px, transparent 1px 5px), #000",
    params: [
      { key: "cellPx", label: "Cell Size", kind: "slider", min: 4, max: 40, default: 10, section: "Cell" },
      { key: "aspect", label: "Cell Aspect", kind: "slider", min: 0.3, max: 2, default: 1, section: "Cell" },
      { key: "threshold", label: "Threshold", kind: "slider", min: 0, max: 1, default: 0, section: "Tone" },
      { key: "contrast", label: "Contrast", kind: "slider", min: 0.1, max: 3, default: 1, section: "Tone" },
      { key: "invert", label: "Invert", kind: "select", default: 0, options: [
        { label: "Off", value: 0 }, { label: "On", value: 1 },
      ], section: "Color" },
      { key: "colorMode", label: "Color Mode", kind: "select", default: 1, options: [
        { label: "Monochrome", value: 0 },
        { label: "From Source", value: 1 },
      ], section: "Color" },
      { key: "ink", label: "Ink", kind: "color", default: [1, 1, 1], section: "Color" },
      { key: "paper", label: "Paper", kind: "color", default: [0, 0, 0], section: "Color" },
    ],
  },

  {
    kind: "halftone",
    label: "Halftone",
    category: "stylize",
    hasBackground: true,
    preview:
      "radial-gradient(circle at 30% 30%, #fff 3px, transparent 4px) 0 0 / 10px 10px, #0a0a0c",
    params: [
      { key: "cellPx", label: "Cell", kind: "slider", min: 2, max: 32, default: 6, section: "Shape" },
      { key: "angle", label: "Angle", kind: "slider", min: 0, max: 3.14159, default: 0.4, section: "Shape" },
      { key: "dotScale", label: "Dot Scale", kind: "slider", min: 0.2, max: 2, default: 1, section: "Shape" },
      { key: "shape", label: "Shape", kind: "select", default: 0, options: [
        { label: "Circle", value: 0 },
        { label: "Square", value: 1 },
        { label: "Diamond", value: 2 },
        { label: "Line", value: 3 },
      ], section: "Shape" },
      { key: "softness", label: "Softness", kind: "slider", min: 0.005, max: 0.3, default: 0.05, section: "Shape" },
      { key: "ink", label: "Ink", kind: "color", default: [0, 0, 0], section: "Color" },
      { key: "paper", label: "Paper", kind: "color", default: [1, 1, 1], section: "Color" },
      { key: "invert", label: "Invert", kind: "select", default: 0, options: [
        { label: "Off", value: 0 }, { label: "On", value: 1 },
      ], section: "Color" },
    ],
  },

  {
    kind: "dithering",
    label: "Dithering",
    category: "stylize",
    hasBackground: true,
    preview:
      "repeating-conic-gradient(#000 0% 25%, #fff 0% 50%) 0 0 / 6px 6px",
    params: [
      { key: "mode", label: "Mode", kind: "select", default: 0, options: [
        { label: "Bayer 4x4", value: 0 },
        { label: "Bayer 8x8", value: 1 },
        { label: "Blue Noise", value: 2 },
        { label: "White Noise", value: 3 },
      ], section: "Mode" },
      { key: "levels", label: "Levels", kind: "slider", min: 2, max: 32, default: 3, step: 1, section: "Mode" },
      { key: "scale", label: "Pattern Scale", kind: "slider", min: 0.2, max: 8, default: 1, section: "Mode" },
      { key: "contrast", label: "Contrast", kind: "slider", min: 0.1, max: 3, default: 1, section: "Tone" },
      { key: "preserveColor", label: "Preserve Color", kind: "select", default: 1, options: [
        { label: "Monochrome", value: 0 },
        { label: "RGB", value: 1 },
      ], section: "Tone" },
    ],
  },

  {
    kind: "pixelation",
    label: "Pixelation",
    category: "stylize",
    hasBackground: true,
    preview: "conic-gradient(from 0deg at 50% 50%, #ff2b2b, #7a0099, #002266, #ff2b2b)",
    params: [
      { key: "blocks", label: "Blocks", kind: "slider", min: 4, max: 400, default: 80, section: "Shape" },
      { key: "aspect", label: "Aspect", kind: "slider", min: 0.2, max: 5, default: 1, section: "Shape" },
      { key: "offset", label: "Offset", kind: "vec2", default: [0, 0], section: "Shape" },
      { key: "smoothing", label: "Smoothing", kind: "slider", min: 0, max: 1, default: 0, section: "Shape" },
      { key: "quantize", label: "Color Quantize", kind: "slider", min: 1, max: 16, default: 1, step: 1, section: "Color" },
    ],
  },

  {
    kind: "threshold",
    label: "Threshold",
    category: "stylize",
    hasBackground: true,
    preview: "linear-gradient(135deg, #fff 48%, #000 52%)",
    params: [
      { key: "t", label: "Threshold", kind: "slider", min: 0, max: 1, default: 0.5, section: "Threshold" },
      { key: "soft", label: "Softness", kind: "slider", min: 0, max: 0.3, default: 0.02, section: "Threshold" },
      { key: "channel", label: "Channel", kind: "select", default: 0, options: [
        { label: "Luma", value: 0 },
        { label: "Red", value: 1 },
        { label: "Green", value: 2 },
        { label: "Blue", value: 3 },
      ], section: "Threshold" },
      { key: "invert", label: "Invert", kind: "select", default: 0, options: [
        { label: "Off", value: 0 }, { label: "On", value: 1 },
      ], section: "Threshold" },
      { key: "on", label: "On", kind: "color", default: [1, 1, 1], section: "Color" },
      { key: "off", label: "Off", kind: "color", default: [0, 0, 0], section: "Color" },
    ],
  },

  {
    kind: "posterize",
    label: "Posterize",
    category: "color",
    hasBackground: true,
    preview: "linear-gradient(to right, #f00 0 20%, #ff0 20% 40%, #0f0 40% 60%, #0ff 60% 80%, #00f 80%)",
    params: [
      { key: "steps", label: "Steps", kind: "slider", min: 2, max: 32, default: 4, step: 1, section: "Levels" },
      { key: "rSteps", label: "Red Steps", kind: "slider", min: 0, max: 32, default: 0, step: 1, section: "Levels" },
      { key: "gSteps", label: "Green Steps", kind: "slider", min: 0, max: 32, default: 0, step: 1, section: "Levels" },
      { key: "bSteps", label: "Blue Steps", kind: "slider", min: 0, max: 32, default: 0, step: 1, section: "Levels" },
      { key: "gamma", label: "Gamma", kind: "slider", min: 0.2, max: 3, default: 1, section: "Tone" },
      { key: "mix", label: "Mix", kind: "slider", min: 0, max: 1, default: 1, section: "Tone" },
    ],
  },

  {
    kind: "bloom",
    label: "Bloom",
    category: "blur",
    hasBackground: true,
    preview: "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.9), rgba(255,43,43,0.4) 30%, #000 70%)",
    params: [
      { key: "thresh", label: "Threshold", kind: "slider", min: 0, max: 1, default: 0.55, section: "Shape" },
      { key: "knee", label: "Knee", kind: "slider", min: 0.01, max: 1, default: 0.45, section: "Shape" },
      { key: "radius", label: "Radius", kind: "slider", min: 0, max: 0.2, default: 0.1, section: "Shape" },
      { key: "strength", label: "Strength", kind: "slider", min: 0, max: 6, default: 1.2, section: "Shape" },
      { key: "tint", label: "Tint", kind: "color", default: [1, 1, 1], section: "Color" },
    ],
  },

  {
    kind: "vignette",
    label: "Vignette",
    category: "color",
    hasBackground: true,
    preview: "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.14), #000 82%)",
    params: [
      { key: "start", label: "Start", kind: "slider", min: 0, max: 1.5, default: 0.4, section: "Shape" },
      { key: "end", label: "End", kind: "slider", min: 0, max: 1.8, default: 0.9, section: "Shape" },
      { key: "roundness", label: "Roundness", kind: "slider", min: 0, max: 2, default: 1, section: "Shape" },
      { key: "center", label: "Center", kind: "vec2", default: [0.5, 0.5], section: "Shape" },
      { key: "tint", label: "Tint", kind: "color", default: [0, 0, 0], section: "Color" },
      { key: "tintMix", label: "Tint Strength", kind: "slider", min: 0, max: 1, default: 1, section: "Color" },
    ],
  },

  {
    kind: "glitch",
    label: "Glitch",
    category: "distort",
    hasBackground: true,
    preview:
      "linear-gradient(90deg, #ff2b2b 20%, #00ffcc 20% 40%, #ffff00 40% 60%, #ff2b2b 60% 80%, #000 80%)",
    params: [
      { key: "amount", label: "Amount", kind: "slider", min: 0, max: 1, default: 0.3, section: "Shift" },
      { key: "speed", label: "Speed", kind: "slider", min: 0, max: 20, default: 8, section: "Shift" },
      { key: "waveFreq", label: "Row Freq", kind: "slider", min: 4, max: 200, default: 40, section: "Shift" },
      { key: "split", label: "RGB Split", kind: "slider", min: 0, max: 0.1, default: 0.006, section: "Color" },
      { key: "block", label: "Block Rate", kind: "slider", min: 0, max: 1, default: 0.05, section: "Blocks" },
      { key: "blockSize", label: "Block Density", kind: "slider", min: 4, max: 80, default: 20, section: "Blocks" },
      { key: "noiseAmt", label: "Noise", kind: "slider", min: 0, max: 1, default: 0.05, section: "Noise" },
    ],
  },

  {
    kind: "directionalBlur",
    label: "Directional Blur",
    category: "blur",
    hasBackground: true,
    preview:
      "linear-gradient(90deg, rgba(255,255,255,0.3), rgba(255,255,255,0.9) 50%, rgba(255,255,255,0.3)), #111",
    params: [
      { key: "dir", label: "Direction", kind: "vec2", default: [1, 0], section: "Blur" },
      { key: "length", label: "Length", kind: "slider", min: 0, max: 0.3, default: 0.02, section: "Blur" },
      { key: "curve", label: "Curve", kind: "slider", min: 0, max: 1, default: 0.5, section: "Blur" },
      { key: "bidirectional", label: "Bidirectional", kind: "select", default: 1, options: [
        { label: "One-sided", value: 0 },
        { label: "Two-sided", value: 1 },
      ], section: "Blur" },
    ],
  },

  {
    kind: "chromaticAberration",
    label: "Chromatic Aberration",
    category: "distort",
    hasBackground: true,
    preview:
      "radial-gradient(circle at 50% 50%, rgba(255,0,0,0.6), rgba(0,255,255,0.6) 60%, #000 90%)",
    params: [
      { key: "strength", label: "Strength", kind: "slider", min: 0, max: 0.3, default: 0.02, section: "Shape" },
      { key: "falloff", label: "Falloff", kind: "slider", min: 0, max: 5, default: 2, section: "Shape" },
      { key: "angle", label: "Angle", kind: "slider", min: 0, max: TWO_PI, default: 0, section: "Shape" },
      { key: "radial", label: "Mode", kind: "select", default: 1, options: [
        { label: "Linear", value: 0 },
        { label: "Radial", value: 1 },
      ], section: "Shape" },
      { key: "splitR", label: "Red Shift", kind: "slider", min: -2, max: 2, default: 1, section: "Channels" },
      { key: "splitB", label: "Blue Shift", kind: "slider", min: -2, max: 2, default: -1, section: "Channels" },
    ],
  },

  {
    kind: "ink",
    label: "Ink",
    category: "stylize",
    hasBackground: true,
    preview:
      "linear-gradient(#f3efe5, #f3efe5), url('data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"60\" height=\"60\"><path d=\"M0 0l60 60M60 0L0 60\" stroke=\"%23111\" stroke-width=\"2\"/></svg>')",
    params: [
      { key: "edgeThresh", label: "Edge Threshold", kind: "slider", min: 0, max: 1, default: 0.2, section: "Edges" },
      { key: "edgeSoft", label: "Edge Softness", kind: "slider", min: 0.005, max: 0.3, default: 0.1, section: "Edges" },
      { key: "edgeThick", label: "Edge Thickness", kind: "slider", min: 0.5, max: 4, default: 1, section: "Edges" },
      { key: "grain", label: "Grain", kind: "slider", min: 0, max: 0.5, default: 0.12, section: "Grain" },
      { key: "grainScale", label: "Grain Scale", kind: "slider", min: 0.5, max: 8, default: 1, section: "Grain" },
      { key: "paper", label: "Paper", kind: "color", default: [0.95, 0.93, 0.88], section: "Color" },
      { key: "ink", label: "Ink", kind: "color", default: [0.05, 0.05, 0.08], section: "Color" },
    ],
  },

  {
    kind: "distortion",
    label: "Distortion",
    category: "distort",
    hasBackground: true,
    preview:
      "repeating-radial-gradient(circle at 50% 50%, #ff2b2b 0 6px, #000 6px 12px)",
    params: [
      { key: "mode", label: "Mode", kind: "select", default: 0, options: [
        { label: "Sine", value: 0 },
        { label: "Noise", value: 1 },
        { label: "Ripple", value: 2 },
        { label: "Swirl", value: 3 },
      ], section: "Mode" },
      { key: "direction", label: "Direction", kind: "select", default: 0, options: [
        { label: "Both", value: 0 },
        { label: "Horizontal", value: 1 },
        { label: "Vertical", value: 2 },
      ], section: "Mode" },
      { key: "amp", label: "Amplitude", kind: "slider", min: 0, max: 0.5, default: 0.02, section: "Wave" },
      { key: "freq", label: "Frequency", kind: "slider", min: 0.1, max: 80, default: 10, section: "Wave" },
      { key: "speed", label: "Speed", kind: "slider", min: -5, max: 5, default: 1, section: "Wave" },
      { key: "phase", label: "Phase", kind: "slider", min: 0, max: TWO_PI, default: 0, section: "Wave" },
      { key: "center", label: "Center", kind: "vec2", default: [0.5, 0.5], section: "Center" },
      { key: "octaves", label: "Octaves", kind: "slider", min: 1, max: 5, step: 1, default: 2, section: "Wave" },
    ],
  },

  {
    kind: "particleGrid",
    label: "Particle Grid",
    category: "stylize",
    hasBackground: true,
    preview:
      "radial-gradient(circle at 50% 50%, #fff 2px, transparent 3px) 0 0 / 12px 12px, #000",
    params: [
      { key: "grid", label: "Grid", kind: "slider", min: 4, max: 200, default: 40, section: "Grid" },
      { key: "aspect", label: "Aspect", kind: "slider", min: 0.2, max: 5, default: 1, section: "Grid" },
      { key: "size", label: "Size", kind: "slider", min: 0, max: 1.5, default: 0.4, section: "Particle" },
      { key: "shape", label: "Shape", kind: "select", default: 0, options: [
        { label: "Circle", value: 0 },
        { label: "Square", value: 1 },
        { label: "Diamond", value: 2 },
      ], section: "Particle" },
      { key: "speed", label: "Speed", kind: "slider", min: 0, max: 10, default: 1, section: "Animation" },
      { key: "phase", label: "Phase Random", kind: "slider", min: 0, max: 1, default: 1, section: "Animation" },
      { key: "colorMode", label: "Color Mode", kind: "select", default: 0, options: [
        { label: "From Source", value: 0 },
        { label: "Tint", value: 1 },
      ], section: "Color" },
      { key: "tint", label: "Tint", kind: "color", default: [1, 1, 1], section: "Color" },
    ],
  },

  {
    kind: "circuitBent",
    label: "Circuit Bent",
    category: "distort",
    hasBackground: true,
    preview:
      "repeating-linear-gradient(0deg, #ff2b2b 0 3px, #00ffcc 3px 6px, #ffff00 6px 9px)",
    params: [
      { key: "bands", label: "Bands", kind: "slider", min: 0, max: 1, default: 0.5, section: "Bands" },
      { key: "sliceHeight", label: "Slice Height", kind: "slider", min: 5, max: 120, default: 30, section: "Bands" },
      { key: "shuffle", label: "Shuffle", kind: "slider", min: 0, max: 1, default: 0.6, section: "Channels" },
      { key: "invertAmt", label: "Invert", kind: "slider", min: 0, max: 1, default: 0, section: "Channels" },
      { key: "speed", label: "Speed", kind: "slider", min: 0, max: 10, default: 2, section: "Animation" },
    ],
  },

  {
    kind: "plotter",
    label: "Plotter",
    category: "stylize",
    hasBackground: true,
    preview:
      "linear-gradient(#fff, #fff), repeating-linear-gradient(45deg, #111 0 1px, transparent 1px 8px)",
    params: [
      { key: "thresh", label: "Threshold", kind: "slider", min: 0, max: 0.3, default: 0.08, section: "Lines" },
      { key: "thickness", label: "Line Thickness", kind: "slider", min: 0, max: 0.05, default: 0.008, section: "Lines" },
      { key: "hatch", label: "Hatch", kind: "select", default: 0, options: [
        { label: "Off", value: 0 },
        { label: "Single", value: 1 },
        { label: "Cross", value: 2 },
      ], section: "Lines" },
      { key: "hatchDensity", label: "Hatch Density", kind: "slider", min: 5, max: 200, default: 30, section: "Lines" },
      { key: "hatchAngle", label: "Hatch Angle", kind: "slider", min: 0, max: 3.14, default: 0.7, section: "Lines" },
      { key: "paper", label: "Paper", kind: "color", default: [0.96, 0.95, 0.9], section: "Color" },
      { key: "ink", label: "Ink", kind: "color", default: [0.08, 0.08, 0.1], section: "Color" },
    ],
  },

  {
    kind: "posterizeOutline",
    label: "Poster + Outline",
    category: "stylize",
    hasBackground: true,
    preview:
      "linear-gradient(135deg, #ff2b2b 33%, #ffff00 33% 66%, #00ffcc 66%)",
    params: [
      { key: "steps", label: "Steps", kind: "slider", min: 2, max: 16, default: 4, step: 1, section: "Posterize" },
      { key: "outline", label: "Outline", kind: "slider", min: 0, max: 1, default: 0.15, section: "Outline" },
      { key: "outlineSoft", label: "Outline Soft", kind: "slider", min: 0, max: 0.3, default: 0.05, section: "Outline" },
      { key: "lineCol", label: "Line Color", kind: "color", default: [0, 0, 0], section: "Outline" },
      { key: "saturation", label: "Saturation", kind: "slider", min: 0, max: 2, default: 1, section: "Color" },
    ],
  },

  {
    kind: "tiltShift",
    label: "Tilt Shift",
    category: "blur",
    hasBackground: true,
    preview:
      "linear-gradient(180deg, rgba(255,255,255,0.08), transparent 35%, transparent 65%, rgba(255,255,255,0.08)), #222",
    params: [
      { key: "focus", label: "Focus", kind: "slider", min: 0, max: 1, default: 0.5, section: "Focus" },
      { key: "width", label: "Focus Width", kind: "slider", min: 0, max: 0.6, default: 0.15, section: "Focus" },
      { key: "blur", label: "Max Blur", kind: "slider", min: 0, max: 0.06, default: 0.015, section: "Focus" },
      { key: "falloff", label: "Falloff", kind: "slider", min: 0.01, max: 0.8, default: 0.2, section: "Focus" },
      { key: "direction", label: "Direction", kind: "select", default: 0, options: [
        { label: "Horizontal", value: 0 },
        { label: "Vertical", value: 1 },
        { label: "Radial", value: 2 },
      ], section: "Focus" },
      { key: "desaturate", label: "Desaturate", kind: "slider", min: 0, max: 1, default: 0, section: "Color" },
    ],
  },

  {
    kind: "hueRotate",
    label: "Hue Rotate",
    category: "color",
    hasBackground: true,
    preview:
      "conic-gradient(from 0deg, #f00, #ff0, #0f0, #0ff, #00f, #f0f, #f00)",
    params: [
      { key: "hue", label: "Hue", kind: "slider", min: 0, max: TWO_PI, default: 0, section: "Color" },
      { key: "sat", label: "Saturation", kind: "slider", min: 0, max: 2, default: 1, section: "Color" },
      { key: "val", label: "Value", kind: "slider", min: 0, max: 2, default: 1, section: "Color" },
      { key: "temperature", label: "Temperature", kind: "slider", min: -1, max: 1, default: 0, section: "Color" },
      { key: "gamma", label: "Gamma", kind: "slider", min: 0.2, max: 3, default: 1, section: "Tone" },
      { key: "contrast", label: "Contrast", kind: "slider", min: 0, max: 3, default: 1, section: "Tone" },
      { key: "tint", label: "Tint", kind: "color", default: [1, 1, 1], section: "Tone" },
      { key: "tintMix", label: "Tint Mix", kind: "slider", min: 0, max: 1, default: 0, section: "Tone" },
    ],
  },

  {
    kind: "pixelSorting",
    label: "Pixel Sorting",
    category: "distort",
    hasBackground: true,
    preview:
      "linear-gradient(90deg, #000, #ff2b2b 30%, #ff8, #ff2b2b 70%, #000)",
    params: [
      { key: "threshold", label: "Threshold", kind: "slider", min: 0, max: 1, default: 0.25, section: "Gate" },
      { key: "upper", label: "Upper Threshold", kind: "slider", min: 0, max: 1, default: 0.9, section: "Gate" },
      { key: "range", label: "Sort Range", kind: "slider", min: 0, max: 1, default: 0.4, section: "Gate" },
      { key: "direction", label: "Direction", kind: "select", default: 0, section: "Direction", options: [
        { label: "Horizontal", value: 0 },
        { label: "Vertical", value: 1 },
      ]},
      { key: "mode", label: "Sort By", kind: "select", default: 0, section: "Direction", options: [
        { label: "Luma", value: 0 },
        { label: "Hue", value: 1 },
        { label: "Saturation", value: 2 },
      ]},
      { key: "reverse", label: "Reverse", kind: "select", default: 0, section: "Direction", options: [
        { label: "Off", value: 0 }, { label: "On", value: 1 },
      ]},
      { key: "speed", label: "Anim Speed", kind: "slider", min: 0, max: 4, default: 0.2, section: "Animation" },
    ],
  },

  {
    kind: "slice",
    label: "Slice",
    category: "distort",
    hasBackground: true,
    preview:
      "repeating-linear-gradient(0deg, #ff2b2b 0 4px, #000 4px 6px, #00ffcc 6px 8px)",
    params: [
      { key: "amount", label: "Amount", kind: "slider", min: 0, max: 1, default: 0.35, section: "Shift" },
      { key: "sliceHeight", label: "Slice Height", kind: "slider", min: 5, max: 200, default: 40, section: "Shift" },
      { key: "blockWidth", label: "Block Width", kind: "slider", min: 4, max: 120, default: 20, section: "Shift" },
      { key: "density", label: "Density", kind: "slider", min: 0, max: 1, default: 0.4, section: "Shift" },
      { key: "dispersion", label: "Dispersion", kind: "slider", min: 0, max: 1, default: 0.3, section: "Shift" },
      { key: "speed", label: "Speed", kind: "slider", min: 0, max: 15, default: 3, section: "Animation" },
      { key: "direction", label: "Direction", kind: "select", default: 0, section: "Direction", options: [
        { label: "Horizontal", value: 0 },
        { label: "Vertical", value: 1 },
      ]},
    ],
  },

  {
    kind: "edgeDetect",
    label: "Edge Detect",
    category: "stylize",
    hasBackground: true,
    preview:
      "linear-gradient(#000, #000), conic-gradient(from 45deg, transparent 0 10%, #fff 10% 12%, transparent 12%)",
    params: [
      { key: "threshold", label: "Threshold", kind: "slider", min: 0, max: 1, default: 0.2, section: "Edge" },
      { key: "strength", label: "Strength", kind: "slider", min: 0, max: 4, default: 1, section: "Edge" },
      { key: "thickness", label: "Thickness", kind: "slider", min: 0.5, max: 4, default: 1, section: "Edge" },
      { key: "invert", label: "Invert", kind: "select", default: 0, options: [
        { label: "Off", value: 0 }, { label: "On", value: 1 },
      ], section: "Edge" },
      { key: "colorMode", label: "Color Mode", kind: "select", default: 0, options: [
        { label: "Monochrome", value: 0 }, { label: "From Source", value: 1 },
      ], section: "Color" },
      { key: "lineColor", label: "Line", kind: "color", default: [1, 1, 1], section: "Color" },
      { key: "bgColor", label: "Background", kind: "color", default: [0, 0, 0], section: "Color" },
    ],
  },

  {
    kind: "displacementMap",
    label: "Displacement Map",
    category: "distort",
    hasBackground: true,
    preview:
      "linear-gradient(135deg, #000 30%, #ff2b2b 50%, #000 70%)",
    params: [
      { key: "strength", label: "Strength", kind: "slider", min: 0, max: 0.3, default: 0.05, section: "Displacement" },
      { key: "midpoint", label: "Midpoint", kind: "slider", min: 0, max: 1, default: 0.5, section: "Displacement" },
      { key: "direction", label: "Direction", kind: "vec2", default: [1, 1], section: "Displacement" },
      { key: "channel", label: "Channel", kind: "select", default: 0, options: [
        { label: "Red", value: 0 },
        { label: "Green", value: 1 },
        { label: "Blue", value: 2 },
        { label: "Luma", value: 3 },
      ], section: "Displacement" },
      { key: "scale", label: "Map Scale", kind: "slider", min: 0.1, max: 10, default: 1, section: "Displacement" },
    ],
  },

  {
    kind: "progressiveBlur",
    label: "Progressive Blur",
    category: "blur",
    hasBackground: true,
    preview:
      "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.8) 100%), #222",
    params: [
      { key: "angle", label: "Angle", kind: "slider", min: 0, max: 6.2831853, default: 1.5708, section: "Ramp" },
      { key: "start", label: "Start", kind: "slider", min: 0, max: 1, default: 0.2, section: "Ramp" },
      { key: "end", label: "End", kind: "slider", min: 0, max: 1, default: 0.9, section: "Ramp" },
      { key: "strength", label: "Strength", kind: "slider", min: 0, max: 0.2, default: 0.05, section: "Ramp" },
      { key: "curve", label: "Curve", kind: "slider", min: 0.2, max: 5, default: 1, section: "Ramp" },
    ],
  },

  {
    kind: "model",
    label: "3D Model",
    category: "sampler",
    hasBackground: true,
    preview:
      "radial-gradient(ellipse at 40% 35%, #9ac 0%, #222 70%), radial-gradient(ellipse at 60% 70%, rgba(255,255,255,0.2) 0%, transparent 50%), #000",
    params: [
      // Source
      { key: "source", label: "Source", kind: "select", default: 0, section: "Geometry", options: [
        { label: "Primitive", value: 0 },
        { label: "GLB / GLTF", value: 1 },
        { label: "SVG Extrude", value: 2 },
      ]},
      // Primitive
      { key: "primitive", label: "Primitive", kind: "select", default: 2, section: "Geometry",
        visibleWhen: { key: "source", equals: 0 }, options: [
        { label: "Box", value: 0 },
        { label: "Sphere", value: 1 },
        { label: "Torus", value: 2 },
        { label: "Torus Knot", value: 3 },
        { label: "Cylinder", value: 4 },
        { label: "Cone", value: 5 },
        { label: "Plane", value: 6 },
        { label: "Dodecahedron", value: 7 },
        { label: "Icosahedron", value: 8 },
        { label: "Octahedron", value: 9 },
        { label: "Tetrahedron", value: 10 },
      ]},
      { key: "size", label: "Size", kind: "slider", min: 0.1, max: 3, default: 1, section: "Geometry",
        visibleWhen: { key: "source", equals: 0 } },
      { key: "segments", label: "Segments", kind: "slider", min: 3, max: 128, step: 1, default: 48, section: "Geometry",
        visibleWhen: { key: "source", equals: 0 } },
      { key: "tubeRatio", label: "Tube Ratio", kind: "slider", min: 0.05, max: 0.6, default: 0.3, section: "Geometry",
        visibleWhen: { key: "source", equals: 0 } },
      // SVG
      { key: "extrudeDepth", label: "Extrude Depth", kind: "slider", min: 0, max: 2, default: 0.2, section: "Geometry",
        visibleWhen: { key: "source", equals: 2 } },
      { key: "bevel", label: "Bevel", kind: "slider", min: 0, max: 0.2, default: 0.02, section: "Geometry",
        visibleWhen: { key: "source", equals: 2 } },
      { key: "svgScale", label: "SVG Scale", kind: "slider", min: 0.001, max: 0.05, default: 0.008, section: "Geometry",
        visibleWhen: { key: "source", equals: 2 } },
      // Material
      { key: "material", label: "Material", kind: "select", default: 0, section: "Material", options: [
        { label: "Physical", value: 0 },
        { label: "Glass", value: 1 },
        { label: "Metal", value: 2 },
        { label: "Basic", value: 3 },
        { label: "Matcap Silver", value: 4 },
        { label: "Matcap Gold", value: 5 },
        { label: "Matcap Chrome", value: 6 },
        { label: "Wireframe", value: 7 },
        { label: "Normal", value: 8 },
      ]},
      { key: "color", label: "Color", kind: "color", default: [0.9, 0.92, 1], section: "Material" },
      { key: "metalness", label: "Metalness", kind: "slider", min: 0, max: 1, default: 0.1, section: "Material",
        visibleWhen: { key: "material", in: [0, 1, 2] } },
      { key: "roughness", label: "Roughness", kind: "slider", min: 0, max: 1, default: 0.2, section: "Material",
        visibleWhen: { key: "material", in: [0, 1, 2] } },
      { key: "transmission", label: "Transmission", kind: "slider", min: 0, max: 1, default: 0.95, section: "Material",
        visibleWhen: { key: "material", equals: 1 } },
      { key: "ior", label: "IOR", kind: "slider", min: 1, max: 2.33, default: 1.45, section: "Material",
        visibleWhen: { key: "material", equals: 1 } },
      { key: "thickness", label: "Thickness", kind: "slider", min: 0, max: 3, default: 0.5, section: "Material",
        visibleWhen: { key: "material", equals: 1 } },
      { key: "clearcoat", label: "Clearcoat", kind: "slider", min: 0, max: 1, default: 0, section: "Material",
        visibleWhen: { key: "material", in: [0, 1, 2] } },
      { key: "emissive", label: "Emissive", kind: "color", default: [0, 0, 0], section: "Material" },
      { key: "emissiveIntensity", label: "Emissive Power", kind: "slider", min: 0, max: 5, default: 0, section: "Material" },
      // Camera
      { key: "distance", label: "Distance", kind: "slider", min: 0.5, max: 20, default: 3, section: "Camera" },
      { key: "yaw", label: "Yaw", kind: "slider", min: 0, max: 6.2831853, default: 0.6, section: "Camera" },
      { key: "pitch", label: "Pitch", kind: "slider", min: -1.5, max: 1.5, default: 0.15, section: "Camera" },
      { key: "fov", label: "FOV", kind: "slider", min: 15, max: 120, default: 40, section: "Camera" },
      { key: "yOffset", label: "Y Offset", kind: "slider", min: -3, max: 3, default: 0, section: "Camera" },
      { key: "autoRotate", label: "Auto Rotate", kind: "slider", min: -5, max: 5, default: 0.6, section: "Animation" },
      // Lighting
      { key: "envStrength", label: "Env Strength", kind: "slider", min: 0, max: 3, default: 1, section: "Lighting" },
      { key: "ambient", label: "Ambient", kind: "slider", min: 0, max: 2, default: 0.35, section: "Lighting" },
      { key: "keyIntensity", label: "Key Light", kind: "slider", min: 0, max: 6, default: 2.2, section: "Lighting" },
      { key: "keyColor", label: "Key Color", kind: "color", default: [1, 0.95, 0.85], section: "Lighting" },
      { key: "rimIntensity", label: "Rim Light", kind: "slider", min: 0, max: 4, default: 1, section: "Lighting" },
      { key: "rimColor", label: "Rim Color", kind: "color", default: [0.6, 0.8, 1], section: "Lighting" },
      { key: "bgColor", label: "BG Color", kind: "color", default: [0, 0, 0], section: "Lighting" },
      // Color correction
      { key: "exposure", label: "Exposure", kind: "slider", min: -3, max: 3, default: 0, section: "Color" },
      { key: "contrast", label: "Contrast", kind: "slider", min: 0, max: 3, default: 1, section: "Color" },
      { key: "saturation", label: "Saturation", kind: "slider", min: 0, max: 2, default: 1, section: "Color" },
      { key: "tint", label: "Tint", kind: "color", default: [1, 1, 1], section: "Color" },
      { key: "tintMix", label: "Tint Mix", kind: "slider", min: 0, max: 1, default: 0, section: "Color" },
    ],
  },

  {
    kind: "flutedGlass",
    label: "Fluted Glass",
    category: "distort",
    hasBackground: true,
    preview:
      "repeating-linear-gradient(90deg, rgba(255,255,255,0.3) 0 3px, rgba(0,0,0,0.5) 3px 7px), #333",
    params: [
      { key: "frequency", label: "Frequency", kind: "slider", min: 5, max: 300, default: 60, section: "Glass" },
      { key: "amplitude", label: "Amplitude", kind: "slider", min: 0, max: 0.1, default: 0.015, section: "Glass" },
      { key: "angle", label: "Angle", kind: "slider", min: 0, max: 6.2831853, default: 0, section: "Glass" },
      { key: "warp", label: "Warp", kind: "slider", min: 0, max: 1, default: 0.1, section: "Glass" },
      { key: "irregularity", label: "Irregularity", kind: "slider", min: 0, max: 1, default: 0.15, section: "Glass" },
      { key: "edgeShade", label: "Edge Shade", kind: "slider", min: 0, max: 1, default: 0.25, section: "Glass" },
    ],
  },
];

export const EFFECTS_BY_KIND: Record<LayerKind, EffectDef> = Object.fromEntries(
  EFFECTS.map((e) => [e.kind, e]),
) as Record<LayerKind, EffectDef>;

export const CATEGORIES: {
  key: "all" | EffectDef["category"];
  label: string;
}[] = [
  { key: "all", label: "All" },
  { key: "source", label: "Source" },
  { key: "sampler", label: "Sampler" },
  { key: "color", label: "Color" },
  { key: "distort", label: "Distort" },
  { key: "blur", label: "Blur" },
  { key: "stylize", label: "Stylize" },
  { key: "misc", label: "Misc" },
];

export function buildDefaultUniforms(
  kind: LayerKind,
): Record<string, UniformValue> {
  const def = EFFECTS_BY_KIND[kind];
  const u: Record<string, UniformValue> = {};
  if (!def) return u;
  for (const p of def.params) {
    if (p.kind !== "text" && p.kind !== "font") {
      u[p.key] = p.default;
    }
  }
  return u;
}
