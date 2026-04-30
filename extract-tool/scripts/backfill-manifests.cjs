#!/usr/bin/env node
/**
 * Backfill manifests for extracted components that don't have one yet.
 * Parses the existing TSX file to recover the props interface, then writes
 * a manifest.json sidecar.
 *
 * Usage: node extract-tool/scripts/backfill-manifests.cjs
 */
const fs = require("fs");
const path = require("path");

const COMPONENTS_DIR = path.join(__dirname, "..", "..", "ui-library", "components");

function pascal(slug) {
  return slug
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[-_]+/g, " ")
    .split(" ")
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}

/**
 * Parse the props interface from a TSX file.
 * Looks for `export interface XxxProps extends ... { ... }` block,
 * extracts each "/** label *\/ propName?: tsType;" line.
 */
function parsePropsFromTsx(tsxContent) {
  const interfaceMatch = tsxContent.match(/export interface \w+Props[^{]*\{([\s\S]*?)\n\}/);
  if (!interfaceMatch) return [];

  const body = interfaceMatch[1];
  const props = [];
  // Match lines like:
  //   /** Heading 3 */
  //   heading2?: string;
  const propRegex = /\/\*\*\s*(.+?)\s*\*\/\s*\n\s*(\w+)\??:\s*([^;]+);/g;
  let m;
  while ((m = propRegex.exec(body)) !== null) {
    const [, label, name, tsType] = m;
    const t = tsType.trim();
    let type = "text";
    if (t === "boolean") type = "boolean";
    else if (label.toLowerCase().includes("image") || name.toLowerCase().includes("src") || name.toLowerCase().includes("img")) type = "image";
    else if (label.toLowerCase().includes("paragraph") || label.toLowerCase().includes("description")) type = "textarea";

    props.push({
      name,
      label,
      type,
      tsType: t,
    });
  }
  return props;
}

function main() {
  const files = fs.readdirSync(COMPONENTS_DIR);
  const extractedTsx = files.filter((f) => f.startsWith("extracted-") && f.endsWith(".tsx"));

  let written = 0;
  let skipped = 0;

  for (const tsxFile of extractedTsx) {
    const slug = tsxFile.replace(/^extracted-/, "").replace(/\.tsx$/, "");
    const manifestPath = path.join(COMPONENTS_DIR, `extracted-${slug}.json`);

    if (fs.existsSync(manifestPath)) {
      skipped++;
      continue;
    }

    const tsxPath = path.join(COMPONENTS_DIR, tsxFile);
    const tsxContent = fs.readFileSync(tsxPath, "utf8");
    const propSchema = parsePropsFromTsx(tsxContent);

    const hasHtml = fs.existsSync(path.join(COMPONENTS_DIR, `extracted-${slug}.html`));
    const hasCss = fs.existsSync(path.join(COMPONENTS_DIR, `extracted-${slug}.css`));
    const hasPng = fs.existsSync(path.join(COMPONENTS_DIR, `extracted-${slug}.png`));

    // Try to recover capturedAt from file mtime
    const stats = fs.statSync(tsxPath);

    const manifest = {
      schemaVersion: 1,
      slug,
      name: pascal(slug),
      version: 1,
      description: "",
      category: "other",
      tags: ["extracted", "backfilled"],
      sourceUrl: "",
      capturedAt: stats.mtime.toISOString(),
      propSchema,
      defaultProps: {},
      files: {
        component: `extracted-${slug}.tsx`,
        html: hasHtml ? `extracted-${slug}.html` : undefined,
        css: hasCss ? `extracted-${slug}.css` : undefined,
        thumbnail: hasPng ? `extracted-${slug}.png` : undefined,
      },
    };

    // Atomic write
    const tmpPath = manifestPath + ".tmp";
    fs.writeFileSync(tmpPath, JSON.stringify(manifest, null, 2));
    fs.renameSync(tmpPath, manifestPath);

    console.log(`✅ wrote extracted-${slug}.json (${propSchema.length} props)`);
    written++;
  }

  console.log(`\nDone. ${written} written, ${skipped} skipped (already had manifest).`);
}

main();
