# Arcane

Unified toolbox for building premium websites. React + Vite + TypeScript.

## Architecture

- **Studio** (Vite, port 3333): Main app with sidebar navigation
- **Extract Tool** (Node.js + Puppeteer, port 3000): Website capture/clone API
- **Medal Forge** (Next.js, port 3001): SVG → 3D badges
- **Storybook** (port 6006): Component library preview

Start everything: `node start.cjs`

## Key Paths

- `src/` — Studio React app (pages, components, features, stores)
- `ui-library/` — 57 components + sections + tokens + stories
- `ui-library/builder/` — Original builder source (routes, stores, registry)
- `.claude/design-references/` — 69 design/motion reference docs

## Design System

**READ `DESIGN.md` before any design work.** It contains:
- Motion principles (Disney, choreography, emotion mapping)
- Timing/easing quick reference tables
- Component animation patterns
- Dark/light mode rules
- Typography + spacing system

Detailed references in `.claude/design-references/`:
- `motion-design/` — LottieFiles motion design skill (core philosophy, patterns, reference tables)
- `design-motion-principles/` — Emil Kowalski, Jakub Krehel, Jhey Tompkins principles
- `motion-framer/` — Framer Motion / Motion library patterns
- `gsap-scrolltrigger/` — GSAP + ScrollTrigger patterns
- `modern-web-design/` — Layout, typography, spacing
- `threejs-webgl/` + `react-three-fiber/` — 3D/WebGL
- `rive-interactive/` — Rive state machines
- `animated-component-libraries/` — MagicUI, ReactBits

## Tech Stack

- React 19 + TypeScript 6 + Vite 5
- Tailwind v4 + CSS custom properties (tokens)
- Zustand (state), React Router v7 (routing)
- Framer Motion (`motion/react`) + GSAP (scroll)
- Three.js + R3F (3D/shaders)
- @dnd-kit (drag & drop in builder)
- Radix UI (accessible primitives)
- IndexedDB (local storage)

## Aliases

- `@/` → `src/`
- `@uilibrary/` → `ui-library/`
- `@uilibrary/ui` → `ui-library/index.ts`
- `@uilibrary/ui/components/*` → `ui-library/components/*`
- `@uilibrary/ui/sections/*` → `ui-library/sections/*`

## Rules

- All components use `"use client"`, `forwardRef`, `cn()` utility
- All colors via CSS variables — never hardcode
- All animations via Framer Motion or GSAP — never raw CSS transitions for complex motion
- Respect `prefers-reduced-motion`
- Only animate `transform` and `opacity` (GPU composited)
- Dark mode + light mode support on every component
- Mobile-first responsive design
