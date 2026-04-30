/**
 * Preview route — renders ONE component on a clean dot-grid background.
 * Designed to be embedded as an iframe in the LibraryPage cards.
 *
 * Iframe isolation gives us two big wins for free:
 *  1. Components that attach document-level wheel/scroll listeners (SmoothScroll,
 *     ScrollPin, ParallaxLayer, framer-motion useScroll) can't hijack the
 *     parent page's trackpad scroll.
 *  2. Visual consistency — every preview lives on the same canvas regardless
 *     of source (extracted PNG or live primitive).
 */
import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { DynamicRenderer } from "@/components/DynamicRenderer";
import { bootstrapRegistry } from "@/lib/bootstrap";
import * as db from "@/lib/db";
import type { ComponentDefinition } from "@/types/component-registry";
import "../styles/global.css";

export function PreviewPage() {
  const { slug } = useParams<{ slug: string }>();
  const [params] = useSearchParams();
  const [defaults, setDefaults] = useState<Record<string, unknown> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fit = params.get("fit") || "scale"; // "scale" or "natural"

  useEffect(() => {
    if (!slug) return;
    bootstrapRegistry()
      .then(() => db.getAll<ComponentDefinition>("components"))
      .then((all) => {
        const found = all.find((c) => c.slug === slug);
        if (!found) {
          setError(`Component "${slug}" not found`);
          return;
        }
        setDefaults(found.defaultProps || {});
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
        <div className="flex min-h-screen items-center justify-center p-6 text-center">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      ) : !defaults ? (
        <div className="flex min-h-screen items-center justify-center text-xs text-zinc-600">
          Loading…
        </div>
      ) : (
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
      )}
    </div>
  );
}
