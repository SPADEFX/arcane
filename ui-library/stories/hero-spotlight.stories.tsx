import type { Meta, StoryObj } from "@storybook/react";
import { HeroSpotlight } from "@uilibrary/ui";

const meta = {
  title: "Heroes/Spotlight",
  component: HeroSpotlight,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof HeroSpotlight>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    badge: "Components · Motion · Tokens",
    headline: "Your website shouldn't look like everyone else's.",
    highlightText: "So stop using their components.",
    subheadline:
      "57 opinionated components with real type pairings, choreographed motion, and a token system that doesn't default to Inter + Indigo.",
    ctaLabel: "Browse Library",
    secondaryLabel: "View Source",
    screenshotSrc: "https://placehold.co/1100x650/0f0f0f/ffffff?text=.",
    dotGrid: true,
    floatingCards: true,
    logos: [
      { name: "Vercel" },
      { name: "Linear" },
      { name: "Resend" },
      { name: "Railway" },
    ],
  },
};

export const Minimal: Story = {
  args: {
    headline: "Craft, not templates.",
    subheadline:
      "Every component was designed twice — once for light, once for dark. Not inverted. Designed.",
    ctaLabel: "Start Building",
    dotGrid: false,
    floatingCards: false,
  },
};

export const WithScreenshot: Story = {
  args: {
    badge: "v2.0 — 18 new sections",
    headline: "The last component library you'll install.",
    subheadline:
      "Stop copy-pasting from 4 different UI kits. One library, one design language, zero inconsistency.",
    ctaLabel: "Get Access",
    secondaryLabel: "Read Changelog",
    screenshotSrc: "https://placehold.co/1100x650/0a0a0a/333333?text=Dashboard",
    dotGrid: true,
  },
};
