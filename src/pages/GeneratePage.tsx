import { useEffect, useState, useCallback } from "react";

/* ─────────────────────────────────────────────────────────────────────────
 * Image generator — Gemini Nano Banana
 *
 * Sends prompt → POST localhost:3000/api/generate-image → saves to
 * public/generated/{slug}.png → instantly available as <img src="/generated/{slug}.png" />
 * in any component.
 *
 * Lists previously generated images from the same directory so you can
 * browse, copy URLs, or delete.
 * ─────────────────────────────────────────────────────────────────────── */

const API = "http://localhost:3000";

interface GeneratedImage {
  slug: string;
  url: string;
  size: number;
  createdAt: string;
}

interface ImageModel {
  name: string;
  description: string;
  pricePerImage: number;
  family: "gemini" | "imagen";
  aspectRatios: string[];
}

const ASPECTS_GEMINI = ["1:1", "16:9", "4:5", "9:16", "21:9"];
const ASPECTS_IMAGEN = ["1:1", "16:9", "4:3", "3:4", "9:16"];

const SAMPLE_PROMPTS = [
  "Hand-drawn illustration on cream off-white paper, single character with stick legs and big eyes",
  "Cinematic close-up of a brushed metal surface, dramatic side lighting, editorial automotive photography",
  "Watercolor abstract atmosphere in soft pastels, generous negative space, hand-painted texture",
  "Isometric 3D illustration of a small workspace with a laptop and plant, soft pastel colors",
];

export function GeneratePage() {
  const [prompt, setPrompt] = useState("");
  const [aspectRatio, setAspectRatio] = useState("16:9");
  const [slug, setSlug] = useState("");
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [latest, setLatest] = useState<GeneratedImage | null>(null);
  const [history, setHistory] = useState<GeneratedImage[]>([]);
  const [models, setModels] = useState<Record<string, ImageModel>>({});
  const [model, setModel] = useState<string>("gemini-3-pro-image-preview");

  const loadHistory = useCallback(async () => {
    try {
      const res = await fetch(`${API}/api/generated-images`);
      const json = await res.json();
      if (json.ok) setHistory(json.images);
    } catch (e) {
      // server might be down — silent
    }
  }, []);

  useEffect(() => {
    loadHistory();
    fetch(`${API}/api/image-models`)
      .then((r) => r.json())
      .then((j) => {
        if (j.ok) {
          setModels(j.models);
          if (j.default) setModel(j.default);
        }
      })
      .catch(() => {});
  }, [loadHistory]);

  // Snap aspect ratio to one supported by the current model
  useEffect(() => {
    const allowed = models[model]?.aspectRatios;
    if (allowed && !allowed.includes(aspectRatio)) {
      setAspectRatio(allowed[0]);
    }
  }, [model, models, aspectRatio]);

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault();
    if (!prompt.trim() || generating) return;
    setGenerating(true);
    setError(null);
    setLatest(null);
    try {
      const res = await fetch(`${API}/api/generate-image`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          prompt: prompt.trim(),
          aspectRatio,
          slug: slug.trim() || undefined,
          model,
        }),
      });
      const json = await res.json();
      if (!json.ok) throw new Error(json.error || "Generation failed");
      setLatest(json);
      loadHistory();
    } catch (err) {
      setError(String((err as Error).message));
    } finally {
      setGenerating(false);
    }
  }

  async function handleDelete(s: string) {
    if (!confirm(`Delete "${s}"?`)) return;
    try {
      const res = await fetch(`${API}/api/generated-images/${s}`, { method: "DELETE" });
      const json = await res.json();
      if (!json.ok) throw new Error(json.error);
      loadHistory();
    } catch (err) {
      alert(`Delete failed: ${(err as Error).message}`);
    }
  }

  function copy(text: string) {
    navigator.clipboard.writeText(text);
  }

  return (
    <div className="flex h-full flex-col bg-zinc-950 text-zinc-100">
      <div className="flex-1 overflow-y-auto overscroll-contain p-8">
        <div className="mx-auto" style={{ maxWidth: 1200 }}>
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold mb-1">Image Generator</h1>
            <p className="text-sm text-zinc-500">
              Gemini 3 Pro Image · saves to <code className="text-zinc-400">public/generated/</code>
            </p>
          </div>

          {/* Two-col: form left, preview right */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Form */}
            <form onSubmit={handleGenerate} className="space-y-5">
              <div>
                <label className="block text-[11px] font-medium uppercase tracking-[0.18em] text-zinc-500 mb-2">
                  Prompt
                </label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  rows={6}
                  placeholder="Describe the image — style, subject, palette, mood, composition…"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3.5 text-[14px] text-zinc-100 placeholder:text-zinc-600 outline-none focus:border-zinc-600 transition-colors leading-relaxed resize-y"
                />
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {SAMPLE_PROMPTS.map((p, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setPrompt(p)}
                      className="text-[11px] px-2 py-1 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-500 hover:text-zinc-300 hover:border-zinc-700 transition-colors"
                    >
                      Sample {i + 1}
                    </button>
                  ))}
                </div>
              </div>

              {/* Model selector — radio cards */}
              <div>
                <label className="block text-[11px] font-medium uppercase tracking-[0.18em] text-zinc-500 mb-2">
                  Model
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(models).map(([id, m]) => {
                    const active = id === model;
                    return (
                      <button
                        key={id}
                        type="button"
                        onClick={() => setModel(id)}
                        className={`text-left rounded-lg border p-3 transition-colors ${
                          active
                            ? "bg-zinc-800/60 border-zinc-600 text-zinc-100"
                            : "bg-zinc-900 border-zinc-800 text-zinc-300 hover:border-zinc-700"
                        }`}
                      >
                        <div className="flex items-baseline justify-between gap-2 mb-1">
                          <span className="text-[13px] font-medium">{m.name}</span>
                          <span className="text-[11px] text-zinc-500 font-mono">${m.pricePerImage.toFixed(3)}</span>
                        </div>
                        <span className="block text-[11px] text-zinc-500 leading-relaxed">{m.description}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium uppercase tracking-[0.18em] text-zinc-500 mb-2">
                    Aspect ratio
                  </label>
                  <div className="flex flex-wrap gap-1">
                    {(models[model]?.aspectRatios || (model.startsWith("imagen") ? ASPECTS_IMAGEN : ASPECTS_GEMINI)).map((a) => (
                      <button
                        key={a}
                        type="button"
                        onClick={() => setAspectRatio(a)}
                        className={`text-[12px] px-2.5 py-1.5 rounded-md border transition-colors ${
                          aspectRatio === a
                            ? "bg-zinc-800 border-zinc-700 text-zinc-100"
                            : "bg-zinc-900 border-zinc-800 text-zinc-500 hover:text-zinc-300"
                        }`}
                      >
                        {a}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-medium uppercase tracking-[0.18em] text-zinc-500 mb-2">
                    Slug (optional)
                  </label>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="auto-generated if empty"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-[13px] text-zinc-100 placeholder:text-zinc-600 outline-none focus:border-zinc-600 transition-colors font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="submit"
                  disabled={!prompt.trim() || generating}
                  className="px-5 py-2.5 rounded-lg bg-blue-500 text-white text-[13px] font-medium hover:bg-blue-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors inline-flex items-center gap-2"
                >
                  {generating ? (
                    <>
                      <span className="inline-block h-3 w-3 rounded-full bg-white/40 animate-pulse" />
                      Generating…
                    </>
                  ) : (
                    <>
                      <span>✨</span> Generate
                    </>
                  )}
                </button>
                <span className="text-[11px] text-zinc-600">
                  ~20s
                  {models[model] && ` · ~$${models[model].pricePerImage.toFixed(3)} per image`}
                </span>
              </div>

              {error && (
                <div className="rounded-lg bg-red-500/10 border border-red-500/20 px-3 py-2.5 text-[12px] text-red-400">
                  {error}
                </div>
              )}
            </form>

            {/* Preview area */}
            <div
              className="rounded-xl border border-zinc-800 bg-zinc-900/50 overflow-hidden flex items-center justify-center"
              style={{ minHeight: 320 }}
            >
              {generating ? (
                <div className="text-[12px] text-zinc-500 flex flex-col items-center gap-3">
                  <div className="h-8 w-8 rounded-full border-2 border-zinc-700 border-t-blue-400 animate-spin" />
                  <span>Asking the muse…</span>
                </div>
              ) : latest ? (
                <div className="w-full">
                  <img src={latest.url} alt="" className="w-full block" />
                  <div className="p-3 bg-zinc-950 border-t border-zinc-800 flex items-center justify-between">
                    <code className="text-[11px] text-zinc-400">{latest.url}</code>
                    <button
                      onClick={() => copy(latest.url)}
                      className="text-[11px] px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300"
                    >
                      Copy URL
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-[12px] text-zinc-600 text-center px-6">
                  Generated image will appear here
                </div>
              )}
            </div>
          </div>

          {/* History */}
          <div>
            <div className="flex items-baseline justify-between mb-4">
              <h2 className="text-[13px] font-semibold uppercase tracking-[0.18em] text-zinc-400">
                Recent
              </h2>
              <span className="text-[11px] text-zinc-600">{history.length} images</span>
            </div>

            {history.length === 0 ? (
              <div className="text-center py-12 text-[12px] text-zinc-600">
                No generated images yet
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {history.map((img) => (
                  <div
                    key={img.slug}
                    className="group relative rounded-lg overflow-hidden border border-zinc-800 bg-zinc-900 hover:border-zinc-700 transition-colors"
                  >
                    <img
                      src={img.url}
                      alt=""
                      className="w-full aspect-[16/10] object-cover"
                      loading="lazy"
                    />
                    <div className="p-2.5 border-t border-zinc-800">
                      <code className="block text-[11px] text-zinc-300 truncate" title={img.slug}>
                        {img.slug}
                      </code>
                      <span className="block text-[10px] text-zinc-600 mt-0.5">
                        {new Date(img.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => copy(img.url)}
                        title="Copy URL"
                        className="h-7 px-2 rounded-md bg-black/70 backdrop-blur border border-white/10 text-[10px] text-white/80 hover:bg-black/90"
                      >
                        Copy
                      </button>
                      <button
                        onClick={() => handleDelete(img.slug)}
                        title="Delete"
                        className="h-7 w-7 rounded-md bg-black/70 backdrop-blur border border-white/10 text-white/80 hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/30 flex items-center justify-center"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
