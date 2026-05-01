import type { Meta, StoryObj } from "@storybook/react";
import { HeroBramble } from "../sections/hero-bramble";

const meta = {
  title: "Heroes/Bramble",
  component: HeroBramble,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof HeroBramble>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** Narrow container (~960px) — editorial / personal-blog feel. */
export const NarrowContainer: Story = { args: { maxWidth: 960 } };

/** Wide container (~1440px) — full-marketing feel. */
export const WideContainer: Story = { args: { maxWidth: 1440 } };

/** Fluid via CSS clamp — responsive max-width. */
export const FluidContainer: Story = { args: { maxWidth: "min(1280px, 92vw)" } };
