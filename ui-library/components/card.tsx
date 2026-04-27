"use client";

import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@uilibrary/utils";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, hover = false, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "rounded-[var(--radius-xl)] border border-[var(--color-border)]",
          "bg-[var(--color-bg)] p-6",
          "shadow-[var(--shadow-sm)]",
          hover && [
            "transition-all duration-[var(--duration-normal)] ease-[var(--ease-spring)]",
            "hover:shadow-[var(--shadow-lg)] hover:-translate-y-1",
          ],
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  },
);
Card.displayName = "Card";
