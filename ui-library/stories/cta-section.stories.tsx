import type { Meta, StoryObj } from "@storybook/react";
import { CTASection } from "@uilibrary/ui";

const meta = {
  title: "Sections/CTA",
  component: CTASection,
  parameters: { layout: "fullscreen" },
  argTypes: {
    variant: { control: "select", options: ["gradient", "solid", "outline"] },
  },
} satisfies Meta<typeof CTASection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Gradient: Story = {
  args: {
    headline: "Ready to ship faster?",
    subheadline: "Start building premium marketing sites with your own component library.",
    ctaLabel: "Get Started Free",
    secondaryLabel: "View Components",
    variant: "gradient",
  },
};

export const Solid: Story = {
  args: {
    headline: "Join 2,000+ developers",
    subheadline: "Build beautiful sites with confidence.",
    ctaLabel: "Start Building",
    variant: "solid",
  },
};

export const Outline: Story = {
  args: {
    headline: "Have questions?",
    subheadline: "Talk to our team and find out how we can help.",
    ctaLabel: "Contact Sales",
    secondaryLabel: "View FAQ",
    variant: "outline",
  },
};
