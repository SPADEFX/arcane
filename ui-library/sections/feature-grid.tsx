"use client";

import { type ReactNode } from "react";
import { motion } from "motion/react";
import { cn } from "@uilibrary/utils";
import { useReducedMotion } from "@uilibrary/hooks/use-reduced-motion";

/* ─── Types ───────────────────────────────────────────── */

export interface Feature {
  /** Optional icon element (rendered inside a 40x40 container) */
  icon?: ReactNode;
  /** Feature title */
  title: string;
  /** Feature description */
  description: string;
}

export interface FeatureGridProps {
  /** Section headline */
  headline?: string;
  /** Section subheadline */
  subheadline?: string;
  /** Array of features to display */
  features: Feature[];
  /** Number of columns on desktop (responsive: 1 mobile, 2 tablet, N desktop) */
  columns?: 2 | 3 | 4;
  /** Additional class names */
  className?: string;
}

/* ─── Column mapping ──────────────────────────────────── */

const columnClasses = {
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-2 lg:grid-cols-3",
  4: "sm:grid-cols-2 lg:grid-cols-4",
} as const;

/* ─── Animation variants ──────────────────────────────── */

const EASE_SPRING = [0.22, 1, 0.36, 1] as [number, number, number, number];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const headerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: EASE_SPRING },
  },
};

const cardVariant = {
  hidden: { opacity: 0, y: 28, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.45, ease: EASE_SPRING },
  },
};

/* ─── Reduced motion variants ─────────────────────────── */

const noMotion = {
  hidden: { opacity: 1, y: 0 },
  visible: { opacity: 1, y: 0, transition: { duration: 0 } },
};

const noMotionContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0 } },
};

/* ─── Component ───────────────────────────────────────── */

export function FeatureGrid({
  headline,
  subheadline,
  features,
  columns = 3,
  className,
}: FeatureGridProps) {
  const prefersReduced = useReducedMotion();

  const headerV = prefersReduced ? noMotionContainer : headerVariants;
  const itemV = prefersReduced ? noMotion : fadeUp;
  const containerV = prefersReduced ? noMotionContainer : containerVariants;
  const cardV = prefersReduced ? noMotion : cardVariant;

  return (
    <section
      className={cn("px-6 py-20 md:py-28 lg:py-32", className)}
    >
      <div className="mx-auto max-w-[1200px]">
        {/* ── Header ── */}
        {(headline || subheadline) && (
          <motion.div
            className="mb-14 text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-10%" }}
            variants={headerV}
          >
            {headline && (
              <motion.h2
                className={cn(
                  "text-[var(--font-display-lg)] font-bold tracking-tight",
                  "text-[var(--color-text)]",
                )}
                variants={itemV}
              >
                {headline}
              </motion.h2>
            )}
            {subheadline && (
              <motion.p
                className={cn(
                  "mx-auto mt-4 max-w-2xl",
                  "text-[var(--font-text-lg)] leading-relaxed",
                  "text-[var(--color-text-secondary)]",
                )}
                variants={itemV}
              >
                {subheadline}
              </motion.p>
            )}
          </motion.div>
        )}

        {/* ── Grid ── */}
        <motion.div
          className={cn("grid grid-cols-1 gap-4", columnClasses[columns])}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-5%" }}
          variants={containerV}
        >
          {features.map((feature, i) => (
            <motion.div
              key={i}
              className={cn(
                "group relative flex flex-col rounded-[var(--radius-xl)] p-6",
                /* Background */
                "bg-[var(--color-bg-subtle)]",
                /* Border */
                "border border-[var(--color-border)]",
                /* Hover effects */
                "transition-[border-color,transform,box-shadow] duration-200",
                "ease-[cubic-bezier(0.22,1,0.36,1)]",
                "hover:border-[var(--color-border-strong)]",
                "hover:-translate-y-0.5",
                "hover:shadow-[var(--shadow-md)]",
                /* Reduced motion */
                "motion-reduce:transform-none motion-reduce:transition-[border-color] motion-reduce:duration-150",
              )}
              variants={cardV}
            >
              {/* Icon container */}
              {feature.icon && (
                <div
                  className={cn(
                    "mb-4 flex h-10 w-10 items-center justify-center",
                    "rounded-[var(--radius-lg)]",
                    "bg-[var(--color-accent)]/10 text-[var(--color-accent)]",
                    "transition-colors duration-200",
                    "group-hover:bg-[var(--color-accent)]/15",
                  )}
                >
                  <span className="flex h-5 w-5 items-center justify-center [&>svg]:h-full [&>svg]:w-full">
                    {feature.icon}
                  </span>
                </div>
              )}

              {/* Title */}
              <h3
                className={cn(
                  "text-[var(--font-text-md)] font-semibold",
                  "text-[var(--color-text)]",
                )}
              >
                {feature.title}
              </h3>

              {/* Description */}
              <p
                className={cn(
                  "mt-2 text-[var(--font-text-sm)] leading-relaxed",
                  "text-[var(--color-text-muted)]",
                )}
              >
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
