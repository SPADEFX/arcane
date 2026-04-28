"use client";

import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "@uilibrary/utils";

/* ─── Variants ─────────────────────────────────────────── */

const variantStyles = {
  default: [
    "bg-[var(--color-bg)] border border-[var(--color-border)]",
    "shadow-[var(--shadow-sm)]",
  ],
  ghost: [
    "bg-transparent border border-transparent",
  ],
  elevated: [
    "bg-[var(--color-bg)] border border-[var(--color-border)]",
    "shadow-[var(--shadow-lg)]",
  ],
} as const;

const paddingStyles = {
  compact: "p-4",
  default: "p-6",
  spacious: "p-8",
} as const;

/* ─── Props ────────────────────────────────────────────── */

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: keyof typeof variantStyles;
  padding?: keyof typeof paddingStyles;
  glass?: boolean;
  hover?: boolean;
  header?: ReactNode;
  footer?: ReactNode;
}

/* ─── Component ────────────────────────────────────────── */

export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      className,
      variant = "default",
      padding = "default",
      glass = false,
      hover = false,
      header,
      footer,
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          /* base shape */
          "rounded-[var(--radius-xl)] overflow-hidden",

          /* variant */
          variantStyles[variant],

          /* glass effect */
          glass && [
            "backdrop-blur-xl",
            "bg-[var(--color-bg)]/80",
          ],

          /* hover interaction — only transform + opacity + shadow (GPU) */
          hover && [
            "transition-[box-shadow,border-color,transform] duration-[150ms] ease-[var(--ease-out)]",
            "hover:shadow-[var(--shadow-lg)]",
            "hover:border-[var(--color-border-strong)]",
            "hover:-translate-y-px",
            "motion-reduce:transform-none motion-reduce:transition-none",
          ],

          className,
        )}
        {...props}
      >
        {/* Header */}
        {header && (
          <div
            className={cn(
              "border-b border-[var(--color-border)]",
              padding === "compact" ? "px-4 py-3" : padding === "spacious" ? "px-8 py-5" : "px-6 py-4",
            )}
          >
            {header}
          </div>
        )}

        {/* Body */}
        <div className={paddingStyles[padding]}>
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div
            className={cn(
              "border-t border-[var(--color-border)]",
              padding === "compact" ? "px-4 py-3" : padding === "spacious" ? "px-8 py-5" : "px-6 py-4",
            )}
          >
            {footer}
          </div>
        )}
      </div>
    );
  },
);
Card.displayName = "Card";
