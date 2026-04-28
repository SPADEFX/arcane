import type { ThemeConfig } from "../builder-registry/types";

const fonts = [
  "Inter",
  "DM Sans",
  "Space Grotesk",
  "Plus Jakarta Sans",
  "Outfit",
  "Manrope",
  "Instrument Sans",
  "Syne",
];

interface ThemePanelProps {
  theme: ThemeConfig;
  onChange: (partial: Partial<ThemeConfig>) => void;
}

export function ThemePanel({ theme, onChange }: ThemePanelProps) {
  return (
    <div className="space-y-2.5">
      <h3 className="text-[10px] font-medium uppercase tracking-wider text-white/25">
        Theme
      </h3>

      {/* Font */}
      <div>
        <label className="mb-1 block text-[10px] font-medium text-white/40">Font</label>
        <select
          value={theme.font}
          onChange={(e) => onChange({ font: e.target.value })}
          className="w-full rounded-md bg-white/[0.04] px-2 py-1 text-[11px] text-white/80 outline-none transition-colors focus:bg-white/[0.07] hover:bg-white/[0.06]"
        >
          {fonts.map((f) => (
            <option key={f} value={f}>
              {f}
            </option>
          ))}
        </select>
      </div>

      {/* Brand Color */}
      <div>
        <label className="mb-1 block text-[10px] font-medium text-white/40">Brand Color</label>
        <div className="flex items-center gap-1.5">
          <input
            type="color"
            value={theme.brandColor}
            onChange={(e) => onChange({ brandColor: e.target.value })}
            className="h-7 w-7 cursor-pointer rounded-md border-none bg-transparent"
          />
          <input
            type="text"
            value={theme.brandColor}
            onChange={(e) => onChange({ brandColor: e.target.value })}
            className="flex-1 rounded-md bg-white/[0.04] px-2 py-1 text-[11px] text-white/80 outline-none transition-colors focus:bg-white/[0.07] hover:bg-white/[0.06]"
          />
        </div>
      </div>

      {/* Dark Mode — toggle switch */}
      <div className="flex items-center justify-between py-0.5">
        <span className="text-[11px] text-white/50">Dark Mode</span>
        <button
          onClick={() => onChange({ dark: !theme.dark })}
          className={`relative h-4 w-7 rounded-full transition-colors ${
            theme.dark ? "bg-blue-500" : "bg-white/10"
          }`}
        >
          <span
            className={`absolute top-0.5 h-3 w-3 rounded-full bg-white shadow-sm transition-transform ${
              theme.dark ? "translate-x-3" : "translate-x-0.5"
            }`}
          />
        </button>
      </div>

      {/* Radius */}
      <div>
        <label className="mb-1 block text-[10px] font-medium text-white/40">Border Radius</label>
        <div className="flex rounded-md bg-white/[0.04] p-0.5">
          {(["none", "sm", "md", "lg", "xl"] as const).map((r) => (
            <button
              key={r}
              onClick={() => onChange({ radius: r })}
              className={`flex-1 rounded py-0.5 text-[9px] font-medium transition-all ${
                (theme.radius ?? "md") === r
                  ? "bg-white/[0.1] text-white shadow-sm"
                  : "text-white/30 hover:text-white/50"
              }`}
            >
              {r === "none" ? "0" : r.toUpperCase()}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
