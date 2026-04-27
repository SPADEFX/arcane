"use client";

import { motion } from "motion/react";
import { cn } from "@uilibrary/utils";

export interface TextPullUpProps {
  children: string;
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span";
  by?: "word" | "character";
  staggerDelay?: number;
  className?: string;
}

export function TextPullUp({
  children,
  as: Tag = "h2",
  by = "word",
  staggerDelay = 0.05,
  className,
}: TextPullUpProps) {
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
          visible: { transition: { staggerChildren: staggerDelay } },
        }}
      >
        {units.map((unit, i) => (
          <span key={i} className="inline-block overflow-hidden">
            <motion.span
              className="inline-block"
              variants={{
                hidden: { y: "100%" },
                visible: {
                  y: "0%",
                  transition: {
                    type: "spring",
                    stiffness: 300,
                    damping: 30,
                  },
                },
              }}
            >
              {unit}
              {by === "word" && i < units.length - 1 ? "\u00A0" : ""}
            </motion.span>
          </span>
        ))}
      </motion.span>
    </Tag>
  );
}
