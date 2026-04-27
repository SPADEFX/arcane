"use client";

import { motion } from "motion/react";
import { cn } from "@uilibrary/utils";
import { Button } from "../components/button";

export interface CTASectionProps {
  headline: string;
  subheadline?: string;
  ctaLabel?: string;
  ctaHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
  variant?: "gradient" | "solid" | "outline";
  className?: string;
}

export function CTASection({
  headline,
  subheadline,
  ctaLabel = "Get Started",
  ctaHref = "#",
  secondaryLabel,
  secondaryHref = "#",
  variant = "gradient",
  className,
}: CTASectionProps) {
  const bgStyles = {
    gradient: "bg-gradient-to-br from-[var(--color-brand-900)] via-[var(--color-brand-800)] to-[var(--color-brand-950)]",
    solid: "bg-[var(--color-bg-inverse)]",
    outline: "bg-transparent border-2 border-[var(--color-border)]",
  };

  const textColor = variant === "outline" ? "text-[var(--color-text)]" : "text-white";
  const subtextColor = variant === "outline" ? "text-[var(--color-text-secondary)]" : "text-white/70";

  return (
    <section className={cn("px-6 py-24 md:py-32", className)}>
      <motion.div
        className={cn(
          "relative mx-auto max-w-5xl overflow-hidden rounded-[var(--radius-3xl)] px-8 py-20 md:px-16 md:py-24 text-center",
          bgStyles[variant],
        )}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-10%" }}
        variants={{
          hidden: { opacity: 0, y: 40, scale: 0.98 },
          visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
          },
        }}
      >
        {/* Decorative glow */}
        {variant === "gradient" && (
          <div className="pointer-events-none absolute inset-0" aria-hidden>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[400px] w-[600px] rounded-full bg-[var(--color-brand-500)]/20 blur-[100px]" />
            <div className="absolute bottom-0 right-0 h-[200px] w-[300px] rounded-full bg-[var(--color-brand-400)]/10 blur-[80px]" />
          </div>
        )}

        <div className="relative z-10">
          <motion.h2
            className={cn(
              "text-[clamp(1.75rem,4vw,var(--font-display-lg))] font-bold tracking-tight",
              textColor,
            )}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.1 } },
            }}
          >
            {headline}
          </motion.h2>

          {subheadline && (
            <motion.p
              className={cn("mt-4 text-[var(--font-text-lg)] max-w-xl mx-auto", subtextColor)}
              variants={{
                hidden: { opacity: 0, y: 16 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.2 } },
              }}
            >
              {subheadline}
            </motion.p>
          )}

          <motion.div
            className="mt-10 flex flex-wrap items-center justify-center gap-4"
            variants={{
              hidden: { opacity: 0, y: 16 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.3 } },
            }}
          >
            <Button
              size="lg"
              className={
                variant !== "outline"
                  ? "bg-white text-[var(--color-brand-900)] hover:bg-white/90 shadow-[var(--shadow-lg)]"
                  : undefined
              }
              asChild
            >
              <a href={ctaHref}>{ctaLabel}</a>
            </Button>
            {secondaryLabel && (
              <Button
                variant="secondary"
                size="lg"
                className={
                  variant !== "outline"
                    ? "border-white/30 text-white hover:bg-white/10"
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
}
