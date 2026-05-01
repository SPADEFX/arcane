/**
 * Generate static PNG thumbnails for every built-in component.
 *
 * Visits /component-preview/:slug for each slug discovered in
 * src/lib/bootstrap.ts COMPONENT_META, screenshots the rendered preview,
 * and writes the PNG to ui-library/components/<slug>.png.
 *
 * Run once after major component changes:
 *   node scripts/generate-thumbnails.mjs
 *
 * Requires Studio running on :3333 (npm run dev).
 *
 * Output: PNGs are committed to git so the Library page just `<img>`s them
 * and stays fast/consistent across machines.
 */
import { chromium } from "playwright";
import { readFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

/* ── Discover all builtin slugs from bootstrap.ts ─────────────────────── */
function discoverSlugs() {
  const src = readFileSync(join(ROOT, "src/lib/bootstrap.ts"), "utf8");
  // Match `"slug-name": {` keys inside COMPONENT_META
  const slugs = new Set();
  const re = /"([a-z0-9-]+)":\s*\{[^}]*category:/g;
  let m;
  while ((m = re.exec(src)) !== null) slugs.add(m[1]);
  return [...slugs];
}

/* ── Skip purely structural / utility wrappers ────────────────────────── */
const SKIP_SLUGS = new Set([
  "smooth-scroll",
  "scroll-pin",
  "parallax-layer",
  "scroll-reveal",
  "noise-overlay",
  "site-theme",
]);

const VIEWPORT = { width: 1440, height: 900 };
const OUT_DIR = join(ROOT, "ui-library/components");

async function main() {
  mkdirSync(OUT_DIR, { recursive: true });

  const slugs = discoverSlugs().filter((s) => !SKIP_SLUGS.has(s));
  console.log(`📸 generating ${slugs.length} thumbnails…\n`);

  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: VIEWPORT, colorScheme: "dark" });

  let ok = 0;
  let failed = 0;

  for (const slug of slugs) {
    const page = await ctx.newPage();
    let status = "ok";
    try {
      const url = `http://localhost:3333/component-preview/${slug}`;
      await page.goto(url, { waitUntil: "networkidle", timeout: 15000 });
      await page.waitForTimeout(1500); // let animations settle

      // Detect render errors / utility hints surfaced by PreviewPage
      const hasError = await page.evaluate(() => {
        const txt = document.body.innerText;
        return /render error|failed to load|utility component/i.test(txt);
      });
      if (hasError) { status = "skip-error-or-utility"; failed++; continue; }

      const out = join(OUT_DIR, `${slug}.png`);
      await page.screenshot({ path: out, fullPage: false });
      ok++;
      console.log(`  ✓ ${slug}`);
    } catch (e) {
      status = "fail-" + (e?.message || "unknown");
      failed++;
      console.log(`  ✗ ${slug}  →  ${e.message}`);
    } finally {
      if (status === "skip-error-or-utility") console.log(`  ~ ${slug} (skipped)`);
      await page.close();
    }
  }

  await browser.close();
  console.log(`\n✅ ${ok} written, ${failed} skipped`);
}

main().catch((e) => { console.error(e); process.exit(1); });
