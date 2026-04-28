"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@uilibrary/utils";
import { useReducedMotion } from "@uilibrary/hooks/use-reduced-motion";

export interface TextRotateProps {
  words: string[];
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span";
  prefix?: string;
  suffix?: string;
  interval?: number;
  animation?: "slide" | "fade" | "blur" | "scale";
  className?: string;
  wordClassName?: string;
}

const animations = {
  slide: {
    initial: { y: "100%", opacity: 0 },
    animate: { y: "0%", opacity: 1 },
    exit: { y: "-100%", opacity: 0 },
  },
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  blur: {
    initial: { opacity: 0, filter: "blur(8px)" },
    animate: { opacity: 1, filter: "blur(0px)" },
    exit: { opacity: 0, filter: "blur(8px)" },
  },
  scale: {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 1.2 },
  },
};

export function TextRotate({
  words,
  as: Tag = "p",
  prefix,
  suffix,
  interval = 3000,
  animation = "slide",
  className,
  wordClassName,
}: TextRotateProps) {
  const prefersReducedMotion = useReducedMotion();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length);
    }, interval);
    return () => clearInterval(timer);
  }, [words.length, interval]);

  const anim = animations[animation];

  return (
    <Tag className={cn("inline-flex items-center gap-2", className)}>
      {prefix && <span>{prefix}</span>}
      <span className="relative inline-flex overflow-hidden">
        <AnimatePresence mode="popLayout">
          <motion.span
            key={words[index]}
            className={cn("inline-block", wordClassName)}
            initial={prefersReducedMotion ? {} : anim.initial}
            animate={prefersReducedMotion ? {} : anim.animate}
            exit={prefersReducedMotion ? {} : anim.exit}
            transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            {words[index]}
          </motion.span>
        </AnimatePresence>
      </span>
      {suffix && <span>{suffix}</span>}
    </Tag>
  );
}
