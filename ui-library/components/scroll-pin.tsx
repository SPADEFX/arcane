"use client";

import { useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { cn } from "@uilibrary/utils";

gsap.registerPlugin(ScrollTrigger);

export interface ScrollPinProps {
  children: ReactNode;
  pinSpacing?: boolean;
  start?: string;
  end?: string;
  className?: string;
}

export function ScrollPin({
  children,
  pinSpacing = true,
  start = "top top",
  end = "+=100%",
  className,
}: ScrollPinProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      ScrollTrigger.create({
        trigger: ref.current,
        pin: true,
        pinSpacing,
        start,
        end,
      });
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={cn("relative", className)}>
      {children}
    </div>
  );
}
