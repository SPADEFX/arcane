"use client";

import { forwardRef, useState, useEffect, type ReactNode } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@uilibrary/utils";
import { Button } from "./button";

export interface NavbarLink {
  label: string;
  href: string;
}

export interface NavbarProps {
  logo?: ReactNode;
  links?: NavbarLink[];
  ctaLabel?: string;
  ctaHref?: string;
  className?: string;
}

export const Navbar = forwardRef<HTMLElement, NavbarProps>(
  (
    {
      logo = "Brand",
      links = [],
      ctaLabel = "Get Started",
      ctaHref = "#",
      className,
    },
    ref,
  ) => {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
      const onScroll = () => setScrolled(window.scrollY > 20);
      window.addEventListener("scroll", onScroll, { passive: true });
      return () => window.removeEventListener("scroll", onScroll);
    }, []);

    // Lock body scroll when mobile menu is open
    useEffect(() => {
      if (mobileOpen) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "";
      }
      return () => {
        document.body.style.overflow = "";
      };
    }, [mobileOpen]);

    return (
      <>
        <motion.nav
          ref={ref}
          className={cn(
            "fixed top-0 left-0 right-0 z-[var(--z-sticky)]",
            "flex items-center justify-between px-6 py-4",
            "transition-all duration-[var(--duration-normal)] ease-[var(--ease-smooth)]",
            scrolled
              ? "bg-[var(--color-bg)]/80 backdrop-blur-xl border-b border-[var(--color-border)] shadow-[var(--shadow-sm)] py-3"
              : "bg-transparent",
            className,
          )}
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Logo */}
          <a
            href="/"
            className="text-[var(--font-text-xl)] font-bold text-[var(--color-text)] no-underline"
          >
            {logo}
          </a>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={cn(
                  "text-[var(--font-text-sm)] font-medium no-underline",
                  "text-[var(--color-text-secondary)]",
                  "transition-colors duration-[var(--duration-fast)]",
                  "hover:text-[var(--color-text)]",
                )}
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:block">
            <Button size="sm" asChild>
              <a href={ctaHref}>{ctaLabel}</a>
            </Button>
          </div>

          {/* Mobile Hamburger */}
          <button
            type="button"
            className="md:hidden relative w-6 h-5 flex flex-col justify-between"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            <motion.span
              className="block h-0.5 w-full bg-[var(--color-text)] origin-center"
              animate={
                mobileOpen
                  ? { rotate: 45, y: 9 }
                  : { rotate: 0, y: 0 }
              }
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            />
            <motion.span
              className="block h-0.5 w-full bg-[var(--color-text)]"
              animate={mobileOpen ? { opacity: 0, x: -10 } : { opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
            />
            <motion.span
              className="block h-0.5 w-full bg-[var(--color-text)] origin-center"
              animate={
                mobileOpen
                  ? { rotate: -45, y: -9 }
                  : { rotate: 0, y: 0 }
              }
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            />
          </button>
        </motion.nav>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              className="fixed inset-0 z-[calc(var(--z-sticky)-1)] bg-[var(--color-bg)] flex flex-col items-center justify-center gap-8 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {links.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  className="text-[var(--font-display-sm)] font-semibold text-[var(--color-text)] no-underline"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{
                    duration: 0.4,
                    ease: [0.22, 1, 0.36, 1],
                    delay: i * 0.08,
                  }}
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </motion.a>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{
                  duration: 0.4,
                  delay: links.length * 0.08,
                }}
              >
                <Button size="lg" asChild>
                  <a href={ctaHref} onClick={() => setMobileOpen(false)}>
                    {ctaLabel}
                  </a>
                </Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </>
    );
  },
);
Navbar.displayName = "Navbar";
