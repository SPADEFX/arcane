import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Sidebar } from "./components/Sidebar";
import { Home } from "./pages/Home";
import { ExtractPage } from "./pages/ExtractPage";
import "./styles/global.css";

import { lazy, Suspense } from "react";
const ShaderLabWrapper = lazy(() =>
  import("./features/shader-lab/ShaderLabWrapper").then((m) => ({ default: m.ShaderLabWrapper }))
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

export default function App() {
  return (
    <BrowserRouter>
      <div className="studio-layout">
        <Sidebar />
        <main className="studio-main">
          <Suspense fallback={<Loading />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/extract" element={<ExtractPage />} />
              <Route path="/shader-lab" element={<ShaderLabWrapper />} />
              <Route path="/medal-forge" element={<MedalForgePage />} />
            </Routes>
          </Suspense>
        </main>
      </div>
    </BrowserRouter>
  );
}
