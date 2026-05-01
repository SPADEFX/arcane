import type { Meta, StoryObj } from "@storybook/react";
import { Bento601 } from "../sections/bento-601";

/**
 * Bento section built strictly to 601 Inc.'s DESIGN.md from
 * styles.refero.design. Demonstrates how a refero MD becomes a
 * pixel-faithful component in one pass.
 *
 * Reference: /references/601-inc.design.md
 */
const meta = {
  title: "Heroes/Bento 601",
  component: Bento601,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof Bento601>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const TokyoVolume: Story = {
  args: {
    number: "0 4",
    numberLabel: "Volume four · Tokyo edition",
    manifesto:
      "Frames slow enough to hold your gaze. The city is the lens; the studio is the cut. Films you finish with more questions than you started with.",
    ctaLabel: "Index",
    stats: [
      { value: "47", label: "Cuts" },
      { value: "11", label: "Cities" },
    ],
  },
};
