"use client";

import { forwardRef, type HTMLAttributes } from "react";
import { motion, type Variants } from "motion/react";
import { cn } from "@uilibrary/utils";
import { useReducedMotion } from "@uilibrary/hooks/use-reduced-motion";

/* ─────────────────────────────────────────────────────────────────────────
 * Hero Antimetal — built strictly to Antimetal's DESIGN.md
 *
 * Signature moves from the source MD:
 *   - Hero gradient: linear(180deg, #001033 0%, #0050f8 55%, #5fbdf7 100%)
 *   - Dot-matrix globe illustration centered behind copy
 *   - Serif display (Fraunces) at 48px — uncommon in infra SaaS
 *   - Sans UI (Inter) below 32px with tight tracking (-0.005em at 48)
 *   - Chartreuse CTA #d0f100 — single point of visual stop
 *   - Dark ghost button (transparent, #e0f6ff border) for secondary
 *   - Announcement banner pill above the headline
 *   - Sticky nav: logo / center links / log-in ghost / chartreuse demo CTA
 * ─────────────────────────────────────────────────────────────────────── */

const COLORS = {
  midnightNavy: "#1b2540",
  deepCosmos: "#001033",
  chartreuse: "#d0f100",
  iceVeil: "#e0f6ff",
  white: "#fafeff",
} as const;

const HERO_GRADIENT =
  "linear-gradient(180deg, #001033 0%, #0050f8 55%, #5fbdf7 100%)";

const FONT_DISPLAY =
  "'Fraunces Variable', 'Instrument Serif', ui-serif, Georgia, serif";
const FONT_UI =
  "'Inter Variable', ui-sans-serif, system-ui, -apple-system, sans-serif";

const PILL_RADIUS = "9999px";

/* ── Animation ────────────────────────────────────────────────────────── */

const EASE = [0.16, 1, 0.3, 1] as const;
const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

/* ── Dot-matrix globe (CSS + masked grid) ─────────────────────────────── */

function DotGlobe() {
  return (
    <div
      className="pointer-events-none absolute left-1/2 top-1/2 -z-[5]"
      style={{
        width: "min(900px, 90vw)",
        height: "min(900px, 90vw)",
        transform: "translate(-50%, -42%)",
      }}
      aria-hidden="true"
    >
      {/* Soft blue glow behind the globe */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background:
            "radial-gradient(50% 50%, rgba(0,128,248,0.32) 0%, rgba(95,189,247,0.32) 20%, rgba(211,239,252,0.32) 60%, rgba(248,249,252,0) 100%)",
          filter: "blur(8px)",
        }}
      />

      {/* Dot grid clipped to a circle = dot-matrix sphere */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.55) 1.2px, transparent 1.2px)",
          backgroundSize: "14px 14px",
          maskImage:
            "radial-gradient(circle at center, rgba(0,0,0,1) 35%, rgba(0,0,0,0.7) 50%, rgba(0,0,0,0) 70%)",
          WebkitMaskImage:
            "radial-gradient(circle at center, rgba(0,0,0,1) 35%, rgba(0,0,0,0.7) 50%, rgba(0,0,0,0) 70%)",
        }}
      />

      {/* Latitude/longitude grid lines for sphere read */}
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 200 200"
        fill="none"
      >
        <defs>
          <radialGradient id="globeFade" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.16)" />
            <stop offset="50%" stopColor="rgba(255,255,255,0.08)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </radialGradient>
        </defs>
        {/* Equator */}
        <ellipse cx="100" cy="100" rx="74" ry="74" stroke="url(#globeFade)" strokeWidth="0.4" />
        {/* Meridians (vertical ellipses with rotation) */}
        {[15, 35, 55].map((rx) => (
          <ellipse
            key={rx}
            cx="100"
            cy="100"
            rx={rx}
            ry="74"
            stroke="url(#globeFade)"
            strokeWidth="0.4"
          />
        ))}
        {/* Parallels (horizontal ellipses) */}
        {[20, 40, 58].map((ry) => (
          <ellipse
            key={`p-${ry}`}
            cx="100"
            cy="100"
            rx="74"
            ry={ry}
            stroke="url(#globeFade)"
            strokeWidth="0.4"
          />
        ))}
      </svg>
    </div>
  );
}

/* ── Component ────────────────────────────────────────────────────────── */

export interface HeroAntimetalProps extends HTMLAttributes<HTMLElement> {
  announcement?: string;
  announcementBadge?: string;
  headline?: string;
  subheadline?: string;
  ctaLabel?: string;
  ctaHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
  navLinks?: { label: string; href: string }[];
}

export const HeroAntimetal = forwardRef<HTMLElement, HeroAntimetalProps>(
  (
    {
      announcement = "Introducing AI Anomaly Detection",
      announcementBadge = "New",
      headline = "Cloud cost management that pays for itself.",
      subheadline =
        "Antimetal automatically reduces your AWS bill while you sleep. No code changes. No long contracts.",
      ctaLabel = "Book a demo",
      ctaHref = "#",
      secondaryLabel = "View pricing",
      secondaryHref = "#",
      navLinks = [
        { label: "Platform", href: "#" },
        { label: "Resources", href: "#" },
        { label: "Pricing", href: "#" },
        { label: "Careers", href: "#" },
      ],
      className,
      ...props
    },
    ref,
  ) => {
    const reduced = useReducedMotion();

    return (
      <section
        ref={ref}
        className={cn(
          "relative isolate flex min-h-[100dvh] flex-col overflow-hidden",
          className,
        )}
        style={{
          background: HERO_GRADIENT,
          fontFamily: FONT_UI,
          color: COLORS.white,
        }}
        {...props}
      >
        {/* ── Sticky nav ─────────────────────────────────────────────── */}
        <nav
          className="relative z-20 flex items-center justify-between px-6 py-5"
          style={{
            maxWidth: "1200px",
            width: "100%",
            margin: "0 auto",
            fontFamily: FONT_UI,
          }}
        >
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div
              className="flex h-7 w-7 items-center justify-center rounded-md"
              style={{ background: COLORS.white }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill={COLORS.deepCosmos}>
                <path d="M12 2 L22 12 L12 22 L2 12 Z" />
              </svg>
            </div>
            <span style={{ fontSize: 17, fontWeight: 480, letterSpacing: "-0.015em", color: COLORS.white }}>
              antimetal
            </span>
          </div>

          {/* Center links */}
          <div className="hidden items-center md:flex" style={{ gap: 8 }}>
            {navLinks.map((l) => (
              <a
                key={l.label}
                href={l.href}
                style={{
                  color: COLORS.white,
                  fontSize: 15,
                  fontWeight: 400,
                  letterSpacing: "-0.015em",
                  padding: "8px 12px",
                  borderRadius: PILL_RADIUS,
                  opacity: 0.9,
                  transition: "opacity 200ms",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.9")}
              >
                {l.label}
              </a>
            ))}
          </div>

          {/* Right actions */}
          <div className="flex items-center" style={{ gap: 8 }}>
            <a
              href="#"
              style={{
                color: COLORS.white,
                fontSize: 15,
                fontWeight: 400,
                letterSpacing: "-0.015em",
                padding: "8px 14px",
                borderRadius: PILL_RADIUS,
                border: `1px solid ${COLORS.iceVeil}66`,
                background: "transparent",
                backdropFilter: "blur(8px)",
              }}
            >
              Log in
            </a>
            <a
              href={ctaHref}
              style={{
                color: COLORS.midnightNavy,
                fontSize: 15,
                fontWeight: 480,
                letterSpacing: "-0.015em",
                padding: "8px 16px",
                borderRadius: PILL_RADIUS,
                background: COLORS.chartreuse,
                boxShadow:
                  "rgba(24,37,66,0.32) 0px 1px 3px, rgba(24,37,66,0.44) 0px 12px 24px -12px, rgba(219,247,255,0.48) 0px 0.5px 0.5px inset",
              }}
            >
              {ctaLabel}
            </a>
          </div>
        </nav>

        {/* ── Globe behind ───────────────────────────────────────────── */}
        <DotGlobe />

        {/* ── Centered hero content ──────────────────────────────────── */}
        <motion.div
          className="relative z-10 mx-auto flex w-full max-w-[1200px] flex-1 flex-col items-center justify-center px-6 text-center"
          variants={reduced ? undefined : stagger}
          initial={reduced ? undefined : "hidden"}
          animate={reduced ? undefined : "visible"}
          style={{ paddingBottom: 96 }}
        >
          {/* Announcement banner pill */}
          <motion.a
            variants={reduced ? undefined : fadeUp}
            href="#"
            className="group inline-flex items-center"
            style={{
              gap: 8,
              padding: "6px 14px 6px 6px",
              background: "rgba(255,255,255,0.08)",
              backdropFilter: "blur(12px)",
              border: `1px solid ${COLORS.iceVeil}33`,
              borderRadius: PILL_RADIUS,
              fontSize: 14,
              fontWeight: 400,
              letterSpacing: "-0.015em",
              color: COLORS.white,
              marginBottom: 32,
              boxShadow:
                "rgba(255,255,255,0.06) 0px 1px 0px inset, rgba(0,16,51,0.08) 0px 4px 16px -4px",
            }}
          >
            <span
              style={{
                fontSize: 12,
                fontWeight: 480,
                padding: "3px 9px",
                background: COLORS.chartreuse,
                color: COLORS.midnightNavy,
                borderRadius: PILL_RADIUS,
                letterSpacing: "0.04em",
                textTransform: "uppercase",
              }}
            >
              {announcementBadge}
            </span>
            <span style={{ opacity: 0.88 }}>{announcement}</span>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.7, marginLeft: 4 }}>
              <path d="M5 12h14M13 5l7 7-7 7" />
            </svg>
          </motion.a>

          {/* SERIF display headline (signature differentiator) */}
          <motion.h1
            variants={reduced ? undefined : fadeUp}
            style={{
              fontFamily: FONT_DISPLAY,
              fontWeight: 400,
              fontSize: "clamp(2.5rem, 5.2vw + 0.5rem, 4.5rem)",
              lineHeight: 1.04,
              letterSpacing: "-0.01em",
              color: COLORS.white,
              maxWidth: 880,
              fontFeatureSettings: "'ss04','ss06','ss09','ss10','ss11'",
              marginBottom: 24,
            }}
            className="text-balance"
          >
            {headline}
          </motion.h1>

          {/* Sub copy in sans */}
          <motion.p
            variants={reduced ? undefined : fadeUp}
            style={{
              fontFamily: FONT_UI,
              fontSize: 18,
              fontWeight: 400,
              lineHeight: 1.5,
              letterSpacing: "-0.011em",
              color: COLORS.iceVeil,
              maxWidth: 540,
              opacity: 0.85,
              marginBottom: 36,
            }}
            className="text-balance"
          >
            {subheadline}
          </motion.p>

          {/* CTAs — chartreuse pill + dark ghost */}
          <motion.div
            variants={reduced ? undefined : fadeUp}
            className="flex flex-wrap items-center justify-center"
            style={{ gap: 12 }}
          >
            <a
              href={ctaHref}
              style={{
                fontFamily: FONT_UI,
                color: COLORS.midnightNavy,
                fontSize: 15,
                fontWeight: 480,
                letterSpacing: "-0.015em",
                padding: "12px 24px",
                borderRadius: PILL_RADIUS,
                background: COLORS.chartreuse,
                boxShadow:
                  "rgba(24,37,66,0.32) 0px 1px 3px, rgba(24,37,66,0.12) 0px 0.5px 0.5px, rgba(24,37,66,0.44) 0px 12px 24px -12px, rgba(219,247,255,0.48) 0px 0.5px 0.5px inset",
                transition: "transform 200ms cubic-bezier(0.16,1,0.3,1)",
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-1px)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
            >
              {ctaLabel}
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M13 5l7 7-7 7" />
              </svg>
            </a>
            <a
              href={secondaryHref}
              style={{
                fontFamily: FONT_UI,
                color: COLORS.white,
                fontSize: 15,
                fontWeight: 400,
                letterSpacing: "-0.015em",
                padding: "12px 20px",
                borderRadius: PILL_RADIUS,
                background: "transparent",
                border: `1px solid ${COLORS.iceVeil}55`,
                boxShadow:
                  "rgba(255,255,255,0.08) 0px 0px 16px 8px inset, rgba(255,255,255,0.08) 0px 0px 8px 4px inset",
                transition: "border-color 200ms",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = `${COLORS.iceVeil}99`)}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = `${COLORS.iceVeil}55`)}
            >
              {secondaryLabel}
            </a>
          </motion.div>
        </motion.div>
      </section>
    );
  },
);

HeroAntimetal.displayName = "HeroAntimetal";
