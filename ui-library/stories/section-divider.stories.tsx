import type { Meta, StoryObj } from "@storybook/react";
import { SectionDivider } from "@uilibrary/ui";

const meta = {
  title: "Components/SectionDivider",
  component: SectionDivider,
  parameters: { layout: "fullscreen" },
  argTypes: {
    variant: { control: "select", options: ["wave", "tilt", "curve", "gradient"] },
    flip: { control: "boolean" },
  },
} satisfies Meta<typeof SectionDivider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Wave: Story = { args: { variant: "wave" } };
export const WaveFlipped: Story = { args: { variant: "wave", flip: true } };
export const Tilt: Story = { args: { variant: "tilt" } };
export const Curve: Story = { args: { variant: "curve" } };
export const Gradient: Story = { args: { variant: "gradient" } };

export const AllVariants: Story = {
  render: () => (
    <div>
      <div style={{ background: "var(--color-bg)", padding: "2rem", textAlign: "center" }}>
        <p style={{ color: "var(--color-text-secondary)" }}>Section Above</p>
      </div>
      <SectionDivider variant="wave" />
      <div style={{ background: "var(--color-bg-subtle)", padding: "2rem", textAlign: "center" }}>
        <p style={{ color: "var(--color-text-secondary)" }}>Wave divider above</p>
      </div>
      <SectionDivider variant="tilt" flip />
      <div style={{ background: "var(--color-bg)", padding: "2rem", textAlign: "center" }}>
        <p style={{ color: "var(--color-text-secondary)" }}>Tilt divider above (flipped)</p>
      </div>
      <SectionDivider variant="curve" />
      <div style={{ background: "var(--color-bg-subtle)", padding: "2rem", textAlign: "center" }}>
        <p style={{ color: "var(--color-text-secondary)" }}>Curve divider above</p>
      </div>
    </div>
  ),
};
