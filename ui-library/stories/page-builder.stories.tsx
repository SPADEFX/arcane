import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import {
  SiteTheme,
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
import { lazy, Suspense } from "react";

const NavbarMegaMenu = lazy(() =>
  import("@uilibrary/ui/components/navbar-mega-menu").then((m) => ({
    default: m.NavbarMegaMenu,
  }))
);
const PingBadge = lazy(() =>
  import("@uilibrary/ui/components/navbar-mega-menu").then((m) => ({
    default: m.PingBadge,
  }))
);

/* ─── Shared data ──────────────────────────────── */

const icon = (path: string) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-6 w-6"
  >
    <path d={path} />
  </svg>
);

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#pricing" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "FAQ", href: "#faq" },
];

const features = [
  { icon: icon("M13 2L3 14h9l-1 8 10-12h-9l1-8z"), title: "Lightning Fast", description: "Transform/opacity animations only. Compositor-friendly, zero layout shift." },
  { icon: icon("M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"), title: "Accessible", description: "Radix Primitives. ARIA patterns. Keyboard navigation. Reduced motion." },
  { icon: icon("M12 3v18M3 12h18"), title: "Token-Driven", description: "10 CSS variables = new brand. Light, dark, any palette." },
  { icon: icon("M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"), title: "Composable", description: "Mix sections like building blocks." },
  { icon: icon("M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z M22 6l-10 7L2 6"), title: "Code Distribution", description: "Copy components, own the code." },
  { icon: icon("M12 20V10 M18 20V4 M6 20v-4"), title: "Animation Doctrine", description: "Motion default, GSAP for scroll." },
];

const testimonials = [
  { quote: "Cut our build time from 2 weeks to 3 days. The animations are incredibly polished.", author: "Sarah Chen", role: "Design Lead" },
  { quote: "First library where I keep the default animations. The motion doctrine is genius.", author: "Marcus Johnson", role: "Freelance Dev" },
  { quote: "Accessibility built in, not bolted on. Exactly what we needed.", author: "Emma Rodriguez", role: "CTO" },
];

const plans = [
  { name: "Starter", description: "For side projects", monthlyPrice: 0, yearlyPrice: 0, ctaLabel: "Get Started Free", features: [{ text: "5 components", included: true }, { text: "Basic animations", included: true }, { text: "Premium sections", included: false as const }] },
  { name: "Pro", description: "For freelancers", monthlyPrice: 29, yearlyPrice: 23, popular: true, ctaLabel: "Start Pro", features: [{ text: "All components", included: true }, { text: "Premium animations", included: true }, { text: "Premium sections", included: true }] },
  { name: "Enterprise", description: "For teams", monthlyPrice: 99, yearlyPrice: 79, ctaLabel: "Contact Sales", features: [{ text: "Everything in Pro", included: true }, { text: "Custom components", included: true }, { text: "Dedicated support", included: true }] },
];

const faqItems = [
  { question: "How do I customize the tokens?", answer: "Override CSS custom properties. Change --color-brand-*, --radius-*, and the entire library adapts." },
  { question: "Is this an npm package?", answer: "No. Code-distribution model. Copy components, own the code, customize freely." },
  { question: "Does it support dark mode?", answer: "Yes. Add data-theme='dark' or .dark class to your root element." },
  { question: "Can I use it with Next.js?", answer: "Yes. All components include 'use client'. Works with transpilePackages or direct copy." },
];

const megaMenuEntries = [
  {
    label: "Products",
    content: (
      <div style={{ padding: 8, display: "flex", flexDirection: "column" as const, gap: 8 }}>
        <a href="#" style={{ display: "block", borderRadius: 8, background: "#2d2d3a", padding: 16, color: "#fff", textDecoration: "none" }}>
          <div style={{ fontSize: 14, fontWeight: 600 }}>Product One</div>
          <div style={{ fontSize: 13, opacity: 0.7, marginTop: 2 }}>Full-featured platform.</div>
        </a>
        <a href="#" style={{ display: "block", borderRadius: 8, background: "#b8b4f0", padding: 16, color: "#2d2d3a", textDecoration: "none" }}>
          <div style={{ fontSize: 14, fontWeight: 600 }}>Product Two</div>
          <div style={{ fontSize: 13, opacity: 0.7, marginTop: 2 }}>Simple and elegant.</div>
        </a>
      </div>
    ),
  },
  {
    label: "Resources",
    items: [
      { title: "Blog", description: "Latest news and updates.", href: "#" },
      { title: "Documentation", description: "Technical guides.", href: "#" },
      { title: "Help Center", description: "Get support.", href: "#" },
    ],
  },
  {
    label: "Company",
    items: [
      { title: "About", description: "Our story.", href: "#" },
      { title: "Careers", description: "Join our team.", href: "#" },
    ],
  },
  { label: "Changelog", href: "#" },
];

/* ─── Page Builder Component ──────────────────── */

function PageBuilder({
  header,
  font,
  brandColor,
  dark,
  showFeatures,
  showTestimonials,
  showPricing,
  showCTA,
  showFAQ,
}: {
  header: "simple" | "mega-menu";
  font: string;
  brandColor: string;
  dark: boolean;
  showFeatures: boolean;
  showTestimonials: boolean;
  showPricing: boolean;
  showCTA: boolean;
  showFAQ: boolean;
}) {
  return (
    <SiteTheme font={font} brandColor={brandColor} dark={dark}>
      <div style={{ background: "var(--color-bg)", minHeight: "100vh" }}>
        {/* Header */}
        {header === "simple" ? (
          <Navbar
            logo="uilibrary"
            links={navLinks}
            ctaLabel="Get Started"
          />
        ) : (
          <Suspense fallback={<div style={{ height: 80 }} />}>
            <NavbarMegaMenu
              logo={
                <span style={{ fontSize: 18, fontWeight: 700, color: "var(--color-text)" }}>
                  uilibrary
                </span>
              }
              entries={megaMenuEntries}
              cta={{ label: "Get Started", href: "#" }}
            />
          </Suspense>
        )}

        {/* Hero — always visible */}
        <HeroSection
          badge="Now in Beta"
          headline="Build premium marketing sites"
          highlightText="in days, not weeks."
          subheadline="A personal component library with micro-interactions, scroll animations, and a design system that makes every project feel unique."
          ctaLabel="Start Building"
          secondaryLabel="View Components"
        />

        {/* Sections — toggled */}
        {showFeatures && (
          <>
            <SectionDivider variant="wave" />
            <div style={{ background: "var(--color-bg-subtle)" }}>
              <FeatureGrid
                headline="Everything you need"
                subheadline="Premium components, animation presets, and a token-driven design system."
                features={features}
                columns={3}
              />
            </div>
            <SectionDivider variant="curve" flip color="var(--color-bg-subtle)" />
          </>
        )}

        {showTestimonials && (
          <Testimonials
            headline="Loved by developers"
            testimonials={testimonials}
            columns={3}
          />
        )}

        {showPricing && (
          <PricingTable
            headline="Simple, transparent pricing"
            subheadline="Choose the plan that fits your workflow."
            plans={plans}
          />
        )}

        {showCTA && (
          <CTASection
            headline="Ready to ship faster?"
            subheadline="Start building premium marketing sites with your own component library."
            ctaLabel="Get Started Free"
            secondaryLabel="View Docs"
            variant="gradient"
          />
        )}

        {showFAQ && (
          <FAQSection headline="Frequently Asked Questions" items={faqItems} />
        )}

        {/* Footer — always visible */}
        <Footer
          logo="uilibrary"
          description="A personal component library for premium marketing sites."
          columns={[
            { title: "Product", links: [{ label: "Features", href: "#" }, { label: "Pricing", href: "#" }] },
            { title: "Resources", links: [{ label: "Docs", href: "#" }, { label: "GitHub", href: "#" }] },
          ]}
          bottomText="&copy; 2026 uilibrary. All rights reserved."
        />
      </div>
    </SiteTheme>
  );
}

/* ─── Story ─────────────────────────────────────── */

const meta = {
  title: "Pages/Page Builder",
  component: PageBuilder,
  parameters: { layout: "fullscreen" },
  argTypes: {
    header: {
      control: "select",
      options: ["simple", "mega-menu"],
      description: "Header variant",
    },
    font: {
      control: "select",
      options: [
        "Inter",
        "DM Sans",
        "Space Grotesk",
        "Plus Jakarta Sans",
        "Outfit",
        "Manrope",
        "Instrument Sans",
        "Syne",
      ],
      description: "Global font family",
    },
    brandColor: {
      control: "color",
      description: "Brand color — all shades derived automatically",
    },
    dark: {
      control: "boolean",
      description: "Dark mode",
    },
    showFeatures: { control: "boolean" },
    showTestimonials: { control: "boolean" },
    showPricing: { control: "boolean" },
    showCTA: { control: "boolean" },
    showFAQ: { control: "boolean" },
  },
} satisfies Meta<typeof PageBuilder>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    header: "simple",
    font: "Inter",
    brandColor: "#3b82f6",
    dark: false,
    showFeatures: true,
    showTestimonials: true,
    showPricing: true,
    showCTA: true,
    showFAQ: true,
  },
};

export const DarkPurple: Story = {
  args: {
    header: "mega-menu",
    font: "Space Grotesk",
    brandColor: "#8b5cf6",
    dark: true,
    showFeatures: true,
    showTestimonials: true,
    showPricing: false,
    showCTA: true,
    showFAQ: false,
  },
};

export const MinimalGreen: Story = {
  args: {
    header: "simple",
    font: "DM Sans",
    brandColor: "#10b981",
    dark: false,
    showFeatures: true,
    showTestimonials: false,
    showPricing: true,
    showCTA: false,
    showFAQ: true,
  },
};
