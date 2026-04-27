import type { Meta, StoryObj } from "@storybook/react";
import { Card } from "@uilibrary/ui";

const meta = {
  title: "Components/Card",
  component: Card,
  argTypes: {
    hover: { control: "boolean" },
  },
  args: {
    hover: false,
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: (
      <div>
        <h3 style={{ fontWeight: 600, marginBottom: "0.5rem" }}>Card Title</h3>
        <p style={{ color: "var(--color-text-secondary)" }}>
          Card content goes here. This is a flexible container for marketing blocks.
        </p>
      </div>
    ),
  },
};

export const WithHover: Story = {
  args: {
    hover: true,
    children: (
      <div>
        <h3 style={{ fontWeight: 600, marginBottom: "0.5rem" }}>Hover Card</h3>
        <p style={{ color: "var(--color-text-secondary)" }}>
          Hover over this card to see the premium lift effect.
        </p>
      </div>
    ),
  },
};

export const Grid: Story = {
  render: () => (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 280px)", gap: "1.5rem" }}>
      {["Design", "Develop", "Deploy"].map((title) => (
        <Card key={title} hover>
          <h3 style={{ fontWeight: 600, marginBottom: "0.5rem" }}>{title}</h3>
          <p style={{ color: "var(--color-text-secondary)", fontSize: "0.875rem" }}>
            Premium marketing card with hover elevation.
          </p>
        </Card>
      ))}
    </div>
  ),
};
