"use client";

import { motion } from "motion/react";
import { cn } from "@uilibrary/utils";
import { WordReveal } from "./aave-pro-word-reveal";

/* ─── Types ──────────────────────────────────── */

export interface AaveProSwapProps {
  /** Section label */
  label?: string;
  /** Main heading — the word "one" is styled differently */
  heading?: string;
  /** Description paragraph */
  description?: string;
  /** Swap card sell amount */
  sellAmount?: string;
  /** Swap card sell token */
  sellToken?: string;
  /** Swap card sell token icon color (for placeholder) */
  sellTokenColor?: string;
  /** Swap card sell balance */
  sellBalance?: string;
  /** Swap card receive amount */
  receiveAmount?: string;
  /** Swap card receive token */
  receiveToken?: string;
  /** Swap card receive token icon color (for placeholder) */
  receiveTokenColor?: string;
  /** Bottom note line */
  bottomNote?: string;
  /** Additional class name */
  className?: string;
}

interface FeatureItem {
  title: string;
  description: string;
  comingSoon?: boolean;
}

const ease = [0.22, 1, 0.36, 1] as const;

const defaultFeatures: FeatureItem[] = [
  {
    title: "Collateral Swap",
    description:
      "Convert supplied assets to a different token without withdrawing.",
    comingSoon: true,
  },
  {
    title: "Debt Swap",
    description: "Switch borrowed debt from one token to another in a single step.",
    comingSoon: true,
  },
  {
    title: "Repay with Collateral",
    description:
      "Use any supplied position to pay down debt directly, no external swaps needed.",
    comingSoon: true,
  },
];

/* ─── Sub-components ──────────────────────────── */

function TokenIcon({
  token,
  color,
  size = 28,
}: {
  token: string;
  color: string;
  size?: number;
}) {
  return (
    <img
      src={`/images/${token}.png`}
      alt={token}
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        flexShrink: 0,
      }}
      onError={(e) => {
        // Fallback to colored circle with letter
        const el = e.currentTarget as HTMLImageElement;
        el.style.display = "none";
        const div = document.createElement("div");
        div.style.cssText = `width:${size}px;height:${size}px;border-radius:50%;background:${color};display:flex;align-items:center;justify-content:center;font-size:${size * 0.36}px;font-weight:600;color:#fff;flex-shrink:0`;
        div.textContent = token.charAt(0);
        el.parentElement?.insertBefore(div, el);
      }}
    />
  );
}

function ComingSoonBadge() {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "2px 8px",
        borderRadius: 999,
        fontSize: 12,
        fontWeight: 500,
        lineHeight: "18px",
        color: "rgba(255,255,255,0.6)",
        background: "rgba(255,255,255,0.06)",
        border: "1px solid rgba(255,255,255,0.08)",
        marginLeft: 8,
        whiteSpace: "nowrap",
      }}
    >
      Coming soon
    </span>
  );
}

function SwapCard({
  sellAmount,
  sellToken,
  sellTokenColor,
  sellBalance,
  receiveAmount,
  receiveToken,
  receiveTokenColor,
}: {
  sellAmount: string;
  sellToken: string;
  sellTokenColor: string;
  sellBalance: string;
  receiveAmount: string;
  receiveToken: string;
  receiveTokenColor: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, ease }}
      style={{
        background: "rgba(255,255,255,0.03)",
        borderRadius: 24,
        boxShadow: "rgba(255,255,255,0.1) 0px 0px 0px 1px inset",
        padding: 24,
        width: "100%",
        maxWidth: 420,
        display: "flex",
        flexDirection: "column",
        gap: 4,
      }}
    >
      {/* Sell field */}
      <div
        style={{
          background: "rgba(255,255,255,0.03)",
          borderRadius: 16,
          padding: "16px 16px 14px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 8,
          }}
        >
          <span
            style={{
              fontSize: 14,
              fontWeight: 400,
              color: "rgba(255,255,255,0.5)",
            }}
          >
            Sell
          </span>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span
            style={{
              fontSize: 32,
              fontWeight: 500,
              color: "#fff",
              letterSpacing: "-0.5px",
              lineHeight: "38px",
            }}
          >
            {sellAmount}
          </span>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              background: "rgba(255,255,255,0.06)",
              borderRadius: 999,
              padding: "6px 12px 6px 8px",
            }}
          >
            <TokenIcon token={sellToken} color={sellTokenColor} size={24} />
            <span style={{ fontSize: 15, fontWeight: 500, color: "#fff" }}>
              {sellToken}
            </span>
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2.5 4l2.5 2.5L7.5 4" stroke="rgba(255,255,255,0.4)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
        </div>
        {/* Price + balance row */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: 8,
          }}
        >
          <span style={{ fontSize: 13, color: "rgba(255,255,255,0.35)", display: "flex", alignItems: "center", gap: 4 }}>
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M8 1v14M4 5l4-4 4 4M4 11l4 4 4-4" stroke="rgba(255,255,255,0.3)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            ${Number(sellAmount.replace(/,/g, "")).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
          <span style={{ fontSize: 13, color: "rgba(255,255,255,0.4)" }}>
            Balance: {sellBalance} | <strong style={{ color: "rgba(255,255,255,0.7)", fontWeight: 600 }}>Max</strong>
          </span>
        </div>
      </div>

      {/* Arrow divider */}
      <div style={{ display: "flex", justifyContent: "center", padding: "4px 0" }}>
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 12,
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.08)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            style={{ transform: "rotate(180deg)" }}
          >
            <path
              d="M8 3v10M4 9l4 4 4-4"
              stroke="rgba(255,255,255,0.6)"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      {/* Receive field */}
      <div
        style={{
          background: "rgba(255,255,255,0.03)",
          borderRadius: 16,
          padding: "16px 16px 14px",
        }}
      >
        <div style={{ marginBottom: 8 }}>
          <span
            style={{
              fontSize: 14,
              fontWeight: 400,
              color: "rgba(255,255,255,0.5)",
            }}
          >
            Receive
          </span>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span
            style={{
              fontSize: 32,
              fontWeight: 500,
              color: "#fff",
              letterSpacing: "-0.5px",
              lineHeight: "38px",
            }}
          >
            {receiveAmount}
          </span>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              background: "rgba(255,255,255,0.06)",
              borderRadius: 999,
              padding: "6px 12px 6px 8px",
            }}
          >
            <TokenIcon
              token={receiveToken}
              color={receiveTokenColor}
              size={24}
            />
            <span style={{ fontSize: 15, fontWeight: 500, color: "#fff" }}>
              {receiveToken}
            </span>
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2.5 4l2.5 2.5L7.5 4" stroke="rgba(255,255,255,0.4)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
        </div>
        {/* Price + market value row */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: 8,
          }}
        >
          <span style={{ fontSize: 13, color: "rgba(255,255,255,0.35)", display: "flex", alignItems: "center", gap: 4 }}>
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M8 1v14M4 5l4-4 4 4M4 11l4 4 4-4" stroke="rgba(255,255,255,0.3)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            $0.00
          </span>
          <span style={{ fontSize: 13, color: "rgba(255,255,255,0.4)" }}>
            Market Value: {receiveAmount}
          </span>
        </div>
      </div>

      {/* Bottom info */}
      <div
        style={{
          marginTop: 16,
          padding: "12px 16px",
          background: "rgba(255,255,255,0.02)",
          borderRadius: 12,
          display: "flex",
          flexDirection: "column",
          gap: 4,
        }}
      >
        <span style={{ fontSize: 14, fontWeight: 500, color: "#fff" }}>
          Token Swap
        </span>
        <span
          style={{
            fontSize: 13,
            fontWeight: 400,
            color: "rgba(255,255,255,0.45)",
          }}
        >
          Swap any supported token directly within the protocol. No external DEX needed.
        </span>
        <span
          style={{
            fontSize: 12,
            fontWeight: 400,
            color: "rgba(255,255,255,0.35)",
            marginTop: 2,
          }}
        >
          {sellToken} &rarr; {receiveToken} in one gasless transaction
        </span>
      </div>
    </motion.div>
  );
}

function FeatureRow({ feature, index }: { feature: FeatureItem; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6, delay: index * 0.1, ease }}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 6,
        padding: "20px 0",
        borderBottom:
          index < defaultFeatures.length - 1
            ? "1px solid rgba(255,255,255,0.06)"
            : "none",
      }}
    >
      <div style={{ display: "flex", alignItems: "center" }}>
        <span
          style={{
            fontSize: 20,
            fontWeight: 450,
            color: "#fff",
            lineHeight: "28px",
          }}
        >
          {feature.title}
        </span>
        {feature.comingSoon && <ComingSoonBadge />}
      </div>
      <p
        style={{
          fontSize: 16,
          fontWeight: 400,
          color: "rgba(255,255,255,0.7)",
          lineHeight: "24px",
          margin: 0,
        }}
      >
        {feature.description}
      </p>
    </motion.div>
  );
}

/* ─── Main Component ──────────────────────────── */

export function AaveProSwap({
  label = "Swap",
  heading = "Rebalance in one step.",
  description = "Swap collateral, switch debt, or repay with your supply. Gasless, via signed intents.",
  sellAmount = "30,834",
  sellToken = "USDC",
  sellTokenColor = "#2775CA",
  sellBalance = "40,022.09",
  receiveAmount = "40",
  receiveToken = "AAVE",
  receiveTokenColor = "#B6509E",
  bottomNote = "All swaps via signed intents, no gas \u00b7 MEV protection and optimal pricing via CoW Protocol.",
  className,
}: AaveProSwapProps) {
  return (
    <section
      className={cn("relative", className)}
      style={{
        padding: "100px 48px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* Top divider */}
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
          width: "100%",
          display: "flex",
          flexDirection: "column",
          gap: 56,
        }}
      >
        {/* Header area */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Section label */}
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, ease }}
            style={{
              fontSize: 16,
              fontWeight: 450,
              background:
                "linear-gradient(90deg, #9798ff 0%, #e5e5ff 50%, #9798ff 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              width: "fit-content",
            }}
          >
            {label}
          </motion.span>

          {/* Heading */}
          <WordReveal
            text={heading}
            style={{
              fontSize: 40,
              fontWeight: 500,
              color: "#fff",
              lineHeight: "48px",
              letterSpacing: "-1.2px",
            }}
            delay={0.05}
          />

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.6, delay: 0.1, ease }}
            style={{
              fontSize: 20,
              fontWeight: 400,
              color: "#fff",
              lineHeight: "27.2px",
              margin: 0,
              maxWidth: 560,
            }}
          >
            {description}
          </motion.p>
        </div>

        {/* Content area: swap card + features */}
        <div
          style={{
            display: "flex",
            gap: 48,
            alignItems: "flex-start",
            flexWrap: "wrap",
          }}
        >
          {/* Left: Swap UI mockup */}
          <div style={{ flex: "1 1 380px", minWidth: 320 }}>
            <SwapCard
              sellAmount={sellAmount}
              sellToken={sellToken}
              sellTokenColor={sellTokenColor}
              sellBalance={sellBalance}
              receiveAmount={receiveAmount}
              receiveToken={receiveToken}
              receiveTokenColor={receiveTokenColor}
            />
          </div>

          {/* Right: Feature descriptions */}
          <div style={{ flex: "1 1 380px", minWidth: 320 }}>
            {defaultFeatures.map((feature, i) => (
              <FeatureRow key={feature.title} feature={feature} index={i} />
            ))}
          </div>
        </div>

        {/* Bottom note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.6, delay: 0.2, ease }}
          style={{
            fontSize: 14,
            fontWeight: 400,
            color: "rgba(255,255,255,0.4)",
            lineHeight: "20px",
            margin: 0,
            textAlign: "center",
          }}
        >
          {bottomNote}
        </motion.p>
      </div>
    </section>
  );
}

export default AaveProSwap;
