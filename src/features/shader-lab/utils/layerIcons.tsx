import type { ReactElement } from "react";
import type { LayerKind } from "../types";

type IconSpec = { d?: string; extra?: ReactElement };

const STROKE_ATTRS = {
  width: 14,
  height: 14,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function KindIcon({ kind }: { kind: LayerKind }) {
  const spec = ICON_MAP[kind];
  if (!spec) return null;
  return (
    <svg {...STROKE_ATTRS} aria-hidden="true">
      {spec.d && <path d={spec.d} />}
      {spec.extra}
    </svg>
  );
}

const ICON_MAP: Partial<Record<LayerKind, IconSpec>> = {
  solid: {
    extra: <rect x="4" y="4" width="16" height="16" rx="2" />,
  },
  gradient: {
    extra: (
      <>
        <rect x="4" y="4" width="16" height="16" rx="2" />
        <path d="M4 4 L20 20" />
      </>
    ),
  },
  meshGradient: {
    extra: (
      <>
        <circle cx="8" cy="9" r="3.5" />
        <circle cx="15" cy="14" r="4" />
      </>
    ),
  },
  pattern: {
    extra: (
      <>
        <circle cx="6" cy="6" r="1" />
        <circle cx="12" cy="6" r="1" />
        <circle cx="18" cy="6" r="1" />
        <circle cx="6" cy="12" r="1" />
        <circle cx="12" cy="12" r="1" />
        <circle cx="18" cy="12" r="1" />
        <circle cx="6" cy="18" r="1" />
        <circle cx="12" cy="18" r="1" />
        <circle cx="18" cy="18" r="1" />
      </>
    ),
  },
  noise: {
    extra: (
      <>
        <circle cx="6" cy="7" r="0.6" />
        <circle cx="10" cy="5" r="0.6" />
        <circle cx="15" cy="9" r="0.6" />
        <circle cx="19" cy="6" r="0.6" />
        <circle cx="5" cy="13" r="0.6" />
        <circle cx="12" cy="15" r="0.6" />
        <circle cx="17" cy="14" r="0.6" />
        <circle cx="8" cy="19" r="0.6" />
        <circle cx="14" cy="18" r="0.6" />
        <circle cx="19" cy="20" r="0.6" />
      </>
    ),
  },
  voronoi: {
    d: "M5 5 L12 3 L19 6 L21 13 L17 20 L9 21 L3 16 L4 9 Z M12 3 L12 12 M19 6 L12 12 M21 13 L12 12 M17 20 L12 12 M9 21 L12 12 M3 16 L12 12 M4 9 L12 12 M5 5 L12 12",
  },
  image: {
    extra: (
      <>
        <rect x="3" y="4" width="18" height="16" rx="2" />
        <circle cx="9" cy="10" r="1.5" />
        <path d="M21 16 L15 10 L5 20" />
      </>
    ),
  },
  video: {
    extra: (
      <>
        <rect x="3" y="6" width="13" height="12" rx="2" />
        <path d="M16 10 L22 7 L22 17 L16 14 Z" />
      </>
    ),
  },
  webcam: {
    extra: (
      <>
        <circle cx="12" cy="12" r="7" />
        <circle cx="12" cy="12" r="3" />
      </>
    ),
  },
  text: {
    d: "M5 5 H19 M12 5 V20 M9 20 H15",
  },
  customShader: {
    d: "M8 6 L3 12 L8 18 M16 6 L21 12 L16 18 M14 4 L10 20",
  },
  model: {
    d: "M12 3 L21 7.5 L21 16.5 L12 21 L3 16.5 L3 7.5 Z M12 3 V21 M3 7.5 L12 12 L21 7.5",
  },
  crt: {
    extra: (
      <>
        <rect x="3" y="5" width="18" height="12" rx="2" />
        <path d="M8 21 H16 M12 17 V21" />
        <path d="M7 9 H17 M7 12 H17" />
      </>
    ),
  },
  ascii: {
    d: "M4 20 L8 4 L12 20 M5 14 H11 M14 4 V20 M14 4 H18 A2 2 0 0 1 20 6 V8 A2 2 0 0 1 18 10 H14",
  },
  halftone: {
    extra: (
      <>
        <circle cx="8" cy="8" r="2" />
        <circle cx="16" cy="8" r="1.3" />
        <circle cx="8" cy="16" r="1.3" />
        <circle cx="16" cy="16" r="0.7" />
      </>
    ),
  },
  dithering: {
    extra: (
      <>
        <rect x="4" y="4" width="4" height="4" />
        <rect x="12" y="4" width="4" height="4" />
        <rect x="8" y="8" width="4" height="4" />
        <rect x="16" y="8" width="4" height="4" />
        <rect x="4" y="12" width="4" height="4" />
        <rect x="12" y="12" width="4" height="4" />
        <rect x="8" y="16" width="4" height="4" />
        <rect x="16" y="16" width="4" height="4" />
      </>
    ),
  },
  pixelation: {
    extra: (
      <>
        <rect x="3" y="3" width="6" height="6" />
        <rect x="9" y="9" width="6" height="6" />
        <rect x="15" y="15" width="6" height="6" />
      </>
    ),
  },
  threshold: {
    extra: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 3 V21" />
      </>
    ),
  },
  posterize: {
    d: "M4 6 H20 M4 10 H20 M4 14 H20 M4 18 H20",
  },
  bloom: {
    d: "M12 3 V7 M12 17 V21 M3 12 H7 M17 12 H21 M5.6 5.6 L8.5 8.5 M15.5 15.5 L18.4 18.4 M5.6 18.4 L8.5 15.5 M15.5 8.5 L18.4 5.6",
    extra: <circle cx="12" cy="12" r="3.5" />,
  },
  vignette: {
    extra: (
      <>
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <circle cx="12" cy="12" r="5" />
      </>
    ),
  },
  glitch: {
    d: "M3 7 H10 L13 4 H21 M3 12 H8 L11 15 H21 M3 17 H15 L18 14 H21",
  },
  directionalBlur: {
    d: "M3 7 H18 M3 12 H16 M3 17 H14",
  },
  chromaticAberration: {
    extra: (
      <>
        <circle cx="10" cy="12" r="5" opacity="0.6" />
        <circle cx="14" cy="12" r="5" opacity="0.6" />
      </>
    ),
  },
  ink: {
    d: "M16 3 L21 8 L9 20 L3 21 L4 15 Z M14 5 L19 10",
  },
  distortion: {
    d: "M3 12 Q7 6 12 12 T21 12",
  },
  particleGrid: {
    extra: (
      <>
        <circle cx="6" cy="6" r="1.5" />
        <circle cx="12" cy="6" r="1" />
        <circle cx="18" cy="6" r="0.6" />
        <circle cx="6" cy="12" r="1" />
        <circle cx="12" cy="12" r="1.8" />
        <circle cx="18" cy="12" r="1" />
        <circle cx="6" cy="18" r="0.6" />
        <circle cx="12" cy="18" r="1" />
        <circle cx="18" cy="18" r="1.5" />
      </>
    ),
  },
  circuitBent: {
    d: "M3 6 H8 V10 H13 V6 H21 M3 14 H6 V18 H14 V14 H18 V18 H21",
  },
  plotter: {
    d: "M3 21 L21 3 M5 15 L15 5 M7 19 L19 7 M9 13 L13 9",
  },
  posterizeOutline: {
    d: "M5 5 H19 V19 H5 Z M9 9 H15 V15 H9 Z",
  },
  tiltShift: {
    d: "M3 8 H21 M3 16 H21",
    extra: <rect x="3" y="10" width="18" height="4" rx="1" />,
  },
  hueRotate: {
    extra: (
      <>
        <circle cx="12" cy="12" r="8" />
        <path d="M12 4 V12 L18 14" />
      </>
    ),
  },
  pixelSorting: {
    d: "M3 7 H15 M3 12 H19 M3 17 H9",
  },
  slice: {
    d: "M3 6 H10 M14 6 H21 M3 12 H18 M6 18 H21",
  },
  edgeDetect: {
    d: "M5 5 H19 V19 H5 Z",
    extra: (
      <>
        <path d="M9 9 L15 9 L12 15 Z" />
      </>
    ),
  },
  displacementMap: {
    d: "M3 12 C7 8, 11 16, 14 12 S20 10, 21 12",
  },
  progressiveBlur: {
    extra: (
      <>
        <rect x="3" y="10" width="4" height="4" rx="0.5" />
        <rect x="9" y="10" width="4" height="4" rx="1.5" />
        <rect x="15" y="10" width="4" height="4" rx="2" opacity="0.55" />
      </>
    ),
  },
  flutedGlass: {
    d: "M4 4 V20 M8 4 V20 M12 4 V20 M16 4 V20 M20 4 V20",
  },
};
