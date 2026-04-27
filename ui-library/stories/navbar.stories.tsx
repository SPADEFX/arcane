import type { Meta, StoryObj } from "@storybook/react";
import { Navbar } from "@uilibrary/ui";

const defaultLinks = [
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#pricing" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "FAQ", href: "#faq" },
];

const meta = {
  title: "Headers/Simple Navbar",
  component: Navbar,
  parameters: { layout: "fullscreen" },
  args: {
    logo: "uilibrary",
    links: defaultLinks,
    ctaLabel: "Get Started",
    ctaHref: "#",
  },
} satisfies Meta<typeof Navbar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Scrolled: Story = {
  decorators: [
    (Story) => (
      <div>
        <Story />
        <div style={{ height: "200vh", paddingTop: "100px" }}>
          <p style={{ textAlign: "center", color: "var(--color-text-muted)" }}>
            Scroll down to see the blur effect
          </p>
        </div>
      </div>
    ),
  ],
};

export const FewLinks: Story = {
  args: {
    links: [
      { label: "About", href: "#" },
      { label: "Contact", href: "#" },
    ],
  },
};
