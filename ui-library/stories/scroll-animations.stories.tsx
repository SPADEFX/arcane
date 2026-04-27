import { lazy, Suspense } from "react";
import type { Meta, StoryObj } from "@storybook/react";

const ScrollReveal = lazy(() => import("@uilibrary/ui/components/scroll-reveal").then(m => ({ default: m.ScrollReveal })));
const ScrollPin = lazy(() => import("@uilibrary/ui/components/scroll-pin").then(m => ({ default: m.ScrollPin })));
const ParallaxLayer = lazy(() => import("@uilibrary/ui/components/parallax-layer").then(m => ({ default: m.ParallaxLayer })));
const TextScrollReveal = lazy(() => import("@uilibrary/ui/components/text-scroll-reveal").then(m => ({ default: m.TextScrollReveal })));

function Lazy({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<div className="flex items-center justify-center py-24 text-[var(--color-muted)]">Loading…</div>}>{children}</Suspense>;
}

export const RevealFadeUp: StoryObj = {
  render: () => (
    <Lazy>
      <div className="space-y-16 py-16 max-w-3xl mx-auto px-8">
        <div className="h-[40vh] flex items-center justify-center">
          <p className="text-[var(--color-muted)]">Scroll down to see animations</p>
        </div>
        <ScrollReveal animation="fade-up">
          <h2 className="text-4xl font-bold text-[var(--color-text)]">Fade Up</h2>
          <p className="mt-2 text-[var(--color-muted)]">This content fades in from below with GSAP ScrollTrigger.</p>
        </ScrollReveal>
        <ScrollReveal animation="fade-left">
          <h2 className="text-4xl font-bold text-[var(--color-text)]">Fade Left</h2>
          <p className="mt-2 text-[var(--color-muted)]">Sliding in from the left.</p>
        </ScrollReveal>
        <ScrollReveal animation="scale">
          <h2 className="text-4xl font-bold text-[var(--color-text)]">Scale In</h2>
          <p className="mt-2 text-[var(--color-muted)]">Scales up as it enters view.</p>
        </ScrollReveal>
        <ScrollReveal animation="fade-up" stagger={0.15}>
          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">Card 1</div>
          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 mt-4">Card 2</div>
          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 mt-4">Card 3</div>
        </ScrollReveal>
        <div className="h-[30vh]" />
      </div>
    </Lazy>
  ),
};

export const PinSection: StoryObj = {
  render: () => (
    <Lazy>
      <div>
        <div className="h-screen flex items-center justify-center bg-[var(--color-bg)]">
          <p className="text-[var(--color-muted)]">Scroll down — the next section pins in place</p>
        </div>
        <ScrollPin end="+=200%">
          <div className="h-screen flex items-center justify-center bg-gradient-to-br from-purple-500/10 to-blue-500/10">
            <h2 className="text-5xl font-black text-[var(--color-text)]">Pinned Section</h2>
          </div>
        </ScrollPin>
        <div className="h-screen flex items-center justify-center bg-[var(--color-bg)]">
          <p className="text-[var(--color-muted)]">Content continues after the pin</p>
        </div>
      </div>
    </Lazy>
  ),
};

export const ParallaxLayers: StoryObj = {
  render: () => (
    <Lazy>
      <div>
        <div className="h-[50vh]" />
        <div className="relative h-[80vh] overflow-hidden bg-gradient-to-b from-purple-500/5 to-blue-500/5">
          <ParallaxLayer speed={0.3}>
            <div className="absolute top-20 left-10 h-32 w-32 rounded-full bg-purple-500/20" />
            <div className="absolute top-40 right-20 h-24 w-24 rounded-full bg-blue-500/20" />
          </ParallaxLayer>
          <ParallaxLayer speed={0.8}>
            <div className="flex h-full items-center justify-center">
              <h2 className="text-5xl font-black text-[var(--color-text)]">Parallax Layers</h2>
            </div>
          </ParallaxLayer>
          <ParallaxLayer speed={1.2}>
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2">
              <p className="text-sm text-[var(--color-muted)]">Foreground moves faster</p>
            </div>
          </ParallaxLayer>
        </div>
        <div className="h-[50vh]" />
      </div>
    </Lazy>
  ),
};

export const TextScrollHighlight: StoryObj = {
  render: () => (
    <Lazy>
      <div className="max-w-3xl mx-auto px-8 py-16">
        <div className="h-[50vh] flex items-center justify-center">
          <p className="text-[var(--color-muted)]">Scroll to reveal text</p>
        </div>
        <TextScrollReveal as="h2" by="word" animation="highlight" className="text-4xl font-bold leading-relaxed">
          Every word lights up as you scroll through this headline revealing the message
        </TextScrollReveal>
        <div className="h-16" />
        <TextScrollReveal as="p" by="word" animation="fade" className="text-xl leading-relaxed">
          Words emerge from the darkness one by one fading into full visibility as you scroll down the page
        </TextScrollReveal>
        <div className="h-16" />
        <TextScrollReveal as="h3" by="word" animation="reveal" scrub={1} className="text-3xl font-bold">
          Staggered reveal animation tied to scroll position with smooth scrub
        </TextScrollReveal>
        <div className="h-[50vh]" />
      </div>
    </Lazy>
  ),
};

const meta: Meta = {
  title: "Animations/Scroll & GSAP",
  parameters: { layout: "fullscreen" },
};

export default meta;
