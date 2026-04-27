"use client";

import { useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { cn } from "@uilibrary/utils";

gsap.registerPlugin(ScrollTrigger);

export interface ScrollRevealProps {
  children: ReactNode;
  animation?: "fade-up" | "fade-down" | "fade-left" | "fade-right" | "scale" | "fade";
  duration?: number;
  delay?: number;
  stagger?: number;
  start?: string;
  scrub?: boolean | number;
  className?: string;
}

const animations = {
  "fade-up": { y: 60, opacity: 0 },
  "fade-down": { y: -60, opacity: 0 },
  "fade-left": { x: -60, opacity: 0 },
  "fade-right": { x: 60, opacity: 0 },
  scale: { scale: 0.85, opacity: 0 },
  fade: { opacity: 0 },
};

export function ScrollReveal({
  children,
  animation = "fade-up",
  duration = 0.8,
  delay = 0,
  stagger = 0,
  start = "top 85%",
  scrub = false,
  className,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const targets = stagger
        ? ref.current!.children
        : ref.current!;

      gsap.from(targets, {
        ...animations[animation],
        duration,
        delay,
        stagger: stagger || undefined,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ref.current,
          start,
          scrub: scrub || undefined,
          toggleActions: "play none none none",
        },
      });
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={cn(className)}>
      {children}
    </div>
  );
}
