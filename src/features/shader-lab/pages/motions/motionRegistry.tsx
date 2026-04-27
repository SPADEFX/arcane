import "./motions.css";

export type MotionCategory =
  | "Text"
  | "Loader"
  | "Shape"
  | "Card"
  | "Icon"
  | "FX"
  | "Hover"
  | "Chart";

export interface MotionDef {
  id: string;
  name: string;
  category: MotionCategory;
  reference?: string; // link to yui540's original motion (inspiration)
  render: () => React.ReactNode;
}

export const MOTIONS: MotionDef[] = [
  // ─── Motion 01 · original riff on yui540's 7-loader composition ──
  // Same palette & grid archetype (3-col, "a1 a1 a2 / a3 a4 a5 / a6 a7 a7"),
  // all 7 sub-loaders are original choices.
  {
    id: "m01-ensemble",
    name: "Loader ensemble",
    category: "Loader",
    reference: "https://yui540.com/motions/1",
    render: () => (
      <div className="m-m01r-grid">
        <div className="m-m01r-cell m-m01r-a1">
          <div className="m-m01r-ticker">
            {[0, 1, 2].map((i) => (
              <div className="m-m01r-digit" key={i}>
                <span>
                  {["0","1","2","3","4","5","6","7","8","9","0"].map((d, j) => (
                    <span key={j}>{d}</span>
                  ))}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="m-m01r-cell m-m01r-a2">
          <svg viewBox="0 0 40 40" width="28" height="28" className="m-m01r-arc">
            <circle cx="20" cy="20" r="14" fill="none" stroke="#111" strokeWidth="3" strokeDasharray="66 22" strokeLinecap="round" />
          </svg>
        </div>
        <div className="m-m01r-cell m-m01r-a3">
          <div className="m-m01r-ring">
            <svg viewBox="0 0 40 40" width="32" height="32">
              <circle cx="20" cy="20" r="16" fill="none" stroke="#dcdcd6" strokeWidth="4" />
              <circle cx="20" cy="20" r="16" fill="none" stroke="#f4ad60" strokeWidth="4" strokeLinecap="round" strokeDasharray="100" strokeDashoffset="100" transform="rotate(-90 20 20)" />
            </svg>
          </div>
        </div>
        <div className="m-m01r-cell m-m01r-a4">
          <div className="m-m01r-balls">
            {[0, 1, 2].map((i) => (
              <span key={i} style={{ animationDelay: `${i * 0.14}s` }} />
            ))}
          </div>
        </div>
        <div className="m-m01r-cell m-m01r-a5">
          <div className="m-m01r-wave">
            {[0, 1, 2, 3, 4].map((i) => (
              <span key={i} style={{ animationDelay: `${i * 0.1}s` }} />
            ))}
          </div>
        </div>
        <div className="m-m01r-cell m-m01r-a6">
          <div className="m-m01r-fill" />
        </div>
        <div className="m-m01r-cell m-m01r-a7">
          <div className="m-m01r-blocks">
            {[0, 1, 2, 3].map((i) => (
              <span key={i} style={{ animationDelay: `${i * 0.22}s` }} />
            ))}
          </div>
        </div>
      </div>
    ),
  },

  // ─── Loader · Motion 01 sub-pieces (tribute to yui540's grid) ────
  {
    id: "m01-loading-text",
    name: "LOADING sweep",
    category: "Loader",
    reference: "https://yui540.com/motions/1",
    render: () => (
      <div className="m-load-std m-load-text">
        <span className="m-load-lg-letters">
          {"LOADING".split("").map((c, i) => (
            <span key={i} style={{ animationDelay: `${0.06 * i}s` }}>{c}</span>
          ))}
        </span>
        <span className="m-load-lg-underline" />
      </div>
    ),
  },
  {
    id: "m01-pulse",
    name: "Pulse dot",
    category: "Loader",
    reference: "https://yui540.com/motions/1",
    render: () => (
      <div className="m-load-std m-load-pulse"><span /></div>
    ),
  },
  {
    id: "m01-equalizer",
    name: "Equalizer",
    category: "Loader",
    reference: "https://yui540.com/motions/1",
    render: () => (
      <div className="m-load-std m-load-bars">
        <div className="m-load-bars-row">
          {Array.from({ length: 9 }).map((_, i) => (
            <span key={i} style={{ animationDelay: `${0.08 * i}s` }} />
          ))}
        </div>
        <span className="m-load-sublabel">LOADING...</span>
      </div>
    ),
  },
  {
    id: "m01-hourglass",
    name: "Hourglass",
    category: "Loader",
    reference: "https://yui540.com/motions/1",
    render: () => (
      <div className="m-load-std m-load-hour">
        <svg viewBox="0 0 40 50" width="56" height="70" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M8 4 L32 4 M8 46 L32 46 M10 4 C10 16 30 22 30 34 L30 46 M30 4 C30 16 10 22 10 34 L10 46" />
        </svg>
        <span className="m-load-sand" />
      </div>
    ),
  },
  {
    id: "m01-toggle",
    name: "Toggle slide",
    category: "Loader",
    reference: "https://yui540.com/motions/1",
    render: () => (
      <div className="m-load-std m-load-toggle">
        <span className="m-load-toggle-pill">
          <span className="m-load-toggle-knob" />
        </span>
        <span className="m-load-sublabel">LOADING</span>
      </div>
    ),
  },
  {
    id: "m01-stair",
    name: "Step dots",
    category: "Loader",
    reference: "https://yui540.com/motions/1",
    render: () => (
      <div className="m-load-std m-load-stair">
        <span /><span /><span />
      </div>
    ),
  },
  {
    id: "m01-rings",
    name: "Ring sweep",
    category: "Loader",
    reference: "https://yui540.com/motions/1",
    render: () => (
      <div className="m-load-std m-load-rings">
        {[0, 1, 2, 3].map((i) => (
          <span key={i} style={{ animationDelay: `${0.18 * i}s` }} />
        ))}
      </div>
    ),
  },
  {
    id: "blur-reveal",
    name: "Blur reveal",
    category: "Text",
    reference: "https://yui540.com/motions/2",
    render: () => (
      <div className="m-blur-reveal"><span>sharp</span></div>
    ),
  },
  {
    id: "split-reveal",
    name: "Split reveal",
    category: "Text",
    reference: "https://yui540.com/motions/3",
    render: () => (
      <div className="m-split-reveal">
        <span className="m-split-top">motion</span>
        <span className="m-split-bot">motion</span>
      </div>
    ),
  },
  {
    id: "type-write",
    name: "Typewriter",
    category: "Text",
    reference: "https://yui540.com/motions/4",
    render: () => (
      <div className="m-typewriter">
        <span className="m-type-text">typing…</span>
        <span className="m-type-caret" />
      </div>
    ),
  },
  {
    id: "slide-swap",
    name: "Word swap",
    category: "Text",
    reference: "https://yui540.com/motions/5",
    render: () => (
      <div className="m-slide-swap">
        <span>fast</span><span>loud</span><span>soft</span>
      </div>
    ),
  },
  {
    id: "mask-wipe",
    name: "Mask wipe",
    category: "Text",
    reference: "https://yui540.com/motions/6",
    render: () => (
      <div className="m-mask-wipe">
        <span>wiped</span>
        <span className="m-wipe-bar" />
      </div>
    ),
  },

  // ─── Loader ─────────────────────────────────────────────
  {
    id: "digit-flip",
    name: "Digit roll",
    category: "Loader",
    reference: "https://yui540.com/motions/7",
    render: () => (
      <div className="m-digit-flip">
        <div className="m-digit-col">
          {["0","1","2","3","4","5","6","7","8","9"].map((d) => (
            <span key={d}>{d}</span>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: "orbit-dots",
    name: "Orbit dots",
    category: "Loader",
    reference: "https://yui540.com/motions/8",
    render: () => (
      <div className="m-orbit">
        {[0,1,2,3].map((i) => (
          <div key={i} className="m-orbit-dot" style={{ animationDelay: `${i * 0.15}s` }} />
        ))}
      </div>
    ),
  },
  {
    id: "progress-bar",
    name: "Progress bar",
    category: "Loader",
    reference: "https://yui540.com/motions/9",
    render: () => (
      <div className="m-progress">
        <div className="m-progress-fill" />
      </div>
    ),
  },
  {
    id: "dot-pulse",
    name: "Dot pulse",
    category: "Loader",
    reference: "https://yui540.com/motions/10",
    render: () => (
      <div className="m-dot-pulse">
        {[0,1,2].map((i) => (
          <span key={i} style={{ animationDelay: `${i * 0.16}s` }} />
        ))}
      </div>
    ),
  },

  // ─── Shape ──────────────────────────────────────────────
  {
    id: "pill-morph",
    name: "Pill morph",
    category: "Shape",
    reference: "https://yui540.com/motions/11",
    render: () => (
      <div className="m-pill-morph"><div className="m-pill" /></div>
    ),
  },
  {
    id: "squish-bounce",
    name: "Squish bounce",
    category: "Shape",
    reference: "https://yui540.com/motions/12",
    render: () => (
      <div className="m-squish"><div className="m-blob" /></div>
    ),
  },
  {
    id: "square-spin",
    name: "Square spin",
    category: "Shape",
    reference: "https://yui540.com/motions/13",
    render: () => (
      <div className="m-square-spin"><div className="m-square" /></div>
    ),
  },

  // ─── Card ───────────────────────────────────────────────
  {
    id: "scale-pop",
    name: "Scale pop",
    category: "Card",
    reference: "https://yui540.com/motions/14",
    render: () => (
      <div className="m-scale-pop"><div className="m-card" /></div>
    ),
  },
  {
    id: "stack-rise",
    name: "Stack rise",
    category: "Card",
    reference: "https://yui540.com/motions/15",
    render: () => (
      <div className="m-stack-rise">
        {[0,1,2].map((i) => (
          <div key={i} className="m-bar" style={{ animationDelay: `${i * 0.12}s` }} />
        ))}
      </div>
    ),
  },
  {
    id: "flip-card",
    name: "Flip card",
    category: "Card",
    reference: "https://yui540.com/motions/16",
    render: () => (
      <div className="m-flip-card">
        <div className="m-flip-inner">
          <div className="m-flip-front">A</div>
          <div className="m-flip-back">B</div>
        </div>
      </div>
    ),
  },

  // ─── Icon ───────────────────────────────────────────────
  {
    id: "check-draw",
    name: "Check draw",
    category: "Icon",
    reference: "https://yui540.com/motions/17",
    render: () => (
      <div className="m-check-draw">
        <svg viewBox="0 0 48 48" width="44" height="44" fill="none">
          <circle cx="24" cy="24" r="20" className="m-check-ring" />
          <path d="M14 24 L22 32 L34 18" className="m-check-tick" />
        </svg>
      </div>
    ),
  },
  {
    id: "heart-beat",
    name: "Heart beat",
    category: "Icon",
    reference: "https://yui540.com/motions/18",
    render: () => (
      <div className="m-heart-beat">
        <svg viewBox="0 0 32 32" width="40" height="40" aria-hidden>
          <path
            d="M16 28 C6 20 2 14 6 8 C10 3 15 6 16 10 C17 6 22 3 26 8 C30 14 26 20 16 28 Z"
            fill="#ff5470"
          />
        </svg>
      </div>
    ),
  },

  // ─── FX ─────────────────────────────────────────────────
  {
    id: "ripple-burst",
    name: "Ripple burst",
    category: "FX",
    reference: "https://yui540.com/motions/19",
    render: () => (
      <div className="m-ripple-burst">
        {[0,1,2].map((i) => (
          <div key={i} className="m-ripple" style={{ animationDelay: `${i * 0.4}s` }} />
        ))}
      </div>
    ),
  },
  {
    id: "sparkle",
    name: "Sparkle",
    category: "FX",
    reference: "https://yui540.com/motions/20",
    render: () => (
      <div className="m-sparkle">
        {[0,1,2,3].map((i) => (
          <span key={i} style={{ animationDelay: `${i * 0.2}s`, transform: `rotate(${i * 45}deg)` }} />
        ))}
      </div>
    ),
  },
];

export const CATEGORIES: MotionCategory[] = [
  "Text",
  "Loader",
  "Shape",
  "Card",
  "Icon",
  "FX",
];
