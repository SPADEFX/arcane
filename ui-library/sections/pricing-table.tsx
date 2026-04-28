"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence, type Variants } from "motion/react";
import { cn } from "@uilibrary/utils";
import { useReducedMotion } from "@uilibrary/hooks/use-reduced-motion";
import { Button } from "../components/button";
import { Badge } from "../components/badge";

/* ─────────────────────────── Types ─────────────────────────── */

export interface PricingFeature {
  text: string;
  included: boolean;
}

export interface PricingPlan {
  name: string;
  description?: string;
  monthlyPrice: number;
  yearlyPrice: number;
  features: PricingFeature[];
  ctaLabel?: string;
  ctaHref?: string;
  popular?: boolean;
}

export interface PricingTableProps {
  headline?: string;
  subheadline?: string;
  plans: PricingPlan[];
  className?: string;
}

/* ─────────────────── Check / X icons ───────────────────────── */

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3.5 8.5L6.5 11.5L12.5 4.5" />
    </svg>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4.5 4.5L11.5 11.5M11.5 4.5L4.5 11.5" />
    </svg>
  );
}

/* ─────────────────────── Component ─────────────────────────── */

export function PricingTable({
  headline,
  subheadline,
  plans,
  className,
}: PricingTableProps) {
  const [yearly, setYearly] = useState(false);
  const prefersReduced = useReducedMotion();

  const staggerDelay = useMemo(() => {
    const count = plans.length;
    if (count <= 1) return 0.05;
    return Math.min(0.06, 0.4 / count);
  }, [plans.length]);

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: prefersReduced ? 0 : staggerDelay,
        delayChildren: prefersReduced ? 0 : 0.1,
      },
    },
  };

  const cardVariants: Variants = prefersReduced
    ? { hidden: { opacity: 1 }, visible: { opacity: 1 } }
    : {
        hidden: { opacity: 0, y: 32, scale: 0.97 },
        visible: {
          opacity: 1,
          y: 0,
          scale: 1,
          transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
        },
      };

  const headingVariants: Variants = prefersReduced
    ? { hidden: { opacity: 1 }, visible: { opacity: 1 } }
    : {
        hidden: { opacity: 0, y: 20 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
        },
      };

  const priceTransition = prefersReduced
    ? { duration: 0 }
    : { duration: 0.25, ease: [0.22, 1, 0.36, 1] };

  return (
    <section className={cn("px-6 py-24 md:py-32", className)}>
      <div className="mx-auto max-w-6xl">
        {/* ─── Header ─── */}
        <motion.div
          className="mb-14 text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-10%" }}
          variants={containerVariants}
        >
          {headline && (
            <motion.h2
              className={cn(
                "text-[var(--font-display-lg)] font-bold tracking-tight",
                "text-[var(--color-text)]",
              )}
              variants={headingVariants}
            >
              {headline}
            </motion.h2>
          )}
          {subheadline && (
            <motion.p
              className={cn(
                "mx-auto mt-4 max-w-2xl",
                "text-[var(--font-text-lg)] text-[var(--color-text-secondary)]",
              )}
              variants={headingVariants}
            >
              {subheadline}
            </motion.p>
          )}

          {/* ─── Toggle ─── */}
          <motion.div className="mt-10" variants={headingVariants}>
            <div
              className={cn(
                "inline-flex items-center gap-1",
                "rounded-[var(--radius-full)]",
                "border border-[var(--color-border)]",
                "bg-[var(--color-bg-subtle)]",
                "p-1",
              )}
            >
              <button
                type="button"
                className={cn(
                  "relative rounded-[var(--radius-full)] px-5 py-2",
                  "text-[var(--font-text-sm)] font-medium",
                  "transition-all duration-200 ease-out",
                  "focus-visible:outline-2 focus-visible:outline-offset-2",
                  "focus-visible:outline-[var(--color-accent)]",
                  !yearly
                    ? "bg-[var(--color-bg)] text-[var(--color-text)] shadow-[var(--shadow-sm)]"
                    : "text-[var(--color-text-secondary)] hover:text-[var(--color-text)]",
                )}
                onClick={() => setYearly(false)}
                aria-pressed={!yearly}
              >
                Monthly
              </button>
              <button
                type="button"
                className={cn(
                  "relative rounded-[var(--radius-full)] px-5 py-2",
                  "text-[var(--font-text-sm)] font-medium",
                  "transition-all duration-200 ease-out",
                  "focus-visible:outline-2 focus-visible:outline-offset-2",
                  "focus-visible:outline-[var(--color-accent)]",
                  yearly
                    ? "bg-[var(--color-bg)] text-[var(--color-text)] shadow-[var(--shadow-sm)]"
                    : "text-[var(--color-text-secondary)] hover:text-[var(--color-text)]",
                )}
                onClick={() => setYearly(true)}
                aria-pressed={yearly}
              >
                Yearly
                <span
                  className={cn(
                    "ml-1.5 inline-block",
                    "text-[var(--font-text-xs)] font-semibold",
                    "text-[var(--color-accent)]",
                  )}
                >
                  -20%
                </span>
              </button>
            </div>
          </motion.div>
        </motion.div>

        {/* ─── Plans Grid ─── */}
        <motion.div
          className={cn(
            "grid grid-cols-1 items-start gap-5",
            "md:grid-cols-2 lg:grid-cols-3",
          )}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-5%" }}
          variants={containerVariants}
        >
          {plans.map((plan) => {
            const price = yearly ? plan.yearlyPrice : plan.monthlyPrice;

            return (
              <motion.div
                key={plan.name}
                className={cn(
                  "group relative flex flex-col",
                  "rounded-[var(--radius-2xl)] p-7 md:p-8",
                  "bg-[var(--color-bg)]",
                  "border",
                  "transition-[border-color,box-shadow,transform] duration-300 ease-out",
                  plan.popular
                    ? [
                        "border-[var(--color-accent)]",
                        "shadow-[0_0_0_1px_var(--color-accent),var(--shadow-lg)]",
                        "lg:scale-[1.03]",
                        "hover:shadow-[0_0_24px_-4px_var(--color-accent),var(--shadow-xl)]",
                      ]
                    : [
                        "border-[var(--color-border)]",
                        "shadow-[var(--shadow-xs)]",
                        "hover:border-[var(--color-border-strong)]",
                        "hover:shadow-[var(--shadow-md)]",
                      ],
                )}
                variants={cardVariants}
              >
                {/* Popular badge */}
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge variant="solid">Popular</Badge>
                  </div>
                )}

                {/* Plan header */}
                <div className="mb-6">
                  <h3
                    className={cn(
                      "text-[var(--font-text-lg)] font-semibold",
                      "text-[var(--color-text)]",
                    )}
                  >
                    {plan.name}
                  </h3>
                  {plan.description && (
                    <p
                      className={cn(
                        "mt-1.5",
                        "text-[var(--font-text-sm)] text-[var(--color-text-secondary)]",
                      )}
                    >
                      {plan.description}
                    </p>
                  )}
                </div>

                {/* Price */}
                <div className="mb-8">
                  <div className="flex items-baseline gap-1">
                    <span className="text-[var(--font-text-sm)] text-[var(--color-text-muted)]">
                      $
                    </span>
                    <AnimatePresence mode="popLayout">
                      <motion.span
                        key={`${plan.name}-${yearly ? "y" : "m"}`}
                        className={cn(
                          "text-[var(--font-display-lg)] font-bold leading-none",
                          "text-[var(--color-text)]",
                        )}
                        initial={{ opacity: 0, y: -12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 12 }}
                        transition={priceTransition}
                      >
                        {price}
                      </motion.span>
                    </AnimatePresence>
                    <span className="text-[var(--font-text-sm)] text-[var(--color-text-muted)]">
                      /mo
                    </span>
                  </div>
                  {yearly && (
                    <p className="mt-1 text-[var(--font-text-xs)] text-[var(--color-text-muted)]">
                      Billed annually
                    </p>
                  )}
                </div>

                {/* Divider */}
                <div className="mb-6 h-px bg-[var(--color-border)]" />

                {/* Feature list */}
                <ul className="mb-8 flex-1 space-y-3">
                  {plan.features.map((f, j) => (
                    <li
                      key={j}
                      className={cn(
                        "flex items-start gap-3",
                        "text-[var(--font-text-sm)]",
                      )}
                    >
                      {f.included ? (
                        <span
                          className={cn(
                            "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center",
                            "rounded-[var(--radius-full)]",
                            "bg-[var(--color-accent-subtle)]",
                          )}
                        >
                          <CheckIcon className="h-3 w-3 text-[var(--color-accent)]" />
                        </span>
                      ) : (
                        <span
                          className={cn(
                            "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center",
                            "rounded-[var(--radius-full)]",
                            "bg-[var(--color-bg-subtle)]",
                          )}
                        >
                          <XIcon className="h-3 w-3 text-[var(--color-text-muted)]" />
                        </span>
                      )}
                      <span
                        className={cn(
                          f.included
                            ? "text-[var(--color-text)]"
                            : "text-[var(--color-text-muted)]",
                        )}
                      >
                        {f.text}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Button
                  variant={plan.popular ? "primary" : "secondary"}
                  size="lg"
                  className="w-full"
                  asChild
                >
                  <a href={plan.ctaHref || "#"}>
                    {plan.ctaLabel || "Get Started"}
                  </a>
                </Button>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
