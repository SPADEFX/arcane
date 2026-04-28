import { useEffect, useState } from "react";
import { useComponentStore } from "@/stores/component-store";
import { bootstrapRegistry } from "@/lib/bootstrap";
import { DynamicRenderer } from "@/components/DynamicRenderer";
import type { ComponentCategory, ComponentDefinition } from "@/types/component-registry";

const CATEGORIES: { value: ComponentCategory | "all"; label: string }[] = [
  { value: "all", label: "Tous" },
  { value: "hero", label: "Hero" },
  { value: "navigation", label: "Navigation" },
  { value: "interactive", label: "Interactive" },
  { value: "text-animation", label: "Text Animation" },
  { value: "background", label: "Background" },
  { value: "card", label: "Card" },
  { value: "layout", label: "Layout" },
  { value: "section", label: "Section" },
  { value: "cta", label: "CTA" },
  { value: "faq", label: "FAQ" },
  { value: "pricing", label: "Pricing" },
  { value: "footer", label: "Footer" },
  { value: "form", label: "Form" },
  { value: "divider", label: "Divider" },
  { value: "badge", label: "Badge" },
];

export function LibraryPage() {
  const { loading, filter, setFilter, filtered, load } = useComponentStore();

  useEffect(() => {
    bootstrapRegistry().then(() => load());
  }, []);

  const components = filtered();

  return (
    <div className="h-screen overflow-y-auto bg-zinc-950 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-zinc-100 mb-1">Component Library</h1>
          <p className="text-sm text-zinc-500">{components.length} composants disponibles</p>
        </div>

        <div className="flex gap-3 mb-6">
          <input
            type="text"
            placeholder="Rechercher..."
            value={filter.search}
            onChange={(e) => setFilter({ search: e.target.value })}
            className="flex-1 bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 outline-none focus:border-zinc-600 transition-colors"
          />
          <select
            value={filter.category}
            onChange={(e) => setFilter({ category: e.target.value as ComponentCategory | "all" })}
            className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2.5 text-sm text-zinc-100 outline-none focus:border-zinc-600"
          >
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="text-center py-20 text-zinc-500">Chargement...</div>
        ) : components.length === 0 ? (
          <div className="text-center py-20 text-zinc-500">Aucun composant trouvé</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {components.map((comp) => (
              <ComponentCard key={comp.id} comp={comp} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ComponentCard({ comp }: { comp: ComponentDefinition }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden cursor-pointer hover:border-zinc-600 transition-all hover:-translate-y-0.5 group">
      {/* Preview area */}
      <div
        className="relative bg-zinc-950 border-b border-zinc-800 overflow-hidden"
        style={{ height: expanded ? "auto" : "160px", minHeight: expanded ? "200px" : undefined }}
        onClick={() => setExpanded(!expanded)}
      >
        <div className={`${expanded ? "" : "scale-[0.5] origin-top-left"}`} style={expanded ? {} : { width: "200%", height: "200%" }}>
          <DynamicRenderer slug={comp.slug} componentProps={comp.defaultProps} />
        </div>
        {!expanded && (
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-zinc-900/80 pointer-events-none" />
        )}
      </div>
      {/* Info */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-sm font-semibold text-zinc-100 group-hover:text-white">{comp.name}</h3>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400 font-medium">{comp.category}</span>
        </div>
        <p className="text-xs text-zinc-500 leading-relaxed mb-2">{comp.description}</p>
        <div className="flex flex-wrap gap-1">
          {comp.tags.slice(0, 4).map((tag) => (
            <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-800/50 text-zinc-500">{tag}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
