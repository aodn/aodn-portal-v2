/**
 * All SEO-related Vite plugins, assembled into vite.config.ts via
 * seoPlugins(). Only the build pipeline and tests import this module —
 * it uses node APIs and must never be imported by application code.
 *
 * - inline-seo: bakes the static head tags into index.html
 * - copy-robots-txt: serves/copies the per-environment robots.txt
 *
 * sitemap.xml and the pre-rendered /details pages are NOT built here — the
 * Publish SEO Artifacts workflow generates them straight from the live site.
 */

import fs from "fs";
import path from "path";
import type { ViteDevServer } from "vite";
import { buildSeoHeadTags } from "./headTags";

interface SeoPluginOptions {
  mode: string;
  rootDir: string;
}

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
  copyRobotsPlugin(options),
];
