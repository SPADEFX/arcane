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

// React.forwardRef and React.memo wrap components in objects with a $$typeof
// symbol. Plain function components are functions. Recognize all three so we
// don't reject CTASection (forwardRef), HeroAurora (forwardRef), etc.
function isReactComponent(v: unknown): boolean {
  if (typeof v === "function") return true;
  if (v && typeof v === "object") {
    const sym = (v as { $$typeof?: symbol }).$$typeof;
    if (typeof sym === "symbol") {
      const desc = sym.description || "";
      return desc.includes("react.forward_ref") || desc.includes("react.memo") || desc.includes("react.lazy");
    }
  }
  return false;
}

/**
 * Load a component by slug. Returns the default export or first named export.
 */
export async function loadComponent(slug: string): Promise<React.ComponentType<any> | null> {
  const loader = loaderMap[slug];
  if (!loader) return null;
  try {
    const mod = await loader();
    if (mod.default && isReactComponent(mod.default)) return mod.default as React.ComponentType<any>;
    for (const [key, val] of Object.entries(mod)) {
      if (key[0] !== key[0].toUpperCase()) continue;
      if (isReactComponent(val)) return val as React.ComponentType<any>;
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
