"use client";

import { type ReactNode } from "react";
import { motion } from "motion/react";
import { cn } from "@uilibrary/utils";
import { Button } from "../components/button";
import { Badge } from "../components/badge";

export interface HeroSectionProps {
  headline: string;
  highlightText?: string;
  subheadline?: string;
  badge?: string;
  ctaLabel?: string;
  ctaHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
  gradient?: boolean;
  children?: ReactNode;
  className?: string;
}

export function HeroSection({
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
}: HeroSectionProps) {
  return (
    <section
      className={cn(
        "relative flex min-h-[90vh] flex-col items-center justify-center overflow-hidden px-6 py-32 text-center",
        className,
      )}
    >
      {/* Background gradient orbs */}
      {gradient && (
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
          <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-[600px] w-[900px] rounded-full bg-[var(--color-accent)]/8 blur-[120px]" />
          <div className="absolute top-1/3 -left-40 h-[400px] w-[400px] rounded-full bg-[var(--color-brand-400)]/6 blur-[100px]" />
          <div className="absolute top-1/4 -right-40 h-[350px] w-[350px] rounded-full bg-[var(--color-brand-300)]/5 blur-[100px]" />
        </div>
      )}

      <div className="relative z-10 flex flex-col items-center">
        {/* Badge */}
        {badge && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <Badge className="mb-6">{badge}</Badge>
          </motion.div>
        )}

        {/* Headline */}
        <motion.h1
          className="max-w-5xl text-[clamp(2.5rem,6vw,var(--font-display-2xl))] font-bold leading-[var(--leading-tight)] tracking-tight text-[var(--color-text)]"
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
        >
          {headline}
          {highlightText && (
            <>
              {" "}
              <span className="bg-gradient-to-r from-[var(--color-brand-500)] to-[var(--color-brand-400)] bg-clip-text text-transparent">
                {highlightText}
              </span>
            </>
          )}
        </motion.h1>

        {/* Subheadline */}
        {subheadline && (
          <motion.p
            className="mt-6 max-w-2xl text-[clamp(1rem,2vw,var(--font-text-xl))] leading-[var(--leading-relaxed)] text-[var(--color-text-secondary)]"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          >
            {subheadline}
          </motion.p>
        )}

        {/* CTAs */}
        <motion.div
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.35 }}
        >
          <Button size="lg" asChild>
            <a href={ctaHref}>{ctaLabel}</a>
          </Button>
          {secondaryLabel && (
            <Button variant="secondary" size="lg" asChild>
              <a href={secondaryHref}>{secondaryLabel}</a>
            </Button>
          )}
        </motion.div>

        {/* Optional slot for social proof, images, etc. */}
        {children && (
          <motion.div
            className="mt-16 w-full"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.5 }}
          >
            {children}
          </motion.div>
        )}
      </div>
    </section>
  );
}
