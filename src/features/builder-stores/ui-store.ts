import { create } from "zustand";

export type Breakpoint = "desktop" | "tablet" | "phone";

export const breakpointWidths: Record<Breakpoint, number> = {
  desktop: 1440,
  tablet: 768,
  phone: 375,
};

interface BuilderUIStore {
  activePageId: string | null;
  selectedBlockId: string | null;
  sidebarTab: "blocks" | "pages";
  isDragging: boolean;
  breakpoint: Breakpoint;

  setActivePageId: (id: string | null) => void;
  setSelectedBlockId: (id: string | null) => void;
  setSidebarTab: (tab: "blocks" | "pages") => void;
  setIsDragging: (v: boolean) => void;
  setBreakpoint: (bp: Breakpoint) => void;
}

export const useBuilderUIStore = create<BuilderUIStore>()((set) => ({
  activePageId: null,
  selectedBlockId: null,
  sidebarTab: "blocks",
  isDragging: false,
  breakpoint: "desktop",

  setActivePageId: (id) => set({ activePageId: id, selectedBlockId: null }),
  setSelectedBlockId: (id) => set({ selectedBlockId: id }),
  setSidebarTab: (tab) => set({ sidebarTab: tab }),
  setIsDragging: (v) => set({ isDragging: v }),
  setBreakpoint: (bp) => set({ breakpoint: bp }),
}));
