import { create } from "zustand";
import { persist } from "zustand/middleware";
import { nanoid } from "nanoid";
import type { Site, Page, Block, ThemeConfig } from "../builder-registry/types";
import type { PageTemplate } from "../builder-registry/templates";

interface SiteStore {
  sites: Site[];

  /* Site CRUD */
  createSite: (name: string) => string;
  createSiteFromTemplate: (template: PageTemplate, name?: string) => string;
  deleteSite: (siteId: string) => void;
  duplicateSite: (siteId: string) => string;
  renameSite: (siteId: string, name: string) => void;
  updateSiteTheme: (siteId: string, theme: Partial<ThemeConfig>) => void;

  /* Page */
  addPage: (siteId: string, name: string) => string;
  removePage: (siteId: string, pageId: string) => void;
  renamePage: (siteId: string, pageId: string, name: string) => void;

  /* Block */
  addBlock: (siteId: string, pageId: string, block: Block, index?: number) => void;
  removeBlock: (siteId: string, pageId: string, blockId: string) => void;
  duplicateBlock: (siteId: string, pageId: string, blockId: string) => void;
  moveBlock: (siteId: string, pageId: string, fromIndex: number, toIndex: number) => void;
  updateBlockProps: (siteId: string, pageId: string, blockId: string, props: Record<string, unknown>) => void;
}

const defaultTheme: ThemeConfig = {
  font: "Inter",
  brandColor: "#3b82f6",
  dark: false,
};

function touch(site: Site): Site {
  return { ...site, updatedAt: Date.now() };
}

function updateSite(sites: Site[], siteId: string, fn: (s: Site) => Site): Site[] {
  return sites.map((s) => (s.id === siteId ? fn(s) : s));
}

function updatePage(site: Site, pageId: string, fn: (p: Page) => Page): Site {
  return touch({ ...site, pages: site.pages.map((p) => (p.id === pageId ? fn(p) : p)) });
}

export const useSiteStore = create<SiteStore>()(
  persist(
    (set) => ({
      sites: [],

      createSite: (name) => {
        const id = nanoid(10);
        const pageId = nanoid(10);
        const site: Site = {
          id,
          name,
          createdAt: Date.now(),
          updatedAt: Date.now(),
          theme: { ...defaultTheme },
          pages: [{ id: pageId, name: "Home", slug: "/", blocks: [] }],
        };
        set((s) => ({ sites: [...s.sites, site] }));
        return id;
      },

      createSiteFromTemplate: (template, name) => {
        const id = nanoid(10);
        const site: Site = {
          id,
          name: name || template.name,
          createdAt: Date.now(),
          updatedAt: Date.now(),
          theme: { ...template.theme },
          pages: template.pages.map((tp) => ({
            id: nanoid(10),
            name: tp.name,
            slug: tp.slug,
            blocks: tp.blocks.map((b) => ({
              id: nanoid(10),
              type: b.type,
              props: structuredClone(b.props),
            })),
          })),
        };
        set((s) => ({ sites: [...s.sites, site] }));
        return id;
      },

      deleteSite: (siteId) => {
        set((s) => ({ sites: s.sites.filter((x) => x.id !== siteId) }));
      },

      duplicateSite: (siteId) => {
        const newId = nanoid(10);
        set((s) => {
          const original = s.sites.find((x) => x.id === siteId);
          if (!original) return s;
          const clone: Site = {
            ...structuredClone(original),
            id: newId,
            name: `${original.name} (copy)`,
            createdAt: Date.now(),
            updatedAt: Date.now(),
          };
          // Give new IDs to pages and blocks
          for (const page of clone.pages) {
            page.id = nanoid(10);
            for (const block of page.blocks) {
              block.id = nanoid(10);
            }
          }
          return { sites: [...s.sites, clone] };
        });
        return newId;
      },

      renameSite: (siteId, name) => {
        set((s) => ({ sites: updateSite(s.sites, siteId, (site) => touch({ ...site, name })) }));
      },

      updateSiteTheme: (siteId, theme) => {
        set((s) => ({
          sites: updateSite(s.sites, siteId, (site) =>
            touch({ ...site, theme: { ...site.theme, ...theme } }),
          ),
        }));
      },

      addPage: (siteId, name) => {
        const pageId = nanoid(10);
        const slug = `/${name.toLowerCase().replace(/\s+/g, "-")}`;
        set((s) => ({
          sites: updateSite(s.sites, siteId, (site) =>
            touch({ ...site, pages: [...site.pages, { id: pageId, name, slug, blocks: [] }] }),
          ),
        }));
        return pageId;
      },

      removePage: (siteId, pageId) => {
        set((s) => ({
          sites: updateSite(s.sites, siteId, (site) =>
            touch({ ...site, pages: site.pages.filter((p) => p.id !== pageId) }),
          ),
        }));
      },

      renamePage: (siteId, pageId, name) => {
        set((s) => ({
          sites: updateSite(s.sites, siteId, (site) =>
            updatePage(site, pageId, (p) => ({ ...p, name })),
          ),
        }));
      },

      addBlock: (siteId, pageId, block, index) => {
        set((s) => ({
          sites: updateSite(s.sites, siteId, (site) =>
            updatePage(site, pageId, (p) => {
              const blocks = [...p.blocks];
              if (index !== undefined) {
                blocks.splice(index, 0, block);
              } else {
                blocks.push(block);
              }
              return { ...p, blocks };
            }),
          ),
        }));
      },

      removeBlock: (siteId, pageId, blockId) => {
        set((s) => ({
          sites: updateSite(s.sites, siteId, (site) =>
            updatePage(site, pageId, (p) => ({
              ...p,
              blocks: p.blocks.filter((b) => b.id !== blockId),
            })),
          ),
        }));
      },

      duplicateBlock: (siteId, pageId, blockId) => {
        set((s) => ({
          sites: updateSite(s.sites, siteId, (site) =>
            updatePage(site, pageId, (p) => {
              const idx = p.blocks.findIndex((b) => b.id === blockId);
              if (idx === -1) return p;
              const clone: Block = { ...structuredClone(p.blocks[idx]), id: nanoid(10) };
              const blocks = [...p.blocks];
              blocks.splice(idx + 1, 0, clone);
              return { ...p, blocks };
            }),
          ),
        }));
      },

      moveBlock: (siteId, pageId, fromIndex, toIndex) => {
        set((s) => ({
          sites: updateSite(s.sites, siteId, (site) =>
            updatePage(site, pageId, (p) => {
              const blocks = [...p.blocks];
              const [moved] = blocks.splice(fromIndex, 1);
              blocks.splice(toIndex, 0, moved);
              return { ...p, blocks };
            }),
          ),
        }));
      },

      updateBlockProps: (siteId, pageId, blockId, props) => {
        set((s) => ({
          sites: updateSite(s.sites, siteId, (site) =>
            updatePage(site, pageId, (p) => ({
              ...p,
              blocks: p.blocks.map((b) =>
                b.id === blockId ? { ...b, props: { ...b.props, ...props } } : b,
              ),
            })),
          ),
        }));
      },
    }),
    { name: "uilibrary-builder-sites" },
  ),
);
