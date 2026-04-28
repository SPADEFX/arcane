import type { Meta, StoryObj } from "@storybook/react";
import { HeroSplit } from "@uilibrary/ui";

const meta = {
  title: "Heroes/Split",
  component: HeroSplit,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof HeroSplit>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    badge: "Open Source",
    headline: "Components that feel considered,",
    highlightText: "not generated.",
    subheadline:
      "Real type pairings. Deliberate spacing. Motion that matches context. Not another Tailwind + Inter starter.",
    ctaLabel: "Browse Components",
    secondaryLabel: "View on GitHub",
    features: [
      { text: "GPU-only animations — transform + opacity, nothing else" },
      { text: "Both modes designed, not inverted" },
      { text: "10 CSS variables = complete rebrand" },
      { text: "Reduced motion respected everywhere" },
    ],
    socialProof: "Used by 340 projects this month",
  },
};

export const Reversed: Story = {
  args: {
    headline: "Typography is the interface.",
    highlightText: "Everything else is support.",
    subheadline:
      "15 typeface families loaded. Serif headlines. Monospace data. Geometric display. Each hero picks a different voice.",
    ctaLabel: "See Type System",
    reversed: true,
    features: [
      { text: "Instrument Serif, Fraunces, Syne, Bebas Neue" },
      { text: "Space Grotesk, Bricolage, Cormorant" },
      { text: "Automatic optical sizing + variable axes" },
    ],
  },
};

export const WithImage: Story = {
  args: {
    badge: "Just Shipped",
    headline: "This is what 57 components",
    highlightText: "actually look like.",
    subheadline:
      "Not screenshots of Figma. Real rendered components with real data, tested in both modes, at three breakpoints.",
    ctaLabel: "Open Storybook",
    imageSrc: "https://placehold.co/700x500/0f0f0f/222222?text=.",
  },
};
