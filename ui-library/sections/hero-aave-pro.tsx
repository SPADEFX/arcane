"use client";

import { motion } from "motion/react";
import { cn } from "@uilibrary/utils";
import { WordReveal } from "./aave-pro-word-reveal";

export interface HeroAaveProProps {
  badge?: string;
  headline?: string;
  subheadline?: string;
  ctaLabel?: string;
  ctaHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
  screenshotSrc?: string;
  screenshotAlt?: string;
  className?: string;
}

const ease = [0.22, 1, 0.36, 1] as const;

export function HeroAavePro({
  badge = "Aave Pro",
  headline = "The future of DeFi",
  subheadline = "The full power of Aave\u2019s lending markets. Deposit, borrow, and manage positions, your way.",
  ctaLabel = "Get Started",
  ctaHref = "#",
  secondaryLabel = "Learn More",
  secondaryHref = "#",
  screenshotSrc,
  screenshotAlt = "App screenshot",
  className,
}: HeroAaveProProps) {
  return (
    <section
      className={cn(
        "relative flex flex-col items-center overflow-hidden text-center",
        className,
      )}
      style={{
        backgroundColor: "#0f0f10",
        padding: "100px 48px 0",
        minHeight: "100vh",
      }}
    >
      {/* Dot grid background - matches aave.com/pro */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          opacity: 0.8,
          backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 1px)`,
          backgroundSize: "24px 24px",
          maskImage: "radial-gradient(ellipse 70% 50% at 50% 40%, black 0%, transparent 70%)",
          WebkitMaskImage: "radial-gradient(ellipse 70% 50% at 50% 40%, black 0%, transparent 70%)",
        }}
      />

      <div
        className="relative z-10 flex flex-col items-center w-full"
        style={{ maxWidth: "986px" }}
      >
        {/* Hero content area - matches Aave's heroSection with 20px gap */}
        <div
          className="flex flex-col items-center"
          style={{ maxWidth: "800px", gap: "20px" }}
        >
          {/* Badge */}
          {badge && (
            <motion.div
              className="flex items-center"
              style={{
                gap: "5.6px",
                color: "rgba(255, 255, 255, 0.56)",
                fontSize: "20px",
                fontWeight: 450,
                lineHeight: "30px",
                letterSpacing: "-0.33px",
              }}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease }}
            >
              {/* Aave ghost logo */}
              <svg
                width="24"
                height="16"
                viewBox="0 0 266 139"
                fill="none"
                aria-hidden
              >
                <path
                  d="M132.8 0C59.45 0-.02 60.6.00001 135.335H33.926C33.926 79.328 77.843 33.92 132.8 33.92C187.757 33.92 231.674 79.328 231.674 135.335H265.6C265.613 60.602 206.144 0 132.8 0Z"
                  fill="rgba(255, 255, 255, 0.56)"
                />
                <circle cx="97.542" cy="111.518" r="27.015" fill="rgba(255, 255, 255, 0.56)" />
                <circle cx="168.149" cy="111.518" r="27.015" fill="rgba(255, 255, 255, 0.56)" />
              </svg>
              <span>{badge}</span>
            </motion.div>
          )}

          {/* Headline */}
          <WordReveal
            text={headline}
            as="h1"
            style={{
              color: "#ffffff",
              fontSize: "72px",
              fontWeight: 450,
              lineHeight: "79.2px",
              letterSpacing: "-3.6px",
            }}
            delay={0.1}
          />

          {/* Subheadline */}
          {subheadline && (
            <motion.p
              style={{
                color: "rgba(255, 255, 255, 0.7)",
                fontSize: "20px",
                fontWeight: 400,
                lineHeight: "27.2px",
                letterSpacing: "normal",
                margin: 0,
                width: "100%",
              }}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease, delay: 0.2 }}
            >
              {subheadline}
            </motion.p>
          )}

          {/* CTAs */}
          <motion.div
            className="flex items-center justify-center"
            style={{ gap: "16px", paddingTop: "18px" }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease, delay: 0.35 }}
          >
            {/* Primary CTA - white full pill */}
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

            {/* Secondary CTA - transparent full pill */}
            {secondaryLabel && (
              <a
                href={secondaryHref}
                className="inline-flex items-center justify-center transition-all duration-200 hover:bg-white/5 active:scale-[0.97]"
                style={{
                  backgroundColor: "transparent",
                  color: "#ffffff",
                  fontSize: "17px",
                  fontWeight: 450,
                  lineHeight: "17px",
                  letterSpacing: "-0.17px",
                  padding: "14px 24px",
                  borderRadius: "1584px",
                  boxShadow: "rgb(255, 255, 255) 0px 0px 0px 1.5px inset",
                }}
              >
                {secondaryLabel}
              </a>
            )}
          </motion.div>
        </div>

        {/* App screenshot / illustration */}
        <motion.div
          className="mt-12 w-full"
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease, delay: 0.5 }}
        >
          {screenshotSrc ? (
            <img
              src={screenshotSrc}
              alt={screenshotAlt}
              className="block w-full"
            />
          ) : (
            <object
              data="/images/aave-pro-borrow.svg"
              type="image/svg+xml"
              aria-label="Aave Pro borrow interface showing asset markets"
              className="block w-full"
              style={{ maxWidth: "986px" }}
            >
              <img src="/images/aave-pro-mockup.png" alt={screenshotAlt} className="block w-full" />
            </object>
          )}
        </motion.div>
      </div>
    </section>
  );
}
