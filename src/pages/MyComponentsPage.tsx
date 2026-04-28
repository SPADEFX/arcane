"use client";

import { useEffect, useState } from "react";
import * as db from "@/lib/db";
import type { ComponentDefinition } from "@/types/component-registry";

export function MyComponentsPage() {
  const [components, setComponents] = useState<ComponentDefinition[]>([]);
  const [selected, setSelected] = useState<ComponentDefinition | null>(null);
  const [tab, setTab] = useState<"tsx" | "css" | "preview">("preview");

  useEffect(() => {
    loadComponents();
    // Listen for new components added via postMessage from Extract Tool iframe
    const handler = (e: MessageEvent) => {
      if (e.data?.type === "arcane-component-added") loadComponents();
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, []);

  async function loadComponents() {
    const all = await db.getAll<ComponentDefinition>("components");
    setComponents(all.sort((a, b) => b.createdAt - a.createdAt));
  }

  async function handleDelete(id: string) {
    await db.remove("components", id);
    setComponents(c => c.filter(x => x.id !== id));
    if (selected?.id === id) setSelected(null);
  }

  return (
    <div className="flex h-full overflow-hidden bg-zinc-950 text-zinc-100">
      {/* Left: Component list */}
      <div className="w-[280px] border-r border-zinc-800 flex flex-col shrink-0">
        <div className="p-4 border-b border-zinc-800">
          <h2 className="text-sm font-bold">My Components</h2>
          <p className="text-[11px] text-zinc-500 mt-1">{components.length} extracted</p>
        </div>
        <div className="flex-1 overflow-y-auto p-2">
          {components.length === 0 ? (
            <div className="text-center text-zinc-600 text-xs py-8 px-4">
              No components yet.<br />Use Extract Tool → right-click → "📦 Extract to Library"
            </div>
          ) : (
            components.map(comp => (
              <div
                key={comp.id}
                onClick={() => setSelected(comp)}
                className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer mb-1 transition-colors ${
                  selected?.id === comp.id ? "bg-zinc-800" : "hover:bg-zinc-900"
                }`}
              >
                {comp.thumbnail ? (
                  <img src={comp.thumbnail} alt="" className="w-12 h-12 rounded object-cover shrink-0 border border-zinc-800" />
                ) : (
                  <div className="w-12 h-12 rounded bg-zinc-800 shrink-0 flex items-center justify-center text-zinc-600 text-lg">📦</div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold truncate">{comp.name}</div>
                  <div className="text-[10px] text-zinc-500 truncate">{comp.description}</div>
                  <div className="text-[10px] text-zinc-600 mt-1">
                    {new Date(comp.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); handleDelete(comp.id); }}
                  className="text-zinc-600 hover:text-red-400 text-xs opacity-0 group-hover:opacity-100 shrink-0"
                  title="Delete"
                >×</button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Right: Detail view */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {!selected ? (
          <div className="flex-1 flex items-center justify-center text-zinc-600 text-sm">
            Select a component to view
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="p-4 border-b border-zinc-800 flex items-center gap-3">
              <h3 className="text-sm font-bold flex-1">{selected.name}</h3>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400">{selected.category}</span>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-zinc-800">
              {(["preview", "tsx", "css"] as const).map(t => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`px-4 py-2 text-xs font-medium transition-colors ${
                    tab === t ? "text-zinc-100 border-b-2 border-blue-500" : "text-zinc-500 hover:text-zinc-300"
                  }`}
                >
                  {t === "preview" ? "Preview" : t.toUpperCase()}
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-auto">
              {tab === "preview" && (
                <div className="p-6">
                  {selected.thumbnail && (
                    <div className="mb-4 rounded-lg overflow-hidden border border-zinc-800">
                      <img src={selected.thumbnail} alt="" className="w-full" />
                    </div>
                  )}
                  <div className="text-xs text-zinc-500 space-y-1">
                    <p><strong className="text-zinc-400">Name:</strong> {selected.name}</p>
                    <p><strong className="text-zinc-400">Slug:</strong> {selected.slug}</p>
                    <p><strong className="text-zinc-400">Category:</strong> {selected.category}</p>
                    <p><strong className="text-zinc-400">Description:</strong> {selected.description}</p>
                    <p><strong className="text-zinc-400">Created:</strong> {new Date(selected.createdAt).toLocaleString()}</p>
                    {selected.props && selected.props.length > 0 && (
                      <div className="mt-3">
                        <strong className="text-zinc-400">Props:</strong>
                        <div className="mt-1 space-y-1">
                          {selected.props.map((p: any, i: number) => (
                            <div key={i} className="flex gap-2 text-[10px] bg-zinc-900 rounded px-2 py-1">
                              <span className="text-blue-400 font-mono">{p.name}</span>
                              <span className="text-zinc-600">{p.tsType || p.type}</span>
                              {p.defaultValue && <span className="text-zinc-700 truncate">= "{String(p.defaultValue).slice(0, 30)}"</span>}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
              {tab === "tsx" && (
                <pre className="p-4 text-[11px] font-mono text-zinc-300 whitespace-pre-wrap leading-relaxed">{selected.code || "No TSX code"}</pre>
              )}
              {tab === "css" && (
                <pre className="p-4 text-[11px] font-mono text-zinc-300 whitespace-pre-wrap leading-relaxed">{selected.css || "No CSS"}</pre>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
