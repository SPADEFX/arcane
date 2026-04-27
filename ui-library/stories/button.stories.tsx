import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "@uilibrary/ui";

const meta = {
  title: "Components/Button",
  component: Button,
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "secondary", "ghost"],
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg", "xl"],
    },
    disabled: { control: "boolean" },
  },
  args: {
    children: "Button",
    variant: "primary",
    size: "md",
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: { variant: "primary", children: "Get Started" },
};

export const Secondary: Story = {
  args: { variant: "secondary", children: "Learn More" },
};

export const Ghost: Story = {
  args: { variant: "ghost", children: "Cancel" },
};

export const Small: Story = {
  args: { size: "sm", children: "Small" },
};

export const Large: Story = {
  args: { size: "lg", children: "Large CTA" },
};

export const ExtraLarge: Story = {
  args: { size: "xl", children: "Hero CTA" },
};

export const Disabled: Story = {
  args: { disabled: true, children: "Disabled" },
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
    </div>
  ),
};
