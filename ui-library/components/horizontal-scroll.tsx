"use client";

import { useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { cn } from "@uilibrary/utils";

gsap.registerPlugin(ScrollTrigger);

export interface HorizontalScrollProps {
  children: ReactNode;
  snap?: boolean;
  scrubSpeed?: number;
  className?: string;
  panelClassName?: string;
}

export function HorizontalScroll({
  children,
  snap = true,
  scrubSpeed = 1,
  className,
}: HorizontalScrollProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const panels = gsap.utils.toArray<HTMLElement>(
        trackRef.current!.children,
      );

      gsap.to(panels, {
        xPercent: -100 * (panels.length - 1),
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          pin: true,
          scrub: scrubSpeed,
          snap: snap ? 1 / (panels.length - 1) : undefined,
          end: () =>
            "+=" + trackRef.current!.scrollWidth,
          invalidateOnRefresh: true,
        },
      });
    },
    { scope: containerRef },
  );

  return (
    <div ref={containerRef} className={cn("overflow-hidden", className)}>
      <div ref={trackRef} className="flex flex-nowrap">
        {children}
      </div>
    </div>
  );
}
