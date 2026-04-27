"use client";

import { motion } from "motion/react";
import { cn } from "@uilibrary/utils";

export interface TextBlurRevealProps {
  children: string;
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span";
  by?: "word" | "character";
  staggerDelay?: number;
  className?: string;
}

export function TextBlurReveal({
  children,
  as: Tag = "p",
  by = "word",
  staggerDelay = 0.06,
  className,
}: TextBlurRevealProps) {
  const units = by === "word" ? children.split(" ") : children.split("");

  return (
    <Tag className={cn(className)}>
      <motion.span
        className="inline"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-10%" }}
        variants={{
          hidden: {},
          visible: {
            transition: { staggerChildren: staggerDelay },
          },
        }}
      >
        {units.map((unit, i) => (
          <motion.span
            key={i}
            className="inline-block"
            variants={{
              hidden: {
                opacity: 0,
                filter: "blur(12px)",
                y: 8,
              },
              visible: {
                opacity: 1,
                filter: "blur(0px)",
                y: 0,
                transition: {
                  duration: 0.6,
                  ease: [0.22, 1, 0.36, 1],
                },
              },
            }}
          >
            {unit}
            {by === "word" && i < units.length - 1 ? "\u00A0" : ""}
          </motion.span>
        ))}
      </motion.span>
    </Tag>
  );
}
