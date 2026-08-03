/**
 * All SEO-related Vite plugins, assembled into vite.config.ts via
 * seoPlugins(). Only the build pipeline and tests import this module —
 * it uses node APIs and must never be imported by application code.
 *
 * - inline-seo: bakes the static head tags into index.html
 * - generate-sitemap / prerender-details: fetch every record after the
 *   bundle is written; run on prod (the indexable build) and edge (a
 *   rehearsal, so a broken build is caught on merge day instead of
 *   release day)
 * - copy-robots-txt: serves/copies the per-environment robots.txt
 */

import fs from "fs";
import path from "path";
import type { ViteDevServer } from "vite";
import { warnSeoStepFailed } from "./buildReporting";
import { buildSeoHeadTags } from "./headTags";

interface SeoPluginOptions {
  mode: string;
  rootDir: string;
}

const runsSeoBuildSteps = (mode: string) => mode === "prod" || mode === "edge";

// Edge builds run on every merge; an API hiccup must not block deploys, so
// only prod rethrows — edge degrades to a (loud, see buildReporting) warning
const seoBuildStep =
  (mode: string, step: string, run: () => Promise<void>) => async () => {
    if (!runsSeoBuildSteps(mode)) return;
    try {
      await run();
    } catch (error) {
      if (mode === "prod") throw error;
      warnSeoStepFailed(step, error);
    }
  };

const robotsFileFor = (mode: string) =>
  mode === "prod" ? "robots.prod.txt" : "robots.nonprod.txt";

export const inlineSeoTagsPlugin = ({ mode }: SeoPluginOptions) => ({
  name: "inline-seo",
  transformIndexHtml(html: string) {
    // Canonical is set at runtime per route (canonicalUrl.ts) — the SPA has a
    // single index.html, so a static canonical would point every page at "/"
    return html.replace("<!-- seo-tags -->", buildSeoHeadTags(mode === "prod"));
  },
});

export const generateSitemapPlugin = ({ mode, rootDir }: SeoPluginOptions) => ({
  name: "generate-sitemap",
  closeBundle: seoBuildStep(mode, "Sitemap generation", async () => {
    const { generateSitemap } = await import("./SitemapUtils");
    await generateSitemap(path.resolve(rootDir, "dist"));
  }),
});

export const prerenderDetailsPlugin = ({
  mode,
  rootDir,
}: SeoPluginOptions) => ({
  name: "prerender-details",
  closeBundle: seoBuildStep(mode, "Detail prerender", async () => {
    const { prerenderDetailPages } = await import("./PrerenderUtils");
    await prerenderDetailPages(path.resolve(rootDir, "dist"));
  }),
});

export const copyRobotsPlugin = ({ mode, rootDir }: SeoPluginOptions) => ({
  name: "copy-robots-txt",
  configureServer(server: ViteDevServer) {
    server.middlewares.use((req, res, next) => {
      if (req.url === "/robots.txt") {
        const content = fs.readFileSync(
          path.resolve(rootDir, "public", robotsFileFor(mode)),
          "utf8"
        );
        res.setHeader("Content-Type", "text/plain");
        res.end(content);
        return;
      }
      next();
    });
  },
  closeBundle() {
    fs.copyFileSync(
      path.resolve(rootDir, "public", robotsFileFor(mode)),
      path.resolve(rootDir, "dist/robots.txt")
    );
  },
});

export const seoPlugins = (options: SeoPluginOptions) => [
  inlineSeoTagsPlugin(options),
  generateSitemapPlugin(options),
  prerenderDetailsPlugin(options),
  copyRobotsPlugin(options),
];
