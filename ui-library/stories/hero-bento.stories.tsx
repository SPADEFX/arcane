import type { Meta, StoryObj } from "@storybook/react";
import { HeroBento } from "@uilibrary/ui";

const meta = {
  title: "Heroes/Bento",
  component: HeroBento,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof HeroBento>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    gradient: false,
  },
};

export const SaaSProduct: Story = {
  args: {
    gradient: false,
    cells: [
      {
        type: "headline",
        colSpan: 2,
        headline: "Observability that doesn't require a PhD",
        highlightText: "to configure.",
        subheadline:
          "Traces, metrics, and logs in one query language. No YAML. No 47-step setup wizard.",
      },
      { type: "stat", value: "99.9", label: "Uptime SLA" },
      { type: "stat", value: "<50", label: "MS P99 Latency" },
      {
        type: "feature",
        title: "One query language",
        description: "Search traces, metrics, and logs with the same syntax. No context switching.",
      },
      {
        type: "testimonial",
        quote: "We replaced Datadog, Sentry, and LogRocket with this. Our ops budget dropped 60%.",
        author: "James Wu",
        role: "Platform Lead, Series B",
      },
      {
        type: "feature",
        title: "Zero-config instrumentation",
        description: "Auto-detect frameworks. No SDK wrapping. Just import and deploy.",
      },
      {
        type: "cta",
        ctaLabel: "Deploy Free Tier",
        ctaHref: "#",
        secondaryLabel: "Read the Docs",
        secondaryHref: "#",
      },
    ],
  },
};
