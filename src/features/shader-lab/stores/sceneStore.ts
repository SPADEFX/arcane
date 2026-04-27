import { create } from "zustand";

export type CompositionAspect =
  | "screen"
  | "16:9"
  | "9:16"
  | "4:3"
  | "3:4"
  | "1:1"
  | "custom";

export interface SceneState {
  backgroundColor: [number, number, number];
  brightness: number;
  contrast: number;
  invert: number;
  aspect: CompositionAspect;
  renderScale: number; // 0.5 / 0.75 / 1
  dpi: number; // 1 / 1.5 / 2
  fps: number;
}

interface SceneStore extends SceneState {
  set: (patch: Partial<SceneState>) => void;
  reset: () => void;
}

const defaults: SceneState = {
  backgroundColor: [0, 0, 0],
  brightness: 1,
  contrast: 1,
  invert: 0,
  aspect: "screen",
  renderScale: 1,
  dpi: 1.5,
  fps: 60,
};

export const useSceneStore = create<SceneStore>((set) => ({
  ...defaults,
  set: (patch) => set(patch),
  reset: () => set({ ...defaults }),
}));
