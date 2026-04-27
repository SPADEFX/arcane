import { create } from "zustand";
import type { ComponentDefinition, ComponentCategory } from "@/types/component-registry";
import * as db from "@/lib/db";

interface ComponentStore {
  components: ComponentDefinition[];
  loading: boolean;
  filter: { search: string; category: ComponentCategory | "all" };

  load: () => Promise<void>;
  add: (comp: ComponentDefinition) => Promise<void>;
  update: (comp: ComponentDefinition) => Promise<void>;
  remove: (id: string) => Promise<void>;
  setFilter: (filter: Partial<ComponentStore["filter"]>) => void;

  filtered: () => ComponentDefinition[];
}

export const useComponentStore = create<ComponentStore>((set, get) => ({
  components: [],
  loading: true,
  filter: { search: "", category: "all" },

  load: async () => {
    set({ loading: true });
    const components = await db.getAll<ComponentDefinition>("components");
    set({ components, loading: false });
  },

  add: async (comp) => {
    await db.put("components", comp);
    set((s) => ({ components: [...s.components, comp] }));
  },

  update: async (comp) => {
    await db.put("components", comp);
    set((s) => ({ components: s.components.map((c) => (c.id === comp.id ? comp : c)) }));
  },

  remove: async (id) => {
    await db.remove("components", id);
    set((s) => ({ components: s.components.filter((c) => c.id !== id) }));
  },

  setFilter: (f) => set((s) => ({ filter: { ...s.filter, ...f } })),

  filtered: () => {
    const { components, filter } = get();
    return components.filter((c) => {
      if (filter.category !== "all" && c.category !== filter.category) return false;
      if (filter.search) {
        const q = filter.search.toLowerCase();
        return c.name.toLowerCase().includes(q) || c.tags.some((t) => t.toLowerCase().includes(q));
      }
      return true;
    });
  },
}));
