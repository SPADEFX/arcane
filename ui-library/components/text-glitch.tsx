"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { cn } from "@uilibrary/utils";

export interface TextGlitchProps {
  children: string;
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span";
  duration?: number;
  trigger?: "inView" | "hover";
  className?: string;
}

export function TextGlitch({
  children,
  as: Tag = "h2",
  duration = 0.5,
  trigger = "hover",
  className,
}: TextGlitchProps) {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });

  const shouldAnimate = trigger === "inView" ? isInView : false;

  return (
    <Tag
      ref={ref as any}
      className={cn("relative inline-block group", className)}
    >
      <span className="relative z-10">{children}</span>

      {/* Red layer */}
      <motion.span
        className="absolute inset-0 z-0 text-red-500/70"
        aria-hidden
        initial={{ x: 0, opacity: 0 }}
        {...(trigger === "hover"
          ? {
              whileHover: {
                x: [0, -3, 2, -1, 0],
                y: [0, 1, -2, 1, 0],
                opacity: [0, 0.8, 0.8, 0.8, 0],
              },
            }
          : shouldAnimate
            ? {
                animate: {
                  x: [0, -3, 2, -1, 0],
                  y: [0, 1, -2, 1, 0],
                  opacity: [0, 0.8, 0.8, 0.8, 0],
                },
              }
            : {})}
        transition={{ duration, ease: "easeInOut" }}
        style={{ clipPath: "inset(10% 0 60% 0)" }}
      >
        {children}
      </motion.span>

      {/* Blue layer */}
      <motion.span
        className="absolute inset-0 z-0 text-blue-500/70"
        aria-hidden
        initial={{ x: 0, opacity: 0 }}
        {...(trigger === "hover"
          ? {
              whileHover: {
                x: [0, 3, -2, 1, 0],
                y: [0, -1, 2, -1, 0],
                opacity: [0, 0.8, 0.8, 0.8, 0],
              },
            }
          : shouldAnimate
            ? {
                animate: {
                  x: [0, 3, -2, 1, 0],
                  y: [0, -1, 2, -1, 0],
                  opacity: [0, 0.8, 0.8, 0.8, 0],
                },
              }
            : {})}
        transition={{ duration, ease: "easeInOut", delay: 0.05 }}
        style={{ clipPath: "inset(50% 0 10% 0)" }}
      >
        {children}
      </motion.span>
    </Tag>
  );
}
