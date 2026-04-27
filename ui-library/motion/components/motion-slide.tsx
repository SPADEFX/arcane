"use client";

import { motion, type HTMLMotionProps } from "motion/react";

interface MotionSlideProps extends HTMLMotionProps<"div"> {
  direction?: "up" | "down" | "left" | "right";
  distance?: number;
  delay?: number;
}

const axis = {
  up: { prop: "y", sign: 1 },
  down: { prop: "y", sign: -1 },
  left: { prop: "x", sign: -1 },
  right: { prop: "x", sign: 1 },
} as const;

export function MotionSlide({
  direction = "up",
  distance = 40,
  delay = 0,
  children,
  ...props
}: MotionSlideProps) {
  const { prop, sign } = axis[direction];

  return (
    <motion.div
      initial={{ opacity: 0, [prop]: distance * sign }}
      animate={{ opacity: 1, [prop]: 0 }}
      exit={{ opacity: 0, [prop]: distance * sign }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
