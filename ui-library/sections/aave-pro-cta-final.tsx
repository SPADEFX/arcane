"use client";

import { motion } from "motion/react";
import { cn } from "@uilibrary/utils";

/* ─── Types ──────────────────────────────────── */

export interface AaveProCTAFinalProps {
  title?: string;
  description?: string;
  ctaLabel?: string;
  ctaHref?: string;
  className?: string;
}

/* ─── Ease ───────────────────────────────────── */

const ease = [0.22, 1, 0.36, 1] as const;

/* ─── Ghost Icon ─────────────────────────────── */

function GhostIcon({ size = 28 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      <path
        d="M12 2C7.03 2 3 6.03 3 11v9a1 1 0 001.5.87l1.5-.87 1.5.87a1 1 0 001 0L10 20l1.5.87a1 1 0 001 0L14 20l1.5.87a1 1 0 001 0l1.5-.87 1.5.87A1 1 0 0021 20v-9c0-4.97-4.03-9-9-9z"
        fill="rgba(255, 255, 255, 0.56)"
      />
      <circle cx="9" cy="11" r="1.5" fill="#0f0f10" />
      <circle cx="15" cy="11" r="1.5" fill="#0f0f10" />
    </svg>
  );
}

/* ─── App Mockup ─────────────────────────────── */

function AppMockup() {
  return (
    <div
      className="overflow-hidden"
      style={{
        border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: "12px",
        boxShadow:
          "0 0 60px rgba(0, 0, 0, 0.4), 0 30px 60px rgba(0, 0, 0, 0.3)",
      }}
    >
      <div style={{ backgroundColor: "#0e0e0f" }}>
        {/* Window chrome */}
        <div
          className="flex items-center gap-2 px-3 py-2"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div className="flex gap-1">
            <span
              className="block h-[8px] w-[8px] rounded-full"
              style={{ backgroundColor: "#ff5f57" }}
            />
            <span
              className="block h-[8px] w-[8px] rounded-full"
              style={{ backgroundColor: "#febc2e" }}
            />
            <span
              className="block h-[8px] w-[8px] rounded-full"
              style={{ backgroundColor: "#28c840" }}
            />
          </div>
          <div
            className="mx-auto rounded-md px-8 py-0.5 text-[9px]"
            style={{
              backgroundColor: "rgba(255,255,255,0.04)",
              color: "#444444",
            }}
          >
            pro.aave.com
          </div>
        </div>

        {/* App content */}
        <div className="flex" style={{ minHeight: "260px" }}>
          {/* Sidebar */}
          <div
            className="w-[140px] shrink-0 px-2 py-3"
            style={{ borderRight: "1px solid rgba(255,255,255,0.06)" }}
          >
            <div className="mb-4 flex items-center gap-1.5 px-1.5">
              <svg
                width="10"
                height="10"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden
              >
                <path
                  d="M12 2C7.03 2 3 6.03 3 11v9a1 1 0 001.5.87l1.5-.87 1.5.87a1 1 0 001 0L10 20l1.5.87a1 1 0 001 0L14 20l1.5.87a1 1 0 001 0l1.5-.87 1.5.87A1 1 0 0021 20v-9c0-4.97-4.03-9-9-9z"
                  fill="#9898ff"
                />
              </svg>
              <span
                className="text-[9px] font-semibold"
                style={{ color: "#ffffff" }}
              >
                Aave Pro
              </span>
            </div>
            {["Dashboard", "Activity"].map((item) => (
              <div
                key={item}
                className="mb-0.5 rounded-md px-1.5 py-1 text-[9px]"
                style={{ color: "#555555" }}
              >
                {item}
              </div>
            ))}
            <div
              className="mt-3 mb-1 px-1.5 text-[7px] font-semibold uppercase tracking-widest"
              style={{ color: "#333333" }}
            >
              Explore
            </div>
            {["Deposit", "Borrow"].map((item, i) => (
              <div
                key={item}
                className="mb-0.5 rounded-md px-1.5 py-1 text-[9px]"
                style={{
                  color: i === 0 ? "#ffffff" : "#555555",
                  backgroundColor:
                    i === 0 ? "rgba(255,255,255,0.06)" : "transparent",
                }}
              >
                {item}
              </div>
            ))}
            <div
              className="mt-3 mb-1 px-1.5 text-[7px] font-semibold uppercase tracking-widest"
              style={{ color: "#333333" }}
            >
              Protocol
            </div>
            {["Governance", "Developer Docs"].map((item) => (
              <div
                key={item}
                className="mb-0.5 rounded-md px-1.5 py-1 text-[9px]"
                style={{ color: "#555555" }}
              >
                {item}
              </div>
            ))}
          </div>

          {/* Main content */}
          <div className="flex-1 px-4 py-3">
            <div
              className="mb-1 text-[11px] font-semibold"
              style={{ color: "#ffffff" }}
            >
              Deposit
            </div>
            <div
              className="mb-3 text-[9px]"
              style={{ color: "#444444" }}
            >
              Supply assets and earn interest.
            </div>

            {/* Tabs */}
            <div className="mb-3 flex items-center gap-2">
              {["Featured", "Stablecoins", "All"].map((tab, i) => (
                <span
                  key={tab}
                  className="rounded-full px-2.5 py-0.5 text-[8px]"
                  style={{
                    backgroundColor:
                      i === 0
                        ? "rgba(255,255,255,0.08)"
                        : "rgba(255,255,255,0.03)",
                    color: i === 0 ? "#ffffff" : "#555555",
                  }}
                >
                  {tab}
                </span>
              ))}
            </div>

            {/* Table header */}
            <div
              className="mb-1.5 grid grid-cols-4 gap-1 text-[7px] font-medium uppercase tracking-widest"
              style={{ color: "#333333" }}
            >
              <span>Asset</span>
              <span>Supply APY</span>
              <span>Total Supply</span>
              <span>Liquidity</span>
            </div>

            {/* Table rows */}
            {[
              { name: "USDC", color: "#2775ca", apy: "3.42%", supply: "$55.4M", liquidity: "$12.3M" },
              { name: "USDT", color: "#26a17b", apy: "4.18%", supply: "$45.1K", liquidity: "$8.7K" },
              { name: "ETH", color: "#627eea", apy: "1.89%", supply: "$234M", liquidity: "$45.2M" },
              { name: "WBTC", color: "#f7931a", apy: "0.54%", supply: "$98.7M", liquidity: "$24.1M" },
            ].map((row) => (
              <div
                key={row.name}
                className="grid grid-cols-4 items-center gap-1 py-1.5 text-[8px]"
                style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
              >
                <div className="flex items-center gap-1.5">
                  <span
                    className="block h-[12px] w-[12px] shrink-0 rounded-full"
                    style={{ backgroundColor: row.color }}
                  />
                  <span style={{ color: "#dddddd" }}>{row.name}</span>
                </div>
                <span style={{ color: "#aaaaaa" }}>{row.apy}</span>
                <span style={{ color: "#aaaaaa" }}>{row.supply}</span>
                <span style={{ color: "#aaaaaa" }}>{row.liquidity}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Component ──────────────────────────────── */

export function AaveProCTAFinal({
  title = "Aave Pro",
  description = "Manage your positions, explore opportunities, and access deep liquidity across Aave V4.",
  ctaLabel = "Get Started",
  ctaHref = "#",
  className,
}: AaveProCTAFinalProps) {
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
        className="mx-auto flex flex-col items-center gap-16 md:flex-row md:items-start md:gap-12"
        style={{ maxWidth: "986px" }}
      >
        {/* Left side — text + CTA */}
        <motion.div
          className="flex flex-col md:w-[45%]"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease }}
        >
          {/* Ghost icon + title */}
          <div
            className="flex items-center"
            style={{ gap: "8px", marginBottom: "20px" }}
          >
            <GhostIcon size={28} />
            <h2
              style={{
                fontSize: "40px",
                fontWeight: 500,
                lineHeight: "48px",
                letterSpacing: "-1.2px",
                color: "#ffffff",
                margin: 0,
              }}
            >
              {title}
            </h2>
          </div>

          {/* Description */}
          <p
            style={{
              fontSize: "20px",
              fontWeight: 400,
              lineHeight: "28px",
              color: "rgba(255,255,255,0.7)",
              margin: 0,
              marginBottom: "32px",
            }}
          >
            {description}
          </p>

          {/* CTA */}
          <div>
            <a
              href={ctaHref}
              className="inline-flex items-center justify-center transition-all duration-200 hover:opacity-90 active:scale-[0.97]"
              style={{
                backgroundColor: "#ffffff",
                color: "rgb(15, 15, 16)",
                fontSize: "17px",
                fontWeight: 450,
                lineHeight: "17px",
                letterSpacing: "-0.17px",
                padding: "14px 24px",
                borderRadius: "1584px",
              }}
            >
              {ctaLabel}
            </a>
          </div>
        </motion.div>

        {/* Right side — app mockup */}
        <motion.div
          className="flex-1"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease, delay: 0.15 }}
        >
          <img
            src="/images/aave-pro-mockup.png"
            alt="Aave Pro interface"
            style={{
              width: "100%",
              borderRadius: "16px",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          />
        </motion.div>
      </div>
    </section>
  );
}
