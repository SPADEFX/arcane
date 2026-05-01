import type { Meta, StoryObj } from "@storybook/react";
import { HeroFamily } from "../sections/hero-family";

const meta = {
  title: "Heroes/Family",
  component: HeroFamily,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof HeroFamily>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
