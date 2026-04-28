import "../builder-globals.css";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
} from "@dnd-kit/core";
import { nanoid } from "nanoid";
import { useSiteStore } from "../builder-stores/site-store";
import { useBuilderUIStore } from "../builder-stores/ui-store";
import { blockMap, loadExtractedBlocks } from "../builder-registry/blocks";
import { TopBar } from "../builder-components/top-bar";
import { Sidebar } from "../builder-components/sidebar";
import { Canvas } from "../builder-components/canvas";
import { PropertiesPanel } from "../builder-components/properties-panel";

export function Builder() {
  const { siteId } = useParams<{ siteId: string }>();
  const navigate = useNavigate();
  const site = useSiteStore((s) => s.sites.find((x) => x.id === siteId));
  const { activePageId, setActivePageId, setIsDragging } = useBuilderUIStore();
  const { addBlock, moveBlock } = useSiteStore();
  const [draggedType, setDraggedType] = useState<string | null>(null);
  const [blocksReady, setBlocksReady] = useState(false);

  // Load extracted components from IndexedDB + set title
  useEffect(() => {
    document.title = "Builder";
    loadExtractedBlocks().then(() => setBlocksReady(true));
  }, []);

  // Initialize active page
  useEffect(() => {
    if (site && !activePageId) {
      setActivePageId(site.pages[0]?.id ?? null);
    }
  }, [site, activePageId, setActivePageId]);

  // Redirect if site not found
  useEffect(() => {
    if (!site) navigate("/");
  }, [site, navigate]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );

  if (!site || !siteId) return null;

  const page = site.pages.find((p) => p.id === activePageId);

  function handleDragStart(event: DragStartEvent) {
    setIsDragging(true);
    const data = event.active.data.current;
    if (data?.source === "catalog") {
      setDraggedType(data.type);
    }
  }

  function handleDragEnd(event: DragEndEvent) {
    setIsDragging(false);
    setDraggedType(null);

    const { active, over } = event;
    if (!over || !page) return;

    const activeData = active.data.current;

    // Catalog → Canvas: insert new block
    if (activeData?.source === "catalog") {
      const def = blockMap.get(activeData.type);
      if (!def) return;

      const newBlock = {
        id: nanoid(10),
        type: def.type,
        props: { ...def.defaultProps },
      };

      const overIndex = page.blocks.findIndex((b) => b.id === over.id);
      addBlock(siteId!, activePageId!, newBlock, overIndex >= 0 ? overIndex : undefined);
      return;
    }

    // Canvas reorder
    const activeId = String(active.id);
    const overId = String(over.id);
    if (activeId !== overId) {
      const oldIndex = page.blocks.findIndex((b) => b.id === activeId);
      const newIndex = page.blocks.findIndex((b) => b.id === overId);
      if (oldIndex >= 0 && newIndex >= 0) {
        moveBlock(siteId!, activePageId!, oldIndex, newIndex);
      }
    }
  }

  return (
    <div className="flex h-full flex-col bg-[#111113] text-white">
      <TopBar siteId={siteId} />
      <div className="flex flex-1 overflow-hidden">
        <DndContext
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <Sidebar siteId={siteId} />
          <Canvas siteId={siteId} />
          <DragOverlay>
            {draggedType && (
              <div className="rounded-lg border border-blue-500/30 bg-blue-500/10 px-4 py-2 text-[13px] text-white shadow-xl backdrop-blur-md">
                {blockMap.get(draggedType)?.label ?? draggedType}
              </div>
            )}
          </DragOverlay>
        </DndContext>
        <PropertiesPanel siteId={siteId} />
      </div>
    </div>
  );
}
