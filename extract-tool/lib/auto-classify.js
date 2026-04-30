// Auto-classify extracted components using Claude Haiku with vision.
// Sends screenshot + truncated HTML, gets back: name, category, description, tags.
//
// Cost: ~$0.001 per extract with claude-haiku-4-5 (Oct 2025).
// Falls back gracefully if ANTHROPIC_API_KEY is missing or call fails.

const https = require("https");

const API_HOST = "api.anthropic.com";
const API_PATH = "/v1/messages";
const MODEL = "claude-haiku-4-5-20251001";

const VALID_CATEGORIES = [
  "hero",
  "nav",
  "footer",
  "pricing",
  "cta",
  "faq",
  "feature",
  "testimonials",
  "content",
  "other",
];

function getApiKey() {
  return process.env.ANTHROPIC_API_KEY || null;
}

const SYSTEM_PROMPT = `You categorize web sections for a personal component library.

Given a screenshot and the section's HTML, return STRICT JSON only (no prose, no markdown fences):
{
  "name": "<3-6 word PascalCase-friendly name>",
  "slug": "<url-safe-lowercase-slug>",
  "category": "<one of: hero|nav|footer|pricing|cta|faq|feature|testimonials|content|other>",
  "description": "<one short sentence, max 18 words>",
  "tags": ["<3-7 lowercase descriptive tags>"]
}

Rules:
- "name" should describe what makes this section distinct (e.g., "Stripe Hero Gradient", "Linear Pricing Toggle")
- "slug" must match name (kebab-case, ascii only, no spaces)
- "category" picks the BEST single match from the allowed list
- "tags" describe visual style + content type (e.g., ["dark","centered","gradient","saas","testimonials"])
- Output JSON only. No surrounding text.`;

/**
 * Classify an extracted component using Claude Haiku with vision.
 *
 * @param {object} input
 * @param {string} input.screenshotBase64 — base64 PNG (no data: prefix)
 * @param {string} input.html — raw HTML (will be truncated to ~2KB)
 * @param {string} [input.sourceUrl] — origin URL hint
 * @returns {Promise<{name,slug,category,description,tags}|null>}
 */
async function classify({ screenshotBase64, html, sourceUrl }) {
  const apiKey = getApiKey();
  if (!apiKey) return null;
  if (!screenshotBase64) return null;

  const trimmedHtml = (html || "").slice(0, 2000);
  const userText =
    (sourceUrl ? `Source URL: ${sourceUrl}\n\n` : "") +
    `HTML (truncated):\n${trimmedHtml}\n\nReturn JSON only.`;

  const body = JSON.stringify({
    model: MODEL,
    max_tokens: 500,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "image",
            source: { type: "base64", media_type: "image/png", data: screenshotBase64 },
          },
          { type: "text", text: userText },
        ],
      },
    ],
  });

  try {
    const text = await new Promise((resolve, reject) => {
      const req = https.request(
        {
          hostname: API_HOST,
          path: API_PATH,
          method: "POST",
          headers: {
            "content-type": "application/json",
            "x-api-key": apiKey,
            "anthropic-version": "2023-06-01",
            "content-length": Buffer.byteLength(body),
          },
        },
        (res) => {
          let data = "";
          res.on("data", (c) => (data += c));
          res.on("end", () => {
            try {
              const json = JSON.parse(data);
              if (json.error) return reject(new Error(json.error.message || JSON.stringify(json.error)));
              const t = (json.content || []).map((b) => b.text || "").join("");
              resolve(t);
            } catch (e) {
              reject(e);
            }
          });
        },
      );
      req.on("error", reject);
      req.setTimeout(15000, () => {
        req.destroy();
        reject(new Error("auto-classify timeout"));
      });
      req.write(body);
      req.end();
    });

    return parseAndValidate(text);
  } catch (e) {
    console.warn("[auto-classify] failed:", e.message);
    return null;
  }
}

function parseAndValidate(text) {
  if (!text) return null;
  // Strip markdown fences if model added them despite instructions
  const cleaned = text
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/, "");

  let obj;
  try {
    obj = JSON.parse(cleaned);
  } catch {
    return null;
  }

  if (typeof obj !== "object" || !obj) return null;

  const name = typeof obj.name === "string" ? obj.name.trim() : "";
  const slug = typeof obj.slug === "string" ? obj.slug.trim().toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/^-+|-+$/g, "") : "";
  const category = VALID_CATEGORIES.includes(obj.category) ? obj.category : "other";
  const description = typeof obj.description === "string" ? obj.description.trim().slice(0, 200) : "";
  const tags = Array.isArray(obj.tags)
    ? obj.tags.filter((t) => typeof t === "string").map((t) => t.trim().toLowerCase()).filter(Boolean).slice(0, 7)
    : [];

  if (!name || !slug) return null;
  return { name, slug, category, description, tags };
}

module.exports = { classify, VALID_CATEGORIES };
