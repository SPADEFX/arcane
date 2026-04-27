import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Copy, Trash2, Globe, FileText, Palette, Leaf, Layers } from "lucide-react";
import { useSiteStore } from "../stores/site-store";
import { pageTemplates } from "../registry/templates";

export function Dashboard() {
  const { sites, createSite, createSiteFromTemplate, deleteSite, duplicateSite } = useSiteStore();
  const navigate = useNavigate();
  const [newName, setNewName] = useState("");
  const [showCreate, setShowCreate] = useState(false);

  useEffect(() => {
    document.title = "Builder";
  }, []);

  function handleCreateBlank() {
    const name = newName.trim() || "Untitled Site";
    const id = createSite(name);
    setNewName("");
    setShowCreate(false);
    navigate(`/site/${id}`);
  }

  function handleCreateFromTemplate(templateId: string) {
    const template = pageTemplates.find((t) => t.id === templateId);
    if (!template) return;
    const name = newName.trim() || template.name;
    const id = createSiteFromTemplate(template, name);
    setNewName("");
    setShowCreate(false);
    navigate(`/site/${id}`);
  }

  const templateIcons: Record<string, typeof FileText> = {
    "landing-full": FileText,
    "dark-purple": Palette,
    "minimal-green": Leaf,
    "aave-pro": Layers,
  };

  const sorted = [...sites].sort((a, b) => b.updatedAt - a.updatedAt);

  return (
    <div className="min-h-screen bg-[#111113] text-white">
      {/* Header */}
      <header className="border-b border-white/[0.06] px-8 py-5">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <h1 className="text-[15px] font-semibold tracking-tight text-white/80">uilibrary builder</h1>
          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-[13px] font-medium text-black transition-all hover:bg-white/90 active:scale-[0.98]"
          >
            <Plus className="h-3.5 w-3.5" />
            New Site
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-8 py-10">
        {/* Create dialog */}
        {showCreate && (
          <div className="mb-8 rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
            <h2 className="mb-3 text-[15px] font-semibold text-white/80">Create a new site</h2>
            <div className="mb-4 flex gap-2">
              <input
                autoFocus
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleCreateBlank()}
                placeholder="Site name (optional)..."
                className="flex-1 rounded-lg bg-white/[0.04] px-4 py-2 text-[13px] text-white placeholder:text-white/25 outline-none transition-colors focus:bg-white/[0.07]"
              />
              <button
                onClick={() => setShowCreate(false)}
                className="rounded-lg bg-white/[0.04] px-4 py-2 text-[13px] text-white/40 transition-colors hover:bg-white/[0.07] hover:text-white/60"
              >
                Cancel
              </button>
            </div>

            <p className="mb-3 text-[12px] font-medium uppercase tracking-wider text-white/30">
              Start from a template
            </p>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
              {/* Blank */}
              <button
                onClick={handleCreateBlank}
                className="group flex flex-col items-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 text-center transition-all hover:border-white/[0.12] hover:bg-white/[0.04] active:scale-[0.98]"
              >
                <Plus className="h-6 w-6 text-white/20 transition-colors group-hover:text-white/40" />
                <span className="text-[13px] font-medium text-white/60">Blank</span>
                <span className="text-[11px] text-white/25">Empty page</span>
              </button>

              {/* Templates */}
              {pageTemplates.map((template) => {
                const Icon = templateIcons[template.id] || FileText;
                return (
                  <button
                    key={template.id}
                    onClick={() => handleCreateFromTemplate(template.id)}
                    className="group flex flex-col items-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 text-center transition-all hover:border-white/[0.12] hover:bg-white/[0.04] active:scale-[0.98]"
                  >
                    <div
                      className="flex h-6 w-6 items-center justify-center rounded-md"
                      style={{ color: template.theme.brandColor }}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="text-[13px] font-medium text-white/60">{template.name}</span>
                    <span className="line-clamp-2 text-[11px] text-white/25">{template.description}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Sites grid */}
        {sorted.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center stagger-item">
            <Globe className="mb-4 h-10 w-10 text-white/10 icon-animated" />
            <h2 className="text-[15px] font-medium text-white/40">No sites yet</h2>
            <p className="mt-1 text-[13px] text-white/20">Create your first site to get started.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {sorted.map((site, index) => (
              <div
                key={site.id}
                className="stagger-item group relative rounded-xl shadow-border shadow-border-hover bg-white/[0.02] p-4 transition-all hover:bg-white/[0.03]"
                style={{ animationDelay: `${index * 80}ms` }}
              >
                <button
                  onClick={() => navigate(`/site/${site.id}`)}
                  className="block w-full text-left"
                >
                  <h3 className="text-[14px] font-semibold text-white/80 truncate">{site.name}</h3>
                  <p className="mt-1 text-[12px] text-white/25">
                    {site.pages.length} page{site.pages.length !== 1 ? "s" : ""} &middot;{" "}
                    {new Date(site.updatedAt).toLocaleDateString()}
                  </p>
                  <div className="mt-3 flex items-center gap-2">
                    <span
                      className="h-3.5 w-3.5 rounded-full border border-white/10"
                      style={{ background: site.theme.brandColor }}
                    />
                    <span className="text-[11px] text-white/25">{site.theme.font}</span>
                    {site.theme.dark && (
                      <span className="text-[11px] text-white/20">dark</span>
                    )}
                  </div>
                </button>

                {/* Actions */}
                <div className="absolute right-3 top-3 flex gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      duplicateSite(site.id);
                    }}
                    className="rounded-lg p-1.5 text-white/30 transition-colors hover:bg-white/[0.06] hover:text-white/60"
                    title="Duplicate"
                  >
                    <Copy className="h-3.5 w-3.5 icon-animated" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm(`Delete "${site.name}"?`)) deleteSite(site.id);
                    }}
                    className="rounded-lg p-1.5 text-white/30 transition-colors hover:bg-red-500/15 hover:text-red-400"
                    title="Delete"
                  >
                    <Trash2 className="h-3.5 w-3.5 icon-animated" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
