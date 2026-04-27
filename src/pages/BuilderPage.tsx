import { useEffect, useState } from "react";
import { useProjectStore } from "@/stores/project-store";
import { useComponentStore } from "@/stores/component-store";
import { bootstrapRegistry } from "@/lib/bootstrap";

export function BuilderPage() {
  const { active, projects, create, open, save, addBlock, removeBlock, selectBlock, selectedBlockId, loadAll } = useProjectStore();
  const { components, load: loadComponents } = useComponentStore();
  const [showPicker, setShowPicker] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    bootstrapRegistry().then(() => {
      loadComponents();
      loadAll();
    });
  }, []);

  const selectedBlock = active?.blocks.find(b => b.id === selectedBlockId);
  const selectedComp = selectedBlock ? components.find(c => c.id === selectedBlock.componentId) : null;

  // No active project — show project selector
  if (!active) {
    return (
      <div className="h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold text-zinc-100 mb-2">Site Builder</h1>
          <p className="text-sm text-zinc-500 mb-6">Créer un nouveau site ou ouvrir un projet existant</p>
          <button
            onClick={() => create("Nouveau Site")}
            className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors mb-6"
          >
            + Nouveau projet
          </button>
          {projects.length > 0 && (
            <div className="mt-4 space-y-2">
              <p className="text-xs text-zinc-600 uppercase tracking-wider mb-2">Projets existants</p>
              {projects.map(p => (
                <div
                  key={p.id}
                  onClick={() => open(p.id)}
                  className="bg-zinc-900 border border-zinc-800 rounded-lg p-3 cursor-pointer hover:border-zinc-600 text-left transition-colors"
                >
                  <div className="text-sm font-medium text-zinc-200">{p.name}</div>
                  <div className="text-xs text-zinc-500">{p.blocks.length} blocks · {new Date(p.updatedAt).toLocaleDateString()}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  const filteredComponents = search
    ? components.filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || c.tags.some(t => t.includes(search.toLowerCase())))
    : components.filter(c => c.isSection);

  return (
    <div className="h-screen bg-zinc-950 flex flex-col overflow-hidden">
      {/* Top bar */}
      <div className="h-12 border-b border-zinc-800 flex items-center px-4 gap-3 shrink-0">
        <span className="text-sm font-semibold text-zinc-200">{active.name}</span>
        <div className="flex-1" />
        <button onClick={() => setShowPicker(!showPicker)} className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-md text-xs font-medium transition-colors">
          + Add Section
        </button>
        <button onClick={() => save()} className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-3 py-1.5 rounded-md text-xs font-medium transition-colors">
          Save
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left: Block tree */}
        <div className="w-[240px] border-r border-zinc-800 overflow-y-auto p-3 shrink-0">
          <p className="text-[10px] text-zinc-600 uppercase tracking-wider mb-2 px-1">Blocks ({active.blocks.length})</p>
          {active.blocks.length === 0 ? (
            <p className="text-xs text-zinc-600 px-1">Ajouter des sections avec le bouton +</p>
          ) : (
            <div className="space-y-1">
              {active.blocks.map((block, i) => {
                const comp = components.find(c => c.id === block.componentId);
                return (
                  <div
                    key={block.id}
                    onClick={() => selectBlock(block.id)}
                    className={`flex items-center gap-2 px-2 py-2 rounded-md text-xs cursor-pointer transition-colors ${
                      selectedBlockId === block.id ? "bg-zinc-800 text-zinc-100" : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-300"
                    }`}
                  >
                    <span className="text-zinc-600 text-[10px] w-4">{i + 1}</span>
                    <span className="flex-1 truncate">{comp?.name || "Unknown"}</span>
                    <button
                      onClick={(e) => { e.stopPropagation(); removeBlock(block.id); }}
                      className="text-zinc-600 hover:text-red-400 opacity-0 group-hover:opacity-100"
                    >×</button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Center: Preview */}
        <div className="flex-1 overflow-y-auto bg-zinc-900/50 p-6">
          <div className="max-w-4xl mx-auto space-y-3">
            {active.blocks.length === 0 ? (
              <div className="text-center py-32 text-zinc-600">
                <p className="text-lg mb-2">Page vide</p>
                <p className="text-sm">Clique sur "+ Add Section" pour commencer</p>
              </div>
            ) : (
              active.blocks.map((block) => {
                const comp = components.find(c => c.id === block.componentId);
                return (
                  <div
                    key={block.id}
                    onClick={() => selectBlock(block.id)}
                    className={`bg-zinc-900 border rounded-lg p-6 cursor-pointer transition-all ${
                      selectedBlockId === block.id ? "border-blue-500 ring-1 ring-blue-500/20" : "border-zinc-800 hover:border-zinc-700"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-medium text-zinc-200">{comp?.name || "Unknown"}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-500">{comp?.category}</span>
                    </div>
                    <p className="text-xs text-zinc-500">{comp?.description}</p>
                    <p className="text-[10px] text-zinc-600 mt-2">{Object.keys(block.props).length} props configurées</p>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right: Props editor */}
        {selectedBlock && (
          <div className="w-[300px] border-l border-zinc-800 overflow-y-auto p-4 shrink-0">
            <p className="text-xs text-zinc-500 uppercase tracking-wider mb-3">{selectedComp?.name || "Props"}</p>
            <textarea
              className="w-full h-64 bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-xs text-zinc-300 font-mono outline-none resize-none focus:border-zinc-600"
              value={JSON.stringify(selectedBlock.props, null, 2)}
              onChange={(e) => {
                try {
                  const props = JSON.parse(e.target.value);
                  useProjectStore.getState().updateBlockProps(selectedBlock.id, props);
                } catch {}
              }}
            />
          </div>
        )}
      </div>

      {/* Component picker modal */}
      {showPicker && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center" onClick={() => setShowPicker(false)}>
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-[600px] max-h-[70vh] overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="p-4 border-b border-zinc-800">
              <input
                type="text"
                placeholder="Rechercher un composant..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 outline-none"
                autoFocus
              />
            </div>
            <div className="overflow-y-auto max-h-[55vh] p-2">
              {filteredComponents.map(comp => (
                <div
                  key={comp.id}
                  onClick={() => { addBlock(comp.id, comp.defaultProps); setShowPicker(false); setSearch(""); }}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer hover:bg-zinc-800 transition-colors"
                >
                  <div className="flex-1">
                    <div className="text-sm font-medium text-zinc-200">{comp.name}</div>
                    <div className="text-xs text-zinc-500">{comp.description}</div>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400">{comp.category}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
