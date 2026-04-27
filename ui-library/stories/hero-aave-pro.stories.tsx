import type { Meta, StoryObj } from "@storybook/react";
import { HeroAavePro } from "@uilibrary/ui";

const meta = {
  title: "Heroes/Aave Pro",
  component: HeroAavePro,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof HeroAavePro>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    badge: "Aave Pro",
    headline: "The future of DeFi",
    subheadline:
      "The full power of Aave's lending markets. Deposit, borrow, and manage positions, your way.",
    ctaLabel: "Get Started",
    secondaryLabel: "Learn More",
  },
};

export const WithScreenshot: Story = {
  args: {
    ...Default.args,
    screenshotSrc: "https://placehold.co/1200x700/111111/333333?text=App+Screenshot",
    screenshotAlt: "Aave Pro interface",
  },
};

export const CustomContent: Story = {
  args: {
    badge: "Your Brand",
    headline: "Your headline here",
    subheadline: "Your description goes here. Customize everything.",
    ctaLabel: "Launch App",
    secondaryLabel: "Documentation",
  },
};

export const Minimal: Story = {
  args: {
    headline: "The future of DeFi",
  },
};
