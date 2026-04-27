"use client";

import { type ReactNode } from "react";
import { cn } from "@uilibrary/utils";
import { Input } from "../components/input";
import { Button } from "../components/button";

export interface FooterColumn {
  title: string;
  links: { label: string; href: string }[];
}

export interface FooterProps {
  logo?: ReactNode;
  description?: string;
  columns?: FooterColumn[];
  newsletter?: boolean;
  newsletterHeadline?: string;
  bottomText?: string;
  socialLinks?: { label: string; href: string; icon: ReactNode }[];
  className?: string;
}

export function Footer({
  logo = "Brand",
  description,
  columns = [],
  newsletter = false,
  newsletterHeadline = "Subscribe to our newsletter",
  bottomText,
  socialLinks = [],
  className,
}: FooterProps) {
  return (
    <footer
      className={cn(
        "border-t border-[var(--color-border)] bg-[var(--color-bg-subtle)] px-6 py-16 md:py-20",
        className,
      )}
    >
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12">
          {/* Brand column */}
          <div className="md:col-span-4">
            <div className="text-[var(--font-text-xl)] font-bold text-[var(--color-text)]">
              {logo}
            </div>
            {description && (
              <p className="mt-4 max-w-xs text-[var(--font-text-sm)] leading-[var(--leading-relaxed)] text-[var(--color-text-secondary)]">
                {description}
              </p>
            )}

            {/* Social links */}
            {socialLinks.length > 0 && (
              <div className="mt-6 flex gap-3">
                {socialLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    aria-label={link.label}
                    className={cn(
                      "flex h-9 w-9 items-center justify-center",
                      "rounded-[var(--radius-lg)] text-[var(--color-text-muted)]",
                      "transition-colors duration-[var(--duration-fast)]",
                      "hover:bg-[var(--color-bg-muted)] hover:text-[var(--color-text)]",
                    )}
                  >
                    {link.icon}
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Link columns */}
          {columns.map((col) => (
            <div key={col.title} className="md:col-span-2">
              <h3 className="mb-4 text-[var(--font-text-sm)] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                {col.title}
              </h3>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className={cn(
                        "text-[var(--font-text-sm)] text-[var(--color-text-secondary)] no-underline",
                        "transition-colors duration-[var(--duration-fast)]",
                        "hover:text-[var(--color-text)]",
                      )}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Newsletter */}
          {newsletter && (
            <div className="md:col-span-4">
              <h3 className="mb-4 text-[var(--font-text-sm)] font-semibold text-[var(--color-text)]">
                {newsletterHeadline}
              </h3>
              <form
                className="flex gap-2"
                onSubmit={(e) => e.preventDefault()}
              >
                <Input
                  type="email"
                  placeholder="you@example.com"
                  className="flex-1"
                />
                <Button size="md">Subscribe</Button>
              </form>
              <p className="mt-3 text-[var(--font-text-xs)] text-[var(--color-text-muted)]">
                No spam. Unsubscribe anytime.
              </p>
            </div>
          )}
        </div>

        {/* Bottom bar */}
        {bottomText && (
          <div className="mt-16 border-t border-[var(--color-border)] pt-8 text-center text-[var(--font-text-xs)] text-[var(--color-text-muted)]">
            {bottomText}
          </div>
        )}
      </div>
    </footer>
  );
}
