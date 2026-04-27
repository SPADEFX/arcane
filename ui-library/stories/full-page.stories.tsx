import type { Meta, StoryObj } from "@storybook/react";
import {
  Navbar,
  HeroSection,
  FeatureGrid,
  SectionDivider,
  Testimonials,
  CTASection,
  PricingTable,
  FAQSection,
  Footer,
} from "@uilibrary/ui";

const meta = {
  title: "Pages/Full Landing Page",
  parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const icon = (path: string) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
    <path d={path} />
  </svg>
);

export const Complete: Story = {
  render: () => (
    <div style={{ background: "var(--color-bg)" }}>
      <Navbar
        logo="uilibrary"
        links={[
          { label: "Features", href: "#features" },
          { label: "Pricing", href: "#pricing" },
          { label: "Testimonials", href: "#testimonials" },
          { label: "FAQ", href: "#faq" },
        ]}
        ctaLabel="Get Started"
      />

      <HeroSection
        badge="Now in Beta"
        headline="Build premium marketing sites"
        highlightText="in days, not weeks."
        subheadline="A personal component library with micro-interactions, scroll animations, and a design system that makes every project feel unique."
        ctaLabel="Start Building"
        secondaryLabel="View Components"
      />

      <SectionDivider variant="wave" />

      <div id="features" style={{ background: "var(--color-bg-subtle)" }}>
        <FeatureGrid
          headline="Everything you need"
          subheadline="Premium components, animation presets, and a token-driven design system."
          features={[
            { icon: icon("M13 2L3 14h9l-1 8 10-12h-9l1-8z"), title: "Lightning Fast", description: "Transform/opacity animations only. Compositor-friendly, zero layout shift." },
            { icon: icon("M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"), title: "Accessible", description: "Radix Primitives. ARIA patterns. Keyboard navigation. Reduced motion." },
            { icon: icon("M12 3v18M3 12h18"), title: "Token-Driven", description: "10 CSS variables = new brand. Light, dark, any palette." },
            { icon: icon("M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"), title: "Composable", description: "Mix sections like building blocks. Full pages in minutes." },
            { icon: icon("M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z M22 6l-10 7L2 6"), title: "Code Distribution", description: "Copy components, own the code. No npm versioning hell." },
            { icon: icon("M12 20V10 M18 20V4 M6 20v-4"), title: "Animation Doctrine", description: "Motion default, GSAP for scroll storytelling. Consistent everywhere." },
          ]}
          columns={3}
        />
      </div>

      <SectionDivider variant="curve" flip color="var(--color-bg-subtle)" />

      <div id="testimonials">
        <Testimonials
          headline="Loved by developers"
          testimonials={[
            { quote: "Cut our build time from 2 weeks to 3 days. The animations are incredibly polished.", author: "Sarah Chen", role: "Design Lead" },
            { quote: "First library where I keep the default animations. The motion doctrine is genius.", author: "Marcus Johnson", role: "Freelance Dev" },
            { quote: "Accessibility built in, not bolted on. Exactly what we needed.", author: "Emma Rodriguez", role: "CTO" },
          ]}
          columns={3}
        />
      </div>

      <div id="pricing">
        <PricingTable
          headline="Simple, transparent pricing"
          subheadline="Choose the plan that fits your workflow."
          plans={[
            { name: "Starter", description: "For side projects", monthlyPrice: 0, yearlyPrice: 0, ctaLabel: "Get Started Free", features: [{ text: "5 components", included: true }, { text: "Basic animations", included: true }, { text: "Premium sections", included: false }] },
            { name: "Pro", description: "For freelancers", monthlyPrice: 29, yearlyPrice: 23, popular: true, ctaLabel: "Start Pro", features: [{ text: "All components", included: true }, { text: "Premium animations", included: true }, { text: "Premium sections", included: true }] },
            { name: "Enterprise", description: "For teams", monthlyPrice: 99, yearlyPrice: 79, ctaLabel: "Contact Sales", features: [{ text: "Everything in Pro", included: true }, { text: "Custom components", included: true }, { text: "Dedicated support", included: true }] },
          ]}
        />
      </div>

      <CTASection
        headline="Ready to ship faster?"
        subheadline="Start building premium marketing sites with your own component library."
        ctaLabel="Get Started Free"
        secondaryLabel="View Docs"
        variant="gradient"
      />

      <div id="faq">
        <FAQSection
          headline="Frequently Asked Questions"
          items={[
            { question: "How do I customize the tokens?", answer: "Override CSS custom properties. Change --color-brand-*, --radius-*, and the entire library adapts." },
            { question: "Is this an npm package?", answer: "No. Code-distribution model. Copy components, own the code, customize freely." },
            { question: "Does it support dark mode?", answer: "Yes. Add data-theme='dark' or .dark class to your root element." },
            { question: "Can I use it with Next.js?", answer: "Yes. All components include 'use client'. Works with transpilePackages or direct copy." },
          ]}
        />
      </div>

      <Footer
        logo="uilibrary"
        description="A personal component library for premium marketing sites."
        columns={[
          { title: "Product", links: [{ label: "Features", href: "#features" }, { label: "Pricing", href: "#pricing" }, { label: "Changelog", href: "#" }] },
          { title: "Resources", links: [{ label: "Docs", href: "#" }, { label: "Storybook", href: "#" }, { label: "GitHub", href: "#" }] },
        ]}
        newsletter
        bottomText="&copy; 2026 uilibrary. All rights reserved."
      />
    </div>
  ),
};
