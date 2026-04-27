"use client";

import { motion } from "motion/react";

const ease = [0.22, 1, 0.36, 1] as const;

interface WordRevealProps {
  text: string;
  /** Words to highlight (rendered with lower opacity / gradient) */
  highlight?: string[];
  className?: string;
  style?: React.CSSProperties;
  as?: "h1" | "h2" | "h3";
  delay?: number;
}

export function WordReveal({
  text,
  highlight = [],
  style,
  className,
  as: Tag = "h2",
  delay = 0,
}: WordRevealProps) {
  const words = text.split(" ");

  return (
    <Tag className={className} style={{ ...style, margin: 0 }}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 12, filter: "blur(4px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{
            duration: 0.5,
            ease,
            delay: delay + i * 0.06,
          }}
          style={{
            display: "inline-block",
            marginRight: "0.3em",
            color: highlight.some((h) => word.toLowerCase().includes(h.toLowerCase()))
              ? "rgba(255,255,255,0.4)"
              : undefined,
          }}
        >
          {word}
        </motion.span>
      ))}
    </Tag>
  );
}
