import { lazy, Suspense } from "react";
import type { Meta, StoryObj } from "@storybook/react";

const MagneticButton = lazy(() => import("@uilibrary/ui/components/magnetic-button").then(m => ({ default: m.MagneticButton })));
const SpotlightCard = lazy(() => import("@uilibrary/ui/components/spotlight-card").then(m => ({ default: m.SpotlightCard })));
const TiltCard = lazy(() => import("@uilibrary/ui/components/tilt-card").then(m => ({ default: m.TiltCard })));

function Lazy({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<div className="flex items-center justify-center py-24 text-[var(--color-muted)]">Loading…</div>}>{children}</Suspense>;
}

export const Magnetic: StoryObj = {
  render: () => (
    <Lazy>
      <div className="flex flex-col items-center gap-12 py-16">
        <h2 className="text-sm uppercase tracking-widest text-[var(--color-muted)]">Magnetic Button</h2>
        <MagneticButton>Hover me — I follow your cursor</MagneticButton>
        <MagneticButton strength={0.5} className="bg-transparent border-2 border-[var(--color-accent)] text-[var(--color-accent)]">
          Strong pull
        </MagneticButton>
        <MagneticButton strength={0.2} className="rounded-lg px-12 py-5 text-lg">
          Get Started
        </MagneticButton>
      </div>
    </Lazy>
  ),
};

export const Spotlight: StoryObj = {
  render: () => (
    <Lazy>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto py-16 px-8">
        {[
          { title: "Lightning Fast", desc: "Optimized for performance at every level." },
          { title: "Type Safe", desc: "Full TypeScript support with strict types." },
          { title: "Accessible", desc: "Built on Radix primitives for WCAG compliance." },
          { title: "Themeable", desc: "Change 10 CSS variables, get a new brand." },
          { title: "Animated", desc: "Motion by default, GSAP for premium." },
          { title: "Composable", desc: "Mix and match any component combination." },
        ].map((item, i) => (
          <SpotlightCard key={i}>
            <h3 className="text-lg font-semibold text-[var(--color-text)]">{item.title}</h3>
            <p className="mt-2 text-sm text-[var(--color-muted)]">{item.desc}</p>
          </SpotlightCard>
        ))}
      </div>
    </Lazy>
  ),
};

export const Tilt: StoryObj = {
  render: () => (
    <Lazy>
      <div className="flex flex-wrap items-center justify-center gap-8 py-16 px-8">
        <TiltCard className="w-72 h-80">
          <div className="p-6 h-full flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-bold text-[var(--color-text)]">3D Tilt Card</h3>
              <p className="mt-2 text-sm text-[var(--color-muted)]">
                Move your mouse across the card to see the 3D tilt effect with glare.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-[var(--color-accent)]" />
              <span className="text-sm font-medium text-[var(--color-text)]">Interactive</span>
            </div>
          </div>
        </TiltCard>
        <TiltCard maxTilt={20} glare={false} className="w-72 h-80">
          <div className="p-6 h-full flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-bold text-[var(--color-text)]">No Glare</h3>
              <p className="mt-2 text-sm text-[var(--color-muted)]">
                Same tilt effect but without the glare overlay. Stronger tilt angle.
              </p>
            </div>
            <div className="text-sm text-[var(--color-accent)]">maxTilt: 20</div>
          </div>
        </TiltCard>
      </div>
    </Lazy>
  ),
};

const meta: Meta = {
  title: "Effects/Interactive",
  parameters: { layout: "fullscreen" },
};

export default meta;
