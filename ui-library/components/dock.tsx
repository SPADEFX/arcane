"use client";

import { type ReactNode } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react";
import { useRef } from "react";
import { cn } from "@uilibrary/utils";

export interface DockProps {
  children: ReactNode;
  magnification?: number;
  distance?: number;
  className?: string;
}

export interface DockItemProps {
  children: ReactNode;
  label?: string;
  className?: string;
  onClick?: () => void;
  mouseX?: any;
  magnification?: number;
  distance?: number;
}

export function Dock({
  children,
  magnification = 1.6,
  distance = 120,
  className,
}: DockProps) {
  const mouseX = useMotionValue(Infinity);

  return (
    <motion.div
      className={cn(
        "inline-flex items-end gap-3 rounded-2xl px-4 py-3",
        "border border-[var(--color-border)] bg-[var(--color-surface)]/80 backdrop-blur-xl",
        className,
      )}
      onMouseMove={(e) => mouseX.set(e.pageX)}
      onMouseLeave={() => mouseX.set(Infinity)}
    >
      {Array.isArray(children)
        ? children.map((child: any, i) => {
            if (!child) return null;
            return (
              <DockItemInner
                key={i}
                mouseX={mouseX}
                magnification={magnification}
                distance={distance}
              >
                {child}
              </DockItemInner>
            );
          })
        : children}
    </motion.div>
  );
}

function DockItemInner({
  children,
  mouseX,
  magnification,
  distance,
}: {
  children: ReactNode;
  mouseX: any;
  magnification: number;
  distance: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const baseSize = 48;

  const distanceFromMouse = useTransform(mouseX, (val: number) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return Infinity;
    return val - (rect.left + rect.width / 2);
  });

  const size = useSpring(
    useTransform(distanceFromMouse, [-distance, 0, distance], [
      baseSize,
      baseSize * magnification,
      baseSize,
    ]),
    { stiffness: 300, damping: 25 },
  );

  return (
    <motion.div
      ref={ref}
      className="flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      {children}
    </motion.div>
  );
}

export function DockItem({
  children,
  label,
  className,
  onClick,
}: DockItemProps) {
  return (
    <button
      className={cn(
        "relative flex h-full w-full items-center justify-center",
        "rounded-xl bg-[var(--color-bg)] border border-[var(--color-border)]",
        "transition-colors hover:bg-[var(--color-surface)]",
        "group",
        className,
      )}
      onClick={onClick}
    >
      {children}
      {label && (
        <span className="absolute -top-8 left-1/2 -translate-x-1/2 rounded-md bg-[var(--color-text)] px-2 py-1 text-xs text-[var(--color-bg)] opacity-0 transition-opacity group-hover:opacity-100 whitespace-nowrap">
          {label}
        </span>
      )}
    </button>
  );
}
