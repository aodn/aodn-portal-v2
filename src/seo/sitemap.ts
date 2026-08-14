/**
 * Builds dist/sitemap.xml listing the home page and every /details/<uuid>.
 * Standalone: npx vite-node src/seo/sitemap.ts — see README.md
 */

import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { OGCCollection } from "@/app/store/OGCCollectionDefinitions";
import { isSeoCli, runCli, seoDistDir } from "./cli";
import {
  BASE_URL,
  detailsUrl,
  escapeEntities,
  isSafeCollectionId,
} from "./constants";

export const toSitemapXml = (uuids: string[], generatedAt = new Date()) => {
  const urls = [`${BASE_URL}/`, ...uuids.map(detailsUrl)];
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    // Crawlers ignore comments; this tells a human how stale the live file is
    `<!-- generated ${generatedAt.toISOString()} by the Publish SEO Artifacts workflow -->`,
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls.map((url) => `  <url><loc>${escapeEntities(url)}</loc></url>`),
    "</urlset>",
    "",
  ].join("\n");
};

export const generateSitemap = async (
  outDir: string,
  collections: OGCCollection[]
) => {
  const uuids = collections
    .map((collection) => collection.id)
    .filter(isSafeCollectionId);
  if (uuids.length === 0) {
    throw new Error(
      "No collections returned from the OGC API; refusing to write an empty sitemap."
    );
  }
  // sitemaps.org caps a single file at 50,000 URLs
  if (uuids.length >= 50000) {
    throw new Error(
      `${uuids.length} URLs exceed the 50,000-per-sitemap limit; split into a sitemap index.`
    );
  }

  await mkdir(outDir, { recursive: true });
  const outFile = path.join(outDir, "sitemap.xml");
  await writeFile(outFile, toSitemapXml(uuids));
  console.log(`Wrote ${uuids.length + 1} URLs to ${outFile}`);
};

if (isSeoCli("sitemap.ts")) {
  runCli(
    import("./prerender")
      .then(({ fetchCollections }) => fetchCollections("id"))
      .then((collections) => generateSitemap(seoDistDir(), collections))
  );
}
