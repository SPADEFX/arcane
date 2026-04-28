"use client";

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { Slot, Slottable } from "@radix-ui/react-slot";
import { cn } from "@uilibrary/utils";

/* ─── Spinner ──────────────────────────────────────────── */

function Spinner({ className }: { className?: string }) {
  return (
    <svg
      className={cn("animate-spin", className)}
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle
        cx="8"
        cy="8"
        r="6.5"
        stroke="currentColor"
        strokeOpacity="0.25"
        strokeWidth="2.5"
      />
      <path
        d="M14.5 8a6.5 6.5 0 0 0-6.5-6.5"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* ─── Variants ─────────────────────────────────────────── */

const variantStyles = {
  primary: [
    "bg-[var(--color-accent)] text-[var(--color-text-inverse)]",
    "shadow-[var(--shadow-sm)]",
    "hover:bg-[var(--color-accent-hover)] hover:shadow-[var(--shadow-md)]",
  ],
  secondary: [
    "bg-[var(--color-bg-subtle)] text-[var(--color-text)]",
    "hover:bg-[var(--color-bg-muted)]",
  ],
  ghost: [
    "bg-transparent text-[var(--color-text-secondary)]",
    "hover:text-[var(--color-text)] hover:bg-[var(--color-bg-subtle)]",
  ],
  outline: [
    "bg-transparent text-[var(--color-text)]",
    "border border-[var(--color-border-strong)]",
    "hover:bg-[var(--color-bg-subtle)] hover:border-[var(--color-text-muted)]",
  ],
} as const;

const sizeStyles = {
  sm: "h-8 px-3 gap-1.5 text-[var(--font-text-sm)] rounded-[var(--radius-md)]",
  md: "h-10 px-4 gap-2 text-[var(--font-text-md)] rounded-[var(--radius-lg)]",
  lg: "h-12 px-6 gap-2.5 text-[var(--font-text-lg)] rounded-[var(--radius-lg)]",
} as const;

const iconSizeMap = {
  sm: "size-3.5",
  md: "size-4",
  lg: "size-5",
} as const;

/* ─── Props ────────────────────────────────────────────── */

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof variantStyles;
  size?: keyof typeof sizeStyles;
  asChild?: boolean;
  loading?: boolean;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
}

/* ─── Component ────────────────────────────────────────── */

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      asChild = false,
      loading = false,
      iconLeft,
      iconRight,
      disabled,
      children,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : "button";
    const isDisabled = disabled || loading;

    return (
      <Comp
        ref={ref}
        disabled={isDisabled}
        aria-disabled={isDisabled || undefined}
        aria-busy={loading || undefined}
        className={cn(
          /* base layout */
          "inline-flex items-center justify-center font-medium",
          "select-none whitespace-nowrap",

          /* transitions: only transform + opacity (GPU composited) */
          /* background uses a subtle css transition for color shift  */
          "transition-[background-color,box-shadow] duration-[150ms] ease-[var(--ease-out)]",

          /* hover: subtle lift */
          "hover:-translate-y-px",

          /* press: tactile scale */
          "active:scale-[0.98]",

          /* transform transition (separate for the 100ms press timing) */
          "[transition:background-color_150ms_var(--ease-out),box-shadow_150ms_var(--ease-out),transform_100ms_var(--ease-out)]",

          /* focus ring */
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]",

          /* disabled */
          "disabled:opacity-50 disabled:pointer-events-none",

          /* reduced motion */
          "motion-reduce:transform-none motion-reduce:transition-none",

          /* variant + size */
          variantStyles[variant],
          sizeStyles[size],
          className,
        )}
        {...props}
      >
        {/* Loading spinner replaces left icon */}
        {loading ? (
          <Spinner className={iconSizeMap[size]} />
        ) : iconLeft ? (
          <span className={cn("shrink-0", iconSizeMap[size], "[&>svg]:size-full")}>
            {iconLeft}
          </span>
        ) : null}

        <Slottable>{children}</Slottable>

        {iconRight && !loading ? (
          <span className={cn("shrink-0", iconSizeMap[size], "[&>svg]:size-full")}>
            {iconRight}
          </span>
        ) : null}
      </Comp>
    );
  },
);
Button.displayName = "Button";
