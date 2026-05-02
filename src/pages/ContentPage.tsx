/**
 * Content Studio — unified image + video generation.
 *
 * Two providers exposed:
 *   - Google (Gemini Nano Banana / Imagen 4) for images
 *   - fal.ai (LTX, Kling) for video + image-to-video
 *
 * Sticky header with per-provider brand cards + live usage stats.
 * Tabs route the form to the right model family.
 */
import { useEffect, useMemo, useState, useCallback } from "react";

const API = "http://localhost:3000";

interface Model {
  name: string;
  description: string;
  provider: "google" | "fal";
  family: string;
  type: "image" | "video" | "image-to-video" | "image-to-image";
  pricePerImage?: number;
  pricePerVideo?: number;
  aspectRatios: string[];
  supportsImageInput?: boolean;
  durationSec?: number;
}

interface UsageBucket {
  count: number;
  cost: number;
}

interface Usage {
  total: UsageBucket;
  today: UsageBucket;
  thisMonth: UsageBucket;
  byProvider: Record<string, UsageBucket>;
  byModel: Record<string, UsageBucket>;
  byDay: Record<string, UsageBucket>;
  recent: any[];
}

interface GeneratedAsset {
  slug: string;
  url: string;
  type?: string;
  provider?: string;
  model?: string;
  prompt?: string;
  aspectRatio?: string;
  estimatedCost?: number;
  createdAt: string;
}

type Tab = "image" | "video" | "image-to-video" | "image-to-image";

const TABS: { id: Tab; label: string; modelTypes: string[] }[] = [
  { id: "image", label: "Image", modelTypes: ["image"] },
  { id: "video", label: "Video", modelTypes: ["video"] },
  { id: "image-to-video", label: "Image → Video", modelTypes: ["image-to-video"] },
  { id: "image-to-image", label: "Edit Image", modelTypes: ["image"] }, // uses image models with sourceImage
];

/* ─── Provider brand colors ──────────────────────────────────────────── */
const BRAND = {
  google: {
    label: "Google AI",
    accent: "#4285f4",
    accentSoft: "#4285f422",
    gradient: "linear-gradient(135deg, #4285f4 0%, #ea4335 25%, #fbbc04 50%, #34a853 100%)",
  },
  fal: {
    label: "fal.ai",
    accent: "#EC0648",
    accentSoft: "#EC064822",
    gradient: "linear-gradient(135deg, #ffffff 0%, #ffffff 100%)",
  },
};

export function ContentPage() {
  const [tab, setTab] = useState<Tab>("image");
  const [models, setModels] = useState<Record<string, Model>>({});
  const [usage, setUsage] = useState<Usage | null>(null);
  const [history, setHistory] = useState<GeneratedAsset[]>([]);
  const [model, setModel] = useState<string>("gemini-3-pro-image-preview");
  const [prompt, setPrompt] = useState("");
  const [aspectRatio, setAspectRatio] = useState("16:9");
  const [slug, setSlug] = useState("");
  const [sourceImageSlug, setSourceImageSlug] = useState<string>("");
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [latest, setLatest] = useState<GeneratedAsset | null>(null);

  const refresh = useCallback(async () => {
    try {
      const [modelsRes, usageRes, histRes] = await Promise.all([
        fetch(`${API}/api/models`).then((r) => r.json()),
        fetch(`${API}/api/usage`).then((r) => r.json()),
        fetch(`${API}/api/generated-images`).then((r) => r.json()),
      ]);
      if (modelsRes.ok) setModels(modelsRes.models);
      if (usageRes.ok) setUsage(usageRes.usage);
      if (histRes.ok) setHistory(histRes.images);
    } catch (e) {
      // server probably down
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  /* When tab changes, pick the first model of that type and snap aspect */
  useEffect(() => {
    const tabConfig = TABS.find((t) => t.id === tab);
    if (!tabConfig) return;
    const candidates = Object.entries(models).filter(([, m]) => tabConfig.modelTypes.includes(m.type));
    if (candidates.length === 0) return;
    if (!candidates.some(([id]) => id === model)) {
      setModel(candidates[0][0]);
    }
  }, [tab, models, model]);

  useEffect(() => {
    const allowed = models[model]?.aspectRatios;
    if (allowed && allowed[0] !== "any" && !allowed.includes(aspectRatio)) {
      setAspectRatio(allowed[0]);
    }
  }, [model, models, aspectRatio]);

  const filteredModels = useMemo(() => {
    const tabConfig = TABS.find((t) => t.id === tab);
    if (!tabConfig) return [];
    return Object.entries(models).filter(([, m]) => tabConfig.modelTypes.includes(m.type));
  }, [tab, models]);

  const sourceImageOptions = useMemo(() => {
    return history.filter((h) => !h.type || h.type === "image" || h.type === "image-to-image");
  }, [history]);

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault();
    if (!prompt.trim() || generating) return;
    if ((tab === "image-to-video" || tab === "image-to-image") && !sourceImageSlug) {
      setError("Pick a source image first");
      return;
    }

    setGenerating(true);
    setError(null);
    setLatest(null);

    try {
      const res = await fetch(`${API}/api/generate`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          type: tab,
          model,
          prompt: prompt.trim(),
          aspectRatio,
          slug: slug.trim() || undefined,
          sourceImageSlug: sourceImageSlug || undefined,
        }),
      });
      const json = await res.json();
      if (!json.ok) throw new Error(json.error || "Generation failed");
      setLatest(json);
      refresh();
    } catch (err) {
      setError(String((err as Error).message));
    } finally {
      setGenerating(false);
    }
  }

  function copy(text: string) {
    navigator.clipboard.writeText(text);
  }

  async function handleDelete(s: string) {
    if (!confirm(`Delete "${s}"?`)) return;
    try {
      await fetch(`${API}/api/generated-images/${s}`, { method: "DELETE" });
      refresh();
    } catch {}
  }

  const activeModel = models[model];
  const cost = activeModel?.pricePerVideo ?? activeModel?.pricePerImage ?? 0;

  return (
    <div className="flex h-full flex-col bg-zinc-950 text-zinc-100">
      {/* ── STICKY HEADER ─────────────────────────────────────────── */}
      <ProviderHeader usage={usage} />

      <div className="flex-1 overflow-y-auto overscroll-contain">
        <div className="mx-auto p-8" style={{ maxWidth: 1280 }}>
          {/* Title */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold mb-1">Content Studio</h1>
            <p className="text-sm text-zinc-500">
              One generator · two providers · saved to <code className="text-zinc-400">public/generated/</code>
            </p>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mb-6 bg-zinc-900 border border-zinc-800 rounded-lg p-1 w-fit">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`px-3 py-1.5 text-[13px] rounded-md transition-colors ${
                  tab === t.id
                    ? "bg-zinc-800 text-zinc-100"
                    : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Form + preview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
            <form onSubmit={handleGenerate} className="space-y-5">
              {/* Source image (only for img-to-* tabs) */}
              {(tab === "image-to-video" || tab === "image-to-image") && (
                <div>
                  <label className="block text-[11px] font-medium uppercase tracking-[0.18em] text-zinc-500 mb-2">
                    Source image
                  </label>
                  {sourceImageOptions.length === 0 ? (
                    <div className="text-[12px] text-zinc-600 bg-zinc-900 border border-zinc-800 rounded-lg p-3">
                      No images generated yet — switch to "Image" tab and create one first.
                    </div>
                  ) : (
                    <div className="flex gap-2 overflow-x-auto pb-2">
                      {sourceImageOptions.slice(0, 12).map((img) => (
                        <button
                          key={img.slug}
                          type="button"
                          onClick={() => setSourceImageSlug(img.slug)}
                          className={`flex-shrink-0 rounded-md border-2 overflow-hidden transition-colors ${
                            sourceImageSlug === img.slug
                              ? "border-zinc-400"
                              : "border-zinc-800 hover:border-zinc-700"
                          }`}
                          style={{ width: 80, height: 50 }}
                        >
                          <img src={img.url} alt="" className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Prompt */}
              <div>
                <label className="block text-[11px] font-medium uppercase tracking-[0.18em] text-zinc-500 mb-2">
                  Prompt
                </label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  rows={5}
                  placeholder={
                    tab === "video"
                      ? "Describe the video — motion, style, camera, mood…"
                      : tab === "image-to-video"
                      ? "Describe the motion — camera move, atmosphere…"
                      : tab === "image-to-image"
                      ? "Describe the edit — keep subject, change style/scene…"
                      : "Describe the image — style, subject, palette, mood, composition…"
                  }
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3.5 text-[14px] text-zinc-100 placeholder:text-zinc-600 outline-none focus:border-zinc-600 transition-colors leading-relaxed resize-y"
                />
              </div>

              {/* Model selector */}
              <div>
                <label className="block text-[11px] font-medium uppercase tracking-[0.18em] text-zinc-500 mb-2">
                  Model
                </label>
                {filteredModels.length === 0 ? (
                  <div className="text-[12px] text-zinc-600 italic">Loading models…</div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {filteredModels.map(([id, m]) => {
                      const active = id === model;
                      const brand = BRAND[m.provider] || BRAND.google;
                      const price = m.pricePerVideo ?? m.pricePerImage ?? 0;
                      return (
                        <button
                          key={id}
                          type="button"
                          onClick={() => setModel(id)}
                          className={`text-left rounded-lg border p-3 transition-colors relative ${
                            active
                              ? "bg-zinc-800/60 border-zinc-600 text-zinc-100"
                              : "bg-zinc-900 border-zinc-800 text-zinc-300 hover:border-zinc-700"
                          }`}
                          style={
                            active
                              ? { boxShadow: `0 0 0 1px ${brand.accent}55, 0 0 24px ${brand.accent}22` }
                              : {}
                          }
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <span
                              className="block w-2 h-2 rounded-full"
                              style={{ background: brand.accent }}
                            />
                            <span className="text-[13px] font-medium flex-1 truncate">{m.name}</span>
                            <span className="text-[11px] text-zinc-500 font-mono">${price.toFixed(3)}</span>
                          </div>
                          <span className="block text-[11px] text-zinc-500 leading-relaxed pl-4">
                            {m.description}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Aspect + slug */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium uppercase tracking-[0.18em] text-zinc-500 mb-2">
                    Aspect ratio
                  </label>
                  <div className="flex flex-wrap gap-1">
                    {(activeModel?.aspectRatios || []).filter((a) => a !== "any").map((a) => (
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
                    {activeModel?.aspectRatios.includes("any") && (
                      <span className="text-[11px] text-zinc-600 px-2 py-1.5">Inherits from source image</span>
                    )}
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
                    placeholder="auto if empty"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-[13px] text-zinc-100 placeholder:text-zinc-600 outline-none focus:border-zinc-600 transition-colors font-mono"
                  />
                </div>
              </div>

              {/* Submit */}
              <div className="flex items-center gap-3">
                <button
                  type="submit"
                  disabled={!prompt.trim() || generating}
                  className="px-5 py-2.5 rounded-lg text-white text-[13px] font-medium transition-colors inline-flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{
                    background: activeModel
                      ? (BRAND[activeModel.provider] || BRAND.google).accent
                      : "#3b82f6",
                  }}
                >
                  {generating ? (
                    <>
                      <span className="inline-block h-3 w-3 rounded-full bg-white/40 animate-pulse" />
                      Generating…
                    </>
                  ) : (
                    <>
                      ✨ Generate
                    </>
                  )}
                </button>
                <span className="text-[11px] text-zinc-500">
                  {tab.includes("video") ? "~30-60s" : "~15-25s"} · ~${cost.toFixed(3)}
                </span>
              </div>

              {error && (
                <div className="rounded-lg bg-red-500/10 border border-red-500/20 px-3 py-2.5 text-[12px] text-red-400">
                  {error}
                </div>
              )}
            </form>

            {/* Preview */}
            <div
              className="rounded-xl border border-zinc-800 bg-zinc-900/50 overflow-hidden flex items-center justify-center sticky top-4"
              style={{ minHeight: 360 }}
            >
              {generating ? (
                <div className="text-[12px] text-zinc-500 flex flex-col items-center gap-3">
                  <div className="h-8 w-8 rounded-full border-2 border-zinc-700 border-t-blue-400 animate-spin" />
                  <span>Asking the muse…</span>
                </div>
              ) : latest ? (
                <div className="w-full">
                  {latest.url.endsWith(".mp4") ? (
                    <video src={latest.url} className="w-full block" autoPlay loop muted playsInline />
                  ) : (
                    <img src={latest.url} alt="" className="w-full block" />
                  )}
                  <div className="p-3 bg-zinc-950 border-t border-zinc-800 flex items-center justify-between gap-3">
                    <code className="text-[11px] text-zinc-400 truncate flex-1">{latest.url}</code>
                    <span className="text-[11px] text-zinc-600 font-mono">
                      ${(latest.estimatedCost ?? 0).toFixed(3)}
                    </span>
                    <button
                      onClick={() => copy(latest.url)}
                      className="text-[11px] px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 flex-shrink-0"
                    >
                      Copy URL
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-[12px] text-zinc-600 text-center px-6">
                  Generated content will appear here
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
              <span className="text-[11px] text-zinc-600">{history.length} assets</span>
            </div>

            {history.length === 0 ? (
              <div className="text-center py-12 text-[12px] text-zinc-600">
                No content generated yet
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {history.map((img) => {
                  const isVideo = img.url.endsWith(".mp4");
                  return (
                    <div
                      key={img.slug}
                      className="group relative rounded-lg overflow-hidden border border-zinc-800 bg-zinc-900 hover:border-zinc-700 transition-colors"
                    >
                      {isVideo ? (
                        <video
                          src={img.url}
                          className="w-full aspect-[16/10] object-cover"
                          muted
                          playsInline
                          onMouseEnter={(e) => (e.currentTarget as HTMLVideoElement).play().catch(() => {})}
                          onMouseLeave={(e) => (e.currentTarget as HTMLVideoElement).pause()}
                        />
                      ) : (
                        <img
                          src={img.url}
                          alt=""
                          className="w-full aspect-[16/10] object-cover"
                          loading="lazy"
                        />
                      )}
                      <div className="p-2.5 border-t border-zinc-800 flex items-center justify-between gap-2">
                        <code className="block text-[11px] text-zinc-300 truncate" title={img.slug}>
                          {img.slug}
                        </code>
                        {isVideo && (
                          <span className="text-[9px] uppercase tracking-wider text-zinc-500 flex-shrink-0">
                            video
                          </span>
                        )}
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
                          onClick={() => setSourceImageSlug(img.slug)}
                          title="Use as source"
                          className="h-7 px-2 rounded-md bg-black/70 backdrop-blur border border-white/10 text-[10px] text-white/80 hover:bg-black/90"
                        >
                          Use
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
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Provider header — sticky brand cards with live usage ────────────── */

function ProviderHeader({ usage }: { usage: Usage | null }) {
  const google = usage?.byProvider.google || { count: 0, cost: 0 };
  const fal = usage?.byProvider.fal || { count: 0, cost: 0 };
  const total = usage?.total || { count: 0, cost: 0 };

  return (
    <div
      className="sticky top-0 z-30 border-b border-zinc-800 backdrop-blur"
      style={{
        background: "rgba(9, 9, 11, 0.85)",
      }}
    >
      <div className="mx-auto px-8 py-4 flex items-center gap-4" style={{ maxWidth: 1280 }}>
        <ProviderCard
          label="Google AI"
          accent={BRAND.google.accent}
          gradient={BRAND.google.gradient}
          stats={google}
          icon={
            <svg viewBox="0 0 48 48" width="20" height="20">
              <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
              <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
              <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
              <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
            </svg>
          }
        />

        <ProviderCard
          label="fal.ai"
          accent={BRAND.fal.accent}
          gradient={BRAND.fal.gradient}
          stats={fal}
          icon={
            <svg viewBox="0 0 1855 1855" width="20" height="20">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M1181.65 78C1212.05 78 1236.42 101.947 1239.32 131.261C1265.25 392.744 1480.07 600.836 1750.02 625.948C1780.28 628.764 1805 652.366 1805 681.816V1174.18C1805 1203.63 1780.28 1227.24 1750.02 1230.05C1480.07 1255.16 1265.25 1463.26 1239.32 1724.74C1236.42 1754.05 1212.05 1778 1181.65 1778H673.354C642.951 1778 618.585 1754.05 615.678 1724.74C589.754 1463.26 374.927 1255.16 104.984 1230.05C74.7212 1227.24 50 1203.63 50 1174.18V681.816C50 652.366 74.7213 628.764 104.984 625.948C374.927 600.836 589.754 392.744 615.678 131.261C618.585 101.946 642.951 78 673.353 78H1181.65ZM402.377 926.561C402.377 1209.41 638.826 1438.71 930.501 1438.71C1222.18 1438.71 1458.62 1209.41 1458.62 926.561C1458.62 643.709 1222.18 414.412 930.501 414.412C638.826 414.412 402.377 643.709 402.377 926.561Z"
                fill="#EC0648"
              />
            </svg>
          }
        />

        {/* Total */}
        <div className="ml-auto flex items-center gap-3 pl-4 border-l border-zinc-800">
          <div className="text-right">
            <div className="text-[10px] uppercase tracking-[0.18em] text-zinc-500 font-medium">
              Total spent
            </div>
            <div className="text-[14px] text-zinc-100 font-mono tabular-nums">
              ${total.cost.toFixed(2)}
            </div>
          </div>
          <div className="text-right border-l border-zinc-800 pl-3">
            <div className="text-[10px] uppercase tracking-[0.18em] text-zinc-500 font-medium">
              Generations
            </div>
            <div className="text-[14px] text-zinc-100 font-mono tabular-nums">
              {total.count}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProviderCard({
  label, accent, gradient, stats, icon,
}: {
  label: string;
  accent: string;
  gradient: string;
  stats: UsageBucket;
  icon: React.ReactNode;
}) {
  return (
    <div
      className="flex items-center gap-3 rounded-lg px-3 py-2 border"
      style={{
        background: `linear-gradient(135deg, ${accent}08 0%, transparent 100%)`,
        borderColor: `${accent}33`,
      }}
    >
      <div
        className="flex-shrink-0 flex items-center justify-center rounded-md"
        style={{
          width: 32,
          height: 32,
          background: gradient,
        }}
      >
        {icon}
      </div>
      <div>
        <div className="text-[11px] font-medium" style={{ color: accent }}>
          {label}
        </div>
        <div className="flex items-baseline gap-3 text-zinc-100">
          <span className="text-[12px] font-mono tabular-nums">{stats.count}</span>
          <span className="text-[10px] text-zinc-500">·</span>
          <span className="text-[12px] font-mono tabular-nums">${stats.cost.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}
