"use client";

import { motion } from "motion/react";
import { cn } from "@uilibrary/utils";

export interface ImageRevealProps {
  src: string;
  alt: string;
  width?: number | string;
  height?: number | string;
  direction?: "up" | "down" | "left" | "right";
  duration?: number;
  delay?: number;
  className?: string;
}

const clipDirections = {
  up: { hidden: "inset(100% 0 0 0)", visible: "inset(0 0 0 0)" },
  down: { hidden: "inset(0 0 100% 0)", visible: "inset(0 0 0 0)" },
  left: { hidden: "inset(0 0 0 100%)", visible: "inset(0 0 0 0)" },
  right: { hidden: "inset(0 100% 0 0)", visible: "inset(0 0 0 0)" },
};

export function ImageReveal({
  src,
  alt,
  width,
  height,
  direction = "up",
  duration = 0.8,
  delay = 0,
  className,
}: ImageRevealProps) {
  const clip = clipDirections[direction];

  return (
    <motion.div
      className={cn("overflow-hidden", className)}
      style={{ width, height }}
      initial={{ clipPath: clip.hidden }}
      whileInView={{ clipPath: clip.visible }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{
        duration,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <motion.img
        src={src}
        alt={alt}
        className="h-full w-full object-cover"
        initial={{ scale: 1.2 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true, margin: "-10%" }}
        transition={{
          duration: duration * 1.5,
          delay,
          ease: [0.22, 1, 0.36, 1],
        }}
      />
    </motion.div>
  );
}
