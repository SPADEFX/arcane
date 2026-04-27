"use client";

import { motion, type HTMLMotionProps } from "motion/react";
import { presets } from "../presets";

interface MotionFadeProps extends HTMLMotionProps<"div"> {
  direction?: "up" | "down" | "left" | "right" | "none";
  delay?: number;
}

const directionMap = {
  up: presets.fadeUp,
  down: presets.fadeDown,
  left: presets.fadeLeft,
  right: presets.fadeRight,
  none: presets.fadeIn,
} as const;

export function MotionFade({
  direction = "up",
  delay = 0,
  children,
  ...props
}: MotionFadeProps) {
  const preset = directionMap[direction];

  return (
    <motion.div
      initial={preset.initial}
      animate={preset.animate}
      exit={preset.exit}
      transition={{ ...preset.transition, delay }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
