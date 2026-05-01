import {
  Navbar,
  HeroSection,
  HeroSpotlight,
  HeroSplit,
  HeroBento,
  HeroAurora,
  HeroRotating,
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
  HeroBramble,
  HeroSeen,
  HeroAntimetal,
  HeroLinear,
  HeroFamily,
  Bento601,
  LandingSynthesis,
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
    type: "heroSpotlight",
    label: "Hero Spotlight",
    category: "hero",
    component: HeroSpotlight,
    defaultProps: {
      badge: "Version 2.0",
      headline: "The design system that ships",
      highlightText: "premium sites.",
      subheadline:
        "57 components, micro-interactions, scroll animations, and a token-driven design system.",
      ctaLabel: "Start Building",
      secondaryLabel: "View Components",
      screenshotSrc: "",
      dotGrid: true,
      floatingCards: true,
    },
    propSchema: [
      { key: "badge", label: "Badge", type: "text" },
      { key: "headline", label: "Headline", type: "text" },
      { key: "highlightText", label: "Highlight Text", type: "text" },
      { key: "subheadline", label: "Subheadline", type: "textarea" },
      { key: "ctaLabel", label: "CTA Label", type: "text" },
      { key: "ctaHref", label: "CTA Link", type: "text" },
      { key: "secondaryLabel", label: "Secondary CTA", type: "text" },
      { key: "secondaryHref", label: "Secondary Link", type: "text" },
      { key: "screenshotSrc", label: "Screenshot Image", type: "image" },
      { key: "dotGrid", label: "Dot Grid", type: "boolean", defaultValue: true },
      { key: "floatingCards", label: "Floating Cards", type: "boolean", defaultValue: true },
      { key: "logos", label: "Logo Bar", type: "json" },
    ],
  },

  {
    type: "heroSplit",
    label: "Hero Split",
    category: "hero",
    component: HeroSplit,
    defaultProps: {
      badge: "New in v3",
      headline: "Build premium marketing sites",
      highlightText: "in record time.",
      subheadline:
        "57 polished components with micro-interactions, scroll animations, and a design system that adapts to your brand.",
      ctaLabel: "Start Building",
      secondaryLabel: "View Library",
      reversed: false,
      features: [
        { text: "GPU-accelerated 60fps animations" },
        { text: "Dark + Light mode on every component" },
        { text: "Token-driven — rebrand with 10 CSS variables" },
      ],
      socialProof: "Join 5,000+ developers shipping faster",
    },
    propSchema: [
      { key: "badge", label: "Badge", type: "text" },
      { key: "headline", label: "Headline", type: "text" },
      { key: "highlightText", label: "Highlight Text", type: "text" },
      { key: "subheadline", label: "Subheadline", type: "textarea" },
      { key: "ctaLabel", label: "CTA Label", type: "text" },
      { key: "ctaHref", label: "CTA Link", type: "text" },
      { key: "secondaryLabel", label: "Secondary CTA", type: "text" },
      { key: "secondaryHref", label: "Secondary Link", type: "text" },
      { key: "imageSrc", label: "Right Image", type: "image" },
      { key: "reversed", label: "Reversed Layout", type: "boolean" },
      { key: "features", label: "Feature List", type: "json" },
      { key: "socialProof", label: "Social Proof Text", type: "text" },
      { key: "avatars", label: "Avatar URLs", type: "json" },
    ],
  },

  {
    type: "heroBento",
    label: "Hero Bento",
    category: "hero",
    component: HeroBento,
    defaultProps: {
      gradient: true,
    },
    propSchema: [
      { key: "gradient", label: "Background Gradient", type: "boolean", defaultValue: true },
      { key: "cells", label: "Grid Cells", type: "json" },
    ],
  },

  {
    type: "heroAurora",
    label: "Hero Aurora",
    category: "hero",
    component: HeroAurora,
    defaultProps: {
      headline: "The future of web",
      highlightText: "is here.",
      subheadline:
        "Build immersive digital experiences with GPU-accelerated animations and a design system that pushes boundaries.",
      ctaLabel: "Get Early Access",
      secondaryLabel: "Watch Demo",
      colorScheme: "blue",
      grain: true,
      statLine: "Trusted by 10,000+ developers worldwide",
    },
    propSchema: [
      { key: "headline", label: "Headline", type: "text" },
      { key: "highlightText", label: "Highlight Text", type: "text" },
      { key: "subheadline", label: "Subheadline", type: "textarea" },
      { key: "ctaLabel", label: "CTA Label", type: "text" },
      { key: "ctaHref", label: "CTA Link", type: "text" },
      { key: "secondaryLabel", label: "Secondary CTA", type: "text" },
      { key: "secondaryHref", label: "Secondary Link", type: "text" },
      {
        key: "colorScheme",
        label: "Color Scheme",
        type: "select",
        options: [
          { label: "Blue", value: "blue" },
          { label: "Purple", value: "purple" },
          { label: "Emerald", value: "emerald" },
          { label: "Rose", value: "rose" },
          { label: "Amber", value: "amber" },
        ],
      },
      { key: "grain", label: "Grain Overlay", type: "boolean", defaultValue: true },
      { key: "statLine", label: "Stat Line", type: "text" },
    ],
  },

  {
    type: "heroRotating",
    label: "Hero Rotating",
    category: "hero",
    component: HeroRotating,
    defaultProps: {
      badge: "Component Library",
      headlinePrefix: "Build websites that are",
      rotatingWords: ["faster", "premium", "accessible", "responsive", "beautiful"],
      subheadline:
        "57 components with micro-interactions, scroll animations, and a token-driven design system.",
      ctaLabel: "Start Building",
      secondaryLabel: "View Library",
      animation: "slide",
      interval: 2500,
      gradient: true,
    },
    propSchema: [
      { key: "badge", label: "Badge", type: "text" },
      { key: "headlinePrefix", label: "Headline Prefix", type: "text" },
      { key: "rotatingWords", label: "Rotating Words", type: "json" },
      { key: "headlineSuffix", label: "Headline Suffix", type: "text" },
      { key: "subheadline", label: "Subheadline", type: "textarea" },
      { key: "ctaLabel", label: "CTA Label", type: "text" },
      { key: "ctaHref", label: "CTA Link", type: "text" },
      { key: "secondaryLabel", label: "Secondary CTA", type: "text" },
      { key: "secondaryHref", label: "Secondary Link", type: "text" },
      {
        key: "animation",
        label: "Animation",
        type: "select",
        options: [
          { label: "Slide", value: "slide" },
          { label: "Fade", value: "fade" },
          { label: "Blur", value: "blur" },
          { label: "Flip", value: "flip" },
        ],
      },
      { key: "gradient", label: "Background Gradient", type: "boolean", defaultValue: true },
      { key: "logos", label: "Logo Bar", type: "json" },
    ],
  },

  /* ─── Refero-distilled heroes ─────────────────────── */
  {
    type: "heroBramble",
    label: "Hero Bramble",
    category: "hero",
    component: HeroBramble,
    defaultProps: {},
    propSchema: [
      { key: "preLabel", label: "Pre-label", type: "text" },
      { key: "headline", label: "Headline", type: "text" },
      { key: "italicWord", label: "Italic accent word", type: "text" },
      { key: "description", label: "Description", type: "textarea" },
      { key: "ctaLabel", label: "CTA Label", type: "text" },
      { key: "ctaHref", label: "CTA Link", type: "text" },
      { key: "secondaryLabel", label: "Secondary CTA", type: "text" },
      { key: "maxWidth", label: "Max Width (px)", type: "text" },
    ],
  },
  {
    type: "heroSeen",
    label: "Hero SEEN",
    category: "hero",
    component: HeroSeen,
    defaultProps: {},
    propSchema: [
      { key: "preLabel", label: "Pre-label", type: "text" },
      { key: "word", label: "Display word", type: "text" },
      { key: "description", label: "Description", type: "textarea" },
      { key: "ctaLabel", label: "CTA Label", type: "text" },
      { key: "ctaHref", label: "CTA Link", type: "text" },
    ],
  },
  {
    type: "heroAntimetal",
    label: "Hero Antimetal",
    category: "hero",
    component: HeroAntimetal,
    defaultProps: {},
    propSchema: [
      { key: "announcement", label: "Announcement text", type: "text" },
      { key: "announcementBadge", label: "Announcement badge", type: "text" },
      { key: "headline", label: "Headline", type: "text" },
      { key: "subheadline", label: "Subheadline", type: "textarea" },
      { key: "ctaLabel", label: "CTA Label", type: "text" },
      { key: "ctaHref", label: "CTA Link", type: "text" },
      { key: "secondaryLabel", label: "Secondary CTA", type: "text" },
      { key: "secondaryHref", label: "Secondary Link", type: "text" },
    ],
  },
  {
    type: "heroLinear",
    label: "Hero Linear",
    category: "hero",
    component: HeroLinear,
    defaultProps: {},
    propSchema: [
      { key: "version", label: "Version chip", type: "text" },
      { key: "versionNote", label: "Version note", type: "text" },
      { key: "headline", label: "Headline", type: "text" },
      { key: "subheadline", label: "Subheadline", type: "textarea" },
      { key: "ctaLabel", label: "CTA Label", type: "text" },
      { key: "secondaryLabel", label: "Secondary CTA", type: "text" },
    ],
  },
  {
    type: "heroFamily",
    label: "Hero Family",
    category: "hero",
    component: HeroFamily,
    defaultProps: {},
    propSchema: [
      { key: "preLabel", label: "Pre-label", type: "text" },
      { key: "headline", label: "Headline", type: "text" },
      { key: "highlightWord", label: "Highlight word", type: "text" },
      { key: "subheadline", label: "Subheadline", type: "textarea" },
      { key: "ctaLabel", label: "CTA Label", type: "text" },
    ],
  },
  {
    type: "bento601",
    label: "Bento 601",
    category: "hero",
    component: Bento601,
    defaultProps: {},
    propSchema: [
      { key: "number", label: "Display number", type: "text" },
      { key: "numberLabel", label: "Number label", type: "text" },
      { key: "manifesto", label: "Manifesto", type: "textarea" },
      { key: "ctaLabel", label: "CTA Label", type: "text" },
      { key: "imageA", label: "Photo A URL", type: "image" },
      { key: "imageB", label: "Photo B URL", type: "image" },
      { key: "stats", label: "Stats", type: "json" },
    ],
  },
  {
    type: "landingSynthesis",
    label: "Landing Synthesis (full page)",
    category: "hero",
    component: LandingSynthesis,
    defaultProps: {},
    propSchema: [],
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

// ─── Load extracted components from filesystem (source of truth) ───────
//
// Each extracted component has a sidecar JSON manifest with metadata
// (name, category, tags, propSchema, defaultProps, sourceUrl, etc.).
// We scan three globs: manifests (.json), html, css. Components without
// a manifest fall back to slug-derived defaults (legacy support).
//
// All files are committed to git → synced across machines automatically.
// Vite HMR re-runs the glob on file changes, so newly-extracted components
// appear after a page refresh.
import { createExtractedBlock } from "../builder-components/extracted-block";
import type { ExtractedManifest } from "@/types/extracted-manifest";

const fsHtml = import.meta.glob(
  "../../../ui-library/components/extracted-*.html",
  { query: "?raw", import: "default", eager: true },
) as Record<string, string>;

const fsCss = import.meta.glob(
  "../../../ui-library/components/extracted-*.css",
  { query: "?raw", import: "default", eager: true },
) as Record<string, string>;

const fsManifests = import.meta.glob(
  "../../../ui-library/components/extracted-*.json",
  { eager: true },
) as Record<string, { default: ExtractedManifest } | ExtractedManifest>;

function slugFromPath(p: string): string {
  const m = p.match(/extracted-([^/]+)\.(html|css|json)$/);
  return m ? m[1] : "";
}

function pascal(slug: string): string {
  return slug
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[-_]+/g, " ")
    .split(" ")
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}

function loadExtractedFromFs(): number {
  // Build slug-keyed lookups
  const htmlBySlug: Record<string, string> = {};
  const cssBySlug: Record<string, string> = {};
  const manifestBySlug: Record<string, ExtractedManifest> = {};
  for (const [p, content] of Object.entries(fsHtml)) htmlBySlug[slugFromPath(p)] = content;
  for (const [p, content] of Object.entries(fsCss)) cssBySlug[slugFromPath(p)] = content;
  for (const [p, mod] of Object.entries(fsManifests)) {
    const m = (mod as { default?: ExtractedManifest }).default ?? (mod as ExtractedManifest);
    if (m && typeof m === "object" && "slug" in m) manifestBySlug[slugFromPath(p)] = m;
  }

  // Union of all slugs found across html/manifest sources
  const slugs = new Set<string>([...Object.keys(htmlBySlug), ...Object.keys(manifestBySlug)]);

  let added = 0;
  for (const slug of slugs) {
    if (!slug) continue;
    const type = "extracted_" + slug;
    if (blockMap.has(type)) continue;

    const html = htmlBySlug[slug];
    const css = cssBySlug[slug] || "";
    if (!html) continue;

    const manifest = manifestBySlug[slug];

    const def: BlockDefinition = {
      type,
      label: manifest?.name || pascal(slug),
      category: "extracted" as BlockCategory,
      component: createExtractedBlock("", css, html),
      defaultProps: manifest?.defaultProps || {},
      propSchema: (manifest?.propSchema || []).map((p) => ({
        key: p.name,
        label: p.label,
        type: p.type === "image"
          ? "image"
          : p.type === "boolean"
          ? "boolean"
          : p.type === "textarea"
          ? "textarea"
          : "text",
      })),
    };
    blockDefinitions.push(def);
    blockMap.set(type, def);
    added++;
  }
  return added;
}

// Auto-load on module init — synchronous, runs once before any consumer.
loadExtractedFromFs();

// Public API kept for backward compat. Callers (builder.tsx, App.tsx) still
// invoke this to trigger a re-scan after a postMessage from Extract Tool.
// Vite HMR will have already updated the glob, so the re-scan picks up new
// files automatically.
export async function loadExtractedBlocks(): Promise<number> {
  return loadExtractedFromFs();
}
