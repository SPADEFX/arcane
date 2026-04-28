"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, useInView } from "motion/react";
import { cn } from "@uilibrary/utils";
import { useRef } from "react";
import { useReducedMotion } from "@uilibrary/hooks/use-reduced-motion";

export interface TextTypewriterProps {
  text: string | string[];
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span";
  speed?: number;
  deleteSpeed?: number;
  pauseDuration?: number;
  loop?: boolean;
  cursor?: boolean;
  cursorChar?: string;
  className?: string;
  cursorClassName?: string;
}

export function TextTypewriter({
  text,
  as: Tag = "p",
  speed = 50,
  deleteSpeed = 30,
  pauseDuration = 2000,
  loop = true,
  cursor = true,
  cursorChar = "|",
  className,
  cursorClassName,
}: TextTypewriterProps) {
  const prefersReducedMotion = useReducedMotion();
  const texts = Array.isArray(text) ? text : [text];
  const [displayed, setDisplayed] = useState("");
  const [textIndex, setTextIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: false, margin: "-10%" });

  useEffect(() => {
    if (!isInView) return;

    const current = texts[textIndex];

    if (prefersReducedMotion) {
      setDisplayed(current);
      return;
    }

    if (!isDeleting) {
      if (displayed.length < current.length) {
        const timeout = setTimeout(() => {
          setDisplayed(current.slice(0, displayed.length + 1));
        }, speed);
        return () => clearTimeout(timeout);
      }

      if (texts.length === 1 && !loop) return;

      const timeout = setTimeout(() => {
        setIsDeleting(true);
      }, pauseDuration);
      return () => clearTimeout(timeout);
    }

    if (displayed.length > 0) {
      const timeout = setTimeout(() => {
        setDisplayed(displayed.slice(0, -1));
      }, deleteSpeed);
      return () => clearTimeout(timeout);
    }

    setIsDeleting(false);
    setTextIndex((prev) => (prev + 1) % texts.length);
  }, [displayed, isDeleting, textIndex, isInView, texts, speed, deleteSpeed, pauseDuration, loop, prefersReducedMotion]);

  return (
    <Tag ref={ref as any} className={cn("inline-flex", className)}>
      <span>{displayed}</span>
      {cursor && !prefersReducedMotion && (
        <motion.span
          className={cn("ml-0.5 font-light", cursorClassName)}
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse" }}
        >
          {cursorChar}
        </motion.span>
      )}
    </Tag>
  );
}
