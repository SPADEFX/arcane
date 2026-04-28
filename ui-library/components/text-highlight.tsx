"use client";

import { motion } from "motion/react";
import { cn } from "@uilibrary/utils";
import { useReducedMotion } from "@uilibrary/hooks/use-reduced-motion";

export interface TextHighlightProps {
  children: string;
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span";
  highlight: string | string[];
  highlightColor?: string;
  duration?: number;
  className?: string;
}

export function TextHighlight({
  children,
  as: Tag = "p",
  highlight,
  highlightColor = "var(--color-accent)",
  duration = 0.8,
  className,
}: TextHighlightProps) {
  const prefersReducedMotion = useReducedMotion();
  const highlights = Array.isArray(highlight) ? highlight : [highlight];

  const parts: { text: string; isHighlighted: boolean }[] = [];
  let remaining = children;

  while (remaining.length > 0) {
    let earliest = -1;
    let earliestLen = 0;

    for (const h of highlights) {
      const idx = remaining.toLowerCase().indexOf(h.toLowerCase());
      if (idx !== -1 && (earliest === -1 || idx < earliest)) {
        earliest = idx;
        earliestLen = h.length;
      }
    }

    if (earliest === -1) {
      parts.push({ text: remaining, isHighlighted: false });
      break;
    }

    if (earliest > 0) {
      parts.push({ text: remaining.slice(0, earliest), isHighlighted: false });
    }
    parts.push({ text: remaining.slice(earliest, earliest + earliestLen), isHighlighted: true });
    remaining = remaining.slice(earliest + earliestLen);
  }

  return (
    <Tag className={cn(className)}>
      {parts.map((part, i) =>
        part.isHighlighted ? (
          <motion.span
            key={i}
            className="relative inline-block"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-10%" }}
          >
            <span className="relative z-10">{part.text}</span>
            <motion.span
              className="absolute inset-0 -mx-1 -my-0.5 rounded-sm"
              style={{ backgroundColor: highlightColor, opacity: 0.2 }}
              variants={{
                hidden: { scaleX: prefersReducedMotion ? 1 : 0, originX: 0 },
                visible: {
                  scaleX: 1,
                  transition: prefersReducedMotion
                    ? { duration: 0 }
                    : { duration, ease: [0.22, 1, 0.36, 1] },
                },
              }}
            />
          </motion.span>
        ) : (
          <span key={i}>{part.text}</span>
        )
      )}
    </Tag>
  );
}
