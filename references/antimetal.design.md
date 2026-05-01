# Antimetal — Style Reference
> Electric storm over a blueprint — vivid neon signal cutting through deep navy atmosphere.

**Theme:** mixed (dark hero → light product)
**Source:** styles.refero.design

Two modes coexist: deep navy-to-electric-blue hero (server rack at night), then near-white #f8f9fc product surface (technical dashboard in daylight). The bridge: vivid chartreuse #d0f100 used **exclusively on primary CTAs**. Typography signature: **serif display (ivarTextFont/Fraunces) at 32px+ against utilitarian abcdFont (Inter sub) UI** — uncommon in infrastructure tooling.

## Tokens

```css
:root {
  --color-midnight-navy: #1b2540;        /* text on light */
  --color-deep-cosmos: #001033;          /* darkest, dark CTAs */
  --color-chartreuse-pulse: #d0f100;     /* PRIMARY CTA ONLY */
  --color-ice-veil: #e0f6ff;             /* ghost button border on dark */
  --color-ghost-canvas: #f8f9fc;         /* light page bg */
  --color-pure-surface: #ffffff;         /* elevated cards */
  --color-slate-ink: #6b7184;            /* secondary text */
  --gradient-hero: linear-gradient(180deg, #001033 0%, #0050f8 55%, #5fbdf7 100%);

  /* Display = serif (ivarTextFont sub Fraunces), UI = sans (abcdFont sub Inter) */
  --font-display: 'Fraunces Variable', ui-serif, Georgia, serif;
  --font-ui: 'Inter Variable', ui-sans-serif, system-ui;

  --radius-buttons: 9999px;   /* pill */
  --radius-cards: 20px;
  --radius-badges: 16px;
  --radius-inputs: 0px;       /* sharp inputs deliberate */
}
```

## Hard rules
- Chartreuse #d0f100 = primary CTA fill ONLY. Never decorative, never background, never icon
- Serif (Fraunces) at 32px+ ONLY. Below 32px = sans (Inter)
- Tracking on Inter: -0.016em smallest → -0.005em at 28px (always tighter than browser default)
- Shadows: rgba(0,39,80,...) BLUE-tinted only. Never black-based on light surfaces
- Buttons: 9999px (pill), Cards: 20px, Inputs: 0px (sharp!)
- Text color: #1b2540 (never pure black)
- Single dark section (hero), then sustained light below
- Outer 1px shadow ring as border substitute on cards
