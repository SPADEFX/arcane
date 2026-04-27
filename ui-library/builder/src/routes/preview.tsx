import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { SiteTheme } from "@uilibrary/ui";
import { useSiteStore } from "../stores/site-store";
import { BlockRenderer } from "../components/block-renderer";

export function Preview() {
  const { siteId } = useParams<{ siteId: string }>();
  const navigate = useNavigate();
  const site = useSiteStore((s) => s.sites.find((x) => x.id === siteId));

  useEffect(() => {
    document.title = "Preview";
  }, []);

  if (!site) {
    return (
      <div className="flex h-screen items-center justify-center bg-black text-white">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Site not found</h1>
          <button
            onClick={() => navigate("/")}
            className="mt-4 rounded-lg bg-white px-6 py-2 text-sm font-medium text-black"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // Render first page for now (could add page routing later)
  const page = site.pages[0];

  return (
    <SiteTheme
      font={site.theme.font}
      brandColor={site.theme.brandColor}
      dark={site.theme.dark}
      radius={site.theme.radius}
    >
      <div style={{ background: "var(--color-bg)", minHeight: "100vh" }}>
        {page?.blocks.map((block) => (
          <BlockRenderer key={block.id} block={block} />
        ))}
      </div>
    </SiteTheme>
  );
}
