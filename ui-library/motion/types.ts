import type { Transition } from "motion/react";

export interface MotionPreset {
  initial: Record<string, number | string>;
  animate: Record<string, number | string>;
  exit?: Record<string, number | string>;
  transition: Transition;
}

export interface MotionVariantSet {
  hidden: Record<string, number | string>;
  visible: Record<string, number | string>;
  transition?: Transition;
}
