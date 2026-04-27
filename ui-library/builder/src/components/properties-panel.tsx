import { useSiteStore } from "../stores/site-store";
import { useBuilderUIStore } from "../stores/ui-store";
import { blockMap } from "../registry/blocks";
import { PropField } from "./prop-field";
import { ThemePanel } from "./theme-panel";
import type { ThemeConfig } from "../registry/types";

interface PropertiesPanelProps {
  siteId: string;
}

export function PropertiesPanel({ siteId }: PropertiesPanelProps) {
  const site = useSiteStore((s) => s.sites.find((x) => x.id === siteId));
  const { selectedBlockId, activePageId } = useBuilderUIStore();
  const { updateBlockProps, updateSiteTheme } = useSiteStore();

  if (!site) return null;

  const page = site.pages.find((p) => p.id === activePageId);
  const block = page?.blocks.find((b) => b.id === selectedBlockId);
  const def = block ? blockMap.get(block.type) : null;

  return (
    <aside className="flex h-full w-[280px] flex-shrink-0 flex-col border-l border-white/[0.06] bg-[#18181b]">
      <div className="flex-1 overflow-y-auto p-3">
        {block && def ? (
          <div className="space-y-2.5">
            <h3 className="text-[10px] font-medium uppercase tracking-wider text-white/25">
              {def.label}
            </h3>
            {def.propSchema.map((field, index) => (
              <div key={field.key} className="stagger-item" style={{ animationDelay: `${index * 60}ms` }}>
                <PropField
                  field={field}
                  value={block.props[field.key]}
                  onChange={(val) =>
                    updateBlockProps(siteId, activePageId!, block.id, {
                      [field.key]: val,
                    })
                  }
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="mb-1.5 text-[11px] text-white/25">No block selected</div>
            <div className="text-[10px] text-white/15">Click a block to edit properties</div>
          </div>
        )}
      </div>

      {/* Theme panel */}
      <div className="border-t border-white/[0.06] p-3">
        <ThemePanel
          theme={site.theme}
          onChange={(partial) => updateSiteTheme(siteId, partial)}
        />
      </div>
    </aside>
  );
}
