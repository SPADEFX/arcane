"use client";

import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@uilibrary/utils";
import { useReducedMotion } from "@uilibrary/hooks/use-reduced-motion";


export interface ExtractedSectionProps extends HTMLAttributes<HTMLDivElement> {
  /** Button/link text */
  ctaLabel?: string;
}

export const ExtractedSection = forwardRef<HTMLDivElement, ExtractedSectionProps>(
  ({ ctaLabel, className, ...rest }, ref) => {
    const prefersReduced = useReducedMotion();

    return (
      <div ref={ref} className={cn("extracted-section-root", className)} {...rest}>
        <div className="_main_1dul3_20"><h1>Welcome to Proxima,<br /><span>Enter your access key to start.</span></h1><img alt="Proxima" loading="lazy" src="/opengraph-image.png" /><form><div className="undefined _main_zm5pn_1 "><div className="_container_zm5pn_12  "><input id="api_key" placeholder="Access Key" type="text" value="" /></div></div><button className=" _button_1o1ro_1 _tertiary_1o1ro_134 _large_1o1ro_172 " type="submit" style={{"width":"100%","marginTop":"24px"}}>{ctaLabel}</button></form></div>
      </div>
    );
  }
);
ExtractedSection.displayName = "ExtractedSection";
