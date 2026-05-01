"use client";

import { forwardRef, type HTMLAttributes } from "react";
import { motion, type Variants } from "motion/react";
import { cn } from "@uilibrary/utils";
import { useReducedMotion } from "@uilibrary/hooks/use-reduced-motion";

/* ─────────────────────────────────────────────────────────────────────────
 * Landing Synthesis — single-page composition that distills:
 *   601 Inc. (oversized display numerals + asymmetric architectural layout)
 *   SEEN (subtle sparkle + atmospheric layers)
 *   Antimetal (serif display × sans UI + single accent stop signal + dot globe)
 *   Linear (4 surface levels + mono metadata + dashboard preview + ⌘K hints)
 *   Family (cream warmth + inset borders + single dark/light contrast)
 *
 * One palette, one type pairing, one density across all sections.
 * ─────────────────────────────────────────────────────────────────────── */

const C = {
  /* dark surfaces */
  canvas: "#0a0e14",
  s1: "#13181f",
  s2: "#1d242e",
  s3: "#2a323d",
  /* cream surfaces */
  cream: "#fafaf9",
  creamSurface: "#f3f0ec",
  creamInk: "#1b2540",
  /* text */
  text: "#f5f7f8",
  textSecondary: "#8a93a6",
  textTertiary: "#5a6271",
  /* accent */
  accent: "#d4f057",
  accentDim: "rgba(212, 240, 87, 0.12)",
} as const;

const FONT_DISPLAY =
  "'Fraunces Variable', 'Instrument Serif', ui-serif, Georgia, serif";
const FONT_UI =
  "'Inter Variable', ui-sans-serif, system-ui, -apple-system, sans-serif";
const FONT_MONO =
  "'JetBrains Mono Variable', ui-monospace, SFMono-Regular, Menlo, monospace";

const PILL = "9999px";
const RADIUS = "6px";
const CARD_RADIUS = "16px";

const EASE = [0.16, 1, 0.3, 1] as const;
const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
};
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: EASE } },
};

/* ── Reusable inset-card style (Family + Linear pattern) ──────────────── */
const insetCard = (bg = C.s1) => ({
  background: bg,
  borderRadius: CARD_RADIUS,
  boxShadow: `${C.s3} 0px 0px 0px 1px inset, rgba(255,255,255,0.02) 0px 1px 0px 0px inset`,
});

/* ── Atmospheric layer used in hero & cta ─────────────────────────────── */
function Atmosphere({ globe = false }: { globe?: boolean }) {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
      {/* Antimetal dot grid masked radial */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.04) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          maskImage:
            "radial-gradient(ellipse 60% 50% at 50% 30%, black 0%, transparent 75%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 60% 50% at 50% 30%, black 0%, transparent 75%)",
        }}
      />
      {/* Accent glow — restrained, NOT a wash */}
      <div
        className="absolute"
        style={{
          left: "50%",
          top: "20%",
          width: "60%",
          height: "55%",
          transform: "translateX(-50%)",
          background: `radial-gradient(circle, ${C.accentDim} 0%, transparent 65%)`,
          filter: "blur(60px)",
        }}
      />
      {globe && (
        <div
          className="absolute left-1/2 top-1/2 rounded-full"
          style={{
            width: "min(800px, 80vw)",
            height: "min(800px, 80vw)",
            transform: "translate(-50%, -45%)",
            backgroundImage:
              "radial-gradient(rgba(255,255,255,0.45) 1.1px, transparent 1.1px)",
            backgroundSize: "16px 16px",
            maskImage:
              "radial-gradient(circle at center, rgba(0,0,0,1) 30%, rgba(0,0,0,0.6) 50%, rgba(0,0,0,0) 70%)",
            WebkitMaskImage:
              "radial-gradient(circle at center, rgba(0,0,0,1) 30%, rgba(0,0,0,0.6) 50%, rgba(0,0,0,0) 70%)",
          }}
        />
      )}
      {/* SEEN subtle sparkle stars (2 only) */}
      <Sparkle top="14%" left="18%" size={11} delay={0.3} color="rgba(212,240,87,0.7)" />
      <Sparkle top="22%" right="22%" size={9} delay={1.4} color="rgba(255,255,255,0.4)" />
    </div>
  );
}

function Sparkle({ top, left, right, size, delay, color }: { top: string; left?: string; right?: string; size: number; delay: number; color: string }) {
  return (
    <motion.div
      className="absolute"
      style={{ top, left, right, color }}
      animate={{ opacity: [0.3, 0.95, 0.3], scale: [0.85, 1.1, 0.85] }}
      transition={{ duration: 4, ease: "easeInOut", repeat: Infinity, delay }}
    >
      <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0 L13.4 10.6 L24 12 L13.4 13.4 L12 24 L10.6 13.4 L0 12 L10.6 10.6 Z" />
      </svg>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
 * The full page
 * ─────────────────────────────────────────────────────────────────────── */

export const LandingSynthesis = forwardRef<HTMLElement, HTMLAttributes<HTMLElement>>(
  ({ className, ...props }, ref) => {
    const reduced = useReducedMotion();

    return (
      <section
        ref={ref}
        className={cn("relative", className)}
        style={{
          background: C.canvas,
          color: C.text,
          fontFamily: FONT_UI,
          fontFeatureSettings: "'cv01' on, 'ss03' on",
        }}
        {...props}
      >
        {/* ═══ NAV ═══════════════════════════════════════════════════════ */}
        <Nav />

        {/* ═══ HERO ══════════════════════════════════════════════════════ */}
        <div className="relative isolate overflow-hidden" style={{ paddingTop: 24, paddingBottom: 96 }}>
          <Atmosphere globe />
          <motion.div
            className="relative z-10 mx-auto flex w-full max-w-[1200px] flex-col items-center px-6 text-center"
            variants={reduced ? undefined : stagger}
            initial={reduced ? undefined : "hidden"}
            animate={reduced ? undefined : "visible"}
          >
            {/* Version pill (Linear) */}
            <motion.a
              variants={reduced ? undefined : fadeUp}
              href="#"
              className="inline-flex items-center"
              style={{
                gap: 8, padding: "5px 12px 5px 5px", borderRadius: PILL,
                background: C.s1, border: `1px solid ${C.s3}`,
                fontSize: 13, color: C.text, marginBottom: 28, marginTop: 56,
                letterSpacing: "-0.13px",
              }}
            >
              <span style={{
                fontFamily: FONT_MONO, fontSize: 11, padding: "2px 7px",
                background: C.s2, color: C.accent, borderRadius: PILL, letterSpacing: "-0.1px",
              }}>v3.5</span>
              <span style={{ color: C.textSecondary }}>AI-powered design taste, distilled</span>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.5, marginLeft: 2 }}>
                <path d="M9 18l6-6-6-6" />
              </svg>
            </motion.a>

            {/* SERIF display headline — Antimetal differentiator */}
            <motion.h1
              variants={reduced ? undefined : fadeUp}
              className="text-balance"
              style={{
                fontFamily: FONT_DISPLAY, fontWeight: 400,
                fontSize: "clamp(3rem, 6vw + 0.5rem, 5.5rem)",
                lineHeight: 1.02, letterSpacing: "-0.025em",
                color: C.text, maxWidth: 920, marginBottom: 22,
                fontFeatureSettings: "'ss04','ss06','ss09'",
              }}
            >
              Components with{" "}
              <em style={{ fontStyle: "italic", color: C.accent }}>actual taste.</em>
            </motion.h1>

            <motion.p
              variants={reduced ? undefined : fadeUp}
              className="text-balance"
              style={{
                fontSize: 17, lineHeight: 1.5, letterSpacing: "-0.13px",
                color: C.textSecondary, maxWidth: 540, marginBottom: 32,
              }}
            >
              Extract any section from any site, distill its design system, and ship faithful React components. No more average-of-the-internet UI.
            </motion.p>

            {/* CTAs */}
            <motion.div
              variants={reduced ? undefined : fadeUp}
              className="flex flex-wrap items-center justify-center"
              style={{ gap: 8 }}
            >
              <a href="#" style={{
                fontSize: 14, fontWeight: 590, letterSpacing: "-0.13px",
                padding: "11px 20px", borderRadius: RADIUS, background: C.accent, color: C.canvas,
                boxShadow: "rgba(0,0,0,0.4) 0px 2px 4px 0px, rgba(255,255,255,0.2) 0px 1px 0px 0px inset",
                display: "inline-flex", alignItems: "center", gap: 8,
              }}>
                Start extracting
                <span style={{ fontFamily: FONT_MONO, fontSize: 11, opacity: 0.6 }}>↵</span>
              </a>
              <a href="#" style={{
                fontSize: 14, fontWeight: 510, letterSpacing: "-0.13px",
                padding: "11px 18px", borderRadius: RADIUS, background: C.s1, color: C.text,
                boxShadow: `${C.s3} 0px 0px 0px 1px inset`,
              }}>
                See how it works
              </a>
            </motion.div>

            {/* ⌘K hint (Linear) */}
            <motion.p
              variants={reduced ? undefined : fadeUp}
              style={{ marginTop: 14, fontSize: 12, color: C.textTertiary, display: "inline-flex", alignItems: "center", gap: 6 }}
            >
              Open command palette
              <span style={{
                fontFamily: FONT_MONO, fontSize: 10, padding: "1px 6px",
                background: C.s2, color: C.textSecondary, borderRadius: 3, border: `1px solid ${C.s3}`,
              }}>⌘K</span>
            </motion.p>
          </motion.div>

          {/* Dashboard preview (Linear pattern) */}
          <motion.div
            initial={reduced ? undefined : { opacity: 0, y: 24, scale: 0.98 }}
            animate={reduced ? undefined : { opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.5 }}
            className="relative z-10 mx-auto"
            style={{ maxWidth: 1100, padding: "48px 24px 0" }}
          >
            <DashboardPreview />
          </motion.div>
        </div>

        {/* ═══ LOGO BAR ══════════════════════════════════════════════════ */}
        <LogoBar />

        {/* ═══ STATS / OVERSIZED NUMBERS (601 Inc.) ══════════════════════ */}
        <Stats />

        {/* ═══ FEATURE GRID (Family cream switch) ═══════════════════════ */}
        <CreamFeatures />

        {/* ═══ TESTIMONIAL ROW (Linear-style) ═══════════════════════════ */}
        <Testimonials />

        {/* ═══ CTA SECTION ══════════════════════════════════════════════ */}
        <FinalCTA />

        {/* ═══ FOOTER ═══════════════════════════════════════════════════ */}
        <Footer />
      </section>
    );
  },
);

LandingSynthesis.displayName = "LandingSynthesis";

/* ─────────────────────────────────────────────────────────────────────── */
/* Sub-sections                                                            */
/* ─────────────────────────────────────────────────────────────────────── */

function Nav() {
  return (
    <nav
      className="relative z-30 flex items-center justify-between"
      style={{
        maxWidth: 1200, width: "100%", margin: "0 auto", padding: "20px 24px",
      }}
    >
      <div className="flex items-center" style={{ gap: 8 }}>
        <div className="flex items-center justify-center" style={{ width: 22, height: 22, borderRadius: 5, background: C.accent }}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill={C.canvas}>
            <path d="M12 2 L22 12 L12 22 L2 12 Z" />
          </svg>
        </div>
        <span style={{ fontSize: 15, fontWeight: 510, letterSpacing: "-0.13px" }}>Arcane</span>
      </div>

      <div className="hidden items-center md:flex" style={{ gap: 4 }}>
        {["Library", "Extract", "Builder", "Pricing"].map((l) => (
          <a key={l} href="#" style={{
            color: C.textSecondary, fontSize: 13, padding: "6px 10px", borderRadius: 6, letterSpacing: "-0.13px",
          }}>{l}</a>
        ))}
      </div>

      <div className="flex items-center" style={{ gap: 8 }}>
        <a href="#" style={{
          color: C.textSecondary, fontSize: 13, padding: "6px 10px", letterSpacing: "-0.13px",
        }}>Log in</a>
        <a href="#" style={{
          fontSize: 13, fontWeight: 590, padding: "7px 14px", borderRadius: RADIUS, background: C.accent, color: C.canvas,
          boxShadow: "rgba(0,0,0,0.4) 0px 2px 4px 0px, rgba(255,255,255,0.2) 0px 1px 0px 0px inset",
          letterSpacing: "-0.13px",
        }}>Get access</a>
      </div>
    </nav>
  );
}

function DashboardPreview() {
  return (
    <div style={insetCard(C.s1)}>
      <div style={{ padding: 1 }}>
        <div style={{
          display: "grid", gridTemplateColumns: "180px 1fr", borderRadius: "15px",
          background: C.s1, minHeight: 280, overflow: "hidden",
        }}>
          {/* Sidebar */}
          <div style={{ borderRight: `1px solid ${C.s3}`, padding: 12, display: "flex", flexDirection: "column", gap: 4 }}>
            <div style={{ fontSize: 10, fontWeight: 500, color: C.textTertiary, letterSpacing: "0.18em", textTransform: "uppercase", padding: "4px 8px", marginBottom: 4 }}>
              Library
            </div>
            {[
              { l: "All components", n: 60, active: false },
              { l: "Extracted", n: 12, active: true },
              { l: "Heroes", n: 8, active: false },
              { l: "Pricing", n: 4, active: false },
              { l: "FAQs", n: 3, active: false },
              { l: "Footers", n: 5, active: false },
            ].map((row) => (
              <div key={row.l} style={{
                padding: "5px 8px", fontSize: 13, fontWeight: 400, letterSpacing: "-0.13px",
                color: row.active ? C.text : C.textSecondary,
                background: row.active ? C.s2 : "transparent",
                borderRadius: 4, display: "flex", justifyContent: "space-between", alignItems: "center",
              }}>
                <span>{row.l}</span>
                <span style={{ fontFamily: FONT_MONO, fontSize: 11, color: C.textTertiary }}>{row.n}</span>
              </div>
            ))}
          </div>
          {/* Issues table */}
          <div style={{ padding: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <span style={{ fontSize: 13, fontWeight: 510, letterSpacing: "-0.13px" }}>Extracted (12)</span>
              <span style={{ fontFamily: FONT_MONO, fontSize: 11, color: C.textTertiary }}>updated 2m ago</span>
            </div>
            {[
              { id: "EXT-241", title: "Stripe pricing toggle", domain: "stripe.com", priority: C.accent },
              { id: "EXT-238", title: "Linear command palette", domain: "linear.app", priority: "#5e6ad2" },
              { id: "EXT-235", title: "Vercel hero gradient", domain: "vercel.com", priority: "#8a93a6" },
              { id: "EXT-232", title: "Notion sidebar", domain: "notion.so", priority: "#5a6271" },
            ].map((row) => (
              <div key={row.id} style={{
                display: "grid", gridTemplateColumns: "auto 80px 1fr auto",
                alignItems: "center", gap: 12, padding: "10px 12px",
                borderBottom: `1px solid ${C.s3}`,
              }}>
                <div style={{ width: 7, height: 7, borderRadius: 2, background: row.priority }} />
                <span style={{ fontFamily: FONT_MONO, fontSize: 11, color: C.textTertiary, letterSpacing: "-0.1px" }}>{row.id}</span>
                <span style={{ fontSize: 13, color: C.text, letterSpacing: "-0.13px" }}>{row.title}</span>
                <span style={{ fontSize: 11, color: C.textTertiary, fontFamily: FONT_MONO }}>{row.domain}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function LogoBar() {
  return (
    <div style={{ padding: "32px 24px 64px", borderTop: `1px solid ${C.s2}`, marginTop: 0 }}>
      <div className="mx-auto" style={{ maxWidth: 1100 }}>
        <p style={{
          fontSize: 11, fontWeight: 500, color: C.textTertiary,
          letterSpacing: "0.2em", textTransform: "uppercase", textAlign: "center", marginBottom: 24,
        }}>
          Trusted by craft-driven teams
        </p>
        <div className="flex flex-wrap items-center justify-center" style={{ gap: 48, opacity: 0.55 }}>
          {["Vercel", "Linear", "Resend", "Railway", "Anthropic", "Mercury"].map((name) => (
            <span key={name} style={{ fontSize: 17, fontWeight: 510, color: C.textSecondary, letterSpacing: "-0.13px" }}>
              {name}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function Stats() {
  return (
    <div style={{ padding: "96px 24px", borderTop: `1px solid ${C.s2}` }}>
      <div className="mx-auto grid" style={{
        maxWidth: 1100, gridTemplateColumns: "repeat(3, 1fr)", gap: 1,
        background: C.s2, borderRadius: CARD_RADIUS, overflow: "hidden",
        boxShadow: `${C.s3} 0px 0px 0px 1px inset`,
      }}>
        {[
          { val: "150K", label: "Sites referenced", note: "Refero MCP integration" },
          { val: "12", label: "Avg. extracts / site", note: "Multi-pass Puppeteer" },
          { val: "60s", label: "From URL to component", note: "End-to-end pipeline" },
        ].map((s, i) => (
          <div key={i} style={{ background: C.s1, padding: "32px 28px" }}>
            <div style={{
              fontFamily: FONT_DISPLAY, fontWeight: 400, fontSize: "clamp(72px, 8vw, 130px)",
              letterSpacing: "-0.04em", lineHeight: 1, color: C.accent,
              marginBottom: 12,
            }}>
              {s.val}
            </div>
            <div style={{ fontSize: 13, fontWeight: 510, color: C.text, letterSpacing: "-0.13px", marginBottom: 4 }}>
              {s.label}
            </div>
            <div style={{ fontFamily: FONT_MONO, fontSize: 11, color: C.textTertiary, letterSpacing: "-0.1px" }}>
              {s.note}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CreamFeatures() {
  return (
    <div style={{ background: C.cream, color: C.creamInk, padding: "120px 24px", borderTop: `1px solid ${C.s2}` }}>
      <div className="mx-auto" style={{ maxWidth: 1100 }}>
        {/* Section number marker (601 Inc.) */}
        <div style={{ display: "flex", alignItems: "baseline", gap: 16, marginBottom: 48 }}>
          <span style={{
            fontFamily: FONT_DISPLAY, fontWeight: 400, fontSize: 80,
            color: C.creamInk, opacity: 0.15, letterSpacing: "-0.04em", lineHeight: 1,
          }}>02</span>
          <span style={{
            fontSize: 11, fontWeight: 500, color: C.creamInk, opacity: 0.5,
            letterSpacing: "0.2em", textTransform: "uppercase",
          }}>What makes it different</span>
        </div>

        <h2 style={{
          fontFamily: FONT_DISPLAY, fontWeight: 400,
          fontSize: "clamp(2.25rem, 4vw + 0.5rem, 3.5rem)", lineHeight: 1.05, letterSpacing: "-0.025em",
          maxWidth: 720, marginBottom: 64,
        }}>
          Designed twice. <em style={{ fontStyle: "italic", color: C.creamInk, opacity: 0.45 }}>Once for taste, once for speed.</em>
        </h2>

        <div className="grid" style={{ gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
          {[
            { icon: "▲", title: "Extract anything", body: "Puppeteer-driven section capture with computed styles, animations, and a generated DESIGN.md sidecar." },
            { icon: "◆", title: "Apply real taste", body: "Drop-in tokens from any styles.refero.design entry. The components inherit, instantly." },
            { icon: "●", title: "Ship to production", body: "React components with TypeScript, Tailwind v4, Framer Motion. No runtime, no lock-in." },
          ].map((f) => (
            <div key={f.title} style={{
              background: C.cream, padding: 24, borderRadius: 12,
              boxShadow: `${C.creamSurface} 0px 0px 0px 1px inset`,
            }}>
              <div style={{
                width: 32, height: 32, borderRadius: 8, background: C.creamInk, color: C.cream,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 15, marginBottom: 16,
              }}>{f.icon}</div>
              <h3 style={{ fontSize: 17, fontWeight: 510, letterSpacing: "-0.13px", marginBottom: 6 }}>{f.title}</h3>
              <p style={{ fontSize: 14, lineHeight: 1.55, color: C.creamInk, opacity: 0.65, letterSpacing: "-0.1px" }}>{f.body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Testimonials() {
  return (
    <div style={{ padding: "96px 24px" }}>
      <div className="mx-auto" style={{ maxWidth: 1100 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 16, marginBottom: 40 }}>
          <span style={{
            fontFamily: FONT_DISPLAY, fontWeight: 400, fontSize: 80,
            color: C.text, opacity: 0.08, letterSpacing: "-0.04em", lineHeight: 1,
          }}>03</span>
          <span style={{
            fontSize: 11, fontWeight: 500, color: C.textTertiary,
            letterSpacing: "0.2em", textTransform: "uppercase",
          }}>What people say</span>
        </div>

        <div className="grid" style={{ gridTemplateColumns: "repeat(2, 1fr)", gap: 20 }}>
          {[
            { quote: "Cut my landing-page workflow from a week to an afternoon. The extracted DESIGN.md alone is worth it.", name: "Léa Marchand", handle: "@leam", role: "Indie founder" },
            { quote: "First component library where the defaults don't feel like defaults. Real taste, not template energy.", name: "Marcus Johnson", handle: "@mjcodes", role: "Freelance dev" },
          ].map((t) => (
            <div key={t.name} style={{ ...insetCard(C.s1), padding: 28 }}>
              <p style={{ fontFamily: FONT_DISPLAY, fontSize: 22, lineHeight: 1.35, letterSpacing: "-0.01em", color: C.text, marginBottom: 24 }}>
                &ldquo;{t.quote}&rdquo;
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 32, height: 32, borderRadius: PILL, background: C.s3 }} />
                <div>
                  <div style={{ fontSize: 13, fontWeight: 510, letterSpacing: "-0.13px" }}>{t.name}</div>
                  <div style={{ fontFamily: FONT_MONO, fontSize: 11, color: C.textTertiary, letterSpacing: "-0.1px" }}>
                    {t.handle} · {t.role}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function FinalCTA() {
  return (
    <div className="relative isolate overflow-hidden" style={{ padding: "120px 24px", borderTop: `1px solid ${C.s2}` }}>
      <Atmosphere />
      <div className="relative z-10 mx-auto text-center" style={{ maxWidth: 720 }}>
        <h2 style={{
          fontFamily: FONT_DISPLAY, fontWeight: 400,
          fontSize: "clamp(2.5rem, 5vw + 0.5rem, 4.25rem)", lineHeight: 1.04, letterSpacing: "-0.025em",
          marginBottom: 20,
        }}>
          Stop shipping <em style={{ fontStyle: "italic", color: C.accent }}>average.</em>
        </h2>
        <p style={{
          fontSize: 17, lineHeight: 1.55, color: C.textSecondary, letterSpacing: "-0.13px",
          marginBottom: 32, maxWidth: 480, marginInline: "auto",
        }}>
          Get the studio + extract toolkit + library access. One install, one taste.
        </p>
        <div className="flex flex-wrap items-center justify-center" style={{ gap: 8 }}>
          <a href="#" style={{
            fontSize: 14, fontWeight: 590, letterSpacing: "-0.13px",
            padding: "12px 22px", borderRadius: RADIUS, background: C.accent, color: C.canvas,
            boxShadow: "rgba(0,0,0,0.4) 0px 2px 4px 0px, rgba(255,255,255,0.2) 0px 1px 0px 0px inset",
          }}>
            Get access
          </a>
          <a href="#" style={{
            fontSize: 14, fontWeight: 510, letterSpacing: "-0.13px",
            padding: "12px 18px", borderRadius: RADIUS, background: C.s1, color: C.text,
            boxShadow: `${C.s3} 0px 0px 0px 1px inset`,
          }}>
            Read the docs
          </a>
        </div>
      </div>
    </div>
  );
}

function Footer() {
  return (
    <footer style={{ borderTop: `1px solid ${C.s2}`, padding: "48px 24px 32px" }}>
      <div className="mx-auto" style={{ maxWidth: 1100 }}>
        <div style={{
          display: "grid", gridTemplateColumns: "1.5fr repeat(3, 1fr)", gap: 32, marginBottom: 32,
        }}>
          <div>
            <div className="flex items-center" style={{ gap: 8, marginBottom: 12 }}>
              <div className="flex items-center justify-center" style={{ width: 18, height: 18, borderRadius: 4, background: C.accent }}>
                <svg width="9" height="9" viewBox="0 0 24 24" fill={C.canvas}><path d="M12 2 L22 12 L12 22 L2 12 Z" /></svg>
              </div>
              <span style={{ fontSize: 13, fontWeight: 510, letterSpacing: "-0.13px" }}>Arcane</span>
            </div>
            <p style={{ fontSize: 12, color: C.textTertiary, lineHeight: 1.55, letterSpacing: "-0.1px", maxWidth: 280 }}>
              Components with actual taste. Built for indie devs and craft-driven teams.
            </p>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, marginTop: 16, fontSize: 11, color: C.textTertiary }}>
              <span style={{ width: 6, height: 6, borderRadius: PILL, background: "#22c55e" }} />
              <span style={{ fontFamily: FONT_MONO, letterSpacing: "-0.1px" }}>All systems operational</span>
            </div>
          </div>

          {[
            { title: "Product", links: ["Library", "Extract Tool", "Builder", "Pricing"] },
            { title: "Resources", links: ["Documentation", "Changelog", "GitHub", "Refero MCP"] },
            { title: "Company", links: ["About", "Careers", "Contact", "Privacy"] },
          ].map((col) => (
            <div key={col.title}>
              <div style={{ fontSize: 11, fontWeight: 500, color: C.textTertiary, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 14 }}>
                {col.title}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {col.links.map((l) => (
                  <a key={l} href="#" style={{ fontSize: 13, color: C.textSecondary, letterSpacing: "-0.13px" }}>
                    {l}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div style={{ borderTop: `1px solid ${C.s2}`, paddingTop: 20, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <span style={{ fontSize: 11, color: C.textTertiary, fontFamily: FONT_MONO, letterSpacing: "-0.1px" }}>
            © 2026 Arcane · Synthesized from styles.refero.design
          </span>
          <span style={{ fontSize: 11, color: C.textTertiary, letterSpacing: "-0.1px" }}>
            Made with Refero MCP
          </span>
        </div>
      </div>
    </footer>
  );
}
