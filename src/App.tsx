import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Sidebar } from "./components/Sidebar";
import { Home } from "./pages/Home";
import { ExtractPage } from "./pages/ExtractPage";
import "./styles/global.css";

import { lazy, Suspense, useEffect } from "react";
import * as db from "./lib/db";

const ShaderLabWrapper = lazy(() =>
  import("./features/shader-lab/ShaderLabWrapper").then((m) => ({ default: m.ShaderLabWrapper }))
);
const MyComponentsPage = lazy(() =>
  import("./pages/MyComponentsPage").then((m) => ({ default: m.MyComponentsPage }))
);
const BuilderDashboard = lazy(() =>
  import("./features/builder-routes/dashboard").then((m) => ({ default: m.Dashboard }))
);
const BuilderEditor = lazy(() =>
  import("./features/builder-routes/builder").then((m) => ({ default: m.Builder }))
);
const BuilderPreview = lazy(() =>
  import("./features/builder-routes/preview").then((m) => ({ default: m.Preview }))
);

function Loading() {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "var(--muted)", fontSize: 13 }}>
      Chargement...
    </div>
  );
}

function MedalForgePage() {
  return <iframe src="http://localhost:3001" style={{ width: "100%", height: "100%", border: "none" }} title="Medal Forge" />;
}

function StorybookPage() {
  return <iframe src="http://localhost:6006" style={{ width: "100%", height: "100%", border: "none" }} title="Storybook" />;
}

export default function App() {
  // Listen for components saved from Extract Tool iframe
  useEffect(() => {
    const handler = async (e: MessageEvent) => {
      if (e.data?.type === "arcane-save-component" && e.data.component) {
        try {
          await db.put("components", e.data.component);
          console.log("✅ Component saved to library:", e.data.component.name);
          // Reload extracted blocks in builder registry
          import("./features/builder-registry/blocks").then(m => m.loadExtractedBlocks());
        } catch (err) {
          console.error("Failed to save component:", err);
        }
      }
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, []);

  return (
    <BrowserRouter>
      <div className="studio-layout">
        <Sidebar />
        <main className="studio-main">
          <Suspense fallback={<Loading />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/extract" element={<iframe src="http://localhost:3000" style={{ width: "100%", height: "100%", border: "none" }} title="Extract Tool" />} />
              <Route path="/shader-lab" element={<ShaderLabWrapper />} />
              <Route path="/library" element={<LibraryPage />} />
              <Route path="/storybook" element={<StorybookPage />} />
              <Route path="/my-components" element={<MyComponentsPage />} />
              <Route path="/builder" element={<BuilderDashboard />} />
              <Route path="/site/:siteId" element={<BuilderEditor />} />
              <Route path="/preview/:siteId" element={<BuilderPreview />} />
              <Route path="/medal-forge" element={<MedalForgePage />} />
            </Routes>
          </Suspense>
        </main>
      </div>
    </BrowserRouter>
  );
}
