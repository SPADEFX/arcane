"use client";

import { type ReactNode } from "react";
import { motion } from "motion/react";
import { cn } from "@uilibrary/utils";
import { WordReveal } from "./aave-pro-word-reveal";

/* ─── Types ──────────────────────────────────── */

export interface MarketCard {
  /** e.g. "Main" */
  name: string;
  /** e.g. "Core Hub" */
  hub: string;
  description: string;
  /** Token tickers shown as pill badges */
  tokens?: string[];
  /** Stats rows, e.g. [{ label: "Collateral factor", value: "85%" }] */
  stats?: { label: string; value: string | ReactNode }[];
}

export interface AaveProMarketsProps {
  label?: string;
  heading?: string;
  description?: string;
  mainMarket?: MarketCard;
  sideMarkets?: MarketCard[];
  className?: string;
}

/* ─── Defaults ───────────────────────────────── */

const defaultMainMarket: MarketCard = {
  name: "Main",
  hub: "Core Hub",
  description:
    "The broadest market on Aave with competitive rates across a wide range of collateral.",
  tokens: [
    "AAVE",
    "USDC",
    "wETH",
    "wBTC",
    "USDT",
    "GHO",
    "weETH",
    "wstETH",
    "cbBTC",
    "LINK",
    "cbETH",
  ],
  stats: [
    { label: "Collateral factor", value: "85%" },
    { label: "Collateral risk", value: "0.00%" },
  ],
};

const defaultSideMarkets: MarketCard[] = [
  {
    name: "Bluechip",
    hub: "Prime Hub",
    description: "Supply assets and borrow stablecoins against them, with the assurance that your collateral isn\u2019t lent out.",
    tokens: ["wETH", "wBTC", "USDC", "USDT"],
  },
  {
    name: "Ethena Correlated",
    hub: "Plus Hub",
    description: "Borrow USDe against Ethena assets like USDe, sUSDe, and sUSDe Pendle tokens for looping.",
    tokens: ["USDe", "sUSDe", "ENA"],
  },
];

/* ─── Animation ──────────────────────────────── */

const ease = [0.22, 1, 0.36, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease },
  },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

/* ─── Helpers ────────────────────────────────── */

/** Small colored dot for token badges */
function tokenColor(ticker: string): string {
  const map: Record<string, string> = {
    AAVE: "#B6509E",
    USDC: "#2775CA",
    wETH: "#627EEA",
    wBTC: "#F7931A",
    USDT: "#26A17B",
    GHO: "#56B4A9",
    weETH: "#7C3AED",
    wstETH: "#00A3FF",
    cbBTC: "#0052FF",
    LINK: "#2A5ADA",
    cbETH: "#0052FF",
    USDe: "#1E90FF",
    sUSDe: "#3B82F6",
    ENA: "#8B5CF6",
  };
  return map[ticker] ?? "rgba(255,255,255,0.3)";
}

/* ─── Token Badge ────────────────────────────── */

function TokenBadge({ ticker }: { ticker: string }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        padding: "4px 10px",
        borderRadius: "100px",
        background: "rgba(255,255,255,0.06)",
        fontSize: "13px",
        fontWeight: 450,
        color: "rgba(255,255,255,0.8)",
        letterSpacing: "-0.13px",
        lineHeight: "18px",
      }}
    >
      <img
        src={`/images/${ticker === "wETH" ? "WETH" : ticker === "wBTC" ? "WBTC" : ticker}.png`}
        alt={ticker}
        style={{
          width: "18px",
          height: "18px",
          borderRadius: "50%",
          flexShrink: 0,
        }}
        onError={(e) => {
          // Fallback to colored dot
          const el = e.currentTarget;
          el.style.display = "none";
          const dot = document.createElement("span");
          dot.style.cssText = `width:8px;height:8px;border-radius:50%;background:${tokenColor(ticker)};flex-shrink:0;display:inline-block`;
          el.parentElement?.insertBefore(dot, el);
        }}
      />
      {ticker}
    </span>
  );
}

/* ─── Market Tabs ────────────────────────────── */

function MarketTabs({
  active,
}: {
  active: string;
}) {
  const tabs = ["Main", "Core"];
  return (
    <div
      style={{
        display: "flex",
        gap: "2px",
        padding: "2px",
        borderRadius: "10px",
        background: "rgba(255,255,255,0.06)",
        width: "fit-content",
      }}
    >
      {tabs.map((tab) => (
        <div
          key={tab}
          style={{
            padding: "6px 14px",
            borderRadius: "8px",
            fontSize: "13px",
            fontWeight: 500,
            color:
              tab === active
                ? "rgba(255,255,255,0.95)"
                : "rgba(255,255,255,0.4)",
            background:
              tab === active ? "rgba(255,255,255,0.1)" : "transparent",
            cursor: "pointer",
            letterSpacing: "-0.13px",
            transition: "all 0.15s ease",
          }}
        >
          {tab}
        </div>
      ))}
    </div>
  );
}

/* ─── Stat Row ───────────────────────────────── */

function StatRow({
  label,
  value,
}: {
  label: string;
  value: string | ReactNode;
}) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "10px 0",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <span
        style={{
          fontSize: "14px",
          fontWeight: 400,
          color: "rgba(255,255,255,0.5)",
          letterSpacing: "-0.14px",
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontSize: "14px",
          fontWeight: 500,
          color: "rgba(255,255,255,0.9)",
          letterSpacing: "-0.14px",
        }}
      >
        {value}
      </span>
    </div>
  );
}

/* ─── Borrowable Assets Row ──────────────────── */

function BorrowableAssetsRow() {
  const colors = ["#2775CA", "#26A17B", "#56B4A9"];
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "10px 0",
      }}
    >
      <span
        style={{
          fontSize: "14px",
          fontWeight: 400,
          color: "rgba(255,255,255,0.5)",
          letterSpacing: "-0.14px",
        }}
      >
        Borrowable assets
      </span>
      <div style={{ display: "flex", gap: "0px" }}>
        {colors.map((c, i) => (
          <span
            key={i}
            style={{
              width: "22px",
              height: "22px",
              borderRadius: "50%",
              background: c,
              border: "2px solid #1a1a1c",
              marginLeft: i > 0 ? "-6px" : "0",
            }}
          />
        ))}
      </div>
    </div>
  );
}

/* ─── Side Market Card ───────────────────────── */

function SideMarketCard({ market }: { market: MarketCard }) {
  return (
    <div
      style={{
        padding: "24px 24px",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
      }}
    >
      <div
        style={{
          fontSize: "18px",
          fontWeight: 450,
          letterSpacing: "-0.18px",
          color: "white",
        }}
      >
        {market.name}
        <span style={{ color: "rgba(255,255,255,0.4)" }}>
          {" "}
          • {market.hub}
        </span>
      </div>
      <p
        style={{
          fontSize: "16px",
          fontWeight: 400,
          color: "rgba(255,255,255,0.7)",
          lineHeight: "22.4px",
          letterSpacing: "-0.16px",
          margin: 0,
          maxWidth: "300px",
        }}
      >
        {market.description}
      </p>
      {market.tokens && market.tokens.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
          {market.tokens.map((t) => (
            <TokenBadge key={t} ticker={t} />
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Main Component ─────────────────────────── */

export function AaveProMarkets({
  label = "Risk Adjusted Markets",
  heading = "Markets for every strategy.",
  description = "Deposit and borrow from multiple markets, each with its own assets, rates, and risk profile. Pick the one that fits your strategy — or use several at once.",
  mainMarket = defaultMainMarket,
  sideMarkets = defaultSideMarkets,
  className,
}: AaveProMarketsProps) {
  return (
    <section
      className={cn("relative", className)}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "100px 48px",
        background: "transparent",
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
      {/* ── Header ──────────────────────────── */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={stagger}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "16px",
          marginBottom: "56px",
          textAlign: "center",
        }}
      >
        {/* Label with gradient */}
        <motion.span
          variants={fadeUp}
          style={{
            fontSize: "16px",
            fontWeight: 450,
            letterSpacing: "-0.16px",
            background:
              "linear-gradient(90deg, #9798ff 0%, #e5e5ff 50%, #9798ff 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          {label}
        </motion.span>

        {/* Heading */}
        <WordReveal
          text={heading}
          style={{
            fontSize: "40px",
            fontWeight: 500,
            color: "white",
            lineHeight: "48px",
            letterSpacing: "-1.2px",
            width: "736px",
            maxWidth: "100%",
          }}
          delay={0.1}
        />

        {/* Description */}
        <motion.p
          variants={fadeUp}
          style={{
            fontSize: "20px",
            fontWeight: 400,
            color: "white",
            lineHeight: "27.2px",
            letterSpacing: "-0.2px",
            width: "736px",
            maxWidth: "100%",
            margin: 0,
            opacity: 0.7,
          }}
        >
          {description}
        </motion.p>
      </motion.div>

      {/* ── Cards Grid ──────────────────────── */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        variants={stagger}
        style={{
          display: "grid",
          gridTemplateColumns: "601px 361px",
          gap: "24px",
          maxWidth: "986px",
          width: "100%",
        }}
      >
        {/* ── Left Card (Main Market) ─────── */}
        <motion.div
          variants={fadeUp}
          style={{
            background: "rgba(255,255,255,0.03)",
            borderRadius: "24px",
            boxShadow: "rgba(255,255,255,0.1) 0px 0px 0px 1px inset",
            padding: "32px 24px",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "20px",
          }}
        >

          {/* LEFT COLUMN: Interactive stats panel */}
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              background: "rgba(255,255,255,0.03)",
              borderRadius: "16px",
              padding: "4px 16px",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            {/* Use as collateral toggle */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "10px 0",
                borderBottom: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <span
                style={{
                  fontSize: "14px",
                  fontWeight: 400,
                  color: "rgba(255,255,255,0.5)",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                Use as collateral
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6" stroke="rgba(255,255,255,0.25)" strokeWidth="1.2"/><path d="M8 7v3M8 5.5v.5" stroke="rgba(255,255,255,0.25)" strokeWidth="1.2" strokeLinecap="round"/></svg>
              </span>
              <span
                style={{
                  fontSize: "13px",
                  fontWeight: 500,
                  color: "#4ade80",
                  background: "rgba(74,222,128,0.1)",
                  padding: "2px 10px",
                  borderRadius: "999px",
                }}
              >
                Enabled
              </span>
            </div>
            {mainMarket.stats && mainMarket.stats.map((s, i) => (
              <StatRow key={i} label={s.label} value={s.value} />
            ))}
            {/* Borrowable assets with token images + overflow */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "10px 0",
                borderBottom: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <span
                style={{
                  fontSize: "14px",
                  fontWeight: 400,
                  color: "rgba(255,255,255,0.5)",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                Borrowable assets
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6" stroke="rgba(255,255,255,0.25)" strokeWidth="1.2"/><path d="M8 7v3M8 5.5v.5" stroke="rgba(255,255,255,0.25)" strokeWidth="1.2" strokeLinecap="round"/></svg>
              </span>
              <div style={{ display: "flex", alignItems: "center" }}>
                {["#2775CA", "#26A17B", "#56B4A9", "#F7931A", "#627EEA"].map((c, i) => (
                  <span
                    key={i}
                    style={{
                      width: "22px",
                      height: "22px",
                      borderRadius: "50%",
                      background: c,
                      border: "2px solid #1a1a1c",
                      marginLeft: i > 0 ? "-6px" : "0",
                    }}
                  />
                ))}
                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: 500,
                    color: "rgba(255,255,255,0.5)",
                    marginLeft: "6px",
                  }}
                >
                  +6
                </span>
              </div>
            </div>
            {/* Market row */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "10px 0",
              }}
            >
              <span
                style={{
                  fontSize: "14px",
                  fontWeight: 400,
                  color: "rgba(255,255,255,0.5)",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                Market
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6" stroke="rgba(255,255,255,0.25)" strokeWidth="1.2"/><path d="M8 7v3M8 5.5v.5" stroke="rgba(255,255,255,0.25)" strokeWidth="1.2" strokeLinecap="round"/></svg>
              </span>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <MarketTabs active="Main" />
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M6 4l4 4-4 4" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
            </div>
          </div>

          </div>

          {/* RIGHT COLUMN: Title + desc + tokens */}
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "flex-end", gap: "16px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <div
                  style={{
                    fontSize: "18px",
                    fontWeight: 450,
                    letterSpacing: "-0.18px",
                    color: "white",
                  }}
                >
                  {mainMarket.name}
                  <span style={{ color: "rgba(255,255,255,0.4)" }}>
                    {" "}• {mainMarket.hub}
                  </span>
                </div>
                <p
                  style={{
                    fontSize: "16px",
                    fontWeight: 400,
                    color: "rgba(255,255,255,0.7)",
                    lineHeight: "22.4px",
                    letterSpacing: "-0.16px",
                    margin: 0,
                  }}
                >
                  {mainMarket.description}
                </p>
              </div>
              <MarketTabs active="Main" />
            </div>
            {/* Token badges */}
            {mainMarket.tokens && mainMarket.tokens.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                {mainMarket.tokens.map((t) => (
                  <TokenBadge key={t} ticker={t} />
                ))}
              </div>
            )}
          </div>
        </motion.div>

        {/* ── Right Side (Stacked Cards) ──── */}
        <motion.div
          variants={fadeUp}
          style={{
            background: "rgba(255,255,255,0.03)",
            borderRadius: "24px",
            boxShadow: "rgba(255,255,255,0.1) 0px 0px 0px 1px inset",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          {sideMarkets.map((market, i) => (
            <div key={i}>
              {i > 0 && (
                <hr
                  style={{
                    border: "none",
                    borderTop: "1px solid rgba(255,255,255,0.08)",
                    margin: 0,
                  }}
                />
              )}
              <SideMarketCard market={market} />
            </div>
          ))}
          <hr
            style={{
              border: "none",
              borderTop: "1px solid rgba(255,255,255,0.08)",
              margin: 0,
            }}
          />
          <div
            style={{
              padding: "24px",
              display: "flex",
              flexDirection: "column",
              gap: "8px",
            }}
          >
            <div
              style={{
                fontSize: "18px",
                fontWeight: 450,
                letterSpacing: "-0.18px",
                color: "white",
              }}
            >
              +11 more markets available
            </div>
            <p
              style={{
                fontSize: "16px",
                fontWeight: 400,
                color: "rgba(255,255,255,0.7)",
                lineHeight: "22.4px",
                letterSpacing: "-0.16px",
                margin: 0,
                maxWidth: "300px",
              }}
            >
              From stablecoin forex to leveraged staking and tokenized gold. New markets are added by governance over time.
            </p>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
