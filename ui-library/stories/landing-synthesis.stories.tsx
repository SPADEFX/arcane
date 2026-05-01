import type { Meta, StoryObj } from "@storybook/react";
import { LandingSynthesis } from "../sections/landing-synthesis";

const meta = {
  title: "Pages/Landing Synthesis",
  component: LandingSynthesis,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof LandingSynthesis>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
