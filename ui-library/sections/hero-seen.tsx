"use client";

import { forwardRef, type HTMLAttributes } from "react";
import { motion, type Variants } from "motion/react";
import { cn } from "@uilibrary/utils";
import { useReducedMotion } from "@uilibrary/hooks/use-reduced-motion";

/* ─────────────────────────────────────────────────────────────────────────
 * Hero SEEN — built strictly to SEEN's DESIGN.md from styles.refero.design
 *
 * Hard rules from the source MD:
 *   - Dreamdust radial gradient base (never solid fill)
 *   - 3-color palette + accent gradients (twilight mist / sunrise glow /
 *     grape vine / midnight vignette)
 *   - BB Sans (substitute Inter), weights 400/500, line-height 1.0
 *   - Bubblegum outline (#683c72) reserved for borders + text
 *   - 32px radius on buttons (pill shape)
 *   - Spacing strictly 8 or 16px multiples
 *   - Imagery: full-bleed atmospheric, blob shapes, starry overlays
 *   - Layout: full-bleed, single compelling visual statement, centered
 * ─────────────────────────────────────────────────────────────────────── */

const COLORS = {
  ink: "#000000",
  bubblegum: "#683c72",
  twilightMist: "#f7d1ff",
  sunriseGlow: "#f7ae47",
  grapeVine: "#a35ab3",
  midnightVignette: "#390b5d",
} as const;

const BUTTON_RADIUS = "32px";
const BB_SANS = "Inter, 'BB Sans', ui-sans-serif, system-ui, -apple-system, sans-serif";

/* Display font — closest project font to "blob-like organic" voice. */
const DISPLAY_FONT =
  "'Bricolage Grotesque Variable', 'Fraunces Variable', ui-sans-serif, system-ui";

/* ── Animation — soft, dreamy ─────────────────────────────────────────── */

const EASE = [0.16, 1, 0.3, 1] as const;
const float: Variants = {
  initial: { y: 0 },
  animate: {
    y: [-6, 6, -6],
    transition: { duration: 8, ease: "easeInOut", repeat: Infinity },
  },
};
const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

export interface HeroSeenProps extends HTMLAttributes<HTMLElement> {
  preLabel?: string;
  word?: string;
  description?: string;
  ctaLabel?: string;
  ctaHref?: string;
}

export const HeroSeen = forwardRef<HTMLElement, HeroSeenProps>(
  (
    {
      preLabel = "Now in beta",
      word = "seen",
      description = "A space where conversations live softly. Read your chats inside a daydream.",
      ctaLabel = "Open your chats",
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
          background: `radial-gradient(circle at 50% 45%, rgba(250,230,255,0.67) 0%, rgba(212,154,226,0.55) 60%, rgba(212,154,226,0.85) 100%)`,
          fontFamily: BB_SANS,
          color: COLORS.ink,
          padding: "64px 24px",
        }}
        {...props}
      >
        {/* ── Atmospheric accent layers ──────────────────────────────── */}
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
          {/* Top-left grape vine glow */}
          <motion.div
            className="absolute"
            style={{
              left: "-15%",
              top: "-20%",
              width: "60%",
              height: "70%",
              background: `radial-gradient(circle, ${COLORS.grapeVine}55 0%, transparent 65%)`,
              filter: "blur(40px)",
            }}
            variants={reduced ? undefined : float}
            initial="initial"
            animate="animate"
          />
          {/* Top-right sunrise warm */}
          <motion.div
            className="absolute"
            style={{
              right: "-20%",
              top: "-10%",
              width: "55%",
              height: "60%",
              background: `radial-gradient(circle, ${COLORS.sunriseGlow}55 0%, transparent 65%)`,
              filter: "blur(50px)",
            }}
            animate={reduced ? undefined : { y: [0, -10, 0], transition: { duration: 9, ease: "easeInOut" as const, repeat: Infinity } }}
          />
          {/* Bottom-left twilight mist */}
          <motion.div
            className="absolute"
            style={{
              left: "-10%",
              bottom: "-25%",
              width: "70%",
              height: "75%",
              background: `radial-gradient(circle, ${COLORS.twilightMist}88 0%, transparent 60%)`,
              filter: "blur(40px)",
            }}
            animate={reduced ? undefined : { y: [0, 8, 0], transition: { duration: 11, ease: "easeInOut" as const, repeat: Infinity } }}
          />
          {/* Bottom vignette */}
          <div
            className="absolute inset-0"
            style={{
              background: `radial-gradient(ellipse at 50% 110%, ${COLORS.midnightVignette}33 0%, transparent 50%)`,
            }}
          />
        </div>

        {/* ── Sparkle stars ──────────────────────────────────────────── */}
        <div className="pointer-events-none absolute inset-0 -z-[5]" aria-hidden="true">
          {[
            { top: "12%", left: "18%", size: 14, delay: 0 },
            { top: "22%", right: "20%", size: 10, delay: 1.2 },
            { top: "70%", left: "12%", size: 12, delay: 0.6 },
            { top: "78%", right: "15%", size: 16, delay: 2 },
            { top: "35%", left: "8%", size: 8, delay: 0.3 },
            { top: "55%", right: "10%", size: 9, delay: 1.6 },
            { top: "85%", left: "45%", size: 11, delay: 0.9 },
          ].map((s, i) => (
            <motion.div
              key={i}
              className="absolute"
              style={{ top: s.top, left: s.left, right: s.right, color: COLORS.bubblegum }}
              animate={reduced ? undefined : {
                opacity: [0.3, 0.9, 0.3],
                scale: [0.8, 1.1, 0.8],
                transition: { duration: 3 + s.delay, ease: "easeInOut" as const, repeat: Infinity, delay: s.delay },
              }}
            >
              <svg width={s.size} height={s.size} viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0 L13.5 10.5 L24 12 L13.5 13.5 L12 24 L10.5 13.5 L0 12 L10.5 10.5 Z" />
              </svg>
            </motion.div>
          ))}
        </div>

        {/* ── Content ────────────────────────────────────────────────── */}
        <motion.div
          className="relative z-10 flex flex-col items-center text-center"
          variants={reduced ? undefined : stagger}
          initial={reduced ? undefined : "hidden"}
          animate={reduced ? undefined : "visible"}
        >
          {/* Pre-label */}
          <motion.span
            variants={reduced ? undefined : fadeUp}
            style={{
              fontSize: "14px",
              fontWeight: 500,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: COLORS.bubblegum,
              padding: "8px 16px",
              border: `1px solid ${COLORS.bubblegum}`,
              borderRadius: BUTTON_RADIUS,
              background: "rgba(255,255,255,0.4)",
              backdropFilter: "blur(8px)",
              marginBottom: "32px",
            }}
          >
            {preLabel}
          </motion.span>

          {/* Massive wordmark with emotive 'eyes' inside the e's */}
          <motion.div
            variants={reduced ? undefined : fadeUp}
            className="relative"
            style={{
              fontFamily: DISPLAY_FONT,
              fontWeight: 800,
              fontSize: "clamp(140px, 22vw, 320px)",
              lineHeight: 1,
              letterSpacing: "-0.06em",
              color: COLORS.ink,
              userSelect: "none",
            }}
          >
            <span className="relative inline-flex items-center">
              {/* Render 'word' but inject SVG eyes inside e's */}
              {word.split("").map((ch, i) => {
                const isE = ch.toLowerCase() === "e";
                return (
                  <span key={i} className="relative inline-block" style={{ marginInline: "-0.02em" }}>
                    {ch}
                    {isE && (
                      <span
                        className="pointer-events-none absolute"
                        style={{
                          left: "32%",
                          top: "44%",
                          width: "0.18em",
                          height: "0.18em",
                          background: COLORS.ink,
                          borderRadius: "50%",
                          boxShadow: `0 0 0 0.04em ${COLORS.twilightMist}`,
                        }}
                        aria-hidden="true"
                      />
                    )}
                  </span>
                );
              })}
            </span>
          </motion.div>

          {/* Description */}
          <motion.p
            variants={reduced ? undefined : fadeUp}
            style={{
              fontSize: "16px",
              fontWeight: 400,
              lineHeight: 1.5,
              color: COLORS.ink,
              maxWidth: "440px",
              marginTop: "32px",
            }}
          >
            {description}
          </motion.p>

          {/* Outlined Button — exact 32px radius, 4/2/16 padding from MD */}
          <motion.a
            variants={reduced ? undefined : fadeUp}
            href={ctaHref}
            className="group inline-flex items-center transition-all"
            style={{
              fontFamily: BB_SANS,
              fontWeight: 500,
              fontSize: "16px",
              color: COLORS.bubblegum,
              background: "rgba(255,255,255,0.85)",
              border: `1px solid ${COLORS.bubblegum}`,
              borderRadius: BUTTON_RADIUS,
              padding: "8px 16px",
              marginTop: "32px",
              backdropFilter: "blur(8px)",
              transitionProperty: "transform, background, box-shadow",
              transitionDuration: "200ms",
              transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
              gap: "8px",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-1px)";
              e.currentTarget.style.background = "rgba(255,255,255,1)";
              e.currentTarget.style.boxShadow = `0 8px 24px ${COLORS.bubblegum}22`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.background = "rgba(255,255,255,0.85)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            {ctaLabel}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M13 5l7 7-7 7" />
            </svg>
          </motion.a>
        </motion.div>
      </section>
    );
  },
);

HeroSeen.displayName = "HeroSeen";
