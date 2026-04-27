import { useState } from "react";
import "./ExtractPage.css";

const API = "";

export function ExtractPage() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [result, setResult] = useState<any>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fullClone, setFullClone] = useState(false);
  const [thorough, setThorough] = useState(false);

  async function handleExtract(e: React.FormEvent) {
    e.preventDefault();
    let targetUrl = url.trim();
    if (!targetUrl) return;
    if (!/^https?:\/\//i.test(targetUrl)) targetUrl = "https://" + targetUrl;
    setUrl(targetUrl);
    setLoading(true);
    setStatus("Extraction...");
    setResult(null);
    setPreviewUrl(null);

    // Poll progress
    const iv = setInterval(async () => {
      try {
        const r = await fetch(API + "/api/progress");
        const j = await r.json();
        if (j.active) setStatus(`${j.step} (${j.pct}%) ${j.detail}`);
      } catch {}
    }, 800);

    try {
      const resp = await fetch(API + "/api/extract", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ url: targetUrl, thorough, fullClone }),
      });
      clearInterval(iv);
      const json = await resp.json();
      if (!json.ok) throw new Error(json.error);
      setResult(json);
      setStatus(`Terminé en ${(json.tookMs / 1000).toFixed(1)}s — ${json.stats?.nodes || 0} nodes, ${json.stats?.rules || 0} CSS rules`);

      if (json.cloneUrl) {
        setPreviewUrl(API + json.cloneUrl);
      } else if (json.html) {
        const blob = new Blob([json.html], { type: "text/html" });
        setPreviewUrl(URL.createObjectURL(blob));
      }
      if (json.proxyUrl) {
        setPreviewUrl(json.proxyUrl);
      }
    } catch (err: any) {
      clearInterval(iv);
      setStatus("Erreur: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="extract-page">
      <div className="extract-header">
        <h2>🔍 Extract Tool</h2>
        <p>Clone fidèle de n'importe quel site web</p>
      </div>
      <form className="extract-form" onSubmit={handleExtract}>
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="example.com"
          className="extract-input"
        />
        <button type="submit" disabled={loading} className="extract-btn">
          {loading ? "..." : "Extract"}
        </button>
      </form>
      <div className="extract-opts">
        <label><input type="checkbox" checked={thorough} onChange={(e) => setThorough(e.target.checked)} /> Approfondi</label>
        <label><input type="checkbox" checked={fullClone} onChange={(e) => setFullClone(e.target.checked)} /> Full Clone (JS)</label>
      </div>
      {status && <div className="extract-status">{status}</div>}
      {previewUrl && (
        <div className="extract-preview">
          <iframe src={previewUrl} title="Preview" />
        </div>
      )}
    </div>
  );
}
