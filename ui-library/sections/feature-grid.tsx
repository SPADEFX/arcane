"use client";

import { type ReactNode } from "react";
import { motion } from "motion/react";
import { cn } from "@uilibrary/utils";

export interface Feature {
  icon?: ReactNode;
  title: string;
  description: string;
}

export interface FeatureGridProps {
  headline?: string;
  subheadline?: string;
  features: Feature[];
  columns?: 2 | 3 | 4;
  className?: string;
}

const colClasses = {
  2: "md:grid-cols-2",
  3: "md:grid-cols-3",
  4: "md:grid-cols-2 lg:grid-cols-4",
} as const;

export function FeatureGrid({
  headline,
  subheadline,
  features,
  columns = 3,
  className,
}: FeatureGridProps) {
  return (
    <section
      className={cn(
        "px-6 py-24 md:py-32",
        className,
      )}
    >
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        {(headline || subheadline) && (
          <motion.div
            className="mb-16 text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-10%" }}
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.12 } },
            }}
          >
            {headline && (
              <motion.h2
                className="text-[var(--font-display-lg)] font-bold tracking-tight text-[var(--color-text)]"
                variants={{
                  hidden: { opacity: 0, y: 24 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
                }}
              >
                {headline}
              </motion.h2>
            )}
            {subheadline && (
              <motion.p
                className="mt-4 text-[var(--font-text-lg)] text-[var(--color-text-secondary)] max-w-2xl mx-auto"
                variants={{
                  hidden: { opacity: 0, y: 16 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
                }}
              >
                {subheadline}
              </motion.p>
            )}
          </motion.div>
        )}

        {/* Grid */}
        <motion.div
          className={cn("grid grid-cols-1 gap-8", colClasses[columns])}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-5%" }}
          variants={{
            hidden: {},
            visible: {
              transition: { staggerChildren: 0.1, delayChildren: 0.1 },
            },
          }}
        >
          {features.map((feature, i) => (
            <motion.div
              key={i}
              className={cn(
                "group relative rounded-[var(--radius-2xl)] p-8",
                "border border-[var(--color-border)] bg-[var(--color-bg)]",
                "transition-all duration-[var(--duration-normal)] ease-[var(--ease-spring)]",
                "hover:shadow-[var(--shadow-lg)] hover:-translate-y-1",
                "hover:border-[var(--color-accent)]/30",
              )}
              variants={{
                hidden: { opacity: 0, y: 32 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
                },
              }}
            >
              {/* Icon */}
              {feature.icon && (
                <div className={cn(
                  "mb-4 flex h-12 w-12 items-center justify-center",
                  "rounded-[var(--radius-xl)] bg-[var(--color-accent-subtle)]",
                  "text-[var(--color-accent)]",
                  "transition-colors duration-[var(--duration-normal)]",
                  "group-hover:bg-[var(--color-accent)] group-hover:text-[var(--color-text-inverse)]",
                )}>
                  {feature.icon}
                </div>
              )}

              <h3 className="text-[var(--font-text-lg)] font-semibold text-[var(--color-text)]">
                {feature.title}
              </h3>
              <p className="mt-2 text-[var(--font-text-md)] leading-[var(--leading-relaxed)] text-[var(--color-text-secondary)]">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
