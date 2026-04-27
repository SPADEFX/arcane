import { NavbarMegaMenu, type NavMegaMenuEntry, PingBadge } from "@uilibrary/ui";

/* ─── Icon Components ────────────────────────────── */

// Simple icon components that match the Aave design
function ChartIcon({ active }: { active?: boolean }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path
        d="M18 20V10M12 20V4M6 20V14"
        stroke={active ? "#fff" : "currentColor"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LayersIcon({ active }: { active?: boolean }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 2L2 7L12 12L22 7L12 2Z"
        stroke={active ? "#fff" : "currentColor"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2 17L12 22L22 17"
        stroke={active ? "#fff" : "currentColor"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2 12L12 17L22 12"
        stroke={active ? "#fff" : "currentColor"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function BookIcon({ active }: { active?: boolean }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path
        d="M4 19.5C4 18.837 4.26339 18.2011 4.73223 17.7322C5.20107 17.2634 5.83696 17 6.5 17H20"
        stroke={active ? "#fff" : "currentColor"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.5 2H20V22H6.5C5.83696 22 5.20107 21.7366 4.73223 21.2678C4.26339 20.7989 4 20.163 4 19.5V4.5C4 3.83696 4.26339 3.20107 4.73223 2.73223C5.20107 2.26339 5.83696 2 6.5 2Z"
        stroke={active ? "#fff" : "currentColor"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function FileIcon({ active }: { active?: boolean }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path
        d="M13 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V9L13 2Z"
        stroke={active ? "#fff" : "currentColor"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13 2V9H20"
        stroke={active ? "#fff" : "currentColor"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// Aave icons from Storybook
function GhostIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 266 139" fill="none">
      <path d="M132.8 0C59.45 0-.02 60.6.00001 135.335H33.926C33.926 79.328 77.843 33.92 132.8 33.92C187.757 33.92 231.674 79.328 231.674 135.335H265.6C265.613 60.602 206.144 0 132.8 0Z" fill="currentColor" />
      <circle cx="97.542" cy="111.518" r="27.015" fill="currentColor" />
      <circle cx="168.149" cy="111.518" r="27.015" fill="currentColor" />
    </svg>
  );
}

function BlogIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <rect x="5" y="4" width="3.5" height="16" rx="1" fill="currentColor" />
      <rect x="10.5" y="4" width="3.5" height="16" rx="1" fill="currentColor" />
      <rect x="16" y="4" width="3.5" height="16" rx="1" fill="currentColor" opacity="0.5" />
    </svg>
  );
}

function BrandIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M4 16C4 11.6 7.6 8 12 8C16.4 8 20 11.6 20 16" stroke="currentColor" strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M7 18C7 15.2 9.2 13 12 13C14.8 13 17 15.2 17 18" stroke="currentColor" strokeWidth="3" strokeLinecap="round" fill="none" />
    </svg>
  );
}

function FaqIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <rect x="4" y="5" width="16" height="5" rx="2.5" fill="currentColor" />
      <rect x="4" y="14" width="12" height="5" rx="2.5" fill="currentColor" opacity="0.6" />
    </svg>
  );
}

function HelpSupportIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <rect x="4" y="6" width="16" height="3" rx="1.5" fill="currentColor" />
      <rect x="4" y="11" width="12" height="3" rx="1.5" fill="currentColor" opacity="0.7" />
      <rect x="4" y="16" width="8" height="3" rx="1.5" fill="currentColor" opacity="0.4" />
    </svg>
  );
}

function GovernanceIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M12 3L4 8H20L12 3Z" fill="currentColor" />
      <rect x="6" y="9" width="2.5" height="8" rx="0.5" fill="currentColor" />
      <rect x="10.75" y="9" width="2.5" height="8" rx="0.5" fill="currentColor" />
      <rect x="15.5" y="9" width="2.5" height="8" rx="0.5" fill="currentColor" />
      <rect x="4" y="18" width="16" height="2.5" rx="0.5" fill="currentColor" />
    </svg>
  );
}

function BuildIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M12 4L5 8.5L12 13L19 8.5L12 4Z" fill="currentColor" opacity="0.4" />
      <path d="M12 8L5 12.5L12 17L19 12.5L12 8Z" fill="currentColor" opacity="0.7" />
      <path d="M12 12L5 16.5L12 21L19 16.5L12 12Z" fill="currentColor" />
    </svg>
  );
}

function CaseStudiesIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <rect x="4" y="3" width="16" height="18" rx="3" fill="currentColor" opacity="0.3" />
      <rect x="7" y="7" width="5" height="2" rx="1" fill="currentColor" />
      <rect x="7" y="11" width="10" height="2" rx="1" fill="currentColor" opacity="0.6" />
      <rect x="7" y="15" width="8" height="2" rx="1" fill="currentColor" opacity="0.4" />
    </svg>
  );
}

function DocumentationIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M6 3C6 2.45 6.45 2 7 2H14L19 7V21C19 21.55 18.55 22 18 22H7C6.45 22 6 21.55 6 21V3Z" fill="currentColor" opacity="0.3" />
      <path d="M14 2V7H19" fill="currentColor" opacity="0.5" />
      <rect x="9" y="10" width="7" height="1.5" rx="0.75" fill="currentColor" />
      <rect x="9" y="13" width="5" height="1.5" rx="0.75" fill="currentColor" opacity="0.6" />
    </svg>
  );
}

function SecurityIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M12 2L4 6V11C4 16.5 7.8 21.7 12 23C16.2 21.7 20 16.5 20 11V6L12 2Z" fill="currentColor" opacity="0.3" />
      <path d="M10 12L11.5 13.5L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function BugBountyIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <ellipse cx="12" cy="9" rx="8" ry="3" fill="currentColor" opacity="0.3" />
      <ellipse cx="12" cy="14" rx="8" ry="3" fill="currentColor" opacity="0.5" />
      <ellipse cx="12" cy="19" rx="8" ry="3" fill="currentColor" opacity="0.3" />
    </svg>
  );
}

function AaveLabsIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M4 19C4 19 4 15 8 15H12L12 19" fill="currentColor" opacity="0.4" />
      <path d="M12 19V15H16C20 15 20 19 20 19" fill="currentColor" opacity="0.4" />
      <path d="M4 15L12 5L20 15" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

function CareersIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="8" width="18" height="13" rx="2.5" fill="currentColor" opacity="0.3" />
      <path d="M8 8V6C8 4.34 9.34 3 11 3H13C14.66 3 16 4.34 16 6V8" stroke="currentColor" strokeWidth="2" />
      <rect x="3" y="12" width="18" height="3" fill="currentColor" opacity="0.5" />
    </svg>
  );
}

const iconMap = {
  chart: ChartIcon,
  layers: LayersIcon,
  book: BookIcon,
  file: FileIcon,
  ghost: GhostIcon,
  blog: BlogIcon,
  brand: BrandIcon,
  faq: FaqIcon,
  helpSupport: HelpSupportIcon,
  governance: GovernanceIcon,
  build: BuildIcon,
  caseStudies: CaseStudiesIcon,
  documentation: DocumentationIcon,
  security: SecurityIcon,
  bugBounty: BugBountyIcon,
  aaveLabs: AaveLabsIcon,
  careers: CareersIcon,
};

/* ─── Styled Badge Components ────────────────────── */

function V3Badge() {
  return (
    <span
      style={{
        fontSize: 11,
        fontWeight: 500,
        padding: "3px 8px",
        borderRadius: 4,
        background: "color-mix(in srgb, var(--color-text) 8%, transparent)",
        color: "var(--color-text)",
      }}
    >
      V3
    </span>
  );
}

function V4Badge() {
  return (
    <span
      style={{
        fontSize: 11,
        fontWeight: 500,
        padding: "3px 8px",
        borderRadius: 4,
        background: "#9898ff",
        color: "#fff",
      }}
    >
      V4
    </span>
  );
}

/* ─── Illustration Components ────────────────────── */

function ProductsIllustration({ accentColor }: { accentColor: string }) {
  return (
    <div
      style={{
        width: 280,
        height: 200,
        background: `linear-gradient(135deg, ${accentColor}15 0%, ${accentColor}05 100%)`,
        borderRadius: 8,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          width: 120,
          height: 120,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${accentColor}20 0%, transparent 70%)`,
        }}
      />
    </div>
  );
}

function ResourcesIllustration({ accentColor }: { accentColor: string }) {
  return (
    <div
      style={{
        width: 280,
        height: 200,
        background: `linear-gradient(135deg, ${accentColor}15 0%, ${accentColor}05 100%)`,
        borderRadius: 8,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          width: 100,
          height: 100,
          background: `${accentColor}15`,
          borderRadius: 8,
          transform: "rotate(45deg)",
        }}
      />
    </div>
  );
}

const illustrationMap = {
  products: ProductsIllustration,
  resources: ResourcesIllustration,
};

/* ─── Product Cards (Aave-style) ─────────────────── */

function GhostLogomark({ color = "#a0a0a0" }: { color?: string }) {
  return (
    <svg width="24" height="24" viewBox="0 0 266 139" fill="none">
      <path d="M132.8 0C59.45 0-.02 60.6.00001 135.335H33.926C33.926 79.328 77.843 33.92 132.8 33.92C187.757 33.92 231.674 79.328 231.674 135.335H265.6C265.613 60.602 206.144 0 132.8 0Z" fill={color} />
      <circle cx="97.542" cy="111.518" r="27.015" fill={color} />
      <circle cx="168.149" cy="111.518" r="27.015" fill={color} />
    </svg>
  );
}

function ProductCard({ bg, children }: { bg: string; children: React.ReactNode }) {
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
          <GhostLogomark color="#a0a0a0" />
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
          <GhostLogomark color="#7c7ce0" />
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

/* ─── NavbarMegaMenu Wrapper ─────────────────────── */

interface NavbarMegaMenuWrapperProps {
  logoSrc?: string;
  logo?: string;
  logoHref?: string;
  entries: Array<{
    label: string;
    href?: string;
    autoBadge?: boolean; // Show badge on category if any item has badge
    items?: Array<{
      icon?: keyof typeof iconMap;
      title: string;
      description?: string;
      href: string;
      badge?: "new" | "V3" | "V4"; // Badge type
      accentColor?: string;
      external?: boolean; // Show external arrow
    }>;
  }>;
  cta?: { label: string; href: string };
}

export function NavbarMegaMenuWrapper({
  logoSrc,
  logo,
  logoHref,
  entries,
  cta,
}: NavbarMegaMenuWrapperProps) {
  // Convert logo - default to Aave logo from Storybook if no custom logo/image provided
  const defaultAaveLogo = () => (
    <svg width="94" viewBox="0 0 833 139" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M132.8 0C59.4497 0-.0192 60.6017.0000046 135.335H33.9264C33.9264 79.3281 77.8433 33.92 132.8 33.92C187.757 33.92 231.674 79.3281 231.674 135.335H265.6C265.613 60.6017 206.144 0 132.8 0Z" fill="currentColor" />
      <circle cx="97.542" cy="111.518" r="27.015" fill="currentColor" />
      <circle cx="168.149" cy="111.518" r="27.015" fill="currentColor" />
      <path d="M359.33 138.737C321.391 138.737 291.631 108.19 291.631 70.641C291.631 33.0922 322.498 1.828 360.437 1.828C398.377 1.828 429.244 33.911 429.244 70.276V135.326H402.53V113.617L400.585 113.105C395.881 124.638 378.837 138.737 359.324 138.737H359.33ZM360.437 30.321C339.01 30.321 321.57 48.311 321.57 70.43C321.57 92.548 339.004 110.238 360.437 110.238C381.871 110.238 399.305 92.382 399.305 70.43C399.305 48.478 381.871 30.321 360.437 30.321Z" fill="currentColor" />
      <path d="M505.473 138.737C467.533 138.737 437.773 108.19 437.773 70.641C437.773 33.0922 468.641 1.828 506.58 1.828C544.519 1.828 575.386 33.911 575.386 70.276V135.326H548.673V113.617L546.727 113.105C542.023 124.638 524.98 138.737 505.466 138.737H505.473ZM506.58 30.321C485.153 30.321 467.713 48.311 467.713 70.43C467.713 92.548 485.146 110.238 506.58 110.238C528.014 110.238 545.447 92.382 545.447 70.43C545.447 48.478 528.014 30.321 506.58 30.321Z" fill="currentColor" />
      <path d="M620.231 135.311L565.402 5.25H595.399L635.585 101.058L675.777 5.25H705.767L650.945 135.311H620.231Z" fill="currentColor" />
      <path d="M764.174 110.231C746.305 110.231 730.427 97.284 726.337 79.409H832.43C832.43 79.409 833 72.932 833 70.641C833 32.702 802.132 1.828 764.193 1.828C726.254 1.828 695.387 32.695 695.387 70.641C695.387 108.587 726.081 138.737 764.193 138.737C802.305 138.737 824.558 110.66 830.113 90.334H797.774C797.774 90.334 787.489 110.231 764.174 110.231ZM764.193 30.321C781.326 30.321 796.2 41.636 801.294 58.5H727.092C732.168 41.636 747.048 30.321 764.193 30.321Z" fill="currentColor" />
    </svg>
  );

  const shouldShowImage = logoSrc || !logo || logo === "Brand" || logo === "Aave";

  const logoNode = shouldShowImage ? (
    logoSrc ? (
      <img
        src={logoSrc}
        alt="Logo"
        style={{ height: 32, maxWidth: 120, objectFit: "contain" }}
      />
    ) : defaultAaveLogo()
  ) : (
    <span
      style={{
        fontSize: 18,
        fontWeight: 600,
        letterSpacing: "-0.02em",
        color: "var(--color-text)",
      }}
    >
      {logo}
    </span>
  );

  // Convert entries
  const enrichedEntries: NavMegaMenuEntry[] = entries.map((entry) => {
    // Simple link
    if (entry.href && !entry.items) {
      return {
        label: entry.label,
        href: entry.href,
      };
    }

    // Dropdown with items list
    return {
      label: entry.label,
      autoBadge: entry.autoBadge,
      items: entry.items?.map((item) => {
        const ItemIcon = item.icon ? iconMap[item.icon] : undefined;

        // Convert badge string to component
        let badgeComponent: React.ReactNode = undefined;
        if (item.badge === "new") {
          badgeComponent = "new"; // Will be handled by NavbarMegaMenu
        } else if (item.badge === "V3") {
          badgeComponent = <V3Badge />;
        } else if (item.badge === "V4") {
          badgeComponent = <V4Badge />;
        }

        return {
          icon: ItemIcon ? <ItemIcon /> : undefined,
          title: item.title,
          description: item.description,
          href: item.href,
          badge: badgeComponent,
          accentColor: item.accentColor,
          external: item.external,
        };
      }),
    };
  });

  return (
    <NavbarMegaMenu
      logo={logoNode}
      logoHref={logoHref}
      entries={enrichedEntries}
      cta={cta}
    />
  );
}
