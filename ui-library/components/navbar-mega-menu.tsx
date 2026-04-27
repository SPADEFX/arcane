"use client";

import {
  useRef,
  useState,
  useCallback,
  useEffect,
  useLayoutEffect,
  type ReactNode,
} from "react";
import { cn } from "@uilibrary/utils";
import { motion, AnimatePresence, LayoutGroup } from "motion/react";

/* ─── Types ──────────────────────────────────── */

export interface NavMegaMenuItem {
  icon?: ReactNode;
  iconActive?: ReactNode;
  title: string;
  description?: string;
  href: string;
  badge?: ReactNode | "new"; // Can be a custom badge or "new" string
  /** Accent color for this item — used on icon hover */
  accentColor?: string;
  /** External link arrow */
  external?: boolean;
}

export interface NavMegaMenuDropdown {
  label: string;
  badge?: ReactNode;
  /** Auto-badge: show badge on category if any item has badge="new" */
  autoBadge?: boolean;
  items?: NavMegaMenuItem[];
  content?: ReactNode;
}

export interface NavMegaMenuLink {
  label: string;
  href: string;
  badge?: ReactNode;
}

export type NavMegaMenuEntry = NavMegaMenuDropdown | NavMegaMenuLink;

function isDropdown(entry: NavMegaMenuEntry): entry is NavMegaMenuDropdown {
  return "items" in entry || "content" in entry;
}

export interface NavbarMegaMenuProps {
  logo: ReactNode;
  logoHref?: string;
  entries: NavMegaMenuEntry[];
  cta?: { label: string; href: string; dropdown?: { label: string; href: string; badge?: string; external?: boolean }[] };
  className?: string;
  maxWidth?: number;
}

/* ─── Arrow SVG ──────────────────────────────── */

function DropdownArrow() {
  return (
    <svg width="28" height="8" viewBox="0 0 28 8" fill="none">
      <path
        d="M0 8C4.5 8 7.5 0.5 14 0.5C20.5 0.5 23.5 8 28 8"
        style={{ stroke: "color-mix(in srgb, var(--color-text) 12%, transparent)" }}
        strokeWidth="1"
        fill="none"
      />
      <path
        d="M0 8C4.5 8 7.5 0.5 14 0.5C20.5 0.5 23.5 8 28 8H0Z"
        style={{ fill: "var(--color-bg)" }}
      />
    </svg>
  );
}

/* ─── Ping Badge ─────────────────────────────── */

export function PingBadge({ color = "#9898ff" }: { color?: string }) {
  return (
    <span className="relative ml-1 inline-flex h-[7px] w-[7px]">
      <span
        className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"
        style={{ backgroundColor: color, animationDuration: "2s" }}
      />
      <span
        className="relative inline-flex h-[7px] w-[7px] rounded-full"
        style={{ backgroundColor: color }}
      />
    </span>
  );
}

/* ─── useIsomorphicLayoutEffect ──────────────── */

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

/* ─── CTA Dropdown ──────────────────────────── */

function CtaDropdown({
  label,
  items,
}: {
  label: string;
  items: { label: string; href: string; badge?: string; external?: boolean }[];
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          padding: "9px 16px",
          borderRadius: 50,
          background: "var(--color-text)",
          color: "var(--color-bg, #ffffff)",
          fontSize: 14,
          fontWeight: 500,
          lineHeight: "105%",
          letterSpacing: "-0.09px",
          border: "none",
          cursor: "pointer",
          fontFamily: "inherit",
          transition: "opacity 0.15s ease",
          whiteSpace: "nowrap",
        }}
        onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.8"; }}
        onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}
      >
        {label}
      </button>

      {open && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 8px)",
            right: 0,
            background: "var(--color-bg)",
            borderRadius: 16,
            border: "1px solid color-mix(in srgb, var(--color-text) 10%, transparent)",
            padding: "6px",
            minWidth: 200,
            boxShadow: "0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.08)",
            zIndex: 100,
          }}
        >
          {items.map((item) => (
            <a
              key={item.label}
              href={item.href}
              target={item.external ? "_blank" : undefined}
              rel={item.external ? "noopener noreferrer" : undefined}
              onClick={() => setOpen(false)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "10px 14px",
                borderRadius: 10,
                color: "#fff",
                textDecoration: "none",
                fontSize: 14,
                fontWeight: 450,
                transition: "background 0.12s ease",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
            >
              <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                {item.label}
                {item.badge && (
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      padding: "1px 6px",
                      borderRadius: 6,
                      background: "rgba(152,152,255,0.15)",
                      color: "#9898ff",
                    }}
                  >
                    {item.badge}
                  </span>
                )}
              </span>
              {item.external && (
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M4.5 2.5h5v5M9.5 2.5L2.5 9.5" stroke="rgba(255,255,255,0.3)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Main Component ─────────────────────────── */

export function NavbarMegaMenu({
  logo,
  logoHref = "/",
  entries,
  cta,
  className,
  maxWidth,
}: NavbarMegaMenuProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [previousIndex, setPreviousIndex] = useState<number | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [hoveredAccent, setHoveredAccent] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileOpenDropdown, setMobileOpenDropdown] = useState<number | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const clearIndexRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const navRef = useRef<HTMLElement>(null);
  const triggerRefs = useRef<(HTMLButtonElement | HTMLAnchorElement | null)[]>([]);
  const panelRef = useRef<HTMLDivElement>(null);
  const contentRefs = useRef<(HTMLDivElement | null)[]>([]);
  const arrowRef = useRef<HTMLDivElement>(null);

  // Track measured sizes for the morphing panel
  const [panelRect, setPanelRect] = useState({ left: 0, width: 0, height: 0 });
  const [arrowLeft, setArrowLeft] = useState(0);
  const isFirstOpen = useRef(true);

  /* ─── Scroll detection ─────────────────────── */

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 0);
          ticking = false;
        });
        ticking = true;
      }
    };

    handleScroll(); // Check initial state
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* ─── Open / close ─────────────────────── */

  const open = useCallback(
    (index: number) => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (clearIndexRef.current) clearTimeout(clearIndexRef.current);
      if (!isDropdown(entries[index])) return;

      const wasOpen = activeIndex !== null;

      // Track previous index for slide direction
      if (activeIndex !== null && activeIndex !== index) {
        setPreviousIndex(activeIndex);
      }

      setActiveIndex(index);
      setIsOpen(true);

      if (!wasOpen) {
        isFirstOpen.current = true;
        setPreviousIndex(null); // Reset on first open
      }
    },
    [activeIndex, entries]
  );

  const scheduleClose = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (clearIndexRef.current) clearTimeout(clearIndexRef.current);
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
      clearIndexRef.current = setTimeout(() => {
        setActiveIndex(null);
      }, 150);
    }, 80);
  }, []);

  const cancelClose = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (clearIndexRef.current) clearTimeout(clearIndexRef.current);
  }, []);

  /* ─── Measure & position panel ─────────── */

  useIsomorphicLayoutEffect(() => {
    if (activeIndex === null || !navRef.current) return;

    const trigger = triggerRefs.current[activeIndex];
    if (!trigger) return;

    const navRect = navRef.current.getBoundingClientRect();
    const triggerRect = trigger.getBoundingClientRect();
    const triggerCenter = triggerRect.left + triggerRect.width / 2 - navRect.left;

    // Measure the content for this dropdown
    const contentEl = contentRefs.current[activeIndex];
    if (!contentEl) return;

    // Temporarily make it visible to measure
    const prev = contentEl.style.cssText;
    contentEl.style.cssText =
      "position:absolute;visibility:hidden;display:block;pointer-events:none;";
    const contentWidth = contentEl.scrollWidth;
    const contentHeight = contentEl.scrollHeight;
    contentEl.style.cssText = prev;

    const panelWidth = contentWidth + 20; // +padding
    const panelHeight = contentHeight + 20;

    let left = triggerCenter - panelWidth / 2;
    const maxLeft = navRect.width - panelWidth - 8;
    if (left < 8) left = 8;
    if (left > maxLeft) left = maxLeft;

    // Arrow in nav-space, then relative to panel
    const arrowInPanel = triggerCenter - left - 14;

    setPanelRect({ left, width: panelWidth, height: panelHeight });
    setArrowLeft(arrowInPanel);

    // After first open, disable instant mode
    if (isFirstOpen.current) {
      requestAnimationFrame(() => {
        isFirstOpen.current = false;
      });
    }
  }, [activeIndex]);

  /* ─── Keyboard & outside click ─────────── */

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
        if (clearIndexRef.current) clearTimeout(clearIndexRef.current);
        clearIndexRef.current = setTimeout(() => {
          setActiveIndex(null);
        }, 200);
      }
    };
    const onClick = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        if (clearIndexRef.current) clearTimeout(clearIndexRef.current);
        clearIndexRef.current = setTimeout(() => {
          setActiveIndex(null);
        }, 200);
      }
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, []);

  /* ─── Derived state ────────────────────── */

  const showPanel = isOpen && activeIndex !== null;
  const transitionDuration = isFirstOpen.current ? "0ms" : "300ms";

  return (
    <nav
      ref={navRef}
      className={cn("navbar-mega-menu", isScrolled && "navbar-scrolled", className)}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        width: "100vw",
        fontFamily: "var(--font-sans, 'Inter', system-ui, -apple-system, sans-serif)",
        paddingTop: 24,
        paddingBottom: 0,
        boxShadow: isScrolled ? "rgba(255, 255, 255, 0.04) 0px 1px 0px 0px" : "rgba(255, 255, 255, 0) 0px 1px 0px 0px",
        background: "var(--color-bg)",
        zIndex: 1000,
        transition: "transform 0.2s ease-out, box-shadow 0.2s ease-out",
      }}
    >
      {/* ─── Inner constrained wrapper ───────────────────── */}
      <div
        className="navbar-inner-wrapper"
        style={{
          maxWidth: maxWidth || 1082,
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
        {/* ─── Top bar ───────────────────── */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            height: 80,
          }}
        >
        {/* Logo */}
        <a
          href={logoHref}
          style={{
            display: "flex",
            alignItems: "center",
            flexShrink: 0,
            textDecoration: "none",
            color: "var(--color-text)",
          }}
        >
          {logo}
        </a>

        {/* Nav entries - Desktop only */}
        <div className="nav-desktop-menu" style={{ alignItems: "center", gap: 4, marginLeft: "auto" }}>
          {entries.map((entry, i) => {
            // Auto-badge: show badge if any item has badge
            const shouldShowBadge =
              isDropdown(entry) &&
              entry.autoBadge &&
              entry.items?.some((item) => item.badge);

            return isDropdown(entry) ? (
              <button
                key={i}
                ref={(el) => {
                  triggerRefs.current[i] = el;
                }}
                onClick={() =>
                  activeIndex === i
                    ? (() => {
                        setIsOpen(false);
                        if (clearIndexRef.current) clearTimeout(clearIndexRef.current);
                        clearIndexRef.current = setTimeout(() => {
                          setActiveIndex(null);
                        }, 200);
                      })()
                    : open(i)
                }
                onFocus={() => open(i)}
                onBlur={scheduleClose}
                style={{
                  display: "inline-block",
                  position: "relative",
                  padding: "9px 16px",
                  borderRadius: 50,
                  border: "none",
                  background:
                    activeIndex === i ? "color-mix(in srgb, var(--color-text) 6%, transparent)" : "transparent",
                  cursor: "pointer",
                  fontSize: 14,
                  fontWeight: 500,
                  lineHeight: "105%",
                  letterSpacing: "-0.09px",
                  color: activeIndex === i ? "var(--color-text)" : "color-mix(in srgb, var(--color-text) 70%, transparent)",
                  fontFamily: "inherit",
                  fontFeatureSettings: "inherit",
                  transition: "background-color 0.15s ease, color 0.15s ease",
                  whiteSpace: "nowrap",
                }}
                onMouseEnter={(e) => {
                  open(i);
                  e.currentTarget.style.color = "var(--color-text)";
                  if (activeIndex !== i) e.currentTarget.style.background = "color-mix(in srgb, var(--color-text) 4%, transparent)";
                }}
                onMouseLeave={(e) => {
                  scheduleClose();
                  e.currentTarget.style.color = "color-mix(in srgb, var(--color-text) 70%, transparent)";
                  if (activeIndex !== i) e.currentTarget.style.background = "transparent";
                }}
              >
                {entry.label}
                {shouldShowBadge ? <PingBadge color="#9898ff" /> : entry.badge}
              </button>
            ) : (
              <a
                key={i}
                ref={(el) => {
                  triggerRefs.current[i] = el;
                }}
                href={entry.href}
                onMouseEnter={(e) => {
                  if (activeIndex !== null) {
                    setIsOpen(false);
                    if (clearIndexRef.current) clearTimeout(clearIndexRef.current);
                    clearIndexRef.current = setTimeout(() => {
                      setActiveIndex(null);
                    }, 200);
                  }
                  e.currentTarget.style.color = "var(--color-text)";
                  e.currentTarget.style.background = "color-mix(in srgb, var(--color-text) 4%, transparent)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "color-mix(in srgb, var(--color-text) 70%, transparent)";
                  e.currentTarget.style.background = "transparent";
                }}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 4,
                  padding: "9px 16px",
                  borderRadius: 50,
                  textDecoration: "none",
                  fontSize: 14,
                  fontWeight: 500,
                  lineHeight: "105%",
                  letterSpacing: "-0.09px",
                  color: "color-mix(in srgb, var(--color-text) 70%, transparent)",
                  fontFamily: "inherit",
                  fontFeatureSettings: "inherit",
                  transition: "background-color 0.15s ease, color 0.15s ease",
                  whiteSpace: "nowrap",
                }}
              >
                {entry.label}
                {entry.badge}
              </a>
            );
          })}
        </div>

        {/* CTA - Desktop */}
        {cta && (
          <div className="nav-desktop-cta" style={{ position: "relative", marginLeft: 4, flexShrink: 0 }}>
            {cta.dropdown && cta.dropdown.length > 0 ? (
              /* Dropdown CTA */
              <CtaDropdown label={cta.label} items={cta.dropdown} />
            ) : (
              <a
                href={cta.href}
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "9px 16px",
                  borderRadius: 50,
                  background: "var(--color-text)",
                  color: "var(--color-bg, #ffffff)",
                  fontSize: 14,
                  fontWeight: 500,
                  lineHeight: "105%",
                  letterSpacing: "-0.09px",
                  textDecoration: "none",
                  fontFamily: "inherit",
                  fontFeatureSettings: "inherit",
                  transition: "opacity 0.15s ease",
                  whiteSpace: "nowrap",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.8"; }}
                onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}
              >
                {cta.label}
              </a>
            )}
          </div>
        )}

        {/* Mobile menu button — morphing burger/X */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="nav-mobile-button"
          style={{
            marginLeft: "auto",
            padding: 8,
            border: "none",
            background: "transparent",
            cursor: "pointer",
            color: "var(--color-text)",
            width: 40,
            height: 40,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}
          aria-label="Toggle menu"
        >
          <span style={{
            display: "flex",
            flexDirection: "column",
            gap: mobileMenuOpen ? 0 : 5,
            width: 20,
            height: 20,
            justifyContent: "center",
            alignItems: "center",
            transition: "gap 0.3s ease",
          }}>
            {/* Top line → rotates to \ */}
            <span style={{
              display: "block",
              width: 20,
              height: 1.5,
              borderRadius: 1,
              background: "currentColor",
              transition: "transform 0.3s ease, opacity 0.3s ease",
              transform: mobileMenuOpen ? "rotate(45deg) translateY(0.75px)" : "rotate(0) translateY(0)",
            }} />
            {/* Middle line → fades out */}
            <span style={{
              display: "block",
              width: 20,
              height: 1.5,
              borderRadius: 1,
              background: "currentColor",
              transition: "opacity 0.2s ease, transform 0.2s ease",
              opacity: mobileMenuOpen ? 0 : 1,
              transform: mobileMenuOpen ? "scaleX(0)" : "scaleX(1)",
            }} />
            {/* Bottom line → rotates to / */}
            <span style={{
              display: "block",
              width: 20,
              height: 1.5,
              borderRadius: 1,
              background: "currentColor",
              transition: "transform 0.3s ease, opacity 0.3s ease",
              transform: mobileMenuOpen ? "rotate(-45deg) translateY(-0.75px)" : "rotate(0) translateY(0)",
            }} />
          </span>
        </button>
      </div>
      </div>
      {/* End inner constrained wrapper */}

      {/* Mobile menu - Aave-style flat layout */}
      {mobileMenuOpen && (
        <div
          className="nav-mobile-menu"
          style={{
            position: "fixed",
            top: 80,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 999,
            background: "var(--color-bg, #0f0f10)",
            color: "var(--color-text, #fff)",
            fontFamily: "var(--font-sans, 'Inter', system-ui, -apple-system, sans-serif)",
            display: "flex",
            flexDirection: "column",
          }}
        >

          {/* Scrollable content — flat Aave layout */}
          <div style={{ flex: 1, overflowY: "auto", padding: "24px 16px 64px" }}>
            {entries.map((entry, i) => {
              if (!isDropdown(entry)) return null;
              const isFirst = i === 0;
              return (
                <div key={i}>
                  {/* Section heading — skip for the first group (Products) like Aave */}
                  {!isFirst && (
                    <h2 style={{
                      fontSize: 16,
                      fontWeight: 450,
                      color: "var(--color-text)",
                      margin: 0,
                      padding: "24px 8px 12px",
                    }}>
                      {entry.label}
                    </h2>
                  )}

                  {/* Items */}
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    {entry.items?.map((item, j) => (
                      <a
                        key={j}
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 12,
                          padding: "8px 8px",
                          borderRadius: 12,
                          textDecoration: "none",
                        }}
                      >
                        {/* Icon */}
                        {item.icon && (
                          <div style={{
                            width: 48,
                            height: 48,
                            borderRadius: 12,
                            background: "rgba(255,255,255,0.04)",
                            border: "1px solid rgba(255,255,255,0.06)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                            color: item.accentColor || "color-mix(in srgb, var(--color-text) 50%, transparent)",
                          }}>
                            {item.icon}
                          </div>
                        )}
                        {/* Text */}
                        <div style={{ display: "flex", flexDirection: "column", gap: 1, minWidth: 0 }}>
                          <span style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 6,
                            fontSize: 15,
                            fontWeight: 500,
                            color: "var(--color-text)",
                            lineHeight: "120%",
                          }}>
                            {item.title}
                            {item.badge}
                            {item.external && (
                              <svg width="12" height="12" viewBox="0 0 16 16" fill="none" style={{ opacity: 0.4 }}>
                                <path d="M4.6 11.4L11.4 4.6M11.4 4.6L11.4 10.3M11.4 4.6L5.7 4.7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            )}
                          </span>
                          {item.description && (
                            <span style={{
                              fontSize: 14,
                              fontWeight: 400,
                              color: "color-mix(in srgb, var(--color-text) 50%, transparent)",
                              lineHeight: "150%",
                            }}>
                              {item.description}
                            </span>
                          )}
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ─── Shared morphing dropdown panel ── */}
      {/* Hover bridge — invisible zone between nav buttons and dropdown */}
      <div
        onMouseEnter={cancelClose}
        style={{
          position: "absolute",
          top: "100%",
          left: panelRect.left,
          width: panelRect.width || 0,
          height: 12,
          zIndex: 999,
          pointerEvents: showPanel ? "auto" : "none",
        }}
      />
      {/* Outer wrapper: handles hover zone + arrow (no overflow clip) */}
      <motion.div
        onMouseEnter={cancelClose}
        onMouseLeave={scheduleClose}
        animate={{
          left: panelRect.left,
          width: panelRect.width || 0,
          height: panelRect.height || 0,
          opacity: showPanel ? 1 : 0,
          y: showPanel ? 0 : -6,
        }}
        transition={isFirstOpen.current
          ? { duration: 0 }
          : {
              left: { type: "spring", stiffness: 200, damping: 28, mass: 0.8 },
              width: { type: "spring", stiffness: 200, damping: 28, mass: 0.8 },
              height: { type: "spring", stiffness: 200, damping: 28, mass: 0.8 },
              opacity: { duration: 0.15, ease: "easeOut" },
              y: { duration: 0.15, ease: "easeOut" },
            }
        }
        style={{
          position: "absolute",
          top: "calc(100% + 4px)",
          zIndex: 1000,
          pointerEvents: showPanel ? "auto" : "none",
        }}
      >
        {/* Arrow — outside the clipped panel so it's always visible */}
        <motion.div
          ref={arrowRef}
          animate={{ left: arrowLeft }}
          transition={isFirstOpen.current
            ? { duration: 0 }
            : { type: "spring", stiffness: 200, damping: 28, mass: 0.8 }
          }
          style={{
            position: "absolute",
            top: -7,
            pointerEvents: "none",
            zIndex: 2,
          }}
        >
          <DropdownArrow />
        </motion.div>

        {/* Panel — border-radius + overflow hidden to clip illustrations */}
        <div
          ref={panelRef}
          style={{
            width: "100%",
            height: "100%",
            background: "var(--color-bg)",
            borderRadius: 16,
            border: "1px solid color-mix(in srgb, var(--color-text) 12%, transparent)",
            boxSizing: "border-box",
            boxShadow: "0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.08)",
            overflow: "hidden",
          }}
        >
        {/* Content layers — all dropdowns rendered, only active visible */}
        <div style={{ position: "relative", padding: 10 }}>
          {entries.map((entry, i) => {
            if (!isDropdown(entry)) return null;
            const isCurrent = i === activeIndex;
            const isPrevious = i === previousIndex;
            const hasItems = entry.items && entry.items.length > 0;
            const hasContent = !!entry.content;

            // Determine slide direction
            const direction =
              previousIndex !== null && activeIndex !== null
                ? activeIndex > previousIndex
                  ? "right" // Moving to the right (next menu)
                  : "left" // Moving to the left (previous menu)
                : null;

            const slideAmount = 12;
            let slideX = 0;
            if (isPrevious) {
              // Previous: panel goes right → content slides left (opposite)
              slideX = direction === "right" ? -slideAmount : direction === "left" ? slideAmount : 0;
            } else if (isCurrent && direction) {
              // Current: panel goes right → content arrives from right (opposite), starts at +offset, springs to 0
              slideX = direction === "right" ? slideAmount : direction === "left" ? -slideAmount : 0;
            }

            // Content spring is softer/slower than panel — creates a nice drag effect
            const contentSpring = isFirstOpen.current
              ? { duration: 0 }
              : { type: "spring" as const, stiffness: 120, damping: 22, mass: 1.2 };

            return (
              <motion.div
                key={i}
                ref={(el: HTMLDivElement | null) => {
                  contentRefs.current[i] = el;
                }}
                animate={{
                  opacity: isCurrent ? 1 : 0,
                  x: isPrevious ? slideX : 0,
                }}
                {...(isCurrent && direction && !isFirstOpen.current ? {
                  initial: { x: slideX, opacity: 0 },
                } : {})}
                transition={{
                  opacity: isPrevious
                    ? { duration: 0.12, ease: "easeIn" }
                    : { duration: 0.15, ease: "easeOut" },
                  x: contentSpring,
                }}
                style={{
                  ...(isCurrent
                    ? {}
                    : isPrevious
                      ? {
                          position: "absolute",
                          top: 10,
                          left: 10,
                          pointerEvents: "none",
                        }
                      : {
                          position: "absolute",
                          top: 10,
                          left: 10,
                          pointerEvents: "none",
                        }),
                }}
              >
                {/* Custom content */}
                {hasContent && entry.content}

                {/* Items list */}
                {hasItems && !hasContent && (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 2,
                    }}
                  >
                    <LayoutGroup id={`nav-menu-${i}`}>
                      {entry.items!.map((item, j) => {
                        const isHovered =
                          hoveredItem === `${i}-${j}` && isCurrent;
                        return (
                          <a
                            key={j}
                            href={item.href}
                            onMouseEnter={() => {
                              setHoveredItem(`${i}-${j}`);
                              setHoveredAccent(item.accentColor || null);
                            }}
                            onMouseLeave={() => {
                              setHoveredItem(null);
                              setHoveredAccent(null);
                            }}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 12,
                              padding: "8px 16px 8px 8px",
                              borderRadius: 8,
                              textDecoration: "none",
                              cursor: "pointer",
                              position: "relative",
                            }}
                          >
                            {/* Morphing hover background */}
                            {isHovered && (
                              <motion.div
                                layoutId={`nav-hover-bg-${i}`}
                                style={{
                                  position: "absolute",
                                  inset: 0,
                                  borderRadius: 8,
                                  background: "color-mix(in srgb, var(--color-text) 6%, transparent)",
                                  zIndex: 0,
                                }}
                                transition={{
                                  type: "spring",
                                  stiffness: 300,
                                  damping: 30,
                                  mass: 0.5,
                                }}
                              />
                            )}
                            {(item.icon || item.iconActive) && (
                              <div
                                style={{
                                  position: "relative",
                                  zIndex: 1,
                                  width: 48,
                                  height: 48,
                                  borderRadius: 8,
                                  background: "var(--color-bg)",
                                  border: "1px solid color-mix(in srgb, var(--color-text) 12%, transparent)",
                                  boxSizing: "border-box",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  flexShrink: 0,
                                  color: isHovered && item.accentColor ? item.accentColor : "#b0afad",
                                  transition: "color 0.2s ease",
                                }}
                              >
                                {item.icon}
                              </div>
                            )}
                            <div
                              style={{
                                position: "relative",
                                zIndex: 1,
                                display: "flex",
                                flexDirection: "column",
                                gap: 2,
                              }}
                            >
                              <span
                                style={{
                                  fontSize: 14,
                                  fontWeight: 500,
                                  lineHeight: "120%",
                                  letterSpacing: "0.1px",
                                  color: "var(--color-text)",
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 6,
                                  whiteSpace: "nowrap",
                                }}
                              >
                                {item.title}
                                {item.badge === "new" ? (
                                  <span
                                    style={{
                                      fontSize: 11,
                                      fontWeight: 500,
                                      padding: "3px 8px",
                                      borderRadius: 4,
                                      background: "#9898ff",
                                      color: "#fff",
                                    }}
                                  >
                                    New
                                  </span>
                                ) : (
                                  item.badge
                                )}
                                {item.external && (
                                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ opacity: 0.5 }}>
                                    <path d="M4.60596 11.4267L11.3942 4.63843M11.3942 4.63843L11.3644 10.3251M11.3942 4.63843L5.70755 4.6682" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                                  </svg>
                                )}
                              </span>
                              {item.description && (
                                <span
                                  style={{
                                    fontSize: 14,
                                    fontWeight: 400,
                                    lineHeight: "150%",
                                    letterSpacing: "-0.09px",
                                    color: "var(--color-text-secondary, #636161)",
                                    whiteSpace: "nowrap",
                                  }}
                                >
                                  {item.description}
                                </span>
                              )}
                            </div>
                          </a>
                        );
                      })}
                    </LayoutGroup>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
        </div>
      </motion.div>

      <style>{`
        .navbar-mega-menu * { box-sizing: border-box; }

        /* Responsive padding for inner wrapper */
        .navbar-inner-wrapper {
          padding-left: 16px;
          padding-right: 16px;
        }
        /* Mobile: no top padding, no scroll transform */
        .navbar-mega-menu {
          padding-top: 0px !important;
        }
        @media (min-width: 768px) {
          .navbar-inner-wrapper {
            padding-left: 48px;
            padding-right: 48px;
          }
          .navbar-mega-menu {
            padding-top: 24px !important;
          }
          .navbar-mega-menu.navbar-scrolled {
            transform: translateY(-24px);
          }
        }

        /* Mobile-first: show mobile, hide desktop */
        .nav-desktop-menu { display: none; }
        .nav-desktop-cta { display: none; }
        .nav-mobile-button { display: flex; }
        .nav-mobile-menu { display: block; }

        /* Desktop: show desktop, hide mobile */
        @media (min-width: 768px) {
          .nav-desktop-menu { display: flex; }
          .nav-desktop-cta { display: inline-flex; }
          .nav-mobile-button { display: none; }
          .nav-mobile-menu { display: none; }
        }

        /* Force desktop mode (for builder/preview) */
        .force-desktop .nav-desktop-menu {
          display: flex !important;
        }
        .force-desktop .nav-desktop-cta {
          display: inline-flex !important;
        }
        .force-desktop .nav-mobile-button {
          display: none !important;
        }
        .force-desktop .nav-mobile-menu {
          display: none !important;
        }

        /* Force mobile for phone/tablet breakpoints (builder) */
        .breakpoint-phone .nav-desktop-menu,
        .breakpoint-tablet .nav-desktop-menu {
          display: none !important;
        }
        .breakpoint-phone .nav-desktop-cta,
        .breakpoint-tablet .nav-desktop-cta {
          display: none !important;
        }
        .breakpoint-phone .nav-mobile-button,
        .breakpoint-tablet .nav-mobile-button {
          display: flex !important;
        }
      `}</style>
    </nav>
  );
}

/* ─── Chevron Down ─────────────────────────────── */

function ChevronDown({ active }: { active: boolean }) {
  return (
    <svg
      width="10"
      height="6"
      viewBox="0 0 10 6"
      fill="none"
      style={{
        transition: "transform 0.2s ease",
        transform: active ? "rotate(180deg)" : "rotate(0)",
        flexShrink: 0,
      }}
    >
      <path
        d="M1 1L5 5L9 1"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
