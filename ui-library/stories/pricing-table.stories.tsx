import type { Meta, StoryObj } from "@storybook/react";
import { PricingTable } from "@uilibrary/ui";

const plans = [
  {
    name: "Starter",
    description: "Perfect for side projects",
    monthlyPrice: 0,
    yearlyPrice: 0,
    ctaLabel: "Get Started Free",
    features: [
      { text: "5 components", included: true },
      { text: "Basic animations", included: true },
      { text: "Community support", included: true },
      { text: "Custom tokens", included: false },
      { text: "Premium sections", included: false },
    ],
  },
  {
    name: "Pro",
    description: "For freelancers and agencies",
    monthlyPrice: 29,
    yearlyPrice: 23,
    popular: true,
    ctaLabel: "Start Pro Trial",
    features: [
      { text: "All components", included: true },
      { text: "Premium animations", included: true },
      { text: "Priority support", included: true },
      { text: "Custom tokens", included: true },
      { text: "Premium sections", included: true },
    ],
  },
  {
    name: "Enterprise",
    description: "For teams at scale",
    monthlyPrice: 99,
    yearlyPrice: 79,
    ctaLabel: "Contact Sales",
    features: [
      { text: "Everything in Pro", included: true },
      { text: "Custom components", included: true },
      { text: "Dedicated support", included: true },
      { text: "SLA guarantee", included: true },
      { text: "White-label license", included: true },
    ],
  },
];

const meta = {
  title: "Sections/Pricing Table",
  component: PricingTable,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof PricingTable>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    headline: "Simple, transparent pricing",
    subheadline: "Choose the plan that fits your workflow.",
    plans,
  },
};

export const NoHeader: Story = {
  args: { plans },
};
