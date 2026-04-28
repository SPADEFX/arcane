import {
  Navbar,
  HeroSection,
  HeroAavePro,
  FeatureGrid,
  Testimonials,
  PricingTable,
  CTASection,
  FAQSection,
  Footer,
  SectionDivider,
  AaveProMarkets,
  AaveProBorrow,
  AaveProSwap,
  AaveProArchitecture,
  AaveProFAQ,
  AaveProCTAFinal,
  AaveProFooter,
} from "@uilibrary/ui";
import { NavbarMegaMenuWrapper } from "../builder-components/block-wrappers";
import type { BlockDefinition } from "./types";

export const blockDefinitions: BlockDefinition[] = [
  /* ─── Headers ──────────────────────────────────── */
  {
    type: "navbar",
    label: "Simple Navbar",
    category: "header",
    component: Navbar,
    defaultProps: {
      logo: "Brand",
      links: [
        { label: "Features", href: "#features" },
        { label: "Pricing", href: "#pricing" },
        { label: "About", href: "#about" },
      ],
      ctaLabel: "Get Started",
    },
    propSchema: [
      { key: "logo", label: "Logo Text", type: "text" },
      { key: "ctaLabel", label: "CTA Label", type: "text" },
      { key: "links", label: "Nav Links", type: "json" },
    ],
  },

  {
    type: "navbarMegaMenu",
    label: "Mega Menu Navbar",
    category: "header",
    component: NavbarMegaMenuWrapper,
    defaultProps: {
      logo: "Brand", // Will show Aave logo by default (wrapper logic)
      logoSrc: "",
      logoHref: "https://aave.com",
      entries: [
        {
          label: "Products",
          items: [
            {
              icon: "ghost",
              title: "Aave App",
              description: "Savings for everyone.",
              href: "#",
              accentColor: "#9898ff",
            },
            {
              icon: "ghost",
              title: "Aave",
              description: "The original DeFi protocol.",
              href: "https://app.aave.com",
              badge: "V3",
              external: true,
              accentColor: "#9898ff",
            },
            {
              icon: "ghost",
              title: "Aave Pro",
              description: "The full power of DeFi.",
              href: "#",
              badge: "V4",
              accentColor: "#9898ff",
            },
            {
              icon: "ghost",
              title: "Aave Kit",
              description: "Build with Aave.",
              href: "#",
              accentColor: "#6366F1",
            },
          ],
        },
        {
          label: "Resources",
          autoBadge: true,
          items: [
            {
              icon: "blog",
              title: "Blog",
              description: "The latest news and updates.",
              href: "#",
              badge: "new",
              accentColor: "#2196F3",
            },
            {
              icon: "brand",
              title: "Brand",
              description: "Assets, examples and guides.",
              href: "#",
              accentColor: "#7C4DFF",
            },
            {
              icon: "faq",
              title: "FAQ",
              description: "Answers to common questions.",
              href: "#",
              accentColor: "#FF7043",
            },
            {
              icon: "helpSupport",
              title: "Help & Support",
              description: "Guides, articles and more.",
              href: "#",
              accentColor: "#26A69A",
            },
            {
              icon: "governance",
              title: "Governance",
              description: "The Aave Governance forum.",
              href: "#",
              accentColor: "#5C6BC0",
            },
          ],
        },
        {
          label: "Developers",
          items: [
            {
              icon: "build",
              title: "Build",
              description: "Integrate Aave.",
              href: "#",
              accentColor: "#0D9488",
            },
            {
              icon: "caseStudies",
              title: "Case Studies",
              description: "The best build on Aave.",
              href: "#",
              accentColor: "#0891B2",
            },
            {
              icon: "documentation",
              title: "Documentation",
              description: "Technical guides for developers.",
              href: "#",
              accentColor: "#6366F1",
            },
            {
              icon: "security",
              title: "Security",
              description: "Audit reports and information.",
              href: "#",
              accentColor: "#059669",
            },
            {
              icon: "bugBounty",
              title: "Bug Bounty",
              description: "Report responsibly and get rewarded.",
              href: "#",
              accentColor: "#D97706",
            },
          ],
        },
        {
          label: "About",
          items: [
            {
              icon: "aaveLabs",
              title: "Aave Labs",
              description: "Learn about Aave Labs.",
              href: "#",
              accentColor: "#9898ff",
            },
            {
              icon: "careers",
              title: "Careers",
              description: "Build the future of finance.",
              href: "#",
              accentColor: "#E879F9",
            },
          ],
        },
        {
          label: "Security",
          href: "#",
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
    propSchema: [
      { key: "logo", label: "Logo Text", type: "text" },
      { key: "logoSrc", label: "Logo Image", type: "image" },
      { key: "logoHref", label: "Logo Link", type: "text" },
      { key: "entries", label: "Menu Entries", type: "json" },
      { key: "cta", label: "CTA Button", type: "json" },
    ],
  },

  /* ─── Heroes ───────────────────────────────────── */
  {
    type: "hero",
    label: "Hero Section",
    category: "hero",
    component: HeroSection,
    defaultProps: {
      badge: "Now in Beta",
      headline: "Build premium marketing sites",
      highlightText: "in days, not weeks.",
      subheadline:
        "A component library with micro-interactions, scroll animations, and a design system.",
      ctaLabel: "Start Building",
      secondaryLabel: "View Components",
    },
    propSchema: [
      { key: "badge", label: "Badge", type: "text" },
      { key: "headline", label: "Headline", type: "text" },
      { key: "highlightText", label: "Highlight Text", type: "text" },
      { key: "subheadline", label: "Subheadline", type: "textarea" },
      { key: "ctaLabel", label: "CTA Label", type: "text" },
      { key: "secondaryLabel", label: "Secondary CTA", type: "text" },
      { key: "gradient", label: "Show Gradient", type: "boolean", defaultValue: true },
    ],
  },

  {
    type: "heroAavePro",
    label: "Hero Aave Pro",
    category: "hero",
    component: HeroAavePro,
    defaultProps: {
      badge: "Aave Pro",
      headline: "The future of DeFi",
      subheadline:
        "The full power of Aave's lending markets. Deposit, borrow, and manage positions, your way.",
      ctaLabel: "Get Started",
      secondaryLabel: "Learn More",
    },
    propSchema: [
      { key: "badge", label: "Badge", type: "text" },
      { key: "headline", label: "Headline", type: "text" },
      { key: "subheadline", label: "Subheadline", type: "textarea" },
      { key: "ctaLabel", label: "CTA Label", type: "text" },
      { key: "ctaHref", label: "CTA Link", type: "text" },
      { key: "secondaryLabel", label: "Secondary CTA", type: "text" },
      { key: "secondaryHref", label: "Secondary Link", type: "text" },
      { key: "screenshotSrc", label: "Screenshot Image", type: "image" },
    ],
  },

  /* ─── Sections ─────────────────────────────────── */
  {
    type: "divider",
    label: "Section Divider",
    category: "section",
    component: SectionDivider,
    defaultProps: {
      variant: "wave",
    },
    propSchema: [
      {
        key: "variant",
        label: "Variant",
        type: "select",
        options: [
          { label: "Wave", value: "wave" },
          { label: "Curve", value: "curve" },
          { label: "Angle", value: "angle" },
          { label: "Zigzag", value: "zigzag" },
        ],
      },
      { key: "flip", label: "Flip", type: "boolean" },
      { key: "color", label: "Color", type: "text" },
    ],
  },
  {
    type: "featureGrid",
    label: "Feature Grid",
    category: "section",
    component: FeatureGrid,
    defaultProps: {
      headline: "Everything you need",
      subheadline: "Premium components and a token-driven design system.",
      features: [
        { title: "Fast", description: "Compositor-friendly animations." },
        { title: "Accessible", description: "ARIA patterns built in." },
        { title: "Token-Driven", description: "10 CSS variables = new brand." },
      ],
      columns: 3,
    },
    propSchema: [
      { key: "headline", label: "Headline", type: "text" },
      { key: "subheadline", label: "Subheadline", type: "textarea" },
      {
        key: "columns",
        label: "Columns",
        type: "select",
        options: [
          { label: "2 columns", value: "2" },
          { label: "3 columns", value: "3" },
          { label: "4 columns", value: "4" },
        ],
      },
      { key: "features", label: "Features", type: "json" },
    ],
  },
  {
    type: "testimonials",
    label: "Testimonials",
    category: "section",
    component: Testimonials,
    defaultProps: {
      headline: "Loved by developers",
      testimonials: [
        { quote: "Cut our build time from 2 weeks to 3 days.", author: "Sarah Chen", role: "Design Lead" },
        { quote: "The motion doctrine is genius.", author: "Marcus Johnson", role: "Freelance Dev" },
        { quote: "Accessibility built in, not bolted on.", author: "Emma Rodriguez", role: "CTO" },
      ],
      columns: 3,
    },
    propSchema: [
      { key: "headline", label: "Headline", type: "text" },
      {
        key: "columns",
        label: "Columns",
        type: "select",
        options: [
          { label: "2 columns", value: "2" },
          { label: "3 columns", value: "3" },
        ],
      },
      { key: "testimonials", label: "Testimonials", type: "json" },
    ],
  },
  {
    type: "pricingTable",
    label: "Pricing Table",
    category: "section",
    component: PricingTable,
    defaultProps: {
      headline: "Simple, transparent pricing",
      subheadline: "Choose the plan that fits your workflow.",
      plans: [
        { name: "Starter", description: "For side projects", monthlyPrice: 0, yearlyPrice: 0, ctaLabel: "Get Started Free", features: [{ text: "5 components", included: true }, { text: "Basic animations", included: true }] },
        { name: "Pro", description: "For freelancers", monthlyPrice: 29, yearlyPrice: 23, popular: true, ctaLabel: "Start Pro", features: [{ text: "All components", included: true }, { text: "Premium animations", included: true }] },
        { name: "Enterprise", description: "For teams", monthlyPrice: 99, yearlyPrice: 79, ctaLabel: "Contact Sales", features: [{ text: "Everything in Pro", included: true }, { text: "Dedicated support", included: true }] },
      ],
    },
    propSchema: [
      { key: "headline", label: "Headline", type: "text" },
      { key: "subheadline", label: "Subheadline", type: "textarea" },
      { key: "plans", label: "Plans", type: "json" },
    ],
  },
  {
    type: "cta",
    label: "CTA Section",
    category: "section",
    component: CTASection,
    defaultProps: {
      headline: "Ready to ship faster?",
      subheadline: "Start building premium marketing sites.",
      ctaLabel: "Get Started Free",
      secondaryLabel: "View Docs",
      variant: "gradient",
    },
    propSchema: [
      { key: "headline", label: "Headline", type: "text" },
      { key: "subheadline", label: "Subheadline", type: "textarea" },
      { key: "ctaLabel", label: "CTA Label", type: "text" },
      { key: "secondaryLabel", label: "Secondary CTA", type: "text" },
      {
        key: "variant",
        label: "Variant",
        type: "select",
        options: [
          { label: "Gradient", value: "gradient" },
          { label: "Solid", value: "solid" },
          { label: "Outline", value: "outline" },
        ],
      },
    ],
  },
  {
    type: "faq",
    label: "FAQ Section",
    category: "section",
    component: FAQSection,
    defaultProps: {
      headline: "Frequently Asked Questions",
      items: [
        { question: "How do I customize the tokens?", answer: "Override CSS custom properties." },
        { question: "Does it support dark mode?", answer: "Yes. Add data-theme='dark' to your root." },
        { question: "Can I use it with Next.js?", answer: "Yes. All components include 'use client'." },
      ],
    },
    propSchema: [
      { key: "headline", label: "Headline", type: "text" },
      { key: "subheadline", label: "Subheadline", type: "textarea" },
      { key: "items", label: "FAQ Items", type: "json" },
    ],
  },

  /* ─── Aave Pro Sections ────────────────────────── */
  {
    type: "aaveProMarkets",
    label: "Aave Pro Markets",
    category: "section",
    component: AaveProMarkets,
    defaultProps: {},
    propSchema: [
      { key: "label", label: "Label", type: "text" },
      { key: "heading", label: "Heading", type: "text" },
      { key: "description", label: "Description", type: "textarea" },
    ],
  },
  {
    type: "aaveProBorrow",
    label: "Aave Pro Borrow",
    category: "section",
    component: AaveProBorrow,
    defaultProps: {},
    propSchema: [
      { key: "label", label: "Label", type: "text" },
      { key: "heading", label: "Heading", type: "text" },
      { key: "description", label: "Description", type: "textarea" },
    ],
  },
  {
    type: "aaveProSwap",
    label: "Aave Pro Swap",
    category: "section",
    component: AaveProSwap,
    defaultProps: {},
    propSchema: [
      { key: "label", label: "Label", type: "text" },
      { key: "heading", label: "Heading", type: "text" },
      { key: "description", label: "Description", type: "textarea" },
      { key: "sellAmount", label: "Sell Amount", type: "text" },
      { key: "sellToken", label: "Sell Token", type: "text" },
      { key: "receiveAmount", label: "Receive Amount", type: "text" },
      { key: "receiveToken", label: "Receive Token", type: "text" },
    ],
  },
  {
    type: "aaveProArchitecture",
    label: "Aave Pro Architecture",
    category: "section",
    component: AaveProArchitecture,
    defaultProps: {},
    propSchema: [
      { key: "label", label: "Label", type: "text" },
      { key: "heading", label: "Heading", type: "text" },
      { key: "description", label: "Description", type: "textarea" },
      { key: "ctaLabel", label: "CTA Label", type: "text" },
      { key: "ctaHref", label: "CTA Link", type: "text" },
    ],
  },
  {
    type: "aaveProFaq",
    label: "Aave Pro FAQ",
    category: "section",
    component: AaveProFAQ,
    defaultProps: {},
    propSchema: [
      { key: "items", label: "FAQ Items", type: "json" },
      { key: "learnMoreHref", label: "Learn More Link", type: "text" },
    ],
  },
  {
    type: "aaveProCtaFinal",
    label: "Aave Pro CTA",
    category: "section",
    component: AaveProCTAFinal,
    defaultProps: {},
    propSchema: [
      { key: "title", label: "Title", type: "text" },
      { key: "description", label: "Description", type: "textarea" },
      { key: "ctaLabel", label: "CTA Label", type: "text" },
      { key: "ctaHref", label: "CTA Link", type: "text" },
    ],
  },

  /* ─── Footers ──────────────────────────────────── */
  {
    type: "aaveProFooter",
    label: "Aave Pro Footer",
    category: "footer",
    component: AaveProFooter,
    defaultProps: {},
    propSchema: [
      { key: "columns", label: "Footer Columns", type: "json" },
      { key: "disclaimer", label: "Disclaimer", type: "textarea" },
    ],
  },
  {
    type: "footer",
    label: "Footer",
    category: "footer",
    component: Footer,
    defaultProps: {
      logo: "Brand",
      description: "A component library for premium marketing sites.",
      columns: [
        { title: "Product", links: [{ label: "Features", href: "#" }, { label: "Pricing", href: "#" }] },
        { title: "Resources", links: [{ label: "Docs", href: "#" }, { label: "GitHub", href: "#" }] },
      ],
      bottomText: "\u00a9 2026 Brand. All rights reserved.",
    },
    propSchema: [
      { key: "logo", label: "Logo Text", type: "text" },
      { key: "description", label: "Description", type: "textarea" },
      { key: "bottomText", label: "Bottom Text", type: "text" },
      { key: "newsletter", label: "Show Newsletter", type: "boolean" },
      { key: "columns", label: "Footer Columns", type: "json" },
    ],
  },
];

export const blockMap = new Map(blockDefinitions.map((b) => [b.type, b]));
