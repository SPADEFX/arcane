import type { Meta, StoryObj } from "@storybook/react";
import { TextReveal } from "@uilibrary/ui";

const meta = {
  title: "Components/TextReveal",
  component: TextReveal,
  parameters: { layout: "centered" },
  argTypes: {
    as: { control: "select", options: ["h1", "h2", "h3", "p", "span"] },
    by: { control: "select", options: ["word", "character"] },
  },
} satisfies Meta<typeof TextReveal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ByWord: Story = {
  args: {
    children: "Build premium web experiences at scale with confidence.",
    as: "h2",
    by: "word",
    className:
      "text-[var(--font-display-lg)] font-bold tracking-tight text-[var(--color-text)]",
  },
};

export const ByCharacter: Story = {
  args: {
    children: "Premium.",
    as: "h1",
    by: "character",
    staggerDelay: 0.03,
    className:
      "text-[var(--font-display-2xl)] font-bold tracking-tight text-[var(--color-text)]",
  },
};

export const Paragraph: Story = {
  args: {
    children:
      "Every component is crafted with micro-interactions and accessibility in mind.",
    as: "p",
    by: "word",
    staggerDelay: 0.03,
    className:
      "text-[var(--font-text-xl)] text-[var(--color-text-secondary)] max-w-xl",
  },
};
