"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@uilibrary/utils";
import { Button } from "../components/button";
import { Badge } from "../components/badge";

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

export function PricingTable({
  headline,
  subheadline,
  plans,
  className,
}: PricingTableProps) {
  const [yearly, setYearly] = useState(false);

  return (
    <section className={cn("px-6 py-24 md:py-32", className)}>
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <motion.div
          className="mb-12 text-center"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          {headline && (
            <h2 className="text-[var(--font-display-lg)] font-bold tracking-tight text-[var(--color-text)]">
              {headline}
            </h2>
          )}
          {subheadline && (
            <p className="mt-4 text-[var(--font-text-lg)] text-[var(--color-text-secondary)]">
              {subheadline}
            </p>
          )}

          {/* Toggle */}
          <div className="mt-8 inline-flex items-center gap-3 rounded-[var(--radius-full)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-1">
            <button
              type="button"
              className={cn(
                "rounded-[var(--radius-full)] px-5 py-2 text-[var(--font-text-sm)] font-medium transition-all duration-[var(--duration-fast)]",
                !yearly
                  ? "bg-[var(--color-bg)] text-[var(--color-text)] shadow-[var(--shadow-sm)]"
                  : "text-[var(--color-text-secondary)] hover:text-[var(--color-text)]",
              )}
              onClick={() => setYearly(false)}
            >
              Monthly
            </button>
            <button
              type="button"
              className={cn(
                "rounded-[var(--radius-full)] px-5 py-2 text-[var(--font-text-sm)] font-medium transition-all duration-[var(--duration-fast)]",
                yearly
                  ? "bg-[var(--color-bg)] text-[var(--color-text)] shadow-[var(--shadow-sm)]"
                  : "text-[var(--color-text-secondary)] hover:text-[var(--color-text)]",
              )}
              onClick={() => setYearly(true)}
            >
              Yearly
              <span className="ml-1.5 text-[var(--font-text-xs)] text-[var(--color-accent)]">
                Save 20%
              </span>
            </button>
          </div>
        </motion.div>

        {/* Plans */}
        <motion.div
          className="grid grid-cols-1 gap-6 md:grid-cols-3"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-5%" }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.12 } },
          }}
        >
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              className={cn(
                "relative flex flex-col rounded-[var(--radius-2xl)] p-8",
                "border bg-[var(--color-bg)]",
                plan.popular
                  ? "border-[var(--color-accent)] shadow-[var(--shadow-xl)] scale-[1.02]"
                  : "border-[var(--color-border)] shadow-[var(--shadow-sm)]",
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
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge variant="solid">Most Popular</Badge>
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-[var(--font-text-xl)] font-semibold text-[var(--color-text)]">
                  {plan.name}
                </h3>
                {plan.description && (
                  <p className="mt-1 text-[var(--font-text-sm)] text-[var(--color-text-secondary)]">
                    {plan.description}
                  </p>
                )}
              </div>

              {/* Price */}
              <div className="mb-8">
                <div className="flex items-baseline gap-1">
                  <AnimatePresence mode="popLayout">
                    <motion.span
                      key={yearly ? "y" : "m"}
                      className="text-[var(--font-display-md)] font-bold text-[var(--color-text)]"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                    >
                      ${yearly ? plan.yearlyPrice : plan.monthlyPrice}
                    </motion.span>
                  </AnimatePresence>
                  <span className="text-[var(--font-text-sm)] text-[var(--color-text-muted)]">
                    /month
                  </span>
                </div>
                {yearly && (
                  <p className="mt-1 text-[var(--font-text-xs)] text-[var(--color-text-muted)]">
                    Billed annually
                  </p>
                )}
              </div>

              {/* Features */}
              <ul className="mb-8 flex-1 space-y-3">
                {plan.features.map((f, j) => (
                  <li
                    key={j}
                    className={cn(
                      "flex items-start gap-3 text-[var(--font-text-sm)]",
                      f.included
                        ? "text-[var(--color-text)]"
                        : "text-[var(--color-text-muted)] line-through",
                    )}
                  >
                    <svg
                      className={cn(
                        "mt-0.5 h-4 w-4 shrink-0",
                        f.included ? "text-[var(--color-accent)]" : "text-[var(--color-text-muted)]",
                      )}
                      viewBox="0 0 16 16"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      {f.included ? (
                        <path d="M3 8.5L6.5 12L13 4" />
                      ) : (
                        <path d="M4 4L12 12M12 4L4 12" />
                      )}
                    </svg>
                    {f.text}
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Button
                variant={plan.popular ? "primary" : "secondary"}
                className="w-full"
                asChild
              >
                <a href={plan.ctaHref || "#"}>
                  {plan.ctaLabel || "Choose Plan"}
                </a>
              </Button>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
