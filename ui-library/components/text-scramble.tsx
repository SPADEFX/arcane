"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useInView } from "motion/react";
import { cn } from "@uilibrary/utils";
import { useReducedMotion } from "@uilibrary/hooks/use-reduced-motion";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&*";

export interface TextScrambleProps {
  children: string;
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span";
  speed?: number;
  scrambleDuration?: number;
  trigger?: "inView" | "hover";
  className?: string;
  charSet?: string;
}

export function TextScramble({
  children,
  as: Tag = "p",
  speed = 30,
  scrambleDuration = 1200,
  trigger = "inView",
  className,
  charSet = CHARS,
}: TextScrambleProps) {
  const prefersReducedMotion = useReducedMotion();
  const [displayed, setDisplayed] = useState(children);
  const [isScrambling, setIsScrambling] = useState(false);
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });
  const hasAnimated = useRef(false);

  const scramble = useCallback(() => {
    if (prefersReducedMotion) {
      setDisplayed(children);
      return;
    }
    if (isScrambling) return;
    setIsScrambling(true);

    const target = children;
    const totalSteps = Math.ceil(scrambleDuration / speed);
    let step = 0;

    const interval = setInterval(() => {
      step++;
      const progress = step / totalSteps;
      const revealed = Math.floor(progress * target.length);

      const result = target
        .split("")
        .map((char, i) => {
          if (char === " ") return " ";
          if (i < revealed) return target[i];
          return charSet[Math.floor(Math.random() * charSet.length)];
        })
        .join("");

      setDisplayed(result);

      if (step >= totalSteps) {
        clearInterval(interval);
        setDisplayed(target);
        setIsScrambling(false);
      }
    }, speed);
  }, [children, speed, scrambleDuration, charSet, isScrambling, prefersReducedMotion]);

  useEffect(() => {
    if (trigger === "inView" && isInView && !hasAnimated.current) {
      hasAnimated.current = true;
      if (prefersReducedMotion) {
        setDisplayed(children);
        return;
      }
      setDisplayed(charSet.slice(0, children.length).split("").map(() => charSet[Math.floor(Math.random() * charSet.length)]).join(""));
      const timeout = setTimeout(scramble, 100);
      return () => clearTimeout(timeout);
    }
  }, [isInView, trigger, scramble, children.length, charSet, prefersReducedMotion, children]);

  return (
    <Tag
      ref={ref as any}
      className={cn("font-mono", className)}
      onMouseEnter={trigger === "hover" ? scramble : undefined}
    >
      {displayed}
    </Tag>
  );
}
