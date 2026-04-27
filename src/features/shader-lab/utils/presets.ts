import type { Layer, LayerKind, UniformValue } from "../types";
import { buildDefaultUniforms, EFFECTS_BY_KIND } from "./effectCatalog";

export interface PresetLayerSpec {
  kind: LayerKind;
  name?: string;
  uniformOverrides?: Record<string, UniformValue>;
  blendMode?: Layer["blendMode"];
  opacity?: number;
  asset?: Layer["asset"];
}

export interface Preset {
  id: string;
  label: string;
  description: string;
  thumbnail: string;
  layers: PresetLayerSpec[];
}

function gen() {
  return Math.random().toString(36).slice(2, 11);
}

export function materializePreset(preset: Preset): Layer[] {
  return preset.layers.map((spec) => {
    const def = EFFECTS_BY_KIND[spec.kind];
    const uniforms = {
      ...buildDefaultUniforms(spec.kind),
      ...(spec.uniformOverrides ?? {}),
    };
    const asset =
      spec.asset ??
      (spec.kind === "text"
        ? {
            text: "basement",
            fontSize: 320,
            fontFamily: "Inter",
            fontWeight: 800,
          }
        : spec.kind === "customShader"
          ? { fragmentSource: "gl_FragColor = vec4(vUv, 0.5, 1.0);" }
          : undefined);
    return {
      id: gen(),
      kind: spec.kind,
      name: spec.name ?? def?.label ?? spec.kind,
      visible: true,
      opacity: spec.opacity ?? 1,
      blendMode: spec.blendMode ?? (spec.kind === "text" ? "additive" : "normal"),
      compositeMode: "filter" as const,
      mask: {
        source: "luminance" as const,
        mode: "multiply" as const,
        invert: false,
        threshold: 0.5,
      },
      uniforms,
      asset,
      tracks: [],
      interactions: [],
    };
  });
}

export const PRESETS: Preset[] = [
  // THE SIGNATURE — huge red letters glowing on pure black
  {
    id: "basement",
    label: "basement",
    description: "Glowing red wordmark on black.",
    thumbnail:
      "radial-gradient(ellipse at 50% 50%, #ff2020 0%, rgba(255,40,40,0.35) 22%, #000 62%), #000",
    layers: [
      { kind: "solid", name: "BG", uniformOverrides: { color: [0, 0, 0] } },
      {
        kind: "text",
        name: "basement",
        asset: { text: "basement", fontSize: 360, fontWeight: 800, fontFamily: "Inter" },
        uniformOverrides: { color: [1, 0.1, 0.1], fit: 0 },
        blendMode: "additive",
      },
      {
        kind: "bloom",
        name: "Glow",
        uniformOverrides: {
          thresh: 0.15,
          knee: 0.7,
          radius: 0.06,
          strength: 2.4,
          tint: [1, 0.35, 0.35],
        },
      },
      {
        kind: "vignette",
        uniformOverrides: { start: 0.4, end: 1.05, tint: [0, 0, 0], tintMix: 1 },
      },
    ],
  },

  // NEON CITY — saturated night mesh, hot text, heavy bloom
  {
    id: "neon-city",
    label: "Neon City",
    description: "Saturated neon cityscape with glow.",
    thumbnail:
      "radial-gradient(ellipse at 30% 30%, #ff00ff 0%, transparent 50%), radial-gradient(ellipse at 70% 70%, #00f0ff 0%, transparent 50%), #110022",
    layers: [
      {
        kind: "meshGradient",
        name: "Night",
        uniformOverrides: {
          c00: [0.05, 0, 0.18],
          c10: [0.08, 0.02, 0.3],
          c01: [0.15, 0.02, 0.2],
          c11: [0, 0, 0.05],
          anim: 0.25,
          speed: 0.2,
          softness: 1.4,
        },
      },
      {
        kind: "meshGradient",
        name: "Neon Flare",
        uniformOverrides: {
          c00: [1, 0, 0.8],
          c10: [0, 0.95, 1],
          c01: [0.6, 0, 1],
          c11: [0, 0, 0.15],
          anim: 0.9,
          speed: 0.8,
          softness: 0.8,
          distort: 0.25,
          distortFreq: 3,
        },
        blendMode: "screen",
        opacity: 0.7,
      },
      {
        kind: "text",
        name: "TOKYO",
        asset: { text: "TOKYO", fontSize: 320, fontWeight: 900, fontFamily: "Inter" },
        uniformOverrides: { color: [1, 0.95, 1], fit: 0, stroke: 3, strokeColor: [0, 0, 0] },
        blendMode: "screen",
      },
      {
        kind: "chromaticAberration",
        uniformOverrides: { strength: 0.028, falloff: 1.6, radial: 1, splitR: 1.3, splitB: -1.1 },
      },
      {
        kind: "crt",
        uniformOverrides: {
          mode: 0,
          mask: 0.3,
          maskScale: 2.2,
          scanline: 0.25,
          scanCount: 700,
          barrel: 0.11,
          bloom: 0,
          vignette: 0.5,
          flicker: 0.06,
        },
      },
      {
        kind: "bloom",
        uniformOverrides: { thresh: 0.4, knee: 0.6, radius: 0.12, strength: 2.8, tint: [1, 0.7, 1] },
      },
    ],
  },

  // MATRIX — deep green ASCII rain
  {
    id: "matrix",
    label: "Matrix",
    description: "Green code raining on black.",
    thumbnail: "repeating-linear-gradient(0deg, #0cff45 0 1px, rgba(0,0,0,0.95) 1px 6px), #000",
    layers: [
      { kind: "solid", uniformOverrides: { color: [0, 0.02, 0] } },
      {
        kind: "meshGradient",
        name: "Green Fog",
        uniformOverrides: {
          c00: [0.0, 0.12, 0.04],
          c10: [0.02, 0.35, 0.1],
          c01: [0, 0.08, 0.03],
          c11: [0, 0.02, 0.01],
          anim: 0.8,
          speed: 1.4,
          softness: 1.8,
          distort: 0.12,
          distortFreq: 8,
        },
      },
      {
        kind: "ascii",
        name: "Code",
        uniformOverrides: {
          cellPx: 10,
          aspect: 0.55,
          threshold: 0,
          contrast: 2.5,
          colorMode: 0,
          invert: 0,
          ink: [0.4, 1, 0.5],
          paper: [0, 0, 0],
        },
      },
      {
        kind: "bloom",
        uniformOverrides: { thresh: 0.3, knee: 0.6, radius: 0.08, strength: 2.4, tint: [0.5, 1, 0.6] },
      },
      { kind: "vignette", uniformOverrides: { start: 0.35, end: 1.05, tint: [0, 0.02, 0], tintMix: 1 } },
    ],
  },

  // ACID POSTER — saturated halftone silkscreen
  {
    id: "acid-poster",
    label: "Acid Poster",
    description: "Hot silkscreen in halftone dots.",
    thumbnail:
      "radial-gradient(ellipse at 30% 30%, #ff1493 30%, transparent 60%), radial-gradient(ellipse at 70% 70%, #ffea00 30%, transparent 60%), radial-gradient(ellipse at 50% 50%, #00e5ff 20%, transparent 50%), #000",
    layers: [
      {
        kind: "meshGradient",
        name: "Rave",
        uniformOverrides: {
          c00: [1, 0.08, 0.55],
          c10: [0.2, 1, 0.4],
          c01: [1, 0.92, 0],
          c11: [0.15, 0, 0.5],
          anim: 0.9,
          speed: 1.1,
          softness: 1.1,
          distort: 0.3,
          distortFreq: 4,
        },
      },
      { kind: "posterize", uniformOverrides: { steps: 5, gamma: 0.85, mix: 0.9 } },
      {
        kind: "halftone",
        uniformOverrides: {
          cellPx: 7,
          angle: 0.3,
          dotScale: 1.3,
          shape: 0,
          softness: 0.06,
          ink: [0.06, 0.04, 0.08],
          paper: [1, 0.95, 0.88],
          invert: 0,
        },
      },
      {
        kind: "ink",
        uniformOverrides: { edgeThresh: 0.8, edgeSoft: 0.1, edgeThick: 1.2, grain: 0.28, grainScale: 2, paper: [1, 0.95, 0.88], ink: [0.05, 0.03, 0.08] },
        opacity: 0.5,
      },
    ],
  },

  // VHS HAUNTED — tape artifacts, dark chroma
  {
    id: "vhs-haunted",
    label: "VHS Haunted",
    description: "Blood-red tape with slice glitch.",
    thumbnail:
      "radial-gradient(ellipse at 50% 50%, #ff1a2e 0%, #1a0005 60%, #000 95%), repeating-linear-gradient(0deg, rgba(255,255,255,0.05) 0 1px, transparent 1px 4px)",
    layers: [
      {
        kind: "meshGradient",
        name: "Blood",
        uniformOverrides: {
          c00: [0.3, 0.02, 0.04],
          c10: [0.05, 0, 0.02],
          c01: [0.55, 0.08, 0.1],
          c11: [0, 0, 0.02],
          anim: 0.5,
          speed: 0.4,
          softness: 1.6,
          distort: 0.18,
          distortFreq: 5,
        },
      },
      {
        kind: "text",
        name: "REC",
        asset: { text: "REC ●", fontSize: 200, fontWeight: 900, fontFamily: "JetBrains Mono, monospace" },
        uniformOverrides: { color: [1, 0.05, 0.1], fit: 0, yOffset: -0.25, align: 0, letterSpacing: 4 },
        blendMode: "additive",
      },
      {
        kind: "slice",
        uniformOverrides: { amount: 0.12, sliceHeight: 70, density: 0.4, dispersion: 0.2, speed: 3, blockWidth: 28 },
      },
      {
        kind: "chromaticAberration",
        uniformOverrides: { strength: 0.028, falloff: 1.6, radial: 1, splitR: 1.5, splitB: -1.3 },
      },
      {
        kind: "crt",
        uniformOverrides: {
          mode: 3,
          mask: 0.35,
          maskScale: 1.8,
          scanline: 0.6,
          scanCount: 380,
          barrel: 0.14,
          curvature: 0.25,
          bloom: 0.8,
          bloomThresh: 0.35,
          flicker: 0.2,
          noise: 0.15,
          vignette: 0.75,
        },
      },
      {
        kind: "bloom",
        uniformOverrides: { thresh: 0.35, knee: 0.6, radius: 0.1, strength: 1.8, tint: [1, 0.3, 0.3] },
      },
    ],
  },

  // AURORA — ethereal teal/violet sweep
  {
    id: "aurora",
    label: "Aurora",
    description: "Northern-lights sweep with bloom.",
    thumbnail:
      "linear-gradient(135deg, #0d1b4a 0%, #1177ff 25%, #22ffcc 55%, #9d27ff 85%)",
    layers: [
      {
        kind: "meshGradient",
        name: "Sky",
        uniformOverrides: {
          c00: [0.02, 0.05, 0.2],
          c10: [0.1, 0.85, 0.85],
          c01: [0.08, 0.3, 1],
          c11: [0.6, 0.08, 0.9],
          anim: 0.95,
          speed: 0.55,
          distort: 0.28,
          distortFreq: 3,
          softness: 1.6,
        },
      },
      {
        kind: "meshGradient",
        name: "Shimmer",
        uniformOverrides: {
          c00: [0.4, 1, 0.8],
          c10: [0.1, 0.2, 0.8],
          c01: [0.2, 0.8, 1],
          c11: [0, 0, 0.05],
          anim: 1,
          speed: 0.9,
          distort: 0.35,
          distortFreq: 7,
          softness: 1.3,
        },
        blendMode: "screen",
        opacity: 0.55,
      },
      {
        kind: "directionalBlur",
        uniformOverrides: { dir: [0.1, 1], length: 0.05, curve: 1, bidirectional: 1 },
        opacity: 0.9,
      },
      {
        kind: "bloom",
        uniformOverrides: { thresh: 0.35, knee: 0.7, radius: 0.14, strength: 2.5, tint: [0.6, 0.95, 1] },
      },
      { kind: "vignette", uniformOverrides: { start: 0.4, end: 1.1, tint: [0, 0, 0.04], tintMix: 1 } },
    ],
  },

  // BLUEPRINT — cyanotype technical
  {
    id: "blueprint",
    label: "Blueprint",
    description: "Technical grid and text on cyanotype.",
    thumbnail:
      "repeating-linear-gradient(90deg, #6ca0ff 0 1px, transparent 1px 20px), repeating-linear-gradient(0deg, #6ca0ff 0 1px, transparent 1px 20px), #0a3a8c",
    layers: [
      { kind: "solid", uniformOverrides: { color: [0.025, 0.18, 0.52] } },
      {
        kind: "pattern",
        name: "Grid",
        uniformOverrides: {
          kind: 2,
          scale: 60,
          angle: 0,
          thickness: 0.04,
          softness: 0.005,
          fg: [0.55, 0.78, 1],
          bg: [0.025, 0.18, 0.52],
        },
        opacity: 0.22,
      },
      {
        kind: "pattern",
        name: "Micro Grid",
        uniformOverrides: {
          kind: 2,
          scale: 12,
          thickness: 0.03,
          softness: 0.005,
          fg: [0.55, 0.78, 1],
          bg: [0.025, 0.18, 0.52],
        },
        opacity: 0.1,
      },
      {
        kind: "text",
        name: "SCHEMATIC",
        asset: { text: "SCHEMATIC / v1.0", fontSize: 120, fontWeight: 500, fontFamily: "JetBrains Mono, monospace" },
        uniformOverrides: { color: [0.9, 0.97, 1], fit: 0, letterSpacing: 2, yOffset: 0.3 },
        blendMode: "screen",
      },
      {
        kind: "bloom",
        uniformOverrides: { thresh: 0.7, knee: 0.4, radius: 0.05, strength: 1.2, tint: [0.8, 0.92, 1] },
      },
      { kind: "vignette", uniformOverrides: { start: 0.55, end: 1.1, tint: [0, 0.05, 0.15], tintMix: 0.8 } },
    ],
  },

  // CYBERDREAM — hazy lenticular glass
  {
    id: "cyberdream",
    label: "Cyberdream",
    description: "Pink-cyan gradient behind fluted glass.",
    thumbnail:
      "repeating-linear-gradient(90deg, rgba(255,255,255,0.15) 0 3px, transparent 3px 7px), linear-gradient(135deg, #ff77ff 0%, #77faff 60%, #7700ff)",
    layers: [
      {
        kind: "meshGradient",
        name: "Blush",
        uniformOverrides: {
          c00: [1, 0.5, 0.95],
          c10: [0.45, 0.95, 1],
          c01: [0.95, 0.35, 1],
          c11: [0.25, 0.12, 0.55],
          anim: 0.85,
          speed: 0.7,
          softness: 1.5,
          distort: 0.25,
          distortFreq: 4,
        },
      },
      {
        kind: "text",
        name: "dream",
        asset: { text: "dream", fontSize: 340, fontWeight: 300, fontFamily: "Georgia, serif" },
        uniformOverrides: { color: [1, 1, 1], fit: 0, italic: 1, yOffset: 0.02 },
        blendMode: "screen",
        opacity: 0.95,
      },
      {
        kind: "flutedGlass",
        uniformOverrides: { frequency: 90, amplitude: 0.018, angle: 0, warp: 0.3, irregularity: 0.2, edgeShade: 0.28 },
      },
      {
        kind: "bloom",
        uniformOverrides: { thresh: 0.45, knee: 0.7, radius: 0.1, strength: 2, tint: [1, 0.75, 1] },
      },
      { kind: "vignette", uniformOverrides: { start: 0.55, end: 1.1, tint: [0.08, 0, 0.1], tintMix: 0.8 } },
    ],
  },

  // PLOTTER — pen-plotter line drawing
  {
    id: "plotter",
    label: "Plotter",
    description: "Pen plotter crosshatch on paper.",
    thumbnail:
      "repeating-linear-gradient(45deg, #1a1a1a 0 1px, transparent 1px 8px), repeating-linear-gradient(-45deg, #1a1a1a 0 1px, transparent 1px 8px), #f3ecd6",
    layers: [
      {
        kind: "meshGradient",
        name: "Subject",
        uniformOverrides: {
          c00: [0.95, 0.92, 0.82],
          c10: [0.45, 0.35, 0.25],
          c01: [0.85, 0.75, 0.6],
          c11: [0.1, 0.08, 0.1],
          anim: 0.05,
          speed: 0.1,
          softness: 2,
        },
      },
      {
        kind: "plotter",
        name: "Lines",
        uniformOverrides: {
          thresh: 0.06,
          thickness: 0.014,
          hatch: 2,
          hatchDensity: 80,
          hatchAngle: 0.7,
          paper: [0.95, 0.92, 0.83],
          ink: [0.06, 0.05, 0.08],
        },
      },
      {
        kind: "ink",
        uniformOverrides: { edgeThresh: 1, grain: 0.2, grainScale: 3, paper: [0.95, 0.92, 0.83], ink: [0.1, 0.08, 0.12] },
        opacity: 0.55,
      },
      { kind: "vignette", uniformOverrides: { start: 0.5, end: 1.1, tint: [0.05, 0.03, 0.02], tintMix: 0.6 } },
    ],
  },

  // IMAGE — halftoned scenic photo
  {
    id: "photo-halftone",
    label: "Photo · Halftone",
    description: "Scenic photo in CMYK-style halftone.",
    thumbnail:
      "radial-gradient(circle at 50% 50%, #fff 2px, transparent 3px) 0 0 / 6px 6px, linear-gradient(135deg, #a48, #f9b 60%, #fdd)",
    layers: [
      {
        kind: "image",
        name: "Photo",
        asset: { url: "https://threejs.org/examples/textures/uv_grid_opengl.jpg" },
        uniformOverrides: {
          fit: 1,
          exposure: 0.2,
          contrast: 1.15,
          saturation: 1.3,
          tint: [1, 0.95, 0.95],
          tintMix: 0.15,
        },
      },
      {
        kind: "halftone",
        uniformOverrides: {
          cellPx: 5,
          angle: 0.35,
          dotScale: 1.15,
          shape: 0,
          softness: 0.05,
          ink: [0.03, 0.02, 0.05],
          paper: [1, 0.97, 0.9],
        },
      },
      {
        kind: "ink",
        uniformOverrides: {
          edgeThresh: 0.85,
          grain: 0.18,
          grainScale: 2.5,
          paper: [1, 0.97, 0.9],
          ink: [0.06, 0.04, 0.08],
        },
        opacity: 0.5,
      },
      { kind: "vignette", uniformOverrides: { start: 0.55, end: 1.05, tint: [0.05, 0, 0.05], tintMix: 0.7 } },
    ],
  },

  // VIDEO — looping clip with CRT and pixel sorting
  {
    id: "video-artifacts",
    label: "Video · Artifacts",
    description: "Clip wrapped in CRT + pixel sort.",
    thumbnail:
      "linear-gradient(180deg, rgba(0,255,255,0.15), transparent 30%, rgba(255,0,128,0.2) 70%), #111",
    layers: [
      {
        kind: "video",
        name: "Clip",
        asset: {
          url: "https://threejs.org/examples/textures/sintel.mp4",
        },
        uniformOverrides: { fit: 1, exposure: 0.1, contrast: 1.1, saturation: 1.15 },
      },
      {
        kind: "pixelSorting",
        uniformOverrides: { threshold: 0.35, upper: 0.9, range: 0.25, direction: 1, mode: 0, speed: 0.4 },
      },
      {
        kind: "chromaticAberration",
        uniformOverrides: { strength: 0.018, falloff: 1.8, radial: 1, splitR: 1.2, splitB: -1 },
      },
      {
        kind: "crt",
        uniformOverrides: {
          mode: 1,
          mask: 0.32,
          maskScale: 2,
          scanline: 0.38,
          scanCount: 520,
          barrel: 0.1,
          converge: 0.002,
          bloom: 0.55,
          flicker: 0.1,
          noise: 0.07,
          vignette: 0.6,
        },
      },
      {
        kind: "bloom",
        uniformOverrides: { thresh: 0.55, knee: 0.6, radius: 0.08, strength: 1.8, tint: [1, 0.85, 0.95] },
      },
    ],
  },

  // 3D MODEL — floating hero object with bloom + vignette
  {
    id: "3d-hero",
    label: "3D · Hero",
    description: "GLB model with cinematic lighting.",
    thumbnail:
      "radial-gradient(ellipse at 50% 45%, #ffe0a0 0%, #7a4a1a 25%, #221008 65%, #000 100%)",
    layers: [
      {
        kind: "meshGradient",
        name: "Backdrop",
        uniformOverrides: {
          c00: [0.05, 0.02, 0.08],
          c10: [0.1, 0.05, 0.18],
          c01: [0.02, 0.01, 0.04],
          c11: [0, 0, 0],
          anim: 0.2,
          speed: 0.15,
          softness: 1.8,
        },
      },
      {
        kind: "model",
        name: "Hero",
        asset: {
          url: "https://threejs.org/examples/models/gltf/DamagedHelmet/glTF/DamagedHelmet.gltf",
        },
        uniformOverrides: {
          distance: 3.2,
          yaw: 0.9,
          pitch: 0.1,
          fov: 38,
          autoRotate: 0.35,
          keyIntensity: 3.2,
          keyColor: [1, 0.92, 0.78],
          ambient: 0.5,
          envStrength: 1.5,
          exposure: 0.3,
          contrast: 1.1,
          saturation: 1.15,
          bgColor: [0, 0, 0],
        },
        blendMode: "screen",
      },
      {
        kind: "bloom",
        uniformOverrides: { thresh: 0.5, knee: 0.6, radius: 0.1, strength: 1.8, tint: [1, 0.88, 0.75] },
      },
      {
        kind: "chromaticAberration",
        uniformOverrides: { strength: 0.01, falloff: 2.5, radial: 1, splitR: 1, splitB: -1 },
      },
      { kind: "vignette", uniformOverrides: { start: 0.4, end: 1.05, tint: [0, 0, 0], tintMix: 1 } },
    ],
  },

  // GHOST — soft ethereal whisper
  {
    id: "ghost",
    label: "Ghost",
    description: "Faint text blurred in haze.",
    thumbnail:
      "radial-gradient(ellipse at 50% 50%, rgba(255,255,255,0.15), transparent 60%), #0a0a0f",
    layers: [
      {
        kind: "meshGradient",
        name: "Fog",
        uniformOverrides: {
          c00: [0.1, 0.1, 0.14],
          c10: [0.35, 0.32, 0.4],
          c01: [0.15, 0.15, 0.2],
          c11: [0.03, 0.03, 0.06],
          anim: 0.4,
          speed: 0.3,
          softness: 2.2,
          distort: 0.1,
          distortFreq: 3,
        },
      },
      {
        kind: "text",
        name: "ghost",
        asset: { text: "ghost", fontSize: 380, fontWeight: 200, fontFamily: "Georgia, serif" },
        uniformOverrides: { color: [1, 1, 1], fit: 0, italic: 1 },
        blendMode: "screen",
        opacity: 0.7,
      },
      {
        kind: "directionalBlur",
        uniformOverrides: { dir: [1, 0.15], length: 0.03, curve: 1, bidirectional: 1 },
      },
      {
        kind: "bloom",
        uniformOverrides: { thresh: 0.3, knee: 0.8, radius: 0.14, strength: 1.8, tint: [1, 1, 1] },
      },
      {
        kind: "chromaticAberration",
        uniformOverrides: { strength: 0.012, falloff: 2.5, radial: 1, splitR: 1, splitB: -1 },
      },
      { kind: "vignette", uniformOverrides: { start: 0.35, end: 1.05, tint: [0, 0, 0.02], tintMix: 1 } },
    ],
  },
];
