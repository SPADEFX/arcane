"use client";

import { type ReactNode, type FormEvent, useCallback } from "react";
import { motion } from "motion/react";
import { cn } from "@uilibrary/utils";
import { useReducedMotion } from "@uilibrary/hooks/use-reduced-motion";
import { Input } from "../components/input";
import { Button } from "../components/button";

/* ─── Types ───────────────────────────────────────────── */

export interface FooterColumn {
  title: string;
  links: { label: string; href: string }[];
}

export interface FooterSocialLink {
  label: string;
  href: string;
  icon: ReactNode;
}

export interface FooterProps {
  /** Logo element or text */
  logo?: ReactNode;
  /** Brand description shown below logo */
  description?: string;
  /** Link columns */
  columns?: FooterColumn[];
  /** Show newsletter signup */
  newsletter?: boolean;
  /** Newsletter section headline */
  newsletterHeadline?: string;
  /** Newsletter submit handler */
  onNewsletterSubmit?: (email: string) => void;
  /** Copyright / bottom text */
  bottomText?: string;
  /** Social media links with icons */
  socialLinks?: FooterSocialLink[];
  /** Additional class names */
  className?: string;
}

/* ─── Animation helpers ───────────────────────────────── */

const EASE_SPRING = [0.22, 1, 0.36, 1] as [number, number, number, number];

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: EASE_SPRING },
  },
};

const noMotion = {
  hidden: { opacity: 1, y: 0 },
  visible: { opacity: 1, y: 0, transition: { duration: 0 } },
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.06, delayChildren: 0.05 },
  },
};

const noStagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0 } },
};

/* ─── Component ───────────────────────────────────────── */

export function Footer({
  logo = "Brand",
  description,
  columns = [],
  newsletter = false,
  newsletterHeadline = "Subscribe to our newsletter",
  onNewsletterSubmit,
  bottomText,
  socialLinks = [],
  className,
}: FooterProps) {
  const prefersReduced = useReducedMotion();

  const containerV = prefersReduced ? noStagger : staggerContainer;
  const itemV = prefersReduced ? noMotion : fadeUp;

  const handleSubmit = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      const email = formData.get("email") as string;
      if (email && onNewsletterSubmit) {
        onNewsletterSubmit(email);
      }
    },
    [onNewsletterSubmit],
  );

  return (
    <footer
      className={cn(
        "relative bg-[var(--color-bg-subtle)] px-6 pt-16 pb-8",
        className,
      )}
    >
      <div className="mx-auto max-w-[1200px]">
        {/* ── Top section ── */}
        <motion.div
          className="grid grid-cols-1 gap-12 md:grid-cols-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-5%" }}
          variants={containerV}
        >
          {/* Brand column */}
          <motion.div
            className="md:col-span-4 lg:col-span-4"
            variants={itemV}
          >
            <div
              className={cn(
                "text-[var(--font-text-xl)] font-bold",
                "text-[var(--color-text)]",
              )}
            >
              {logo}
            </div>

            {description && (
              <p
                className={cn(
                  "mt-4 max-w-[280px]",
                  "text-[var(--font-text-sm)] leading-relaxed",
                  "text-[var(--color-text-muted)]",
                )}
              >
                {description}
              </p>
            )}

            {/* Social links */}
            {socialLinks.length > 0 && (
              <div className="mt-6 flex items-center gap-2">
                {socialLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={link.label}
                    className={cn(
                      "flex h-9 w-9 items-center justify-center",
                      "rounded-[var(--radius-lg)]",
                      "text-[var(--color-text-muted)]",
                      "transition-[color,background-color] duration-150",
                      "hover:bg-[var(--color-bg-muted)] hover:text-[var(--color-text)]",
                    )}
                  >
                    <span className="flex h-4 w-4 items-center justify-center [&>svg]:h-full [&>svg]:w-full">
                      {link.icon}
                    </span>
                  </a>
                ))}
              </div>
            )}
          </motion.div>

          {/* Link columns */}
          {columns.map((col) => (
            <motion.div
              key={col.title}
              className={cn(
                columns.length <= 3 ? "md:col-span-2" : "md:col-span-2",
              )}
              variants={itemV}
            >
              <h3
                className={cn(
                  "mb-4 text-[11px] font-semibold uppercase tracking-[0.1em]",
                  "text-[var(--color-text-muted)]",
                )}
              >
                {col.title}
              </h3>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className={cn(
                        "text-[var(--font-text-sm)] no-underline",
                        "text-[var(--color-text-secondary)]",
                        "transition-colors duration-150",
                        "hover:text-[var(--color-text)]",
                      )}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>

        {/* ── Newsletter row ── */}
        {newsletter && (
          <motion.div
            className={cn(
              "mt-12 rounded-[var(--radius-xl)] p-6",
              "border border-[var(--color-border)]",
              "bg-[var(--color-bg)]",
            )}
            initial={prefersReduced ? false : { opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: prefersReduced ? 0 : 0.4, ease: EASE_SPRING }}
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3
                  className={cn(
                    "text-[var(--font-text-md)] font-semibold",
                    "text-[var(--color-text)]",
                  )}
                >
                  {newsletterHeadline}
                </h3>
                <p
                  className={cn(
                    "mt-1 text-[var(--font-text-sm)]",
                    "text-[var(--color-text-muted)]",
                  )}
                >
                  No spam. Unsubscribe anytime.
                </p>
              </div>
              <form
                className="flex gap-2 sm:min-w-[320px]"
                onSubmit={handleSubmit}
              >
                <Input
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  required
                  className="flex-1"
                />
                <Button size="md" type="submit">
                  Subscribe
                </Button>
              </form>
            </div>
          </motion.div>
        )}

        {/* ── Bottom bar ── */}
        {(bottomText || socialLinks.length > 0) && (
          <div
            className={cn(
              "mt-12 flex flex-col items-center justify-between gap-4",
              "border-t border-[var(--color-border)] pt-6",
              "sm:flex-row",
            )}
          >
            {bottomText && (
              <p
                className={cn(
                  "text-[var(--font-text-xs)]",
                  "text-[var(--color-text-muted)]",
                )}
              >
                {bottomText}
              </p>
            )}

            {/* Bottom social links (duplicated compact version for bottom row) */}
            {socialLinks.length > 0 && (
              <div className="flex items-center gap-1.5 sm:hidden">
                {socialLinks.map((link) => (
                  <a
                    key={`bottom-${link.href}`}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={link.label}
                    className={cn(
                      "flex h-8 w-8 items-center justify-center",
                      "rounded-[var(--radius-md)]",
                      "text-[var(--color-text-muted)]",
                      "transition-colors duration-150",
                      "hover:text-[var(--color-text)]",
                    )}
                  >
                    <span className="flex h-3.5 w-3.5 items-center justify-center [&>svg]:h-full [&>svg]:w-full">
                      {link.icon}
                    </span>
                  </a>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </footer>
  );
}
