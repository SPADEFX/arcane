"use client";

import { type ReactNode, useMemo } from "react";
import { cn } from "@uilibrary/utils";

export interface SiteThemeProps {
  /** Primary font family — applied to --font-sans and --font-heading */
  font?: string;
  /** Optional separate heading font — if omitted, uses `font` */
  headingFont?: string;
  /** Mono font override */
  monoFont?: string;
  /** Single brand color (hex) — lighter/darker shades auto-derived via HSL */
  brandColor?: string;
  /** Or provide a full palette manually */
  brandPalette?: {
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
    950: string;
  };
  /** Border radius base override */
  radius?: "none" | "sm" | "md" | "lg" | "xl" | "2xl";
  /** Dark mode */
  dark?: boolean;
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

/* ─── HSL utilities (zero dependencies) ──────────── */

function hexToHSL(hex: string): [number, number, number] {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return [0, 0, 50];
  let r = parseInt(result[1], 16) / 255;
  let g = parseInt(result[2], 16) / 255;
  let b = parseInt(result[3], 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
    else if (max === g) h = ((b - r) / d + 2) / 6;
    else h = ((r - g) / d + 4) / 6;
  }
  return [h * 360, s * 100, l * 100];
}

function hslToHex(h: number, s: number, l: number): string {
  s /= 100;
  l /= 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * Math.max(0, Math.min(1, color)))
      .toString(16)
      .padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

function derivePalette(hex: string): Record<string, string> {
  const [h, s] = hexToHSL(hex);
  // Generate shades: lightness ramps from very light (50) to very dark (950)
  const shades: [string, number][] = [
    ["50", 97],
    ["100", 93],
    ["200", 86],
    ["300", 76],
    ["400", 64],
    ["500", 50],
    ["600", 42],
    ["700", 35],
    ["800", 28],
    ["900", 22],
    ["950", 14],
  ];
  const palette: Record<string, string> = {};
  for (const [key, l] of shades) {
    // Desaturate at extremes for a more natural palette
    const satMod = l > 90 ? s * 0.3 : l > 70 ? s * 0.6 : l < 20 ? s * 0.7 : s;
    palette[key] = hslToHex(h, satMod, l);
  }
  return palette;
}

const radiusMap: Record<string, string> = {
  none: "0",
  sm: "0.25rem",
  md: "0.5rem",
  lg: "0.75rem",
  xl: "1rem",
  "2xl": "1.5rem",
};

export function SiteTheme({
  font,
  headingFont,
  monoFont,
  brandColor,
  brandPalette,
  radius,
  dark,
  children,
  className,
  style,
}: SiteThemeProps) {
  const vars = useMemo(() => {
    const css: Record<string, string> = {};

    // Fonts
    if (font) {
      const stack = `"${font}", system-ui, -apple-system, sans-serif`;
      css["--font-sans"] = stack;
      if (!headingFont) css["--font-heading"] = stack;
    }
    if (headingFont) {
      css["--font-heading"] = `"${headingFont}", system-ui, -apple-system, sans-serif`;
    }
    if (monoFont) {
      css["--font-mono"] = `"${monoFont}", ui-monospace, monospace`;
    }

    // Brand colors
    const palette = brandPalette
      ? brandPalette
      : brandColor
        ? derivePalette(brandColor)
        : null;

    if (palette) {
      for (const [shade, value] of Object.entries(palette)) {
        css[`--color-brand-${shade}`] = value;
      }
      // Update semantic accent vars
      css["--color-accent"] = palette["600"] ?? palette["500"];
      css["--color-accent-hover"] = palette["700"] ?? palette["600"];
      css["--color-accent-subtle"] = palette["50"];
    }

    // Radius
    if (radius && radiusMap[radius]) {
      css["--radius-md"] = radiusMap[radius];
    }

    return css;
  }, [font, headingFont, monoFont, brandColor, brandPalette, radius]);

  return (
    <div
      className={cn(dark && "dark", className)}
      data-theme={dark ? "dark" : undefined}
      style={{ ...vars, ...style } as React.CSSProperties}
    >
      {children}
    </div>
  );
}
