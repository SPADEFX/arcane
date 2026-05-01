/**
 * Bootstrap — scans ui-library/ and populates the component registry.
 * Runs on app startup to ensure IndexedDB always reflects the filesystem.
 */
import type { ComponentDefinition, ComponentCategory } from "@/types/component-registry";
import * as db from "@/lib/db";
import { nanoid } from "nanoid";

// Map filename → metadata (name, category, description, tags)
// This is the source of truth for builtin component metadata.
const COMPONENT_META: Record<string, { name: string; category: ComponentCategory; desc: string; tags: string[]; isSection?: boolean }> = {
  // Components
  "accordion": { name: "Accordion", category: "interactive", desc: "Expandable content sections with smooth animation.", tags: ["accordion", "collapse", "radix"] },
  "aurora-background": { name: "Aurora Background", category: "background", desc: "Animated aurora borealis gradient background.", tags: ["aurora", "gradient", "animated", "background"] },
  "badge": { name: "Badge", category: "badge", desc: "Small status indicator label.", tags: ["badge", "label", "status"] },
  "bento-grid": { name: "Bento Grid", category: "layout", desc: "Responsive bento-style grid layout.", tags: ["bento", "grid", "layout"] },
  "button": { name: "Button", category: "interactive", desc: "Versatile button with multiple variants and sizes.", tags: ["button", "cta", "interactive"] },
  "card": { name: "Card", category: "card", desc: "Content container with border and shadow.", tags: ["card", "container"] },
  "dialog": { name: "Dialog", category: "interactive", desc: "Modal dialog with overlay.", tags: ["dialog", "modal", "radix"] },
  "dock": { name: "Dock", category: "navigation", desc: "macOS-style dock with magnetic hover effect.", tags: ["dock", "navigation", "magnetic"] },
  "gradient-mesh": { name: "Gradient Mesh", category: "background", desc: "Animated mesh gradient background.", tags: ["gradient", "mesh", "animated", "background"] },
  "grid-background": { name: "Grid Background", category: "background", desc: "Subtle grid pattern background.", tags: ["grid", "pattern", "background"] },
  "horizontal-scroll": { name: "Horizontal Scroll", category: "layout", desc: "Horizontal scroll container with scroll-snap.", tags: ["scroll", "horizontal", "layout"] },
  "image-reveal": { name: "Image Reveal", category: "interactive", desc: "Image with scroll-triggered reveal animation.", tags: ["image", "reveal", "scroll", "animation"] },
  "input": { name: "Input", category: "form", desc: "Styled text input field.", tags: ["input", "form", "text"] },
  "magnetic-button": { name: "Magnetic Button", category: "interactive", desc: "Button with magnetic cursor-following effect.", tags: ["magnetic", "button", "interactive", "cursor"] },
  "marquee": { name: "Marquee", category: "interactive", desc: "Infinite scrolling text/content marquee.", tags: ["marquee", "scroll", "infinite", "ticker"] },
  "navbar-mega-menu": { name: "Navbar Mega Menu", category: "navigation", desc: "Full-featured navigation bar with mega dropdown menus.", tags: ["navbar", "mega-menu", "navigation", "dropdown"] },
  "navbar": { name: "Navbar", category: "navigation", desc: "Simple navigation bar.", tags: ["navbar", "navigation", "header"] },
  "noise-overlay": { name: "Noise Overlay", category: "background", desc: "Subtle noise texture overlay.", tags: ["noise", "texture", "overlay"] },
  "parallax-layer": { name: "Parallax Layer", category: "interactive", desc: "Parallax scrolling layer.", tags: ["parallax", "scroll", "layer"] },
  "scroll-pin": { name: "Scroll Pin", category: "interactive", desc: "Pin element during scroll.", tags: ["scroll", "pin", "sticky"] },
  "scroll-reveal": { name: "Scroll Reveal", category: "interactive", desc: "Reveal content on scroll with animation.", tags: ["scroll", "reveal", "animation"] },
  "section-divider": { name: "Section Divider", category: "divider", desc: "Visual divider between sections.", tags: ["divider", "separator", "section"] },
  "site-theme": { name: "Site Theme", category: "layout", desc: "Theme provider with CSS variables.", tags: ["theme", "provider", "tokens"] },
  "skeleton": { name: "Skeleton", category: "interactive", desc: "Loading placeholder skeleton.", tags: ["skeleton", "loading", "placeholder"] },
  "smooth-scroll": { name: "Smooth Scroll", category: "layout", desc: "Smooth scroll wrapper with Lenis.", tags: ["scroll", "smooth", "lenis"] },
  "spotlight-card": { name: "Spotlight Card", category: "card", desc: "Card with cursor-following spotlight effect.", tags: ["spotlight", "card", "cursor", "glow"] },
  "text-blur-reveal": { name: "Text Blur Reveal", category: "text-animation", desc: "Text that reveals from a blur.", tags: ["text", "blur", "reveal", "animation"] },
  "text-counter": { name: "Text Counter", category: "text-animation", desc: "Animated number counter.", tags: ["counter", "number", "animation"] },
  "text-glitch": { name: "Text Glitch", category: "text-animation", desc: "Glitch distortion text effect.", tags: ["text", "glitch", "effect"] },
  "text-gradient-flow": { name: "Text Gradient Flow", category: "text-animation", desc: "Flowing gradient across text.", tags: ["text", "gradient", "flow", "animation"] },
  "text-highlight": { name: "Text Highlight", category: "text-animation", desc: "Animated text highlight effect.", tags: ["text", "highlight", "animation"] },
  "text-mask-reveal": { name: "Text Mask Reveal", category: "text-animation", desc: "Text revealed through a mask.", tags: ["text", "mask", "reveal"] },
  "text-pull-up": { name: "Text Pull Up", category: "text-animation", desc: "Text that pulls up into view.", tags: ["text", "pull", "animation"] },
  "text-reveal": { name: "Text Reveal", category: "text-animation", desc: "Character-by-character text reveal.", tags: ["text", "reveal", "animation"] },
  "text-rotate": { name: "Text Rotate", category: "text-animation", desc: "Rotating text with multiple words.", tags: ["text", "rotate", "animation"] },
  "text-scramble": { name: "Text Scramble", category: "text-animation", desc: "Scrambled text decode effect.", tags: ["text", "scramble", "decode"] },
  "text-scroll-reveal": { name: "Text Scroll Reveal", category: "text-animation", desc: "Text revealed on scroll progress.", tags: ["text", "scroll", "reveal"] },
  "text-spring-chars": { name: "Text Spring Chars", category: "text-animation", desc: "Spring-animated characters.", tags: ["text", "spring", "characters"] },
  "text-typewriter": { name: "Text Typewriter", category: "text-animation", desc: "Typewriter typing effect.", tags: ["text", "typewriter", "typing"] },
  "text-wave": { name: "Text Wave", category: "text-animation", desc: "Wave animation across text characters.", tags: ["text", "wave", "animation"] },
  "tilt-card": { name: "Tilt Card", category: "card", desc: "Card that tilts following the cursor.", tags: ["tilt", "card", "3d", "cursor"] },

  // Sections
  "hero-section": { name: "Hero Section", category: "hero", desc: "Landing page hero with headline, CTA, and animations.", tags: ["hero", "landing", "cta"], isSection: true },
  "hero-aave-pro": { name: "Hero Aave Pro", category: "hero", desc: "Premium hero section inspired by Aave.", tags: ["hero", "aave", "premium"], isSection: true },
  "cta-section": { name: "CTA Section", category: "cta", desc: "Call-to-action section with headline and button.", tags: ["cta", "action", "button"], isSection: true },
  "faq-section": { name: "FAQ Section", category: "faq", desc: "Frequently asked questions with accordion.", tags: ["faq", "questions", "accordion"], isSection: true },
  "feature-grid": { name: "Feature Grid", category: "features", desc: "Grid of feature cards with icons.", tags: ["features", "grid", "cards"], isSection: true },
  "footer": { name: "Footer", category: "footer", desc: "Site footer with links and branding.", tags: ["footer", "links", "bottom"], isSection: true },
  "pricing-table": { name: "Pricing Table", category: "pricing", desc: "Pricing plans comparison table.", tags: ["pricing", "plans", "table"], isSection: true },
  "testimonials": { name: "Testimonials", category: "testimonials", desc: "Customer testimonials carousel.", tags: ["testimonials", "reviews", "social-proof"], isSection: true },
  "aave-pro-architecture": { name: "Architecture Section", category: "section", desc: "Technical architecture overview.", tags: ["architecture", "tech", "aave"], isSection: true },
  "aave-pro-borrow": { name: "Borrow Section", category: "section", desc: "Borrowing interface showcase.", tags: ["borrow", "defi", "aave"], isSection: true },
  "aave-pro-cta-final": { name: "Final CTA", category: "cta", desc: "Final call-to-action section.", tags: ["cta", "final", "aave"], isSection: true },
  "aave-pro-faq": { name: "Pro FAQ", category: "faq", desc: "FAQ section for Aave Pro.", tags: ["faq", "aave", "pro"], isSection: true },
  "aave-pro-footer": { name: "Pro Footer", category: "footer", desc: "Premium footer for Aave Pro.", tags: ["footer", "aave", "premium"], isSection: true },
  "aave-pro-markets": { name: "Markets Section", category: "section", desc: "Market data display section.", tags: ["markets", "data", "defi"], isSection: true },
  "aave-pro-swap": { name: "Swap Section", category: "section", desc: "Token swap interface section.", tags: ["swap", "trading", "defi"], isSection: true },
  "aave-pro-word-reveal": { name: "Word Reveal", category: "text-animation", desc: "Scroll-driven word reveal.", tags: ["text", "reveal", "scroll"], isSection: true },

  // Refero-distilled heroes (built from styles.refero.design DESIGN.md sources)
  "hero-bramble": { name: "Hero Bramble", category: "hero", desc: "Light cream hero with hand-drawn illustrated characters. Generated imagery from Gemini Nano Banana.", tags: ["hero", "cream", "illustrated", "warm", "playful"], isSection: true },
  "hero-seen": { name: "Hero SEEN", category: "hero", desc: "Dreamy lavender gradient hero with sparkle accents. Built from SEEN's DESIGN.md.", tags: ["hero", "dreamy", "gradient", "playful"], isSection: true },
  "hero-antimetal": { name: "Hero Antimetal", category: "hero", desc: "Dark navy hero with chartreuse CTA and dot-matrix globe. Serif display × sans UI.", tags: ["hero", "dark", "infrastructure", "saas"], isSection: true },
  "hero-linear": { name: "Hero Linear", category: "hero", desc: "Pitch-black command-center hero with neon lime accent and dashboard preview.", tags: ["hero", "dark", "linear", "saas", "compact"], isSection: true },
  "hero-family": { name: "Hero Family", category: "hero", desc: "Cream Pixar-storyboard hero with wobbly blob characters in primary colors.", tags: ["hero", "cream", "playful", "fintech"], isSection: true },
  "bento-601": { name: "Bento 601", category: "hero", desc: "Architectural bento built from 601 Inc.'s DESIGN.md — gold on midnight matte.", tags: ["bento", "dark", "editorial", "cinematic"], isSection: true },
  "landing-synthesis": { name: "Landing Synthesis", category: "hero", desc: "Full-page synthesis of 5 DESIGN.md references (601 + SEEN + Antimetal + Linear + Family).", tags: ["landing", "synthesis", "demo"], isSection: true },
};

export async function bootstrapRegistry(): Promise<number> {
  const existing = await db.getAll<ComponentDefinition>("components");
  const existingSlugs = new Set(existing.filter(c => c.source.type === "builtin").map(c => c.slug));

  let added = 0;

  for (const [slug, meta] of Object.entries(COMPONENT_META)) {
    if (existingSlugs.has(slug)) continue;

    const isSection = meta.isSection ?? false;
    const folder = isSection ? "sections" : "components";
    const path = `ui-library/${folder}/${slug}.tsx`;

    const comp: ComponentDefinition = {
      id: nanoid(),
      slug,
      name: meta.name,
      description: meta.desc,
      category: meta.category,
      source: { type: "builtin", path },
      props: [], // Will be populated later by prop parser
      defaultProps: {},
      tags: meta.tags,
      isSection,
      acceptsChildren: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    await db.put("components", comp);
    added++;
  }

  return added;
}
