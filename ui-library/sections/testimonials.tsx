"use client";

import { useMemo } from "react";
import { motion, type Variants } from "motion/react";
import { cn } from "@uilibrary/utils";
import { useReducedMotion } from "@uilibrary/hooks/use-reduced-motion";

/* ─────────────────────────── Types ─────────────────────────── */

export interface Testimonial {
  quote: string;
  author: string;
  role?: string;
  avatarUrl?: string;
}

export interface TestimonialsProps {
  headline?: string;
  subheadline?: string;
  testimonials: Testimonial[];
  columns?: 2 | 3;
  className?: string;
}

/* ─────────────────────── Color palette ─────────────────────── */

const AVATAR_COLORS = [
  "var(--color-accent)",
  "var(--color-success, #22c55e)",
  "var(--color-warning, #f59e0b)",
  "var(--color-info, #3b82f6)",
  "var(--color-error, #ef4444)",
] as const;

function getAvatarColor(index: number): string {
  return AVATAR_COLORS[index % AVATAR_COLORS.length];
}

/* ─────────────────────── Component ─────────────────────────── */

export function Testimonials({
  headline,
  subheadline,
  testimonials,
  columns = 3,
  className,
}: TestimonialsProps) {
  const prefersReduced = useReducedMotion();

  const staggerDelay = useMemo(() => {
    const count = testimonials.length;
    if (count <= 1) return 0.05;
    return Math.min(0.06, 0.4 / count);
  }, [testimonials.length]);

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
        hidden: { opacity: 0, y: 28, scale: 0.97 },
        visible: {
          opacity: 1,
          y: 0,
          scale: 1,
          transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
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
    <section
      className={cn(
        "relative px-6 py-24 md:py-32",
        "overflow-hidden",
        className,
      )}
    >
      <div className="mx-auto max-w-6xl">
        {/* ─── Header ─── */}
        {(headline || subheadline) && (
          <motion.div
            className="mb-16 text-center"
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
          </motion.div>
        )}

        {/* ─── Grid ─── */}
        <motion.div
          className={cn(
            "grid grid-cols-1 gap-5",
            columns === 2 ? "md:grid-cols-2" : "md:grid-cols-2 lg:grid-cols-3",
          )}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-5%" }}
          variants={containerVariants}
        >
          {testimonials.map((t, i) => (
            <motion.blockquote
              key={i}
              className={cn(
                "group relative flex flex-col",
                "rounded-[var(--radius-2xl)] p-7 md:p-8",
                "bg-[var(--color-bg)]",
                "border border-[var(--color-border)]",
                "shadow-[var(--shadow-xs)]",
                "transition-[border-color,box-shadow] duration-300 ease-out",
                "hover:border-[var(--color-border-strong)]",
                "hover:shadow-[var(--shadow-md)]",
              )}
              variants={cardVariants}
            >
              {/* Quotation mark */}
              <svg
                className={cn(
                  "mb-5 h-8 w-8 shrink-0",
                  "text-[var(--color-accent)] opacity-25",
                  "transition-opacity duration-300",
                  "group-hover:opacity-40",
                )}
                viewBox="0 0 32 32"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M10.7 8C7.6 10 5.8 13.2 5.8 17v9.2h9.6V17h-6.4c0-3.2 1.4-5.2 4.2-6.8L10.7 8zm14.4 0c-3.1 2-4.9 5.2-4.9 9v9.2h9.6V17h-6.4c0-3.2 1.4-5.2 4.2-6.8L25.1 8z" />
              </svg>

              {/* Quote */}
              <p
                className={cn(
                  "flex-1",
                  "text-[var(--font-text-md)] leading-[var(--leading-relaxed)]",
                  "text-[var(--color-text)]",
                )}
              >
                &ldquo;{t.quote}&rdquo;
              </p>

              {/* Author */}
              <div className="mt-6 flex items-center gap-3 border-t border-[var(--color-border)] pt-5">
                {t.avatarUrl ? (
                  <img
                    src={t.avatarUrl}
                    alt={t.author}
                    className={cn(
                      "h-10 w-10 shrink-0",
                      "rounded-[var(--radius-full)] object-cover",
                      "ring-2 ring-[var(--color-bg)] ring-offset-0",
                    )}
                  />
                ) : (
                  <div
                    className={cn(
                      "flex h-10 w-10 shrink-0 items-center justify-center",
                      "rounded-[var(--radius-full)]",
                      "text-[var(--font-text-sm)] font-semibold text-white",
                    )}
                    style={{ backgroundColor: getAvatarColor(i) }}
                    aria-hidden="true"
                  >
                    {t.author.charAt(0).toUpperCase()}
                  </div>
                )}

                <div className="min-w-0">
                  <div
                    className={cn(
                      "truncate",
                      "text-[var(--font-text-sm)] font-semibold",
                      "text-[var(--color-text)]",
                    )}
                  >
                    {t.author}
                  </div>
                  {t.role && (
                    <div
                      className={cn(
                        "truncate",
                        "text-[var(--font-text-xs)] text-[var(--color-text-muted)]",
                      )}
                    >
                      {t.role}
                    </div>
                  )}
                </div>
              </div>
            </motion.blockquote>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
