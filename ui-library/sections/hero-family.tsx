"use client";

import { forwardRef, type HTMLAttributes } from "react";
import { motion, type Variants } from "motion/react";
import { cn } from "@uilibrary/utils";
import { useReducedMotion } from "@uilibrary/hooks/use-reduced-motion";

/* ─────────────────────────────────────────────────────────────────────────
 * Hero Family — built strictly to Family's DESIGN.md
 *
 * Hard moves from the source MD:
 *   - Cream canvas #fbfaf9 — never pure white
 *   - Display serif at 68px+ with -0.031em tracking (sub Fraunces)
 *   - Single dark CTA #121212 — no other dark surfaces
 *   - Cards use INSET 1px shadow #f2f0ed — never drop shadows
 *   - Vivid primaries (orange / green / blue / yellow / pink) ONLY on illustrations
 *   - Wobbly blob characters with stick legs and expressive eyes — the identity
 *   - Spacious, airy, illustrative — playful not utilitarian
 * ─────────────────────────────────────────────────────────────────────── */

const C = {
  cream: "#fbfaf9",
  warmStone: "#f2f0ed",
  ink: "#121212",
  slate: "#6b6b6b",
  electricOrange: "#ff6a3d",
  grassGreen: "#4caf50",
  skyBlue: "#4a90e2",
  brightYellow: "#ffc83d",
  bubblegumPink: "#ff8fa8",
} as const;

const FONT_DISPLAY =
  "'Fraunces Variable', 'Instrument Serif', ui-serif, Georgia, serif";
const FONT_UI =
  "'Inter Variable', ui-sans-serif, system-ui, -apple-system, sans-serif";

const EASE = [0.16, 1, 0.3, 1] as const;
const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
};
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};
const wobble = {
  initial: { rotate: 0 },
  animate: {
    rotate: [-2, 2, -2],
    y: [-4, 4, -4],
    transition: { duration: 6, ease: "easeInOut" as const, repeat: Infinity },
  },
};

/* ── Wobbly blob characters ──────────────────────────────────────────── */

interface BlobProps {
  fill: string;
  size?: number;
  eye?: "happy" | "wide" | "wink";
  rotate?: number;
}

function BlobCharacter({ fill, size = 110, eye = "wide", rotate = 0 }: BlobProps) {
  return (
    <svg width={size} height={size * 1.3} viewBox="0 0 110 143" fill="none" style={{ transform: `rotate(${rotate}deg)` }}>
      {/* Stick legs */}
      <path d="M38 95 L34 130" stroke={C.ink} strokeWidth="3" strokeLinecap="round" />
      <path d="M72 95 L76 130" stroke={C.ink} strokeWidth="3" strokeLinecap="round" />
      {/* Stick feet */}
      <path d="M28 130 L40 130" stroke={C.ink} strokeWidth="3" strokeLinecap="round" />
      <path d="M70 130 L82 130" stroke={C.ink} strokeWidth="3" strokeLinecap="round" />
      {/* Stick arms */}
      <path d="M18 60 Q5 65, 8 80" stroke={C.ink} strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M92 60 Q105 65, 102 80" stroke={C.ink} strokeWidth="3" strokeLinecap="round" fill="none" />
      {/* Body — wobbly blob */}
      <path
        d="M55 12
           C 78 12, 95 28, 95 52
           C 95 70, 92 82, 88 92
           C 80 100, 65 102, 55 102
           C 45 102, 30 100, 22 92
           C 18 82, 15 70, 15 52
           C 15 28, 32 12, 55 12 Z"
        fill={fill}
        stroke={C.ink}
        strokeWidth="2.5"
      />
      {/* Eyes */}
      {eye === "wide" && (
        <>
          <circle cx="42" cy="48" r="5" fill={C.ink} />
          <circle cx="68" cy="48" r="5" fill={C.ink} />
          <circle cx="43" cy="46" r="1.5" fill="#fff" />
          <circle cx="69" cy="46" r="1.5" fill="#fff" />
        </>
      )}
      {eye === "happy" && (
        <>
          <path d="M37 50 Q42 44, 47 50" stroke={C.ink} strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <path d="M63 50 Q68 44, 73 50" stroke={C.ink} strokeWidth="2.5" fill="none" strokeLinecap="round" />
        </>
      )}
      {eye === "wink" && (
        <>
          <circle cx="42" cy="48" r="5" fill={C.ink} />
          <circle cx="43" cy="46" r="1.5" fill="#fff" />
          <path d="M63 50 Q68 44, 73 50" stroke={C.ink} strokeWidth="2.5" fill="none" strokeLinecap="round" />
        </>
      )}
      {/* Smile */}
      <path d="M44 68 Q55 78, 66 68" stroke={C.ink} strokeWidth="2.5" fill="none" strokeLinecap="round" />
    </svg>
  );
}

/* ── Component ────────────────────────────────────────────────────────── */

export interface HeroFamilyProps extends HTMLAttributes<HTMLElement> {
  preLabel?: string;
  headline?: string;
  highlightWord?: string;
  subheadline?: string;
  ctaLabel?: string;
  ctaHref?: string;
}

export const HeroFamily = forwardRef<HTMLElement, HeroFamilyProps>(
  (
    {
      preLabel = "Banking, but make it fun",
      headline = "Money for the whole",
      highlightWord = "family.",
      subheadline =
        "Send allowance, save together, and learn money skills as a family. No paperwork. No grown-up boredom.",
      ctaLabel = "Get the app",
      ctaHref = "#",
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
          "relative isolate flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden",
          className,
        )}
        style={{
          background: C.cream,
          color: C.ink,
          fontFamily: FONT_UI,
          padding: "64px 24px",
        }}
        {...props}
      >
        {/* ── Top bar (logo only — Family is minimal) ──────────────── */}
        <header
          className="absolute left-0 right-0 top-0 z-20 flex items-center justify-between"
          style={{ padding: "24px 32px" }}
        >
          <span
            style={{
              fontFamily: FONT_DISPLAY,
              fontWeight: 500,
              fontSize: 22,
              letterSpacing: "-0.02em",
              color: C.ink,
            }}
          >
            family
            <span style={{ color: C.electricOrange }}>.</span>
          </span>

          <nav className="hidden md:flex items-center" style={{ gap: 24 }}>
            {["About", "How it works", "FAQ"].map((l) => (
              <a
                key={l}
                href="#"
                style={{
                  fontFamily: FONT_UI,
                  fontSize: 14,
                  fontWeight: 500,
                  color: C.ink,
                  letterSpacing: "-0.005em",
                }}
              >
                {l}
              </a>
            ))}
          </nav>
        </header>

        {/* ── Floating blob characters ─────────────────────────────── */}
        <div className="pointer-events-none absolute inset-0 -z-[5]" aria-hidden="true">
          <motion.div
            className="absolute"
            style={{ left: "8%", top: "18%" }}
            initial={reduced ? undefined : "initial"}
            animate={reduced ? undefined : "animate"}
            variants={reduced ? undefined : wobble}
          >
            <BlobCharacter fill={C.electricOrange} size={120} eye="wide" rotate={-8} />
          </motion.div>

          <motion.div
            className="absolute"
            style={{ right: "10%", top: "14%" }}
            initial={reduced ? undefined : "initial"}
            animate={reduced ? undefined : "animate"}
            variants={reduced ? undefined : wobble}
            transition={{ delay: 0.5 }}
          >
            <BlobCharacter fill={C.skyBlue} size={100} eye="happy" rotate={6} />
          </motion.div>

          <motion.div
            className="absolute"
            style={{ left: "12%", bottom: "15%" }}
            initial={reduced ? undefined : "initial"}
            animate={reduced ? undefined : "animate"}
            variants={reduced ? undefined : wobble}
            transition={{ delay: 1 }}
          >
            <BlobCharacter fill={C.brightYellow} size={90} eye="wink" rotate={10} />
          </motion.div>

          <motion.div
            className="absolute"
            style={{ right: "12%", bottom: "20%" }}
            initial={reduced ? undefined : "initial"}
            animate={reduced ? undefined : "animate"}
            variants={reduced ? undefined : wobble}
            transition={{ delay: 1.5 }}
          >
            <BlobCharacter fill={C.grassGreen} size={130} eye="wide" rotate={-12} />
          </motion.div>

          <motion.div
            className="absolute"
            style={{ left: "45%", top: "8%" }}
            initial={reduced ? undefined : "initial"}
            animate={reduced ? undefined : "animate"}
            variants={reduced ? undefined : wobble}
            transition={{ delay: 2 }}
          >
            <BlobCharacter fill={C.bubblegumPink} size={70} eye="happy" rotate={20} />
          </motion.div>
        </div>

        {/* ── Center content ──────────────────────────────────────── */}
        <motion.div
          className="relative z-10 flex flex-col items-center text-center"
          variants={reduced ? undefined : stagger}
          initial={reduced ? undefined : "hidden"}
          animate={reduced ? undefined : "visible"}
        >
          {/* Pre-label — pill with inset border */}
          <motion.span
            variants={reduced ? undefined : fadeUp}
            style={{
              fontFamily: FONT_UI,
              fontSize: 13,
              fontWeight: 500,
              padding: "8px 14px",
              background: C.cream,
              borderRadius: 9999,
              boxShadow: `${C.warmStone} 0px 0px 0px 1px inset`,
              color: C.ink,
              letterSpacing: "-0.005em",
              marginBottom: 28,
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                background: C.grassGreen,
                borderRadius: 9999,
              }}
            />
            {preLabel}
          </motion.span>

          {/* Display headline */}
          <motion.h1
            variants={reduced ? undefined : fadeUp}
            style={{
              fontFamily: FONT_DISPLAY,
              fontWeight: 500,
              fontSize: "clamp(2.75rem, 6.5vw + 0.5rem, 5.5rem)",
              lineHeight: 1.02,
              letterSpacing: "-0.031em",
              color: C.ink,
              maxWidth: 880,
              fontFeatureSettings: "'ss01' on",
            }}
            className="text-balance"
          >
            {headline}{" "}
            <span
              style={{
                fontStyle: "italic",
                color: C.electricOrange,
                fontFamily: FONT_DISPLAY,
              }}
            >
              {highlightWord}
            </span>
          </motion.h1>

          {/* Body */}
          <motion.p
            variants={reduced ? undefined : fadeUp}
            style={{
              fontFamily: FONT_UI,
              fontSize: 18,
              fontWeight: 400,
              lineHeight: 1.5,
              letterSpacing: "-0.005em",
              color: C.slate,
              maxWidth: 480,
              marginTop: 28,
            }}
            className="text-balance"
          >
            {subheadline}
          </motion.p>

          {/* Single dark CTA — the only dark moment */}
          <motion.a
            variants={reduced ? undefined : fadeUp}
            href={ctaHref}
            style={{
              fontFamily: FONT_UI,
              fontSize: 15,
              fontWeight: 500,
              padding: "14px 26px",
              background: C.ink,
              color: C.cream,
              borderRadius: 9999,
              marginTop: 36,
              letterSpacing: "-0.005em",
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              transition: "transform 200ms cubic-bezier(0.16, 1, 0.3, 1), box-shadow 200ms",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-1px)";
              e.currentTarget.style.boxShadow = `0 8px 24px ${C.ink}33`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            {ctaLabel}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M13 5l7 7-7 7" />
            </svg>
          </motion.a>

          {/* Tiny trust badges — inline, illustrated */}
          <motion.div
            variants={reduced ? undefined : fadeUp}
            className="flex items-center"
            style={{
              gap: 16,
              marginTop: 32,
              fontFamily: FONT_UI,
              fontSize: 13,
              color: C.slate,
              fontWeight: 400,
            }}
          >
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
              <span style={{ width: 6, height: 6, background: C.brightYellow, borderRadius: 9999 }} />
              4.9 on App Store
            </span>
            <span style={{ width: 1, height: 12, background: C.warmStone }} />
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
              <span style={{ width: 6, height: 6, background: C.skyBlue, borderRadius: 9999 }} />
              FDIC insured
            </span>
            <span style={{ width: 1, height: 12, background: C.warmStone }} />
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
              <span style={{ width: 6, height: 6, background: C.grassGreen, borderRadius: 9999 }} />
              Free for kids
            </span>
          </motion.div>
        </motion.div>
      </section>
    );
  },
);

HeroFamily.displayName = "HeroFamily";
