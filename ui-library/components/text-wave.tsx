"use client";

import { motion } from "motion/react";
import { cn } from "@uilibrary/utils";

export interface TextWaveProps {
  children: string;
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span";
  amplitude?: number;
  staggerDelay?: number;
  duration?: number;
  trigger?: "inView" | "hover" | "always";
  className?: string;
}

export function TextWave({
  children,
  as: Tag = "p",
  amplitude = 12,
  staggerDelay = 0.03,
  duration = 0.4,
  trigger = "inView",
  className,
}: TextWaveProps) {
  const chars = children.split("");

  const wrapperProps =
    trigger === "inView"
      ? {
          initial: "hidden" as const,
          whileInView: "visible" as const,
          viewport: { once: true, margin: "-10%" },
        }
      : trigger === "hover"
        ? { initial: "hidden" as const, whileHover: "visible" as const }
        : { animate: "visible" as const };

  return (
    <Tag className={cn("inline-block", className)}>
      <motion.span
        className="inline-flex"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: staggerDelay } },
        }}
        {...wrapperProps}
      >
        {chars.map((char, i) => (
          <motion.span
            key={i}
            className="inline-block"
            style={{ whiteSpace: "pre" }}
            variants={{
              hidden: { y: 0 },
              visible: {
                y: [0, -amplitude, 0],
                transition: {
                  duration,
                  ease: [0.22, 1, 0.36, 1],
                },
              },
            }}
          >
            {char}
          </motion.span>
        ))}
      </motion.span>
    </Tag>
  );
}
