"use client";

import { forwardRef, type ComponentPropsWithoutRef } from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@uilibrary/utils";

export const Accordion = AccordionPrimitive.Root;

export const AccordionItem = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    className={cn(
      "border-b border-[var(--color-border)]",
      className,
    )}
    {...props}
  />
));
AccordionItem.displayName = "AccordionItem";

export const AccordionTrigger = forwardRef<
  HTMLButtonElement,
  ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        "flex flex-1 items-center justify-between py-5 text-left",
        "text-[var(--font-text-lg)] font-medium text-[var(--color-text)]",
        "transition-colors duration-[var(--duration-fast)]",
        "hover:text-[var(--color-accent)]",
        "group",
        className,
      )}
      {...props}
    >
      {children}
      {/* Animated chevron */}
      <svg
        className={cn(
          "h-5 w-5 shrink-0 text-[var(--color-text-muted)]",
          "transition-transform duration-[var(--duration-normal)] ease-[var(--ease-spring)]",
          "group-data-[state=open]:rotate-180",
        )}
        viewBox="0 0 20 20"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M5 7.5L10 12.5L15 7.5" />
      </svg>
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
));
AccordionTrigger.displayName = "AccordionTrigger";

export const AccordionContent = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className={cn(
      "overflow-hidden",
      "data-[state=open]:animate-[accordion-open_300ms_ease-out]",
      "data-[state=closed]:animate-[accordion-close_300ms_ease-out]",
      className,
    )}
    {...props}
  >
    <div className="pb-5 text-[var(--font-text-md)] leading-[var(--leading-relaxed)] text-[var(--color-text-secondary)]">
      {children}
    </div>
  </AccordionPrimitive.Content>
));
AccordionContent.displayName = "AccordionContent";
