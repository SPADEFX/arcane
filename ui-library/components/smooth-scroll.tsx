"use client";

import { useEffect, type ReactNode } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export interface SmoothScrollProps {
  children: ReactNode;
  duration?: number;
  easing?: (t: number) => number;
  smoothTouch?: boolean;
}

const defaultEasing = (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t));

export function SmoothScroll({
  children,
  duration = 1.2,
  easing = defaultEasing,
  smoothTouch = false,
}: SmoothScrollProps) {
  useEffect(() => {
    const lenis = new Lenis({
      duration,
      easing,
      smoothWheel: true,
      touchMultiplier: 2,
    });

    lenis.on("scroll", ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
    };
  }, [duration, easing, smoothTouch]);

  return <>{children}</>;
}
