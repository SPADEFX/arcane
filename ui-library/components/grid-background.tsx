"use client";

import { cn } from "@uilibrary/utils";

export interface GridBackgroundProps {
  variant?: "grid" | "dots";
  size?: number;
  color?: string;
  fade?: boolean;
  className?: string;
}

export function GridBackground({
  variant = "grid",
  size = 40,
  color = "rgba(255, 255, 255, 0.05)",
  fade = true,
  className,
}: GridBackgroundProps) {
  const bg =
    variant === "grid"
      ? `linear-gradient(${color} 1px, transparent 1px), linear-gradient(90deg, ${color} 1px, transparent 1px)`
      : `radial-gradient(circle, ${color} 1px, transparent 1px)`;

  return (
    <div
      className={cn("absolute inset-0 pointer-events-none", className)}
      style={{
        backgroundImage: bg,
        backgroundSize: `${size}px ${size}px`,
        maskImage: fade
          ? "radial-gradient(ellipse 80% 60% at 50% 50%, black 40%, transparent 100%)"
          : undefined,
        WebkitMaskImage: fade
          ? "radial-gradient(ellipse 80% 60% at 50% 50%, black 40%, transparent 100%)"
          : undefined,
      }}
    />
  );
}
