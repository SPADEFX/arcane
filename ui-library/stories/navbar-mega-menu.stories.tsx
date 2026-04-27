import { lazy, Suspense } from "react";
import type { Meta, StoryObj } from "@storybook/react";

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

function Lazy({ children }: { children: React.ReactNode }) {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-12 text-[var(--color-muted)]">
          Loading…
        </div>
      }
    >
      {children}
    </Suspense>
  );
}

/* ═══════════════════════════════════════════════
   AAVE LOGO
   ═══════════════════════════════════════════════ */

function AaveLogo() {
  return (
    <svg width="94" viewBox="0 0 833 139" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Ghost logomark — arch */}
      <path d="M132.8 0C59.4497 0-.0192 60.6017.0000046 135.335H33.9264C33.9264 79.3281 77.8433 33.92 132.8 33.92C187.757 33.92 231.674 79.3281 231.674 135.335H265.6C265.613 60.6017 206.144 0 132.8 0Z" fill="#211d1d" />
      {/* Ghost eyes */}
      <circle cx="97.542" cy="111.518" r="27.015" fill="#211d1d" />
      <circle cx="168.149" cy="111.518" r="27.015" fill="#211d1d" />
      {/* "a" */}
      <path d="M359.33 138.737C321.391 138.737 291.631 108.19 291.631 70.641C291.631 33.0922 322.498 1.828 360.437 1.828C398.377 1.828 429.244 33.911 429.244 70.276V135.326H402.53V113.617L400.585 113.105C395.881 124.638 378.837 138.737 359.324 138.737H359.33ZM360.437 30.321C339.01 30.321 321.57 48.311 321.57 70.43C321.57 92.548 339.004 110.238 360.437 110.238C381.871 110.238 399.305 92.382 399.305 70.43C399.305 48.478 381.871 30.321 360.437 30.321Z" fill="#211d1d" />
      {/* "a" */}
      <path d="M505.473 138.737C467.533 138.737 437.773 108.19 437.773 70.641C437.773 33.0922 468.641 1.828 506.58 1.828C544.519 1.828 575.386 33.911 575.386 70.276V135.326H548.673V113.617L546.727 113.105C542.023 124.638 524.98 138.737 505.466 138.737H505.473ZM506.58 30.321C485.153 30.321 467.713 48.311 467.713 70.43C467.713 92.548 485.146 110.238 506.58 110.238C528.014 110.238 545.447 92.382 545.447 70.43C545.447 48.478 528.014 30.321 506.58 30.321Z" fill="#211d1d" />
      {/* "v" */}
      <path d="M620.231 135.311L565.402 5.25H595.399L635.585 101.058L675.777 5.25H705.767L650.945 135.311H620.231Z" fill="#211d1d" />
      {/* "e" */}
      <path d="M764.174 110.231C746.305 110.231 730.427 97.284 726.337 79.409H832.43C832.43 79.409 833 72.932 833 70.641C833 32.702 802.132 1.828 764.193 1.828C726.254 1.828 695.387 32.695 695.387 70.641C695.387 108.587 726.081 138.737 764.193 138.737C802.305 138.737 824.558 110.66 830.113 90.334H797.774C797.774 90.334 787.489 110.231 764.174 110.231ZM764.193 30.321C781.326 30.321 796.2 41.636 801.294 58.5H727.092C732.168 41.636 747.048 30.321 764.193 30.321Z" fill="#211d1d" />
    </svg>
  );
}

/* ═══════════════════════════════════════════════
   AAVE ICONS — gray when inactive, colored on hover
   Each returns an SVG that fits inside 24x24
   ═══════════════════════════════════════════════ */

/* ── Products ── */
function GhostIcon({ color = "#b0afad" }: { color?: string }) {
  return (
    <svg width="24" height="24" viewBox="0 0 266 139" fill="none">
      <path d="M132.8 0C59.45 0-.02 60.6.00001 135.335H33.926C33.926 79.328 77.843 33.92 132.8 33.92C187.757 33.92 231.674 79.328 231.674 135.335H265.6C265.613 60.602 206.144 0 132.8 0Z" fill={color} />
      <circle cx="97.542" cy="111.518" r="27.015" fill={color} />
      <circle cx="168.149" cy="111.518" r="27.015" fill={color} />
    </svg>
  );
}

/* ── Resources icons ── */
function BlogIcon({ color = "#b0afad" }: { color?: string }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <rect x="5" y="4" width="3.5" height="16" rx="1" fill={color} />
      <rect x="10.5" y="4" width="3.5" height="16" rx="1" fill={color} />
      <rect x="16" y="4" width="3.5" height="16" rx="1" fill={color} opacity="0.5" />
    </svg>
  );
}

function BrandIcon({ color = "#b0afad" }: { color?: string }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M4 16C4 11.6 7.6 8 12 8C16.4 8 20 11.6 20 16" stroke={color} strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M7 18C7 15.2 9.2 13 12 13C14.8 13 17 15.2 17 18" stroke={color} strokeWidth="3" strokeLinecap="round" fill="none" />
    </svg>
  );
}

function FaqIcon({ color = "#b0afad" }: { color?: string }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <rect x="4" y="5" width="16" height="5" rx="2.5" fill={color} />
      <rect x="4" y="14" width="12" height="5" rx="2.5" fill={color} opacity="0.6" />
    </svg>
  );
}

function HelpSupportIcon({ color = "#b0afad" }: { color?: string }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <rect x="4" y="6" width="16" height="3" rx="1.5" fill={color} />
      <rect x="4" y="11" width="12" height="3" rx="1.5" fill={color} opacity="0.7" />
      <rect x="4" y="16" width="8" height="3" rx="1.5" fill={color} opacity="0.4" />
    </svg>
  );
}

function GovernanceIcon({ color = "#b0afad" }: { color?: string }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M12 3L4 8H20L12 3Z" fill={color} />
      <rect x="6" y="9" width="2.5" height="8" rx="0.5" fill={color} />
      <rect x="10.75" y="9" width="2.5" height="8" rx="0.5" fill={color} />
      <rect x="15.5" y="9" width="2.5" height="8" rx="0.5" fill={color} />
      <rect x="4" y="18" width="16" height="2.5" rx="0.5" fill={color} />
    </svg>
  );
}

/* ── Developers icons ── */
function BuildIcon({ color = "#b0afad" }: { color?: string }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M12 4L5 8.5L12 13L19 8.5L12 4Z" fill={color} opacity="0.4" />
      <path d="M12 8L5 12.5L12 17L19 12.5L12 8Z" fill={color} opacity="0.7" />
      <path d="M12 12L5 16.5L12 21L19 16.5L12 12Z" fill={color} />
    </svg>
  );
}

function CaseStudiesIcon({ color = "#b0afad" }: { color?: string }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <rect x="4" y="3" width="16" height="18" rx="3" fill={color} opacity="0.3" />
      <rect x="7" y="7" width="5" height="2" rx="1" fill={color} />
      <rect x="7" y="11" width="10" height="2" rx="1" fill={color} opacity="0.6" />
      <rect x="7" y="15" width="8" height="2" rx="1" fill={color} opacity="0.4" />
    </svg>
  );
}

function DocumentationIcon({ color = "#b0afad" }: { color?: string }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M6 3C6 2.45 6.45 2 7 2H14L19 7V21C19 21.55 18.55 22 18 22H7C6.45 22 6 21.55 6 21V3Z" fill={color} opacity="0.3" />
      <path d="M14 2V7H19" fill={color} opacity="0.5" />
      <rect x="9" y="10" width="7" height="1.5" rx="0.75" fill={color} />
      <rect x="9" y="13" width="5" height="1.5" rx="0.75" fill={color} opacity="0.6" />
    </svg>
  );
}

function SecurityIcon({ color = "#b0afad" }: { color?: string }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M12 2L4 6V11C4 16.5 7.8 21.7 12 23C16.2 21.7 20 16.5 20 11V6L12 2Z" fill={color} opacity="0.3" />
      <path d="M10 12L11.5 13.5L15 10" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function BugBountyIcon({ color = "#b0afad" }: { color?: string }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <ellipse cx="12" cy="9" rx="8" ry="3" fill={color} opacity="0.3" />
      <ellipse cx="12" cy="14" rx="8" ry="3" fill={color} opacity="0.5" />
      <ellipse cx="12" cy="19" rx="8" ry="3" fill={color} opacity="0.3" />
    </svg>
  );
}

/* ── About icons ── */
function AaveLabsIcon({ color = "#b0afad" }: { color?: string }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M4 19C4 19 4 15 8 15H12L12 19" fill={color} opacity="0.4" />
      <path d="M12 19V15H16C20 15 20 19 20 19" fill={color} opacity="0.4" />
      <path d="M4 15L12 5L20 15" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

function CareersIcon({ color = "#b0afad" }: { color?: string }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="8" width="18" height="13" rx="2.5" fill={color} opacity="0.3" />
      <path d="M8 8V6C8 4.34 9.34 3 11 3H13C14.66 3 16 4.34 16 6V8" stroke={color} strokeWidth="2" />
      <rect x="3" y="12" width="18" height="3" fill={color} opacity="0.5" />
    </svg>
  );
}

/* ═══════════════════════════════════════════════
   GEOMETRIC CIRCLE ILLUSTRATIONS
   The Aave style: circles with a vertical split
   (left half darker, right half lighter) on a
   solid color background
   ═══════════════════════════════════════════════ */

function SplitCircle({
  cx,
  cy,
  r,
  colorDark,
  colorLight,
}: {
  cx: number;
  cy: number;
  r: number;
  colorDark: string;
  colorLight: string;
}) {
  return (
    <g>
      {/* Left half (darker) */}
      <path
        d={`M${cx},${cy - r} A${r},${r} 0 0,0 ${cx},${cy + r} V${cy - r} Z`}
        fill={colorDark}
      />
      {/* Right half (lighter) */}
      <path
        d={`M${cx},${cy - r} A${r},${r} 0 0,1 ${cx},${cy + r} V${cy - r} Z`}
        fill={colorLight}
      />
    </g>
  );
}

/** Derives dark/light variants from a hex color */
function colorVariants(hex: string) {
  // Parse hex
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  // Darker: multiply by 0.75
  const dark = `rgb(${Math.round(r * 0.75)}, ${Math.round(g * 0.75)}, ${Math.round(b * 0.75)})`;
  // Lighter: blend toward white by 0.55
  const light = `rgb(${Math.round(r + (255 - r) * 0.55)}, ${Math.round(g + (255 - g) * 0.55)}, ${Math.round(b + (255 - b) * 0.55)})`;
  return { dark, light };
}

function CircleIllustration({
  color,
  width = 256,
  height = 320,
  layout = "scatter",
}: {
  color: string;
  width?: number;
  height?: number;
  layout?: "scatter" | "row";
}) {
  const { dark, light } = colorVariants(color);
  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      style={{ display: "block", transition: "all 0.4s ease" }}
    >
      <rect width={width} height={height} fill={color}>
        <animate attributeName="fill" to={color} dur="0.4s" fill="freeze" />
      </rect>
      {layout === "row" ? (
        <>
          {/* Concentric rings */}
          <circle cx={70} cy={height / 2} r={60} fill="none" stroke={light} strokeWidth={24} />
          <circle cx={70} cy={height / 2} r={20} fill={light} />
          {/* Split circle */}
          <SplitCircle cx={190} cy={height / 2} r={55} colorDark={dark} colorLight={light} />
          {/* Small solid */}
          <circle cx={250} cy={height / 2 - 30} r={18} fill={dark} />
        </>
      ) : (
        <>
          {/* Large concentric rings (main focal point) */}
          <circle cx={160} cy={200} r={110} fill="none" stroke={light} strokeWidth={36} />
          <circle cx={160} cy={200} r={55} fill="none" stroke={dark} strokeWidth={20} />
          <circle cx={160} cy={200} r={20} fill={light} />
          {/* Split circle top-right */}
          <SplitCircle cx={240} cy={50} r={40} colorDark={dark} colorLight={light} />
          {/* Small solid bottom-left */}
          <circle cx={30} cy={height - 50} r={25} fill={dark} />
          {/* Small split bottom-right */}
          <SplitCircle cx={250} cy={height - 35} r={28} colorDark={dark} colorLight={light} />
        </>
      )}
    </svg>
  );
}

/* ═══════════════════════════════════════════════
   PRODUCT CARDS (custom content for Products dropdown)
   ═══════════════════════════════════════════════ */

function ProductCard({
  bg,
  children,
}: {
  bg: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href="#"
      style={{
        display: "block",
        position: "relative",
        borderRadius: 8,
        overflow: "hidden",
        background: bg,
        padding: 16,
        width: 356,
        height: 122,
        textDecoration: "none",
        transition: "opacity 0.2s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.opacity = "0.85";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.opacity = "1";
      }}
    >
      {children}
    </a>
  );
}

function ProductCards() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {/* Aave for Web — dark card */}
      <ProductCard bg="#2d2d3a">
        <svg
          width="140"
          height="140"
          viewBox="0 0 140 140"
          style={{ position: "absolute", top: 0, right: 0, opacity: 0.15 }}
        >
          <circle cx="100" cy="40" r="60" stroke="white" strokeWidth="1" fill="none" />
          <circle cx="100" cy="40" r="40" stroke="white" strokeWidth="1" fill="none" />
          <circle cx="100" cy="40" r="20" stroke="white" strokeWidth="1" fill="none" />
          <circle cx="100" cy="40" r="8" fill="white" opacity="0.8" />
        </svg>
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: 8,
            background: "rgba(255,255,255,0.12)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <GhostIcon color="#a0a0a0" />
        </div>
        <div style={{ position: "relative", zIndex: 1, marginTop: 12 }}>
          <div style={{ fontSize: 14, fontWeight: 600, lineHeight: "120%", letterSpacing: "0.1px", color: "#ffffff" }}>
            Aave for Web
          </div>
          <div style={{ fontSize: 14, fontWeight: 400, lineHeight: "150%", letterSpacing: "-0.09px", color: "rgba(255,255,255,0.6)", marginTop: 2 }}>
            The full power of DeFi.
          </div>
        </div>
      </ProductCard>

      {/* Aave App — purple/lavender card */}
      <ProductCard bg="#b8b4f0">
        <svg
          width="160"
          height="160"
          viewBox="0 0 160 160"
          style={{ position: "absolute", top: -20, right: -20, opacity: 0.3 }}
        >
          <circle cx="100" cy="80" r="70" stroke="white" strokeWidth="20" fill="none" />
          <circle cx="40" cy="120" r="30" fill="white" opacity="0.3" />
        </svg>
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: 8,
            background: "rgba(255,255,255,0.35)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <GhostIcon color="#7c7ce0" />
        </div>
        <div
          style={{
            position: "absolute",
            top: 20,
            right: 24,
            display: "flex",
            alignItems: "center",
            gap: 6,
            background: "rgba(255,255,255,0.75)",
            backdropFilter: "blur(8px)",
            borderRadius: 20,
            padding: "6px 14px",
            fontSize: 13,
            fontWeight: 500,
            color: "#4a4a6a",
          }}
        >
          <span style={{ fontWeight: 500 }}>New</span>
          <span style={{ color: "#9898ff", fontSize: 16 }}>·</span>
          <span>Get Early Access</span>
        </div>
        <div style={{ position: "relative", zIndex: 1, marginTop: 12 }}>
          <div style={{ fontSize: 14, fontWeight: 600, lineHeight: "120%", letterSpacing: "0.1px", color: "#2d2d3a" }}>
            Aave App
          </div>
          <div style={{ fontSize: 14, fontWeight: 400, lineHeight: "150%", letterSpacing: "-0.09px", color: "rgba(45,45,58,0.7)", marginTop: 2 }}>
            Savings for everyone.
          </div>
        </div>
      </ProductCard>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   STORY: Aave.com Navbar
   ═══════════════════════════════════════════════ */

export const AaveNavbar: StoryObj = {
  name: "Aave.com Navbar",
  render: () => (
    <Lazy>
      <div style={{ background: "#ffffff", minHeight: "100vh" }}>
        <NavbarMegaMenu
          logo={<AaveLogo />}
          logoHref="https://aave.com"
          entries={[
            /* ── Products (custom card content) ── */
            {
              label: "Products",
              content: <ProductCards />,
            },
            /* ── Resources ── */
            {
              label: "Resources",
              badge: <PingBadge />,
              defaultAccentColor: "#2196F3",
              items: [
                {
                  icon: <BlogIcon />,
                  iconActive: <BlogIcon color="#fff" />,
                  title: "Blog",
                  description: "The latest news and updates.",
                  href: "#",
                  accentColor: "#2196F3",
                },
                {
                  icon: <BrandIcon />,
                  iconActive: <BrandIcon color="#fff" />,
                  title: "Brand",
                  description: "Assets, examples and guides.",
                  href: "#",
                  accentColor: "#7C4DFF",
                },
                {
                  icon: <FaqIcon />,
                  iconActive: <FaqIcon color="#fff" />,
                  title: "FAQ",
                  description: "Answers to common questions.",
                  href: "#",
                  accentColor: "#FF7043",
                },
                {
                  icon: <HelpSupportIcon />,
                  iconActive: <HelpSupportIcon color="#fff" />,
                  title: "Help & Support",
                  description: "Guides, articles and more.",
                  href: "#",
                  accentColor: "#26A69A",
                },
                {
                  icon: <GovernanceIcon />,
                  iconActive: <GovernanceIcon color="#fff" />,
                  title: "Governance",
                  description: "The Aave Governance forum.",
                  href: "#",
                  accentColor: "#5C6BC0",
                },
              ],
              illustration: (color: string) => (
                <CircleIllustration color={color} width={256} height={320} />
              ),
            },
            /* ── Developers ── */
            {
              label: "Developers",
              defaultAccentColor: "#0D9488",
              items: [
                {
                  icon: <BuildIcon />,
                  iconActive: <BuildIcon color="#fff" />,
                  title: "Build",
                  description: "Integrate Aave.",
                  href: "#",
                  accentColor: "#0D9488",
                },
                {
                  icon: <CaseStudiesIcon />,
                  iconActive: <CaseStudiesIcon color="#fff" />,
                  title: "Case Studies",
                  description: "The best build on Aave.",
                  href: "#",
                  accentColor: "#0891B2",
                },
                {
                  icon: <DocumentationIcon />,
                  iconActive: <DocumentationIcon color="#fff" />,
                  title: "Documentation",
                  description: "Technical guides for developers.",
                  href: "#",
                  accentColor: "#6366F1",
                },
                {
                  icon: <SecurityIcon />,
                  iconActive: <SecurityIcon color="#fff" />,
                  title: "Security",
                  description: "Audit reports and information.",
                  href: "#",
                  accentColor: "#059669",
                },
                {
                  icon: <BugBountyIcon />,
                  iconActive: <BugBountyIcon color="#fff" />,
                  title: "Bug Bounty",
                  description: "Report responsibly and get rewarded.",
                  href: "#",
                  accentColor: "#D97706",
                },
              ],
              illustration: (color: string) => (
                <CircleIllustration color={color} width={256} height={320} />
              ),
            },
            /* ── About ── */
            {
              label: "About",
              defaultAccentColor: "#9898ff",
              items: [
                {
                  icon: <AaveLabsIcon />,
                  iconActive: <AaveLabsIcon color="#fff" />,
                  title: "Aave Labs",
                  description: "Learn about Aave Labs.",
                  href: "#",
                  accentColor: "#9898ff",
                },
                {
                  icon: <CareersIcon />,
                  iconActive: <CareersIcon color="#fff" />,
                  title: "Careers",
                  description: "Build the future of finance.",
                  href: "#",
                  accentColor: "#E879F9",
                },
              ],
              illustration: (color: string) => (
                <CircleIllustration color={color} width={256} height={192} layout="row" />
              ),
            },
            /* ── Security (plain link) ── */
            {
              label: "Security",
              href: "#",
            },
          ]}
          cta={{ label: "Get started", href: "#" }}
        />

        {/* Hero placeholder */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "80vh",
            gap: 16,
            padding: "0 48px",
          }}
        >
          <h1
            style={{
              fontSize: 56,
              fontWeight: 700,
              letterSpacing: "-1.5px",
              color: "#221d1d",
              fontFamily: "'Inter', system-ui, sans-serif",
              textAlign: "center",
              lineHeight: 1.1,
            }}
          >
            The liquidity protocol
          </h1>
          <p
            style={{
              fontSize: 18,
              color: "#636161",
              fontFamily: "'Inter', system-ui, sans-serif",
              textAlign: "center",
              maxWidth: 480,
            }}
          >
            Aave is a decentralized non-custodial liquidity markets protocol where users can
            participate as suppliers or borrowers.
          </p>
        </div>
      </div>
    </Lazy>
  ),
};

export const MinimalNavbar: StoryObj = {
  name: "Minimal (3 links + CTA)",
  render: () => (
    <Lazy>
      <div style={{ background: "#ffffff", minHeight: "50vh" }}>
        <NavbarMegaMenu
          logo={
            <div
              style={{
                fontSize: 20,
                fontWeight: 700,
                color: "#221d1d",
                fontFamily: "'Inter', sans-serif",
              }}
            >
              Acme
            </div>
          }
          entries={[
            {
              label: "Products",
              items: [
                { title: "Analytics", description: "Track your metrics", href: "#" },
                { title: "Insights", description: "AI-powered reports", href: "#" },
                { title: "Automation", description: "Streamline workflows", href: "#" },
              ],
            },
            { label: "Pricing", href: "#" },
            { label: "Docs", href: "#" },
          ]}
          cta={{ label: "Sign up", href: "#" }}
        />
      </div>
    </Lazy>
  ),
};

const meta: Meta = {
  title: "Headers/Mega Menu",
  parameters: { layout: "fullscreen" },
};

export default meta;
