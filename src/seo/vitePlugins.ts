/**
 * Vite build plugins: inline the static SEO head tags into index.html and
 * pick the per-environment robots.txt. Node-only — never import in app code.
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
