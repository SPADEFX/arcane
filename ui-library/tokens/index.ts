/**
 * @uilibrary/tokens
 *
 * Design tokens for premium marketing sites.
 * Exposed as CSS custom properties via Tailwind v4 theme.
 * Import the CSS file in your app: `import "@uilibrary/tokens/css"`
 */

// ─── Type Scale ──────────────────────────────────────────
export const typeScale = {
  "display-2xl": "4.5rem",    // 72px — hero headlines
  "display-xl": "3.75rem",    // 60px
  "display-lg": "3rem",       // 48px
  "display-md": "2.25rem",    // 36px
  "display-sm": "1.875rem",   // 30px
  "display-xs": "1.5rem",     // 24px
  "text-xl": "1.25rem",       // 20px
  "text-lg": "1.125rem",      // 18px
  "text-md": "1rem",          // 16px — body
  "text-sm": "0.875rem",      // 14px
  "text-xs": "0.75rem",       // 12px
} as const;

// ─── Spacing Scale ───────────────────────────────────────
export const spacing = {
  px: "1px",
  0.5: "0.125rem",
  1: "0.25rem",
  1.5: "0.375rem",
  2: "0.5rem",
  3: "0.75rem",
  4: "1rem",
  5: "1.25rem",
  6: "1.5rem",
  8: "2rem",
  10: "2.5rem",
  12: "3rem",
  16: "4rem",
  20: "5rem",
  24: "6rem",
  32: "8rem",
  40: "10rem",
  48: "12rem",
  64: "16rem",
  80: "20rem",
  96: "24rem",
} as const;

// ─── Radius ──────────────────────────────────────────────
export const radius = {
  none: "0",
  sm: "0.25rem",
  md: "0.5rem",
  lg: "0.75rem",
  xl: "1rem",
  "2xl": "1.5rem",
  "3xl": "2rem",
  full: "9999px",
} as const;

// ─── Shadows (premium, layered) ──────────────────────────
export const shadows = {
  sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
  md: "0 4px 6px -1px rgb(0 0 0 / 0.07), 0 2px 4px -2px rgb(0 0 0 / 0.05)",
  lg: "0 10px 15px -3px rgb(0 0 0 / 0.08), 0 4px 6px -4px rgb(0 0 0 / 0.04)",
  xl: "0 20px 25px -5px rgb(0 0 0 / 0.08), 0 8px 10px -6px rgb(0 0 0 / 0.03)",
  "2xl": "0 25px 50px -12px rgb(0 0 0 / 0.15)",
  glow: "0 0 20px rgb(0 0 0 / 0.1)",
} as const;

// ─── Easings (animation doctrine) ────────────────────────
export const easings = {
  default: "cubic-bezier(0.25, 0.1, 0.25, 1)",
  in: "cubic-bezier(0.4, 0, 1, 1)",
  out: "cubic-bezier(0, 0, 0.2, 1)",
  "in-out": "cubic-bezier(0.4, 0, 0.2, 1)",
  spring: "cubic-bezier(0.22, 1, 0.36, 1)",
  bounce: "cubic-bezier(0.34, 1.56, 0.64, 1)",
  smooth: "cubic-bezier(0.45, 0, 0.55, 1)",
} as const;

// ─── Durations ───────────────────────────────────────────
export const durations = {
  instant: "0ms",
  fast: "150ms",
  normal: "300ms",
  slow: "500ms",
  slower: "700ms",
  slowest: "1000ms",
} as const;

// ─── Z-Index Scale ───────────────────────────────────────
export const zIndex = {
  behind: -1,
  base: 0,
  dropdown: 50,
  sticky: 100,
  overlay: 200,
  modal: 300,
  popover: 400,
  toast: 500,
  tooltip: 600,
} as const;

// ─── Colors (neutral palette + brand slots) ──────────────
export const colors = {
  white: "#ffffff",
  black: "#000000",
  // Neutral (zinc-based, premium feel)
  neutral: {
    50: "#fafafa",
    100: "#f4f4f5",
    200: "#e4e4e7",
    300: "#d4d4d8",
    400: "#a1a1aa",
    500: "#71717a",
    600: "#52525b",
    700: "#3f3f46",
    800: "#27272a",
    900: "#18181b",
    950: "#09090b",
  },
  // Brand slots — override per project
  brand: {
    50: "#eff6ff",
    100: "#dbeafe",
    200: "#bfdbfe",
    300: "#93c5fd",
    400: "#60a5fa",
    500: "#3b82f6",
    600: "#2563eb",
    700: "#1d4ed8",
    800: "#1e40af",
    900: "#1e3a8a",
    950: "#172554",
  },
} as const;

export type TokenTypeScale = keyof typeof typeScale;
export type TokenSpacing = keyof typeof spacing;
export type TokenRadius = keyof typeof radius;
export type TokenShadow = keyof typeof shadows;
export type TokenEasing = keyof typeof easings;
export type TokenDuration = keyof typeof durations;
export type TokenZIndex = keyof typeof zIndex;
