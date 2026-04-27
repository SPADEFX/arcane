"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { cn } from "@uilibrary/utils";

gsap.registerPlugin(ScrollTrigger);

export interface TextScrollRevealProps {
  children: string;
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span";
  by?: "word" | "character" | "line";
  stagger?: number;
  scrub?: boolean | number;
  start?: string;
  end?: string;
  animation?: "reveal" | "highlight" | "fade";
  highlightColor?: string;
  className?: string;
}

export function TextScrollReveal({
  children,
  as: Tag = "p",
  by = "word",
  stagger = 0.03,
  scrub = true,
  start = "top 80%",
  end = "bottom 30%",
  animation = "reveal",
  highlightColor = "var(--color-text)",
  className,
}: TextScrollRevealProps) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current!;
      const text = el.textContent || "";

      let units: string[];
      if (by === "character") {
        units = text.split("");
      } else {
        units = text.split(" ");
      }

      el.innerHTML = "";

      const spans = units.map((unit, i) => {
        const span = document.createElement("span");
        span.className = "inline-block";
        span.style.whiteSpace = "pre";
        span.textContent = by === "word" && i < units.length - 1 ? unit + "\u00A0" : unit;
        el.appendChild(span);
        return span;
      });

      if (animation === "reveal") {
        gsap.from(spans, {
          y: 40,
          opacity: 0,
          stagger,
          ease: "power2.out",
          scrollTrigger: {
            trigger: el,
            start,
            end,
            scrub: scrub || undefined,
            toggleActions: scrub ? undefined : "play none none none",
          },
        });
      } else if (animation === "highlight") {
        spans.forEach((s) => {
          s.style.color = "var(--color-muted)";
          s.style.transition = "color 0s";
        });
        gsap.to(spans, {
          color: highlightColor,
          stagger,
          scrollTrigger: {
            trigger: el,
            start,
            end,
            scrub: scrub || undefined,
          },
        });
      } else {
        gsap.from(spans, {
          opacity: 0.15,
          stagger,
          scrollTrigger: {
            trigger: el,
            start,
            end,
            scrub: scrub || undefined,
          },
        });
      }
    },
    { scope: ref },
  );

  return <Tag ref={ref as any} className={cn(className)}>{children}</Tag>;
}
