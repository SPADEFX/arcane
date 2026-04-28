"use client";

import { motion } from "motion/react";
import { cn } from "@uilibrary/utils";
import { useReducedMotion } from "@uilibrary/hooks/use-reduced-motion";

export interface TextGradientFlowProps {
  children: string;
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span";
  colors?: string[];
  duration?: number;
  className?: string;
}

export function TextGradientFlow({
  children,
  as: Tag = "h2",
  colors = [
    "var(--color-accent)",
    "var(--color-brand-400)",
    "var(--color-brand-300)",
    "var(--color-brand-500)",
    "var(--color-accent)",
  ],
  duration = 5,
  className,
}: TextGradientFlowProps) {
  const prefersReducedMotion = useReducedMotion();
  const gradient = `linear-gradient(90deg, ${colors.join(", ")})`;

  return (
    <Tag className={cn("relative", className)}>
      <motion.span
        className="bg-clip-text text-transparent inline-block"
        style={{
          backgroundImage: gradient,
          backgroundSize: prefersReducedMotion ? "100% 100%" : "300% 100%",
        }}
        animate={
          prefersReducedMotion
            ? {}
            : { backgroundPosition: ["0% center", "100% center", "0% center"] }
        }
        transition={
          prefersReducedMotion
            ? { duration: 0 }
            : { duration, repeat: Infinity, ease: "linear" }
        }
      >
        {children}
      </motion.span>
    </Tag>
  );
}
