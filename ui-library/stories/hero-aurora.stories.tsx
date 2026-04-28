import type { Meta, StoryObj } from "@storybook/react";
import { HeroAurora } from "@uilibrary/ui";

const meta = {
  title: "Heroes/Aurora",
  component: HeroAurora,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof HeroAurora>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    headline: "Not another landing page builder.",
    highlightText: "A design weapon.",
    subheadline:
      "57 components. 15 typefaces. GPU-only motion. A token system that actually works. Built for people who notice the details.",
    ctaLabel: "Get Access",
    secondaryLabel: "See Components",
    colorScheme: "blue",
    grain: true,
    statLine: "// 340 projects · 57 components · 0 dependencies on Inter",
  },
};

export const Emerald: Story = {
  args: {
    headline: "Infrastructure shouldn't need a manual.",
    highlightText: "Deploy and forget.",
    subheadline:
      "Zero-config. Auto-scaling. Instant rollback. Your code runs, we handle the rest.",
    ctaLabel: "Deploy Now",
    colorScheme: "emerald",
    grain: true,
    statLine: "// 2.4M deploys/month · 0.3s cold start · SOC 2 Type II",
  },
};

export const Rose: Story = {
  args: {
    headline: "Design systems that designers actually use.",
    highlightText: "Not just document.",
    subheadline:
      "Figma tokens → CSS variables → React components. One source of truth. Zero drift.",
    ctaLabel: "Start Free",
    secondaryLabel: "Watch 2min Demo",
    colorScheme: "rose",
    grain: true,
  },
};

export const Amber: Story = {
  args: {
    headline: "Your API. Your rules.",
    highlightText: "We just make them fast.",
    subheadline:
      "Edge functions in 50ms. Rate limiting built in. Auth that doesn't make you want to quit.",
    ctaLabel: "Read Docs",
    colorScheme: "amber",
    grain: false,
  },
};

export const MinimalPurple: Story = {
  args: {
    headline: "Ship it.",
    subheadline: "Everything else is procrastination.",
    ctaLabel: "Start Now",
    colorScheme: "purple",
    grain: true,
  },
};
