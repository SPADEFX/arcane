import { create } from "zustand";
import type {
  AssetRef,
  Easing,
  InteractionBinding,
  KeyFrame,
  Layer,
  LayerKind,
  UniformValue,
} from "../types";
import { buildDefaultUniforms, EFFECTS_BY_KIND } from "../utils/effectCatalog";

interface HistoryEntry {
  layers: Layer[];
  selectedLayerId: string | null;
}

interface LayerStore {
  layers: Layer[];
  selectedLayerId: string | null;
  history: HistoryEntry[];
  historyIndex: number;

  addLayer: (kind: LayerKind, name?: string, asset?: AssetRef) => string;
  removeLayer: (id: string) => void;
  selectLayer: (id: string | null) => void;
  updateLayer: (id: string, updates: Partial<Layer>) => void;
  reorderLayers: (fromIndex: number, toIndex: number) => void;
  duplicateLayer: (id: string) => void;
  nestLayer: (childId: string, parentId: string | null) => void;
  setClip: (id: string, clipIn: number | undefined, clipOut: number | undefined) => void;

  getSelectedLayer: () => Layer | undefined;
  setUniform: (id: string, key: string, value: UniformValue) => void;
  setAsset: (id: string, asset: AssetRef) => void;

  addKeyframe: (id: string, property: string, time: number, value: number, easing?: Easing) => void;
  removeKeyframe: (id: string, property: string, time: number) => void;
  moveKeyframe: (id: string, property: string, fromTime: number, toTime: number) => void;
  setKeyframeEasing: (id: string, property: string, time: number, easing: Easing) => void;
  clearTrack: (id: string, property: string) => void;

  addInteraction: (id: string, binding: InteractionBinding) => void;
  removeInteraction: (id: string, property: string, source: string) => void;

  undo: () => void;
  redo: () => void;
  pushHistory: () => void;

  loadProject: (layers: Layer[]) => void;
}

const generateId = () => Math.random().toString(36).slice(2, 11);

function buildDefaultAsset(kind: LayerKind): AssetRef | undefined {
  if (kind === "text") {
    return {
      text: "basement",
      fontSize: 240,
      fontFamily: "Inter",
      fontWeight: 700,
      textColor: [1, 0.17, 0.17],
    };
  }
  if (kind === "customShader") {
    return {
      fragmentSource:
        "vec3 col = vec3(vUv, 0.5 + 0.5*sin(uTime));\ngl_FragColor = vec4(col, 1.0);",
    };
  }
  return undefined;
}

function createLayer(kind: LayerKind, name?: string, asset?: AssetRef): Layer {
  const def = EFFECTS_BY_KIND[kind];
  return {
    id: generateId(),
    kind,
    name: name ?? def?.label ?? kind,
    visible: true,
    opacity: 1,
    blendMode: kind === "text" ? "additive" : "normal",
    compositeMode: "filter",
    mask: {
      source: "luminance",
      mode: "multiply",
      invert: false,
      threshold: 0.5,
    },
    parentId: null,
    loopMode: "loop",
    uniforms: buildDefaultUniforms(kind),
    asset: asset ?? buildDefaultAsset(kind),
    tracks: [],
    interactions: [],
  };
}

const HISTORY_LIMIT = 50;

const textLayer = createLayer("text", "basement");
const crtLayer = createLayer("crt", "CRT");

export const useLayerStore = create<LayerStore>((set, get) => ({
  layers: [textLayer, crtLayer],
  selectedLayerId: textLayer.id,
  history: [],
  historyIndex: -1,

  pushHistory: () => {
    const { layers, selectedLayerId, history, historyIndex } = get();
    const snapshot: HistoryEntry = {
      layers: JSON.parse(JSON.stringify(layers)),
      selectedLayerId,
    };
    const trimmed = history.slice(0, historyIndex + 1);
    trimmed.push(snapshot);
    const next = trimmed.slice(Math.max(0, trimmed.length - HISTORY_LIMIT));
    set({ history: next, historyIndex: next.length - 1 });
  },

  addLayer: (kind, name, asset) => {
    get().pushHistory();
    const layer = createLayer(kind, name, asset);
    set((state) => ({
      layers: [...state.layers, layer],
      selectedLayerId: layer.id,
    }));
    return layer.id;
  },

  removeLayer: (id) => {
    get().pushHistory();
    set((state) => ({
      // Remove the layer; promote its direct children to root (parentId = null)
      layers: state.layers
        .filter((l) => l.id !== id)
        .map((l) => (l.parentId === id ? { ...l, parentId: null } : l)),
      selectedLayerId:
        state.selectedLayerId === id ? null : state.selectedLayerId,
    }));
  },

  setClip: (id, clipIn, clipOut) => {
    set((state) => ({
      layers: state.layers.map((l) =>
        l.id === id ? { ...l, clipIn, clipOut } : l,
      ),
    }));
  },

  nestLayer: (childId, parentId) => {
    get().pushHistory();
    set((state) => {
      // Prevent cycles: can't nest a layer under its own descendant
      if (parentId) {
        let walker: string | null | undefined = parentId;
        const guard = new Set<string>();
        while (walker) {
          if (walker === childId) return state;
          if (guard.has(walker)) break;
          guard.add(walker);
          walker = state.layers.find((l) => l.id === walker)?.parentId ?? null;
        }
      }
      return {
        layers: state.layers.map((l) =>
          l.id === childId ? { ...l, parentId: parentId ?? null } : l,
        ),
      };
    });
  },

  selectLayer: (id) => set({ selectedLayerId: id }),

  updateLayer: (id, updates) => {
    set((state) => ({
      layers: state.layers.map((l) => (l.id === id ? { ...l, ...updates } : l)),
    }));
  },

  reorderLayers: (fromIndex, toIndex) => {
    get().pushHistory();
    set((state) => {
      const next = [...state.layers];
      const [removed] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, removed);
      return { layers: next };
    });
  },

  duplicateLayer: (id) => {
    get().pushHistory();
    set((state) => {
      const layer = state.layers.find((l) => l.id === id);
      if (!layer) return state;
      const copy: Layer = {
        ...layer,
        id: generateId(),
        name: `${layer.name} copy`,
        uniforms: { ...layer.uniforms },
        tracks: layer.tracks.map((t) => ({ ...t, keyframes: [...t.keyframes] })),
        interactions: [...layer.interactions],
        asset: layer.asset ? { ...layer.asset } : undefined,
      };
      const idx = state.layers.findIndex((l) => l.id === id);
      const next = [
        ...state.layers.slice(0, idx + 1),
        copy,
        ...state.layers.slice(idx + 1),
      ];
      return { layers: next };
    });
  },

  getSelectedLayer: () => {
    const s = get();
    return s.layers.find((l) => l.id === s.selectedLayerId);
  },

  setUniform: (id, key, value) => {
    set((state) => ({
      layers: state.layers.map((l) =>
        l.id === id ? { ...l, uniforms: { ...l.uniforms, [key]: value } } : l,
      ),
    }));
  },

  setAsset: (id, asset) => {
    set((state) => ({
      layers: state.layers.map((l) =>
        l.id === id ? { ...l, asset: { ...(l.asset ?? {}), ...asset } } : l,
      ),
    }));
  },

  addKeyframe: (id, property, time, value, easing) => {
    get().pushHistory();
    set((state) => ({
      layers: state.layers.map((l) => {
        if (l.id !== id) return l;
        const existing = l.tracks.find((t) => t.property === property);
        const kf: KeyFrame = { time, value, easing };
        if (existing) {
          const filtered = existing.keyframes.filter(
            (k) => Math.abs(k.time - time) > 0.005,
          );
          const keyframes = [...filtered, kf].sort((a, b) => a.time - b.time);
          return {
            ...l,
            tracks: l.tracks.map((t) =>
              t.property === property ? { ...t, keyframes } : t,
            ),
          };
        }
        return {
          ...l,
          tracks: [...l.tracks, { property, keyframes: [kf] }],
        };
      }),
    }));
  },

  removeKeyframe: (id, property, time) => {
    get().pushHistory();
    set((state) => ({
      layers: state.layers.map((l) => {
        if (l.id !== id) return l;
        return {
          ...l,
          tracks: l.tracks
            .map((t) =>
              t.property === property
                ? {
                    ...t,
                    keyframes: t.keyframes.filter(
                      (k) => Math.abs(k.time - time) > 0.005,
                    ),
                  }
                : t,
            )
            .filter((t) => t.keyframes.length > 0),
        };
      }),
    }));
  },

  moveKeyframe: (id, property, fromTime, toTime) => {
    set((state) => ({
      layers: state.layers.map((l) => {
        if (l.id !== id) return l;
        return {
          ...l,
          tracks: l.tracks.map((t) => {
            if (t.property !== property) return t;
            return {
              ...t,
              keyframes: t.keyframes
                .map((k) =>
                  Math.abs(k.time - fromTime) < 0.005
                    ? { ...k, time: Math.max(0, toTime) }
                    : k,
                )
                .sort((a, b) => a.time - b.time),
            };
          }),
        };
      }),
    }));
  },

  setKeyframeEasing: (id, property, time, easing) => {
    set((state) => ({
      layers: state.layers.map((l) => {
        if (l.id !== id) return l;
        return {
          ...l,
          tracks: l.tracks.map((t) =>
            t.property === property
              ? {
                  ...t,
                  keyframes: t.keyframes.map((k) =>
                    Math.abs(k.time - time) < 0.005 ? { ...k, easing } : k,
                  ),
                }
              : t,
          ),
        };
      }),
    }));
  },

  clearTrack: (id, property) => {
    get().pushHistory();
    set((state) => ({
      layers: state.layers.map((l) =>
        l.id === id
          ? { ...l, tracks: l.tracks.filter((t) => t.property !== property) }
          : l,
      ),
    }));
  },

  addInteraction: (id, binding) => {
    get().pushHistory();
    set((state) => ({
      layers: state.layers.map((l) => {
        if (l.id !== id) return l;
        const filtered = l.interactions.filter(
          (i) => !(i.property === binding.property && i.source === binding.source),
        );
        return { ...l, interactions: [...filtered, binding] };
      }),
    }));
  },

  removeInteraction: (id, property, source) => {
    get().pushHistory();
    set((state) => ({
      layers: state.layers.map((l) =>
        l.id === id
          ? {
              ...l,
              interactions: l.interactions.filter(
                (i) => !(i.property === property && i.source === source),
              ),
            }
          : l,
      ),
    }));
  },

  undo: () => {
    const { history, historyIndex } = get();
    if (historyIndex < 0) return;
    const entry = history[historyIndex];
    set({
      layers: JSON.parse(JSON.stringify(entry.layers)),
      selectedLayerId: entry.selectedLayerId,
      historyIndex: historyIndex - 1,
    });
  },

  redo: () => {
    const { history, historyIndex } = get();
    if (historyIndex >= history.length - 1) return;
    const entry = history[historyIndex + 1];
    set({
      layers: JSON.parse(JSON.stringify(entry.layers)),
      selectedLayerId: entry.selectedLayerId,
      historyIndex: historyIndex + 1,
    });
  },

  loadProject: (layers) => {
    // Backfill missing fields for legacy project files
    const upgraded = layers.map((l) => ({
      ...l,
      compositeMode: l.compositeMode ?? "filter",
      mask: l.mask ?? {
        source: "luminance" as const,
        mode: "multiply" as const,
        invert: false,
        threshold: 0.5,
      },
      parentId: l.parentId ?? null,
    }));
    set({ layers: upgraded, selectedLayerId: upgraded[0]?.id ?? null });
  },
}));
