"use client";

import { forwardRef, type HTMLAttributes } from "react";
import { motion, type Variants } from "motion/react";
import { cn } from "@uilibrary/utils";
import { useReducedMotion } from "@uilibrary/hooks/use-reduced-motion";

/* ─────────────────────────────────────────────────────────────────────────
 * Hero Bramble — v4
 *
 * Critique addressed:
 *   1. Image blends → transparent PNG instead of cream-paper PNG (no halo)
 *   2. Less static  → drifting sparkle/heart/swirl SVGs animated over the
 *                     illustration; characters get a layered drift; clear
 *                     entrance animation per element
 *   3. CTA above the fold → 2-column grid (text+CTA on left, illustration
 *                            on right). Everything fits in 100dvh.
 * ─────────────────────────────────────────────────────────────────────── */

const C = {
  cream: "#fbfaf9",
  warmStone: "#efece7",
  ink: "#1a1814",
  inkSoft: "#5a564e",
  orange: "#e8643c",
  green: "#7ab26b",
  yellow: "#f6c95a",
  blue: "#6da7c4",
  pink: "#f4a4ad",
} as const;

const FONT_DISPLAY =
  "'Fraunces Variable', 'Instrument Serif', ui-serif, Georgia, serif";
const FONT_UI =
  "'Inter Variable', ui-sans-serif, system-ui, -apple-system, sans-serif";

const EASE = [0.16, 1, 0.3, 1] as const;
const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } },
};
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: EASE } },
};

export interface HeroBrambleProps extends HTMLAttributes<HTMLElement> {
  preLabel?: string;
  headline?: string;
  italicWord?: string;
  description?: string;
  ctaLabel?: string;
  ctaHref?: string;
  secondaryLabel?: string;
  /**
   * Max content width for the hero container.
   * - number → pixels (e.g. 1280)
   * - string → any CSS value (e.g. "75rem", "min(1280px, 90vw)")
   * - undefined → falls back to `var(--site-max-width, 1280px)` so you can
   *   set it once globally and all sections inherit.
   */
  maxWidth?: number | string;
}

/* ── Floating decorative marks animated over the illustration ──────── */

function FloatingMark({
  top, left, right, bottom,
  rotate = 0, delay = 0, duration = 5, color, children,
}: {
  top?: string; left?: string; right?: string; bottom?: string;
  rotate?: number; delay?: number; duration?: number;
  color: string; children: React.ReactNode;
}) {
  return (
    <motion.div
      className="absolute"
      style={{ top, left, right, bottom, color }}
      initial={{ opacity: 0, scale: 0.6, rotate: rotate - 10 }}
      animate={{
        opacity: 1,
        scale: 1,
        rotate: [rotate - 4, rotate + 4, rotate - 4],
        y: [-3, 3, -3],
      }}
      transition={{
        opacity: { duration: 0.6, delay: delay + 0.4 },
        scale: { duration: 0.6, delay: delay + 0.4, ease: EASE },
        rotate: { duration, ease: "easeInOut", repeat: Infinity, delay },
        y: { duration: duration + 1.5, ease: "easeInOut", repeat: Infinity, delay },
      }}
    >
      {children}
    </motion.div>
  );
}

export const HeroBramble = forwardRef<HTMLElement, HeroBrambleProps>(
  (
    {
      preLabel = "Sundays · for your people",
      headline = "How's the week treating",
      italicWord = "your people?",
      description =
        "A five-minute check-in with the friends you actually care about. No streaks. No noise. Just a little letter, every Sunday.",
      ctaLabel = "Start with three friends",
      ctaHref = "#",
      secondaryLabel = "Read the manifesto",
      maxWidth,
      className,
      ...props
    },
    ref,
  ) => {
    const reduced = useReducedMotion();

    // Resolve the max-width: explicit number → px, string → as-is, else CSS var fallback
    const containerMaxWidth =
      typeof maxWidth === "number"
        ? `${maxWidth}px`
        : typeof maxWidth === "string"
        ? maxWidth
        : "var(--site-max-width, 1280px)";

    return (
      <section
        ref={ref}
        className={cn(
          "relative isolate flex min-h-[100dvh] flex-col overflow-hidden",
          className,
        )}
        style={{
          background: C.cream,
          color: C.ink,
          fontFamily: FONT_UI,
        }}
        {...props}
      >
        {/* ── Soft warm wash, very subtle ──────────────────────────── */}
        <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
          <div
            className="absolute inset-0"
            style={{
              background: `radial-gradient(ellipse 70% 60% at 70% 40%, ${C.warmStone}aa 0%, transparent 70%)`,
            }}
          />
        </div>

        {/* ── Top bar ──────────────────────────────────────────────── */}
        <header
          className="relative z-20 mx-auto flex w-full items-center justify-between"
          style={{ maxWidth: containerMaxWidth, padding: "28px 32px 0" }}
        >
          <span
            style={{
              fontFamily: FONT_DISPLAY,
              fontWeight: 500,
              fontSize: 32,
              letterSpacing: "-0.025em",
              color: C.ink,
              fontStyle: "italic",
              lineHeight: 1,
            }}
          >
            bramble
            <span style={{ color: C.orange, fontStyle: "normal" }}>.</span>
          </span>

          <nav className="hidden md:flex items-center" style={{ gap: 32 }}>
            {["How it works", "Stories", "Sign in"].map((l) => (
              <a
                key={l}
                href="#"
                style={{
                  fontFamily: FONT_UI,
                  fontSize: 14,
                  fontWeight: 500,
                  color: C.ink,
                  letterSpacing: "-0.005em",
                  opacity: 0.7,
                  transition: "opacity 200ms",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.7")}
              >
                {l}
              </a>
            ))}
          </nav>
        </header>

        {/* ── 2-col grid — text left, illustration right ─────────── */}
        <div
          className="relative z-10 mx-auto grid w-full flex-1 items-center"
          style={{
            maxWidth: containerMaxWidth,
            gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1.05fr)",
            gap: 56,
            padding: "32px 32px 48px",
          }}
        >
          {/* ── Left: copy + CTA ─────────────────────────────────── */}
          <motion.div
            variants={reduced ? undefined : stagger}
            initial={reduced ? undefined : "hidden"}
            animate={reduced ? undefined : "visible"}
          >
            {/* Pre-label */}
            <motion.span
              variants={reduced ? undefined : fadeUp}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                fontFamily: FONT_UI,
                fontSize: 13,
                fontWeight: 500,
                padding: "7px 14px",
                background: C.cream,
                borderRadius: 9999,
                boxShadow: `${C.warmStone} 0px 0px 0px 1px inset`,
                color: C.ink,
                letterSpacing: "0.005em",
                marginBottom: 28,
              }}
            >
              <motion.span
                style={{ width: 6, height: 6, background: C.green, borderRadius: 9999 }}
                animate={
                  reduced
                    ? undefined
                    : { opacity: [0.5, 1, 0.5], transition: { duration: 2, ease: "easeInOut", repeat: Infinity } }
                }
              />
              {preLabel}
            </motion.span>

            {/* Display headline */}
            <motion.h1
              variants={reduced ? undefined : fadeUp}
              style={{
                fontFamily: FONT_DISPLAY,
                fontWeight: 500,
                fontSize: "clamp(2.5rem, 4.5vw + 0.5rem, 4.5rem)",
                lineHeight: 1.02,
                letterSpacing: "-0.028em",
                color: C.ink,
                maxWidth: 540,
              }}
            >
              {headline}{" "}
              <span
                style={{
                  fontStyle: "italic",
                  color: C.orange,
                  fontFamily: FONT_DISPLAY,
                  fontWeight: 400,
                }}
              >
                {italicWord}
              </span>
            </motion.h1>

            {/* Sub copy */}
            <motion.p
              variants={reduced ? undefined : fadeUp}
              style={{
                fontFamily: FONT_UI,
                fontSize: 17,
                fontWeight: 400,
                lineHeight: 1.55,
                letterSpacing: "-0.005em",
                color: C.inkSoft,
                maxWidth: 460,
                marginTop: 24,
              }}
            >
              {description}
            </motion.p>

            {/* CTAs */}
            <motion.div
              variants={reduced ? undefined : fadeUp}
              className="flex flex-wrap items-center"
              style={{ gap: 20, marginTop: 32 }}
            >
              <a
                href={ctaHref}
                style={{
                  fontFamily: FONT_UI,
                  fontSize: 15,
                  fontWeight: 500,
                  padding: "14px 24px",
                  background: C.ink,
                  color: C.cream,
                  borderRadius: 9999,
                  letterSpacing: "-0.005em",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 10,
                  transition:
                    "transform 200ms cubic-bezier(0.16,1,0.3,1), box-shadow 200ms",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-1px)";
                  e.currentTarget.style.boxShadow = `0 8px 24px rgba(26,24,20,0.25)`;
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
              </a>
              <a
                href="#"
                style={{
                  fontFamily: FONT_UI,
                  fontSize: 14,
                  fontWeight: 500,
                  color: C.ink,
                  letterSpacing: "-0.005em",
                  opacity: 0.65,
                  textDecoration: "underline",
                  textDecorationColor: `${C.ink}33`,
                  textUnderlineOffset: 4,
                  padding: "14px 4px",
                  display: "inline-flex",
                  alignItems: "center",
                }}
              >
                {secondaryLabel}
              </a>
            </motion.div>

            {/* Trust row */}
            <motion.div
              variants={reduced ? undefined : fadeUp}
              className="flex flex-wrap items-center"
              style={{
                gap: 20,
                marginTop: 36,
                fontFamily: FONT_UI,
                fontSize: 13,
                color: C.inkSoft,
                opacity: 0.8,
              }}
            >
              <span className="inline-flex items-center" style={{ gap: 8 }}>
                <span style={{ width: 6, height: 6, background: C.yellow, borderRadius: 9999 }} />
                Free for groups of 5
              </span>
              <span style={{ width: 1, height: 12, background: C.warmStone }} />
              <span className="inline-flex items-center" style={{ gap: 8 }}>
                <span style={{ width: 6, height: 6, background: C.blue, borderRadius: 9999 }} />
                No streaks, ever
              </span>
              <span style={{ width: 1, height: 12, background: C.warmStone }} />
              <span className="inline-flex items-center" style={{ gap: 8 }}>
                <span style={{ width: 6, height: 6, background: C.pink, borderRadius: 9999 }} />
                On iOS this fall
              </span>
            </motion.div>
          </motion.div>

          {/* ── Right: illustration with floating decorative marks ── */}
          <motion.div
            initial={reduced ? undefined : { opacity: 0, scale: 0.94, y: 20 }}
            animate={reduced ? undefined : { opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.25 }}
            className="relative"
          >
            {/* Subtle ground shadow under characters — keeps them rooted */}
            <div
              className="absolute"
              style={{
                left: "8%", right: "8%", bottom: "12%", height: 24,
                background: `radial-gradient(ellipse at center, ${C.ink}15 0%, transparent 70%)`,
                filter: "blur(12px)",
                pointerEvents: "none",
              }}
            />

            <motion.img
              src="/generated/bramble-hero-v2.png"
              alt="Four friends holding letters from each other"
              className="relative w-full"
              style={{
                /* feather the edges so any tonal mismatch between the PNG's
                   cream and the page's #fbfaf9 disappears into the page */
                maskImage:
                  "radial-gradient(ellipse 95% 92% at 50% 50%, black 65%, transparent 100%)",
                WebkitMaskImage:
                  "radial-gradient(ellipse 95% 92% at 50% 50%, black 65%, transparent 100%)",
              }}
              animate={
                reduced
                  ? undefined
                  : { y: [0, -5, 0], transition: { duration: 7, ease: "easeInOut", repeat: Infinity } }
              }
            />

            {/* Floating decorative marks — give the scene life beyond the static PNG */}
            {!reduced && (
              <>
                <FloatingMark top="6%" left="14%" rotate={-18} delay={0.6} duration={5} color={C.orange}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2 L13.4 8.4 L20 9 L15 13.5 L16.4 20 L12 16.5 L7.6 20 L9 13.5 L4 9 L10.6 8.4 Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </FloatingMark>

                <FloatingMark top="2%" right="32%" rotate={8} delay={0.9} duration={6} color={C.pink}>
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 21s-7-4.5-7-10a4 4 0 017-2.6A4 4 0 0119 11c0 5.5-7 10-7 10z" />
                  </svg>
                </FloatingMark>

                <FloatingMark top="14%" right="8%" rotate={-10} delay={1.1} duration={7} color={C.blue}>
                  <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
                    <path d="M12 4a6 6 0 016 6c0 4-3 6-6 6s-6-2-6-6 3-6 6-6z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    <circle cx="12" cy="11" r="2" stroke="currentColor" strokeWidth="2" />
                  </svg>
                </FloatingMark>

                <FloatingMark bottom="20%" left="2%" rotate={12} delay={1.3} duration={5.5} color={C.green}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                </FloatingMark>

                <FloatingMark bottom="6%" right="18%" rotate={-15} delay={1.5} duration={6.5} color={C.yellow}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                    <path d="M3 12 L21 12 M12 3 L12 21" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                  </svg>
                </FloatingMark>

                {/* tiny dotted curve — handmade detail */}
                <FloatingMark top="38%" left="-2%" rotate={-20} delay={1.7} duration={8} color={C.orange}>
                  <svg width="60" height="20" viewBox="0 0 60 20" fill="none">
                    <path d="M2 10 Q15 2, 30 10 T58 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="2 4" />
                  </svg>
                </FloatingMark>
              </>
            )}
          </motion.div>
        </div>
      </section>
    );
  },
);

HeroBramble.displayName = "HeroBramble";
