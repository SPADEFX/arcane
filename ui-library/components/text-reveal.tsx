"use client";

import { type ReactNode } from "react";
import { motion } from "motion/react";
import { cn } from "@uilibrary/utils";
import { useReducedMotion } from "@uilibrary/hooks/use-reduced-motion";

export interface TextRevealProps {
  children: string;
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span";
  by?: "word" | "character";
  staggerDelay?: number;
  className?: string;
}

export function TextReveal({
  children,
  as: Tag = "p",
  by = "word",
  staggerDelay = 0.04,
  className,
}: TextRevealProps) {
  const prefersReducedMotion = useReducedMotion();
  const units =
    by === "word" ? children.split(" ") : children.split("");

  return (
    <Tag className={cn("overflow-hidden", className)}>
      <motion.span
        className="inline"
        initial={prefersReducedMotion ? "visible" : "hidden"}
        whileInView="visible"
        viewport={{ once: true, margin: "-10%" }}
        variants={{
          hidden: {},
          visible: {
            transition: {
              staggerChildren: prefersReducedMotion ? 0 : staggerDelay,
            },
          },
        }}
      >
        {units.map((unit, i) => (
          <span key={i} className="inline-block overflow-hidden">
            <motion.span
              className="inline-block"
              variants={{
                hidden: {
                  y: prefersReducedMotion ? "0%" : "110%",
                  opacity: prefersReducedMotion ? 1 : 0,
                },
                visible: {
                  y: "0%",
                  opacity: 1,
                  transition: prefersReducedMotion
                    ? { duration: 0 }
                    : { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
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
