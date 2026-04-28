"use client";

import { useMemo } from "react";
import { motion, type Variants } from "motion/react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { cn } from "@uilibrary/utils";
import { useReducedMotion } from "@uilibrary/hooks/use-reduced-motion";

/* ─────────────────────────── Types ─────────────────────────── */

export interface FAQItem {
  question: string;
  answer: string;
}

export interface FAQSectionProps {
  headline?: string;
  subheadline?: string;
  items: FAQItem[];
  className?: string;
}

/* ─────────────────────── Component ─────────────────────────── */

export function FAQSection({
  headline = "Frequently Asked Questions",
  subheadline,
  items,
  className,
}: FAQSectionProps) {
  const prefersReduced = useReducedMotion();

  const staggerDelay = useMemo(() => {
    const count = items.length;
    if (count <= 1) return 0.04;
    return Math.min(0.05, 0.4 / count);
  }, [items.length]);

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: prefersReduced ? 0 : staggerDelay,
        delayChildren: prefersReduced ? 0 : 0.08,
      },
    },
  };

  const itemVariants: Variants = prefersReduced
    ? { hidden: { opacity: 1 }, visible: { opacity: 1 } }
    : {
        hidden: { opacity: 0, y: 16 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
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

  return (
    <section className={cn("px-6 py-24 md:py-32", className)}>
      <div className="mx-auto max-w-[700px]">
        {/* ─── Header ─── */}
        <motion.div
          className="mb-14 text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-10%" }}
          variants={containerVariants}
        >
          <motion.h2
            className={cn(
              "text-[var(--font-display-lg)] font-bold tracking-tight",
              "text-[var(--color-text)]",
            )}
            variants={headingVariants}
          >
            {headline}
          </motion.h2>
          {subheadline && (
            <motion.p
              className={cn(
                "mx-auto mt-4 max-w-lg",
                "text-[var(--font-text-lg)] text-[var(--color-text-secondary)]",
              )}
              variants={headingVariants}
            >
              {subheadline}
            </motion.p>
          )}
        </motion.div>

        {/* ─── Accordion ─── */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-5%" }}
          variants={containerVariants}
        >
          <AccordionPrimitive.Root type="single" collapsible>
            {items.map((item, i) => (
              <motion.div key={i} variants={itemVariants}>
                <AccordionPrimitive.Item
                  value={`faq-${i}`}
                  className="border-b border-[var(--color-border)]"
                >
                  <AccordionPrimitive.Header className="flex">
                    <AccordionPrimitive.Trigger
                      className={cn(
                        "group flex w-full items-center justify-between gap-4",
                        "py-5 text-left",
                        "text-[var(--font-text-md)] font-semibold",
                        "text-[var(--color-text)]",
                        "transition-colors duration-200",
                        "hover:text-[var(--color-accent)]",
                        "focus-visible:outline-2 focus-visible:outline-offset-2",
                        "focus-visible:outline-[var(--color-accent)]",
                      )}
                    >
                      <span className="flex-1">{item.question}</span>

                      {/* Chevron */}
                      <span
                        className={cn(
                          "flex h-6 w-6 shrink-0 items-center justify-center",
                          "rounded-[var(--radius-full)]",
                          "bg-[var(--color-bg-subtle)]",
                          "transition-[background-color,transform] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
                          "group-data-[state=open]:rotate-180",
                          "group-data-[state=open]:bg-[var(--color-accent-subtle)]",
                        )}
                      >
                        <svg
                          className={cn(
                            "h-4 w-4",
                            "text-[var(--color-text-muted)]",
                            "transition-colors duration-200",
                            "group-data-[state=open]:text-[var(--color-accent)]",
                          )}
                          viewBox="0 0 16 16"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden="true"
                        >
                          <path d="M4 6l4 4 4-4" />
                        </svg>
                      </span>
                    </AccordionPrimitive.Trigger>
                  </AccordionPrimitive.Header>

                  <AccordionPrimitive.Content
                    className={cn(
                      "overflow-hidden",
                      "data-[state=open]:animate-[accordion-open_300ms_ease-out]",
                      "data-[state=closed]:animate-[accordion-close_300ms_ease-out]",
                    )}
                  >
                    <div
                      className={cn(
                        "pb-6 pr-10",
                        "text-[var(--font-text-md)] leading-[var(--leading-relaxed)]",
                        "text-[var(--color-text-secondary)]",
                      )}
                    >
                      {item.answer}
                    </div>
                  </AccordionPrimitive.Content>
                </AccordionPrimitive.Item>
              </motion.div>
            ))}
          </AccordionPrimitive.Root>
        </motion.div>
      </div>
    </section>
  );
}
