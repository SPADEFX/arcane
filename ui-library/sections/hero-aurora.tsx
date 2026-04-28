"use client";

import { forwardRef, type ReactNode, type HTMLAttributes } from "react";
import { motion, type Variants } from "motion/react";
import { cn } from "@uilibrary/utils";
import { useReducedMotion } from "@uilibrary/hooks/use-reduced-motion";
import { Button } from "../components/button";

/* ─────────────────────────────────────────────
 * Hero Aurora — Cinematic dark hero with mesh grid
 *
 * Visual centerpiece: animated perspective mesh grid (like Unkey)
 * + aurora color blobs + noise grain
 * + glowing center node with ripple
 * ───────────────────────────────────────────── */

export interface HeroAuroraProps extends HTMLAttributes<HTMLElement> {
  headline: string;
  highlightText?: string;
  subheadline?: string;
  ctaLabel?: string;
  ctaHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
  colorScheme?: "blue" | "purple" | "emerald" | "rose" | "amber";
  grain?: boolean;
  statLine?: string;
  children?: ReactNode;
}

const auroraColors: Record<
  NonNullable<HeroAuroraProps["colorScheme"]>,
  { a: string; b: string; c: string }
> = {
  blue: { a: "#3b82f6", b: "#60a5fa", c: "#93c5fd" },
  purple: { a: "#8b5cf6", b: "#a78bfa", c: "#c4b5fd" },
  emerald: { a: "#059669", b: "#34d399", c: "#6ee7b7" },
  rose: { a: "#e11d48", b: "#fb7185", c: "#fda4af" },
  amber: { a: "#d97706", b: "#fbbf24", c: "#fde68a" },
};

/* ── Animation ──────────────────────────────── */

const EASE = [0.16, 1, 0.3, 1] as const;

const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.14, delayChildren: 0.3 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } },
};

const auroraKeyframes = `
@keyframes aurora-blob-a {
  0%, 100% { transform: translate(0, 0) scale(1) rotate(0deg); }
  33%      { transform: translate(5%, -8%) scale(1.05) rotate(3deg); }
  66%      { transform: translate(-3%, 5%) scale(0.97) rotate(-2deg); }
}
@keyframes aurora-blob-b {
  0%, 100% { transform: translate(0, 0) scale(1) rotate(0deg); }
  33%      { transform: translate(-6%, 4%) scale(1.08) rotate(-3deg); }
  66%      { transform: translate(4%, -6%) scale(0.95) rotate(2deg); }
}
@keyframes aurora-blob-c {
  0%, 100% { transform: translate(0, 0) scale(1); }
  50%      { transform: translate(3%, 6%) scale(1.04); }
}
@keyframes aurora-ripple {
  0%   { r: 4; opacity: 0.6; }
  100% { r: 60; opacity: 0; }
}
@keyframes aurora-grid-pulse {
  0%, 100% { opacity: 0.06; }
  50%      { opacity: 0.12; }
}
`;

/* ── Component ──────────────────────────────── */

export const HeroAurora = forwardRef<HTMLElement, HeroAuroraProps>(
  (
    {
      headline,
      highlightText,
      subheadline,
      ctaLabel = "Get Started",
      ctaHref = "#",
      secondaryLabel,
      secondaryHref = "#",
      colorScheme = "blue",
      grain = true,
      statLine,
      children,
      className,
      ...props
    },
    ref,
  ) => {
    const reduced = useReducedMotion();
    const colors = auroraColors[colorScheme];

    /* Grid lines for the perspective mesh */
    const gridLines = 12;
    const gridRange = Array.from({ length: gridLines + 1 }, (_, i) => (i / gridLines) * 100);

    return (
      <section
        ref={ref}
        className={cn(
          "relative isolate flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden",
          "bg-[#0a0a0a] px-6 py-[clamp(6rem,12vh,10rem)]",
          "text-center",
          className,
        )}
        {...props}
      >
        {!reduced && <style dangerouslySetInnerHTML={{ __html: auroraKeyframes }} />}

        {/* ── Perspective mesh grid ───────────────── */}
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
          {/* Grid SVG with perspective */}
          <svg
            className="absolute inset-0 h-full w-full"
            style={{
              perspective: "800px",
              transform: "rotateX(40deg) scale(1.8)",
              transformOrigin: "50% 80%",
              opacity: 0.15,
              animation: reduced ? "none" : "aurora-grid-pulse 5s ease-in-out infinite",
            }}
          >
            {/* Horizontal lines */}
            {gridRange.map((y) => (
              <line
                key={`h-${y}`}
                x1="0%" y1={`${y}%`} x2="100%" y2={`${y}%`}
                stroke={colors.a}
                strokeWidth="0.5"
              />
            ))}
            {/* Vertical lines */}
            {gridRange.map((x) => (
              <line
                key={`v-${x}`}
                x1={`${x}%`} y1="0%" x2={`${x}%`} y2="100%"
                stroke={colors.a}
                strokeWidth="0.5"
              />
            ))}
          </svg>

          {/* Glowing center node */}
          <svg className="absolute inset-0 h-full w-full" style={{ opacity: 1 }}>
            <circle cx="50%" cy="55%" r="3" fill={colors.b} opacity="0.8" />
            <circle cx="50%" cy="55%" r="6" fill={colors.b} opacity="0.3" />
            <circle cx="50%" cy="55%" r="12" fill="none" stroke={colors.b} strokeWidth="0.5" opacity="0.2" />
            {/* Ripple rings */}
            {!reduced && [0, 1, 2].map((i) => (
              <circle
                key={`ripple-${i}`}
                cx="50%" cy="55%"
                r="4" fill="none"
                stroke={colors.b}
                strokeWidth="0.5"
              >
                <animate attributeName="r" values="4;60" dur="4s" begin={`${i * 1.3}s`} repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.4;0" dur="4s" begin={`${i * 1.3}s`} repeatCount="indefinite" />
              </circle>
            ))}
          </svg>

          {/* Aurora blobs */}
          <div
            className="absolute left-[5%] top-[0%] h-[70vh] w-[60vw] rounded-full blur-[100px]"
            style={{
              background: `radial-gradient(circle, ${colors.a}, transparent 65%)`,
              opacity: 0.35,
              animation: reduced ? "none" : "aurora-blob-a 12s ease-in-out infinite",
            }}
          />
          <div
            className="absolute right-[0%] top-[15%] h-[55vh] w-[50vw] rounded-full blur-[90px]"
            style={{
              background: `radial-gradient(circle, ${colors.b}, transparent 65%)`,
              opacity: 0.25,
              animation: reduced ? "none" : "aurora-blob-b 15s ease-in-out infinite",
            }}
          />
          <div
            className="absolute bottom-[5%] left-[20%] h-[50vh] w-[55vw] rounded-full blur-[100px]"
            style={{
              background: `radial-gradient(circle, ${colors.c}, transparent 65%)`,
              opacity: 0.2,
              animation: reduced ? "none" : "aurora-blob-c 18s ease-in-out infinite",
            }}
          />

          {/* Vignette */}
          <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 70% 55% at 50% 50%, transparent 30%, #0a0a0a 100%)" }} />
        </div>

        {/* ── Grain ───────────────────────────────── */}
        {grain && (
          <div
            className="pointer-events-none absolute inset-0 -z-[5] opacity-[0.04]"
            aria-hidden="true"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
              backgroundRepeat: "repeat",
              backgroundSize: "128px 128px",
            }}
          />
        )}

        {/* ── Content ─────────────────────────────── */}
        <motion.div
          className="relative z-10 mx-auto flex w-full max-w-[860px] flex-col items-center"
          variants={reduced ? undefined : stagger}
          initial={reduced ? undefined : "hidden"}
          animate={reduced ? undefined : "visible"}
        >
          <motion.h1
            variants={reduced ? undefined : fadeUp}
            className={cn(
              "max-w-[780px]",
              "font-[var(--font-syne)]",
              "text-[clamp(2.5rem,6vw+1rem,5.5rem)]",
              "font-extrabold leading-[1.02] tracking-[-0.03em]",
              "text-white",
              "text-balance",
            )}
          >
            {headline}
            {highlightText && (
              <> <span className="font-light" style={{ color: colors.b }}>{highlightText}</span></>
            )}
          </motion.h1>

          {subheadline && (
            <motion.p
              variants={reduced ? undefined : fadeUp}
              className="mt-8 max-w-[480px] text-[15px] leading-[1.7] text-white/45"
            >
              {subheadline}
            </motion.p>
          )}

          <motion.div variants={reduced ? undefined : fadeUp} className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Button size="lg" asChild className="border-0 bg-white text-[#0a0a0a] hover:bg-white/90">
              <a href={ctaHref}>{ctaLabel}</a>
            </Button>
            {secondaryLabel && (
              <Button variant="outline" size="lg" asChild className="border-white/15 text-white/70 hover:border-white/30 hover:bg-white/5 hover:text-white">
                <a href={secondaryHref}>{secondaryLabel}</a>
              </Button>
            )}
          </motion.div>

          {statLine && (
            <motion.p variants={reduced ? undefined : fadeUp} className="mt-10 font-[var(--font-jetbrains)] text-[12px] tracking-wide text-white/25">
              {statLine}
            </motion.p>
          )}
        </motion.div>

        {children && <div className="relative z-10 mx-auto mt-16 w-full max-w-[1100px]">{children}</div>}
      </section>
    );
  },
);

HeroAurora.displayName = "HeroAurora";
