"use client";

import {
  forwardRef,
  useState,
  useEffect,
  useCallback,
  useRef,
  type ReactNode,
} from "react";
import { motion, AnimatePresence, useMotionValueEvent, useScroll } from "motion/react";
import { cn } from "@uilibrary/utils";
import { useReducedMotion } from "@uilibrary/hooks/use-reduced-motion";
import { Button } from "./button";

/* ─── Types ───────────────────────────────────────────── */

export interface NavbarLink {
  label: string;
  href: string;
}

export interface NavbarProps {
  /** Logo element or text */
  logo?: ReactNode;
  /** Navigation links displayed in the center */
  links?: NavbarLink[];
  /** CTA button label */
  ctaLabel?: string;
  /** CTA button href */
  ctaHref?: string;
  /** CTA click handler (alternative to href) */
  onCtaClick?: () => void;
  /** Hide navbar on scroll down, show on scroll up */
  hideOnScroll?: boolean;
  /** Additional class names */
  className?: string;
}

/* ─── Constants ───────────────────────────────────────── */

const SCROLL_THRESHOLD = 10;
const NAV_HEIGHT = 64;
const EASE_SPRING = [0.22, 1, 0.36, 1] as const;

/* ─── Component ───────────────────────────────────────── */

export const Navbar = forwardRef<HTMLElement, NavbarProps>(
  (
    {
      logo = "Brand",
      links = [],
      ctaLabel = "Get Started",
      ctaHref = "#",
      onCtaClick,
      hideOnScroll = false,
      className,
    },
    ref,
  ) => {
    const prefersReduced = useReducedMotion();
    const [scrolled, setScrolled] = useState(false);
    const [hidden, setHidden] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const lastScrollY = useRef(0);
    const { scrollY } = useScroll();

    /* --- Scroll detection --- */
    useMotionValueEvent(scrollY, "change", (latest) => {
      const isScrolled = latest > SCROLL_THRESHOLD;
      setScrolled(isScrolled);

      if (hideOnScroll && !mobileOpen) {
        const direction = latest > lastScrollY.current ? "down" : "up";
        const delta = Math.abs(latest - lastScrollY.current);

        if (delta > 5) {
          setHidden(direction === "down" && latest > NAV_HEIGHT);
        }
      }

      lastScrollY.current = latest;
    });

    /* --- Lock body scroll when mobile menu open --- */
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

    /* --- Close mobile menu on resize to desktop --- */
    useEffect(() => {
      const mql = window.matchMedia("(min-width: 768px)");
      const handler = () => {
        if (mql.matches) setMobileOpen(false);
      };
      mql.addEventListener("change", handler);
      return () => mql.removeEventListener("change", handler);
    }, []);

    const closeMobile = useCallback(() => setMobileOpen(false), []);

    const motionConfig = prefersReduced
      ? { initial: false, animate: { y: 0 }, transition: { duration: 0 } }
      : {
          initial: { y: -100, opacity: 0 },
          animate: {
            y: hidden ? -100 : 0,
            opacity: hidden ? 0 : 1,
          },
          transition: { duration: 0.4, ease: EASE_SPRING },
        };

    return (
      <>
        <motion.nav
          ref={ref}
          role="navigation"
          aria-label="Main navigation"
          className={cn(
            "fixed top-0 left-0 right-0 z-[100]",
            "border-b transition-[background-color,border-color,padding] duration-300",
            "ease-[cubic-bezier(0.22,1,0.36,1)]",
            scrolled
              ? [
                  "bg-[var(--color-bg)]/70 backdrop-blur-2xl backdrop-saturate-150",
                  "border-[var(--color-border)]/50",
                  "shadow-[0_1px_3px_rgb(0_0_0/0.04),0_1px_2px_rgb(0_0_0/0.02)]",
                ]
              : "bg-transparent border-transparent",
            className,
          )}
          {...motionConfig}
        >
          <div
            className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-6"
          >
            {/* ── Logo ── */}
            <a
              href="/"
              className={cn(
                "relative z-10 shrink-0 text-[var(--font-text-xl)] font-bold",
                "text-[var(--color-text)] no-underline",
                "transition-opacity duration-150 hover:opacity-80",
              )}
            >
              {logo}
            </a>

            {/* ── Desktop Links (center) ── */}
            <div className="hidden md:flex items-center gap-8">
              {links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "relative text-[var(--font-text-sm)] font-medium no-underline",
                    "text-[var(--color-text-muted)]",
                    "transition-colors duration-200 ease-out",
                    "hover:text-[var(--color-text)]",
                    /* Subtle underline on hover */
                    "after:absolute after:bottom-[-2px] after:left-0 after:h-px after:w-0",
                    "after:bg-[var(--color-accent)] after:transition-[width] after:duration-200",
                    "hover:after:w-full",
                  )}
                >
                  {link.label}
                </a>
              ))}
            </div>

            {/* ── Desktop CTA ── */}
            <div className="hidden md:block shrink-0">
              <Button
                size="sm"
                variant="primary"
                asChild={!onCtaClick}
                onClick={onCtaClick}
              >
                {onCtaClick ? (
                  ctaLabel
                ) : (
                  <a href={ctaHref}>{ctaLabel}</a>
                )}
              </Button>
            </div>

            {/* ── Mobile Hamburger ── */}
            <button
              type="button"
              className={cn(
                "relative z-10 md:hidden",
                "flex h-10 w-10 items-center justify-center",
                "rounded-[var(--radius-lg)]",
                "transition-colors duration-150",
                "hover:bg-[var(--color-bg-subtle)]",
              )}
              onClick={() => setMobileOpen((prev) => !prev)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
            >
              <div className="relative h-4 w-5">
                <motion.span
                  className="absolute left-0 top-0 block h-[1.5px] w-full rounded-full bg-[var(--color-text)]"
                  animate={
                    mobileOpen
                      ? { rotate: 45, y: 7, width: "100%" }
                      : { rotate: 0, y: 0, width: "100%" }
                  }
                  transition={{ duration: prefersReduced ? 0 : 0.25, ease: EASE_SPRING }}
                />
                <motion.span
                  className="absolute left-0 top-[7px] block h-[1.5px] w-3/4 rounded-full bg-[var(--color-text)]"
                  animate={mobileOpen ? { opacity: 0, x: -8 } : { opacity: 1, x: 0 }}
                  transition={{ duration: prefersReduced ? 0 : 0.2 }}
                />
                <motion.span
                  className="absolute left-0 bottom-0 block h-[1.5px] w-full rounded-full bg-[var(--color-text)]"
                  animate={
                    mobileOpen
                      ? { rotate: -45, y: -7, width: "100%" }
                      : { rotate: 0, y: 0, width: "100%" }
                  }
                  transition={{ duration: prefersReduced ? 0 : 0.25, ease: EASE_SPRING }}
                />
              </div>
            </button>
          </div>
        </motion.nav>

        {/* ── Mobile Menu Overlay ── */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              className={cn(
                "fixed inset-0 z-[99] md:hidden",
                "bg-[var(--color-bg)]/95 backdrop-blur-xl",
                "flex flex-col items-center justify-center gap-6",
              )}
              initial={prefersReduced ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: prefersReduced ? 0 : 0.25 }}
            >
              {links.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "text-[var(--font-display-xs)] font-semibold",
                    "text-[var(--color-text)] no-underline",
                    "transition-opacity duration-150 hover:opacity-60",
                  )}
                  initial={prefersReduced ? false : { opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{
                    duration: prefersReduced ? 0 : 0.35,
                    ease: EASE_SPRING,
                    delay: prefersReduced ? 0 : i * 0.06,
                  }}
                  onClick={closeMobile}
                >
                  {link.label}
                </motion.a>
              ))}

              <motion.div
                initial={prefersReduced ? false : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{
                  duration: prefersReduced ? 0 : 0.35,
                  delay: prefersReduced ? 0 : links.length * 0.06,
                }}
              >
                <Button
                  size="lg"
                  variant="primary"
                  asChild={!onCtaClick}
                  onClick={() => {
                    onCtaClick?.();
                    closeMobile();
                  }}
                >
                  {onCtaClick ? (
                    ctaLabel
                  ) : (
                    <a href={ctaHref} onClick={closeMobile}>
                      {ctaLabel}
                    </a>
                  )}
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
