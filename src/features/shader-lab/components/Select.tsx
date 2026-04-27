import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import "./Select.css";

export interface SelectOption<T extends string | number> {
  label: string;
  value: T;
}

interface Props<T extends string | number> {
  value: T;
  options: SelectOption<T>[];
  onChange: (value: T) => void;
  className?: string;
  placeholder?: string;
}

export function Select<T extends string | number>({
  value,
  options,
  onChange,
  className,
  placeholder,
}: Props<T>) {
  const btnRef = useRef<HTMLButtonElement>(null);
  const popRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<{ left: number; top: number; width: number }>(
    { left: 0, top: 0, width: 120 },
  );
  const [activeIdx, setActiveIdx] = useState(0);

  const selectedIdx = Math.max(
    0,
    options.findIndex((o) => o.value === value),
  );
  const selected = options[selectedIdx];

  useLayoutEffect(() => {
    if (!open || !btnRef.current) return;
    const r = btnRef.current.getBoundingClientRect();
    const maxH = 260;
    const belowSpace = window.innerHeight - r.bottom - 12;
    const top = belowSpace < 180 && r.top > maxH ? r.top - maxH - 6 : r.bottom + 4;
    setPos({ left: r.left, top, width: r.width });
    setActiveIdx(selectedIdx);
  }, [open, selectedIdx]);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      const t = e.target as Node;
      if (popRef.current?.contains(t) || btnRef.current?.contains(t)) return;
      setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIdx((i) => Math.min(options.length - 1, i + 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIdx((i) => Math.max(0, i - 1));
      } else if (e.key === "Enter") {
        e.preventDefault();
        const o = options[activeIdx];
        if (o) {
          onChange(o.value);
          setOpen(false);
        }
      }
    };
    window.addEventListener("mousedown", onClick);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("mousedown", onClick);
      window.removeEventListener("keydown", onKey);
    };
  }, [open, activeIdx, options, onChange]);

  return (
    <>
      <button
        ref={btnRef}
        type="button"
        className={`ds-select ${className ?? ""} ${open ? "open" : ""}`}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="ds-select-label">
          {selected ? selected.label : placeholder ?? "—"}
        </span>
        <svg
          className="ds-select-caret"
          width="10"
          height="10"
          viewBox="0 0 256 256"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M216.49 104.49l-80 80a12 12 0 0 1-17 0l-80-80a12 12 0 0 1 17-17L128 159l71.51-71.52a12 12 0 0 1 17 17Z" />
        </svg>
      </button>
      {open &&
        createPortal(
          <div
            ref={popRef}
            className="ds-select-pop"
            style={{ left: pos.left, top: pos.top, minWidth: pos.width }}
          >
            {options.map((o, i) => (
              <button
                key={String(o.value)}
                type="button"
                className={`ds-select-opt ${o.value === value ? "selected" : ""} ${
                  i === activeIdx ? "active" : ""
                }`}
                onMouseEnter={() => setActiveIdx(i)}
                onClick={() => {
                  onChange(o.value);
                  setOpen(false);
                }}
              >
                <span className="ds-select-check">
                  {o.value === value ? (
                    <svg width="10" height="10" viewBox="0 0 256 256" fill="currentColor">
                      <path d="M229.66 77.66l-128 128a8 8 0 0 1-11.32 0l-56-56a8 8 0 0 1 11.32-11.32L96 188.69 218.34 66.34a8 8 0 0 1 11.32 11.32Z" />
                    </svg>
                  ) : null}
                </span>
                <span className="ds-select-opt-label">{o.label}</span>
              </button>
            ))}
          </div>,
          document.body,
        )}
    </>
  );
}
