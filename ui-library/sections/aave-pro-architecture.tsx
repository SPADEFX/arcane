"use client";

import { motion } from "motion/react";
import { cn } from "@uilibrary/utils";
import type { ReactNode } from "react";
import { WordReveal } from "./aave-pro-word-reveal";

/* ─── Types ──────────────────────────────────── */

export interface AaveProArchitectureItem {
  icon: ReactNode;
  title: string;
  description: string;
}

export interface AaveProArchitectureProps {
  label?: string;
  heading?: string;
  headingHighlight?: string[];
  description?: string;
  items?: AaveProArchitectureItem[];
  ctaLabel?: string;
  ctaHref?: string;
  className?: string;
}

/* ─── Default Icons (24x24 stroke-based) ─────── */

const IconGrid = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="rgba(255,255,255,0.5)"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="12" y1="3" x2="12" y2="21" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <rect x="3" y="3" width="18" height="18" rx="2" />
  </svg>
);

const IconBlocks = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="rgba(255,255,255,0.5)"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="3" width="8" height="8" rx="1.5" />
    <rect x="13" y="3" width="8" height="8" rx="1.5" />
    <rect x="3" y="13" width="8" height="8" rx="1.5" />
    <rect x="13" y="13" width="8" height="8" rx="1.5" />
  </svg>
);

const IconUser = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="rgba(255,255,255,0.5)"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="8" r="4" />
    <path d="M4 20c0-3.314 3.582-6 8-6s8 2.686 8 6" />
  </svg>
);

const IconTarget = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="rgba(255,255,255,0.5)"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="9" />
    <circle cx="12" cy="12" r="5" />
    <circle cx="12" cy="12" r="1" />
  </svg>
);

const IconChart = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="rgba(255,255,255,0.5)"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="4 18 8 10 12 14 16 6 20 12" />
    <line x1="4" y1="21" x2="20" y2="21" />
  </svg>
);

/* ─── Default Data ───────────────────────────── */

const defaultItems: AaveProArchitectureItem[] = [
  {
    icon: <IconGrid />,
    title: "Unified Liquidity",
    description:
      "Deep liquidity per Hub, with governed credit lines connecting them.",
  },
  {
    icon: <IconBlocks />,
    title: "Modular Markets",
    description:
      "Each market has its own risk rules, rate curves, and solvency boundary.",
  },
  {
    icon: <IconUser />,
    title: "User Risk Premium",
    description:
      "Borrow costs adjust based on collateral quality. Better collateral, lower rates.",
  },
  {
    icon: <IconTarget />,
    title: "Target Health Liquidations",
    description:
      "Positions are restored to a target health factor and only liquidate what\u2019s needed.",
  },
  {
    icon: <IconChart />,
    title: "Share-Based Accounting",
    description:
      "Hold shares that appreciate over time instead of rebasing balances. optimized and tax-efficient.",
  },
];

/* ─── Animation config ───────────────────────── */

const ease = [0.22, 1, 0.36, 1] as const;

/* ─── Component ──────────────────────────────── */

export function AaveProArchitecture({
  label = "Architecture",
  heading = "Built on Aave V4.",
  headingHighlight = ["Aave", "V4."],
  description = "Unified liquidity, modular risk, smarter execution.",
  items = defaultItems,
  ctaLabel = "Learn More",
  ctaHref = "#",
  className,
}: AaveProArchitectureProps) {
  return (
    <section
      className={cn("relative flex flex-col items-center", className)}
      style={{
        padding: "100px 48px",
        backgroundColor: "#0f0f10",
      }}
    >
      {/* Section separator */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 48,
          right: 48,
          height: 1,
          background: "rgba(255,255,255,0.1)",
        }}
      />
      <div
        className="relative z-10 flex flex-col w-full"
        style={{ maxWidth: "986px", margin: "0 auto" }}
      >
        {/* Section label */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease }}
          style={{
            fontSize: "16px",
            fontWeight: 450,
            lineHeight: "24px",
            margin: 0,
            background: "linear-gradient(90deg, #9798ff 0%, #e5e5ff 50%, #9798ff 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          {label}
        </motion.p>

        {/* Heading */}
        <WordReveal
          text={heading}
          highlight={headingHighlight}
          style={{
            fontSize: "40px",
            fontWeight: 500,
            lineHeight: "48px",
            letterSpacing: "-1.2px",
            color: "#ffffff",
            marginTop: "12px",
          }}
          delay={0.05}
        />

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease, delay: 0.1 }}
          style={{
            fontSize: "20px",
            fontWeight: 400,
            lineHeight: "28px",
            color: "#ffffff",
            margin: "16px 0 0",
          }}
        >
          {description}
        </motion.p>

        {/* Feature list */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease, delay: 0.15 }}
          style={{
            marginTop: "48px",
            borderTop: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          {items.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{
                duration: 0.6,
                ease,
                delay: 0.08 * index,
              }}
              style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                gap: "40px",
                padding: "24px 0",
                borderBottom: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              {/* Left: Icon + Title */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  flexShrink: 0,
                  minWidth: "240px",
                }}
              >
                <span style={{ flexShrink: 0, display: "flex" }}>
                  {item.icon}
                </span>
                <span
                  style={{
                    fontSize: "18px",
                    fontWeight: 450,
                    color: "#ffffff",
                    whiteSpace: "nowrap",
                  }}
                >
                  {item.title}
                </span>
              </div>

              {/* Right: Description */}
              <p
                style={{
                  fontSize: "16px",
                  fontWeight: 400,
                  color: "rgba(255,255,255,0.7)",
                  lineHeight: "22.4px",
                  margin: 0,
                  maxWidth: "520px",
                }}
              >
                {item.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.6, ease, delay: 0.3 }}
          style={{ marginTop: "40px" }}
        >
          <a
            href={ctaHref}
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "14px 24px",
              borderRadius: "1584px",
              boxShadow: "rgb(255,255,255) 0px 0px 0px 1.5px inset",
              color: "#ffffff",
              fontSize: "17px",
              fontWeight: 450,
              textDecoration: "none",
              background: "transparent",
              cursor: "pointer",
              transition: "background 0.2s ease",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.background =
                "rgba(255,255,255,0.06)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.background =
                "transparent";
            }}
          >
            {ctaLabel}
          </a>
        </motion.div>
      </div>
    </section>
  );
}
