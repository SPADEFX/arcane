import { useEffect, useMemo, useState, useCallback } from "react";
import { useComponentStore } from "@/stores/component-store";
import { bootstrapRegistry } from "@/lib/bootstrap";
import type { ComponentDefinition } from "@/types/component-registry";
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
  source: "extracted" | "builtin";
  thumbnailUrl?: string;
  manifest?: ExtractedManifest;
  builtin?: ComponentDefinition;
  capturedAt?: string;
  sourceUrl?: string;
  /** Hostname extracted from sourceUrl, e.g. "stripe.com" */
  sourceDomain?: string;
}

function extractDomain(url?: string): string | undefined {
  if (!url) return undefined;
  try {
    const host = new URL(url).hostname.replace(/^www\./, "");
    return host || undefined;
  } catch {
    return undefined;
  }
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
    sourceDomain: extractDomain(manifest.sourceUrl),
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
type SortMode = "name" | "newest" | "domain" | "favorites";

const CATEGORIES: { value: string; label: string }[] = [
  { value: "all", label: "All" },
  { value: "favorites", label: "★ Favorites" },
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
const FAVORITES_LS_KEY = "library:favorites";

/* ─── Favorites hook ──────────────────────────────────────────────────── */

function useFavorites() {
  const [favorites, setFavorites] = useState<Set<string>>(() => {
    try {
      const raw = localStorage.getItem(FAVORITES_LS_KEY);
      return new Set(raw ? JSON.parse(raw) : []);
    } catch {
      return new Set();
    }
  });

  const toggle = useCallback((id: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      localStorage.setItem(FAVORITES_LS_KEY, JSON.stringify([...next]));
      return next;
    });
  }, []);

  return { favorites, toggle };
}

/* ─── Component ────────────────────────────────────────────────────────── */

export function LibraryPage() {
  const { loading, components: builtinComponents, load } = useComponentStore();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("all");
  const [source, setSource] = useState<"all" | "extracted" | "builtin">("all");
  const [domain, setDomain] = useState<string>("all");
  const [density, setDensity] = useState<DensityMode>(
    () => (localStorage.getItem(DENSITY_LS_KEY) as DensityMode) || "comfortable",
  );
  const [sort, setSort] = useState<SortMode>(
    () => (localStorage.getItem(SORT_LS_KEY) as SortMode) || "name",
  );
  const [selected, setSelected] = useState<UnifiedComponent | null>(null);
  const { favorites, toggle: toggleFavorite } = useFavorites();

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

  // Esc closes the detail modal
  useEffect(() => {
    if (!selected) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelected(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selected]);

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
      .filter((c) => c.category !== "extracted")
      .map(toUnifiedFromBuiltin);

    return [...extracted, ...builtins];
  }, [builtinComponents]);

  /* Build the list of unique domains for the filter dropdown */
  const allDomains = useMemo(() => {
    const set = new Set<string>();
    for (const c of allComponents) {
      if (c.sourceDomain) set.add(c.sourceDomain);
    }
    return [...set].sort();
  }, [allComponents]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let out = allComponents.filter((c) => {
      if (source !== "all" && c.source !== source) return false;
      if (domain !== "all" && c.sourceDomain !== domain) return false;
      if (category === "favorites") {
        if (!favorites.has(c.id)) return false;
      } else if (category !== "all" && c.category !== category) {
        return false;
      }
      if (!q) return true;
      const haystack = [
        c.name, c.description, c.category,
        ...c.tags, c.sourceUrl || "", c.slug, c.sourceDomain || "",
      ].join(" ").toLowerCase();
      return haystack.includes(q);
    });

    if (sort === "favorites") {
      out.sort((a, b) => {
        const fa = favorites.has(a.id) ? 0 : 1;
        const fb = favorites.has(b.id) ? 0 : 1;
        return fa - fb || a.name.localeCompare(b.name);
      });
    } else if (sort === "name") {
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
  }, [allComponents, search, category, source, sort, favorites]);

  return (
    <div className="flex h-full flex-col bg-zinc-950">
      <div className="flex-1 overflow-y-auto overscroll-contain p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6 flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-zinc-100 mb-1">Component Library</h1>
              <p className="text-sm text-zinc-500">
                {filtered.length} of {allComponents.length}
                {favorites.size > 0 && ` · ${favorites.size} ★`}
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
            >
              <option value="all">Source: All</option>
              <option value="extracted">Extracted only</option>
              <option value="builtin">Built-in only</option>
            </select>
            {allDomains.length > 0 && (
              <select
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2.5 text-sm text-zinc-100 outline-none focus:border-zinc-600"
                title="Filter by source site"
              >
                <option value="all">Site: All</option>
                {allDomains.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            )}
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2.5 text-sm text-zinc-100 outline-none focus:border-zinc-600"
            >
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortMode)}
              className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2.5 text-sm text-zinc-100 outline-none focus:border-zinc-600"
            >
              <option value="name">Sort: Name</option>
              <option value="favorites">Sort: Favorites first</option>
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
            <ListView
              items={filtered}
              favorites={favorites}
              onToggleFavorite={toggleFavorite}
              onOpen={setSelected}
              onPickDomain={setDomain}
            />
          ) : (
            <GridView
              items={filtered}
              dense={density === "compact"}
              favorites={favorites}
              onToggleFavorite={toggleFavorite}
              onOpen={setSelected}
              onPickDomain={setDomain}
            />
          )}
        </div>
      </div>

      {/* Detail modal */}
      {selected && (
        <DetailModal
          comp={selected}
          isFavorite={favorites.has(selected.id)}
          onToggleFavorite={() => toggleFavorite(selected.id)}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}

/* ─── Density toggle ──────────────────────────────────────────────────── */

function DensityToggle({
  value, onChange,
}: { value: DensityMode; onChange: (v: DensityMode) => void }) {
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
            value === o.val ? "bg-zinc-800 text-zinc-100" : "text-zinc-500 hover:text-zinc-300"
          }`}
        >{o.icon}</button>
      ))}
    </div>
  );
}

/* ─── Grid / List ─────────────────────────────────────────────────────── */

interface ViewProps {
  items: UnifiedComponent[];
  favorites: Set<string>;
  onToggleFavorite: (id: string) => void;
  onOpen: (c: UnifiedComponent) => void;
  onPickDomain: (d: string) => void;
}

/* ─── Section order — semantic groups, not flat grid ──────────────────── */
const SECTION_ORDER: { key: string; label: string }[] = [
  // Extracted-from-the-wild come first
  { key: "hero", label: "Heroes" },
  { key: "nav", label: "Navigation (extracted)" },
  { key: "footer", label: "Footers (extracted)" },
  { key: "pricing", label: "Pricing" },
  { key: "cta", label: "CTAs" },
  { key: "faq", label: "FAQs" },
  { key: "feature", label: "Features" },
  { key: "testimonials", label: "Testimonials" },
  { key: "content", label: "Content sections" },
  // Then primitives
  { key: "navigation", label: "Navigation" },
  { key: "interactive", label: "Interactive" },
  { key: "card", label: "Cards" },
  { key: "background", label: "Backgrounds" },
  { key: "text-animation", label: "Text animations" },
  { key: "layout", label: "Layout" },
  { key: "section", label: "Sections" },
  { key: "form", label: "Form" },
  { key: "divider", label: "Dividers" },
  { key: "badge", label: "Badges" },
  // Catch-all
  { key: "other", label: "Other" },
];

function GridView({ items, dense, ...rest }: ViewProps & { dense: boolean }) {
  // Group by category
  const buckets = new Map<string, UnifiedComponent[]>();
  for (const c of items) {
    const k = c.category || "other";
    if (!buckets.has(k)) buckets.set(k, []);
    buckets.get(k)!.push(c);
  }
  // Order: known sections first (in SECTION_ORDER), unknown at the end
  const orderedKeys: string[] = [];
  for (const s of SECTION_ORDER) if (buckets.has(s.key)) orderedKeys.push(s.key);
  for (const k of buckets.keys()) if (!orderedKeys.includes(k)) orderedKeys.push(k);

  const labelFor = (k: string) =>
    SECTION_ORDER.find((s) => s.key === k)?.label || k;

  const gridClass = dense
    ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3"
    : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4";

  return (
    <div className="space-y-12">
      {orderedKeys.map((k) => {
        const blocks = buckets.get(k)!;
        return (
          <section key={k}>
            <header className="mb-4 flex items-baseline justify-between border-b border-white/[0.04] pb-2">
              <h2 className="text-[13px] font-semibold uppercase tracking-[0.18em] text-white/40">
                {labelFor(k)}
              </h2>
              <span className="text-[11px] text-white/25">{blocks.length}</span>
            </header>
            <div className={gridClass}>
              {blocks.map((c) => (
                <ComponentCard key={c.id} comp={c} dense={dense} {...rest} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}

function ListView({ items, favorites, onToggleFavorite, onOpen, onPickDomain }: ViewProps) {
  return (
    <div className="border border-zinc-800 rounded-lg overflow-hidden divide-y divide-zinc-800">
      {items.map((c) => (
        <div
          key={c.id}
          onClick={() => onOpen(c)}
          className="group flex items-center gap-4 px-4 py-3 bg-zinc-900 hover:bg-zinc-800/50 transition-colors cursor-pointer"
        >
          <div
            className="h-12 w-20 flex-shrink-0 overflow-hidden rounded"
            style={{
              background:
                "radial-gradient(circle, rgb(255 255 255 / 0.04) 0.6px, transparent 0.6px) #0a0a0a",
              backgroundSize: "12px 12px",
            }}
          >
            {c.thumbnailUrl && (
              <img src={c.thumbnailUrl} alt="" className="h-full w-full object-cover" loading="lazy" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-zinc-100 truncate">{c.name}</span>
              <CategoryBadge category={c.category} />
              {c.sourceDomain && (
                <button
                  onClick={(e) => { e.stopPropagation(); onPickDomain(c.sourceDomain!); }}
                  className="text-[10px] px-1.5 py-0.5 rounded-full bg-blue-500/10 text-blue-300/80 border border-blue-500/15 hover:bg-blue-500/20 hover:text-blue-200"
                  title={`Filter by ${c.sourceDomain}`}
                >
                  {c.sourceDomain}
                </button>
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
          <FavoriteButton
            active={favorites.has(c.id)}
            onClick={(e) => { e.stopPropagation(); onToggleFavorite(c.id); }}
          />
        </div>
      ))}
    </div>
  );
}

/* ─── Card ────────────────────────────────────────────────────────────── */

function ComponentCard({
  comp, dense, favorites, onToggleFavorite, onOpen, onPickDomain,
}: {
  comp: UnifiedComponent;
  dense: boolean;
  favorites: Set<string>;
  onToggleFavorite: (id: string) => void;
  onOpen: (c: UnifiedComponent) => void;
  onPickDomain: (d: string) => void;
}) {
  const isFavorite = favorites.has(comp.id);

  return (
    <div
      onClick={() => onOpen(comp)}
      className="group relative cursor-pointer overflow-hidden rounded-xl border border-white/[0.06] bg-zinc-900/40 transition-all hover:-translate-y-0.5 hover:border-white/[0.12] hover:bg-zinc-900/60"
    >
      {/* Hover overlay actions */}
      <div className="absolute top-2 right-2 z-10 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <FavoriteButton
          active={isFavorite}
          onClick={(e) => { e.stopPropagation(); onToggleFavorite(comp.id); }}
        />
      </div>

      {/* Persistent favorite indicator (when active) */}
      {isFavorite && (
        <div className="absolute top-2 left-2 z-10 group-hover:hidden">
          <div className="h-6 w-6 rounded-md bg-amber-500/15 border border-amber-500/30 flex items-center justify-center">
            <Star filled className="h-3 w-3 text-amber-400" />
          </div>
        </div>
      )}

      {/* Unified preview frame — same canvas regardless of source.
          Dot-grid background, fixed aspect, lazy-mounted iframe for live render. */}
      <CardPreview comp={comp} dense={dense} />

      {/* Info */}
      <div className={dense ? "px-3 py-2.5" : "px-4 py-3"}>
        <div className="flex items-center justify-between gap-2">
          <h3
            className={`${dense ? "text-[12px]" : "text-[13px]"} font-medium text-zinc-100 truncate`}
            title={comp.name}
          >
            {comp.name}
          </h3>
          {comp.sourceDomain ? (
            <button
              onClick={(e) => { e.stopPropagation(); onPickDomain(comp.sourceDomain!); }}
              className="text-[10px] px-1.5 py-0.5 rounded-full text-blue-300/70 hover:text-blue-200 whitespace-nowrap"
              title={`Filter by ${comp.sourceDomain}`}
            >
              {comp.sourceDomain}
            </button>
          ) : (
            <span className="text-[10px] text-zinc-600 whitespace-nowrap">{comp.category}</span>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Card preview ───────────────────────────────────────────────────── */

function CardPreview({ comp, dense }: { comp: UnifiedComponent; dense: boolean }) {
  const [visible, setVisible] = useState(false);
  const [ref, setRef] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!ref) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { rootMargin: "200px" },
    );
    io.observe(ref);
    return () => io.disconnect();
  }, [ref]);

  const aspectClass = dense ? "aspect-[4/3]" : "aspect-[16/10]";

  return (
    <div
      ref={setRef}
      className={`relative ${aspectClass} w-full overflow-hidden border-b border-white/[0.04]`}
      style={{
        background:
          "radial-gradient(circle, rgb(255 255 255 / 0.04) 0.8px, transparent 0.8px) #0a0a0a",
        backgroundSize: "20px 20px",
      }}
    >
      {!visible ? (
        <div className="absolute inset-0 flex items-center justify-center text-[10px] uppercase tracking-[0.2em] text-white/15">
          {comp.category}
        </div>
      ) : comp.thumbnailUrl ? (
        // Extracted with PNG — render image inside the same frame
        <img
          src={comp.thumbnailUrl}
          alt={comp.name}
          className="h-full w-full object-cover object-top"
          loading="lazy"
          decoding="async"
        />
      ) : (
        // Built-in primitive — live render in isolated iframe.
        // pointer-events: none so clicks bubble up to the card.
        <iframe
          src={`/component-preview/${comp.slug}`}
          title={comp.name}
          loading="lazy"
          sandbox="allow-scripts allow-same-origin"
          className="pointer-events-none h-full w-full border-0 bg-transparent"
          style={{ colorScheme: "dark" }}
        />
      )}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent to-zinc-950/30" />
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

/* ─── Favorite button ─────────────────────────────────────────────────── */

function FavoriteButton({
  active, onClick,
}: { active: boolean; onClick: (e: React.MouseEvent) => void }) {
  return (
    <button
      onClick={onClick}
      title={active ? "Remove favorite" : "Add favorite"}
      className={`h-7 w-7 rounded-md backdrop-blur border flex items-center justify-center transition-all ${
        active
          ? "bg-amber-500/20 border-amber-500/40 hover:bg-amber-500/30"
          : "bg-black/60 border-white/10 hover:bg-black/80 hover:border-white/20"
      }`}
    >
      <Star filled={active} className={`h-3.5 w-3.5 ${active ? "text-amber-400" : "text-white/70"}`} />
    </button>
  );
}

function Star({ filled, className }: { filled: boolean; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" className={className}>
      <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
    </svg>
  );
}

/* ─── Detail modal ────────────────────────────────────────────────────── */

function DetailModal({
  comp, isFavorite, onToggleFavorite, onClose,
}: {
  comp: UnifiedComponent;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onClose: () => void;
}) {
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    if (comp.source !== "extracted") return;
    if (!confirm(`Delete "${comp.name}"? This removes the .tsx, .html, .css, .png, .json and story file.`)) return;
    setDeleting(true);
    try {
      const res = await fetch(`http://localhost:3000/api/extracted/${comp.slug}`, { method: "DELETE" });
      const json = await res.json();
      if (!json.ok) throw new Error(json.error || "delete failed");
      // Vite HMR will pick up the file removals; reload to reflect immediately.
      onClose();
      setTimeout(() => location.reload(), 300);
    } catch (e) {
      alert(`Delete failed: ${(e as Error).message}`);
      setDeleting(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="relative flex max-h-[90vh] w-full max-w-5xl overflow-hidden rounded-2xl border border-white/10 bg-zinc-950 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 h-8 w-8 rounded-md bg-white/5 hover:bg-white/10 text-white/60 hover:text-white flex items-center justify-center"
          title="Close (Esc)"
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>

        {/* Left: live preview — iframe for primitives keeps the rest of
            the app's scroll/wheel behavior intact even for components that
            attach document-level listeners. */}
        <div
          className="flex-1 min-w-0 overflow-hidden border-r border-white/[0.06]"
          style={{
            background:
              "radial-gradient(circle, rgb(255 255 255 / 0.04) 0.8px, transparent 0.8px) #0a0a0a",
            backgroundSize: "24px 24px",
          }}
        >
          {comp.thumbnailUrl ? (
            <div className="h-full overflow-y-auto p-6">
              <img
                src={comp.thumbnailUrl}
                alt={comp.name}
                className="w-full rounded-lg border border-white/[0.06]"
              />
            </div>
          ) : (
            <iframe
              src={`/component-preview/${comp.slug}`}
              title={comp.name}
              sandbox="allow-scripts allow-same-origin"
              className="h-full w-full border-0 bg-transparent"
              style={{ colorScheme: "dark" }}
            />
          )}
        </div>

        {/* Right: metadata + actions */}
        <div className="w-[340px] flex-shrink-0 flex flex-col bg-zinc-900/40">
          <div className="flex-1 overflow-y-auto p-5 pr-12 space-y-4">
            {/* Title (close button sits in top-right of modal — give it room) */}
            <div>
              <h2 className="text-lg font-semibold text-white pr-4">{comp.name}</h2>
              <p className="text-xs text-white/40 mt-0.5">
                {comp.source === "extracted" ? "Extracted" : "Built-in"} · {comp.category}
              </p>
            </div>

            {/* Description */}
            {comp.description && (
              <p className="text-sm text-white/60 leading-relaxed">{comp.description}</p>
            )}

            {/* Tags */}
            {comp.tags.length > 0 && (
              <div>
                <Label>Tags</Label>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {comp.tags.map((t) => (
                    <span key={t} className="text-[11px] px-2 py-0.5 rounded-full bg-white/[0.06] text-white/60">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Source URL */}
            {comp.sourceUrl && (
              <MetaRow
                label="Source"
                value={
                  <a
                    href={comp.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:underline truncate inline-block max-w-full"
                  >
                    {(() => { try { return new URL(comp.sourceUrl).hostname; } catch { return comp.sourceUrl; } })()}
                  </a>
                }
              />
            )}

            {/* Captured at */}
            {comp.capturedAt && (
              <MetaRow
                label="Captured"
                value={new Date(comp.capturedAt).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })}
              />
            )}

          </div>

          {/* Actions */}
          <div className="border-t border-white/[0.06] p-4 space-y-2">
            <button
              onClick={onToggleFavorite}
              className={`w-full flex items-center justify-center gap-2 rounded-md px-3 py-2.5 text-[13px] font-medium transition ${
                isFavorite
                  ? "bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30"
                  : "bg-white/[0.06] hover:bg-white/[0.10] text-white/80 border border-white/[0.06]"
              }`}
            >
              <Star filled={isFavorite} className="h-4 w-4" />
              {isFavorite ? "Favorite" : "Add to favorites"}
            </button>

            {comp.sourceUrl && (
              <a
                href={comp.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 rounded-md bg-white/[0.04] hover:bg-white/[0.08] px-3 py-2.5 text-[13px] text-white/80 border border-white/[0.06]"
              >
                ↗ Open source page
              </a>
            )}

            {comp.source === "extracted" && (
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="w-full rounded-md bg-red-500/10 hover:bg-red-500/20 disabled:opacity-50 px-3 py-2.5 text-[13px] text-red-400 border border-red-500/20"
              >
                {deleting ? "Deleting…" : "🗑  Delete component"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <span className="text-[10px] uppercase tracking-[0.18em] text-white/30 font-medium">{children}</span>;
}

function MetaRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-baseline gap-3">
      <Label>{label}</Label>
      <span className="text-[12px] text-white/70 truncate flex-1 text-right min-w-0">{value}</span>
    </div>
  );
}
