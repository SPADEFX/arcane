export const SitesPage: React.FC = () => {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: 10,
        padding: 32,
        background: "var(--ds-color-canvas)",
      }}
    >
      <span className="type-overline" style={{ color: "var(--ds-color-text-muted)" }}>
        Sites · placeholder
      </span>
      <h2
        style={{
          fontFamily: "var(--ds-font-sans)",
          fontSize: 44,
          fontWeight: 700,
          letterSpacing: "-0.02em",
          color: "var(--ds-color-text-primary)",
          margin: 0,
        }}
      >
        Stitch scenes into pages.
      </h2>
      <p
        style={{
          fontFamily: "var(--ds-font-sans)",
          fontSize: 16,
          color: "var(--ds-color-text-secondary)",
          maxWidth: 560,
          textAlign: "center",
          margin: 0,
        }}
      >
        Drop WebGL scenes and motion presets into a block-based site builder
        with export to code. Coming after the Motions workspace lands.
      </p>
    </div>
  );
};
