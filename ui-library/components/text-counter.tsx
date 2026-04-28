"use client";

import { useEffect, useRef } from "react";
import { motion, useMotionValue, useTransform, animate, useInView } from "motion/react";
import { cn } from "@uilibrary/utils";
import { useReducedMotion } from "@uilibrary/hooks/use-reduced-motion";

export interface TextCounterProps {
  from?: number;
  to: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  separator?: boolean;
  className?: string;
}

export function TextCounter({
  from = 0,
  to,
  duration = 2,
  prefix = "",
  suffix = "",
  decimals = 0,
  separator = true,
  className,
}: TextCounterProps) {
  const prefersReducedMotion = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });
  const count = useMotionValue(from);

  const formatted = useTransform(count, (latest) => {
    const fixed = latest.toFixed(decimals);
    if (!separator) return `${prefix}${fixed}${suffix}`;
    const [int, dec] = fixed.split(".");
    const withSeparator = int.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return `${prefix}${dec ? `${withSeparator}.${dec}` : withSeparator}${suffix}`;
  });

  useEffect(() => {
    if (!isInView) return;
    const controls = animate(count, to, {
      duration: prefersReducedMotion ? 0 : duration,
      ease: [0.22, 1, 0.36, 1],
    });
    return () => controls.stop();
  }, [isInView, count, to, duration, prefersReducedMotion]);

  return (
    <motion.span ref={ref} className={cn("tabular-nums", className)}>
      {formatted}
    </motion.span>
  );
}
