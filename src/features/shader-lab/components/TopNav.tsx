import "./TopNav.css";

export type Route = "webgl" | "motions" | "sites";

interface Props {
  route: Route;
  onChange: (r: Route) => void;
}

const TABS: { id: Route; label: string }[] = [
  { id: "webgl", label: "WebGL" },
  { id: "motions", label: "Motions" },
  { id: "sites", label: "Sites" },
];

export const TopNav: React.FC<Props> = ({ route, onChange }) => {
  return (
    <div className="topnav">
      <span className="topnav-brand">Lab</span>
      <span className="topnav-divider" />
      <div className="topnav-tabs" role="tablist">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={route === t.id}
            className={`topnav-tab ${route === t.id ? "active" : ""}`}
            onClick={() => onChange(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>
    </div>
  );
};
