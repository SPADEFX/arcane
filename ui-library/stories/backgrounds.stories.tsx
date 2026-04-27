import { lazy, Suspense } from "react";
import type { Meta, StoryObj } from "@storybook/react";

const GradientMesh = lazy(() => import("@uilibrary/ui/components/gradient-mesh").then(m => ({ default: m.GradientMesh })));
const AuroraBackground = lazy(() => import("@uilibrary/ui/components/aurora-background").then(m => ({ default: m.AuroraBackground })));
const GridBackground = lazy(() => import("@uilibrary/ui/components/grid-background").then(m => ({ default: m.GridBackground })));
const NoiseOverlay = lazy(() => import("@uilibrary/ui/components/noise-overlay").then(m => ({ default: m.NoiseOverlay })));

function Lazy({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<div className="flex items-center justify-center py-24 text-[var(--color-muted)]">Loading…</div>}>{children}</Suspense>;
}

export const GradientMeshDemo: StoryObj = {
  name: "Gradient Mesh (Stripe-style)",
  render: () => (
    <Lazy>
      <div className="relative h-[500px] rounded-2xl overflow-hidden">
        <GradientMesh colors={["#7c3aed", "#2563eb", "#db2777", "#0891b2"]} speed={0.003} blur={80} />
        <div className="relative z-10 flex h-full items-center justify-center">
          <h1 className="text-5xl font-black text-white drop-shadow-lg">Gradient Mesh</h1>
        </div>
      </div>
    </Lazy>
  ),
};

export const GradientMeshWarm: StoryObj = {
  name: "Gradient Mesh (Warm)",
  render: () => (
    <Lazy>
      <div className="relative h-[500px] rounded-2xl overflow-hidden">
        <GradientMesh colors={["#f97316", "#ef4444", "#ec4899", "#f59e0b"]} speed={0.005} blur={100} />
        <div className="relative z-10 flex h-full items-center justify-center">
          <h1 className="text-5xl font-black text-white drop-shadow-lg">Warm Palette</h1>
        </div>
      </div>
    </Lazy>
  ),
};

export const AuroraDemo: StoryObj = {
  name: "Aurora / Northern Lights",
  render: () => (
    <Lazy>
      <div className="relative h-[500px] rounded-2xl overflow-hidden bg-[#0a0a1a]">
        <AuroraBackground colors={["#7c3aed", "#2563eb", "#10b981"]} speed="normal" />
        <div className="relative z-10 flex h-full items-center justify-center">
          <h1 className="text-5xl font-black text-white">Aurora Background</h1>
        </div>
      </div>
    </Lazy>
  ),
};

export const GridDemo: StoryObj = {
  name: "Grid Pattern",
  render: () => (
    <Lazy>
      <div className="relative h-[500px] rounded-2xl overflow-hidden bg-[#0a0a0a]">
        <GridBackground variant="grid" size={40} color="rgba(255,255,255,0.06)" fade />
        <div className="relative z-10 flex h-full items-center justify-center">
          <h1 className="text-5xl font-black text-white">Grid Background</h1>
        </div>
      </div>
    </Lazy>
  ),
};

export const DotsDemo: StoryObj = {
  name: "Dot Pattern",
  render: () => (
    <Lazy>
      <div className="relative h-[500px] rounded-2xl overflow-hidden bg-[#0a0a0a]">
        <GridBackground variant="dots" size={24} color="rgba(255,255,255,0.12)" fade />
        <div className="relative z-10 flex h-full items-center justify-center">
          <h1 className="text-5xl font-black text-white">Dot Background</h1>
        </div>
      </div>
    </Lazy>
  ),
};

export const NoiseDemo: StoryObj = {
  name: "Noise Overlay",
  render: () => (
    <Lazy>
      <div className="relative h-[500px] rounded-2xl overflow-hidden bg-gradient-to-br from-purple-600 to-blue-600">
        <NoiseOverlay opacity={0.08} blendMode="overlay" />
        <div className="relative z-10 flex h-full items-center justify-center">
          <h1 className="text-5xl font-black text-white">Noise Overlay</h1>
        </div>
      </div>
    </Lazy>
  ),
};

export const NoiseAnimated: StoryObj = {
  name: "Noise Animated (Film Grain)",
  render: () => (
    <Lazy>
      <div className="relative h-[500px] rounded-2xl overflow-hidden bg-gradient-to-br from-zinc-900 to-zinc-800">
        <NoiseOverlay opacity={0.06} blendMode="overlay" animated />
        <div className="relative z-10 flex h-full items-center justify-center">
          <h1 className="text-5xl font-black text-white">Film Grain</h1>
        </div>
      </div>
    </Lazy>
  ),
};

export const Combined: StoryObj = {
  name: "Combined (Mesh + Grid + Noise)",
  render: () => (
    <Lazy>
      <div className="relative h-[500px] rounded-2xl overflow-hidden bg-[#0a0a0a]">
        <GradientMesh colors={["#7c3aed", "#2563eb", "#db2777"]} blur={100} />
        <GridBackground variant="grid" size={50} color="rgba(255,255,255,0.03)" fade={false} />
        <NoiseOverlay opacity={0.04} />
        <div className="relative z-10 flex h-full flex-col items-center justify-center gap-4">
          <h1 className="text-5xl font-black text-white">The Full Stack</h1>
          <p className="text-white/60">Gradient Mesh + Grid + Noise — layered together</p>
        </div>
      </div>
    </Lazy>
  ),
};

const meta: Meta = {
  title: "Effects/Backgrounds",
  parameters: { layout: "padded" },
};

export default meta;
