"use client";

import { motion } from "motion/react";
import { cn } from "@uilibrary/utils";

export interface Testimonial {
  quote: string;
  author: string;
  role?: string;
  avatarUrl?: string;
}

export interface TestimonialsProps {
  headline?: string;
  testimonials: Testimonial[];
  columns?: 2 | 3;
  className?: string;
}

export function Testimonials({
  headline,
  testimonials,
  columns = 3,
  className,
}: TestimonialsProps) {
  return (
    <section className={cn("px-6 py-24 md:py-32", className)}>
      <div className="mx-auto max-w-6xl">
        {headline && (
          <motion.h2
            className="mb-16 text-center text-[var(--font-display-lg)] font-bold tracking-tight text-[var(--color-text)]"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            {headline}
          </motion.h2>
        )}

        <motion.div
          className={cn(
            "grid grid-cols-1 gap-6",
            columns === 2 ? "md:grid-cols-2" : "md:grid-cols-3",
          )}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-5%" }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.1 } },
          }}
        >
          {testimonials.map((t, i) => (
            <motion.blockquote
              key={i}
              className={cn(
                "relative rounded-[var(--radius-2xl)] p-8",
                "border border-[var(--color-border)] bg-[var(--color-bg)]",
                "shadow-[var(--shadow-sm)]",
                "transition-all duration-[var(--duration-normal)] ease-[var(--ease-spring)]",
                "hover:shadow-[var(--shadow-md)] hover:-translate-y-0.5",
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
              {/* Quote mark */}
              <svg
                className="mb-4 h-8 w-8 text-[var(--color-accent)]/30"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden
              >
                <path d="M11 7.05C9.87 8.19 9 10 9 12.5V19h6V12H11c0-2 1-3 2.5-4.05L11 7.05zM3 7.05C1.87 8.19 1 10 1 12.5V19h6V12H3c0-2 1-3 2.5-4.05L3 7.05z" />
              </svg>

              <p className="text-[var(--font-text-md)] leading-[var(--leading-relaxed)] text-[var(--color-text)]">
                {t.quote}
              </p>

              <div className="mt-6 flex items-center gap-3">
                {t.avatarUrl ? (
                  <img
                    src={t.avatarUrl}
                    alt={t.author}
                    className="h-10 w-10 rounded-[var(--radius-full)] object-cover"
                  />
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-full)] bg-[var(--color-accent-subtle)] text-[var(--font-text-sm)] font-semibold text-[var(--color-accent)]">
                    {t.author.charAt(0)}
                  </div>
                )}
                <div>
                  <div className="text-[var(--font-text-sm)] font-semibold text-[var(--color-text)]">
                    {t.author}
                  </div>
                  {t.role && (
                    <div className="text-[var(--font-text-xs)] text-[var(--color-text-muted)]">
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
