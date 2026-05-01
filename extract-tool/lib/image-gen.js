/**
 * Server-side image generation via Google AI API.
 *
 * Supports two model families behind one wrapper:
 *   1. Gemini-image (Nano Banana / Nano Banana Pro)  → :generateContent
 *   2. Imagen 4 (Standard / Ultra / Fast)            → :predict
 *
 * The two have different request/response shapes, so we detect by model id
 * prefix and dispatch.
 */
const fs = require("fs");
const path = require("path");

/** Public catalogue used by the UI selector. */
const MODELS = {
  "gemini-3-pro-image-preview": {
    name: "Nano Banana Pro",
    description: "Illustrations · characters · text-in-image · hand-drawn",
    pricePerImage: 0.134,
    provider: "google",
    family: "gemini",
    type: "image",
    aspectRatios: ["1:1", "16:9", "4:5", "9:16", "21:9"],
    supportsImageInput: true,
  },
  "gemini-2.5-flash-image": {
    name: "Nano Banana",
    description: "Cheap drafts · ~3× cheaper than Pro",
    pricePerImage: 0.039,
    provider: "google",
    family: "gemini",
    type: "image",
    aspectRatios: ["1:1", "16:9", "4:5", "9:16", "21:9"],
    supportsImageInput: true,
  },
  "imagen-4.0-ultra-generate-001": {
    name: "Imagen 4 Ultra",
    description: "Photorealism · cinematic photography · products",
    pricePerImage: 0.06,
    provider: "google",
    family: "imagen",
    type: "image",
    aspectRatios: ["1:1", "16:9", "4:3", "3:4", "9:16"],
    supportsImageInput: false,
  },
  "imagen-4.0-generate-001": {
    name: "Imagen 4",
    description: "Standard photoreal · cheaper than Ultra",
    pricePerImage: 0.04,
    provider: "google",
    family: "imagen",
    type: "image",
    aspectRatios: ["1:1", "16:9", "4:3", "3:4", "9:16"],
    supportsImageInput: false,
  },
};

const DEFAULT_MODEL = "gemini-3-pro-image-preview";

function getGeminiKey() {
  if (process.env.GEMINI_API_KEY) return process.env.GEMINI_API_KEY;

  const candidates = [
    path.join(__dirname, "..", "..", ".env.image"),
    path.join(__dirname, "..", "..", ".env"),
    path.join(process.env.HOME || "", "uilibrary/apps/builder/.env"),
  ];
  for (const file of candidates) {
    try {
      if (!fs.existsSync(file)) continue;
      const content = fs.readFileSync(file, "utf8");
      const m = content.match(/GEMINI_API_KEY=(.+)/);
      if (m) return m[1].trim();
    } catch (e) {}
  }
  return null;
}

/**
 * Generate one image from a prompt.
 * @param {object} opts
 * @param {string} opts.prompt
 * @param {string} [opts.aspectRatio="16:9"]
 * @param {string} [opts.model] — see MODELS catalogue above
 * @param {string} [opts.referenceImageBase64] — base64 PNG (no data: prefix);
 *   when provided + model.supportsImageInput, the prompt edits/varies it
 * @returns {Promise<{ok:true, base64:string, model:string} | {ok:false, error:string}>}
 */
async function generateImage({ prompt, aspectRatio = "16:9", model = DEFAULT_MODEL, referenceImageBase64 }) {
  const key = getGeminiKey();
  if (!key) return { ok: false, error: "GEMINI_API_KEY not set (env or .env.image)" };
  if (!prompt || typeof prompt !== "string") return { ok: false, error: "missing prompt" };

  const meta = MODELS[model];
  if (!meta) return { ok: false, error: `unknown model: ${model}` };

  // Imagen — :predict endpoint, instances/parameters body, predictions response
  if (meta.family === "imagen") {
    const body = JSON.stringify({
      instances: [{ prompt }],
      parameters: { aspectRatio, sampleCount: 1 },
    });
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:predict?key=${key}`,
        { method: "POST", headers: { "content-type": "application/json" }, body },
      );
      if (!res.ok) {
        const errText = await res.text();
        return { ok: false, error: `HTTP ${res.status}: ${errText.slice(0, 400)}` };
      }
      const json = await res.json();
      const b64 = json.predictions?.[0]?.bytesBase64Encoded;
      if (!b64) return { ok: false, error: "no image data in Imagen response" };
      return { ok: true, base64: b64, model };
    } catch (e) {
      return { ok: false, error: String(e.message || e) };
    }
  }

  // Gemini-image — :generateContent endpoint.
  // Image-to-image: prepend the reference image as inlineData in `parts`.
  const parts = [];
  if (referenceImageBase64 && meta.supportsImageInput) {
    parts.push({
      inlineData: { mimeType: "image/png", data: referenceImageBase64 },
    });
  }
  parts.push({ text: prompt });

  const body = JSON.stringify({
    contents: [{ parts }],
    generationConfig: {
      responseModalities: ["IMAGE"],
      imageConfig: { aspectRatio },
    },
  });
  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`,
      { method: "POST", headers: { "content-type": "application/json" }, body },
    );
    if (!res.ok) {
      const errText = await res.text();
      return { ok: false, error: `HTTP ${res.status}: ${errText.slice(0, 400)}` };
    }
    const json = await res.json();
    const part = json.candidates?.[0]?.content?.parts?.find((p) => p.inlineData);
    const b64 = part?.inlineData?.data;
    if (!b64) return { ok: false, error: "no image data in Gemini response" };
    return { ok: true, base64: b64, model };
  } catch (e) {
    return { ok: false, error: String(e.message || e) };
  }
}

module.exports = { generateImage, getGeminiKey, MODELS, DEFAULT_MODEL };
