"use client";

import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@uilibrary/utils";

/* ─── Variant styles ───────────────────────────────────── */
/*
 * Each variant uses a subtle tinted background + matching text.
 * In dark mode, the accent-subtle token adapts automatically.
 * For semantic colors without tokens, we use carefully chosen
 * opacity-based backgrounds that work in both themes.
 */

const variantStyles = {
  default: [
    "bg-[var(--color-bg-muted)] text-[var(--color-text-secondary)]",
  ],
  accent: [
    "bg-[var(--color-accent-subtle)] text-[var(--color-accent)]",
  ],
  success: [
    "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  ],
  warning: [
    "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  ],
  destructive: [
    "bg-red-500/10 text-red-600 dark:text-red-400",
  ],
  outline: [
    "bg-transparent text-[var(--color-text-secondary)]",
    "border border-[var(--color-border-strong)]",
  ],
} as const;

/* Dot colors per variant */
const dotStyles = {
  default: "bg-[var(--color-text-muted)]",
  accent: "bg-[var(--color-accent)]",
  success: "bg-emerald-500",
  warning: "bg-amber-500",
  destructive: "bg-red-500",
  outline: "bg-[var(--color-text-muted)]",
} as const;

const sizeStyles = {
  sm: "h-5 px-2 text-[10px] gap-1",
  md: "h-6 px-2.5 text-[11px] gap-1.5",
} as const;

/* ─── Props ────────────────────────────────────────────── */

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: keyof typeof variantStyles;
  size?: keyof typeof sizeStyles;
  dot?: boolean;
}

/* ─── Component ────────────────────────────────────────── */

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      className,
      variant = "default",
      size = "md",
      dot = false,
      children,
      ...props
    },
    ref,
  ) => (
    <span
      ref={ref}
      className={cn(
        /* base */
        "inline-flex items-center font-medium tracking-wide",
        "rounded-[var(--radius-full)]",
        "whitespace-nowrap select-none",

        /* variant + size */
        variantStyles[variant],
        sizeStyles[size],

        className,
      )}
      {...props}
    >
      {/* Dot indicator */}
      {dot && (
        <span
          className={cn(
            "shrink-0 rounded-full",
            size === "sm" ? "size-1.5" : "size-2",
            dotStyles[variant],
          )}
          aria-hidden="true"
        />
      )}
      {children}
    </span>
  ),
);
Badge.displayName = "Badge";
