"use client";

import { forwardRef, type HTMLAttributes } from "react";
import { motion, type Variants } from "motion/react";
import { cn } from "@uilibrary/utils";
import { useReducedMotion } from "@uilibrary/hooks/use-reduced-motion";

/* ─────────────────────────────────────────────────────────────────────────
 * Bento 601 — built strictly to 601 Inc.'s DESIGN.md from styles.refero.design
 *
 * Hard rules from the source MD:
 *   - 3-color palette only: #090909 / #4f4d3c / #ece4b4 (no chromatic accents)
 *   - changeling-neo (substitute Bebas Neue), weight 400, -0.04em tracking
 *   - 4px grid, prefer 9px element gaps, 21-30px paddings
 *   - 11.9952px radius
 *   - Flat planes, no deep shadows, no heavy elevation
 *   - Cinematic framed imagery, contained never full-bleed
 *   - Aged Gold reserved for display + interactive only
 * ─────────────────────────────────────────────────────────────────────── */

const COLORS = {
  midnight: "#090909",
  concrete: "#4f4d3c",
  gold: "#ece4b4",
} as const;

const RADIUS = "11.9952px";
const TRACKING = "-0.04em";

const DISPLAY_FONT =
  "'Bebas Neue', 'changeling-neo', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, sans-serif";

const BODY_FONT =
  "ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, sans-serif";

/* ── Animation — subtle, no overshoot (601 Inc. is restrained) ────────── */

const EASE = [0.16, 1, 0.3, 1] as const;
const grid: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
};
const cell: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
};

export interface Bento601Props extends HTMLAttributes<HTMLElement> {
  number?: string;
  numberLabel?: string;
  manifesto?: string;
  ctaLabel?: string;
  ctaHref?: string;
  imageA?: string;
  imageB?: string;
  stats?: { value: string; label: string }[];
}

export const Bento601 = forwardRef<HTMLElement, Bento601Props>(
  (
    {
      number = "0 1",
      numberLabel = "Independent film studio · Tokyo",
      manifesto = "We make films that ask questions, not the kind that supply answers. Stories shaped by silence, scale, and the architecture of the frame.",
      ctaLabel = "Explore",
      ctaHref = "#",
      imageA = "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=1200&q=80",
      imageB = "https://images.unsplash.com/photo-1518929458119-e5bf444c30f4?w=1200&q=80",
      stats = [
        { value: "12", label: "Films" },
        { value: "08", label: "Awards" },
      ],
      className,
      ...props
    },
    ref,
  ) => {
    const reduced = useReducedMotion();

    return (
      <section
        ref={ref}
        className={cn("relative isolate w-full", className)}
        style={{
          background: COLORS.midnight,
          color: COLORS.gold,
          fontFamily: BODY_FONT,
          padding: "48px",
        }}
        {...props}
      >
        {/* ── Top minimalist nav row ─────────────────────────────────── */}
        <header
          className="mx-auto flex w-full max-w-[1200px] items-center justify-between"
          style={{ marginBottom: "48px" }}
        >
          <span
            style={{
              fontSize: "14px",
              letterSpacing: "0.18em",
              color: COLORS.gold,
            }}
          >
            601&nbsp;INC.
          </span>
          <nav className="flex items-center" style={{ gap: "0px" }}>
            {["Index", "Films", "About"].map((label) => (
              <a
                key={label}
                href="#"
                className="group relative inline-block transition-colors"
                style={{
                  color: COLORS.gold,
                  padding: "12px 21px",
                  fontSize: "14px",
                  letterSpacing: "0.05em",
                }}
              >
                {label}
                <span
                  className="absolute bottom-[8px] left-[21px] right-[21px] h-px scale-x-0 transition-transform duration-200 group-hover:scale-x-100"
                  style={{ background: COLORS.gold, transformOrigin: "left" }}
                />
              </a>
            ))}
          </nav>
        </header>

        {/* ── Bento grid ─────────────────────────────────────────────── */}
        <motion.div
          className="mx-auto grid w-full max-w-[1200px]"
          style={{
            gridTemplateColumns: "repeat(4, 1fr)",
            gridAutoRows: "minmax(180px, auto)",
            gap: "9px",
          }}
          variants={reduced ? undefined : grid}
          initial={reduced ? undefined : "hidden"}
          animate={reduced ? undefined : "visible"}
        >
          {/* Cell 1 — Massive display number (col 1-2, row 1-2) */}
          <motion.div
            variants={reduced ? undefined : cell}
            className="relative col-span-2 row-span-2 flex flex-col justify-between overflow-hidden"
            style={{
              background: COLORS.concrete,
              padding: "21px",
              borderRadius: RADIUS,
            }}
          >
            <span
              style={{
                fontSize: "12px",
                letterSpacing: "0.18em",
                color: COLORS.gold,
                opacity: 0.7,
              }}
            >
              VOL.
            </span>
            <div
              aria-hidden="true"
              style={{
                fontFamily: DISPLAY_FONT,
                fontWeight: 400,
                fontSize: "clamp(160px, 26vw, 280px)",
                letterSpacing: TRACKING,
                lineHeight: 0.85,
                color: COLORS.gold,
                marginTop: "12px",
                marginBottom: "12px",
              }}
            >
              {number}
            </div>
            <p
              style={{
                fontSize: "13px",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: COLORS.gold,
                opacity: 0.6,
              }}
            >
              {numberLabel}
            </p>
          </motion.div>

          {/* Cell 2 — Cinematic photo A (col 3-4, row 1) */}
          <motion.div
            variants={reduced ? undefined : cell}
            className="relative col-span-2 overflow-hidden"
            style={{ borderRadius: RADIUS }}
          >
            <img
              src={imageA}
              alt=""
              className="h-full w-full object-cover"
              style={{ minHeight: "220px" }}
              loading="lazy"
            />
          </motion.div>

          {/* Cells 3 & 4 — Stats (col 3, col 4, row 2) */}
          {stats.slice(0, 2).map((s, i) => (
            <motion.div
              key={i}
              variants={reduced ? undefined : cell}
              className="relative flex flex-col justify-between"
              style={{
                background: COLORS.concrete,
                padding: "21px",
                borderRadius: RADIUS,
              }}
            >
              <span
                style={{
                  fontFamily: DISPLAY_FONT,
                  fontWeight: 400,
                  fontSize: "clamp(80px, 9vw, 130px)",
                  letterSpacing: TRACKING,
                  lineHeight: 0.9,
                  color: COLORS.gold,
                }}
              >
                {s.value}
              </span>
              <span
                style={{
                  fontSize: "12px",
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: COLORS.gold,
                  opacity: 0.55,
                  marginTop: "9px",
                }}
              >
                {s.label}
              </span>
            </motion.div>
          ))}

          {/* Cell 5 — Manifesto + CTA (col 1-2, row 3) */}
          <motion.div
            variants={reduced ? undefined : cell}
            className="relative col-span-2 flex flex-col justify-between"
            style={{
              background: COLORS.concrete,
              padding: "30px 28px",
              borderRadius: RADIUS,
              minHeight: "240px",
            }}
          >
            <p
              style={{
                fontSize: "18px",
                lineHeight: 1.45,
                color: COLORS.gold,
                letterSpacing: "-0.005em",
                maxWidth: "42ch",
              }}
            >
              {manifesto}
            </p>
            <a
              href={ctaHref}
              className="group inline-flex items-center self-start transition-all"
              style={{
                fontSize: "14px",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: COLORS.gold,
                padding: "12px 21px",
                marginTop: "24px",
                border: `1px solid transparent`,
                borderRadius: RADIUS,
                transitionProperty: "border-color",
                transitionDuration: "200ms",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = COLORS.gold)}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = "transparent")}
            >
              {ctaLabel}
              <span style={{ marginLeft: "12px", display: "inline-block", transform: "translateY(-1px)" }}>→</span>
            </a>
          </motion.div>

          {/* Cell 6 — Cinematic photo B (col 3-4, row 3) */}
          <motion.div
            variants={reduced ? undefined : cell}
            className="relative col-span-2 overflow-hidden"
            style={{ borderRadius: RADIUS }}
          >
            <img
              src={imageB}
              alt=""
              className="h-full w-full object-cover"
              style={{ minHeight: "240px" }}
              loading="lazy"
            />
          </motion.div>
        </motion.div>
      </section>
    );
  },
);

Bento601.displayName = "Bento601";
