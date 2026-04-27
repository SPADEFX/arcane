import type { Meta, StoryObj } from "@storybook/react";
import { FAQSection } from "@uilibrary/ui";

const faqItems = [
  {
    question: "How do I customize the design tokens?",
    answer: "Override the CSS custom properties in your project's global CSS. Change --color-brand-*, --radius-*, --shadow-*, etc. and every component adapts automatically.",
  },
  {
    question: "Is this a npm package I install?",
    answer: "No. It's a code-distribution model (like shadcn). You copy components into your project and own the code. This means you can customize anything without waiting for a package update.",
  },
  {
    question: "How do animations work with reduced motion?",
    answer: "Every animation respects prefers-reduced-motion. The useReducedMotion hook is available, and Motion's built-in reduced motion support is used throughout. Animations gracefully degrade to instant transitions.",
  },
  {
    question: "Can I use this with Next.js?",
    answer: "Yes. All components include the 'use client' directive. The library is built as ESM and works with Next.js transpilePackages or by copying components directly.",
  },
  {
    question: "What about GSAP licensing?",
    answer: "GSAP is 100% free under their standard license since 2025. You can use ScrollTrigger, SplitText, and other plugins in commercial projects without fees.",
  },
  {
    question: "How do I add a new component?",
    answer: "Create a .tsx file in packages/ui/src/components/, add a story in apps/docs/src/stories/, export it from the package index, and you're done. Storybook hot-reloads as you work.",
  },
];

const meta = {
  title: "Sections/FAQ",
  component: FAQSection,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof FAQSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    headline: "Frequently Asked Questions",
    subheadline: "Everything you need to know about the library.",
    items: faqItems,
  },
};

export const Short: Story = {
  args: {
    headline: "FAQ",
    items: faqItems.slice(0, 3),
  },
};
