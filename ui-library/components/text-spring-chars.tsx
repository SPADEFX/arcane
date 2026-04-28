"use client";

import { motion } from "motion/react";
import { cn } from "@uilibrary/utils";
import { useReducedMotion } from "@uilibrary/hooks/use-reduced-motion";

export interface TextSpringCharsProps {
  children: string;
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span";
  staggerDelay?: number;
  stiffness?: number;
  damping?: number;
  className?: string;
}

export function TextSpringChars({
  children,
  as: Tag = "h2",
  staggerDelay = 0.025,
  stiffness = 400,
  damping = 25,
  className,
}: TextSpringCharsProps) {
  const prefersReducedMotion = useReducedMotion();
  const chars = children.split("");

  return (
    <Tag className={cn(className)}>
      <motion.span
        className="inline"
        initial={prefersReducedMotion ? "visible" : "hidden"}
        whileInView="visible"
        viewport={{ once: true, margin: "-10%" }}
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: prefersReducedMotion ? 0 : staggerDelay } },
        }}
      >
        {chars.map((char, i) => (
          <span key={i} className="inline-block overflow-hidden">
            <motion.span
              className="inline-block"
              style={{ whiteSpace: "pre" }}
              variants={{
                hidden: {
                  y: prefersReducedMotion ? "0%" : "120%",
                  rotateX: prefersReducedMotion ? 0 : 90,
                  opacity: prefersReducedMotion ? 1 : 0,
                },
                visible: {
                  y: "0%",
                  rotateX: 0,
                  opacity: 1,
                  transition: prefersReducedMotion
                    ? { duration: 0 }
                    : { type: "spring", stiffness, damping },
                },
              }}
            >
              {char}
            </motion.span>
          </span>
        ))}
      </motion.span>
    </Tag>
  );
}
