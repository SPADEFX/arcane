"use client";

import { forwardRef, type HTMLAttributes } from "react";
import { motion, type Variants } from "motion/react";
import { cn } from "@uilibrary/utils";
import { useReducedMotion } from "@uilibrary/hooks/use-reduced-motion";
import { Button } from "../components/button";

/* ─────────────────────────────────────────────
 * Hero Bento — Grid composition
 *
 * Anti-slop choices:
 * - Bricolage Grotesque for headline — not Inter
 * - Concentric border-radius (outer 20px, inner 12px with 8px gap)
 * - Varied cell backgrounds (some tinted, some plain)
 * - No blob gradients — clean surfaces
 * - Stat numbers use Space Grotesk for a tabular, engineering feel
 * - Feature cells use a left accent border, not floating icons
 * ───────────────────────────────────────────── */

export interface BentoCell {
  type: "headline" | "stat" | "feature" | "testimonial" | "image" | "cta";
  colSpan?: 1 | 2;
  rowSpan?: 1 | 2;
  headline?: string;
  highlightText?: string;
  subheadline?: string;
  value?: string;
  label?: string;
  title?: string;
  description?: string;
  icon?: string;
  quote?: string;
  author?: string;
  role?: string;
  avatarSrc?: string;
  src?: string;
  alt?: string;
  ctaLabel?: string;
  ctaHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
}

export interface HeroBentoProps extends HTMLAttributes<HTMLElement> {
  cells?: BentoCell[];
  gradient?: boolean;
}

/* ── Default cells ──────────────────────────── */

const DEFAULT_CELLS: BentoCell[] = [
  {
    type: "headline",
    colSpan: 2,
    headline: "Components with intention,",
    highlightText: "not defaults.",
    subheadline:
      "Opinionated design tokens, GPU-accelerated motion, and typography that was actually chosen.",
  },
  { type: "stat", value: "57", label: "Components" },
  { type: "stat", value: "60", label: "FPS guaranteed" },
  {
    type: "feature",
    title: "Token-driven theming",
    description: "10 CSS variables = a new brand. No digging through 200 files.",
  },
  {
    type: "testimonial",
    quote: "First library where the defaults don't look like defaults.",
    author: "Sarah Chen",
    role: "Design Lead",
  },
  {
    type: "feature",
    title: "Dark + Light, tested",
    description: "Not just swapped colors. Every component is reviewed in both modes.",
  },
  {
    type: "cta",
    ctaLabel: "Start Building",
    ctaHref: "#",
    secondaryLabel: "Browse Library",
    secondaryHref: "#",
  },
];

/* ── Animation ──────────────────────────────── */

const EASE = [0.16, 1, 0.3, 1] as const;

const grid: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
};

const cell: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
};

/* ── Cell renderer ──────────────────────────── */

function CellContent({ data }: { data: BentoCell }) {
  switch (data.type) {
    case "headline":
      return (
        <div className="flex flex-col justify-center p-7 lg:p-9">
          <h1
            className={cn(
              "font-[var(--font-bricolage)]",
              "text-[clamp(1.5rem,3vw+0.5rem,2.75rem)]",
              "font-bold leading-[1.1] tracking-[-0.03em]",
              "text-[var(--color-text)] text-balance",
            )}
          >
            {data.headline}
            {data.highlightText && (
              <>
                <br />
                <span className="font-normal text-[var(--color-accent)]">
                  {data.highlightText}
                </span>
              </>
            )}
          </h1>
          {data.subheadline && (
            <p className="mt-4 max-w-[420px] text-[14px] leading-[1.7] text-[var(--color-text-muted)]">
              {data.subheadline}
            </p>
          )}
        </div>
      );

    case "stat":
      return (
        <div className="flex flex-col items-center justify-center p-6 text-center">
          <span
            className={cn(
              "font-[var(--font-space-grotesk)]",
              "text-[clamp(2.5rem,5vw,4rem)] font-bold tracking-[-0.04em]",
              "text-[var(--color-accent)]",
            )}
          >
            {data.value}
          </span>
          <span className="mt-1 text-[12px] font-medium uppercase tracking-[0.12em] text-[var(--color-text-secondary)]">
            {data.label}
          </span>
          {/* Mini sparkline */}
          <svg className="mt-3 h-6 w-full max-w-[100px]" viewBox="0 0 100 24" fill="none">
            <polyline
              points="0,20 10,16 20,18 30,12 40,14 50,8 60,10 70,4 80,6 90,2 100,4"
              stroke="var(--color-accent)"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.4"
            />
            <circle cx="100" cy="4" r="2" fill="var(--color-accent)" opacity="0.6" />
          </svg>
        </div>
      );

    case "feature":
      return (
        <div
          className={cn(
            "flex flex-col justify-center p-6",
            "border-l-2 border-[var(--color-accent)] ml-0",
          )}
          style={{ paddingLeft: "calc(1.5rem - 2px)" }}
        >
          <h3 className="text-[14px] font-semibold text-[var(--color-text)]">
            {data.title}
          </h3>
          {data.description && (
            <p className="mt-1.5 text-[13px] leading-[1.6] text-[var(--color-text-secondary)]">
              {data.description}
            </p>
          )}
        </div>
      );

    case "testimonial":
      return (
        <div className="flex flex-col justify-between p-6">
          <p className="text-[14px] leading-[1.65] text-[var(--color-text-secondary)]">
            &ldquo;{data.quote}&rdquo;
          </p>
          <div className="mt-5 flex items-center gap-2.5">
            {data.avatarSrc && (
              <img src={data.avatarSrc} alt="" className="h-6 w-6 rounded-full object-cover" />
            )}
            <div>
              <p className="text-[12px] font-medium text-[var(--color-text)]">{data.author}</p>
              {data.role && (
                <p className="text-[11px] text-[var(--color-text-muted)]">{data.role}</p>
              )}
            </div>
          </div>
        </div>
      );

    case "image":
      return (
        <img src={data.src} alt={data.alt || ""} className="h-full w-full object-cover" loading="lazy" />
      );

    case "cta":
      return (
        <div className="flex flex-col items-center justify-center gap-3 p-6">
          <Button size="lg" asChild className="w-full max-w-[200px]">
            <a href={data.ctaHref || "#"}>{data.ctaLabel || "Get Started"}</a>
          </Button>
          {data.secondaryLabel && (
            <Button variant="ghost" size="sm" asChild>
              <a href={data.secondaryHref || "#"}>{data.secondaryLabel}</a>
            </Button>
          )}
        </div>
      );

    default:
      return null;
  }
}

/* ── Component ──────────────────────────────── */

export const HeroBento = forwardRef<HTMLElement, HeroBentoProps>(
  ({ cells = DEFAULT_CELLS, gradient = true, className, ...props }, ref) => {
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
        <motion.div
          className={cn(
            "mx-auto grid w-full max-w-[980px] gap-2.5",
            "grid-cols-2 md:grid-cols-4",
            "auto-rows-[minmax(140px,1fr)]",
          )}
          variants={reduced ? undefined : grid}
          initial={reduced ? undefined : "hidden"}
          animate={reduced ? undefined : "visible"}
        >
          {cells.map((c, i) => (
            <motion.div
              key={i}
              variants={reduced ? undefined : cell}
              className={cn(
                "group relative overflow-hidden",
                /* Concentric radius: outer 16px */
                "rounded-[16px]",
                "border border-[var(--color-border)]",
                "bg-[var(--color-bg)]",
                "dark:bg-[var(--color-neutral-900)]",
                /* Layered shadow */
                "shadow-[0_1px_2px_rgb(0_0_0/0.03),0_0_0_1px_rgb(0_0_0/0.02)]",
                "dark:shadow-[0_1px_2px_rgb(0_0_0/0.15),0_0_0_1px_rgb(255_255_255/0.03)]",
                /* Hover: lift + border highlight */
                "transition-[transform,border-color] duration-200 ease-out",
                "hover:-translate-y-0.5 hover:border-[var(--color-text-muted)]",
                c.colSpan === 2 && "col-span-2",
                c.rowSpan === 2 && "row-span-2",
              )}
            >
              <CellContent data={c} />
            </motion.div>
          ))}
        </motion.div>
      </section>
    );
  },
);

HeroBento.displayName = "HeroBento";
