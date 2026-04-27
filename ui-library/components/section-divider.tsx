"use client";

import { cn } from "@uilibrary/utils";

export interface SectionDividerProps {
  variant?: "wave" | "tilt" | "curve" | "gradient";
  flip?: boolean;
  color?: string;
  className?: string;
}

const paths = {
  wave: "M0,64 C320,128 640,0 960,64 C1280,128 1600,0 1920,64 L1920,160 L0,160 Z",
  tilt: "M0,0 L1920,128 L1920,160 L0,160 Z",
  curve: "M0,128 Q960,0 1920,128 L1920,160 L0,160 Z",
};

export function SectionDivider({
  variant = "wave",
  flip = false,
  color,
  className,
}: SectionDividerProps) {
  if (variant === "gradient") {
    return (
      <div
        className={cn(
          "h-32 w-full",
          flip ? "rotate-180" : "",
          className,
        )}
        style={{
          background: `linear-gradient(to bottom, transparent, ${color || "var(--color-bg-subtle)"})`,
        }}
      />
    );
  }

  return (
    <div
      className={cn(
        "w-full overflow-hidden leading-[0]",
        flip ? "rotate-180" : "",
        className,
      )}
    >
      <svg
        viewBox="0 0 1920 160"
        preserveAspectRatio="none"
        className="block w-full h-20 md:h-32"
        fill={color || "var(--color-bg-subtle)"}
      >
        <path d={paths[variant]} />
      </svg>
    </div>
  );
}
