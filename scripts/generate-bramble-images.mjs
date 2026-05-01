/**
 * Generate the Bramble hero imagery with Gemini 3 Pro Image (Nano Banana).
 * Adapted from /Users/arthurbossuyt/Projects/car-hero/generate-images.mjs
 *
 * Usage:  node scripts/generate-bramble-images.mjs
 */
import { writeFileSync, readFileSync, mkdirSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = join(__dirname, "..");
const OUT = join(ROOT, "public/generated");
mkdirSync(OUT, { recursive: true });

const env = readFileSync(join(ROOT, ".env.image"), "utf8");
const KEY = env.match(/GEMINI_API_KEY=(.+)/)?.[1]?.trim();
if (!KEY) throw new Error("GEMINI_API_KEY missing");
const MODEL = "gemini-3-pro-image-preview";

/* ── Bramble visual brief ─────────────────────────────────────────────
 *
 *   Brand: Bramble — weekly check-in app for close friends.
 *   Aesthetic family: Family / Saturn / cream-fintech, but with a slightly
 *   more handmade, paper-cut feel. Warm cream canvas (#fbfaf9), single
 *   dark moment, vibrant primary fills on illustrations only, hand-drawn
 *   ink outlines. Wobbly characters, expressive but not childish — adult
 *   warmth. Pixar storyboard meets a personal letter.
 *
 *   Hard rules carried into every prompt:
 *     - cream/off-white background (#fbfaf9), never pure white
 *     - vivid primary fills: warm orange, grass green, sky blue, butter yellow,
 *       bubblegum pink — never grayscale
 *     - hand-drawn ink outlines (~2px), confident not jittery
 *     - flat illustration, no photoreal, no 3D rendering
 *     - generous negative space, character-driven
 *     - no text, no logos, no UI
 * ───────────────────────────────────────────────────────────────────── */

const IMAGES = [
  {
    name: "bramble-hero",
    aspect: "16:9",
    prompt: `Hand-drawn illustration in a warm Pixar-storyboard style on a cream off-white paper background (#fbfaf9 with subtle paper grain). Four wobbly blob characters with stick-figure arms and legs and big expressive eyes are sitting in a loose circle, each holding a small folded paper letter. Each character is a different vivid primary color: warm electric orange, grass green, sky blue, butter yellow. Confident hand-drawn ink outlines around 2 pixels, slightly imperfect line quality like a sketch. Generous negative space around the group. A few small abstract decorative marks (a tiny star, a heart, a swirl) float between them in different primary colors. Camera framing: slight high-angle, the group centered with breathing room. Editorial poster quality. No text, no logos, no UI elements, no photoreal rendering. Flat illustration, paper-cut warmth.`,
  },
  {
    name: "bramble-thought",
    aspect: "1:1",
    prompt: `Hand-drawn illustration on a cream off-white paper background (#fbfaf9 with subtle paper grain). A single wobbly blob character in warm electric orange (#ff6a3d), with stick-figure legs and a bashful happy expression, looking up. Above its head, a soft cloud-shaped thought bubble drawn in confident hand-drawn ink, containing a single small heart icon in bubblegum pink. Hand-drawn ink outlines around 2 pixels, deliberate but slightly imperfect. Centered composition, generous negative space. No text, no logos, no UI. Flat illustration in Pixar-storyboard style, warm and intimate.`,
  },
  {
    name: "bramble-hands",
    aspect: "4:5",
    prompt: `Hand-drawn illustration on a cream off-white paper background (#fbfaf9 with subtle paper grain). Two stylized hands holding a small smartphone, drawn in a flat paper-cut style with confident ink outlines. The phone screen shows a soft abstract message bubble in butter yellow (#ffc83d) with a tiny grass-green smiley dot. Skin tones rendered as warm beige flat fills. The hands are drawn with charming imperfection, slightly cartoony fingers. Around the hands, a few decorative ink swirls and dots in primary colors (sky blue, warm orange) float as ambient marks. No text on the screen, no logos, no UI chrome. Editorial illustration quality, Pixar storyboard meets handmade greeting card.`,
  },
  {
    name: "bramble-paper",
    aspect: "16:9",
    prompt: `Abstract atmospheric texture: warm cream off-white paper (#fbfaf9 base), gentle hand-painted watercolor washes in soft peach, butter yellow, and bubblegum pink at very low opacity. Scattered tiny ink dots and small organic shapes — dotted circles, brief curve marks, a few small grass-green leaves drawn in a confident hand-drawn line. Subtle paper grain throughout. Composition is loose, evenly distributed across the frame, suitable as a section background that does not compete with foreground content. No characters, no text, no logos, no faces. Watercolor-and-ink hand-illustrated paper, generous negative space.`,
  },
];

async function generate(img) {
  console.log(`🎨 ${img.name} (${img.aspect})...`);
  const t0 = Date.now();

  const body = {
    contents: [{ parts: [{ text: img.prompt }] }],
    generationConfig: {
      responseModalities: ["IMAGE"],
      imageConfig: { aspectRatio: img.aspect },
    },
  };

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${KEY}`,
    {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    },
  );

  if (!res.ok) {
    const err = await res.text();
    console.log(`  ✗ HTTP ${res.status}: ${err.slice(0, 300)}`);
    return false;
  }

  const json = await res.json();
  const part = json.candidates?.[0]?.content?.parts?.find((p) => p.inlineData);
  const b64 = part?.inlineData?.data;
  if (!b64) {
    console.log(`  ✗ no image data in response`);
    return false;
  }

  const out = join(OUT, `${img.name}.png`);
  writeFileSync(out, Buffer.from(b64, "base64"));
  console.log(`  ✓ saved → ${out} (${((Date.now() - t0) / 1000).toFixed(1)}s)`);
  return true;
}

async function main() {
  let ok = 0;
  for (const img of IMAGES) {
    if (await generate(img)) ok++;
  }
  console.log(`\nDone. ${ok}/${IMAGES.length} generated.`);
}

main().catch((e) => { console.error(e); process.exit(1); });
