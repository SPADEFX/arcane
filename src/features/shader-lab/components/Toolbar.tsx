import { useEffect, useRef, useState } from "react";
import { useLayerStore } from "../stores/layerStore";
import type { Project } from "../types";
import {
  downloadJson,
  exportPng,
  pickFile,
  projectFromState,
} from "../utils/projectIO";
import { PresetsPopover } from "./PresetsPopover";
import { SceneSettingsPopover } from "./SceneSettingsPopover";
import "./Toolbar.css";

export const Toolbar: React.FC = () => {
  const undo = useLayerStore((s) => s.undo);
  const redo = useLayerStore((s) => s.redo);
  const layers = useLayerStore((s) => s.layers);
  const loadProject = useLayerStore((s) => s.loadProject);
  const historyIndex = useLayerStore((s) => s.historyIndex);
  const historyLen = useLayerStore((s) => s.history.length);
  const sceneBtnRef = useRef<HTMLButtonElement>(null);
  const [sceneOpen, setSceneOpen] = useState(false);
  const presetsBtnRef = useRef<HTMLButtonElement>(null);
  const [presetsOpen, setPresetsOpen] = useState(false);

  const canUndo = historyIndex >= 0;
  const canRedo = historyIndex < historyLen - 1;

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const mod = e.metaKey || e.ctrlKey;
      if (mod && e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        undo();
      } else if (mod && ((e.key === "z" && e.shiftKey) || e.key === "y")) {
        e.preventDefault();
        redo();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [undo, redo]);

  const handleSave = () => {
    const project = projectFromState(layers);
    downloadJson("shader-lab-project.json", project);
  };

  const handleLoad = async () => {
    const file = await pickFile("application/json");
    if (!file) return;
    try {
      const text = await file.text();
      const data = JSON.parse(text) as Project;
      if (!Array.isArray(data.layers)) throw new Error("Invalid project");
      loadProject(data.layers);
    } catch (err) {
      console.error(err);
      alert("Invalid project file.");
    }
  };

  const handleExportPng = async () => {
    const canvas = document.querySelector(
      'canvas[data-editor-canvas="true"]',
    ) as HTMLCanvasElement | null;
    if (!canvas) return;
    await exportPng(canvas, "shader.png");
  };

  const handleImmersive = () => {
    const root = document.documentElement;
    if (document.fullscreenElement) {
      document.exitFullscreen?.();
    } else {
      root.requestFullscreen?.();
    }
  };

  return (
    <div className="toolbar glass-panel toolbar-inline">
      <div className="toolbar-group">
        <button
          className="icon-btn"
          type="button"
          onClick={undo}
          disabled={!canUndo}
          aria-label="Undo"
          title="Undo (Ctrl+Z)"
        >
          <svg width="16" height="16" viewBox="0 0 256 256" fill="currentColor">
            <path d="M228,128a100,100,0,0,1-98.66,100H128a99.39,99.39,0,0,1-68.62-27.29,12,12,0,0,1,16.48-17.45,76,76,0,1,0-1.57-109c-.13.13-.25.25-.39.37L54.89,92H72a12,12,0,0,1,0,24H24a12,12,0,0,1-12-12V56a12,12,0,0,1,24,0V76.72L57.48,57.06A100,100,0,0,1,228,128Z" />
          </svg>
        </button>
        <button
          className="icon-btn"
          type="button"
          onClick={redo}
          disabled={!canRedo}
          aria-label="Redo"
          title="Redo (Ctrl+Shift+Z)"
        >
          <svg width="16" height="16" viewBox="0 0 256 256" fill="currentColor">
            <path d="M244,56v48a12,12,0,0,1-12,12H184a12,12,0,1,1,0-24H201.1l-19-17.38c-.13-.12-.26-.24-.38-.37A76,76,0,1,0,127,204h1a75.53,75.53,0,0,0,52.15-20.72,12,12,0,0,1,16.49,17.45A99.45,99.45,0,0,1,128,228h-1.37A100,100,0,1,1,198.51,57.06L220,76.72V56a12,12,0,0,1,24,0Z" />
          </svg>
        </button>
      </div>
      <span className="divider" />
      <div className="toolbar-group">
        <button
          ref={presetsBtnRef}
          className="text-btn"
          type="button"
          onClick={() => setPresetsOpen((v) => !v)}
          title="Load a preset (replaces layers)"
        >
          ✨ Presets
        </button>
        <PresetsPopover
          anchorRef={presetsBtnRef}
          open={presetsOpen}
          onClose={() => setPresetsOpen(false)}
        />
      </div>
      <span className="divider" />
      <div className="toolbar-group">
        <button className="text-btn" type="button" onClick={handleSave} title="Save project JSON">
          Save
        </button>
        <button className="text-btn" type="button" onClick={handleLoad} title="Load project JSON">
          Load
        </button>
        <button className="text-btn" type="button" onClick={handleExportPng} title="Export PNG">
          PNG
        </button>
      </div>
      <span className="divider" />
      <div className="toolbar-group">
        <button
          ref={sceneBtnRef}
          className="text-btn"
          type="button"
          onClick={() => setSceneOpen((v) => !v)}
          title="Scene settings"
        >
          Scene
        </button>
        <SceneSettingsPopover
          anchorRef={sceneBtnRef}
          open={sceneOpen}
          onClose={() => setSceneOpen(false)}
        />
        <button
          className="icon-btn"
          type="button"
          onClick={handleImmersive}
          aria-label="Immersive"
          title="Immersive (fullscreen)"
        >
          <svg width="14" height="14" viewBox="0 0 256 256" fill="currentColor">
            <path d="M228,56V88a12,12,0,0,1-24,0V68H184a12,12,0,0,1,0-24h32A12,12,0,0,1,228,56ZM72,188H52V168a12,12,0,0,0-24,0v32a12,12,0,0,0,12,12H72a12,12,0,0,0,0-24ZM216,156a12,12,0,0,0-12,12v20H184a12,12,0,0,0,0,24h32a12,12,0,0,0,12-12V168A12,12,0,0,0,216,156ZM72,44H40A12,12,0,0,0,28,56V88a12,12,0,0,0,24,0V68H72a12,12,0,0,0,0-24Z" />
          </svg>
        </button>
      </div>
    </div>
  );
};
