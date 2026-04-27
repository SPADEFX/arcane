export interface PropDefinition {
  name: string;
  type: "string" | "number" | "boolean" | "color" | "select" | "array" | "object" | "node";
  label: string;
  defaultValue: unknown;
  options?: { label: string; value: unknown }[];
  min?: number; max?: number; step?: number;
}

export type ComponentCategory =
  | "layout" | "hero" | "features" | "pricing" | "testimonials"
  | "cta" | "faq" | "footer" | "navigation"
  | "text-animation" | "background" | "interactive" | "card"
  | "form" | "media" | "divider" | "badge" | "3d" | "shader"
  | "section" | "extracted";

export interface ComponentDefinition {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: ComponentCategory;
  source:
    | { type: "builtin"; path: string }
    | { type: "extracted"; captureId: string }
    | { type: "shader"; shaderId: string }
    | { type: "custom" };
  code?: string;
  css?: string;
  props: PropDefinition[];
  defaultProps: Record<string, unknown>;
  thumbnail?: string;
  tags: string[];
  isSection: boolean;
  acceptsChildren: boolean;
  createdAt: number;
  updatedAt: number;
}
