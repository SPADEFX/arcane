"use client";

import { type ReactNode } from "react";
import { cn } from "@uilibrary/utils";

export interface MarqueeProps {
  children: ReactNode;
  speed?: number;
  direction?: "left" | "right";
  pauseOnHover?: boolean;
  fade?: boolean;
  className?: string;
}

export function Marquee({
  children,
  speed = 30,
  direction = "left",
  pauseOnHover = true,
  fade = true,
  className,
}: MarqueeProps) {
  const animDirection = direction === "left" ? "normal" : "reverse";

  return (
    <div
      className={cn("group overflow-hidden", className)}
      style={
        fade
          ? {
              maskImage:
                "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)",
              WebkitMaskImage:
                "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)",
            }
          : undefined
      }
    >
      <div
        className={cn(
          "flex w-max gap-8",
          pauseOnHover && "group-hover:[animation-play-state:paused]",
        )}
        style={{
          animation: `marquee-scroll ${speed}s linear infinite`,
          animationDirection: animDirection,
        }}
      >
        <div className="flex shrink-0 gap-8">{children}</div>
        <div className="flex shrink-0 gap-8" aria-hidden>
          {children}
        </div>
      </div>
      <style>{`
        @keyframes marquee-scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
