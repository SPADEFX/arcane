import { useState, useEffect } from "react";
import type { Meta, StoryObj } from "@storybook/react";

const sampleText = "The quick brown fox jumps over the lazy dog";
const sampleHeadline = "Build premium websites at lightning speed";
const sampleParagraph =
  "A comprehensive design system with token-driven theming, premium animations, and accessible components. Ship faster, maintain less, impress more.";
const sampleCode = `const config = { theme: "dark", animate: true };`;

/* ─── Lazy font loader ───────────────────────── */

function useFonts(loaders: (() => Promise<unknown>)[]) {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let cancelled = false;
    Promise.all(loaders.map((fn) => fn())).then(() => {
      if (!cancelled) setReady(true);
    });
    return () => { cancelled = true; };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return ready;
}

function FontLoader({ loaders, children }: { loaders: (() => Promise<unknown>)[]; children: React.ReactNode }) {
  const ready = useFonts(loaders);
  if (!ready) {
    return (
      <div className="flex items-center justify-center py-24 text-[var(--color-muted)]">
        <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
        Loading fonts…
      </div>
    );
  }
  return <>{children}</>;
}

/* ─── Font loaders by category ───────────────── */

const sansLoaders = [
  () => import("@fontsource-variable/dm-sans"),
  () => import("@fontsource-variable/plus-jakarta-sans"),
  () => import("@fontsource-variable/space-grotesk"),
  () => import("@fontsource-variable/outfit"),
  () => import("@fontsource-variable/manrope"),
  () => import("@fontsource-variable/instrument-sans"),
];

const serifLoaders = [
  () => import("@fontsource-variable/playfair-display"),
  () => import("@fontsource/instrument-serif"),
  () => import("@fontsource-variable/fraunces"),
  () => import("@fontsource-variable/bricolage-grotesque"),
  () => import("@fontsource-variable/cormorant"),
  () => import("@fontsource-variable/source-serif-4"),
  () => import("@fontsource-variable/lora"),
];

const monoLoaders = [
  () => import("@fontsource-variable/fira-code"),
  () => import("@fontsource/space-mono"),
];

const displayLoaders = [
  () => import("@fontsource-variable/syne"),
  () => import("@fontsource/bebas-neue"),
  () => import("@fontsource-variable/recursive"),
];

const allLoaders = [...sansLoaders, ...serifLoaders, ...monoLoaders, ...displayLoaders];

/* ─── Components ─────────────────────────────── */

interface FontCardProps {
  name: string;
  family: string;
  type: string;
  source: string;
  variable?: boolean;
  weights?: string;
}

function FontCard({ name, family, type, source, variable, weights }: FontCardProps) {
  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-[var(--color-text)]">{name}</h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="rounded-full bg-[var(--color-accent)]/10 px-2.5 py-0.5 text-xs font-medium text-[var(--color-accent)]">
              {type}
            </span>
            <span className="text-xs text-[var(--color-muted)]">{source}</span>
            {variable && (
              <span className="rounded-full bg-green-500/10 px-2.5 py-0.5 text-xs font-medium text-green-600">
                Variable
              </span>
            )}
          </div>
        </div>
      </div>

      <div style={{ fontFamily: family }}>
        <p className="text-3xl font-bold text-[var(--color-text)]" style={{ fontFamily: family }}>
          {sampleHeadline}
        </p>
        <p className="mt-2 text-base text-[var(--color-muted)]" style={{ fontFamily: family }}>
          {sampleText}
        </p>
      </div>

      {weights && (
        <div className="flex flex-wrap gap-3 pt-2 border-t border-[var(--color-border)]">
          {weights.split(",").map((w) => {
            const weight = parseInt(w.trim());
            return (
              <span
                key={w}
                className="text-sm text-[var(--color-text)]"
                style={{ fontFamily: family, fontWeight: weight }}
              >
                {w.trim()}
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ─── Stories ─────────────────────────────────── */

export const SansSerif: StoryObj = {
  name: "Sans-Serif",
  render: () => (
    <FontLoader loaders={sansLoaders}>
      <div className="max-w-4xl mx-auto py-12 px-8 space-y-6">
        <h2 className="text-sm uppercase tracking-widest text-[var(--color-accent)] font-semibold">Sans-Serif</h2>
        <FontCard name="Inter" family="Inter Variable, sans-serif" type="Sans" source="Google Fonts" variable weights="300, 400, 500, 600, 700, 800, 900" />
        <FontCard name="Geist Sans" family="Geist Sans, sans-serif" type="Sans" source="Vercel" weights="400, 500, 600, 700, 900" />
        <FontCard name="DM Sans" family="DM Sans Variable, sans-serif" type="Sans" source="Google Fonts" variable weights="300, 400, 500, 600, 700" />
        <FontCard name="Plus Jakarta Sans" family="Plus Jakarta Sans Variable, sans-serif" type="Sans" source="Google Fonts" variable weights="300, 400, 500, 600, 700, 800" />
        <FontCard name="Space Grotesk" family="Space Grotesk Variable, sans-serif" type="Sans" source="Google Fonts" variable weights="300, 400, 500, 600, 700" />
        <FontCard name="Outfit" family="Outfit Variable, sans-serif" type="Sans" source="Google Fonts" variable weights="300, 400, 500, 600, 700, 800, 900" />
        <FontCard name="Manrope" family="Manrope Variable, sans-serif" type="Sans" source="Google Fonts" variable weights="300, 400, 500, 600, 700, 800" />
        <FontCard name="Instrument Sans" family="Instrument Sans Variable, sans-serif" type="Sans" source="Google Fonts" variable weights="400, 500, 600, 700" />
      </div>
    </FontLoader>
  ),
};

export const Serif: StoryObj = {
  name: "Serif",
  render: () => (
    <FontLoader loaders={serifLoaders}>
      <div className="max-w-4xl mx-auto py-12 px-8 space-y-6">
        <h2 className="text-sm uppercase tracking-widest text-[var(--color-accent)] font-semibold">Serif</h2>
        <FontCard name="Playfair Display" family="Playfair Display Variable, serif" type="Serif" source="Google Fonts" variable weights="400, 500, 600, 700, 800, 900" />
        <FontCard name="Instrument Serif" family="Instrument Serif, serif" type="Serif" source="Google Fonts" weights="400" />
        <FontCard name="Fraunces" family="Fraunces Variable, serif" type="Serif" source="Google Fonts" variable weights="300, 400, 500, 600, 700, 800, 900" />
        <FontCard name="Bricolage Grotesque" family="Bricolage Grotesque Variable, sans-serif" type="Grotesk" source="Google Fonts" variable weights="300, 400, 500, 600, 700, 800" />
        <FontCard name="Cormorant" family="Cormorant Variable, serif" type="Serif" source="Google Fonts" variable weights="300, 400, 500, 600, 700" />
        <FontCard name="Source Serif 4" family="Source Serif 4 Variable, serif" type="Serif" source="Google Fonts" variable weights="300, 400, 500, 600, 700, 800, 900" />
        <FontCard name="Lora" family="Lora Variable, serif" type="Serif" source="Google Fonts" variable weights="400, 500, 600, 700" />
      </div>
    </FontLoader>
  ),
};

export const Monospace: StoryObj = {
  name: "Monospace",
  render: () => (
    <FontLoader loaders={monoLoaders}>
      <div className="max-w-4xl mx-auto py-12 px-8 space-y-6">
        <h2 className="text-sm uppercase tracking-widest text-[var(--color-accent)] font-semibold">Monospace</h2>
        <FontCard name="JetBrains Mono" family="JetBrains Mono Variable, monospace" type="Mono" source="Google Fonts" variable weights="300, 400, 500, 600, 700, 800" />
        <FontCard name="Geist Mono" family="Geist Mono, monospace" type="Mono" source="Vercel" weights="400, 700" />
        <FontCard name="Fira Code" family="Fira Code Variable, monospace" type="Mono" source="Google Fonts" variable weights="300, 400, 500, 600, 700" />
        <FontCard name="Space Mono" family="Space Mono, monospace" type="Mono" source="Google Fonts" weights="400, 700" />
      </div>
    </FontLoader>
  ),
};

export const Display: StoryObj = {
  name: "Display / Statement",
  render: () => (
    <FontLoader loaders={displayLoaders}>
      <div className="max-w-4xl mx-auto py-12 px-8 space-y-6">
        <h2 className="text-sm uppercase tracking-widest text-[var(--color-accent)] font-semibold">Display</h2>
        <FontCard name="Syne" family="Syne Variable, sans-serif" type="Display" source="Google Fonts" variable weights="400, 500, 600, 700, 800" />
        <FontCard name="Bebas Neue" family="Bebas Neue, sans-serif" type="Display" source="Google Fonts" weights="400" />
        <FontCard name="Recursive" family="Recursive Variable, sans-serif" type="Display" source="Google Fonts" variable weights="300, 400, 500, 600, 700, 800, 900" />
      </div>
    </FontLoader>
  ),
};

export const Pairings: StoryObj = {
  name: "Font Pairings",
  render: () => (
    <FontLoader loaders={allLoaders}>
      <div className="max-w-5xl mx-auto py-12 px-8 space-y-8">
        <h2 className="text-sm uppercase tracking-widest text-[var(--color-accent)] font-semibold">Font Pairings</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { name: "Modern SaaS", heading: "Space Grotesk Variable", body: "Inter Variable", mono: "JetBrains Mono Variable" },
            { name: "Vercel Stack", heading: "Geist Sans", body: "Geist Sans", mono: "Geist Mono" },
            { name: "Editorial Luxury", heading: "Playfair Display Variable", body: "DM Sans Variable", mono: "Fira Code Variable" },
            { name: "Creative Agency", heading: "Syne Variable", body: "Outfit Variable", mono: "Space Mono" },
            { name: "Modern Editorial", heading: "Instrument Serif", body: "Instrument Sans Variable", mono: "JetBrains Mono Variable" },
            { name: "Friendly SaaS", heading: "Plus Jakarta Sans Variable", body: "Plus Jakarta Sans Variable", mono: "Fira Code Variable" },
            { name: "Bold & Sporty", heading: "Bebas Neue", body: "Inter Variable", mono: "JetBrains Mono Variable" },
            { name: "Playful Luxury", heading: "Fraunces Variable", body: "Manrope Variable", mono: "Geist Mono" },
          ].map((pair) => (
            <div
              key={pair.name}
              className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 space-y-4"
            >
              <span className="text-xs font-semibold uppercase tracking-widest text-[var(--color-accent)]">
                {pair.name}
              </span>
              <h3 className="text-3xl font-bold text-[var(--color-text)]" style={{ fontFamily: pair.heading }}>
                {sampleHeadline}
              </h3>
              <p className="text-sm text-[var(--color-muted)] leading-relaxed" style={{ fontFamily: pair.body }}>
                {sampleParagraph}
              </p>
              <pre className="rounded-lg bg-[var(--color-bg)] p-3 text-xs text-[var(--color-text)]" style={{ fontFamily: pair.mono }}>
                {sampleCode}
              </pre>
              <div className="flex gap-3 pt-2 border-t border-[var(--color-border)] text-xs text-[var(--color-muted)]">
                <span>H: {pair.heading.replace(" Variable", "")}</span>
                <span>B: {pair.body.replace(" Variable", "")}</span>
                <span>M: {pair.mono.replace(" Variable", "")}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </FontLoader>
  ),
};

export const Showcase: StoryObj = {
  name: "Full Showcase",
  render: () => {
    const allFonts = [
      { name: "Inter", family: "Inter Variable, sans-serif", type: "Sans" },
      { name: "Geist Sans", family: "Geist Sans, sans-serif", type: "Sans" },
      { name: "DM Sans", family: "DM Sans Variable, sans-serif", type: "Sans" },
      { name: "Plus Jakarta Sans", family: "Plus Jakarta Sans Variable, sans-serif", type: "Sans" },
      { name: "Space Grotesk", family: "Space Grotesk Variable, sans-serif", type: "Sans" },
      { name: "Outfit", family: "Outfit Variable, sans-serif", type: "Sans" },
      { name: "Manrope", family: "Manrope Variable, sans-serif", type: "Sans" },
      { name: "Instrument Sans", family: "Instrument Sans Variable, sans-serif", type: "Sans" },
      { name: "Playfair Display", family: "Playfair Display Variable, serif", type: "Serif" },
      { name: "Instrument Serif", family: "Instrument Serif, serif", type: "Serif" },
      { name: "Fraunces", family: "Fraunces Variable, serif", type: "Serif" },
      { name: "Bricolage Grotesque", family: "Bricolage Grotesque Variable, sans-serif", type: "Grotesk" },
      { name: "Cormorant", family: "Cormorant Variable, serif", type: "Serif" },
      { name: "Source Serif 4", family: "Source Serif 4 Variable, serif", type: "Serif" },
      { name: "Lora", family: "Lora Variable, serif", type: "Serif" },
      { name: "JetBrains Mono", family: "JetBrains Mono Variable, monospace", type: "Mono" },
      { name: "Geist Mono", family: "Geist Mono, monospace", type: "Mono" },
      { name: "Fira Code", family: "Fira Code Variable, monospace", type: "Mono" },
      { name: "Space Mono", family: "Space Mono, monospace", type: "Mono" },
      { name: "Syne", family: "Syne Variable, sans-serif", type: "Display" },
      { name: "Bebas Neue", family: "Bebas Neue, sans-serif", type: "Display" },
      { name: "Recursive", family: "Recursive Variable, sans-serif", type: "Display" },
    ];

    const typeColors: Record<string, string> = {
      Sans: "bg-blue-500/10 text-blue-500",
      Serif: "bg-purple-500/10 text-purple-500",
      Grotesk: "bg-orange-500/10 text-orange-500",
      Mono: "bg-green-500/10 text-green-500",
      Display: "bg-pink-500/10 text-pink-500",
    };

    return (
      <FontLoader loaders={allLoaders}>
        <div className="max-w-5xl mx-auto py-12 px-8 space-y-6">
          <div className="text-center space-y-2 mb-12">
            <h1 className="text-4xl font-black text-[var(--color-text)]">Typography System</h1>
            <p className="text-[var(--color-muted)]">22 curated fonts — all free, all trendy, all variable</p>
          </div>

          {allFonts.map((font) => (
            <div
              key={font.name}
              className="flex items-center gap-6 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-4 hover:border-[var(--color-accent)]/30 transition-colors"
            >
              <div className="w-40 shrink-0">
                <span className="text-sm font-semibold text-[var(--color-text)]">{font.name}</span>
                <span className={`ml-2 rounded-full px-2 py-0.5 text-[10px] font-medium ${typeColors[font.type]}`}>
                  {font.type}
                </span>
              </div>
              <p
                className="flex-1 text-2xl text-[var(--color-text)] truncate"
                style={{ fontFamily: font.family, fontWeight: 600 }}
              >
                {sampleHeadline}
              </p>
            </div>
          ))}
        </div>
      </FontLoader>
    );
  },
};

const meta: Meta = {
  title: "Foundations/Typography",
  parameters: { layout: "fullscreen" },
};

export default meta;
