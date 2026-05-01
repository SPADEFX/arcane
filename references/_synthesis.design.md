# Synthesis — Hybrid Design System
> Distilled from 601 Inc. + SEEN + Antimetal + Linear + Family

**Theme:** dark-primary with cream secondary surface

## Borrowed moves

- **Single accent rule** (Antimetal/Linear/601) — `#d4f057` electric gold, used ONLY on primary CTA + meta highlights. Never decorative.
- **Serif display × sans UI** (Antimetal) — Fraunces at 32px+, Inter below. Differentiator from generic SaaS.
- **4 surface levels** (Linear) — `#0a0e14 → #13181f → #1d242e → #2a323d`.
- **Cream second surface** (Family) — `#fafaf9` warm off-white for the light feature section, not pure white.
- **Inset 1px borders via box-shadow** (Family + Linear) — never drop shadows on cards.
- **Mono for metadata** (Linear) — JetBrains Mono on IDs, timestamps, version chips.
- **Compact density** (Linear) — 6px radius default, 9999px pills, 0px inputs.
- **Oversized display numerals** (601 Inc.) — section markers in display weight at 120-200px.
- **Subtle sparkle accents** (SEEN) — 2-3 max, never decorative wash.
- **Atmospheric dot grid** (Antimetal) — masked radial, never broad gradient.

## Tokens

```css
:root {
  /* Surfaces — dark */
  --canvas: #0a0e14;
  --surface-1: #13181f;
  --surface-2: #1d242e;
  --surface-3: #2a323d;

  /* Surface — cream switch */
  --cream-canvas: #fafaf9;
  --cream-surface: #f3f0ec;
  --cream-ink: #1b2540;

  /* Text — dark */
  --text-primary: #f5f7f8;
  --text-secondary: #8a93a6;
  --text-tertiary: #5a6271;

  /* The single accent */
  --accent: #d4f057;
  --accent-dim: rgba(212, 240, 87, 0.12);

  /* Type */
  --font-display: 'Fraunces Variable', 'Instrument Serif', ui-serif, Georgia, serif;
  --font-ui: 'Inter Variable', ui-sans-serif, system-ui;
  --font-mono: 'JetBrains Mono Variable', ui-monospace, SFMono-Regular;

  /* Radius */
  --radius-default: 6px;
  --radius-pill: 9999px;
  --radius-card: 16px;
  --radius-input: 0px;
}
```
