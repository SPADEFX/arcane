import type { Meta, StoryObj } from "@storybook/react";
import { Footer } from "@uilibrary/ui";

const columns = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "#" },
      { label: "Pricing", href: "#" },
      { label: "Changelog", href: "#" },
      { label: "Roadmap", href: "#" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Documentation", href: "#" },
      { label: "Components", href: "#" },
      { label: "Storybook", href: "#" },
      { label: "GitHub", href: "#" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "#" },
      { label: "Blog", href: "#" },
      { label: "Contact", href: "#" },
      { label: "Privacy", href: "#" },
    ],
  },
];

const xIcon = (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const ghIcon = (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0012 2z" />
  </svg>
);

const meta = {
  title: "Footers/Default",
  component: Footer,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof Footer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Full: Story = {
  args: {
    logo: "uilibrary",
    description: "A personal component library for premium marketing sites. Ship faster with confidence.",
    columns,
    newsletter: true,
    socialLinks: [
      { label: "X (Twitter)", href: "#", icon: xIcon },
      { label: "GitHub", href: "#", icon: ghIcon },
    ],
    bottomText: "\u00A9 2026 uilibrary. All rights reserved.",
  },
};

export const Minimal: Story = {
  args: {
    logo: "Brand",
    columns: columns.slice(0, 2),
    bottomText: "\u00A9 2026 Brand Inc.",
  },
};

export const WithNewsletter: Story = {
  args: {
    logo: "Newsletter Co",
    description: "Stay up to date with the latest.",
    newsletter: true,
    newsletterHeadline: "Get weekly updates",
    bottomText: "\u00A9 2026",
  },
};
