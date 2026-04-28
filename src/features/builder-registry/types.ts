import type { ComponentType } from "react";

/* ─── Data model ─────────────────────────────────── */

export interface ThemeConfig {
  font: string;
  brandColor: string;
  dark: boolean;
  radius?: "none" | "sm" | "md" | "lg" | "xl" | "2xl";
}

export interface Block {
  id: string;
  type: string;
  props: Record<string, unknown>;
}

export interface Page {
  id: string;
  name: string;
  slug: string;
  blocks: Block[];
}

export interface Site {
  id: string;
  name: string;
  createdAt: number;
  updatedAt: number;
  theme: ThemeConfig;
  pages: Page[];
}

/* ─── Block registry ─────────────────────────────── */

export type PropFieldType =
  | "text"
  | "textarea"
  | "number"
  | "boolean"
  | "color"
  | "select"
  | "json"
  | "image";

export interface PropField {
  key: string;
  label: string;
  type: PropFieldType;
  options?: { label: string; value: string }[];
  defaultValue?: unknown;
}

export type BlockCategory = "header" | "hero" | "section" | "footer" | "extracted";

export interface BlockDefinition {
  type: string;
  label: string;
  category: BlockCategory;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component: ComponentType<any>;
  defaultProps: Record<string, unknown>;
  propSchema: PropField[];
}
