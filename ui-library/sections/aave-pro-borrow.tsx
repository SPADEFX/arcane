"use client";

import { motion } from "motion/react";
import { cn } from "@uilibrary/utils";
import { WordReveal } from "./aave-pro-word-reveal";

/* ─── Types ──────────────────────────────────── */

export interface AaveProBorrowProps {
  label?: string;
  heading?: string;
  description?: string;
  features?: FeatureCardItem[];
  additionalFeatures?: AdditionalFeatureItem[];
  className?: string;
}

interface FeatureCardItem {
  title: string;
  description: string;
  illustration?: React.ReactNode;
}

interface AdditionalFeatureItem {
  title: string;
  description: string;
  icon?: React.ReactNode;
}

/* ─── Animation constants ────────────────────── */

const ease = [0.22, 1, 0.36, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

/* ─── Default illustrations ──────────────────── */

function RiskPremiumIllustration() {
  return (
    <div
      style={{
        width: "100%",
        height: 180,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, rgba(245,197,67,0.06) 0%, rgba(245,197,67,0.02) 100%)",
        borderRadius: 16,
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Particle dots */}
      {[...Array(20)].map((_, i) => (
        <span
          key={i}
          style={{
            position: "absolute",
            width: 2 + Math.random() * 3,
            height: 2 + Math.random() * 3,
            borderRadius: "50%",
            background: `rgba(245, 197, 67, ${0.15 + Math.random() * 0.3})`,
            top: `${10 + Math.random() * 80}%`,
            left: `${10 + Math.random() * 80}%`,
          }}
        />
      ))}
      {/* Gold asterisk */}
      <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
        <circle cx="40" cy="40" r="32" fill="#F5C543" fillOpacity={0.15} />
        <circle cx="40" cy="40" r="28" fill="#F5C543" fillOpacity={0.1} />
        <path
          d="M40 12V68M12 40H68M18.1 18.1L61.9 61.9M61.9 18.1L18.1 61.9"
          stroke="#F5C543"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <circle cx="40" cy="40" r="6" fill="#F5C543" />
      </svg>
    </div>
  );
}

function IsolatedPositionsIllustration() {
  return (
    <div
      style={{
        width: "100%",
        height: 180,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(255,255,255,0.02)",
        borderRadius: 16,
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Subtle dot grid */}
      {[...Array(12)].map((_, i) => (
        <span
          key={i}
          style={{
            position: "absolute",
            width: 2,
            height: 2,
            borderRadius: "50%",
            background: "rgba(168, 130, 255, 0.15)",
            top: `${15 + Math.random() * 70}%`,
            left: `${15 + Math.random() * 70}%`,
          }}
        />
      ))}
      {/* 4 purple circles in 2x2 grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {[
          { bg: "rgba(140, 120, 220, 0.8)", size: 52 },
          { bg: "rgba(190, 175, 240, 0.7)", size: 52 },
          { bg: "rgba(130, 110, 210, 0.7)", size: 52 },
          { bg: "rgba(180, 170, 240, 0.6)", size: 52 },
        ].map((c, i) => (
          <div
            key={i}
            style={{
              width: c.size,
              height: c.size,
              borderRadius: "50%",
              background: c.bg,
            }}
          />
        ))}
      </div>
    </div>
  );
}

function HealthFactorIllustration() {
  return (
    <div
      style={{
        width: "100%",
        height: 180,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(255,255,255,0.02)",
        borderRadius: 16,
        overflow: "hidden",
      }}
    >
      {/* Health Factor widget card */}
      <div
        style={{
          background: "rgba(255,255,255,0.04)",
          borderRadius: 16,
          padding: "20px 24px",
          width: 280,
          border: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        {/* Heart + value row */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="#4ade80">
            <path d="M10 18s-7-4.35-7-9.5A4.5 4.5 0 0110 4a4.5 4.5 0 017 4.5c0 5.15-7 9.5-7 9.5z" />
          </svg>
          <span style={{ fontSize: 28, fontWeight: 500, color: "#4ade80", letterSpacing: "-0.5px" }}>
            11.1
          </span>
          <span style={{ fontSize: 14, fontWeight: 450, color: "#4ade80" }}>
            +1.50%
          </span>
        </div>
        {/* Rainbow progress bar */}
        <div
          style={{
            height: 6,
            borderRadius: 3,
            background: "linear-gradient(90deg, #ef4444 0%, #f59e0b 30%, #eab308 50%, #22c55e 75%, #10b981 100%)",
            marginBottom: 8,
            position: "relative",
          }}
        >
          {/* Indicator dot */}
          <div
            style={{
              position: "absolute",
              right: "15%",
              top: "50%",
              transform: "translate(50%, -50%)",
              width: 14,
              height: 14,
              borderRadius: "50%",
              background: "#10b981",
              border: "3px solid #0f0f10",
              boxShadow: "0 0 0 1px rgba(16,185,129,0.3)",
            }}
          />
        </div>
        {/* Label */}
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 13, color: "rgba(255,255,255,0.4)" }}>Health Factor</span>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="6" stroke="rgba(255,255,255,0.25)" strokeWidth="1.2"/>
            <path d="M8 7v3M8 5.5v.5" stroke="rgba(255,255,255,0.25)" strokeWidth="1.2" strokeLinecap="round"/>
          </svg>
        </div>
      </div>
    </div>
  );
}

function PositionsMockUI() {
  return (
    <div
      style={{
        width: "100%",
        height: 180,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(255,255,255,0.02)",
        borderRadius: 16,
        overflow: "hidden",
        padding: "16px 20px",
      }}
    >
      <div style={{ width: "100%", maxWidth: 320, display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 14, fontWeight: 500, color: "#fff" }}>Main</span>
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M4 6l4 4 4-4" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>Mainnet</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6" stroke="rgba(255,255,255,0.3)" strokeWidth="1.2"/><path d="M8 5v3l2 1" stroke="rgba(255,255,255,0.3)" strokeWidth="1.2" strokeLinecap="round"/></svg>
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>0</span>
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span style={{ fontSize: 18, fontWeight: 500, color: "#fff" }}>$0.00K</span>
          <span style={{ fontSize: 14, color: "rgba(255,255,255,0.4)" }}>0% APY</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", gap: 0 }}>
            {["ETH", "WBTC", "cbETH", "wstETH"].map((t, i) => (
              <img
                key={t}
                src={`/images/${t}.png`}
                alt={t}
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: "50%",
                  border: "2px solid #1a1a1c",
                  marginLeft: i > 0 ? -8 : 0,
                }}
              />
            ))}
          </div>
          <img
            src="/images/USDT.png"
            alt="USDT"
            style={{ width: 28, height: 28, borderRadius: "50%" }}
          />
        </div>
      </div>
    </div>
  );
}

/* ─── Default feature icon ───────────────────── */

function DefaultFeatureIcon() {
  return (
    <div
      style={{
        width: 40,
        height: 40,
        borderRadius: 10,
        background: "rgba(168, 130, 255, 0.12)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 18 18"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M9 2L10.5 7H16L11.5 10L13 15L9 12L5 15L6.5 10L2 7H7.5L9 2Z"
          fill="#a882ff"
          fillOpacity={0.8}
        />
      </svg>
    </div>
  );
}

/* ─── Default data ───────────────────────────── */

const defaultFeatures: FeatureCardItem[] = [
  {
    title: "Risk Premiums",
    description:
      "Your borrow rate adapts to your collateral quality. Better collateral, lower costs, calculated automatically.",
    illustration: <RiskPremiumIllustration />,
  },
  {
    title: "Manage multiple positions in isolation",
    description:
      "Independent risk parameters, rate curves, and collateral rules per market. All governance-tuned.",
    illustration: <PositionsMockUI />,
  },
  {
    title: "Smarter Liquidations",
    description:
      "Aave Pro restores your position to a target health factor, liquidating only what\u2019s needed.",
    illustration: <IsolatedPositionsIllustration />,
  },
  {
    title: "Real-Time Health Factor",
    description:
      "Monitor position health across every Spoke in real time. Always know where you stand.",
    illustration: <HealthFactorIllustration />,
  },
];

const defaultAdditionalFeatures: AdditionalFeatureItem[] = [];

/* ─── Component ──────────────────────────────── */

export function AaveProBorrow({
  label = "Manage your Position",
  heading = "The smartest way to borrow onchain.",
  description = "Risk-adjusted rates, smarter liquidations, and modular markets.",
  features = defaultFeatures,
  additionalFeatures = defaultAdditionalFeatures,
  className,
}: AaveProBorrowProps) {
  return (
    <section
      className={cn("relative", className)}
      style={{
        backgroundColor: "#0f0f10",
        padding: "100px 48px",
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
        style={{
          maxWidth: 986,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 48,
          alignItems: "start",
        }}
      >
        {/* ── Left column: sticky heading area ── */}
        <div
          style={{
            position: "sticky",
            top: 120,
            paddingRight: 24,
          }}
        >
          <motion.p
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.6, ease }}
            style={{
              fontSize: 16,
              fontWeight: 450,
              lineHeight: "22.4px",
              marginBottom: 16,
              background:
                "linear-gradient(90deg, #9798ff 0%, #e5e5ff 50%, #9798ff 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            {label}
          </motion.p>

          <WordReveal
            text={heading}
            style={{
              fontSize: 40,
              fontWeight: 500,
              color: "#fff",
              lineHeight: "48px",
              letterSpacing: "-1.2px",
              marginBottom: 20,
            }}
            delay={0.08}
          />

          <motion.p
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.6, ease, delay: 0.16 }}
            style={{
              fontSize: 20,
              fontWeight: 400,
              color: "#fff",
              lineHeight: "27.2px",
              margin: 0,
            }}
          >
            {description}
          </motion.p>
        </div>

        {/* ── Right column: feature cards ── */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 24,
          }}
        >
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, ease, delay: i * 0.1 }}
              style={{
                background: "rgba(255,255,255,0.03)",
                borderRadius: 24,
                boxShadow:
                  "rgba(255,255,255,0.1) 0px 0px 0px 1px inset",
                padding: 28,
                display: "flex",
                flexDirection: "column",
                gap: 20,
              }}
            >
              {feature.illustration && (
                <div style={{ marginBottom: 0 }}>
                  {feature.illustration}
                </div>
              )}

              <div>
                <h3
                  style={{
                    fontSize: 20,
                    fontWeight: 450,
                    color: "#fff",
                    margin: "0 0 8px",
                    lineHeight: "27.2px",
                  }}
                >
                  {feature.title}
                </h3>
                <p
                  style={{
                    fontSize: 16,
                    fontWeight: 400,
                    color: "rgba(255,255,255,0.7)",
                    lineHeight: "22.4px",
                    margin: 0,
                  }}
                >
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}

          {/* ── Additional features list ── */}
          {additionalFeatures.length > 0 && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 0,
                marginTop: 8,
              }}
            >
              {additionalFeatures.map((item, i) => (
                <motion.div
                  key={item.title}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{
                    duration: 0.6,
                    ease,
                    delay: i * 0.08,
                  }}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 16,
                    padding: "20px 0",
                    borderBottom:
                      i < additionalFeatures.length - 1
                        ? "1px solid rgba(255,255,255,0.06)"
                        : "none",
                  }}
                >
                  {item.icon ?? <DefaultFeatureIcon />}

                  <div style={{ flex: 1 }}>
                    <h4
                      style={{
                        fontSize: 18,
                        fontWeight: 450,
                        color: "#fff",
                        margin: "0 0 4px",
                        lineHeight: "24px",
                      }}
                    >
                      {item.title}
                    </h4>
                    <p
                      style={{
                        fontSize: 16,
                        fontWeight: 400,
                        color: "rgba(255,255,255,0.7)",
                        lineHeight: "22.4px",
                        margin: 0,
                      }}
                    >
                      {item.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default AaveProBorrow;
