# SEEN — Style Reference
> Vibrant dreamscape playground

**Theme:** light
**Source:** styles.refero.design

Playful, otherworldly aesthetic with vibrant gradient-rich fantasy backgrounds. Rounded organic forms, bold custom typography. Color used as atmospheric wash + outlined affordances.

## Tokens (CSS Custom Properties)

```css
:root {
  --color-dreamdust-base: #d49ae2;
  --gradient-dreamdust: radial-gradient(circle, rgba(250,230,255,0.67) 0%, rgba(212,154,226,0.55) 100%);
  --color-bubblegum-outline: #683c72;
  --color-twilight-mist: #f7d1ff;
  --color-sunrise-glow: #f7ae47;
  --color-grape-vine: #a35ab3;
  --color-midnight-vignette: #390b5d;
  --color-ink: #000;

  --font-bb-sans: 'BB Sans', Inter, ui-sans-serif, system-ui;
  --leading: 1.0;

  --spacing-8: 8px;
  --spacing-16: 16px;
  --section-gap: 64px;
  --card-padding: 16px;
  --element-gap: 8px;

  --radius-buttons: 32px;
}
```

## Do's
- Dreamdust radial gradient as base — never solid fills
- Bubblegum Outline (#683c72) for borders/text only — not as fill
- Ink black for body/headline text
- 32px radius on buttons (pill shape)
- BB Sans (Inter substitute), weights 400/500
- 8px base unit (8/16 only)

## Don'ts
- No solid background fills
- No additional fonts beyond BB Sans
- No sharp/low radii
- No saturated colors on large text areas
