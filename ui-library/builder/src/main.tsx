import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Dashboard } from "./routes/dashboard";
import { Builder } from "./routes/builder";
import { Preview } from "./routes/preview";
import "./globals.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/site/:siteId" element={<Builder />} />
        <Route path="/preview/:siteId" element={<Preview />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
