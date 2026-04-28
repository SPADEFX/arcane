# Arcane

Unified toolbox for building premium websites. React + Vite + TypeScript.

## Architecture

```
localhost:3333  → Studio (Vite React app — main entry point)
localhost:3000  → Extract Tool API (Node.js + Puppeteer)
localhost:3001  → Medal Forge (Next.js — SVG → 3D badges)
localhost:6006  → Storybook (component library preview)
```

Start everything: `node start.cjs`

## Pages & Routes

| Route | Page | Description |
|-------|------|-------------|
| `/` | Home | Cards des outils disponibles |
| `/library` | Library | Storybook embarqué (iframe → :6006) |
| `/builder` | Builder Dashboard | Créer/ouvrir un projet |
| `/site/:id` | Builder Editor | Canvas drag & drop, sidebar blocks, properties panel, theme panel |
| `/preview/:id` | Preview | Rendu pleine page du site construit |
| `/extract` | Extract Tool | Capture/clone de sites web |
| `/shader-lab` | Shader Lab | Éditeur de shaders WebGL (intégré nativement) |
| `/medal-forge` | Medal Forge | SVG → 3D (iframe → :3001) |

## Key Paths

```
src/                          → Studio React app
  components/                 → Sidebar, DynamicRenderer
  pages/                      → Home, ExtractPage, LibraryPage, BuilderPage
  features/
    shader-lab/               → Shader Lab (React + Three.js, scoped CSS)
    builder-routes/           → Builder pages (dashboard, builder, preview)
    builder-components/       → Builder UI (canvas, sidebar, top-bar, properties panel)
    builder-stores/           → Zustand stores (site-store, ui-store)
    builder-registry/         → Block definitions, templates, types
    builder-globals.css       → Builder-specific CSS
  stores/                     → Component store, project store
  lib/                        → IndexedDB, bootstrap, component-loader
  types/                      → ComponentDefinition, Project, Block
  styles/                     → global.css, tailwind.css

ui-library/                   → Component library (57 components)
  components/                 → 41 components (button, card, badge, navbar, etc.)
  sections/                   → 16 sections (hero, cta, faq, pricing, testimonials, etc.)
  hooks/                      → useInView, useMediaQuery, useReducedMotion, useMounted
  motion/                     → MotionFade, MotionSlide, MotionStagger, variants, presets
  tokens/                     → tokens.css (CSS custom properties), fonts
  utils/                      → cn(), isDefined, clamp, lerp, mapRange
  stories/                    → 26 Storybook stories
  builder/                    → Original builder source (standalone app)
  index.ts                    → Barrel export for @uilibrary/ui

.claude/design-references/    → 69 design/motion reference docs
.storybook/                   → Storybook config (main.ts, preview.ts)

../Extract Tool/              → Node.js + Puppeteer backend
  server.js                   → HTTP server, 13 API endpoints
  proxy.js                    → Reverse proxy with script injection
  lib/                        → capture, extract, render, hooks, analyze, etc.

../medal-forge/               → Next.js app (SVG → 3D)
```

## Extract Tool API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/extract` | Capture website (HTML, CSS, animations, canvas) |
| POST | `/api/analyze-site` | Scan tech stack, score capturabilité |
| POST | `/api/clone-section` | Clone section with computed styles + screenshot |
| POST | `/api/convert` | HTML/CSS → React/Vue/Svelte/Tailwind |
| POST | `/api/generate` | Generate section from prompt + tokens (AI) |
| POST | `/api/recreate` | Reverse-engineer animations (AI) |
| POST | `/api/proxy` | Start reverse proxy for URL |
| POST | `/api/record` | Record canvas frames |
| POST | `/api/analyze-dom` | AI DOM labeling |
| GET | `/api/progress` | Poll extraction progress |
| GET | `/api/clone-files` | List clone assets |

## Design System

**READ `DESIGN.md` before any design work.** It contains timing tables, easing curves, animation patterns, spacing rules.

### Dark Mode
- App is dark-first: `<html class="dark" data-theme="dark">`
- All components use `var(--color-text)`, `var(--color-bg)`, etc.
- Tokens auto-switch via `[data-theme="dark"]` / `.dark` selector
- **NEVER hardcode colors** — always use CSS variables
- Builder's SiteTheme can override to light mode per-project

### Design References (69 docs in `.claude/design-references/`)
- `motion-design/` — LottieFiles: Disney principles, choreography, emotion, timing tables
- `design-motion-principles/` — Emil Kowalski, Jakub Krehel, Jhey Tompkins
- `motion-framer/` — Framer Motion patterns
- `gsap-scrolltrigger/` — GSAP + ScrollTrigger
- `modern-web-design/` — Layout, typography, spacing
- `threejs-webgl/` + `react-three-fiber/` — 3D/WebGL
- `rive-interactive/` — Rive state machines
- `animated-component-libraries/` — MagicUI, ReactBits

## Tech Stack

| What | Tech |
|------|------|
| Framework | React 19 + TypeScript |
| Build | Vite 5 |
| Styling | Tailwind v4 + CSS custom properties (tokens) |
| State | Zustand |
| Routing | React Router v7 |
| Animation | Framer Motion (`motion/react`) + GSAP (scroll) |
| 3D | Three.js + React Three Fiber |
| Drag & Drop | @dnd-kit/core + @dnd-kit/sortable |
| Primitives | Radix UI (accordion, dialog, slot) |
| Icons | Lucide React |
| Storage | IndexedDB (local, no backend DB) |
| Fonts | Geist, Inter, JetBrains Mono + 15 fontsource packages |
| Storybook | v8 + @storybook/react-vite |

## Aliases (vite.config.ts + tsconfig.app.json)

```
@/                    → src/
@uilibrary/           → ui-library/
@uilibrary/ui         → ui-library/index.ts
@uilibrary/ui/components/* → ui-library/components/*
@uilibrary/ui/sections/*   → ui-library/sections/*
```

## Component Rules

- `"use client"` directive on every component
- `forwardRef` for DOM-accessing components
- `cn()` from `@uilibrary/utils` for class merging (clsx + tailwind-merge)
- All colors via CSS variables (`var(--color-*)`) — **never hardcode hex values**
- All animations via Framer Motion or GSAP — never raw CSS transitions for complex motion
- `useReducedMotion()` hook on every animated component
- Only animate `transform` and `opacity` (GPU composited)
- Dark mode + light mode support on every component
- Mobile-first responsive design
- Timing: hover 150ms ease-out, press 100ms ease-out, entrance 300-500ms expo-out
- Stagger: 30-80ms between items, max 400ms total

## Builder Architecture

The builder uses its own Zustand stores and registry:
- `builder-stores/site-store.ts` — Sites, pages, blocks, theme CRUD
- `builder-stores/ui-store.ts` — UI state (selected block, sidebar tab, breakpoint)
- `builder-registry/blocks.ts` — Block definitions mapping component types to React components
- `builder-registry/templates.ts` — Page templates (preset block arrangements)
- `builder-components/canvas.tsx` — Drop zone with SiteTheme wrapper, breakpoint simulation
- `builder-components/properties-panel.tsx` — Per-block prop editor
- `builder-components/sidebar.tsx` — Block palette + page manager
