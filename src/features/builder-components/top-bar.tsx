import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Eye, Blocks, Monitor, Tablet, Smartphone } from "lucide-react";
import { useSiteStore } from "../builder-stores/site-store";
import { useBuilderUIStore, type Breakpoint } from "../builder-stores/ui-store";

const breakpoints: { key: Breakpoint; icon: typeof Monitor; label: string }[] = [
  { key: "desktop", icon: Monitor, label: "Desktop" },
  { key: "tablet", icon: Tablet, label: "Tablet" },
  { key: "phone", icon: Smartphone, label: "Phone" },
];

interface TopBarProps {
  siteId: string;
}

export function TopBar({ siteId }: TopBarProps) {
  const navigate = useNavigate();
  const site = useSiteStore((s) => s.sites.find((x) => x.id === siteId));
  const { renameSite } = useSiteStore();
  const { activePageId, setActivePageId, breakpoint, setBreakpoint } = useBuilderUIStore();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) inputRef.current?.select();
  }, [editing]);

  if (!site) return null;

  function commitRename() {
    const trimmed = draft.trim();
    if (trimmed && trimmed !== site!.name) {
      renameSite(siteId, trimmed);
    }
    setEditing(false);
  }

  return (
    <header className="flex h-11 items-center border-b border-white/[0.06] bg-[#18181b] px-3">
      {/* Left */}
      <div className="flex flex-1 min-w-0 items-center gap-2">
        <button
          onClick={() => navigate("/")}
          className="shrink-0 rounded-lg p-1.5 text-white/40 transition-colors hover:bg-white/[0.06] hover:text-white/70"
          title="Back to dashboard"
        >
          <ArrowLeft className="h-4 w-4 icon-animated" />
        </button>
        <div className="h-4 w-px bg-white/[0.06]" />
        {editing ? (
          <input
            ref={inputRef}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={commitRename}
            onKeyDown={(e) => {
              if (e.key === "Enter") commitRename();
              if (e.key === "Escape") setEditing(false);
            }}
            className="min-w-0 max-w-[180px] rounded-md bg-white/[0.06] px-2 py-0.5 text-[13px] font-medium text-white outline-none focus:bg-white/[0.1]"
          />
        ) : (
          <button
            onClick={() => { setDraft(site.name); setEditing(true); }}
            className="truncate rounded-md px-2 py-0.5 text-[13px] font-medium text-white/70 transition-colors hover:text-white"
            title="Click to rename"
          >
            {site.name}
          </button>
        )}
      </div>

      {/* Center — breakpoint selector + page tabs */}
      <div className="flex shrink-0 items-center gap-3">
        {/* Breakpoint toggle */}
        <div className="flex items-center rounded-lg bg-white/[0.04] p-0.5">
          {breakpoints.map((bp) => {
            const Icon = bp.icon;
            const active = breakpoint === bp.key;
            return (
              <button
                key={bp.key}
                onClick={() => setBreakpoint(bp.key)}
                className={`rounded-md p-1.5 transition-all ${
                  active
                    ? "bg-white/[0.1] text-white shadow-sm"
                    : "text-white/30 hover:text-white/50"
                }`}
                title={bp.label}
              >
                <Icon className="h-3.5 w-3.5 icon-animated" />
              </button>
            );
          })}
        </div>

        <div className="h-4 w-px bg-white/[0.06]" />

        {/* Page tabs */}
        <div className="flex items-center gap-0.5">
          {site.pages.map((page) => (
            <button
              key={page.id}
              onClick={() => setActivePageId(page.id)}
              className={`rounded-md px-2.5 py-1 text-[12px] font-medium transition-all ${
                activePageId === page.id
                  ? "bg-white/[0.08] text-white"
                  : "text-white/30 hover:text-white/50"
              }`}
            >
              {page.name}
            </button>
          ))}
        </div>
      </div>

      {/* Right */}
      <div className="flex flex-1 min-w-0 items-center justify-end gap-1.5">
        <button
          onClick={() => window.open("http://localhost:6006", "_blank")}
          className="flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[12px] font-medium text-white/40 transition-colors hover:bg-white/[0.06] hover:text-white/70"
          title="Open component library"
        >
          <Blocks className="h-3.5 w-3.5 icon-animated" />
          Components
        </button>
        <button
          onClick={() => window.open(`/preview/${siteId}`, "_blank")}
          className="flex shrink-0 items-center gap-1.5 rounded-lg bg-blue-500/15 px-3 py-1.5 text-[12px] font-medium text-blue-400 transition-colors hover:bg-blue-500/25"
        >
          <Eye className="h-3.5 w-3.5 icon-animated" />
          Preview
        </button>
      </div>
    </header>
  );
}
