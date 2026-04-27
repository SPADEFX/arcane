"use client";

import { forwardRef, type ButtonHTMLAttributes } from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@uilibrary/utils";

const variantStyles = {
  primary:
    "bg-[var(--color-accent)] text-[var(--color-text-inverse)] hover:bg-[var(--color-accent-hover)] shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)]",
  secondary:
    "bg-transparent text-[var(--color-text)] border border-[var(--color-border-strong)] hover:bg-[var(--color-bg-subtle)]",
  ghost:
    "bg-transparent text-[var(--color-text-secondary)] hover:text-[var(--color-text)] hover:bg-[var(--color-bg-subtle)]",
} as const;

const sizeStyles = {
  sm: "h-8 px-3 text-[var(--font-text-sm)] rounded-[var(--radius-md)]",
  md: "h-10 px-4 text-[var(--font-text-md)] rounded-[var(--radius-lg)]",
  lg: "h-12 px-6 text-[var(--font-text-lg)] rounded-[var(--radius-lg)]",
  xl: "h-14 px-8 text-[var(--font-text-xl)] rounded-[var(--radius-xl)]",
} as const;

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof variantStyles;
  size?: keyof typeof sizeStyles;
  asChild?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant = "primary", size = "md", asChild = false, ...props },
    ref,
  ) => {
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center gap-2 font-medium",
          "transition-all duration-[var(--duration-fast)] ease-[var(--ease-spring)]",
          "active:scale-[0.97]",
          "disabled:pointer-events-none disabled:opacity-50",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]",
          variantStyles[variant],
          sizeStyles[size],
          className,
        )}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";
