import { useState, useRef, useMemo } from "react";
import { createPortal } from "react-dom";
import { useDraggable } from "@dnd-kit/core";
import { Plus, FileText, LayoutGrid, Trash2, Search } from "lucide-react";
import { SiteTheme } from "@uilibrary/ui";
import { useSiteStore } from "../builder-stores/site-store";
import { useBuilderUIStore } from "../builder-stores/ui-store";
import { blockDefinitions, blockMap } from "../builder-registry/blocks";
import type { BlockCategory } from "../builder-registry/types";
import type { ExtractedManifest } from "@/types/extracted-manifest";

/* ── Manifest data + thumbnails (filesystem source of truth) ────────── */
const fsManifests = import.meta.glob(
  "../../../ui-library/components/extracted-*.json",
  { eager: true },
) as Record<string, { default: ExtractedManifest } | ExtractedManifest>;

const fsThumbnails = import.meta.glob(
  "../../../ui-library/components/extracted-*.png",
  { eager: true, query: "?url", import: "default" },
) as Record<string, string>;

function pathSlug(p: string) {
  const m = p.match(/extracted-([^/]+)\.(json|png)$/);
  return m ? m[1] : "";
}

const manifestBySlug: Record<string, ExtractedManifest> = {};
for (const [p, mod] of Object.entries(fsManifests)) {
  const m = (mod as { default?: ExtractedManifest }).default ?? (mod as ExtractedManifest);
  if (m && typeof m === "object" && "slug" in m) manifestBySlug[pathSlug(p)] = m;
}
const thumbnailBySlug: Record<string, string> = {};
for (const [p, url] of Object.entries(fsThumbnails)) thumbnailBySlug[pathSlug(p)] = url;

function getExtractSlug(blockType: string) {
  return blockType.startsWith("extracted_") ? blockType.replace(/^extracted_/, "") : null;
}

const categoryOrder: { key: BlockCategory; label: string }[] = [
  { key: "header", label: "Headers" },
  { key: "hero", label: "Heroes" },
  { key: "section", label: "Sections" },
  { key: "footer", label: "Footers" },
];

// Manifest categories used to sub-group extracted blocks
const extractedSubCategories: { key: string; label: string }[] = [
  { key: "hero", label: "Hero" },
  { key: "nav", label: "Nav" },
  { key: "footer", label: "Footer" },
  { key: "pricing", label: "Pricing" },
  { key: "cta", label: "CTA" },
  { key: "faq", label: "FAQ" },
  { key: "feature", label: "Feature" },
  { key: "testimonials", label: "Testimonials" },
  { key: "content", label: "Content" },
  { key: "other", label: "Other" },
];

interface SidebarProps {
  siteId: string;
}

export function Sidebar({ siteId }: SidebarProps) {
  const { sidebarTab, setSidebarTab, activePageId, setActivePageId } = useBuilderUIStore();
  const site = useSiteStore((s) => s.sites.find((x) => x.id === siteId));
  const { addPage, removePage } = useSiteStore();

  if (!site) return null;

  return (
    <aside className="flex h-full w-[260px] flex-shrink-0 flex-col border-r border-white/[0.06] bg-[#18181b]">
      {/* Segmented tab control */}
      <div className="p-3 pb-0">
        <div className="flex rounded-lg bg-white/[0.04] p-0.5">
          <button
            onClick={() => setSidebarTab("blocks")}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-md py-1.5 text-[12px] font-medium transition-all ${
              sidebarTab === "blocks"
                ? "bg-white/[0.08] text-white shadow-sm"
                : "text-white/30 hover:text-white/50"
            }`}
          >
            <LayoutGrid className="h-3.5 w-3.5" />
            Blocks
          </button>
          <button
            onClick={() => setSidebarTab("pages")}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-md py-1.5 text-[12px] font-medium transition-all ${
              sidebarTab === "pages"
                ? "bg-white/[0.08] text-white shadow-sm"
                : "text-white/30 hover:text-white/50"
            }`}
          >
            <FileText className="h-3.5 w-3.5" />
            Pages
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3">
        {sidebarTab === "blocks" ? (
          <BlockCatalog />
        ) : (
          <PageList
            siteId={siteId}
            pages={site.pages}
            activePageId={activePageId}
            onSelect={setActivePageId}
            onAdd={() => {
              const name = prompt("Page name:");
              if (name) {
                const id = addPage(siteId, name);
                setActivePageId(id);
              }
            }}
            onDelete={(pageId) => {
              if (site.pages.length <= 1) return;
              if (confirm("Delete this page?")) {
                removePage(siteId, pageId);
                if (activePageId === pageId) {
                  setActivePageId(site.pages.find((p) => p.id !== pageId)?.id ?? null);
                }
              }
            }}
          />
        )}
      </div>
    </aside>
  );
}

/* ─── Block Catalog ──────────────────────────────── */

function BlockCatalog() {
  const [query, setQuery] = useState("");

  const groups = useMemo(() => {
    const q = query.trim().toLowerCase();

    // Match a block against the search query — name/slug/manifest tags/sourceUrl
    const matches = (b: typeof blockDefinitions[number]) => {
      if (!q) return true;
      const slug = getExtractSlug(b.type);
      const m = slug ? manifestBySlug[slug] : null;
      const haystack = [
        b.label,
        b.type,
        m?.name || "",
        m?.description || "",
        m?.sourceUrl || "",
        ...(m?.tags || []),
        m?.category || "",
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    };

    // Built-in groups (header/hero/section/footer)
    const builtinGroups = categoryOrder.map((cat) => ({
      key: cat.key as string,
      label: cat.label,
      blocks: blockDefinitions.filter((b) => b.category === cat.key && matches(b)),
    }));

    // Extracted: split by manifest category
    const extractedBlocks = blockDefinitions.filter((b) => b.category === "extracted" && matches(b));
    const extractedSubGroups = extractedSubCategories
      .map((cat) => ({
        key: `extracted_${cat.key}`,
        label: `Extracted · ${cat.label}`,
        blocks: extractedBlocks.filter((b) => {
          const slug = getExtractSlug(b.type);
          const m = slug ? manifestBySlug[slug] : null;
          return (m?.category || "other") === cat.key;
        }),
      }))
      .filter((g) => g.blocks.length > 0);

    // Extracts that don't have manifests yet (legacy)
    const orphaned = extractedBlocks.filter((b) => {
      const slug = getExtractSlug(b.type);
      return !slug || !manifestBySlug[slug];
    });
    if (orphaned.length > 0) {
      extractedSubGroups.push({
        key: "extracted_legacy",
        label: "Extracted · Legacy",
        blocks: orphaned,
      });
    }

    return [...builtinGroups, ...extractedSubGroups].filter((g) => g.blocks.length > 0);
  }, [query]);

  const totalCount = groups.reduce((sum, g) => sum + g.blocks.length, 0);

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-white/25" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search blocks…"
          className="w-full rounded-lg bg-white/[0.04] pl-8 pr-3 py-1.5 text-[12px] text-white/80 placeholder:text-white/25 outline-none ring-0 focus:bg-white/[0.06]"
        />
      </div>

      {query && (
        <div className="text-[10px] uppercase tracking-wider text-white/25">
          {totalCount} match{totalCount === 1 ? "" : "es"}
        </div>
      )}

      {groups.map((group) => (
        <div key={group.key}>
          <h3 className="mb-2 text-[11px] font-medium uppercase tracking-wider text-white/25">
            {group.label}{" "}
            <span className="text-white/15">{group.blocks.length}</span>
          </h3>
          <div className="space-y-1">
            {group.blocks.map((block, i) => (
              <DraggableBlockItem key={block.type} type={block.type} label={block.label} index={i} />
            ))}
          </div>
        </div>
      ))}

      {groups.length === 0 && (
        <div className="text-center py-8 text-[12px] text-white/25">
          No blocks match
          <button
            onClick={() => setQuery("")}
            className="block mx-auto mt-2 text-[11px] text-white/40 underline"
          >
            Clear search
          </button>
        </div>
      )}
    </div>
  );
}

function DraggableBlockItem({ type, label, index }: { type: string; label: string; index: number }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `catalog-${type}`,
    data: { type, source: "catalog" },
  });
  const [showPreview, setShowPreview] = useState(false);
  const [previewPos, setPreviewPos] = useState({ top: 0 });
  const itemRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function handleMouseEnter() {
    timeoutRef.current = setTimeout(() => {
      if (itemRef.current) {
        const rect = itemRef.current.getBoundingClientRect();
        setPreviewPos({ top: rect.top });
      }
      setShowPreview(true);
    }, 400);
  }

  function handleMouseLeave() {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setShowPreview(false);
  }

  const def = blockMap.get(type);
  const slug = getExtractSlug(type);
  const thumbnail = slug ? thumbnailBySlug[slug] : null;
  const manifest = slug ? manifestBySlug[slug] : null;

  return (
    <>
      <div
        ref={(node) => {
          setNodeRef(node);
          (itemRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
        }}
        {...attributes}
        {...listeners}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{ animationDelay: `${index * 50}ms` }}
        className={`stagger-item flex items-center gap-2 cursor-grab rounded-lg shadow-border shadow-border-hover bg-white/[0.02] px-2.5 py-1.5 text-[13px] text-white/50 hover:bg-white/[0.04] hover:text-white/70 active:cursor-grabbing ${
          isDragging ? "opacity-50" : ""
        }`}
      >
        {/* Inline mini-thumbnail for extracted blocks */}
        {thumbnail && (
          <div className="h-6 w-9 flex-shrink-0 overflow-hidden rounded bg-black/40">
            <img
              src={thumbnail}
              alt=""
              className="h-full w-full object-cover object-top"
              loading="lazy"
              decoding="async"
            />
          </div>
        )}
        <span className="truncate">{label}</span>
      </div>
      {showPreview && def && createPortal(
        <div
          className="fixed z-50 pointer-events-none"
          style={{ top: previewPos.top, left: 272 }}
        >
          <div className="rounded-xl border border-white/[0.06] bg-[#1a1a1f] shadow-2xl overflow-hidden" style={{ width: 420 }}>
            <div className="px-3 py-2 border-b border-white/[0.06]">
              <div className="text-[11px] text-white/60 font-medium">{label}</div>
              {manifest?.description && (
                <div className="text-[10px] text-white/30 mt-0.5 truncate">{manifest.description}</div>
              )}
              {manifest?.tags?.length ? (
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {manifest.tags.slice(0, 4).map((t) => (
                    <span key={t} className="text-[9px] px-1.5 py-0.5 rounded bg-white/[0.05] text-white/40">
                      {t}
                    </span>
                  ))}
                </div>
              ) : null}
            </div>
            <div className="overflow-hidden bg-[#0a0a0a]" style={{ height: 240 }}>
              {thumbnail ? (
                <img
                  src={thumbnail}
                  alt=""
                  className="h-full w-full object-cover object-top"
                  loading="lazy"
                />
              ) : (
                <SiteTheme font="Inter" brandColor="#3b82f6">
                  <div style={{ transform: "scale(0.3)", transformOrigin: "top left", width: 1400 }}>
                    <def.component {...def.defaultProps} />
                  </div>
                </SiteTheme>
              )}
            </div>
          </div>
        </div>,
        document.body,
      )}
    </>
  );
}

/* ─── Page List ──────────────────────────────────── */

function PageList({
  siteId,
  pages,
  activePageId,
  onSelect,
  onAdd,
  onDelete,
}: {
  siteId: string;
  pages: { id: string; name: string; slug: string }[];
  activePageId: string | null;
  onSelect: (id: string) => void;
  onAdd: () => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="space-y-0.5">
      {pages.map((page) => (
        <div
          key={page.id}
          onClick={() => onSelect(page.id)}
          className={`group flex cursor-pointer items-center justify-between rounded-lg px-3 py-2 text-[13px] transition-all ${
            activePageId === page.id
              ? "bg-white/[0.08] text-white"
              : "text-white/40 hover:bg-white/[0.04] hover:text-white/60"
          }`}
        >
          <div className="flex items-center gap-2 min-w-0">
            <FileText className="h-3.5 w-3.5 shrink-0 opacity-40" />
            <span className="truncate">{page.name}</span>
            <span className="text-[11px] text-white/20">{page.slug}</span>
          </div>
          {pages.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(page.id);
              }}
              className="shrink-0 rounded-md p-1 opacity-0 transition-all group-hover:opacity-100 hover:bg-red-500/15 hover:text-red-400"
            >
              <Trash2 className="h-3 w-3" />
            </button>
          )}
        </div>
      ))}
      <button
        onClick={onAdd}
        className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-[13px] text-white/25 transition-all hover:bg-white/[0.04] hover:text-white/40"
      >
        <Plus className="h-3.5 w-3.5" />
        Add Page
      </button>
    </div>
  );
}
