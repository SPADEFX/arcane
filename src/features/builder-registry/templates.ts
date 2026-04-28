import type { Block, ThemeConfig } from "./types";

export interface PageTemplate {
  id: string;
  name: string;
  description: string;
  theme: ThemeConfig;
  pages: { name: string; slug: string; blocks: Omit<Block, "id">[] }[];
}

export const pageTemplates: PageTemplate[] = [
  /* ─── Landing Page (Full) ─────────────────────── */
  {
    id: "landing-full",
    name: "Landing Page",
    description: "Complete marketing page with hero, features, testimonials, pricing, CTA, FAQ & footer.",
    theme: { font: "Inter", brandColor: "#3b82f6", dark: false },
    pages: [
      {
        name: "Home",
        slug: "/",
        blocks: [
          {
            type: "navbar",
            props: {
              logo: "uilibrary",
              links: [
                { label: "Features", href: "#features" },
                { label: "Pricing", href: "#pricing" },
                { label: "Testimonials", href: "#testimonials" },
                { label: "FAQ", href: "#faq" },
              ],
              ctaLabel: "Get Started",
            },
          },
          {
            type: "hero",
            props: {
              badge: "Now in Beta",
              headline: "Build premium marketing sites",
              highlightText: "in days, not weeks.",
              subheadline:
                "A personal component library with micro-interactions, scroll animations, and a design system that makes every project feel unique.",
              ctaLabel: "Start Building",
              secondaryLabel: "View Components",
            },
          },
          { type: "divider", props: { variant: "wave" } },
          {
            type: "featureGrid",
            props: {
              headline: "Everything you need",
              subheadline: "Premium components, animation presets, and a token-driven design system.",
              features: [
                { title: "Lightning Fast", description: "Transform/opacity animations only. Compositor-friendly, zero layout shift." },
                { title: "Accessible", description: "Radix Primitives. ARIA patterns. Keyboard navigation. Reduced motion." },
                { title: "Token-Driven", description: "10 CSS variables = new brand. Light, dark, any palette." },
                { title: "Composable", description: "Mix sections like building blocks. Full pages in minutes." },
                { title: "Code Distribution", description: "Copy components, own the code. No npm versioning hell." },
                { title: "Animation Doctrine", description: "Motion default, GSAP for scroll storytelling. Consistent everywhere." },
              ],
              columns: 3,
            },
          },
          { type: "divider", props: { variant: "curve", flip: true } },
          {
            type: "testimonials",
            props: {
              headline: "Loved by developers",
              testimonials: [
                { quote: "Cut our build time from 2 weeks to 3 days. The animations are incredibly polished.", author: "Sarah Chen", role: "Design Lead" },
                { quote: "First library where I keep the default animations. The motion doctrine is genius.", author: "Marcus Johnson", role: "Freelance Dev" },
                { quote: "Accessibility built in, not bolted on. Exactly what we needed.", author: "Emma Rodriguez", role: "CTO" },
              ],
              columns: 3,
            },
          },
          {
            type: "pricingTable",
            props: {
              headline: "Simple, transparent pricing",
              subheadline: "Choose the plan that fits your workflow.",
              plans: [
                { name: "Starter", description: "For side projects", monthlyPrice: 0, yearlyPrice: 0, ctaLabel: "Get Started Free", features: [{ text: "5 components", included: true }, { text: "Basic animations", included: true }, { text: "Premium sections", included: false }] },
                { name: "Pro", description: "For freelancers", monthlyPrice: 29, yearlyPrice: 23, popular: true, ctaLabel: "Start Pro", features: [{ text: "All components", included: true }, { text: "Premium animations", included: true }, { text: "Premium sections", included: true }] },
                { name: "Enterprise", description: "For teams", monthlyPrice: 99, yearlyPrice: 79, ctaLabel: "Contact Sales", features: [{ text: "Everything in Pro", included: true }, { text: "Custom components", included: true }, { text: "Dedicated support", included: true }] },
              ],
            },
          },
          {
            type: "cta",
            props: {
              headline: "Ready to ship faster?",
              subheadline: "Start building premium marketing sites with your own component library.",
              ctaLabel: "Get Started Free",
              secondaryLabel: "View Docs",
              variant: "gradient",
            },
          },
          {
            type: "faq",
            props: {
              headline: "Frequently Asked Questions",
              items: [
                { question: "How do I customize the tokens?", answer: "Override CSS custom properties. Change --color-brand-*, --radius-*, and the entire library adapts." },
                { question: "Is this an npm package?", answer: "No. Code-distribution model. Copy components, own the code, customize freely." },
                { question: "Does it support dark mode?", answer: "Yes. Add data-theme='dark' or .dark class to your root element." },
                { question: "Can I use it with Next.js?", answer: "Yes. All components include 'use client'. Works with transpilePackages or direct copy." },
              ],
            },
          },
          {
            type: "footer",
            props: {
              logo: "uilibrary",
              description: "A personal component library for premium marketing sites.",
              columns: [
                { title: "Product", links: [{ label: "Features", href: "#" }, { label: "Pricing", href: "#" }, { label: "Changelog", href: "#" }] },
                { title: "Resources", links: [{ label: "Docs", href: "#" }, { label: "Storybook", href: "#" }, { label: "GitHub", href: "#" }] },
              ],
              newsletter: true,
              bottomText: "\u00a9 2026 uilibrary. All rights reserved.",
            },
          },
        ],
      },
    ],
  },

  /* ─── Dark Purple ─────────────────────────────── */
  {
    id: "dark-purple",
    name: "Dark Purple",
    description: "Dark theme with purple accent. Mega menu, hero, features, testimonials & CTA.",
    theme: { font: "Space Grotesk", brandColor: "#8b5cf6", dark: true },
    pages: [
      {
        name: "Home",
        slug: "/",
        blocks: [
          {
            type: "navbarMegaMenu",
            props: {
              logo: "Brand",
              entries: [
                { label: "Products", items: [{ title: "Product One", description: "Full-featured platform.", href: "#" }, { title: "Product Two", description: "Simple and elegant.", href: "#" }] },
                { label: "Resources", items: [{ title: "Blog", description: "Latest news.", href: "#" }, { title: "Docs", description: "Technical guides.", href: "#" }] },
                { label: "Company", items: [{ title: "About", description: "Our story.", href: "#" }, { title: "Careers", description: "Join our team.", href: "#" }] },
              ],
              cta: { label: "Get Started", href: "#" },
            },
          },
          {
            type: "hero",
            props: {
              badge: "Now in Beta",
              headline: "Build premium marketing sites",
              highlightText: "in days, not weeks.",
              subheadline: "A personal component library with micro-interactions, scroll animations, and a design system that makes every project feel unique.",
              ctaLabel: "Start Building",
              secondaryLabel: "View Components",
            },
          },
          { type: "divider", props: { variant: "wave" } },
          {
            type: "featureGrid",
            props: {
              headline: "Everything you need",
              subheadline: "Premium components, animation presets, and a token-driven design system.",
              features: [
                { title: "Lightning Fast", description: "Compositor-friendly animations." },
                { title: "Accessible", description: "ARIA patterns built in." },
                { title: "Token-Driven", description: "10 CSS variables = new brand." },
                { title: "Composable", description: "Mix sections like building blocks." },
                { title: "Code Distribution", description: "Copy components, own the code." },
                { title: "Animation Doctrine", description: "Motion default, GSAP for scroll." },
              ],
              columns: 3,
            },
          },
          { type: "divider", props: { variant: "curve", flip: true } },
          {
            type: "testimonials",
            props: {
              headline: "Loved by developers",
              testimonials: [
                { quote: "Cut our build time from 2 weeks to 3 days.", author: "Sarah Chen", role: "Design Lead" },
                { quote: "The motion doctrine is genius.", author: "Marcus Johnson", role: "Freelance Dev" },
                { quote: "Accessibility built in, not bolted on.", author: "Emma Rodriguez", role: "CTO" },
              ],
              columns: 3,
            },
          },
          {
            type: "cta",
            props: {
              headline: "Ready to ship faster?",
              subheadline: "Start building premium marketing sites.",
              ctaLabel: "Get Started Free",
              secondaryLabel: "View Docs",
              variant: "gradient",
            },
          },
          {
            type: "footer",
            props: {
              logo: "Brand",
              description: "A component library for premium marketing sites.",
              columns: [
                { title: "Product", links: [{ label: "Features", href: "#" }, { label: "Pricing", href: "#" }] },
                { title: "Resources", links: [{ label: "Docs", href: "#" }, { label: "GitHub", href: "#" }] },
              ],
              bottomText: "\u00a9 2026 Brand. All rights reserved.",
            },
          },
        ],
      },
    ],
  },

  /* ─── Minimal Green ───────────────────────────── */
  {
    id: "minimal-green",
    name: "Minimal Green",
    description: "Clean light theme with green accent. Features, pricing & FAQ.",
    theme: { font: "DM Sans", brandColor: "#10b981", dark: false },
    pages: [
      {
        name: "Home",
        slug: "/",
        blocks: [
          {
            type: "navbar",
            props: {
              logo: "Brand",
              links: [
                { label: "Features", href: "#features" },
                { label: "Pricing", href: "#pricing" },
                { label: "FAQ", href: "#faq" },
              ],
              ctaLabel: "Get Started",
            },
          },
          {
            type: "hero",
            props: {
              badge: "Now in Beta",
              headline: "Build premium marketing sites",
              highlightText: "in days, not weeks.",
              subheadline: "A personal component library with micro-interactions, scroll animations, and a design system.",
              ctaLabel: "Start Building",
              secondaryLabel: "View Components",
            },
          },
          { type: "divider", props: { variant: "wave" } },
          {
            type: "featureGrid",
            props: {
              headline: "Everything you need",
              subheadline: "Premium components and a token-driven design system.",
              features: [
                { title: "Lightning Fast", description: "Compositor-friendly animations." },
                { title: "Accessible", description: "ARIA patterns built in." },
                { title: "Token-Driven", description: "10 CSS variables = new brand." },
              ],
              columns: 3,
            },
          },
          { type: "divider", props: { variant: "curve", flip: true } },
          {
            type: "pricingTable",
            props: {
              headline: "Simple, transparent pricing",
              subheadline: "Choose the plan that fits your workflow.",
              plans: [
                { name: "Starter", description: "For side projects", monthlyPrice: 0, yearlyPrice: 0, ctaLabel: "Get Started Free", features: [{ text: "5 components", included: true }, { text: "Basic animations", included: true }] },
                { name: "Pro", description: "For freelancers", monthlyPrice: 29, yearlyPrice: 23, popular: true, ctaLabel: "Start Pro", features: [{ text: "All components", included: true }, { text: "Premium animations", included: true }] },
                { name: "Enterprise", description: "For teams", monthlyPrice: 99, yearlyPrice: 79, ctaLabel: "Contact Sales", features: [{ text: "Everything in Pro", included: true }, { text: "Dedicated support", included: true }] },
              ],
            },
          },
          {
            type: "faq",
            props: {
              headline: "Frequently Asked Questions",
              items: [
                { question: "How do I customize the tokens?", answer: "Override CSS custom properties." },
                { question: "Does it support dark mode?", answer: "Yes. Add data-theme='dark' to your root." },
                { question: "Can I use it with Next.js?", answer: "Yes. All components include 'use client'." },
              ],
            },
          },
          {
            type: "footer",
            props: {
              logo: "Brand",
              description: "A component library for premium marketing sites.",
              columns: [
                { title: "Product", links: [{ label: "Features", href: "#" }, { label: "Pricing", href: "#" }] },
                { title: "Resources", links: [{ label: "Docs", href: "#" }, { label: "GitHub", href: "#" }] },
              ],
              bottomText: "\u00a9 2026 Brand. All rights reserved.",
            },
          },
        ],
      },
    ],
  },

  /* ─── Aave Pro ────────────────────────────────── */
  {
    id: "aave-pro",
    name: "Aave Pro",
    description: "DeFi product page with dark theme. Markets, borrow, swap, architecture & FAQ.",
    theme: { font: "Inter", brandColor: "#9898ff", dark: true },
    pages: [
      {
        name: "Home",
        slug: "/",
        blocks: [
          {
            type: "navbarMegaMenu",
            props: {
              logo: "Aave",
              logoHref: "https://aave.com",
              entries: [
                {
                  label: "Products",
                  items: [
                    { icon: "ghost", title: "Aave App", description: "Savings for everyone.", href: "#", accentColor: "#9898ff" },
                    { icon: "ghost", title: "Aave", description: "The original DeFi protocol.", href: "#", badge: "V3", external: true, accentColor: "#9898ff" },
                    { icon: "ghost", title: "Aave Pro", description: "The full power of DeFi.", href: "#", badge: "V4", accentColor: "#9898ff" },
                    { icon: "ghost", title: "Aave Kit", description: "Build with Aave.", href: "#", accentColor: "#6366F1" },
                  ],
                },
                {
                  label: "Resources",
                  items: [
                    { icon: "blog", title: "Blog", description: "The latest news and updates.", href: "#", accentColor: "#2196F3" },
                    { icon: "brand", title: "Brand", description: "Assets, examples and guides.", href: "#", accentColor: "#7C4DFF" },
                    { icon: "faq", title: "FAQ", description: "Answers to common questions.", href: "#", accentColor: "#FF7043" },
                    { icon: "helpSupport", title: "Help & Support", description: "Guides, articles and more.", href: "#", accentColor: "#26A69A" },
                    { icon: "governance", title: "Governance", description: "The Aave Governance forum.", href: "#", accentColor: "#5C6BC0" },
                  ],
                },
                {
                  label: "Developers",
                  items: [
                    { icon: "caseStudies", title: "Case Studies", description: "The best built on Aave.", href: "#", accentColor: "#0891B2" },
                    { icon: "documentation", title: "Documentation", description: "Technical guides for developers.", href: "#", accentColor: "#6366F1" },
                    { icon: "security", title: "Security", description: "Audit reports and information.", href: "#", accentColor: "#059669" },
                    { icon: "bugBounty", title: "Bug Bounty", description: "Report responsibly and get rewarded.", href: "#", accentColor: "#D97706" },
                  ],
                },
                {
                  label: "About",
                  items: [
                    { icon: "aaveLabs", title: "Aave Labs", description: "Learn about Aave Labs.", href: "#", accentColor: "#9898ff" },
                    { icon: "careers", title: "Careers", description: "Build the future of finance.", href: "#", accentColor: "#E879F9" },
                  ],
                },
              ],
              cta: {
                label: "Use Aave",
                href: "#",
                dropdown: [
                  { label: "Aave", badge: "V3", href: "https://app.aave.com", external: true },
                  { label: "Aave Pro", badge: "V4", href: "https://pro.aave.com", external: true },
                ],
              },
            },
          },
          { type: "heroAavePro", props: {} },
          { type: "aaveProMarkets", props: {} },
          { type: "aaveProBorrow", props: {} },
          { type: "aaveProSwap", props: {} },
          { type: "aaveProArchitecture", props: {} },
          { type: "aaveProFaq", props: {} },
          { type: "aaveProCtaFinal", props: {} },
          { type: "aaveProFooter", props: {} },
        ],
      },
    ],
  },
];
