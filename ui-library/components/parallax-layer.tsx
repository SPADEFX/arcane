"use client";

import { useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { cn } from "@uilibrary/utils";

gsap.registerPlugin(ScrollTrigger);

export interface ParallaxLayerProps {
  children: ReactNode;
  speed?: number;
  direction?: "vertical" | "horizontal";
  className?: string;
}

export function ParallaxLayer({
  children,
  speed = 0.5,
  direction = "vertical",
  className,
}: ParallaxLayerProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const distance = speed * 200;
      const props =
        direction === "vertical"
          ? { y: -distance }
          : { x: -distance };

      gsap.to(ref.current, {
        ...props,
        ease: "none",
        scrollTrigger: {
          trigger: ref.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
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
