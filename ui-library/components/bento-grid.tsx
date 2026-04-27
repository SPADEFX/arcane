"use client";

import { type ReactNode } from "react";
import { motion } from "motion/react";
import { cn } from "@uilibrary/utils";

export interface BentoGridProps {
  children: ReactNode;
  columns?: 2 | 3 | 4;
  className?: string;
}

export interface BentoCardProps {
  children: ReactNode;
  colSpan?: 1 | 2 | 3;
  rowSpan?: 1 | 2;
  className?: string;
}

const colSpanClasses = {
  1: "",
  2: "md:col-span-2",
  3: "md:col-span-3",
} as const;

const rowSpanClasses = {
  1: "",
  2: "md:row-span-2",
} as const;

const gridClasses = {
  2: "grid-cols-1 md:grid-cols-2",
  3: "grid-cols-1 md:grid-cols-3",
  4: "grid-cols-1 md:grid-cols-4",
} as const;

export function BentoGrid({
  children,
  columns = 3,
  className,
}: BentoGridProps) {
  return (
    <div
      className={cn(
        "grid gap-4",
        gridClasses[columns],
        className,
      )}
    >
      {children}
    </div>
  );
}

export function BentoCard({
  children,
  colSpan = 1,
  rowSpan = 1,
  className,
}: BentoCardProps) {
  return (
    <motion.div
      className={cn(
        "group relative overflow-hidden rounded-2xl",
        "border border-[var(--color-border)] bg-[var(--color-surface)]",
        "p-6 transition-shadow hover:shadow-lg",
        colSpanClasses[colSpan],
        rowSpanClasses[rowSpan],
        className,
      )}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
