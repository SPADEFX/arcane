import type { Meta, StoryObj } from "@storybook/react";
import { Badge } from "@uilibrary/ui";

const meta = {
  title: "Components/Badge",
  component: Badge,
  parameters: { layout: "centered" },
  argTypes: {
    variant: { control: "select", options: ["default", "outline", "solid"] },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { children: "New Feature", variant: "default" },
};

export const Outline: Story = {
  args: { children: "Beta", variant: "outline" },
};

export const Solid: Story = {
  args: { children: "Popular", variant: "solid" },
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
      <Badge variant="default">Default</Badge>
      <Badge variant="outline">Outline</Badge>
      <Badge variant="solid">Solid</Badge>
    </div>
  ),
};
