import type { Meta, StoryObj } from "@storybook/react";
import { HeroAntimetal } from "../sections/hero-antimetal";

const meta = {
  title: "Heroes/Antimetal",
  component: HeroAntimetal,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof HeroAntimetal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
