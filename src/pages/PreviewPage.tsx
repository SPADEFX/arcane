/**
 * Preview route — renders ONE component on a clean dot-grid background.
 * Embedded as an iframe in the LibraryPage cards.
 *
 * Iframe isolation gives us:
 *  1. Components that attach document-level wheel/scroll listeners can't
 *     hijack the parent page.
 *  2. Visual consistency — everyone shares the same canvas.
 *  3. Crashes stay contained.
 */
import { Component, type ErrorInfo, type ReactNode, useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { DynamicRenderer } from "@/components/DynamicRenderer";
import { bootstrapRegistry } from "@/lib/bootstrap";
import * as db from "@/lib/db";
import type { ComponentDefinition } from "@/types/component-registry";
import "../styles/global.css";

/* ─── Sensible default props per component slug ───────────────────────── */
/* Some primitives blow up with empty props. Provide minimal showcases. */
const SLUG_PROPS: Record<string, Record<string, unknown>> = {
  button: { children: "Click me" },
  badge: { children: "Badge" },
  input: { placeholder: "Type something…" },
  card: { children: "Card content" },
  "site-theme": { children: "Theme provider" },
  "spotlight-card": { children: "Spotlight" },
  "tilt-card": { children: "Tilt me" },
  "magnetic-button": { children: "Magnetic" },
  "text-typewriter": { text: "Typing animation…" },
  "text-blur-reveal": { text: "Blur reveal" },
  "text-pull-up": { text: "Pull up text" },
  "text-mask-reveal": { text: "Mask reveal" },
  "text-reveal": { text: "Char reveal" },
  "text-rotate": { words: ["create", "design", "build"] },
  "text-scramble": { text: "Scramble" },
  "text-glitch": { text: "GLITCH" },
  "text-highlight": { text: "Highlighted text" },
  "text-counter": { from: 0, to: 100 },
  "text-spring-chars": { text: "Springs" },
  "text-wave": { text: "Wave" },
  "text-gradient-flow": { text: "Gradient flow" },
  "text-scroll-reveal": { children: "Scroll reveal" },
  marquee: { children: ["item 1", "item 2", "item 3"] },
  dock: { items: [
    { icon: "circle", label: "One" },
    { icon: "square", label: "Two" },
    { icon: "triangle", label: "Three" },
  ] },
  accordion: {},
  navbar: { logo: "Brand", links: [{ label: "Home", href: "#" }, { label: "About", href: "#" }] },
  "scroll-reveal": { children: "Scroll reveal placeholder" },
  "scroll-pin": { children: "Pinned content" },
  "smooth-scroll": { children: "Smooth scroll" },
  "horizontal-scroll": { children: ["slide 1", "slide 2", "slide 3"] },
  "image-reveal": { src: "https://placehold.co/800x500/0a0a0a/666?text=Image+Reveal" },
  "parallax-layer": { children: "Parallax" },
  skeleton: {},
  dialog: {},
};

/* Components that just don't show anything visible standalone — show a hint */
const UTILITY_SLUGS = new Set([
  "smooth-scroll",
  "scroll-pin",
  "parallax-layer",
  "scroll-reveal",
  "noise-overlay",
  "site-theme",
]);

/* ─── Error Boundary ──────────────────────────────────────────────────── */

interface ErrorBoundaryState { error: Error | null }
class ErrorBoundary extends Component<{ children: ReactNode; slug: string }, ErrorBoundaryState> {
  constructor(props: { children: ReactNode; slug: string }) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error: Error) { return { error }; }
  componentDidCatch(error: Error, info: ErrorInfo) {
    console.warn(`[preview ${this.props.slug}] render error:`, error, info);
  }
  render() {
    if (this.state.error) {
      return <PreviewMessage label="Render error" sub={this.state.error.message} tone="error" />;
    }
    return this.props.children;
  }
}

/* ─── Page ────────────────────────────────────────────────────────────── */

export function PreviewPage() {
  const { slug } = useParams<{ slug: string }>();
  const [params] = useSearchParams();
  const [defaults, setDefaults] = useState<Record<string, unknown> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fit = params.get("fit") || "scale";

  useEffect(() => {
    if (!slug) return;
    setError(null);
    bootstrapRegistry()
      .then(() => db.getAll<ComponentDefinition>("components"))
      .then((all) => {
        const found = all.find((c) => c.slug === slug);
        // Merge sensible per-slug defaults over registry defaults so empty
        // primitives don't render as nothing (or worse, crash).
        const merged = { ...(SLUG_PROPS[slug] || {}), ...(found?.defaultProps || {}) };
        setDefaults(merged);
        if (!found) console.warn(`[preview] component "${slug}" not in registry`);
      })
      .catch((e) => setError(String(e)));
  }, [slug]);

  if (!slug) return null;

  return (
    <div
      className="relative min-h-screen w-full overflow-hidden bg-zinc-950 text-zinc-100"
      style={{
        backgroundImage:
          "radial-gradient(circle, rgb(255 255 255 / 0.04) 0.8px, transparent 0.8px)",
        backgroundSize: "24px 24px",
      }}
    >
      {error ? (
        <PreviewMessage label="Failed to load" sub={error} tone="error" />
      ) : !defaults ? (
        <PreviewMessage label="Loading…" tone="muted" />
      ) : UTILITY_SLUGS.has(slug) ? (
        <PreviewMessage
          label={slug}
          sub="Utility component — wraps content to add behavior. No standalone preview."
          tone="muted"
        />
      ) : (
        <ErrorBoundary slug={slug}>
          <div
            className={
              fit === "natural"
                ? "min-h-screen"
                : "flex min-h-screen items-center justify-center p-6"
            }
          >
            <div className={fit === "scale" ? "w-full max-w-[1200px]" : ""}>
              <DynamicRenderer slug={slug} componentProps={defaults} />
            </div>
          </div>
        </ErrorBoundary>
      )}
    </div>
  );
}

/* ─── Empty / error / utility state ───────────────────────────────────── */

function PreviewMessage({
  label, sub, tone = "muted",
}: { label: string; sub?: string; tone?: "muted" | "error" }) {
  return (
    <div className="flex min-h-screen items-center justify-center p-8">
      <div className="max-w-[420px] text-center">
        <p
          className={`text-[11px] font-medium uppercase tracking-[0.2em] ${
            tone === "error" ? "text-red-400/80" : "text-white/30"
          }`}
        >
          {label}
        </p>
        {sub && <p className="mt-2 text-[12px] leading-relaxed text-white/40">{sub}</p>}
      </div>
    </div>
  );
}
