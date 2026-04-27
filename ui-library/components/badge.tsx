"use client";

import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@uilibrary/utils";

const variantStyles = {
  default:
    "bg-[var(--color-accent-subtle)] text-[var(--color-accent)] border border-[var(--color-accent)]/20",
  outline:
    "bg-transparent text-[var(--color-text-secondary)] border border-[var(--color-border-strong)]",
  solid:
    "bg-[var(--color-accent)] text-[var(--color-text-inverse)]",
} as const;

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: keyof typeof variantStyles;
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = "default", ...props }, ref) => (
    <span
      ref={ref}
      className={cn(
        "inline-flex items-center gap-1 px-3 py-1",
        "text-[var(--font-text-xs)] font-medium",
        "rounded-[var(--radius-full)]",
        variantStyles[variant],
        className,
      )}
      {...props}
    />
  ),
);
Badge.displayName = "Badge";
