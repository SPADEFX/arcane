import type { Meta, StoryObj } from "@storybook/react";
import { HeroSection } from "@uilibrary/ui";

const meta = {
  title: "Heroes/Default",
  component: HeroSection,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof HeroSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    badge: "Now in Beta",
    headline: "Build premium web experiences",
    highlightText: "at scale.",
    subheadline:
      "A personal component library with micro-interactions, scroll animations, and a strong visual signature.",
    ctaLabel: "Get Started",
    secondaryLabel: "Learn More",
  },
};

export const WithGradient: Story = {
  args: {
    badge: "New Release",
    headline: "Ship marketing sites",
    highlightText: "10x faster.",
    subheadline:
      "Reusable components, animation presets, and token-driven design. Your personal edge.",
    ctaLabel: "Start Free",
    secondaryLabel: "View Docs",
    gradient: true,
  },
};

export const Minimal: Story = {
  args: {
    headline: "Simple. Fast. Premium.",
    gradient: false,
  },
};

export const NoBadge: Story = {
  args: {
    headline: "The design system for freelance",
    highlightText: "marketing sites.",
    subheadline: "Stop rebuilding the same components. Start shipping.",
    ctaLabel: "Get Access",
  },
};
