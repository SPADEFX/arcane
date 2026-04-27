"use client";

import { cn } from "@uilibrary/utils";

export interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  rounded?: "sm" | "md" | "lg" | "full";
  className?: string;
}

const roundedClasses = {
  sm: "rounded",
  md: "rounded-md",
  lg: "rounded-lg",
  full: "rounded-full",
};

export function Skeleton({
  width,
  height,
  rounded = "md",
  className,
}: SkeletonProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden bg-[var(--color-muted)]/10",
        roundedClasses[rounded],
        className,
      )}
      style={{ width, height }}
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.04) 50%, transparent 100%)",
          animation: "skeleton-shimmer 1.5s ease-in-out infinite",
        }}
      />
      <style>{`
        @keyframes skeleton-shimmer {
          from { transform: translateX(-100%); }
          to { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}
