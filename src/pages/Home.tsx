import { useNavigate } from "react-router-dom";
import "./Home.css";

const TOOLS = [
  {
    path: "/extract",
    title: "Extract Tool",
    desc: "Clone fidèle de sites web. Capture HTML, CSS, animations, canvas, fonts. Analyse technique, proxy live, DOM inspector, section cloner.",
    tags: ["Capture", "Proxy", "Analyze", "Clone"],
  },
  {
    path: "/shader-lab",
    title: "Shader Lab",
    desc: "Éditeur de shaders WebGL avec preview 3D live. Layers, effects, timeline d'animation.",
    tags: ["Three.js", "GLSL", "WebGL"],
  },
  {
    path: "/medal-forge",
    title: "Medal Forge",
    desc: "Transforme des SVGs en médailles et badges 3D. Extrusion, materials, export GLB.",
    tags: ["Three.js", "SVG", "GLB"],
  },
];

export function Home() {
  const navigate = useNavigate();
  return (
    <div className="home">
      <div className="home-header">
        <h2>Studio</h2>
        <p>{TOOLS.length} outils</p>
      </div>
      <div className="home-grid">
        {TOOLS.map((t) => (
          <div key={t.path} className="home-card" onClick={() => navigate(t.path)}>
            <div className="hc-title">{t.title}</div>
            <div className="hc-desc">{t.desc}</div>
            <div className="hc-tags">
              {t.tags.map((tag) => <span key={tag}>{tag}</span>)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
