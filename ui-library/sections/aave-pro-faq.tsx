"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@uilibrary/utils";

/* ─── Types ──────────────────────────────────── */

export interface AaveProFAQItem {
  question: string;
  answer: string;
}

export interface AaveProFAQProps {
  items?: AaveProFAQItem[];
  learnMoreHref?: string;
  className?: string;
}

/* ─── Defaults ───────────────────────────────── */

const defaultItems: AaveProFAQItem[] = [
  {
    question: "What is Aave Pro?",
    answer:
      "Aave Pro is the full-featured lending and borrowing interface for Aave\u2019s modular markets. Earn yield, borrow against your assets, and manage positions across multiple risk profiles, all in one place.",
  },
  {
    question: "What is a market?",
    answer:
      "A market is where you deposit and borrow. Each market has its own collateral rules, borrowable assets, rates, and health factor. Main is the general-purpose market. Others \u2014 like Lido, Gold, and Forex \u2014 are specialized for specific strategies.",
  },
  {
    question: "How do I choose a market?",
    answer:
      "It depends on what you want to do. Main supports the broadest set of assets and is the default for most users. Specialized markets offer optimized parameters for specific strategies \u2014 like leveraging wstETH against ETH (Lido) or borrowing stablecoins against gold (Gold). You can use multiple markets at the same time.",
  },
  {
    question: "What about Prime, Core, and Plus?",
    answer:
      "Those are Hubs \u2014 the liquidity layer underneath markets. Core Hub is where Main and most other markets live. Prime Hub is for suppliers who want non-borrowable blue-chip collateral. Plus Hub supports strategy-specific activity. You don\u2019t choose a Hub directly \u2014 you choose a market, and it\u2019s connected to a Hub.",
  },
  {
    question: "Does my health factor cover all my positions?",
    answer:
      "No, each market has its own health factor. If you deposit into Main and Gold, those are two separate positions with separate health factors. Activity in one market doesn\u2019t affect the other.",
  },
  {
    question: "How are borrow rates determined?",
    answer:
      "Your borrow rate depends on market utilization plus a risk premium based on your collateral quality. Higher-quality collateral earns a lower premium, so you pay less to borrow. Rates adjust automatically as conditions change.",
  },
  {
    question: "What are risk premiums?",
    answer:
      "Risk Premiums allow the protocol to price risk more precisely. Instead of applying the same parameters to all assets, Aave v4 introduces dynamic premiums that reflect the unique risk profile of each market. By aligning borrowing costs with risk, the system becomes more resilient while enabling broader asset support and more efficient capital across the protocol.",
  },
  {
    question: "What are position swaps?",
    answer:
      "Position swaps let you swap collateral, switch debt tokens, or repay debt using your supplied assets \u2014 all in a single gasless transaction. No need to withdraw, swap on a DEX, and re-deposit manually.",
  },
  {
    question: "What is share-based accounting?",
    answer:
      "Instead of your token balance rebasing constantly, you hold a fixed number of shares that appreciate in value over time. This means fewer on-chain events, cleaner integrations for developers, and more tax-efficient capital gains treatment for holders.",
  },
];

/* ─── Ease ───────────────────────────────────── */

const ease = [0.22, 1, 0.36, 1] as const;

/* ─── Accordion Item ─────────────────────────── */

function FAQAccordionItem({
  item,
  isOpen,
  onToggle,
  index,
}: {
  item: AaveProFAQItem;
  isOpen: boolean;
  onToggle: () => void;
  index: number;
}) {
  return (
    <motion.div
      style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease, delay: 0.05 * index }}
    >
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between text-left transition-colors duration-200 hover:opacity-80"
        style={{
          padding: "20px 0",
          fontSize: "20px",
          fontWeight: 450,
          lineHeight: "28px",
          letterSpacing: "-0.4px",
          color: "#ffffff",
          background: "none",
          border: "none",
          cursor: "pointer",
        }}
      >
        <span>{item.question}</span>
        <motion.span
          className="ml-4 flex shrink-0 items-center justify-center"
          style={{
            width: "24px",
            height: "24px",
            color: "rgba(255,255,255,0.4)",
          }}
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3, ease }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease }}
            style={{ overflow: "hidden" }}
          >
            <p
              style={{
                fontSize: "16px",
                fontWeight: 400,
                lineHeight: "24px",
                color: "rgba(255,255,255,0.5)",
                margin: 0,
                paddingBottom: "20px",
              }}
            >
              {item.answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ─── Component ──────────────────────────────── */

export function AaveProFAQ({
  items = defaultItems,
  learnMoreHref = "#",
  className,
}: AaveProFAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const handleToggle = useCallback((index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  }, []);

  return (
    <section
      className={cn("relative", className)}
      style={{
        backgroundColor: "#0f0f10",
        padding: "120px 48px",
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
        className="mx-auto flex flex-col gap-16 md:flex-row md:gap-12"
        style={{ maxWidth: "986px" }}
      >
        {/* Left column — heading */}
        <motion.div
          className="shrink-0 md:w-[38%]"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease }}
        >
          <h2
            style={{
              fontSize: "40px",
              fontWeight: 500,
              lineHeight: "48px",
              letterSpacing: "-1.2px",
              margin: 0,
            }}
          >
            <span style={{ color: "#ffffff" }}>Frequently</span>{" "}
            <span style={{ color: "rgba(255,255,255,0.4)" }}>Asked</span>
            <br />
            <span style={{ color: "#ffffff" }}>Questions</span>
          </h2>
        </motion.div>

        {/* Right column — accordion */}
        <div className="flex-1">
          <div
            style={{
              borderTop: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            {items.map((item, i) => (
              <FAQAccordionItem
                key={i}
                item={item}
                index={i}
                isOpen={openIndex === i}
                onToggle={() => handleToggle(i)}
              />
            ))}
          </div>

          {/* Learn more button */}
          <motion.div
            className="mt-8"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease, delay: 0.2 }}
          >
            <a
              href={learnMoreHref}
              className="inline-flex items-center justify-center transition-all duration-200 hover:bg-white/10 active:scale-[0.97]"
              style={{
                backgroundColor: "rgba(255,255,255,0.05)",
                color: "#ffffff",
                fontSize: "17px",
                fontWeight: 450,
                lineHeight: "17px",
                letterSpacing: "-0.17px",
                padding: "14px 24px",
                borderRadius: "1584px",
                boxShadow: "rgba(255,255,255,0.1) 0px 0px 0px 1.5px inset",
              }}
            >
              Learn more about Aave Pro
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
