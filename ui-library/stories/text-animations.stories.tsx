import { lazy, Suspense } from "react";
import type { Meta, StoryObj } from "@storybook/react";

/* ─── Lazy component imports (GSAP + Motion loaded on demand) ── */
const TextReveal = lazy(() => import("@uilibrary/ui/components/text-reveal").then(m => ({ default: m.TextReveal })));
const TextTypewriter = lazy(() => import("@uilibrary/ui/components/text-typewriter").then(m => ({ default: m.TextTypewriter })));
const TextBlurReveal = lazy(() => import("@uilibrary/ui/components/text-blur-reveal").then(m => ({ default: m.TextBlurReveal })));
const TextGradientFlow = lazy(() => import("@uilibrary/ui/components/text-gradient-flow").then(m => ({ default: m.TextGradientFlow })));
const TextScramble = lazy(() => import("@uilibrary/ui/components/text-scramble").then(m => ({ default: m.TextScramble })));
const TextCounter = lazy(() => import("@uilibrary/ui/components/text-counter").then(m => ({ default: m.TextCounter })));
const TextHighlight = lazy(() => import("@uilibrary/ui/components/text-highlight").then(m => ({ default: m.TextHighlight })));
const TextRotate = lazy(() => import("@uilibrary/ui/components/text-rotate").then(m => ({ default: m.TextRotate })));
const TextPullUp = lazy(() => import("@uilibrary/ui/components/text-pull-up").then(m => ({ default: m.TextPullUp })));
const TextWave = lazy(() => import("@uilibrary/ui/components/text-wave").then(m => ({ default: m.TextWave })));
const TextGlitch = lazy(() => import("@uilibrary/ui/components/text-glitch").then(m => ({ default: m.TextGlitch })));
const TextMaskReveal = lazy(() => import("@uilibrary/ui/components/text-mask-reveal").then(m => ({ default: m.TextMaskReveal })));
const TextSpringChars = lazy(() => import("@uilibrary/ui/components/text-spring-chars").then(m => ({ default: m.TextSpringChars })));

function Lazy({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<div className="flex items-center justify-center py-12 text-[var(--color-muted)]">Loading…</div>}>{children}</Suspense>;
}

/* ─── Stories ─────────────────────────────────── */

export const Reveal: StoryObj = {
  render: () => (
    <Lazy>
      <div className="space-y-8">
        <TextReveal as="h2" by="word" className="text-4xl font-bold text-[var(--color-text)]">
          Every word reveals with staggered timing
        </TextReveal>
        <TextReveal as="h3" by="character" staggerDelay={0.02} className="text-2xl font-semibold text-[var(--color-text)]">
          Character by character
        </TextReveal>
      </div>
    </Lazy>
  ),
};

export const Typewriter: StoryObj = {
  render: () => (
    <Lazy>
      <div className="space-y-8">
        <TextTypewriter as="h2" text={["Build faster.", "Ship smarter.", "Scale infinitely."]} speed={60} className="text-4xl font-bold text-[var(--color-text)]" />
        <TextTypewriter as="p" text="npm install @uilibrary/ui" speed={40} loop={false} cursorChar="_" className="text-lg font-mono text-[var(--color-muted)]" cursorClassName="text-[var(--color-accent)]" />
      </div>
    </Lazy>
  ),
};

export const BlurReveal: StoryObj = {
  render: () => (
    <Lazy>
      <div className="space-y-8">
        <TextBlurReveal as="h2" by="word" className="text-4xl font-bold text-[var(--color-text)]">
          From blur to crystal clear focus
        </TextBlurReveal>
        <TextBlurReveal as="p" by="character" staggerDelay={0.03} className="text-xl text-[var(--color-muted)]">
          Apple-style reveal
        </TextBlurReveal>
      </div>
    </Lazy>
  ),
};

export const GradientFlow: StoryObj = {
  render: () => (
    <Lazy>
      <div className="space-y-8">
        <TextGradientFlow as="h1" className="text-5xl font-black">Flowing Gradient Text</TextGradientFlow>
        <TextGradientFlow as="h2" colors={["#f97316", "#ef4444", "#ec4899", "#8b5cf6", "#f97316"]} duration={3} className="text-3xl font-bold">
          Custom color palette
        </TextGradientFlow>
      </div>
    </Lazy>
  ),
};

export const Scramble: StoryObj = {
  render: () => (
    <Lazy>
      <div className="space-y-8">
        <TextScramble as="h2" trigger="inView" className="text-4xl font-bold text-[var(--color-text)]">Decoding the future</TextScramble>
        <TextScramble as="p" trigger="hover" speed={20} scrambleDuration={800} className="text-xl text-[var(--color-muted)] cursor-pointer">
          Hover me to scramble
        </TextScramble>
      </div>
    </Lazy>
  ),
};

export const Counter: StoryObj = {
  render: () => (
    <Lazy>
      <div className="grid grid-cols-3 gap-8 text-center">
        <div>
          <TextCounter to={10248} prefix="" suffix="+" className="text-5xl font-black text-[var(--color-accent)]" />
          <p className="mt-2 text-sm text-[var(--color-muted)]">Users</p>
        </div>
        <div>
          <TextCounter to={99.9} decimals={1} suffix="%" duration={2.5} className="text-5xl font-black text-[var(--color-accent)]" />
          <p className="mt-2 text-sm text-[var(--color-muted)]">Uptime</p>
        </div>
        <div>
          <TextCounter to={4500000} prefix="$" duration={3} className="text-5xl font-black text-[var(--color-accent)]" />
          <p className="mt-2 text-sm text-[var(--color-muted)]">Revenue</p>
        </div>
      </div>
    </Lazy>
  ),
};

export const Highlight: StoryObj = {
  render: () => (
    <Lazy>
      <div className="space-y-8">
        <TextHighlight as="h2" highlight={["premium", "animations"]} className="text-3xl font-bold text-[var(--color-text)]">
          Build premium websites with stunning animations
        </TextHighlight>
        <TextHighlight as="p" highlight="fastest" highlightColor="#22c55e" className="text-xl text-[var(--color-muted)]">
          The fastest way to ship beautiful UI
        </TextHighlight>
      </div>
    </Lazy>
  ),
};

export const Rotate: StoryObj = {
  render: () => (
    <Lazy>
      <div className="space-y-8">
        <TextRotate as="h2" prefix="We build" words={["websites", "apps", "experiences", "the future"]} animation="slide" className="text-4xl font-bold text-[var(--color-text)]" wordClassName="text-[var(--color-accent)]" />
        <TextRotate as="h3" prefix="Design is" words={["powerful", "essential", "beautiful", "everything"]} animation="blur" interval={2000} className="text-2xl font-semibold text-[var(--color-text)]" wordClassName="text-[var(--color-accent)]" />
        <TextRotate as="h3" words={["Scale", "Fade", "Blur", "Slide"]} suffix="animation mode" animation="scale" interval={2500} className="text-2xl font-semibold text-[var(--color-text)]" wordClassName="text-[var(--color-accent)]" />
      </div>
    </Lazy>
  ),
};

export const PullUp: StoryObj = {
  render: () => (
    <Lazy>
      <div className="space-y-8">
        <TextPullUp as="h2" by="word" className="text-4xl font-bold text-[var(--color-text)]">Spring powered text pull up</TextPullUp>
        <TextPullUp as="h3" by="character" staggerDelay={0.02} className="text-2xl font-semibold text-[var(--color-muted)]">Character spring</TextPullUp>
      </div>
    </Lazy>
  ),
};

export const SpringChars: StoryObj = {
  render: () => (
    <Lazy>
      <div className="space-y-8">
        <TextSpringChars as="h2" className="text-4xl font-bold text-[var(--color-text)]">Spring Physics Characters</TextSpringChars>
        <TextSpringChars as="h3" stiffness={200} damping={15} className="text-2xl font-semibold text-[var(--color-accent)]">Bouncy Spring</TextSpringChars>
      </div>
    </Lazy>
  ),
};

export const MaskReveal: StoryObj = {
  render: () => (
    <Lazy>
      <div className="space-y-8">
        <TextMaskReveal as="h2" direction="up" className="text-4xl font-bold text-[var(--color-text)]">Mask reveal from bottom</TextMaskReveal>
        <TextMaskReveal as="h3" direction="left" duration={1} className="text-2xl font-semibold text-[var(--color-muted)]">Sliding in from the left</TextMaskReveal>
        <TextMaskReveal as="h3" direction="right" className="text-2xl font-semibold text-[var(--color-accent)]">And from the right</TextMaskReveal>
      </div>
    </Lazy>
  ),
};

export const Wave: StoryObj = {
  render: () => (
    <Lazy>
      <div className="space-y-8">
        <TextWave as="h2" trigger="inView" className="text-4xl font-bold text-[var(--color-text)]">Hello World!</TextWave>
        <TextWave as="h3" trigger="hover" amplitude={8} className="text-2xl font-semibold text-[var(--color-muted)] cursor-pointer">Hover to wave</TextWave>
      </div>
    </Lazy>
  ),
};

export const Glitch: StoryObj = {
  render: () => (
    <Lazy>
      <div className="space-y-8">
        <TextGlitch as="h2" trigger="hover" className="text-4xl font-bold text-[var(--color-text)] cursor-pointer">Hover for Glitch</TextGlitch>
        <TextGlitch as="h3" trigger="inView" className="text-2xl font-semibold text-[var(--color-muted)]">Auto-glitch on view</TextGlitch>
      </div>
    </Lazy>
  ),
};

export const Showcase: StoryObj = {
  render: () => (
    <Lazy>
      <div className="mx-auto max-w-4xl space-y-24 py-16 px-8">
        <div className="text-center space-y-4">
          <TextGradientFlow as="h1" className="text-6xl font-black">Text Animations</TextGradientFlow>
          <TextBlurReveal as="p" className="text-xl text-[var(--color-muted)]">A collection of premium text animation components</TextBlurReveal>
        </div>

        {([
          { title: "1. Text Reveal", description: "Word-by-word or character-by-character staggered reveal with overflow mask",
            demo: <TextReveal as="h3" by="word" className="text-3xl font-bold text-[var(--color-text)]">Every word reveals with precise timing</TextReveal> },
          { title: "2. Typewriter", description: "Classic terminal-style typing and deleting with blinking cursor",
            demo: <TextTypewriter as="h3" text={["Build faster.", "Ship smarter.", "Scale infinitely."]} className="text-3xl font-bold text-[var(--color-text)]" /> },
          { title: "3. Blur Reveal", description: "Apple-inspired blur-to-focus reveal with vertical lift",
            demo: <TextBlurReveal as="h3" className="text-3xl font-bold text-[var(--color-text)]">From blur to crystal clear</TextBlurReveal> },
          { title: "4. Gradient Flow", description: "Continuously animated gradient shimmer across text",
            demo: <TextGradientFlow as="h3" className="text-3xl font-black">Flowing gradient shimmer</TextGradientFlow> },
          { title: "5. Text Scramble", description: "Hacker-style decode effect — random characters resolve to final text",
            demo: <TextScramble as="h3" className="text-3xl font-bold text-[var(--color-text)]">Decoding the future</TextScramble> },
          { title: "6. Number Counter", description: "Animated counting with spring easing, separators, and formatting",
            demo: (
              <div className="flex gap-12">
                <div className="text-center">
                  <TextCounter to={10248} suffix="+" className="text-4xl font-black text-[var(--color-accent)]" />
                  <p className="mt-1 text-sm text-[var(--color-muted)]">Users</p>
                </div>
                <div className="text-center">
                  <TextCounter to={99.9} decimals={1} suffix="%" className="text-4xl font-black text-[var(--color-accent)]" />
                  <p className="mt-1 text-sm text-[var(--color-muted)]">Uptime</p>
                </div>
              </div>
            ) },
          { title: "7. Text Highlight", description: "Marker-sweep highlight that animates via scaleX on matched words",
            demo: <TextHighlight as="h3" highlight={["premium", "animations"]} className="text-3xl font-bold text-[var(--color-text)]">Build premium websites with stunning animations</TextHighlight> },
          { title: "8. Word Rotation", description: "Cycling through words with slide, fade, blur, or scale transitions",
            demo: <TextRotate as="h3" prefix="We build" words={["websites", "apps", "experiences", "the future"]} animation="slide" className="text-3xl font-bold text-[var(--color-text)]" wordClassName="text-[var(--color-accent)]" /> },
          { title: "9. Letter Pull-Up", description: "Spring-powered pull from below with overflow mask",
            demo: <TextPullUp as="h3" className="text-3xl font-bold text-[var(--color-text)]">Spring powered pull up</TextPullUp> },
          { title: "10. Spring Characters", description: "Each character enters with spring physics and 3D rotateX",
            demo: <TextSpringChars as="h3" className="text-3xl font-bold text-[var(--color-text)]">Spring Physics</TextSpringChars> },
          { title: "11. Mask Reveal", description: "clip-path based reveal from any direction",
            demo: <TextMaskReveal as="h3" direction="up" className="text-3xl font-bold text-[var(--color-text)]">Masked reveal from below</TextMaskReveal> },
          { title: "12. Wavy Text", description: "Characters bounce in a wave pattern, triggered on view or hover",
            demo: <TextWave as="h3" trigger="inView" className="text-3xl font-bold text-[var(--color-text)]">Hello World!</TextWave> },
          { title: "13. Glitch Text", description: "RGB split chromatic aberration glitch effect",
            demo: <TextGlitch as="h3" trigger="hover" className="text-3xl font-bold text-[var(--color-text)] cursor-pointer">Hover for Glitch</TextGlitch> },
        ] as const).map((section, i) => (
          <section key={i} className="space-y-4">
            <div className="space-y-1">
              <h2 className="text-sm font-semibold uppercase tracking-widest text-[var(--color-accent)]">{section.title}</h2>
              <p className="text-sm text-[var(--color-muted)]">{section.description}</p>
            </div>
            <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-8">
              {section.demo}
            </div>
          </section>
        ))}
      </div>
    </Lazy>
  ),
};

const meta: Meta = {
  title: "Animations/Text",
  parameters: { layout: "fullscreen" },
};

export default meta;
