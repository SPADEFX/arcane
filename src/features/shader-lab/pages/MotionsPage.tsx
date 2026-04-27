import { useMemo, useState } from "react";
import "./MotionsPage.css";
import { CATEGORIES, MOTIONS, type MotionCategory } from "./motions/motionRegistry";
import { YuiJsonTile, type YuiMotionData } from "./motions/YuiJsonTile";

type Filter = MotionCategory | "All";
type Tab = "Presets" | "Reference";

// Any JSON dropped into yui-reference/ is auto-discovered at build time.
const REFERENCE_MODULES = import.meta.glob<YuiMotionData>(
  "./motions/yui-reference/motion-*.json",
  { eager: true, import: "default" },
);

interface ReferenceEntry {
  id: string;
  number: number;
  data: YuiMotionData;
}

const REFERENCE_ENTRIES: ReferenceEntry[] = Object.entries(REFERENCE_MODULES)
  .map(([path, data]) => {
    const m = /motion-(\d+)\.json/.exec(path);
    const number = m ? Number(m[1]) : 0;
    return { id: path, number, data };
  })
  .sort((a, b) => a.number - b.number);

export const MotionsPage: React.FC = () => {
  const [tab, setTab] = useState<Tab>("Presets");
  const [filter, setFilter] = useState<Filter>("All");

  const motions = useMemo(
    () => (filter === "All" ? MOTIONS : MOTIONS.filter((m) => m.category === filter)),
    [filter],
  );

  const countsByCat = useMemo(() => {
    const m = new Map<Filter, number>();
    m.set("All", MOTIONS.length);
    for (const cat of CATEGORIES) {
      m.set(cat, MOTIONS.filter((x) => x.category === cat).length);
    }
    return m;
  }, []);

  return (
    <div className="motions-page">
      <div className="motions-header">
        <span className="type-overline">Motions</span>
        <h1 className="motions-title">Micro-motion library.</h1>
        <p className="motions-subtitle">
          A growing set of CSS-driven motion presets. Each tile loops live and
          links back to its reference. All implementations are our own; the
          vocabulary and many ideas are inspired by the motion work of yui540
          — used with explicit permission.
        </p>
        <a
          className="motions-credit"
          href="https://yui540.com/motions"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span className="motions-credit-dot" />
          <span>
            Inspired by <strong>yui540</strong>'s motion collection — visit the
            source ↗
          </span>
        </a>
      </div>

      <div className="motions-tabs" role="tablist" style={{ marginBottom: 8 }}>
        {(["Presets", "Reference"] as Tab[]).map((t) => (
          <button
            key={t}
            type="button"
            role="tab"
            aria-selected={tab === t}
            className={`motions-tab ${tab === t ? "active" : ""}`}
            onClick={() => setTab(t)}
          >
            {t}
            <span className="motions-tab-count">
              {t === "Presets" ? MOTIONS.length : REFERENCE_ENTRIES.length}
            </span>
          </button>
        ))}
      </div>

      {tab === "Presets" && (
        <>
          <div className="motions-tabs" role="tablist">
            {(["All", ...CATEGORIES] as Filter[]).map((cat) => (
              <button
                key={cat}
                type="button"
                role="tab"
                aria-selected={filter === cat}
                className={`motions-tab ${filter === cat ? "active" : ""}`}
                onClick={() => setFilter(cat)}
              >
                {cat}
                <span className="motions-tab-count">{countsByCat.get(cat) ?? 0}</span>
              </button>
            ))}
          </div>

          <div className="motions-grid">
            {motions.map((m) => (
              <div key={m.id} className="motion-tile">
                <div className="m-tile-stage">{m.render()}</div>
                <div className="motion-tile-footer">
                  <div className="motion-tile-meta">
                    <span className="motion-tile-name">{m.name}</span>
                    <span className="motion-tile-tag">{m.category}</span>
                  </div>
                  {m.reference && (
                    <a
                      className="motion-tile-ref"
                      href={m.reference}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="View original reference"
                    >
                      Ref ↗
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {tab === "Reference" && (
        <div className="motions-grid">
          {REFERENCE_ENTRIES.length === 0 ? (
            <p className="type-caption" style={{ gridColumn: "1/-1", color: "var(--ds-color-text-muted)" }}>
              No reference files yet. Drop motion JSON into
              <code style={{ margin: "0 6px" }}>src/pages/motions/yui-reference/</code>
              (see the README there + the extraction script in
              <code style={{ margin: "0 6px" }}>tools/extract-yui.js</code>).
            </p>
          ) : (
            REFERENCE_ENTRIES.map((entry) => (
              <div key={entry.id} className="motion-tile">
                <div className="m-tile-stage">
                  <YuiJsonTile data={entry.data} />
                </div>
                <div className="motion-tile-footer">
                  <div className="motion-tile-meta">
                    <span className="motion-tile-name">
                      Motion {String(entry.number).padStart(2, "0")}
                    </span>
                    <span className="motion-tile-tag">Reference</span>
                  </div>
                  <a
                    className="motion-tile-ref"
                    href={entry.data.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Source ↗
                  </a>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
