import type { Meta, StoryObj } from "@storybook/react";
import { HeroLinear } from "../sections/hero-linear";

const meta = {
  title: "Heroes/Linear",
  component: HeroLinear,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof HeroLinear>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
