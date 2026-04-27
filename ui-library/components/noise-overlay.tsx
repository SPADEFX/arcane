"use client";

import { cn } from "@uilibrary/utils";

export interface NoiseOverlayProps {
  opacity?: number;
  blendMode?: "overlay" | "soft-light" | "multiply" | "normal";
  animated?: boolean;
  className?: string;
}

const noiseSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="4" stitchTiles="stitch"/></filter><rect width="100%" height="100%" filter="url(#n)" opacity="1"/></svg>`;
const noiseUrl = `url("data:image/svg+xml,${encodeURIComponent(noiseSvg)}")`;

export function NoiseOverlay({
  opacity = 0.05,
  blendMode = "overlay",
  animated = false,
  className,
}: NoiseOverlayProps) {
  return (
    <div
      className={cn("absolute inset-0 pointer-events-none", className)}
      style={{
        backgroundImage: noiseUrl,
        backgroundRepeat: "repeat",
        backgroundSize: "300px 300px",
        opacity,
        mixBlendMode: blendMode,
        animation: animated ? "noiseShift 0.2s steps(4) infinite" : undefined,
      }}
    >
      {animated && (
        <style>{`
          @keyframes noiseShift {
            0% { background-position: 0 0; }
            25% { background-position: -50px -25px; }
            50% { background-position: 25px -50px; }
            75% { background-position: -25px 50px; }
            100% { background-position: 50px 25px; }
          }
        `}</style>
      )}
    </div>
  );
}
