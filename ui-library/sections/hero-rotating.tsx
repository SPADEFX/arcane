"use client";

import {
  forwardRef,
  useState,
  useEffect,
  type ReactNode,
  type HTMLAttributes,
} from "react";
import { motion, AnimatePresence, type Variants } from "motion/react";
import { cn } from "@uilibrary/utils";
import { useReducedMotion } from "@uilibrary/hooks/use-reduced-motion";
import { Button } from "../components/button";

/* ─────────────────────────────────────────────
 * Hero Rotating — Dynamic headline with word cycling
 *
 * Anti-slop choices:
 * - Bebas Neue for the rotating word — condensed, bold, distinct
 * - Body in Space Grotesk — geometric, not Inter
 * - Rotating word uses an underline accent, NOT gradient text
 * - Left-aligned on desktop (not centered)
 * - No blob gradients, no badge pills
 * - Minimal — headline + subtext + one CTA
 * ───────────────────────────────────────────── */

export interface HeroRotatingProps extends HTMLAttributes<HTMLElement> {
  headlinePrefix?: string;
  rotatingWords: string[];
  headlineSuffix?: string;
  subheadline?: string;
  badge?: string;
  ctaLabel?: string;
  ctaHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
  animation?: "slide" | "fade" | "blur" | "flip";
  interval?: number;
  gradient?: boolean;
  logos?: { name: string; src?: string }[];
  /** Code lines to show in the floating terminal */
  codeLines?: string[];
  children?: ReactNode;
}

/* ── Animation ──────────────────────────────── */

const EASE = [0.16, 1, 0.3, 1] as const;

const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: EASE } },
};

const wordAnims = {
  slide: {
    initial: { y: "110%", opacity: 0 },
    animate: { y: "0%", opacity: 1 },
    exit: { y: "-110%", opacity: 0 },
  },
  fade: {
    initial: { opacity: 0, scale: 0.96 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 1.04 },
  },
  blur: {
    initial: { opacity: 0, filter: "blur(10px)", y: 6 },
    animate: { opacity: 1, filter: "blur(0px)", y: 0 },
    exit: { opacity: 0, filter: "blur(10px)", y: -6 },
  },
  flip: {
    initial: { rotateX: 90, opacity: 0 },
    animate: { rotateX: 0, opacity: 1 },
    exit: { rotateX: -90, opacity: 0 },
  },
};

/* ── Component ──────────────────────────────── */

export const HeroRotating = forwardRef<HTMLElement, HeroRotatingProps>(
  (
    {
      headlinePrefix = "Build",
      rotatingWords = ["faster", "smarter", "better"],
      headlineSuffix,
      subheadline,
      badge,
      ctaLabel = "Get Started",
      ctaHref = "#",
      secondaryLabel,
      secondaryHref = "#",
      animation = "slide",
      interval = 3000,
      gradient = false,
      logos,
      codeLines,
      children,
      className,
      ...props
    },
    ref,
  ) => {
    const reduced = useReducedMotion();
    const [index, setIndex] = useState(0);

    useEffect(() => {
      if (reduced) return;
      const timer = setInterval(() => {
        setIndex((prev) => (prev + 1) % rotatingWords.length);
      }, interval);
      return () => clearInterval(timer);
    }, [rotatingWords.length, interval, reduced]);

    const anim = wordAnims[animation];
    const longestWord = rotatingWords.reduce((a, b) => (a.length > b.length ? a : b), "");

    return (
      <section
        ref={ref}
        className={cn(
          "relative isolate overflow-hidden",
          "px-6 py-[clamp(7rem,14vh,12rem)]",
          className,
        )}
        {...props}
      >
        <div className={cn(
          "mx-auto grid w-full max-w-[1200px] items-center gap-12 lg:gap-20",
          "grid-cols-1",
          codeLines && codeLines.length > 0 && "lg:grid-cols-12",
        )}>
        <motion.div
          className={cn(
            "flex flex-col items-start",
            codeLines && codeLines.length > 0 ? "lg:col-span-6" : "max-w-[900px]",
          )}
          variants={reduced ? undefined : stagger}
          initial={reduced ? undefined : "hidden"}
          animate={reduced ? undefined : "visible"}
        >
          {/* Badge — plain uppercase label */}
          {badge && (
            <motion.p
              variants={reduced ? undefined : fadeUp}
              className="mb-6 text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--color-text-muted)]"
            >
              {badge}
            </motion.p>
          )}

          {/* Headline with rotating word */}
          <motion.div
            variants={reduced ? undefined : fadeUp}
            className={cn(
              "font-[var(--font-space-grotesk)]",
              "text-[clamp(2.5rem,5.5vw+1rem,5rem)]",
              "font-bold leading-[1.08] tracking-[-0.04em]",
              "text-[var(--color-text)]",
            )}
            role="heading"
            aria-level={1}
          >
            {headlinePrefix && <span>{headlinePrefix}</span>}
            {" "}
            {/* Rotating word */}
            <span
              className="relative inline-block overflow-hidden align-bottom"
              style={{
                width: `${longestWord.length * 0.6}em`,
                height: "1.15em",
                perspective: animation === "flip" ? "800px" : undefined,
              }}
            >
              <AnimatePresence mode="popLayout">
                <motion.span
                  key={rotatingWords[index]}
                  className={cn(
                    "absolute left-0 top-0 inline-block whitespace-nowrap",
                    "text-[var(--color-accent)]",
                    /* Underline accent — bold line */
                    "decoration-[var(--color-accent)] underline decoration-[4px] underline-offset-[8px]",
                  )}
                  initial={reduced ? {} : anim.initial}
                  animate={reduced ? {} : anim.animate}
                  exit={reduced ? {} : anim.exit}
                  transition={
                    reduced
                      ? { duration: 0 }
                      : { duration: 0.45, ease: [0.22, 1, 0.36, 1] }
                  }
                >
                  {rotatingWords[index]}
                </motion.span>
              </AnimatePresence>
            </span>
            {headlineSuffix && <span> {headlineSuffix}</span>}
          </motion.div>

          {/* Subheadline */}
          {subheadline && (
            <motion.p
              variants={reduced ? undefined : fadeUp}
              className={cn(
                "mt-6 max-w-[520px]",
                "text-[15px] leading-[1.7]",
                "text-[var(--color-text-secondary)]",
              )}
            >
              {subheadline}
            </motion.p>
          )}

          {/* CTAs */}
          <motion.div
            variants={reduced ? undefined : fadeUp}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <Button size="lg" asChild>
              <a href={ctaHref}>{ctaLabel}</a>
            </Button>
            {secondaryLabel && (
              <Button variant="ghost" size="lg" asChild>
                <a href={secondaryHref}>{secondaryLabel}</a>
              </Button>
            )}
          </motion.div>

          {/* Logos */}
          {logos && logos.length > 0 && (
            <motion.div
              variants={reduced ? undefined : fadeUp}
              className="mt-16"
            >
              <div className="mb-3 h-px w-8 bg-[var(--color-border)]" />
              <div className="flex flex-wrap items-center gap-6">
                {logos.map((logo) =>
                  logo.src ? (
                    <img
                      key={logo.name}
                      src={logo.src}
                      alt={logo.name}
                      className="h-4 w-auto object-contain opacity-40 grayscale"
                    />
                  ) : (
                    <span
                      key={logo.name}
                      className="text-[12px] font-medium text-[var(--color-text-muted)]"
                    >
                      {logo.name}
                    </span>
                  ),
                )}
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* ── Floating terminal ─────────────────── */}
        {codeLines && codeLines.length > 0 && (
          <motion.div
            className="relative hidden lg:col-span-6 lg:block"
            initial={reduced ? undefined : { opacity: 0, x: 32, scale: 0.96 }}
            animate={reduced ? undefined : { opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.3 }}
          >
            <div
              className={cn(
                "overflow-hidden rounded-lg",
                "border border-[var(--color-border)]",
                "bg-[#0a0a0a] dark:bg-[#0a0a0a]",
                "shadow-[0_2px_8px_rgb(0_0_0/0.1),0_12px_40px_rgb(0_0_0/0.12)]",
                "dark:shadow-[0_2px_8px_rgb(0_0_0/0.4),0_12px_40px_rgb(0_0_0/0.3)]",
              )}
            >
              {/* Terminal header */}
              <div className="flex h-8 items-center gap-[6px] border-b border-white/[0.06] px-3">
                <div className="h-[9px] w-[9px] rounded-full bg-[#ff5f57] opacity-80" />
                <div className="h-[9px] w-[9px] rounded-full bg-[#febc2e] opacity-80" />
                <div className="h-[9px] w-[9px] rounded-full bg-[#28c840] opacity-80" />
                <span className="ml-2 text-[10px] text-white/20">terminal</span>
              </div>
              {/* Code lines */}
              <div className="p-4 font-[var(--font-jetbrains)] text-[13px] leading-[1.8]">
                {codeLines.map((line, i) => (
                  <motion.div
                    key={i}
                    initial={reduced ? undefined : { opacity: 0, x: -8 }}
                    animate={reduced ? undefined : { opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, ease: EASE, delay: 0.5 + i * 0.08 }}
                  >
                    {line.startsWith("//") || line.startsWith("#") ? (
                      <span className="text-white/20">{line}</span>
                    ) : line.startsWith("$") ? (
                      <span>
                        <span className="text-emerald-400/70">$</span>
                        <span className="text-white/60">{line.slice(1)}</span>
                      </span>
                    ) : line.includes("=") || line.includes(":") ? (
                      <span>
                        <span className="text-[#7dd3fc]">{line.split(/[=:]/)[0]}</span>
                        <span className="text-white/30">{line.includes("=") ? "=" : ":"}</span>
                        <span className="text-amber-300/70">{line.split(/[=:]/)[1]}</span>
                      </span>
                    ) : (
                      <span className="text-white/50">{line}</span>
                    )}
                  </motion.div>
                ))}
                {/* Blinking cursor */}
                <motion.span
                  className="inline-block h-[14px] w-[7px] bg-[var(--color-accent)]"
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 1, repeat: Infinity, ease: "steps(1)" }}
                />
              </div>
            </div>
          </motion.div>
        )}
        </div>

        {children && (
          <div className="relative z-10 mx-auto mt-16 w-full max-w-[1200px]">
            {children}
          </div>
        )}
      </section>
    );
  },
);

HeroRotating.displayName = "HeroRotating";
