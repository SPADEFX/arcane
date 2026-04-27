# UI Library

A collection of production-grade React components, animation primitives, design tokens, and pre-built page sections. Built with React 19, Tailwind CSS v4, Radix UI, GSAP, and Framer Motion.

---

## Structure

```
ui-library/
├── components/       # 40+ UI components (buttons, cards, text effects, scroll animations...)
├── sections/         # Pre-built page sections (heroes, CTAs, FAQs, footers, pricing...)
├── tokens/           # Design tokens as CSS custom properties (colors, typography, spacing...)
├── hooks/            # Custom React hooks (useInView, useMediaQuery, useReducedMotion...)
├── motion/           # Animation primitives (fade, slide, stagger, scroll variants)
├── utils/            # Utility functions (cn(), clamp(), isDefined()...)
├── stories/          # Storybook stories for every component and section
├── ui-package.json   # Dependencies reference for the UI package
└── tokens-package.json # Dependencies reference for the tokens package
```

---

## Design Tokens (`tokens/`)

The token system is the single source of truth for all visual decisions. **Never hardcode values in components** — always reference these CSS variables.

### How to use

Import `tokens/tokens.css` in your global CSS:

```css
@import "./ui-library/tokens/tokens.css";
```

All tokens are CSS custom properties on `:root`, organized into:

| Category | Example variables | Description |
|----------|------------------|-------------|
| **Type Scale** | `--font-display-2xl` to `--font-text-xs` | 4.5rem → 0.75rem |
| **Font Families** | `--font-sans`, `--font-heading`, `--font-mono` | Inter, JetBrains Mono, etc. + 15 font options |
| **Spacing** | `--space-1` to `--space-96` | 0.25rem → 24rem |
| **Radius** | `--radius-sm` to `--radius-full` | 0.25rem → 9999px |
| **Shadows** | `--shadow-sm` to `--shadow-glow` | Layered, premium shadows |
| **Easings** | `--ease-spring`, `--ease-bounce`, `--ease-smooth` | Cubic bezier curves |
| **Durations** | `--duration-fast` to `--duration-slowest` | 150ms → 1000ms |
| **Z-Index** | `--z-dropdown` to `--z-tooltip` | Ordered stacking layers |
| **Colors** | `--color-neutral-*`, `--color-brand-*` | Neutral (zinc) + brand palette |
| **Semantic Colors** | `--color-bg`, `--color-text`, `--color-accent` | Theme-aware aliases |

### Dark mode

Automatically activates with `[data-theme="dark"]` or `.dark` class on any ancestor. All semantic color tokens invert:

```html
<body data-theme="dark">
  <!-- All --color-bg, --color-text, etc. are now dark variants -->
</body>
```

### Fonts

Font files are in `tokens/fonts/`. Import `tokens/fonts.css` to load them:

```css
@import "./ui-library/tokens/fonts.css";
```

---

## Components (`components/`)

40+ React components. Each uses:
- **CSS variables** from the token system (never hardcoded values)
- **`cn()`** utility for class merging (Tailwind-aware)
- **TypeScript** with exported prop interfaces
- **`forwardRef`** for DOM access
- **`"use client"`** directive (Next.js compatible)

### Component list

#### Primitives
| Component | File | Description |
|-----------|------|-------------|
| `Button` | `button.tsx` | Primary/secondary/ghost, sm/md/lg/xl, `asChild` slot |
| `Badge` | `badge.tsx` | Status/label badges with variants |
| `Card` | `card.tsx` | Content card with header/body/footer slots |
| `Input` | `input.tsx` | Text input with label, error state |
| `Dialog` | `dialog.tsx` | Modal dialog (Radix) |
| `Accordion` | `accordion.tsx` | Collapsible sections (Radix) |
| `Skeleton` | `skeleton.tsx` | Loading placeholder |

#### Layout & Navigation
| Component | File | Description |
|-----------|------|-------------|
| `Navbar` | `navbar.tsx` | Responsive navigation bar |
| `NavbarMegaMenu` | `navbar-mega-menu.tsx` | Navigation with mega dropdown panels |
| `Dock` | `dock.tsx` | macOS-style dock with magnification |
| `HorizontalScroll` | `horizontal-scroll.tsx` | Horizontal scroll container |

#### Visual Effects
| Component | File | Description |
|-----------|------|-------------|
| `AuroraBackground` | `aurora-background.tsx` | Animated aurora gradient background |
| `GradientMesh` | `gradient-mesh.tsx` | Mesh gradient background |
| `GridBackground` | `grid-background.tsx` | Dot/line grid pattern |
| `NoiseOverlay` | `noise-overlay.tsx` | Film grain noise texture |
| `SpotlightCard` | `spotlight-card.tsx` | Card with mouse-tracked spotlight |
| `TiltCard` | `tilt-card.tsx` | Card with 3D tilt on hover |
| `ImageReveal` | `image-reveal.tsx` | Image reveal animation on scroll |

#### Text Animations
| Component | File | Description |
|-----------|------|-------------|
| `TextReveal` | `text-reveal.tsx` | Word-by-word reveal |
| `TextBlurReveal` | `text-blur-reveal.tsx` | Blur-to-sharp text reveal |
| `TextMaskReveal` | `text-mask-reveal.tsx` | Mask clip reveal |
| `TextPullUp` | `text-pull-up.tsx` | Pull-up entrance |
| `TextScrollReveal` | `text-scroll-reveal.tsx` | Scroll-driven text reveal |
| `TextSpringChars` | `text-spring-chars.tsx` | Spring physics per character |
| `TextTypewriter` | `text-typewriter.tsx` | Typewriter effect |
| `TextWave` | `text-wave.tsx` | Wave animation |
| `TextScramble` | `text-scramble.tsx` | Scramble/decode effect |
| `TextRotate` | `text-rotate.tsx` | Rotating text carousel |
| `TextGlitch` | `text-glitch.tsx` | Glitch distortion |
| `TextGradientFlow` | `text-gradient-flow.tsx` | Animated gradient fill |
| `TextHighlight` | `text-highlight.tsx` | Highlight animation |
| `TextCounter` | `text-counter.tsx` | Animated number counter |

#### Scroll Animations
| Component | File | Description |
|-----------|------|-------------|
| `ScrollReveal` | `scroll-reveal.tsx` | Reveal-on-scroll wrapper |
| `ScrollPin` | `scroll-pin.tsx` | Pin element during scroll range |
| `ParallaxLayer` | `parallax-layer.tsx` | Parallax depth layer |
| `SmoothScroll` | `smooth-scroll.tsx` | Lenis smooth scroll provider |
| `SectionDivider` | `section-divider.tsx` | Animated section divider |
| `Marquee` | `marquee.tsx` | Infinite scrolling marquee |
| `MagneticButton` | `magnetic-button.tsx` | Button that follows the cursor |

### Usage pattern

```tsx
import { Button } from "./ui-library/components/button";
import { TextReveal } from "./ui-library/components/text-reveal";
import { ScrollReveal } from "./ui-library/components/scroll-reveal";

function Hero() {
  return (
    <section>
      <ScrollReveal>
        <TextReveal text="Welcome to Arcane" as="h1" />
        <p>Build extraordinary interfaces.</p>
        <Button variant="primary" size="lg">Get Started</Button>
      </ScrollReveal>
    </section>
  );
}
```

### Import aliases

Components import from internal packages with these aliases. You'll need to map them in your bundler config:

| Import | Maps to |
|--------|---------|
| `@uilibrary/utils` | `./ui-library/utils/index.ts` |
| `@uilibrary/hooks` | `./ui-library/hooks/index.ts` |
| `@uilibrary/motion` | `./ui-library/motion/index.ts` |
| `@uilibrary/tokens` | `./ui-library/tokens/index.ts` |

**Vite example** (`vite.config.ts`):
```ts
resolve: {
  alias: {
    "@uilibrary/utils": path.resolve(__dirname, "ui-library/utils"),
    "@uilibrary/hooks": path.resolve(__dirname, "ui-library/hooks"),
    "@uilibrary/motion": path.resolve(__dirname, "ui-library/motion"),
    "@uilibrary/tokens": path.resolve(__dirname, "ui-library/tokens"),
  },
},
```

---

## Sections (`sections/`)

Pre-built full-width page sections. Each is a self-contained component that composes the primitives above.

| Section | File | Description |
|---------|------|-------------|
| `HeroSection` | `hero-section.tsx` | Landing hero with heading, subtitle, CTA buttons |
| `HeroAavePro` | `hero-aave-pro.tsx` | Animated hero with gradient mesh + text reveal |
| `FeatureGrid` | `feature-grid.tsx` | Bento-grid feature showcase |
| `PricingTable` | `pricing-table.tsx` | Pricing comparison table |
| `Testimonials` | `testimonials.tsx` | Testimonial cards carousel |
| `FAQSection` | `faq-section.tsx` | Accordion FAQ |
| `CTASection` | `cta-section.tsx` | Call-to-action banner |
| `Footer` | `footer.tsx` | Site footer with columns |
| `AaveProSwap` | `aave-pro-swap.tsx` | Swap interface section |
| `AaveProMarkets` | `aave-pro-markets.tsx` | Markets data table section |
| `AaveProBorrow` | `aave-pro-borrow.tsx` | Borrow interface section |
| `AaveProArchitecture` | `aave-pro-architecture.tsx` | Architecture diagram section |
| `AaveProWordReveal` | `aave-pro-word-reveal.tsx` | Word reveal animation section |
| `AaveProCtaFinal` | `aave-pro-cta-final.tsx` | Final CTA section |

---

## Hooks (`hooks/`)

| Hook | Description |
|------|-------------|
| `useInView` | Intersection Observer wrapper — returns `[ref, isInView]` |
| `useMediaQuery` | CSS media query match — `useMediaQuery("(min-width: 768px)")` |
| `useMounted` | Returns `true` after first render (SSR-safe) |
| `useReducedMotion` | Respects `prefers-reduced-motion` OS setting |

---

## Motion (`motion/`)

Animation primitives built on Framer Motion. Used by components internally but also exported for direct use.

### Components
| Component | Description |
|-----------|-------------|
| `MotionFade` | Fade in/out wrapper |
| `MotionSlide` | Slide from direction (up/down/left/right) |
| `MotionStagger` | Stagger children entrance |

### Presets & Variants
```ts
import { presets, variants, scrollVariants } from "./ui-library/motion";

// presets — named animation configs (ease, duration, delay patterns)
// variants — Framer Motion variant objects for common patterns
// scrollVariants — viewport-triggered variant sets
```

---

## Utils (`utils/`)

| Function | Description |
|----------|-------------|
| `cn(...classes)` | Tailwind-aware class merger (`clsx` + `twMerge`) |
| `isDefined(value)` | Type guard for non-null/undefined |
| `clamp(value, min, max)` | Numeric clamp |

---

## Stories (`stories/`)

Storybook stories for visual testing. Each story renders the component with realistic content, multiple variants, and edge cases.

To run Storybook:
```bash
# From the original uilibrary monorepo
cd uilibrary && pnpm --filter @uilibrary/docs storybook
# Opens on http://localhost:6006
```

---

## Dependencies

These packages are required by the components:

```json
{
  "@gsap/react": "^2.1.2",
  "@radix-ui/react-accordion": "^1.2.12",
  "@radix-ui/react-dialog": "^1",
  "@radix-ui/react-dropdown-menu": "^2",
  "@radix-ui/react-navigation-menu": "^1.2.14",
  "@radix-ui/react-slot": "^1",
  "@radix-ui/react-switch": "^1.2.6",
  "@radix-ui/react-tooltip": "^1",
  "@radix-ui/react-visually-hidden": "^1",
  "gsap": "^3.14.2",
  "lenis": "^1.3.21",
  "motion": "^12",
  "clsx": "^2",
  "tailwind-merge": "^2"
}
```

Peer dependencies: `react ^18 || ^19`, `react-dom ^18 || ^19`.

---

## Quick Start (integrating into an existing Vite + React project)

1. Copy the `ui-library/` folder into your project root
2. Install dependencies:
   ```bash
   npm i @radix-ui/react-slot @radix-ui/react-accordion @radix-ui/react-dialog \
         @radix-ui/react-dropdown-menu @radix-ui/react-navigation-menu \
         @radix-ui/react-switch @radix-ui/react-tooltip @radix-ui/react-visually-hidden \
         gsap @gsap/react lenis motion clsx tailwind-merge
   ```
3. Add import aliases to `vite.config.ts` (see Import Aliases section above)
4. Import tokens in your global CSS:
   ```css
   @import "./ui-library/tokens/tokens.css";
   @import "./ui-library/tokens/fonts.css";
   ```
5. Use components:
   ```tsx
   import { Button } from "./ui-library/components/button";
   ```
