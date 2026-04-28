import { useState, lazy, Suspense } from "react";
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

const NavbarMegaMenu = lazy(() =>
  import("@uilibrary/ui/components/navbar-mega-menu").then((m) => ({ default: m.NavbarMegaMenu }))
);

/* ─── Data ──────────────────────────────────────── */

const icon = (path: string) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
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
  { icon: icon("M13 2L3 14h9l-1 8 10-12h-9l1-8z"), title: "Lightning Fast", description: "Transform/opacity animations only. Compositor-friendly." },
  { icon: icon("M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"), title: "Accessible", description: "Radix Primitives. ARIA patterns. Keyboard navigation." },
  { icon: icon("M12 3v18M3 12h18"), title: "Token-Driven", description: "10 CSS variables = new brand. Light, dark, any palette." },
  { icon: icon("M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"), title: "Composable", description: "Mix sections like building blocks." },
  { icon: icon("M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z M22 6l-10 7L2 6"), title: "Code Distribution", description: "Copy components, own the code." },
  { icon: icon("M12 20V10 M18 20V4 M6 20v-4"), title: "Animation Doctrine", description: "Motion default, GSAP for scroll." },
];

const testimonials = [
  { quote: "Cut our build time from 2 weeks to 3 days.", author: "Sarah Chen", role: "Design Lead" },
  { quote: "First library where I keep the default animations.", author: "Marcus Johnson", role: "Freelance Dev" },
  { quote: "Accessibility built in, not bolted on.", author: "Emma Rodriguez", role: "CTO" },
];

const plans = [
  { name: "Starter", description: "For side projects", monthlyPrice: 0, yearlyPrice: 0, ctaLabel: "Get Started Free", features: [{ text: "5 components", included: true }, { text: "Basic animations", included: true }, { text: "Premium sections", included: false as const }] },
  { name: "Pro", description: "For freelancers", monthlyPrice: 29, yearlyPrice: 23, popular: true, ctaLabel: "Start Pro", features: [{ text: "All components", included: true }, { text: "Premium animations", included: true }, { text: "Premium sections", included: true }] },
  { name: "Enterprise", description: "For teams", monthlyPrice: 99, yearlyPrice: 79, ctaLabel: "Contact Sales", features: [{ text: "Everything in Pro", included: true }, { text: "Custom components", included: true }, { text: "Dedicated support", included: true }] },
];

const faqItems = [
  { question: "How do I customize the tokens?", answer: "Override CSS custom properties." },
  { question: "Is this an npm package?", answer: "No. Code-distribution model." },
  { question: "Does it support dark mode?", answer: "Yes. data-theme='dark'." },
  { question: "Can I use it with Next.js?", answer: "Yes. 'use client' on all components." },
];

const megaMenuEntries = [
  { label: "Products", content: <div style={{ padding: 8, display: "flex", flexDirection: "column" as const, gap: 8 }}><a href="#" style={{ display: "block", borderRadius: 8, background: "#2d2d3a", padding: 16, color: "#fff", textDecoration: "none" }}><div style={{ fontSize: 14, fontWeight: 600 }}>Product One</div></a></div> },
  { label: "Resources", items: [{ title: "Blog", description: "Latest news.", href: "#" }, { title: "Docs", description: "Technical guides.", href: "#" }] },
  { label: "Company", items: [{ title: "About", description: "Our story.", href: "#" }, { title: "Careers", description: "Join us.", href: "#" }] },
];

const FONTS = ["Inter", "DM Sans", "Space Grotesk", "Plus Jakarta Sans", "Outfit", "Manrope", "Instrument Sans", "Syne"];

/* ─── Builder Page ──────────────────────────────── */

export function BuilderPage() {
  const [header, setHeader] = useState<"simple" | "mega-menu">("simple");
  const [font, setFont] = useState("Inter");
  const [brandColor, setBrandColor] = useState("#3b82f6");
  const [dark, setDark] = useState(true);
  const [showFeatures, setShowFeatures] = useState(true);
  const [showTestimonials, setShowTestimonials] = useState(true);
  const [showPricing, setShowPricing] = useState(true);
  const [showCTA, setShowCTA] = useState(true);
  const [showFAQ, setShowFAQ] = useState(true);

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      {/* Controls panel */}
      <div style={{ width: 280, background: "#111113", borderRight: "1px solid rgba(255,255,255,0.06)", padding: 16, overflowY: "auto", flexShrink: 0 }}>
        <h2 style={{ fontSize: 14, fontWeight: 700, color: "#f4f4f4", marginBottom: 16 }}>Page Builder</h2>

        <Section title="Theme">
          <Label text="Font">
            <select value={font} onChange={(e) => setFont(e.target.value)} style={selectStyle}>
              {FONTS.map((f) => <option key={f} value={f}>{f}</option>)}
            </select>
          </Label>
          <Label text="Brand Color">
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <input type="color" value={brandColor} onChange={(e) => setBrandColor(e.target.value)} style={{ width: 32, height: 32, border: "none", borderRadius: 6, cursor: "pointer", background: "none" }} />
              <span style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", fontFamily: "monospace" }}>{brandColor}</span>
            </div>
          </Label>
          <Toggle label="Dark Mode" checked={dark} onChange={setDark} />
        </Section>

        <Section title="Header">
          <Label text="Style">
            <select value={header} onChange={(e) => setHeader(e.target.value as "simple" | "mega-menu")} style={selectStyle}>
              <option value="simple">Simple</option>
              <option value="mega-menu">Mega Menu</option>
            </select>
          </Label>
        </Section>

        <Section title="Sections">
          <Toggle label="Features" checked={showFeatures} onChange={setShowFeatures} />
          <Toggle label="Testimonials" checked={showTestimonials} onChange={setShowTestimonials} />
          <Toggle label="Pricing" checked={showPricing} onChange={setShowPricing} />
          <Toggle label="CTA" checked={showCTA} onChange={setShowCTA} />
          <Toggle label="FAQ" checked={showFAQ} onChange={setShowFAQ} />
        </Section>
      </div>

      {/* Preview */}
      <div style={{ flex: 1, overflowY: "auto" }}>
        <SiteTheme font={font} brandColor={brandColor} dark={dark}>
          <div style={{ background: "var(--color-bg)", minHeight: "100vh" }}>
            {header === "simple" ? (
              <Navbar logo="Arcane" links={navLinks} ctaLabel="Get Started" />
            ) : (
              <Suspense fallback={<div style={{ height: 80 }} />}>
                <NavbarMegaMenu
                  logo={<span style={{ fontSize: 18, fontWeight: 700, color: "var(--color-text)" }}>Arcane</span>}
                  entries={megaMenuEntries}
                  cta={{ label: "Get Started", href: "#" }}
                />
              </Suspense>
            )}

            <HeroSection
              badge="Now in Beta"
              headline="Build premium marketing sites"
              highlightText="in days, not weeks."
              subheadline="A component library with micro-interactions, scroll animations, and a design system."
              ctaLabel="Start Building"
              secondaryLabel="View Components"
            />

            {showFeatures && (
              <>
                <SectionDivider variant="wave" />
                <div style={{ background: "var(--color-bg-subtle)" }}>
                  <FeatureGrid headline="Everything you need" subheadline="Premium components and animation presets." features={features} columns={3} />
                </div>
                <SectionDivider variant="curve" flip color="var(--color-bg-subtle)" />
              </>
            )}

            {showTestimonials && <Testimonials headline="Loved by developers" testimonials={testimonials} columns={3} />}
            {showPricing && <PricingTable headline="Simple, transparent pricing" subheadline="Choose your plan." plans={plans} />}
            {showCTA && <CTASection headline="Ready to ship faster?" subheadline="Start building premium sites." ctaLabel="Get Started Free" secondaryLabel="View Docs" variant="gradient" />}
            {showFAQ && <FAQSection headline="Frequently Asked Questions" items={faqItems} />}

            <Footer
              logo="Arcane"
              description="A component library for premium marketing sites."
              columns={[
                { title: "Product", links: [{ label: "Features", href: "#" }, { label: "Pricing", href: "#" }] },
                { title: "Resources", links: [{ label: "Docs", href: "#" }, { label: "GitHub", href: "#" }] },
              ]}
              bottomText="&copy; 2026 Arcane. All rights reserved."
            />
          </div>
        </SiteTheme>
      </div>
    </div>
  );
}

/* ─── UI helpers ───────────────────────────────── */

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>{title}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>{children}</div>
    </div>
  );
}

function Label({ text, children }: { text: string; children: React.ReactNode }) {
  return (
    <div>
      <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginBottom: 4 }}>{text}</div>
      {children}
    </div>
  );
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label style={{ display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", padding: "4px 0" }}>
      <span style={{ fontSize: 13, color: "rgba(255,255,255,0.7)" }}>{label}</span>
      <div
        onClick={() => onChange(!checked)}
        style={{
          width: 36, height: 20, borderRadius: 10,
          background: checked ? "#3b82f6" : "rgba(255,255,255,0.1)",
          position: "relative", transition: "background 0.15s", cursor: "pointer",
        }}
      >
        <div style={{
          width: 16, height: 16, borderRadius: 8, background: "#fff",
          position: "absolute", top: 2,
          left: checked ? 18 : 2, transition: "left 0.15s",
        }} />
      </div>
    </label>
  );
}

const selectStyle: React.CSSProperties = {
  width: "100%", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: 6, padding: "6px 8px", color: "#f4f4f4", fontSize: 12, outline: "none",
};
