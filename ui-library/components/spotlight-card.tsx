"use client";

import { useRef, useState, useCallback, type ReactNode } from "react";
import { cn } from "@uilibrary/utils";

export interface SpotlightCardProps {
  children: ReactNode;
  spotlightColor?: string;
  spotlightSize?: number;
  borderColor?: string;
  className?: string;
}

export function SpotlightCard({
  children,
  spotlightColor = "rgba(120, 119, 255, 0.15)",
  spotlightSize = 400,
  borderColor = "rgba(255, 255, 255, 0.08)",
  className,
}: SpotlightCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: -spotlightSize, y: -spotlightSize });
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      setMousePos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    },
    [],
  );

  return (
    <div
      ref={ref}
      className={cn(
        "relative overflow-hidden rounded-2xl p-px",
        className,
      )}
      style={{
        background: isHovering
          ? `radial-gradient(${spotlightSize}px circle at ${mousePos.x}px ${mousePos.y}px, ${spotlightColor}, transparent 40%), ${borderColor}`
          : borderColor,
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div
        className="relative rounded-[15px] bg-[var(--color-surface)] p-6 h-full"
        style={{
          background: isHovering
            ? `radial-gradient(${spotlightSize}px circle at ${mousePos.x}px ${mousePos.y}px, ${spotlightColor.replace("0.15", "0.06")}, var(--color-surface) 40%)`
            : undefined,
          backgroundColor: !isHovering ? "var(--color-surface)" : undefined,
        }}
      >
        {children}
      </div>
    </div>
  );
}
