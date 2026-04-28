import "./styles/tailwind.css";
import "@uilibrary/tokens/tokens.css";
import "@uilibrary/tokens/fonts-base.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
