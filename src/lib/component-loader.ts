/**
 * Dynamic component loader — uses Vite's import.meta.glob to load
 * all components and sections from ui-library at runtime.
 */

// Eagerly glob all component modules
const componentModules = import.meta.glob("../../ui-library/components/*.tsx");
const sectionModules = import.meta.glob("../../ui-library/sections/*.tsx");

// Merge both
const allModules: Record<string, () => Promise<Record<string, unknown>>> = {
  ...componentModules,
  ...sectionModules,
};

// Extract slug from path: "../../ui-library/components/button.tsx" → "button"
function pathToSlug(path: string): string {
  const file = path.split("/").pop() || "";
  return file.replace(".tsx", "");
}

// Build slug → loader map
const loaderMap: Record<string, () => Promise<Record<string, unknown>>> = {};
for (const [path, loader] of Object.entries(allModules)) {
  loaderMap[pathToSlug(path)] = loader;
}

/**
 * Load a component by slug. Returns the default export or first named export.
 */
export async function loadComponent(slug: string): Promise<React.ComponentType<any> | null> {
  const loader = loaderMap[slug];
  if (!loader) return null;
  try {
    const mod = await loader();
    // Try default export first, then first named export that looks like a component
    if (mod.default && typeof mod.default === "function") return mod.default as React.ComponentType<any>;
    for (const [key, val] of Object.entries(mod)) {
      if (typeof val === "function" && key[0] === key[0].toUpperCase()) {
        return val as React.ComponentType<any>;
      }
    }
    return null;
  } catch (e) {
    console.warn(`Failed to load component "${slug}":`, e);
    return null;
  }
}

/**
 * Get all available slugs
 */
export function getAvailableSlugs(): string[] {
  return Object.keys(loaderMap);
}
