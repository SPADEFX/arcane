"use client";

import { forwardRef, type HTMLAttributes } from "react";
import { motion, type Variants } from "motion/react";
import { cn } from "@uilibrary/utils";
import { useReducedMotion } from "@uilibrary/hooks/use-reduced-motion";

/* ─────────────────────────────────────────────────────────────────────────
 * Hero Linear — built strictly to Linear's DESIGN.md
 *
 * Hard moves from the source MD:
 *   - Pitch Black #08090a base, 4 surface levels (Graphite/Deep Slate/Charcoal)
 *   - Inter Variable with OpenType cv01,ss03 — weights 300/400/510/590
 *   - Tight tracking: -0.22px display, -0.13px body
 *   - 6px radius cards/buttons; 2px tags; 9999px pill (announcement only)
 *   - Compact density: 8px gap, 12px card padding
 *   - Neon Lime #e4f222 = PRIMARY ACTION ONLY
 *   - Sharp contained shadows + inset 1px ring borders (rgb(35,37,42))
 *   - Storm Cloud #8a8f98 for receding secondary text
 *   - Subtle dot grid + radial atmosphere, never broad gradients
 * ─────────────────────────────────────────────────────────────────────── */

const C = {
  pitchBlack: "#08090a",
  graphite: "#0f1011",
  deepSlate: "#161718",
  charcoalGrey: "#23252a",
  gunmetal: "#383b3f",
  porcelain: "#f7f8f8",
  lightSteel: "#d0d6e0",
  stormCloud: "#8a8f98",
  fogGrey: "#62666d",
  neonLime: "#e4f222",
  aetherBlue: "#5e6ad2",
} as const;

const FONT_UI =
  "'Inter Variable', ui-sans-serif, system-ui, -apple-system, sans-serif";
const FONT_MONO =
  "'Berkeley Mono', 'IBM Plex Mono Variable', ui-monospace, SFMono-Regular, Menlo";

const OT = "'cv01' on, 'ss03' on";

const EASE = [0.16, 1, 0.3, 1] as const;
const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
};
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

export interface HeroLinearProps extends HTMLAttributes<HTMLElement> {
  version?: string;
  versionNote?: string;
  headline?: string;
  subheadline?: string;
  ctaLabel?: string;
  ctaHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
  navLinks?: { label: string; href: string }[];
}

export const HeroLinear = forwardRef<HTMLElement, HeroLinearProps>(
  (
    {
      version = "v3.5",
      versionNote = "Triage workflows for high-velocity teams",
      headline = "Plan the work. Then make it happen.",
      subheadline =
        "Linear is the project tool that knows what your team is doing — without anyone having to update a status field.",
      ctaLabel = "Get started",
      ctaHref = "#",
      secondaryLabel = "Talk to sales",
      secondaryHref = "#",
      navLinks = [
        { label: "Product", href: "#" },
        { label: "Method", href: "#" },
        { label: "Customers", href: "#" },
        { label: "Pricing", href: "#" },
        { label: "Now", href: "#" },
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
          background: C.pitchBlack,
          fontFamily: FONT_UI,
          fontFeatureSettings: OT,
          color: C.porcelain,
        }}
        {...props}
      >
        {/* ── Background atmospherics ────────────────────────────────── */}
        <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
          {/* fine dot grid */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(rgba(255,255,255,0.025) 1px, transparent 1px)",
              backgroundSize: "32px 32px",
              maskImage:
                "radial-gradient(ellipse 60% 50% at 50% 30%, black 0%, transparent 75%)",
              WebkitMaskImage:
                "radial-gradient(ellipse 60% 50% at 50% 30%, black 0%, transparent 75%)",
            }}
          />
          {/* aether blue glow — top-left, restrained */}
          <div
            className="absolute"
            style={{
              left: "-10%",
              top: "-10%",
              width: "55%",
              height: "55%",
              background: `radial-gradient(circle, ${C.aetherBlue}22 0%, transparent 60%)`,
              filter: "blur(60px)",
            }}
          />
          {/* Faint warm wash bottom — almost imperceptible */}
          <div
            className="absolute inset-x-0 bottom-0 h-[60%]"
            style={{
              background:
                "linear-gradient(180deg, transparent 0%, rgba(15,16,17,0.4) 100%)",
            }}
          />
        </div>

        {/* ── Sticky nav ─────────────────────────────────────────────── */}
        <nav
          className="relative z-20 flex items-center justify-between"
          style={{
            maxWidth: 1200,
            width: "100%",
            margin: "0 auto",
            padding: "20px 24px",
            fontFamily: FONT_UI,
          }}
        >
          {/* Logo */}
          <div className="flex items-center" style={{ gap: 8 }}>
            <div
              className="flex items-center justify-center"
              style={{ width: 22, height: 22, borderRadius: 5, background: C.porcelain }}
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill={C.pitchBlack}>
                <path d="M3 17 L21 17 L17 21 L3 21 Z M3 11 L21 11 L11 21 L3 13 Z M3 3 L21 3 L3 21 Z" />
              </svg>
            </div>
            <span style={{ fontSize: 14, fontWeight: 510, letterSpacing: "-0.13px", color: C.porcelain }}>
              Linear
            </span>
          </div>

          {/* Center links */}
          <div className="hidden items-center md:flex" style={{ gap: 4 }}>
            {navLinks.map((l) => (
              <a
                key={l.label}
                href={l.href}
                style={{
                  color: C.stormCloud,
                  fontSize: 13,
                  fontWeight: 400,
                  letterSpacing: "-0.13px",
                  padding: "6px 10px",
                  borderRadius: 6,
                  transition: "color 200ms",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = C.porcelain)}
                onMouseLeave={(e) => (e.currentTarget.style.color = C.stormCloud)}
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
                color: C.stormCloud,
                fontSize: 13,
                fontWeight: 400,
                letterSpacing: "-0.13px",
                padding: "6px 10px",
              }}
            >
              Log in
            </a>
            <a
              href={ctaHref}
              style={{
                color: C.pitchBlack,
                fontSize: 13,
                fontWeight: 590,
                letterSpacing: "-0.13px",
                padding: "7px 14px",
                borderRadius: 6,
                background: C.neonLime,
                boxShadow:
                  "rgba(0,0,0,0.4) 0px 2px 4px 0px, rgba(255,255,255,0.12) 0px 1px 0px 0px inset",
              }}
            >
              {ctaLabel}
            </a>
          </div>
        </nav>

        {/* ── Centered hero content ──────────────────────────────────── */}
        <motion.div
          className="relative z-10 mx-auto flex w-full max-w-[1200px] flex-1 flex-col items-center justify-center px-6 text-center"
          variants={reduced ? undefined : stagger}
          initial={reduced ? undefined : "hidden"}
          animate={reduced ? undefined : "visible"}
          style={{ paddingBottom: 96 }}
        >
          {/* Version pill — Linear-classic */}
          <motion.a
            variants={reduced ? undefined : fadeUp}
            href="#"
            className="group inline-flex items-center"
            style={{
              gap: 8,
              padding: "5px 12px 5px 5px",
              background: C.graphite,
              border: `1px solid ${C.charcoalGrey}`,
              borderRadius: 9999,
              fontSize: 13,
              fontWeight: 400,
              letterSpacing: "-0.13px",
              color: C.lightSteel,
              marginBottom: 28,
              boxShadow:
                "rgba(255,255,255,0.04) 0px 1px 0px 0px inset, rgba(0,0,0,0.4) 0px 2px 4px 0px",
            }}
          >
            <span
              style={{
                fontFamily: FONT_MONO,
                fontSize: 11,
                fontWeight: 400,
                padding: "2px 7px",
                background: C.deepSlate,
                color: C.neonLime,
                borderRadius: 9999,
                letterSpacing: "-0.1px",
              }}
            >
              {version}
            </span>
            <span>{versionNote}</span>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.6, marginLeft: 2 }}>
              <path d="M9 18l6-6-6-6" />
            </svg>
          </motion.a>

          {/* Display headline — Inter weight 510, tight tracking */}
          <motion.h1
            variants={reduced ? undefined : fadeUp}
            className="text-balance"
            style={{
              fontFamily: FONT_UI,
              fontFeatureSettings: OT,
              fontWeight: 510,
              fontSize: "clamp(2.75rem, 5.5vw + 0.5rem, 4.5rem)",
              lineHeight: 1.05,
              letterSpacing: "-0.022em",
              color: C.porcelain,
              maxWidth: 880,
              marginBottom: 20,
            }}
          >
            {headline}
          </motion.h1>

          {/* Sub copy in Storm Cloud */}
          <motion.p
            variants={reduced ? undefined : fadeUp}
            className="text-balance"
            style={{
              fontFamily: FONT_UI,
              fontFeatureSettings: OT,
              fontSize: 17,
              fontWeight: 400,
              lineHeight: 1.5,
              letterSpacing: "-0.13px",
              color: C.stormCloud,
              maxWidth: 540,
              marginBottom: 32,
            }}
          >
            {subheadline}
          </motion.p>

          {/* CTAs — neon lime + ghost */}
          <motion.div
            variants={reduced ? undefined : fadeUp}
            className="flex flex-wrap items-center justify-center"
            style={{ gap: 8 }}
          >
            <a
              href={ctaHref}
              style={{
                fontFamily: FONT_UI,
                color: C.pitchBlack,
                fontSize: 14,
                fontWeight: 590,
                letterSpacing: "-0.13px",
                padding: "10px 18px",
                borderRadius: 6,
                background: C.neonLime,
                boxShadow:
                  "rgba(0,0,0,0.4) 0px 2px 4px 0px, rgba(255,255,255,0.12) 0px 1px 0px 0px inset",
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                transition: "transform 150ms",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-1px)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
            >
              {ctaLabel}
              <span style={{ fontFamily: FONT_MONO, fontSize: 11, opacity: 0.55, marginLeft: 2 }}>↵</span>
            </a>
            <a
              href={secondaryHref}
              style={{
                fontFamily: FONT_UI,
                color: C.lightSteel,
                fontSize: 14,
                fontWeight: 510,
                letterSpacing: "-0.13px",
                padding: "10px 16px",
                borderRadius: 6,
                background: C.graphite,
                boxShadow:
                  `${C.charcoalGrey} 0px 0px 0px 1px inset, rgba(255,255,255,0.03) 0px 1px 0px 0px inset`,
              }}
            >
              {secondaryLabel}
            </a>
          </motion.div>

          {/* Tertiary cmd hint — Linear loves keyboard hints */}
          <motion.p
            variants={reduced ? undefined : fadeUp}
            style={{
              marginTop: 16,
              fontFamily: FONT_UI,
              fontSize: 12,
              fontWeight: 400,
              letterSpacing: "-0.1px",
              color: C.fogGrey,
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            Quick demo
            <span
              style={{
                fontFamily: FONT_MONO,
                fontSize: 10,
                padding: "1px 6px",
                background: C.deepSlate,
                color: C.lightSteel,
                borderRadius: 3,
                border: `1px solid ${C.charcoalGrey}`,
              }}
            >
              ⌘K
            </span>
          </motion.p>
        </motion.div>

        {/* ── Bottom: faint product UI peek (Graphite card) ──────────── */}
        <motion.div
          variants={reduced ? undefined : fadeUp}
          initial={reduced ? undefined : "hidden"}
          animate={reduced ? undefined : "visible"}
          className="relative z-10 mx-auto w-full"
          style={{ maxWidth: 1100, padding: "0 24px 24px" }}
        >
          <div
            style={{
              background: C.graphite,
              borderRadius: 8,
              boxShadow:
                `${C.charcoalGrey} 0px 0px 0px 1px inset, rgba(0,0,0,0.4) 0px 2px 4px 0px, rgba(8,9,10,0.6) 0px 4px 32px 0px`,
              padding: 1,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "200px 1fr",
                background: C.graphite,
                borderRadius: 7,
                minHeight: 240,
              }}
            >
              {/* Sidebar */}
              <div
                style={{
                  borderRight: `1px solid ${C.charcoalGrey}`,
                  padding: 12,
                  display: "flex",
                  flexDirection: "column",
                  gap: 4,
                }}
              >
                {["Inbox", "My issues", "Active", "Backlog", "Cycle 12"].map((l, i) => (
                  <div
                    key={l}
                    style={{
                      padding: "5px 8px",
                      fontSize: 13,
                      fontWeight: 400,
                      letterSpacing: "-0.13px",
                      color: i === 2 ? C.porcelain : C.stormCloud,
                      background: i === 2 ? C.deepSlate : "transparent",
                      borderRadius: 4,
                    }}
                  >
                    {l}
                  </div>
                ))}
              </div>
              {/* Issues list */}
              <div style={{ padding: 16 }}>
                {[
                  { id: "ENG-241", title: "Implement triage workflow auto-tagging", priority: C.neonLime },
                  { id: "ENG-238", title: "Investigate slow query on inbox load", priority: C.aetherBlue },
                  { id: "DES-19", title: "Update display hierarchy on cycle view", priority: C.stormCloud },
                  { id: "ENG-235", title: "Resolve flaky test in webhooks", priority: C.fogGrey },
                ].map((row) => (
                  <div
                    key={row.id}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "auto 80px 1fr auto",
                      alignItems: "center",
                      gap: 12,
                      padding: "10px 12px",
                      borderRadius: 4,
                      borderBottom: `1px solid ${C.charcoalGrey}`,
                    }}
                  >
                    <div style={{ width: 8, height: 8, borderRadius: 2, background: row.priority }} />
                    <span
                      style={{
                        fontFamily: FONT_MONO,
                        fontSize: 12,
                        color: C.fogGrey,
                        letterSpacing: "-0.1px",
                      }}
                    >
                      {row.id}
                    </span>
                    <span
                      style={{
                        fontSize: 13,
                        fontWeight: 400,
                        letterSpacing: "-0.13px",
                        color: C.porcelain,
                      }}
                    >
                      {row.title}
                    </span>
                    <span
                      style={{
                        fontSize: 11,
                        color: C.fogGrey,
                        fontFamily: FONT_MONO,
                      }}
                    >
                      Today
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </section>
    );
  },
);

HeroLinear.displayName = "HeroLinear";
