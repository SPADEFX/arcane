# Linear — Style Reference
> Midnight Command Center — dark, layered, lit by precise accents.

**Theme:** dark
**Source:** styles.refero.design

## Tokens

```css
:root {
  --pitch-black: #08090a;        /* page bg */
  --graphite: #0f1011;           /* L1 cards */
  --deep-slate: #161718;         /* L2 cards */
  --charcoal-grey: #23252a;      /* borders */
  --gunmetal: #383b3f;           /* tertiary bg, input borders */
  --porcelain: #f7f8f8;          /* primary text */
  --light-steel: #d0d6e0;        /* secondary text/borders */
  --storm-cloud: #8a8f98;        /* tertiary text */
  --fog-grey: #62666d;           /* metadata */
  --neon-lime: #e4f222;          /* PRIMARY ACTION ONLY */
  --aether-blue: #5e6ad2;        /* decorative highlights */

  --font-ui: 'Inter Variable', ui-sans-serif, system-ui;
  --font-mono: 'Berkeley Mono', 'IBM Plex Mono Variable', ui-monospace;

  --radius-default: 6px;
  --radius-pill: 9999px;
  --radius-tags: 2px;
}
```

## Hard rules
- 4 layered surfaces: #08090a → #0f1011 → #161718 → #23252a
- Neon Lime #e4f222 = PRIMARY action ONLY (never decorative)
- Inter Variable with weights 300/400/510/590 + OpenType cv01/ss03
- Tight tracking always: -0.22px display, -0.13px body
- 6px radius default (cards, buttons, inputs); 2px for tags
- Compact density: 8px gap standard, 12px card padding, 24px section gap
- Sharp contained shadows: rgba(0,0,0,0.4) 0px 2px 4px — never diffuse
- Inset 1px borders via box-shadow rgb(35,37,42) 0px 0px 0px 1px inset
- Storm Cloud #8a8f98 for de-emphasized text — receding
