import type { Meta, StoryObj } from "@storybook/react";
import { HeroRotating } from "@uilibrary/ui";

const meta = {
  title: "Heroes/Rotating",
  component: HeroRotating,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof HeroRotating>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Slide: Story = {
  args: {
    badge: "Open Source · MIT",
    headlinePrefix: "Make it",
    rotatingWords: ["considered", "intentional", "distinctive", "yours"],
    subheadline:
      "Components where the typography, spacing, and motion were actually chosen — not defaulted. Stop shipping Inter + rounded-lg.",
    ctaLabel: "Browse Library",
    secondaryLabel: "GitHub",
    animation: "slide",
    interval: 2800,
    codeLines: [
      "# Install",
      "$ npm i @uilibrary/ui",
      "",
      "# Import what you need",
      "import { HeroAurora } from '@uilibrary/ui'",
      "import { Button } from '@uilibrary/ui'",
      "",
      "# Configure tokens",
      "colorScheme:emerald",
      "grain:true",
      "font:var(--font-syne)",
    ],
    logos: [
      { name: "Vercel" },
      { name: "Linear" },
      { name: "Resend" },
      { name: "Railway" },
    ],
  },
};

export const Blur: Story = {
  args: {
    headlinePrefix: "Built for",
    rotatingWords: ["agencies", "freelancers", "studios", "craftspeople"],
    headlineSuffix: "who ship.",
    subheadline:
      "Not a design system committee. Not a 400-page Notion doc. Components that work when you paste them.",
    ctaLabel: "Get Started",
    animation: "blur",
    interval: 3200,
  },
};

export const Flip: Story = {
  args: {
    headlinePrefix: "The",
    rotatingWords: ["fastest", "cleanest", "boldest"],
    headlineSuffix: "component library.",
    subheadline:
      "Every animation runs on the GPU. Every component tested at 375px, 768px, 1440px. Both modes. No exceptions.",
    ctaLabel: "Open Storybook",
    secondaryLabel: "Read Docs",
    animation: "flip",
    interval: 2400,
  },
};

export const Minimal: Story = {
  args: {
    headlinePrefix: "Ship",
    rotatingWords: ["today", "now", "this week", "already"],
    ctaLabel: "Start",
    animation: "fade",
    interval: 2000,
  },
};
