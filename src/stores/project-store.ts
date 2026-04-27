import { create } from "zustand";
import type { Project, Block } from "@/types/project";
import * as db from "@/lib/db";
import { nanoid } from "nanoid";

interface ProjectStore {
  projects: Project[];
  active: Project | null;
  selectedBlockId: string | null;

  loadAll: () => Promise<void>;
  create: (name: string) => Promise<Project>;
  save: () => Promise<void>;
  open: (id: string) => Promise<void>;
  delete: (id: string) => Promise<void>;

  addBlock: (componentId: string, props?: Record<string, unknown>) => void;
  removeBlock: (blockId: string) => void;
  moveBlock: (fromIndex: number, toIndex: number) => void;
  updateBlockProps: (blockId: string, props: Record<string, unknown>) => void;
  selectBlock: (blockId: string | null) => void;
}

export const useProjectStore = create<ProjectStore>((set, get) => ({
  projects: [],
  active: null,
  selectedBlockId: null,

  loadAll: async () => {
    const projects = await db.getAll<Project>("projects");
    set({ projects });
  },

  create: async (name) => {
    const project: Project = {
      id: nanoid(),
      name,
      description: "",
      theme: { font: "Inter", brandColor: "#7c9cff", dark: true, radius: "0.75rem", customCSS: "" },
      blocks: [],
      meta: { title: name, description: "" },
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    await db.put("projects", project);
    set((s) => ({ projects: [...s.projects, project], active: project }));
    return project;
  },

  save: async () => {
    const { active } = get();
    if (!active) return;
    const updated = { ...active, updatedAt: Date.now() };
    await db.put("projects", updated);
    set((s) => ({
      active: updated,
      projects: s.projects.map((p) => (p.id === updated.id ? updated : p)),
    }));
  },

  open: async (id) => {
    const project = await db.get<Project>("projects", id);
    if (project) set({ active: project, selectedBlockId: null });
  },

  delete: async (id) => {
    await db.remove("projects", id);
    set((s) => ({
      projects: s.projects.filter((p) => p.id !== id),
      active: s.active?.id === id ? null : s.active,
    }));
  },

  addBlock: (componentId, props = {}) => {
    const block: Block = { id: nanoid(), componentId, props, locked: false, hidden: false };
    set((s) => {
      if (!s.active) return s;
      return { active: { ...s.active, blocks: [...s.active.blocks, block] } };
    });
  },

  removeBlock: (blockId) => {
    set((s) => {
      if (!s.active) return s;
      return { active: { ...s.active, blocks: s.active.blocks.filter((b) => b.id !== blockId) } };
    });
  },

  moveBlock: (from, to) => {
    set((s) => {
      if (!s.active) return s;
      const blocks = [...s.active.blocks];
      const [moved] = blocks.splice(from, 1);
      blocks.splice(to, 0, moved);
      return { active: { ...s.active, blocks } };
    });
  },

  updateBlockProps: (blockId, props) => {
    set((s) => {
      if (!s.active) return s;
      return {
        active: {
          ...s.active,
          blocks: s.active.blocks.map((b) => (b.id === blockId ? { ...b, props: { ...b.props, ...props } } : b)),
        },
      };
    });
  },

  selectBlock: (blockId) => set({ selectedBlockId: blockId }),
}));
