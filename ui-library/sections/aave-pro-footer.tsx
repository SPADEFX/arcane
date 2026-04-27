"use client";

import { type ReactNode } from "react";
import { motion } from "motion/react";
import { cn } from "@uilibrary/utils";

/* ─── Types ──────────────────────────────────── */

export interface AaveProFooterLink {
  label: string;
  href: string;
  icon?: ReactNode;
  external?: boolean;
}

export interface AaveProFooterColumn {
  title: string;
  links: AaveProFooterLink[];
}

export interface AaveProFooterProps {
  columns?: AaveProFooterColumn[];
  disclaimer?: string;
  className?: string;
}

/* ─── Ease ───────────────────────────────────── */

const ease = [0.22, 1, 0.36, 1] as const;

/* ─── Small icon for product links ───────────── */

function SmallProductIcon({ color = "#9898ff" }: { color?: string }) {
  return (
    <span
      className="inline-block shrink-0 rounded"
      style={{
        width: "14px",
        height: "14px",
        backgroundColor: color,
        opacity: 0.6,
      }}
      aria-hidden
    />
  );
}

/* ─── Aave Ghost Logo ────────────────────────── */

function AaveLogo() {
  return (
    <svg
      width="24"
      height="24"
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

/* ─── Defaults ───────────────────────────────── */

const defaultColumns: AaveProFooterColumn[] = [
  {
    title: "Products",
    links: [
      { label: "Aave App", href: "#" },
      { label: "Aave Pro", href: "#" },
      { label: "Aave V3", href: "#" },
      { label: "Aave Kit", href: "#" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Blog", href: "#" },
      { label: "Brand", href: "#" },
      { label: "FAQ", href: "#" },
      { label: "Help & Support", href: "#" },
      { label: "Governance", href: "#" },
    ],
  },
  {
    title: "Developers",
    links: [
      { label: "Documentation", href: "#" },
      { label: "Case Studies", href: "#" },
      { label: "Technical Paper", href: "#" },
      { label: "Security", href: "#" },
      { label: "Bug Bounty", href: "#" },
    ],
  },
  {
    title: "About",
    links: [
      { label: "Aave Labs", href: "#" },
      { label: "Careers", href: "#" },
    ],
  },
  {
    title: "Legal & Privacy",
    links: [
      { label: "Privacy Policy", href: "#" },
      { label: "Terms of Service", href: "#" },
      { label: "Contact", href: "#" },
      { label: "Press", href: "#" },
      { label: "Manage Analytics", href: "#" },
    ],
  },
];

const defaultDisclaimer =
  "Aave.com provides information and resources about the fundamentals of the decentralised non-custodial liquidity protocol called the Aave Protocol, comprised of open-source self-executing smart contracts that are deployed on various permissionless public blockchains, such as Ethereum (the \u201cAave Protocol\u201d or the \u201cProtocol\u201d). Aave Labs does not control or operate any version of the Aave Protocol on any blockchain network.";

/* ─── Social Icons ──────────────────────────── */

function XIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function TikTokIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.7a8.16 8.16 0 004.76 1.52V6.77a4.83 4.83 0 01-1-.08z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function DiscordIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );
}

function DuneIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M1.203 10.871L12 2.4l10.797 8.471L12 19.341 1.203 10.87zm10.8-5.4L5.2 10.871 12 16.27l6.797-5.4L12 5.472z" />
    </svg>
  );
}

const socialLinks = [
  { icon: <XIcon />, href: "https://x.com/aave", label: "X" },
  { icon: <InstagramIcon />, href: "https://www.instagram.com/aave/", label: "Instagram" },
  { icon: <TikTokIcon />, href: "https://www.tiktok.com/@aavelabs", label: "TikTok" },
  { icon: <LinkedInIcon />, href: "https://www.linkedin.com/company/aavelabs/", label: "LinkedIn" },
  { icon: <DiscordIcon />, href: "https://discord.com/invite/aave", label: "Discord" },
  { icon: <GitHubIcon />, href: "https://github.com/aave", label: "GitHub" },
  { icon: <DuneIcon />, href: "https://dune.com/aavelabs", label: "Dune" },
];

/* ─── Component ──────────────────────────────── */

export function AaveProFooter({
  columns = defaultColumns,
  disclaimer = defaultDisclaimer,
  className,
}: AaveProFooterProps) {
  const productIcons: Record<string, string> = {
    "Aave App": "#9898ff",
    "Aave Pro": "#46d4a8",
    "Aave V3": "#627eea",
    "Aave Kit": "#f7931a",
  };

  return (
    <footer
      className={cn("relative", className)}
      style={{
        backgroundColor: "#0f0f10",
        padding: "72px 48px",
        borderTop: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div className="mx-auto" style={{ maxWidth: "986px" }}>
        {/* Columns grid */}
        <motion.div
          className="grid grid-cols-2 gap-8 sm:grid-cols-3 md:grid-cols-5"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease }}
        >
          {columns.map((column) => (
            <div key={column.title}>
              <h3
                style={{
                  fontSize: "14px",
                  fontWeight: 450,
                  lineHeight: "20px",
                  color: "rgba(255,255,255,0.4)",
                  margin: "0 0 16px 0",
                }}
              >
                {column.title}
              </h3>
              <ul
                className="flex flex-col"
                style={{
                  listStyle: "none",
                  margin: 0,
                  padding: 0,
                  gap: "10px",
                }}
              >
                {column.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="inline-flex items-center gap-2 transition-opacity duration-200 hover:opacity-70"
                      style={{
                        fontSize: "14px",
                        fontWeight: 400,
                        lineHeight: "20px",
                        color: "#ffffff",
                        textDecoration: "none",
                      }}
                    >
                      {/* Product icons for first column */}
                      {link.icon
                        ? link.icon
                        : productIcons[link.label] && (
                            <SmallProductIcon
                              color={productIcons[link.label]}
                            />
                          )}
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </motion.div>

        {/* Bottom section */}
        <motion.div
          className="flex flex-col gap-6"
          style={{
            marginTop: "64px",
            paddingTop: "32px",
            borderTop: "1px solid rgba(255,255,255,0.06)",
          }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease, delay: 0.1 }}
        >
          {/* Logo + Social row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 shrink-0">
              <AaveLogo />
              <span
                style={{
                  fontSize: "14px",
                  fontWeight: 500,
                  color: "rgba(255,255,255,0.56)",
                }}
              >
                Aave
              </span>
            </div>

            {/* Social icons */}
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="transition-opacity duration-200 hover:opacity-70"
                  style={{
                    color: "rgba(255,255,255,0.4)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "32px",
                    height: "32px",
                    borderRadius: "8px",
                  }}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Disclaimer */}
          <p
            style={{
              fontSize: "12px",
              fontWeight: 400,
              lineHeight: "18px",
              color: "rgba(255,255,255,0.3)",
              margin: 0,
              maxWidth: "100%",
            }}
          >
            {disclaimer}
          </p>
        </motion.div>
      </div>
    </footer>
  );
}
