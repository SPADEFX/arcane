import { useEffect, useMemo, useState } from "react";
import { useComponentStore } from "@/stores/component-store";
import { bootstrapRegistry } from "@/lib/bootstrap";
import { DynamicRenderer } from "@/components/DynamicRenderer";
import type { ComponentCategory, ComponentDefinition } from "@/types/component-registry";
import type { ExtractedManifest } from "@/types/extracted-manifest";

/* ─── Filesystem manifests (source of truth for extracted) ────────────── */

const fsManifests = import.meta.glob(
  "../../ui-library/components/extracted-*.json",
  { eager: true },
) as Record<string, { default: ExtractedManifest } | ExtractedManifest>;

const fsThumbnails = import.meta.glob(
  "../../ui-library/components/extracted-*.png",
  { eager: true, query: "?url", import: "default" },
) as Record<string, string>;

interface UnifiedComponent {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: string;
  tags: string[];
  /** Source identifier — drives preview type */
  source: "extracted" | "builtin";
  /** Filesystem PNG URL for extracted components */
  thumbnailUrl?: string;
  /** Original manifest, for extracted */
  manifest?: ExtractedManifest;
  /** Original builtin definition (for DynamicRenderer fallback) */
  builtin?: ComponentDefinition;
  /** Sort keys */
  capturedAt?: string;
  sourceUrl?: string;
}

function toUnifiedFromManifest(
  manifest: ExtractedManifest,
  thumbnailUrl?: string,
): UnifiedComponent {
  return {
    id: `ext_${manifest.slug}`,
    slug: manifest.slug,
    name: manifest.name,
    description: manifest.description || "",
    category: manifest.category || "other",
    tags: manifest.tags || [],
    source: "extracted",
    thumbnailUrl,
    manifest,
    capturedAt: manifest.capturedAt,
    sourceUrl: manifest.sourceUrl,
  };
}

function toUnifiedFromBuiltin(comp: ComponentDefinition): UnifiedComponent {
  return {
    id: comp.id,
    slug: comp.slug,
    name: comp.name,
    description: comp.description,
    category: comp.category,
    tags: comp.tags || [],
    source: "builtin",
    builtin: comp,
  };
}

function pathSlug(p: string) {
  const m = p.match(/extracted-([^/]+)\.(json|png)$/);
  return m ? m[1] : "";
}

/* ─── UI Constants ────────────────────────────────────────────────────── */

type DensityMode = "comfortable" | "compact" | "list";
type SortMode = "name" | "newest" | "domain";

const CATEGORIES: { value: string; label: string }[] = [
  { value: "all", label: "All" },
  // Extracted sub-categories (manifest-driven)
  { value: "hero", label: "Hero" },
  { value: "nav", label: "Nav" },
  { value: "footer", label: "Footer" },
  { value: "pricing", label: "Pricing" },
  { value: "cta", label: "CTA" },
  { value: "faq", label: "FAQ" },
  { value: "feature", label: "Feature" },
  { value: "testimonials", label: "Testimonials" },
  { value: "content", label: "Content" },
  { value: "other", label: "Other" },
  // Builtin categories
  { value: "navigation", label: "Navigation" },
  { value: "interactive", label: "Interactive" },
  { value: "text-animation", label: "Text Animation" },
  { value: "background", label: "Background" },
  { value: "card", label: "Card" },
  { value: "layout", label: "Layout" },
  { value: "section", label: "Section" },
];

const DENSITY_LS_KEY = "library:density";
const SORT_LS_KEY = "library:sort";

/* ─── Component ────────────────────────────────────────────────────────── */

export function LibraryPage() {
  const { loading, components: builtinComponents, load } = useComponentStore();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("all");
  const [source, setSource] = useState<"all" | "extracted" | "builtin">("all");
  const [density, setDensity] = useState<DensityMode>(
    () => (localStorage.getItem(DENSITY_LS_KEY) as DensityMode) || "comfortable",
  );
  const [sort, setSort] = useState<SortMode>(
    () => (localStorage.getItem(SORT_LS_KEY) as SortMode) || "name",
  );

  useEffect(() => {
    bootstrapRegistry().then(() => load());
    const handler = (e: MessageEvent) => {
      if (e.data?.type === "arcane-save-component") {
        setTimeout(() => load(), 500);
      }
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, []);

  useEffect(() => { localStorage.setItem(DENSITY_LS_KEY, density); }, [density]);
  useEffect(() => { localStorage.setItem(SORT_LS_KEY, sort); }, [sort]);

  /* Build unified list: filesystem manifests + builtin store entries */
  const allComponents = useMemo<UnifiedComponent[]>(() => {
    const thumbBySlug: Record<string, string> = {};
    for (const [p, url] of Object.entries(fsThumbnails)) thumbBySlug[pathSlug(p)] = url;

    const extracted: UnifiedComponent[] = [];
    for (const [p, mod] of Object.entries(fsManifests)) {
      const m = (mod as { default?: ExtractedManifest }).default ?? (mod as ExtractedManifest);
      if (m && typeof m === "object" && "slug" in m) {
        extracted.push(toUnifiedFromManifest(m, thumbBySlug[pathSlug(p)]));
      }
    }

    const builtins = builtinComponents
      .filter((c) => c.category !== "extracted") // filesystem extracts already cover this
      .map(toUnifiedFromBuiltin);

    return [...extracted, ...builtins];
  }, [builtinComponents]);

  /* Filter + sort */
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let out = allComponents.filter((c) => {
      if (source !== "all" && c.source !== source) return false;
      if (category !== "all" && c.category !== category) return false;
      if (!q) return true;
      const haystack = [
        c.name,
        c.description,
        c.category,
        ...c.tags,
        c.sourceUrl || "",
        c.slug,
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });

    if (sort === "name") {
      out.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sort === "newest") {
      out.sort((a, b) => (b.capturedAt || "").localeCompare(a.capturedAt || ""));
    } else if (sort === "domain") {
      const domain = (c: UnifiedComponent) => {
        try { return new URL(c.sourceUrl || "").hostname; } catch { return ""; }
      };
      out.sort((a, b) => domain(a).localeCompare(domain(b)) || a.name.localeCompare(b.name));
    }
    return out;
  }, [allComponents, search, category, source, sort]);

  return (
    <div className="flex h-full flex-col bg-zinc-950">
      <div className="flex-1 overflow-y-auto overscroll-contain p-8">
        <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-zinc-100 mb-1">Component Library</h1>
            <p className="text-sm text-zinc-500">
              {filtered.length} of {allComponents.length} components
              {search && ` · "${search}"`}
            </p>
          </div>
          <DensityToggle value={density} onChange={setDensity} />
        </div>

        {/* Filters bar */}
        <div className="flex flex-wrap gap-3 mb-6">
          <input
            type="text"
            placeholder="Search by name, tag, description, URL…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 min-w-[280px] bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 outline-none focus:border-zinc-600 transition-colors"
          />

          <select
            value={source}
            onChange={(e) => setSource(e.target.value as typeof source)}
            className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2.5 text-sm text-zinc-100 outline-none focus:border-zinc-600"
            aria-label="Source"
          >
            <option value="all">Source: All</option>
            <option value="extracted">Extracted only</option>
            <option value="builtin">Built-in only</option>
          </select>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2.5 text-sm text-zinc-100 outline-none focus:border-zinc-600"
            aria-label="Category"
          >
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortMode)}
            className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2.5 text-sm text-zinc-100 outline-none focus:border-zinc-600"
            aria-label="Sort"
          >
            <option value="name">Sort: Name</option>
            <option value="newest">Sort: Newest</option>
            <option value="domain">Sort: Domain</option>
          </select>
        </div>

        {/* Grid / List */}
        {loading ? (
          <div className="text-center py-20 text-zinc-500">Loading…</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-zinc-500">
            No components found
            {search && (
              <button
                onClick={() => setSearch("")}
                className="block mx-auto mt-3 text-xs text-zinc-400 underline"
              >
                Clear search
              </button>
            )}
          </div>
        ) : density === "list" ? (
          <ListView items={filtered} />
        ) : (
          <GridView items={filtered} dense={density === "compact"} />
        )}
        </div>
      </div>
    </div>
  );
}

/* ─── Density toggle ──────────────────────────────────────────────────── */

function DensityToggle({
  value,
  onChange,
}: {
  value: DensityMode;
  onChange: (v: DensityMode) => void;
}) {
  const opts: { val: DensityMode; label: string; icon: string }[] = [
    { val: "comfortable", label: "Comfortable", icon: "▢▢" },
    { val: "compact", label: "Compact", icon: "▦" },
    { val: "list", label: "List", icon: "≡" },
  ];
  return (
    <div className="flex rounded-lg bg-zinc-900 border border-zinc-800 p-0.5">
      {opts.map((o) => (
        <button
          key={o.val}
          onClick={() => onChange(o.val)}
          title={o.label}
          className={`px-2.5 py-1.5 text-[11px] rounded transition ${
            value === o.val
              ? "bg-zinc-800 text-zinc-100"
              : "text-zinc-500 hover:text-zinc-300"
          }`}
        >
          {o.icon}
        </button>
      ))}
    </div>
  );
}

/* ─── Grid view ───────────────────────────────────────────────────────── */

function GridView({ items, dense }: { items: UnifiedComponent[]; dense: boolean }) {
  return (
    <div
      className={
        dense
          ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2"
          : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"
      }
    >
      {items.map((c) => (
        <ComponentCard key={c.id} comp={c} dense={dense} />
      ))}
    </div>
  );
}

/* ─── List view ───────────────────────────────────────────────────────── */

function ListView({ items }: { items: UnifiedComponent[] }) {
  return (
    <div className="border border-zinc-800 rounded-lg overflow-hidden divide-y divide-zinc-800">
      {items.map((c) => (
        <div
          key={c.id}
          className="flex items-center gap-4 px-4 py-3 bg-zinc-900 hover:bg-zinc-800/50 transition-colors"
        >
          <div className="h-12 w-20 flex-shrink-0 overflow-hidden rounded bg-zinc-800">
            {c.thumbnailUrl && (
              <img src={c.thumbnailUrl} alt="" className="h-full w-full object-cover" loading="lazy" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-zinc-100 truncate">{c.name}</span>
              <CategoryBadge category={c.category} />
              {c.source === "extracted" && (
                <span className="text-[9px] uppercase tracking-wider text-zinc-600">extracted</span>
              )}
            </div>
            {c.description && (
              <p className="text-xs text-zinc-500 truncate">{c.description}</p>
            )}
          </div>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            {c.tags.slice(0, 3).map((t) => (
              <span key={t} className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-500">
                {t}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─── Card ────────────────────────────────────────────────────────────── */

function ComponentCard({ comp, dense }: { comp: UnifiedComponent; dense: boolean }) {
  const [expanded, setExpanded] = useState(false);

  const previewHeight = dense ? 110 : 160;

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden cursor-pointer hover:border-zinc-600 transition-all hover:-translate-y-0.5 group">
      {/* Preview area */}
      <div
        className="relative bg-zinc-950 border-b border-zinc-800 overflow-hidden"
        style={{
          height: expanded ? "auto" : `${previewHeight}px`,
          minHeight: expanded ? 200 : undefined,
        }}
        onClick={() => setExpanded((v) => !v)}
      >
        {/* Always show PNG when collapsed. Live render only on click-to-expand,
            so hover doesn't remount components (avoids scroll-event hijacking
            from useScroll / GSAP ScrollTrigger inside extracted components). */}
        {!expanded && comp.thumbnailUrl ? (
          <img
            src={comp.thumbnailUrl}
            alt={comp.name}
            className="h-full w-full object-cover object-top"
            loading="lazy"
            decoding="async"
          />
        ) : !expanded ? (
          // Builtin components without a thumbnail — small scaled preview
          <div className="scale-[0.5] origin-top-left" style={{ width: "200%", height: "200%" }}>
            {comp.source === "builtin" && comp.builtin && (
              <DynamicRenderer slug={comp.slug} componentProps={comp.builtin.defaultProps} />
            )}
          </div>
        ) : (
          // Expanded — full live render
          <div>
            {comp.source === "builtin" && comp.builtin ? (
              <DynamicRenderer slug={comp.slug} componentProps={comp.builtin.defaultProps} />
            ) : comp.thumbnailUrl ? (
              <img src={comp.thumbnailUrl} alt="" className="w-full h-auto object-contain" />
            ) : null}
          </div>
        )}
        {!expanded && (
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-zinc-900/80 pointer-events-none" />
        )}
      </div>

      {/* Info */}
      <div className={dense ? "p-2.5" : "p-4"}>
        <div className="flex items-center justify-between gap-2 mb-1">
          <h3
            className={`${dense ? "text-[12px]" : "text-sm"} font-semibold text-zinc-100 group-hover:text-white truncate`}
            title={comp.name}
          >
            {comp.name}
          </h3>
          <CategoryBadge category={comp.category} />
        </div>
        {!dense && comp.description && (
          <p className="text-xs text-zinc-500 leading-relaxed mb-2 line-clamp-2">
            {comp.description}
          </p>
        )}
        {!dense && (
          <div className="flex flex-wrap gap-1">
            {comp.tags.slice(0, 4).map((tag) => (
              <span
                key={tag}
                className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-800/50 text-zinc-500"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function CategoryBadge({ category }: { category: string }) {
  return (
    <span className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400 font-medium whitespace-nowrap">
      {category}
    </span>
  );
}
