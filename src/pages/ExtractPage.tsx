import { useState } from "react";
import "./ExtractPage.css";

const API = "";

interface ProgressState {
  step: string;
  pct: number;
  detail: string;
}

interface ExtractStats {
  nodes: number;
  rules: number;
  keyframes: number;
  canvasCaptured: number;
  canvasFrames: number;
  mutationsProcessed: number;
  animateProcessed: number;
  passes: number;
}

interface TechState {
  gsap?: boolean;
  framerMotion?: boolean;
  anime?: boolean;
  lottie?: boolean;
  three?: boolean;
  react?: boolean;
  vue?: boolean;
  svgSmil?: number;
  canvasCount?: number;
  videoCount?: number;
  waapi?: number;
  cssKeyframes?: number;
  warnings?: string[];
}

interface DesignTokens {
  colors?: string[];
  fonts?: string[];
  fontSizes?: string[];
  gradients?: string[];
  shadows?: string[];
}

interface ExtractResult {
  ok: boolean;
  tookMs: number;
  cloneUrl?: string;
  proxyUrl?: string;
  html?: string;
  stats?: ExtractStats;
  tech?: TechState;
  designTokens?: DesignTokens;
  hasApiKey?: boolean;
}

export function ExtractPage() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState<ProgressState | null>(null);
  const [result, setResult] = useState<ExtractResult | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [fullClone, setFullClone] = useState(false);
  const [thorough, setThorough] = useState(false);
  const [blobUrl, setBlobUrl] = useState<string | null>(null);

  async function handleExtract(e: React.FormEvent) {
    e.preventDefault();
    let targetUrl = url.trim();
    if (!targetUrl) return;
    if (!/^https?:\/\//i.test(targetUrl)) targetUrl = "https://" + targetUrl;
    setUrl(targetUrl);
    setLoading(true);
    setProgress({ step: "Démarrage", pct: 0, detail: "" });
    setResult(null);
    setPreviewUrl(null);
    setError(null);
    if (blobUrl) { URL.revokeObjectURL(blobUrl); setBlobUrl(null); }

    const iv = setInterval(async () => {
      try {
        const r = await fetch(API + "/api/progress");
        const j = await r.json();
        if (j.active) setProgress({ step: j.step, pct: j.pct, detail: j.detail });
      } catch {}
    }, 600);

    try {
      const resp = await fetch(API + "/api/extract", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ url: targetUrl, thorough, fullClone }),
      });
      clearInterval(iv);
      const json = await resp.json();
      if (!json.ok) throw new Error(json.error || "Erreur inconnue");
      setResult(json);
      setProgress(null);

      if (json.cloneUrl) {
        setPreviewUrl(API + json.cloneUrl);
      } else if (json.proxyUrl) {
        setPreviewUrl(json.proxyUrl);
      } else if (json.html) {
        const blob = new Blob([json.html], { type: "text/html" });
        const u = URL.createObjectURL(blob);
        setBlobUrl(u);
        setPreviewUrl(u);
      }
    } catch (err: unknown) {
      clearInterval(iv);
      setError(err instanceof Error ? err.message : String(err));
      setProgress(null);
    } finally {
      setLoading(false);
    }
  }

  function handleDownload() {
    if (!result?.html) return;
    const blob = new Blob([result.html], { type: "text/html" });
    const a = document.createElement("a");
    try {
      a.href = URL.createObjectURL(blob);
      a.download = `clone-${new URL(url).hostname}-${Date.now()}.html`;
    } catch {
      a.href = URL.createObjectURL(blob);
      a.download = `clone-${Date.now()}.html`;
    }
    a.click();
  }

  const tech = result?.tech;
  const tokens = result?.designTokens;
  const stats = result?.stats;
  const warnings = tech?.warnings ?? [];
  const uniqueColors = tokens?.colors
    ? [...new Set(tokens.colors)].filter(c => c && c !== "transparent").slice(0, 24)
    : [];

  return (
    <div className="extract-page">

      <div className="extract-header">
        <h2>Extract Tool</h2>
        <p>Clone fidèle de n'importe quel site web</p>
      </div>

      <form className="extract-form" onSubmit={handleExtract}>
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="example.com"
          className="extract-input"
          disabled={loading}
          spellCheck={false}
          autoComplete="off"
        />
        <button type="submit" disabled={loading} className="extract-btn">
          {loading ? <span className="extract-spinner" /> : "Extract"}
        </button>
      </form>

      <div className="extract-opts">
        <label>
          <input type="checkbox" checked={thorough} onChange={(e) => setThorough(e.target.checked)} disabled={loading} />
          Approfondi
        </label>
        <label>
          <input type="checkbox" checked={fullClone} onChange={(e) => setFullClone(e.target.checked)} disabled={loading} />
          Full Clone (JS)
        </label>
      </div>

      {loading && progress && (
        <div className="extract-progress-wrap">
          <div className="extract-progress-track">
            <div className="extract-progress-fill" style={{ width: `${progress.pct}%` }} />
          </div>
          <div className="extract-progress-label">
            <span className="extract-progress-step">{progress.step}</span>
            {progress.detail && <span className="extract-progress-detail"> — {progress.detail}</span>}
            <span className="extract-progress-pct">{progress.pct}%</span>
          </div>
        </div>
      )}

      {error && (
        <div className="extract-error">
          <span className="extract-error-icon">⚠</span>
          <span>{error}</span>
        </div>
      )}

      {result && (
        <div className="extract-meta">
          {stats && (
            <div className="extract-stats">
              <StatBadge label="nodes" value={stats.nodes} />
              <StatBadge label="CSS rules" value={stats.rules} />
              <StatBadge label="@keyframes" value={stats.keyframes} />
              {stats.canvasCaptured > 0 && <StatBadge label="canvas" value={stats.canvasCaptured} accent />}
              {stats.animateProcessed > 0 && <StatBadge label="WAAPI" value={stats.animateProcessed} accent />}
              {stats.mutationsProcessed > 0 && <StatBadge label="mutations" value={stats.mutationsProcessed} />}
              <span className="extract-time">{(result.tookMs / 1000).toFixed(1)}s</span>
            </div>
          )}

          <div className="extract-actions">
            {tech && (
              <div className="extract-tech">
                {tech.react && <TechBadge name="React" />}
                {tech.vue && <TechBadge name="Vue" />}
                {tech.gsap && <TechBadge name="GSAP" />}
                {tech.framerMotion && <TechBadge name="Framer" />}
                {tech.three && <TechBadge name="Three.js" />}
                {tech.lottie && <TechBadge name="Lottie" />}
                {tech.anime && <TechBadge name="anime.js" />}
                {(tech.canvasCount ?? 0) > 0 && <TechBadge name={`${tech.canvasCount} canvas`} dim />}
                {(tech.videoCount ?? 0) > 0 && <TechBadge name={`${tech.videoCount} vidéo`} dim />}
                {(tech.cssKeyframes ?? 0) > 0 && <TechBadge name={`${tech.cssKeyframes} kf`} dim />}
              </div>
            )}
            {result.html && (
              <button className="extract-download-btn" onClick={handleDownload}>
                ↓ HTML
              </button>
            )}
          </div>

          {warnings.length > 0 && (
            <div className="extract-warnings">
              {warnings.map((w, i) => <div key={i} className="extract-warning">⚠ {w}</div>)}
            </div>
          )}

          {uniqueColors.length > 0 && (
            <div className="extract-tokens">
              {uniqueColors.map((c, i) => (
                <div key={i} className="extract-swatch" style={{ background: c }} title={c} />
              ))}
            </div>
          )}
        </div>
      )}

      {previewUrl && (
        <div className="extract-preview">
          <iframe src={previewUrl} title="Preview" sandbox="allow-scripts allow-same-origin" />
        </div>
      )}

    </div>
  );
}

function StatBadge({ label, value, accent }: { label: string; value: number; accent?: boolean }) {
  if (!value && value !== 0) return null;
  return (
    <div className={`stat-badge${accent ? " stat-badge--accent" : ""}`}>
      <span className="stat-value">{value.toLocaleString()}</span>
      <span className="stat-label">{label}</span>
    </div>
  );
}

function TechBadge({ name, dim }: { name: string; dim?: boolean }) {
  return <span className={`tech-badge${dim ? " tech-badge--dim" : ""}`}>{name}</span>;
}
