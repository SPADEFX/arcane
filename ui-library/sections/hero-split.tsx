"use client";

import { forwardRef, type ReactNode, type HTMLAttributes } from "react";
import { motion, type Variants } from "motion/react";
import { cn } from "@uilibrary/utils";
import { useReducedMotion } from "@uilibrary/hooks/use-reduced-motion";
import { Button } from "../components/button";

/* ─────────────────────────────────────────────
 * Hero Split — Asymmetric 5/7 layout
 *
 * Anti-slop choices:
 * - Asymmetric grid (5fr / 7fr), NOT 50/50
 * - Serif headline (Fraunces) with extreme weight contrast
 * - Feature list uses dashes, not checkmark icons
 * - Social proof as plain text with a thin rule above
 * - No blob gradients, no radial glows
 * - Right side has subtle inset border, not drop shadow
 * ───────────────────────────────────────────── */

export interface HeroSplitProps extends HTMLAttributes<HTMLElement> {
  badge?: string;
  headline: string;
  highlightText?: string;
  subheadline?: string;
  ctaLabel?: string;
  ctaHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
  imageSrc?: string;
  imageAlt?: string;
  reversed?: boolean;
  features?: { icon?: ReactNode; text: string }[];
  socialProof?: string;
  avatars?: string[];
  children?: ReactNode;
}

/* ── Animation ──────────────────────────────── */

const EASE = [0.16, 1, 0.3, 1] as const;

const textStagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.08 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: EASE } },
};

const visualReveal: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.8, ease: EASE, delay: 0.2 },
  },
};

/* ── Component ──────────────────────────────── */

export const HeroSplit = forwardRef<HTMLElement, HeroSplitProps>(
  (
    {
      badge,
      headline,
      highlightText,
      subheadline,
      ctaLabel = "Get Started",
      ctaHref = "#",
      secondaryLabel,
      secondaryHref = "#",
      imageSrc,
      imageAlt = "Product illustration",
      reversed = false,
      features,
      socialProof,
      avatars,
      children,
      className,
      ...props
    },
    ref,
  ) => {
    const reduced = useReducedMotion();

    return (
      <section
        ref={ref}
        className={cn(
          "relative isolate overflow-hidden",
          "px-6 py-[clamp(5rem,10vh,8rem)]",
          className,
        )}
        {...props}
      >
        {/* ── Grid — asymmetric 5/7 ───────────────── */}
        <div
          className={cn(
            "mx-auto grid w-full max-w-[1200px] items-center gap-12 lg:gap-16",
            "grid-cols-1 lg:grid-cols-12",
          )}
        >
          {/* ── Text column (5 cols) ──────────────── */}
          <motion.div
            className={cn(
              "flex flex-col lg:col-span-5",
              reversed ? "lg:order-2" : "lg:order-1",
              "max-lg:items-center max-lg:text-center",
            )}
            variants={reduced ? undefined : textStagger}
            initial={reduced ? undefined : "hidden"}
            animate={reduced ? undefined : "visible"}
          >
            {/* Badge — plain uppercase label */}
            {badge && (
              <motion.p
                variants={reduced ? undefined : fadeUp}
                className={cn(
                  "mb-5 text-[11px] font-semibold uppercase tracking-[0.18em]",
                  "text-[var(--color-accent)]",
                )}
              >
                {badge}
              </motion.p>
            )}

            {/* Headline — Fraunces serif, tight tracking */}
            <motion.h1
              variants={reduced ? undefined : fadeUp}
              className={cn(
                "font-[var(--font-fraunces)]",
                "text-[clamp(2rem,4vw+0.5rem,3.75rem)]",
                "font-semibold leading-[1.08] tracking-[-0.035em]",
                "text-[var(--color-text)]",
                "text-balance",
              )}
            >
              {headline}
              {highlightText && (
                <>
                  <br />
                  <span className="font-light italic text-[var(--color-accent)]">
                    {highlightText}
                  </span>
                </>
              )}
            </motion.h1>

            {/* Subheadline */}
            {subheadline && (
              <motion.p
                variants={reduced ? undefined : fadeUp}
                className={cn(
                  "mt-5 max-w-[440px]",
                  "text-[15px] leading-[1.7]",
                  "text-[var(--color-text-secondary)]",
                )}
              >
                {subheadline}
              </motion.p>
            )}

            {/* Feature list — dashes, not checkmarks */}
            {features && features.length > 0 && (
              <motion.ul
                variants={reduced ? undefined : fadeUp}
                className="mt-8 flex flex-col gap-2.5 max-lg:items-center"
              >
                {features.map((f, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-3 text-[14px] text-[var(--color-text)]"
                  >
                    <span className="text-[var(--color-text-muted)]" aria-hidden="true">
                      —
                    </span>
                    <span>{f.text}</span>
                  </li>
                ))}
              </motion.ul>
            )}

            {/* CTAs */}
            <motion.div
              variants={reduced ? undefined : fadeUp}
              className="mt-10 flex flex-wrap items-center gap-4 max-lg:justify-center"
            >
              <Button size="lg" asChild>
                <a href={ctaHref}>{ctaLabel}</a>
              </Button>
              {secondaryLabel && (
                <Button variant="ghost" size="lg" asChild>
                  <a href={secondaryHref}>{secondaryLabel}</a>
                </Button>
              )}
            </motion.div>

            {/* Social proof — plain text with rule */}
            {(socialProof || (avatars && avatars.length > 0)) && (
              <motion.div
                variants={reduced ? undefined : fadeUp}
                className="mt-10 max-lg:items-center"
              >
                <div className="mb-3 h-px w-8 bg-[var(--color-border)] max-lg:mx-auto" />
                <div className="flex items-center gap-3 max-lg:justify-center">
                  {avatars && avatars.length > 0 && (
                    <div className="flex -space-x-2">
                      {avatars.map((src, i) => (
                        <img
                          key={i}
                          src={src}
                          alt=""
                          className="h-7 w-7 rounded-full border-2 border-[var(--color-bg)] object-cover"
                          style={{ zIndex: avatars.length - i }}
                        />
                      ))}
                    </div>
                  )}
                  {socialProof && (
                    <p className="text-[13px] text-[var(--color-text-muted)]">
                      {socialProof}
                    </p>
                  )}
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* ── Visual column (7 cols) ────────────── */}
          <motion.div
            className={cn(
              "relative lg:col-span-7",
              reversed ? "lg:order-1" : "lg:order-2",
              "max-lg:mx-auto max-lg:max-w-[560px]",
            )}
            variants={reduced ? undefined : visualReveal}
            initial={reduced ? undefined : "hidden"}
            animate={reduced ? undefined : "visible"}
          >
            {imageSrc ? (
              <img
                src={imageSrc}
                alt={imageAlt}
                className={cn(
                  "relative z-10 w-full rounded-lg object-cover",
                  "border border-[var(--color-border)]",
                )}
                loading="lazy"
              />
            ) : children ? (
              <div className="relative z-10">{children}</div>
            ) : (
              /* Placeholder — dashboard mockup */
              <div
                className={cn(
                  "relative z-10 aspect-[4/3] w-full overflow-hidden rounded-lg",
                  "border border-[var(--color-border)]",
                  "bg-[var(--color-bg-subtle)]",
                  "shadow-[0_1px_3px_rgb(0_0_0/0.04),0_8px_24px_rgb(0_0_0/0.05)]",
                  "dark:shadow-[0_1px_3px_rgb(0_0_0/0.2),0_8px_24px_rgb(0_0_0/0.25)]",
                )}
              >
                <div className="flex h-8 items-center gap-[6px] border-b border-[var(--color-border)] px-3">
                  <div className="h-[9px] w-[9px] rounded-full bg-[#ff5f57] opacity-70" />
                  <div className="h-[9px] w-[9px] rounded-full bg-[#febc2e] opacity-70" />
                  <div className="h-[9px] w-[9px] rounded-full bg-[#28c840] opacity-70" />
                </div>
                <div className="flex h-full">
                  <div className="w-[52px] border-r border-[var(--color-border)] p-2.5">
                    <div className="mb-3 h-5 w-5 rounded bg-[var(--color-accent)] opacity-50" />
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="mb-2.5 h-4 w-4 rounded bg-[var(--color-text-muted)] opacity-15" />
                    ))}
                  </div>
                  <div className="flex-1 p-4">
                    <div className="mb-3 flex gap-2.5">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="flex-1 rounded border border-[var(--color-border)] p-2.5">
                          <div className="mb-1.5 h-1.5 w-8 rounded bg-[var(--color-text-muted)] opacity-20" />
                          <div className="h-4 w-12 rounded bg-[var(--color-text)] opacity-15" />
                        </div>
                      ))}
                    </div>
                    <div className="rounded border border-[var(--color-border)] p-3">
                      <div className="mb-2 h-1.5 w-14 rounded bg-[var(--color-text-muted)] opacity-20" />
                      <div className="flex h-20 items-end gap-1.5">
                        {[35, 55, 40, 72, 48, 85, 62, 78, 50, 68, 88, 42].map((h, i) => (
                          <div
                            key={i}
                            className="flex-1 rounded-t-sm bg-[var(--color-accent)]"
                            style={{ height: `${h}%`, opacity: 0.25 + (h / 100) * 0.55 }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </section>
    );
  },
);

HeroSplit.displayName = "HeroSplit";
