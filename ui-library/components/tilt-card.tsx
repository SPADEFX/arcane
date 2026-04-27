"use client";

import { useRef, useCallback, type ReactNode } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { cn } from "@uilibrary/utils";

export interface TiltCardProps {
  children: ReactNode;
  maxTilt?: number;
  glare?: boolean;
  scale?: number;
  className?: string;
}

export function TiltCard({
  children,
  maxTilt = 12,
  glare = true,
  scale = 1.02,
  className,
}: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  const rotateX = useSpring(useTransform(mouseY, [0, 1], [maxTilt, -maxTilt]), {
    stiffness: 200,
    damping: 20,
  });
  const rotateY = useSpring(useTransform(mouseX, [0, 1], [-maxTilt, maxTilt]), {
    stiffness: 200,
    damping: 20,
  });

  const glareX = useTransform(mouseX, [0, 1], [0, 100]);
  const glareY = useTransform(mouseY, [0, 1], [0, 100]);
  const glareOpacity = useMotionValue(0);
  const springGlareOpacity = useSpring(glareOpacity, { stiffness: 300, damping: 30 });

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      mouseX.set((e.clientX - rect.left) / rect.width);
      mouseY.set((e.clientY - rect.top) / rect.height);
    },
    [mouseX, mouseY],
  );

  const handleMouseEnter = useCallback(() => {
    glareOpacity.set(1);
  }, [glareOpacity]);

  const handleMouseLeave = useCallback(() => {
    mouseX.set(0.5);
    mouseY.set(0.5);
    glareOpacity.set(0);
  }, [mouseX, mouseY, glareOpacity]);

  return (
    <motion.div
      ref={ref}
      className={cn("relative", className)}
      style={{
        perspective: 1000,
        transformStyle: "preserve-3d",
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        className="relative w-full h-full rounded-2xl overflow-hidden bg-[var(--color-surface)] border border-[var(--color-border)]"
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        whileHover={{ scale }}
        transition={{ scale: { duration: 0.2 } }}
      >
        {children}

        {glare && (
          <motion.div
            className="pointer-events-none absolute inset-0 rounded-2xl"
            style={{
              background: useTransform(
                [glareX, glareY],
                ([gx, gy]) =>
                  `radial-gradient(circle at ${gx}% ${gy}%, rgba(255,255,255,0.15) 0%, transparent 60%)`,
              ),
              opacity: springGlareOpacity,
            }}
          />
        )}
      </motion.div>
    </motion.div>
  );
}
