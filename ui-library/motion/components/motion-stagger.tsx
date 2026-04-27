"use client";

import { motion, type HTMLMotionProps } from "motion/react";
import { variants } from "../variants";

interface MotionStaggerProps extends HTMLMotionProps<"div"> {
  staggerDelay?: number;
  childDelay?: number;
}

export function MotionStagger({
  staggerDelay = 0.08,
  childDelay = 0.1,
  children,
  ...props
}: MotionStaggerProps) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: staggerDelay,
            delayChildren: childDelay,
          },
        },
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

/** Wrap each child inside MotionStagger with this for stagger effect */
MotionStagger.Item = function MotionStaggerItem({
  children,
  ...props
}: HTMLMotionProps<"div">) {
  return (
    <motion.div variants={variants.staggerItem} {...props}>
      {children}
    </motion.div>
  );
};
