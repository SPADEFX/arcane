import type { Transition } from "motion/react";
import type { MotionPreset } from "./types";

/**
 * Animation doctrine: transform/opacity only.
 * These presets are "safe" (no layout shift, compositor-friendly).
 */

const springTransition: Transition = {
  type: "spring",
  stiffness: 300,
  damping: 30,
};

const smoothTransition: Transition = {
  duration: 0.5,
  ease: [0.22, 1, 0.36, 1], // ease-spring
};

const fastTransition: Transition = {
  duration: 0.15,
  ease: [0.25, 0.1, 0.25, 1],
};

export const presets = {
  // ─── Micro-interactions ────────────────────────
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: smoothTransition,
  } satisfies MotionPreset,

  fadeUp: {
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 16 },
    transition: smoothTransition,
  } satisfies MotionPreset,

  fadeDown: {
    initial: { opacity: 0, y: -16 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -16 },
    transition: smoothTransition,
  } satisfies MotionPreset,

  fadeLeft: {
    initial: { opacity: 0, x: -24 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -24 },
    transition: smoothTransition,
  } satisfies MotionPreset,

  fadeRight: {
    initial: { opacity: 0, x: 24 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 24 },
    transition: smoothTransition,
  } satisfies MotionPreset,

  scaleIn: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
    transition: springTransition,
  } satisfies MotionPreset,

  // ─── Interactive states ────────────────────────
  press: {
    initial: { scale: 1 },
    animate: { scale: 0.97 },
    transition: fastTransition,
  } satisfies MotionPreset,

  hover: {
    initial: { scale: 1 },
    animate: { scale: 1.02 },
    transition: fastTransition,
  } satisfies MotionPreset,

  // ─── Page-level ────────────────────────────────
  pageEnter: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  } satisfies MotionPreset,
} as const;
