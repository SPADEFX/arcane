"use client";

import { forwardRef, type ReactNode, type HTMLAttributes } from "react";
import { motion, type Variants } from "motion/react";
import { cn } from "@uilibrary/utils";
import { useReducedMotion } from "@uilibrary/hooks/use-reduced-motion";
import { Button } from "../components/button";

/* ─────────────────────────────────────────────
 * Hero Spotlight — Product showcase with animated grid
 *
 * Visual centerpiece: CSS animated connection grid (à la Unkey)
 * + floating UI cards with real content
 * + browser-chrome screenshot with depth
 * ───────────────────────────────────────────── */

export interface HeroSpotlightProps extends HTMLAttributes<HTMLElement> {
  badge?: string;
  headline: string;
  highlightText?: string;
  subheadline?: string;
  ctaLabel?: string;
  ctaHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
  screenshotSrc?: string;
  screenshotAlt?: string;
  dotGrid?: boolean;
  floatingCards?: boolean;
  logos?: { name: string; src?: string }[];
  children?: ReactNode;
}

/* ── Animation ──────────────────────────────── */

const EASE = [0.16, 1, 0.3, 1] as const;

const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
};

const revealUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

const screenshotReveal: Variants = {
  hidden: { opacity: 0, y: 48, scale: 0.97 },
  visible: {
    opacity: 1, y: 0, scale: 1,
    transition: { duration: 0.9, ease: EASE, delay: 0.4 },
  },
};

const float = (delay: number, y: number) => ({
  y: [0, y, 0],
  transition: { duration: 5 + delay, ease: "easeInOut" as const, repeat: Infinity },
});

/* ── Grid keyframes ─────────────────────────── */

const gridKeyframes = `
@keyframes spotlight-grid-pulse {
  0%, 100% { opacity: 0.03; }
  50%      { opacity: 0.08; }
}
@keyframes spotlight-node-glow {
  0%, 100% { opacity: 0.15; transform: scale(1); }
  50%      { opacity: 0.5; transform: scale(1.8); }
}
@keyframes spotlight-line-flow {
  0%   { stroke-dashoffset: 200; }
  100% { stroke-dashoffset: 0; }
}
`;

/* ── Component ──────────────────────────────── */

export const HeroSpotlight = forwardRef<HTMLElement, HeroSpotlightProps>(
  (
    {
      badge,
      headline,
      highlightText,
      subheadline,
      ctaLabel = "Get Started",
      ctaHref = "#",
      secondaryLabel,
      secondaryHref = "#",
      screenshotSrc,
      screenshotAlt = "Product screenshot",
      dotGrid = true,
      floatingCards = true,
      logos,
      children,
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
          "relative isolate overflow-hidden",
          "px-6 pt-[clamp(6rem,12vh,9rem)] pb-[clamp(2rem,4vh,4rem)]",
          className,
        )}
        {...props}
      >
        {!reduced && <style dangerouslySetInnerHTML={{ __html: gridKeyframes }} />}

        {/* ── Animated connection grid ────────────── */}
        {dotGrid && (
          <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
            {/* Base dot grid */}
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: "radial-gradient(circle, var(--color-accent) 0.8px, transparent 0.8px)",
                backgroundSize: "48px 48px",
                opacity: 0.06,
                animation: reduced ? "none" : "spotlight-grid-pulse 4s ease-in-out infinite",
                maskImage: "radial-gradient(ellipse 70% 60% at 50% 40%, black 20%, transparent 70%)",
                WebkitMaskImage: "radial-gradient(ellipse 70% 60% at 50% 40%, black 20%, transparent 70%)",
              }}
            />
            {/* Connection lines SVG */}
            <svg className="absolute inset-0 h-full w-full" style={{ opacity: 0.08 }}>
              {/* Horizontal lines */}
              {[20, 35, 50, 65, 80].map((y) => (
                <line
                  key={`h-${y}`}
                  x1="10%" y1={`${y}%`} x2="90%" y2={`${y}%`}
                  stroke="var(--color-accent)"
                  strokeWidth="0.5"
                  strokeDasharray="4 12"
                  style={{
                    animation: reduced ? "none" : `spotlight-line-flow ${6 + y * 0.1}s linear infinite`,
                  }}
                />
              ))}
              {/* Vertical lines */}
              {[20, 35, 50, 65, 80].map((x) => (
                <line
                  key={`v-${x}`}
                  x1={`${x}%`} y1="10%" x2={`${x}%`} y2="90%"
                  stroke="var(--color-accent)"
                  strokeWidth="0.5"
                  strokeDasharray="4 12"
                  style={{
                    animation: reduced ? "none" : `spotlight-line-flow ${7 + x * 0.1}s linear infinite`,
                  }}
                />
              ))}
              {/* Glowing intersection nodes */}
              {[
                [35, 35], [50, 35], [65, 35],
                [35, 50], [50, 50], [65, 50],
                [35, 65], [50, 65], [65, 65],
              ].map(([cx, cy], i) => (
                <circle
                  key={`n-${i}`}
                  cx={`${cx}%`} cy={`${cy}%`} r="2"
                  fill="var(--color-accent)"
                  style={{
                    animation: reduced ? "none" : `spotlight-node-glow ${3 + i * 0.5}s ease-in-out ${i * 0.3}s infinite`,
                  }}
                />
              ))}
              {/* Center bright node */}
              <circle cx="50%" cy="50%" r="3" fill="var(--color-accent)" opacity="0.4">
                {!reduced && (
                  <animate attributeName="r" values="3;5;3" dur="3s" repeatCount="indefinite" />
                )}
              </circle>
              <circle cx="50%" cy="50%" r="8" fill="none" stroke="var(--color-accent)" strokeWidth="0.5" opacity="0.15">
                {!reduced && (
                  <animate attributeName="r" values="8;16;8" dur="4s" repeatCount="indefinite" />
                )}
              </circle>
            </svg>
          </div>
        )}

        {/* ── Content ─────────────────────────────── */}
        <motion.div
          className="relative z-10 mx-auto flex w-full max-w-[1100px] flex-col items-center text-center"
          variants={reduced ? undefined : stagger}
          initial={reduced ? undefined : "hidden"}
          animate={reduced ? undefined : "visible"}
        >
          {badge && (
            <motion.p
              variants={reduced ? undefined : revealUp}
              className="mb-6 text-[11px] font-medium uppercase tracking-[0.2em] text-[var(--color-text-muted)]"
            >
              {badge}
            </motion.p>
          )}

          <motion.h1
            variants={reduced ? undefined : revealUp}
            className={cn(
              "max-w-[900px]",
              "font-[var(--font-instrument-serif)]",
              "text-[clamp(2.5rem,6vw+0.5rem,5.5rem)]",
              "font-normal leading-[1.05] tracking-[-0.04em]",
              "text-[var(--color-text)]",
              "text-balance",
            )}
          >
            {headline}
            {highlightText && (
              <> <em className="not-italic text-[var(--color-accent)]">{highlightText}</em></>
            )}
          </motion.h1>

          <motion.div variants={reduced ? undefined : revealUp} className="mt-8 h-px w-16 bg-[var(--color-border)]" />

          {subheadline && (
            <motion.p
              variants={reduced ? undefined : revealUp}
              className="mt-6 max-w-[500px] text-[var(--font-text-md)] leading-[1.7] text-[var(--color-text-secondary)]"
            >
              {subheadline}
            </motion.p>
          )}

          <motion.div variants={reduced ? undefined : revealUp} className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Button size="lg" asChild><a href={ctaHref}>{ctaLabel}</a></Button>
            {secondaryLabel && (
              <Button variant="ghost" size="lg" asChild><a href={secondaryHref}>{secondaryLabel}</a></Button>
            )}
          </motion.div>

          {logos && logos.length > 0 && (
            <motion.div variants={reduced ? undefined : revealUp} className="mt-14 flex flex-col items-center gap-4">
              <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-[var(--color-text-muted)]">Trusted by</p>
              <div className="flex flex-wrap items-center justify-center gap-8">
                {logos.map((logo) =>
                  logo.src ? (
                    <img key={logo.name} src={logo.src} alt={logo.name} className="h-5 w-auto object-contain opacity-40 grayscale" />
                  ) : (
                    <span key={logo.name} className="text-[13px] font-medium tracking-tight text-[var(--color-text-muted)]">{logo.name}</span>
                  ),
                )}
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* ── Screenshot with depth ───────────────── */}
        {screenshotSrc && (
          <motion.div
            className="relative mx-auto mt-20 w-full max-w-[1060px]"
            variants={reduced ? undefined : screenshotReveal}
            initial={reduced ? undefined : "hidden"}
            animate={reduced ? undefined : "visible"}
            style={{ perspective: "1400px" }}
          >
            {floatingCards && !reduced && (
              <>
                <motion.div
                  className={cn(
                    "absolute -left-3 top-[18%] z-20 hidden lg:block",
                    "rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-3.5 py-2.5",
                    "shadow-[0_2px_8px_rgb(0_0_0/0.06),0_8px_24px_rgb(0_0_0/0.04)]",
                    "dark:shadow-[0_2px_8px_rgb(0_0_0/0.3),0_8px_24px_rgb(0_0_0/0.2)]",
                  )}
                  animate={float(0, -8)}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-6 w-6 items-center justify-center rounded-md bg-emerald-500/10 text-emerald-500">
                      <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M3 8.5L6.5 12L13 4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </div>
                    <div>
                      <p className="text-[12px] font-medium text-[var(--color-text)]">Build passed</p>
                      <p className="text-[10px] text-[var(--color-text-muted)]">2m ago</p>
                    </div>
                  </div>
                </motion.div>
                <motion.div
                  className={cn(
                    "absolute -right-3 top-[30%] z-20 hidden lg:block",
                    "rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-3.5 py-2.5",
                    "shadow-[0_2px_8px_rgb(0_0_0/0.06),0_8px_24px_rgb(0_0_0/0.04)]",
                    "dark:shadow-[0_2px_8px_rgb(0_0_0/0.3),0_8px_24px_rgb(0_0_0/0.2)]",
                  )}
                  animate={float(2, -6)}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-6 w-6 items-center justify-center rounded-md bg-amber-500/10 text-amber-500">
                      <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M8 2v8M5 7l3 3 3-3" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </div>
                    <div>
                      <p className="text-[12px] font-medium text-[var(--color-text)]">+42% this week</p>
                      <p className="text-[10px] text-[var(--color-text-muted)]">Conversions</p>
                    </div>
                  </div>
                </motion.div>
              </>
            )}

            <div
              className={cn(
                "overflow-hidden rounded-xl border border-[var(--color-border)]",
                "shadow-[0_1px_2px_rgb(0_0_0/0.04),0_4px_12px_rgb(0_0_0/0.04),0_16px_40px_rgb(0_0_0/0.06)]",
                "dark:shadow-[0_1px_2px_rgb(0_0_0/0.2),0_4px_12px_rgb(0_0_0/0.2),0_16px_40px_rgb(0_0_0/0.25)]",
              )}
              style={{ transform: "rotateX(2deg)" }}
            >
              <div className="flex h-9 items-center border-b border-[var(--color-border)] bg-[var(--color-bg-subtle)] px-3.5">
                <div className="flex gap-[6px]">
                  <div className="h-[10px] w-[10px] rounded-full bg-[var(--color-text-muted)] opacity-20" />
                  <div className="h-[10px] w-[10px] rounded-full bg-[var(--color-text-muted)] opacity-20" />
                  <div className="h-[10px] w-[10px] rounded-full bg-[var(--color-text-muted)] opacity-20" />
                </div>
              </div>
              <img src={screenshotSrc} alt={screenshotAlt} className="block w-full" loading="lazy" />
            </div>
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24" style={{ background: "linear-gradient(to top, var(--color-bg), transparent)" }} />
          </motion.div>
        )}

        {children && <div className="relative z-10 mx-auto mt-12 w-full max-w-[1100px]">{children}</div>}
      </section>
    );
  },
);

HeroSpotlight.displayName = "HeroSpotlight";
