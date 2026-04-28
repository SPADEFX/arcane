"use client";

import { forwardRef, type ReactNode, type HTMLAttributes } from "react";
import { motion } from "motion/react";
import { cn } from "@uilibrary/utils";
import { useReducedMotion } from "@uilibrary/hooks/use-reduced-motion";
import { Button } from "../components/button";
import { Badge } from "../components/badge";

/* ─────────────────────────────────────────────
 * Types
 * ───────────────────────────────────────────── */

export interface HeroSectionProps extends HTMLAttributes<HTMLElement> {
  /** Main headline text */
  headline: string;
  /** Gradient-accented portion appended to the headline */
  highlightText?: string;
  /** Paragraph beneath the headline */
  subheadline?: string;
  /** Small pill badge displayed above the headline */
  badge?: string;
  /** Primary CTA */
  ctaLabel?: string;
  ctaHref?: string;
  /** Secondary ghost CTA */
  secondaryLabel?: string;
  secondaryHref?: string;
  /** Toggle the subtle radial background glow */
  gradient?: boolean;
  /** Slot below buttons (social proof, logos, etc.) */
  children?: ReactNode;
}

/* ─────────────────────────────────────────────
 * Animation constants
 * ───────────────────────────────────────────── */

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

const fadeUp = (delay: number, skip: boolean) =>
  skip
    ? {}
    : {
        initial: { opacity: 0, y: 28 } as const,
        animate: { opacity: 1, y: 0 } as const,
        transition: { duration: 0.8, ease: EASE_OUT_EXPO, delay },
      };

/* ─────────────────────────────────────────────
 * Component
 * ───────────────────────────────────────────── */

export const HeroSection = forwardRef<HTMLElement, HeroSectionProps>(
  (
    {
      headline,
      highlightText,
      subheadline,
      badge,
      ctaLabel = "Get Started",
      ctaHref = "#",
      secondaryLabel,
      secondaryHref = "#",
      gradient = true,
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
          "relative isolate flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden",
          "px-6 pt-[clamp(7rem,14vh,10rem)] pb-[clamp(5rem,10vh,8rem)]",
          "text-center",
          className,
        )}
        {...props}
      >
        {/* ── Background glow ─────────────────────── */}
        {gradient && (
          <div
            className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
            aria-hidden="true"
          >
            {/* Primary large glow */}
            <div
              className={cn(
                "absolute left-1/2 top-[8%] -translate-x-1/2",
                "h-[min(700px,80vh)] w-[min(900px,90vw)]",
                "rounded-full opacity-[0.07]",
                "bg-[radial-gradient(ellipse_at_center,var(--color-accent),transparent_70%)]",
                "blur-[100px]",
                "dark:opacity-[0.12]",
              )}
            />
            {/* Secondary accent — offset left */}
            <div
              className={cn(
                "absolute -left-[10%] top-[30%]",
                "h-[400px] w-[400px]",
                "rounded-full opacity-[0.04]",
                "bg-[radial-gradient(circle,var(--color-brand-400),transparent_70%)]",
                "blur-[80px]",
                "dark:opacity-[0.08]",
              )}
            />
            {/* Tertiary accent — offset right */}
            <div
              className={cn(
                "absolute -right-[8%] top-[20%]",
                "h-[350px] w-[350px]",
                "rounded-full opacity-[0.03]",
                "bg-[radial-gradient(circle,var(--color-brand-300),transparent_70%)]",
                "blur-[80px]",
                "dark:opacity-[0.06]",
              )}
            />
          </div>
        )}

        {/* ── Content ─────────────────────────────── */}
        <div className="relative z-10 mx-auto flex w-full max-w-[1200px] flex-col items-center">
          {/* Badge */}
          {badge && (
            <motion.div {...fadeUp(0, reduced)} className="mb-7">
              <Badge
                variant="outline"
                className={cn(
                  "px-4 py-1.5 text-[var(--font-text-xs)] font-medium tracking-wide",
                  "border-[var(--color-border)] bg-[var(--color-bg-subtle)]",
                  "text-[var(--color-text-secondary)]",
                  "shadow-[var(--shadow-xs)]",
                  "backdrop-blur-sm",
                )}
              >
                {badge}
              </Badge>
            </motion.div>
          )}

          {/* Headline */}
          <motion.h1
            {...fadeUp(0.08, reduced)}
            className={cn(
              "max-w-[900px]",
              "text-[clamp(2.25rem,5.5vw+1rem,5rem)]",
              "font-bold leading-[1.08] tracking-[-0.025em]",
              "text-[var(--color-text)]",
              "text-balance",
            )}
          >
            {headline}
            {highlightText && (
              <>
                {" "}
                <span
                  className={cn(
                    "inline-block bg-clip-text text-transparent",
                    "bg-gradient-to-r from-[var(--color-brand-500)] via-[var(--color-accent)] to-[var(--color-brand-400)]",
                    "dark:from-[var(--color-brand-400)] dark:via-[var(--color-accent)] dark:to-[var(--color-brand-300)]",
                  )}
                >
                  {highlightText}
                </span>
              </>
            )}
          </motion.h1>

          {/* Subheadline */}
          {subheadline && (
            <motion.p
              {...fadeUp(0.18, reduced)}
              className={cn(
                "mt-6 max-w-[620px]",
                "text-[clamp(1.05rem,1.2vw+0.5rem,1.3rem)]",
                "leading-[1.6] tracking-[-0.01em]",
                "text-[var(--color-text-secondary)]",
                "text-balance",
              )}
            >
              {subheadline}
            </motion.p>
          )}

          {/* CTA Buttons */}
          <motion.div
            {...fadeUp(0.3, reduced)}
            className="mt-10 flex flex-wrap items-center justify-center gap-4"
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

          {/* Optional children slot */}
          {children && (
            <motion.div
              {...fadeUp(0.45, reduced)}
              className="mt-20 w-full"
            >
              {children}
            </motion.div>
          )}
        </div>
      </section>
    );
  },
);

HeroSection.displayName = "HeroSection";
