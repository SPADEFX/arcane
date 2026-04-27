import { lazy, Suspense } from "react";
import type { Meta, StoryObj } from "@storybook/react";

const Marquee = lazy(() => import("@uilibrary/ui/components/marquee").then(m => ({ default: m.Marquee })));
const BentoGrid = lazy(() => import("@uilibrary/ui/components/bento-grid").then(m => ({ default: m.BentoGrid })));
const BentoCard = lazy(() => import("@uilibrary/ui/components/bento-grid").then(m => ({ default: m.BentoCard })));
const Dock = lazy(() => import("@uilibrary/ui/components/dock").then(m => ({ default: m.Dock })));
const DockItem = lazy(() => import("@uilibrary/ui/components/dock").then(m => ({ default: m.DockItem })));
const Skeleton = lazy(() => import("@uilibrary/ui/components/skeleton").then(m => ({ default: m.Skeleton })));
const ImageReveal = lazy(() => import("@uilibrary/ui/components/image-reveal").then(m => ({ default: m.ImageReveal })));

function Lazy({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<div className="flex items-center justify-center py-24 text-[var(--color-muted)]">Loading…</div>}>{children}</Suspense>;
}

export const MarqueeLogos: StoryObj = {
  name: "Marquee (Logo Ticker)",
  render: () => (
    <Lazy>
      <div className="py-16 space-y-12">
        <h2 className="text-center text-sm uppercase tracking-widest text-[var(--color-muted)]">Trusted by</h2>
        <Marquee speed={25} pauseOnHover>
          {["Vercel", "Stripe", "Linear", "Figma", "Notion", "Raycast", "Supabase", "Resend"].map((name) => (
            <div key={name} className="flex items-center justify-center rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-8 py-4">
              <span className="text-lg font-semibold text-[var(--color-muted)]">{name}</span>
            </div>
          ))}
        </Marquee>
        <Marquee speed={20} direction="right">
          {["React", "TypeScript", "Tailwind", "GSAP", "Motion", "Three.js", "Radix", "Vite"].map((name) => (
            <div key={name} className="flex items-center justify-center rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-2">
              <span className="text-sm font-medium text-[var(--color-muted)]">{name}</span>
            </div>
          ))}
        </Marquee>
      </div>
    </Lazy>
  ),
};

export const BentoGridDemo: StoryObj = {
  name: "Bento Grid",
  render: () => (
    <Lazy>
      <div className="max-w-5xl mx-auto py-16 px-8">
        <BentoGrid columns={3}>
          <BentoCard colSpan={2} rowSpan={2}>
            <div className="h-full flex flex-col justify-between min-h-[240px]">
              <div>
                <h3 className="text-2xl font-bold text-[var(--color-text)]">Build faster</h3>
                <p className="mt-2 text-[var(--color-muted)]">Ship premium marketing sites in days, not months.</p>
              </div>
              <div className="mt-4 flex gap-2">
                <div className="h-3 w-20 rounded-full bg-[var(--color-accent)]/20" />
                <div className="h-3 w-12 rounded-full bg-[var(--color-accent)]/40" />
                <div className="h-3 w-16 rounded-full bg-[var(--color-accent)]/60" />
              </div>
            </div>
          </BentoCard>
          <BentoCard>
            <h3 className="text-lg font-bold text-[var(--color-text)]">Type Safe</h3>
            <p className="mt-2 text-sm text-[var(--color-muted)]">Full TS support</p>
          </BentoCard>
          <BentoCard>
            <h3 className="text-lg font-bold text-[var(--color-text)]">Accessible</h3>
            <p className="mt-2 text-sm text-[var(--color-muted)]">Radix primitives</p>
          </BentoCard>
          <BentoCard colSpan={2}>
            <h3 className="text-lg font-bold text-[var(--color-text)]">Animation Doctrine</h3>
            <p className="mt-2 text-sm text-[var(--color-muted)]">Motion by default. GSAP for premium scroll scenes. Transform/opacity only.</p>
          </BentoCard>
          <BentoCard>
            <h3 className="text-lg font-bold text-[var(--color-text)]">Themeable</h3>
            <p className="mt-2 text-sm text-[var(--color-muted)]">10 CSS vars = new brand</p>
          </BentoCard>
        </BentoGrid>
      </div>
    </Lazy>
  ),
};

export const DockDemo: StoryObj = {
  name: "Dock (macOS-style)",
  render: () => (
    <Lazy>
      <div className="flex items-center justify-center py-24">
        <Dock magnification={1.8} distance={100}>
          {["H", "S", "F", "M", "D", "C"].map((letter) => (
            <DockItem key={letter} label={`Item ${letter}`}>
              <span className="text-lg font-bold text-[var(--color-text)]">{letter}</span>
            </DockItem>
          ))}
        </Dock>
      </div>
    </Lazy>
  ),
};

export const SkeletonDemo: StoryObj = {
  name: "Skeleton Loading",
  render: () => (
    <Lazy>
      <div className="max-w-md mx-auto py-16 space-y-6 px-8">
        <div className="flex items-center gap-4">
          <Skeleton width={48} height={48} rounded="full" />
          <div className="flex-1 space-y-2">
            <Skeleton height={16} className="w-3/4" />
            <Skeleton height={12} className="w-1/2" />
          </div>
        </div>
        <Skeleton height={200} rounded="lg" className="w-full" />
        <div className="space-y-2">
          <Skeleton height={14} className="w-full" />
          <Skeleton height={14} className="w-5/6" />
          <Skeleton height={14} className="w-4/6" />
        </div>
      </div>
    </Lazy>
  ),
};

export const ImageRevealDemo: StoryObj = {
  name: "Image Reveal",
  render: () => (
    <Lazy>
      <div className="max-w-4xl mx-auto py-16 px-8 space-y-16">
        <div className="h-[30vh] flex items-center justify-center">
          <p className="text-[var(--color-muted)]">Scroll down to see image reveals</p>
        </div>
        <div className="grid grid-cols-2 gap-8">
          <ImageReveal src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&h=400&fit=crop" alt="Abstract" height={300} direction="up" className="rounded-2xl" />
          <ImageReveal src="https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=600&h=400&fit=crop" alt="Abstract" height={300} direction="left" delay={0.2} className="rounded-2xl" />
        </div>
        <ImageReveal src="https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1200&h=400&fit=crop" alt="Gradient" height={400} direction="right" className="rounded-2xl" />
        <div className="h-[20vh]" />
      </div>
    </Lazy>
  ),
};

const meta: Meta = {
  title: "Layout/Utilities",
  parameters: { layout: "fullscreen" },
};

export default meta;
