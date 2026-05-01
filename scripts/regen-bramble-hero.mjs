/**
 * Regenerate the Bramble hero with TRANSPARENT background so it blends
 * into any page color (no halo, no PNG paper-tint mismatch).
 */
import { writeFileSync, readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const env = readFileSync(join(ROOT, ".env.image"), "utf8");
const KEY = env.match(/GEMINI_API_KEY=(.+)/)?.[1]?.trim();
const MODEL = "gemini-3-pro-image-preview";

const PROMPT = `Hand-drawn illustration on a SOLID UNIFORM CREAM BACKGROUND of exact hex color #fbfaf9. The background is a single flat color #fbfaf9 covering the entire frame edge to edge. NO checker pattern, NO transparency markers, NO paper texture, NO gradient — just a clean solid #fbfaf9 fill behind the subjects. Four wobbly blob characters with stick-figure arms and legs and big expressive eyes are standing in a row, each holding a small folded paper letter or envelope, smiling at each other. Each character is a different vivid primary color: warm electric orange (#e8643c), grass green (#7ab26b), sky blue (#6da7c4), butter yellow (#f6c95a). Confident hand-drawn ink outlines around 2 pixels, slightly imperfect line quality like a sketch. A few small abstract decorative marks (a tiny outlined star in coral, a small heart in pink, a swirl in muted teal) float between them. Editorial illustration style, Pixar storyboard meets hand-drawn greeting card. The frame composition leaves generous negative space at the top, with characters in the lower-middle. No text, no logos, no UI elements, no checker patterns, no transparency artifacts.`;

async function main() {
  console.log("🎨 Regenerating bramble-hero with transparent bg...");
  const t0 = Date.now();

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${KEY}`,
    {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: PROMPT }] }],
        generationConfig: {
          responseModalities: ["IMAGE"],
          imageConfig: { aspectRatio: "16:9" },
        },
      }),
    },
  );

  if (!res.ok) {
    console.log(`✗ HTTP ${res.status}: ${(await res.text()).slice(0, 300)}`);
    return;
  }

  const json = await res.json();
  const part = json.candidates?.[0]?.content?.parts?.find((p) => p.inlineData);
  const b64 = part?.inlineData?.data;
  if (!b64) { console.log("✗ no image data"); return; }

  const out = join(ROOT, "public/generated/bramble-hero-v2.png");
  writeFileSync(out, Buffer.from(b64, "base64"));
  console.log(`✓ saved → ${out} (${((Date.now() - t0) / 1000).toFixed(1)}s)`);
}

main().catch(console.error);
