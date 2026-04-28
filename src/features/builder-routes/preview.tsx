import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { SiteTheme } from "@uilibrary/ui";
import { useSiteStore } from "../builder-stores/site-store";
import { BlockRenderer } from "../builder-components/block-renderer";
import { loadExtractedBlocks } from "../builder-registry/blocks";
import "../builder-globals.css";

export function Preview() {
  const { siteId } = useParams<{ siteId: string }>();
  const navigate = useNavigate();
  const site = useSiteStore((s) => s.sites.find((x) => x.id === siteId));
  const [ready, setReady] = useState(false);

  useEffect(() => {
    document.title = site ? `Preview — ${site.name}` : "Preview";
    loadExtractedBlocks().then(() => setReady(true));
  }, [site]);

  if (!site) {
    return (
      <div className="flex h-full items-center justify-center bg-black text-white">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Site not found</h1>
          <button
            onClick={() => navigate("/builder")}
            className="mt-4 rounded-lg bg-white px-6 py-2 text-sm font-medium text-black"
          >
            Back to Builder
          </button>
        </div>
      </div>
    );
  }

  const page = site.pages[0];

  return (
    <div className="h-full overflow-y-auto overflow-x-hidden">
      <SiteTheme
        font={site.theme.font}
        brandColor={site.theme.brandColor}
        dark={site.theme.dark}
        radius={site.theme.radius}
      >
        <div className="force-desktop canvas-isolate" style={{ background: "var(--color-bg)", minHeight: "100%" }}>
          {!ready ? (
            <div style={{ padding: 40, textAlign: "center", color: "#666" }}>Loading blocks...</div>
          ) : page?.blocks.map((block) => (
            <BlockRenderer key={block.id} block={block} />
          ))}
        </div>
      </SiteTheme>
    </div>
  );
}
