import "./shader-base.css";
import "./ShaderApp.css";
import { ShaderLabPage } from "./pages/ShaderLabPage";

export function ShaderLabWrapper() {
  return (
    <div className="shader-lab-scope" style={{ width: "100%", height: "100%", overflow: "hidden", position: "relative" }}>
      <ShaderLabPage />
    </div>
  );
}
