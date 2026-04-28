"use client";

import { forwardRef, type HTMLAttributes } from "react";
import { motion } from "motion/react";
import { cn } from "@uilibrary/utils";
import { useReducedMotion } from "@uilibrary/hooks/use-reduced-motion";
import { Button } from "../components/button";

/* ─────────────────────────────────────────────
 * Types
 * ───────────────────────────────────────────── */

export type CTAVariant = "gradient" | "solid" | "subtle";

export interface CTASectionProps extends HTMLAttributes<HTMLElement> {
  headline: string;
  subheadline?: string;
  ctaLabel?: string;
  ctaHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
  /** "gradient" = accent gradient bg, "solid" = accent solid bg, "subtle" = dark card */
  variant?: CTAVariant;
}

/* ─────────────────────────────────────────────
 * Animation
 * ───────────────────────────────────────────── */

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

/* ─────────────────────────────────────────────
 * Variant styles
 * ───────────────────────────────────────────── */

const containerStyles: Record<CTAVariant, string> = {
  gradient: cn(
    "bg-gradient-to-br from-[var(--color-brand-600)] via-[var(--color-accent)] to-[var(--color-brand-500)]",
    "dark:from-[var(--color-brand-700)] dark:via-[var(--color-brand-600)] dark:to-[var(--color-accent)]",
  ),
  solid: cn(
    "bg-[var(--color-accent)]",
  ),
  subtle: cn(
    "bg-[var(--color-bg-subtle)] border border-[var(--color-border)]",
    "dark:bg-[var(--color-bg-elevated)]",
  ),
};

const headlineColor: Record<CTAVariant, string> = {
  gradient: "text-white",
  solid: "text-white",
  subtle: "text-[var(--color-text)]",
};

const subColor: Record<CTAVariant, string> = {
  gradient: "text-white/75",
  solid: "text-white/70",
  subtle: "text-[var(--color-text-secondary)]",
};

/* ─────────────────────────────────────────────
 * Component
 * ───────────────────────────────────────────── */

export const CTASection = forwardRef<HTMLElement, CTASectionProps>(
  (
    {
      headline,
      subheadline,
      ctaLabel = "Get Started",
      ctaHref = "#",
      secondaryLabel,
      secondaryHref = "#",
      variant = "gradient",
      className,
      ...props
    },
    ref,
  ) => {
    const reduced = useReducedMotion();

    const inverted = variant === "gradient" || variant === "solid";

    return (
      <section
        ref={ref}
        className={cn("px-6 py-[clamp(4rem,8vh,6rem)]", className)}
        {...props}
      >
        <motion.div
          className={cn(
            "relative isolate mx-auto max-w-[1000px] overflow-hidden",
            "rounded-[var(--radius-2xl)]",
            "px-8 py-[clamp(4rem,6vh,5.5rem)] md:px-16",
            "text-center",
            containerStyles[variant],
          )}
          {...(reduced
            ? {}
            : {
                initial: { opacity: 0, y: 36, scale: 0.98 },
                whileInView: { opacity: 1, y: 0, scale: 1 },
                viewport: { once: true, margin: "-12%" },
                transition: { duration: 0.75, ease: EASE_OUT_EXPO },
              })}
        >
          {/* ── Decorative glow (gradient variant only) ── */}
          {variant === "gradient" && (
            <div
              className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
              aria-hidden="true"
            >
              {/* Top center glow */}
              <div
                className={cn(
                  "absolute left-1/2 -top-[30%] -translate-x-1/2",
                  "h-[500px] w-[600px] rounded-full",
                  "bg-white/[0.08] blur-[100px]",
                )}
              />
              {/* Bottom right accent */}
              <div
                className={cn(
                  "absolute -bottom-[20%] -right-[10%]",
                  "h-[300px] w-[400px] rounded-full",
                  "bg-[var(--color-brand-400)]/[0.12] blur-[80px]",
                )}
              />
            </div>
          )}

          {/* ── Content ───────────────────────────── */}
          <div className="relative z-10 mx-auto max-w-[800px]">
            {/* Headline */}
            <motion.h2
              className={cn(
                "text-[clamp(1.5rem,3.5vw+0.5rem,2.75rem)]",
                "font-bold leading-[1.15] tracking-[-0.02em]",
                "text-balance",
                headlineColor[variant],
              )}
              {...(reduced
                ? {}
                : {
                    initial: { opacity: 0, y: 18 },
                    whileInView: { opacity: 1, y: 0 },
                    viewport: { once: true },
                    transition: {
                      duration: 0.6,
                      ease: EASE_OUT_EXPO,
                      delay: 0.1,
                    },
                  })}
            >
              {headline}
            </motion.h2>

            {/* Subheadline */}
            {subheadline && (
              <motion.p
                className={cn(
                  "mt-4 mx-auto max-w-[600px]",
                  "text-[clamp(0.95rem,1vw+0.5rem,1.15rem)]",
                  "leading-[1.6]",
                  subColor[variant],
                )}
                {...(reduced
                  ? {}
                  : {
                      initial: { opacity: 0, y: 14 },
                      whileInView: { opacity: 1, y: 0 },
                      viewport: { once: true },
                      transition: {
                        duration: 0.55,
                        ease: EASE_OUT_EXPO,
                        delay: 0.2,
                      },
                    })}
              >
                {subheadline}
              </motion.p>
            )}

            {/* Buttons */}
            <motion.div
              className="mt-8 flex flex-wrap items-center justify-center gap-4"
              {...(reduced
                ? {}
                : {
                    initial: { opacity: 0, y: 14 },
                    whileInView: { opacity: 1, y: 0 },
                    viewport: { once: true },
                    transition: {
                      duration: 0.5,
                      ease: EASE_OUT_EXPO,
                      delay: 0.3,
                    },
                  })}
            >
              <Button
                size="lg"
                className={
                  inverted
                    ? cn(
                        "bg-white text-[var(--color-brand-900)]",
                        "hover:bg-white/90",
                        "shadow-[var(--shadow-md)]",
                      )
                    : undefined
                }
                asChild
              >
                <a href={ctaHref}>{ctaLabel}</a>
              </Button>

              {secondaryLabel && (
                <Button
                  variant="ghost"
                  size="lg"
                  className={
                    inverted
                      ? cn(
                          "text-white/90 hover:text-white",
                          "hover:bg-white/10",
                        )
                      : undefined
                  }
                  asChild
                >
                  <a href={secondaryHref}>{secondaryLabel}</a>
                </Button>
              )}
            </motion.div>
          </div>
        </motion.div>
      </section>
    );
  },
);

CTASection.displayName = "CTASection";
