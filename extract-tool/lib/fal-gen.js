/**
 * Server-side fal.ai wrapper for video + image-to-video.
 * Mirrors the pattern of image-gen.js so the unified /api/generate handler
 * can dispatch by provider.
 */
const fs = require("fs");
const path = require("path");
const { fal } = require("@fal-ai/client");

/** Public catalogue used by the UI selector. */
const MODELS = {
  /* Text-to-video */
  "fal-ai/ltx-video/distilled": {
    name: "LTX Video (Distilled)",
    description: "Cheap fast video · 5s @ 768x512",
    pricePerImage: 0,
    pricePerVideo: 0.0667,
    family: "fal",
    type: "video",
    aspectRatios: ["16:9", "9:16", "1:1"],
    durationSec: 5,
  },
  "fal-ai/kling-video/v2.5-turbo-pro/text-to-video": {
    name: "Kling 2.5 Turbo Pro",
    description: "Premium video · cinematic · 5s",
    pricePerVideo: 0.35,
    family: "fal",
    type: "video",
    aspectRatios: ["16:9", "9:16", "1:1"],
    durationSec: 5,
  },

  /* Image-to-video */
  "fal-ai/ltx-video/image-to-video": {
    name: "LTX Image → Video",
    description: "Animate a still image · 5s loop · cheap",
    pricePerVideo: 0.10,
    family: "fal",
    type: "image-to-video",
    aspectRatios: ["any"],
    durationSec: 5,
  },
  "fal-ai/kling-video/v2.5-turbo-pro/image-to-video": {
    name: "Kling Image → Video Pro",
    description: "Premium image-to-video · cinematic camera moves",
    pricePerVideo: 0.35,
    family: "fal",
    type: "image-to-video",
    aspectRatios: ["any"],
    durationSec: 5,
  },
};

function getFalKey() {
  if (process.env.FAL_KEY) return process.env.FAL_KEY;
  const candidates = [
    path.join(__dirname, "..", "..", ".env.image"),
    path.join(__dirname, "..", "..", ".env"),
    path.join(__dirname, "..", ".env"),
  ];
  for (const file of candidates) {
    try {
      if (!fs.existsSync(file)) continue;
      const content = fs.readFileSync(file, "utf8");
      const m = content.match(/FAL_KEY=(.+)/);
      if (m) return m[1].trim();
    } catch (e) {}
  }
  return null;
}

let configured = false;
function ensureConfigured() {
  if (configured) return true;
  const key = getFalKey();
  if (!key) return false;
  fal.config({ credentials: key });
  configured = true;
  return true;
}

/**
 * Upload a local image file (or buffer) to fal storage so models can fetch it.
 */
async function uploadLocalImage(filePath) {
  ensureConfigured();
  const buffer = fs.readFileSync(filePath);
  const ext = path.extname(filePath).slice(1).toLowerCase() || "png";
  const blob = new Blob([buffer], { type: `image/${ext}` });
  const file = new File([blob], path.basename(filePath), { type: `image/${ext}` });
  return await fal.storage.upload(file);
}

/**
 * Run a fal model and return an asset URL (binary downloaded by caller).
 * @param {object} opts
 * @param {string} opts.prompt
 * @param {string} opts.model
 * @param {string} [opts.imageUrl]   — for image-to-video
 * @param {string} [opts.aspectRatio]
 * @returns {Promise<{ok:true, url:string, model:string, type:string} | {ok:false, error:string}>}
 */
async function generate({ prompt, model, imageUrl, aspectRatio }) {
  if (!ensureConfigured()) return { ok: false, error: "FAL_KEY not set" };
  const meta = MODELS[model];
  if (!meta) return { ok: false, error: `unknown fal model: ${model}` };

  const input = { prompt };
  if (meta.type === "image-to-video" && imageUrl) input.image_url = imageUrl;
  if (aspectRatio && aspectRatio !== "any") input.aspect_ratio = aspectRatio;

  try {
    const result = await fal.subscribe(model, { input, logs: false });
    // fal returns various shapes — try common keys
    const data = result.data || result;
    const videoUrl =
      data?.video?.url ||
      data?.images?.[0]?.url ||
      data?.image?.url ||
      data?.url;
    if (!videoUrl) return { ok: false, error: "no asset URL in fal response" };
    return { ok: true, url: videoUrl, model, type: meta.type };
  } catch (e) {
    return { ok: false, error: String(e?.message || e) };
  }
}

/**
 * Download a remote URL to a local file path. Returns true/false.
 */
async function downloadTo(url, outPath) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`download HTTP ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  const tmp = outPath + ".tmp";
  await fs.promises.writeFile(tmp, buf);
  await fs.promises.rename(tmp, outPath);
}

module.exports = { MODELS, generate, uploadLocalImage, downloadTo, getFalKey };
