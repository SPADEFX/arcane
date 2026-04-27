import { create } from "zustand";
import type { TimelineState } from "../types";

interface TimelineStore extends TimelineState {
  panelHeight: number;
  play: () => void;
  pause: () => void;
  toggle: () => void;
  setCurrentTime: (time: number) => void;
  setDuration: (duration: number) => void;
  reset: () => void;
  setLoop: (loop: boolean) => void;
  setAutoKey: (autoKey: boolean) => void;
  setPanelHeight: (h: number) => void;
  tick: (deltaSec: number) => void;
}

export const useTimelineStore = create<TimelineStore>((set, get) => ({
  isPlaying: false,
  currentTime: 0,
  duration: 8,
  loop: true,
  autoKey: false,
  loopCount: 0,
  panelHeight: 420,

  setPanelHeight: (h) => set({ panelHeight: Math.max(120, Math.min(h, window.innerHeight * 0.8)) }),

  play: () => set({ isPlaying: true }),
  pause: () => set({ isPlaying: false }),
  toggle: () => set((s) => ({ isPlaying: !s.isPlaying })),

  setCurrentTime: (time) => {
    const { duration } = get();
    const clamped = Math.max(0, Math.min(time, duration));
    set({ currentTime: clamped, loopCount: clamped <= 0.01 ? 0 : get().loopCount });
  },
  setDuration: (duration) => set({ duration: Math.max(1, duration) }),
  reset: () => set({ currentTime: 0, isPlaying: false, loopCount: 0 }),
  setLoop: (loop) => set({ loop }),
  setAutoKey: (autoKey) => set({ autoKey }),

  tick: (deltaSec) => {
    const { isPlaying, currentTime, duration, loop, loopCount } = get();
    if (!isPlaying) return;
    const newTime = currentTime + deltaSec;
    if (newTime > duration) {
      if (loop) {
        set({
          currentTime: newTime - duration,
          loopCount: loopCount + 1,
        });
      } else {
        set({ currentTime: duration, isPlaying: false });
      }
    } else {
      set({ currentTime: newTime });
    }
  },
}));
