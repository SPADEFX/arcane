"use client";

import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@uilibrary/utils";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", ...props }, ref) => (
    <input
      ref={ref}
      type={type}
      className={cn(
        "flex h-10 w-full px-4 py-2",
        "rounded-[var(--radius-lg)]",
        "border border-[var(--color-border)]",
        "bg-[var(--color-bg)] text-[var(--color-text)]",
        "text-[var(--font-text-md)]",
        "placeholder:text-[var(--color-text-muted)]",
        "transition-all duration-[var(--duration-fast)] ease-[var(--ease-default)]",
        "focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/30 focus:border-[var(--color-accent)]",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        className,
      )}
      {...props}
    />
  ),
);
Input.displayName = "Input";
