import type { Meta, StoryObj } from "@storybook/react";
import { HeroSeen } from "../sections/hero-seen";

/**
 * Hero built strictly to SEEN's DESIGN.md from styles.refero.design.
 * Reference: /references/seen.design.md
 */
const meta = {
  title: "Heroes/Seen",
  component: HeroSeen,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof HeroSeen>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const Read: Story = {
  args: {
    preLabel: "Public release",
    word: "feel",
    description: "Slow conversations on a soft afternoon.",
    ctaLabel: "Begin",
  },
};
