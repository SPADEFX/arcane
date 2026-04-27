"use client";

import { motion } from "motion/react";
import { cn } from "@uilibrary/utils";

export interface TextMaskRevealProps {
  children: string;
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span";
  direction?: "up" | "down" | "left" | "right";
  duration?: number;
  delay?: number;
  className?: string;
}

const clipPaths = {
  up: {
    hidden: "inset(100% 0 0 0)",
    visible: "inset(0% 0 0 0)",
  },
  down: {
    hidden: "inset(0 0 100% 0)",
    visible: "inset(0 0 0% 0)",
  },
  left: {
    hidden: "inset(0 0 0 100%)",
    visible: "inset(0 0 0 0%)",
  },
  right: {
    hidden: "inset(0 100% 0 0)",
    visible: "inset(0 0% 0 0)",
  },
};

export function TextMaskReveal({
  children,
  as: Tag = "h2",
  direction = "up",
  duration = 0.8,
  delay = 0,
  className,
}: TextMaskRevealProps) {
  const clip = clipPaths[direction];

  return (
    <Tag className={cn(className)}>
      <motion.span
        className="inline-block"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-10%" }}
        variants={{
          hidden: { clipPath: clip.hidden },
          visible: {
            clipPath: clip.visible,
            transition: {
              duration,
              delay,
              ease: [0.22, 1, 0.36, 1],
            },
          },
        }}
      >
        {children}
      </motion.span>
    </Tag>
  );
}
