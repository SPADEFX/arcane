import type { Meta, StoryObj } from "@storybook/react";
import { FeatureGrid } from "@uilibrary/ui";

const iconSvg = (path: string) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
    <path d={path} />
  </svg>
);

const sampleFeatures = [
  {
    icon: iconSvg("M13 2L3 14h9l-1 8 10-12h-9l1-8z"),
    title: "Lightning Fast",
    description: "Optimized for performance. Every animation uses transform and opacity for compositor-friendly rendering.",
  },
  {
    icon: iconSvg("M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"),
    title: "Accessible by Default",
    description: "Built on Radix Primitives with ARIA patterns, keyboard navigation, and reduced motion support.",
  },
  {
    icon: iconSvg("M12 3v18M3 12h18"),
    title: "Token-Driven",
    description: "Change 10 CSS variables and the entire design system adapts. Light, dark, any brand.",
  },
  {
    icon: iconSvg("M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"),
    title: "Composable",
    description: "Mix and match sections. Hero + Feature Grid + CTA + Footer = complete landing page.",
  },
  {
    icon: iconSvg("M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z M22 6l-10 7L2 6"),
    title: "Copy & Ship",
    description: "No npm versioning hell. Copy the component into your project, customize, and ship.",
  },
  {
    icon: iconSvg("M12 20V10 M18 20V4 M6 20v-4"),
    title: "Animation Doctrine",
    description: "Motion by default, GSAP for premium scroll scenes. Consistent easings and timings everywhere.",
  },
];

const meta = {
  title: "Sections/Feature Grid",
  component: FeatureGrid,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof FeatureGrid>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ThreeColumns: Story = {
  args: {
    headline: "Everything you need",
    subheadline: "A complete toolkit for premium marketing sites.",
    features: sampleFeatures,
    columns: 3,
  },
};

export const TwoColumns: Story = {
  args: {
    headline: "Why choose us",
    features: sampleFeatures.slice(0, 4),
    columns: 2,
  },
};

export const FourColumns: Story = {
  args: {
    features: sampleFeatures.slice(0, 4),
    columns: 4,
  },
};

export const NoHeader: Story = {
  args: {
    features: sampleFeatures.slice(0, 3),
    columns: 3,
  },
};
