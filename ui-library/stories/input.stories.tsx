import type { Meta, StoryObj } from "@storybook/react";
import { Input } from "@uilibrary/ui";

const meta = {
  title: "Components/Input",
  component: Input,
  parameters: { layout: "centered" },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { placeholder: "Enter your email..." },
};

export const Disabled: Story = {
  args: { placeholder: "Disabled", disabled: true },
};

export const WithValue: Story = {
  args: { defaultValue: "hello@example.com" },
};
