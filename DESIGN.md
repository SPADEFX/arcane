# Arcane — Design System & Motion Principles

This document governs ALL design decisions in Arcane. Every component, animation, layout, and interaction MUST follow these principles.

## Design References

All detailed references are in `.claude/design-references/`. Read the relevant file before implementing.

### Motion Design (11 docs)
| File | Use When |
|------|----------|
| `motion-design/SKILL.md` | Starting any animation work |
| `motion-design/director/core-philosophy.md` | Deciding IF something should animate |
| `motion-design/director/disney-principles.md` | Choosing animation style (ease, anticipation, follow-through) |
| `motion-design/director/choreography.md` | Multiple elements animating together |
| `motion-design/director/emotion-mapping.md` | Choosing animation feel (playful, serious, urgent) |
| `motion-design/director/decision-framework.md` | Deciding timing, duration, easing |
| `motion-design/director/motion-personality.md` | Brand-specific motion identity |
| `motion-design/patterns/entrance-exit.md` | Mount/unmount animations |
| `motion-design/patterns/state-feedback.md` | Hover, active, disabled states |
| `motion-design/patterns/multi-element.md` | Staggered lists, grids |
| `motion-design/patterns/ambient-continuous.md` | Background, idle animations |

### Design Engineering Audit (10 docs)
| File | Use When |
|------|----------|
| `design-motion-principles/SKILL.md` | Auditing existing animations |
| `design-motion-principles/references/emil-kowalski.md` | Toast, modal, drawer patterns (sonner, vaul style) |
| `design-motion-principles/references/jakub-krehel.md` | Premium micro-interactions |
| `design-motion-principles/references/jhey-tompkins.md` | Creative CSS/JS effects |
| `design-motion-principles/references/technical-principles.md` | GPU compositing, will-change, paint layers |
| `design-motion-principles/references/performance.md` | 60fps, jank-free animations |
| `design-motion-principles/references/accessibility.md` | prefers-reduced-motion, vestibular |
| `design-motion-principles/references/common-mistakes.md` | Mistakes to avoid |
| `design-motion-principles/references/audit-checklist.md` | Before shipping |

### Motion Libraries
| File | Use When |
|------|----------|
| `motion-framer/SKILL.md` | Using Framer Motion / Motion |
| `gsap-scrolltrigger/SKILL.md` | Scroll-driven animations, timelines |
| `scroll-reveal-libraries/SKILL.md` | Scroll reveal effects |
| `lottie-animations/SKILL.md` | Lottie/Rive vector animations |
| `rive-interactive/SKILL.md` | Rive state machines |
| `animated-component-libraries/SKILL.md` | MagicUI, ReactBits patterns |

### 3D & WebGL
| File | Use When |
|------|----------|
| `threejs-webgl/SKILL.md` | Three.js scenes, shaders |
| `react-three-fiber/SKILL.md` | R3F in React components |

### Web Design
| File | Use When |
|------|----------|
| `modern-web-design/SKILL.md` | Layout, typography, spacing decisions |

### Timing & Easing Quick Reference
| File | Contains |
|------|----------|
| `motion-design/reference/timing-easing-tables.md` | All duration + easing values |
| `motion-design/reference/property-selection.md` | Which CSS properties to animate |
| `motion-design/reference/quality-checklist.md` | Pre-ship quality check |
| `motion-design/reference/troubleshooting.md` | Debug animation issues |

---

## Core Principles (Apply Always)

### 1. Motion Intent First
Before writing animation code, answer:
- **Why** does this animate? (guide attention, show state, reward action)
- **What** emotion should it convey? (confidence, delight, urgency)
- **When** in doubt, don't animate.

### 2. Performance Non-Negotiables
- Only animate `transform` and `opacity` (GPU-composited)
- Never animate `width`, `height`, `top`, `left`, `margin`, `padding`
- Use `will-change` sparingly and remove after animation
- Target 60fps — if it drops, simplify

### 3. Timing Rules
| Type | Duration | Easing |
|------|----------|--------|
| Micro (hover, press) | 100-200ms | `ease-out` |
| Small (toggle, fade) | 200-300ms | `ease-out` |
| Medium (slide, expand) | 300-500ms | `cubic-bezier(0.16, 1, 0.3, 1)` |
| Large (page, modal) | 400-700ms | `cubic-bezier(0.16, 1, 0.3, 1)` |
| Exit | 60-80% of enter duration | `ease-in` |

### 4. Stagger Rules
- Delay between items: 30-80ms
- Max total stagger: 400ms (don't make users wait)
- First item starts immediately (no initial delay)

### 5. Scroll Animations
- Use `IntersectionObserver` or GSAP ScrollTrigger
- Trigger at 10-20% visibility
- Once-only by default (don't re-animate on scroll up)
- Respect `prefers-reduced-motion: reduce`

### 6. Component Animation Patterns
```
Entrance:  opacity 0→1 + translateY(12→0px), 300ms, ease-out
Exit:      opacity 1→0 + translateY(0→-8px), 200ms, ease-in
Hover:     scale(1.02) or brightness(1.05), 150ms, ease-out
Press:     scale(0.98), 100ms, ease-out
Focus:     ring + scale(1.01), 150ms, ease-out
Disabled:  opacity 0.5, no transitions
Loading:   pulse opacity 0.5↔1, 1.5s, ease-in-out, infinite
```

### 7. Dark/Light Mode
- All components MUST work in both modes
- Use CSS variables: `var(--color-bg)`, `var(--color-text)`, `var(--color-accent)`
- Never hardcode colors — always reference tokens
- Test both modes before shipping

### 8. Responsive
- Mobile-first: design for 375px, enhance for desktop
- Breakpoints: `sm:640` `md:768` `lg:1024` `xl:1280`
- Touch targets: minimum 44x44px
- Reduce animation complexity on mobile

### 9. Typography Hierarchy
- Display: clamp(2rem, 5vw, 4.5rem), weight 700-800
- Heading: clamp(1.5rem, 3vw, 2.25rem), weight 600-700
- Body: 1rem (16px), weight 400, line-height 1.5
- Caption: 0.875rem, weight 400-500, color muted
- Monospace: for code, data, technical content only

### 10. Spacing System
- Use token spacing: 4, 8, 12, 16, 24, 32, 48, 64, 96px
- Section padding: 64-96px vertical, 16-24px horizontal
- Component gap: 8-16px
- Card padding: 16-24px
- Never use arbitrary spacing values
