import type { Meta, StoryObj } from "@storybook/react";
import { Testimonials } from "@uilibrary/ui";

const sampleTestimonials = [
  {
    quote: "This library cut our landing page build time from 2 weeks to 3 days. The animation presets are incredibly polished.",
    author: "Sarah Chen",
    role: "Design Lead at Vercel",
  },
  {
    quote: "Finally, a component library that doesn't look like every other template. The token system makes each project feel unique.",
    author: "Marcus Johnson",
    role: "Freelance Developer",
  },
  {
    quote: "The accessibility is built in, not bolted on. Radix primitives with premium styling — exactly what we needed.",
    author: "Emma Rodriguez",
    role: "CTO at Startup",
  },
  {
    quote: "I've tried shadcn, Chakra, and MUI. This is the first library where I actually want to keep the default animations.",
    author: "David Kim",
    role: "Senior Frontend Engineer",
  },
  {
    quote: "The motion doctrine is genius. Motion for quick stuff, GSAP when you need the big guns. No more animation spaghetti.",
    author: "Lisa Patel",
    role: "Creative Developer",
  },
  {
    quote: "Storybook as a cockpit, tokens as the design API. This is how component libraries should be built.",
    author: "Alex Turner",
    role: "Tech Lead",
  },
];

const meta = {
  title: "Sections/Testimonials",
  component: Testimonials,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof Testimonials>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ThreeColumns: Story = {
  args: {
    headline: "Loved by developers",
    testimonials: sampleTestimonials.slice(0, 3),
    columns: 3,
  },
};

export const TwoColumns: Story = {
  args: {
    headline: "What people say",
    testimonials: sampleTestimonials.slice(0, 4),
    columns: 2,
  },
};

export const SixCards: Story = {
  args: {
    headline: "Trusted by teams worldwide",
    testimonials: sampleTestimonials,
    columns: 3,
  },
};
