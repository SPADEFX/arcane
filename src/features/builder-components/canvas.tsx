import { useRef, useState, useEffect, useCallback } from "react";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { SiteTheme } from "@uilibrary/ui";
import { useSiteStore } from "../builder-stores/site-store";
import { useBuilderUIStore, breakpointWidths } from "../builder-stores/ui-store";
import { blockMap } from "../builder-registry/blocks";
import { BlockRenderer } from "./block-renderer";
import { BlockWrapper } from "./block-wrapper";

interface CanvasProps {
  siteId: string;
}

export function Canvas({ siteId }: CanvasProps) {
  const site = useSiteStore((s) => s.sites.find((x) => x.id === siteId));
  const { activePageId, selectedBlockId, setSelectedBlockId, isDragging, breakpoint } = useBuilderUIStore();
  const { removeBlock, duplicateBlock, moveBlock } = useSiteStore();

  const page = site?.pages.find((p) => p.id === activePageId);
  const blocks = page?.blocks ?? [];

  const { setNodeRef, isOver } = useDroppable({ id: "canvas-drop" });

  const canvasWidth = breakpointWidths[breakpoint];
  const isConstrained = breakpoint !== "desktop";

  // Measure available width to compute scale factor for constrained previews
  const containerRef = useRef<HTMLDivElement>(null);
  const [availableWidth, setAvailableWidth] = useState(0);

  const measureWidth = useCallback(() => {
    if (containerRef.current) {
      setAvailableWidth(containerRef.current.clientWidth);
    }
  }, []);

  useEffect(() => {
    measureWidth();
    window.addEventListener("resize", measureWidth);
    return () => window.removeEventListener("resize", measureWidth);
  }, [measureWidth]);

  // Scale factor: fit the breakpoint width inside the available container space
  // Leave some padding (48px total) for the rounded border appearance
  const padding = 48;
  const scale = isConstrained && availableWidth > 0
    ? Math.min(1, (availableWidth - padding) / canvasWidth)
    : 1;

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-y-auto overflow-x-hidden bg-[#111113]"
      onClick={() => setSelectedBlockId(null)}
    >
      <div
        className={`${breakpoint === "desktop" ? "force-desktop" : ""} breakpoint-${breakpoint} canvas-isolate relative mx-auto min-h-full overflow-hidden transition-all duration-300 ${
          isConstrained ? "my-6 rounded-xl shadow-2xl border border-white/[0.04]" : ""
        }`}
        style={{
          width: isConstrained ? canvasWidth : undefined,
          maxWidth: isConstrained ? undefined : canvasWidth,
          transform: isConstrained ? `scale(${scale})` : undefined,
          transformOrigin: "top center",
        }}
      >
        <SiteTheme
          font={site?.theme.font}
          brandColor={site?.theme.brandColor}
          dark={site?.theme.dark}
          radius={site?.theme.radius}
        >
          <div
            ref={setNodeRef}
            className={`min-h-[80vh] transition-shadow ${
              isOver ? "ring-2 ring-blue-500/30 ring-inset" : ""
            }`}
            style={{ background: "var(--color-bg)" }}
          >
            {blocks.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-32 text-center">
                <div className="mb-3 text-4xl opacity-10">+</div>
                <p className="text-[14px] font-medium opacity-30" style={{ color: "var(--color-text)" }}>
                  Drag blocks here to start building
                </p>
                <p className="mt-1.5 text-[12px] opacity-20" style={{ color: "var(--color-text)" }}>
                  Pick from the Blocks tab on the left
                </p>
              </div>
            ) : (
              <SortableContext
                items={blocks.map((b) => b.id)}
                strategy={verticalListSortingStrategy}
              >
                {blocks.map((block, i) => {
                  const def = blockMap.get(block.type);
                  return (
                    <div key={block.id}>
                      {isDragging && i === 0 && (
                        <div className="h-0.5 bg-blue-500/30 mx-4" />
                      )}
                      <BlockWrapper
                        id={block.id}
                        selected={selectedBlockId === block.id}
                        label={def?.label ?? block.type}
                        index={i}
                        totalBlocks={blocks.length}
                        onSelect={() => setSelectedBlockId(block.id)}
                        onDelete={() => removeBlock(siteId, activePageId!, block.id)}
                        onDuplicate={() => duplicateBlock(siteId, activePageId!, block.id)}
                        onMoveUp={() => i > 0 && moveBlock(siteId, activePageId!, i, i - 1)}
                        onMoveDown={() => i < blocks.length - 1 && moveBlock(siteId, activePageId!, i, i + 1)}
                      >
                        <BlockRenderer block={block} />
                      </BlockWrapper>
                      {isDragging && (
                        <div className="h-0.5 bg-blue-500/30 mx-4" />
                      )}
                    </div>
                  );
                })}
              </SortableContext>
            )}
          </div>
        </SiteTheme>
      </div>
    </div>
  );
}
