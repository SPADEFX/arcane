import type { Site, Page, Block } from "../registry/types";
import { blockMap } from "../registry/blocks";

/**
 * Generate a standalone JSX string for a site's page.
 */
export function exportPageToJSX(site: Site, page: Page): string {
  const imports = new Set<string>();
  imports.add("SiteTheme");

  for (const block of page.blocks) {
    const def = blockMap.get(block.type);
    if (def) {
      // Get the component display name
      const name = def.component.displayName || def.component.name;
      if (name) imports.add(name);
    }
  }

  const importLine = `import { ${[...imports].sort().join(", ")} } from "@uilibrary/ui";`;

  const blocksJSX = page.blocks
    .map((block) => blockToJSX(block, "        "))
    .join("\n");

  return `${importLine}

export default function ${toPascalCase(page.name)}Page() {
  return (
    <SiteTheme
      font="${site.theme.font}"
      brandColor="${site.theme.brandColor}"
      ${site.theme.dark ? "dark" : ""}
      ${site.theme.radius ? `radius="${site.theme.radius}"` : ""}
    >
      <div style={{ background: "var(--color-bg)", minHeight: "100vh" }}>
${blocksJSX}
      </div>
    </SiteTheme>
  );
}
`;
}

function blockToJSX(block: Block, indent: string): string {
  const def = blockMap.get(block.type);
  if (!def) return `${indent}{/* Unknown block: ${block.type} */}`;

  const name = def.component.displayName || def.component.name || "Unknown";
  const props = Object.entries(block.props)
    .filter(([, v]) => v !== undefined && v !== null && v !== "")
    .map(([key, value]) => {
      if (typeof value === "string") return `${key}=${JSON.stringify(value)}`;
      if (typeof value === "boolean") return value ? key : `${key}={false}`;
      return `${key}={${JSON.stringify(value)}}`;
    })
    .join(`\n${indent}  `);

  return `${indent}<${name}\n${indent}  ${props}\n${indent}/>`;
}

function toPascalCase(str: string): string {
  return str
    .replace(/[^a-zA-Z0-9]+/g, " ")
    .split(" ")
    .filter(Boolean)
    .map((w) => w[0].toUpperCase() + w.slice(1).toLowerCase())
    .join("");
}
