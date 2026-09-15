/**
 * Builds dist/sitemap.xml listing the home page and every /details/<uuid>,
 * each with the record's revision date as lastmod.
 * Standalone: npx vite-node src/seo/sitemap.ts — see README.md
 */

import { writeFile, mkdir } from "fs/promises";
import path from "path";
import type { OGCCollection } from "./fetchCollections";
import { isSeoCli, runCli, seoDistDir } from "./cli";
import {
  BASE_URL,
  detailsUrl,
  escapeEntities,
  isSafeCollectionId,
} from "./constants";

export const generateSitemap = async (
  outDir: string,
  collections: OGCCollection[]
) => {
  const entries = collections
    .filter((collection) => isSafeCollectionId(collection.id))
    .map((collection) => ({
      id: collection.id,
      lastmod: toLastmod(collection.getRevision()),
    }));
  if (entries.length === 0) {
    throw new Error(
      "No collections returned from the OGC API; refusing to write an empty sitemap."
    );
  }
  // sitemaps.org caps a single file at 50,000 URLs
  if (entries.length >= 50000) {
    throw new Error(
      `${entries.length} URLs exceed the 50,000-per-sitemap limit; split into a sitemap index.`
    );
  }

  await mkdir(outDir, { recursive: true });
  const outFile = path.join(outDir, "sitemap.xml");
  await writeFile(outFile, toSitemapXml(entries));
  console.log(`Wrote ${entries.length + 1} URLs to ${outFile}`);
};

export interface SitemapEntry {
  id: string;
  lastmod?: string;
}

// Date only: the metadata timestamps carry no timezone
const toLastmod = (revision?: string) =>
  revision?.match(/^\d{4}-\d{2}-\d{2}/)?.[0];

export const toSitemapXml = (
  entries: SitemapEntry[],
  generatedAt = new Date()
) => {
  // lastmod lets Google re-crawl changed records first; the home page has none
  const urls = [
    `  <url><loc>${escapeEntities(`${BASE_URL}/`)}</loc></url>`,
    ...entries.map(
      ({ id, lastmod }) =>
        `  <url><loc>${escapeEntities(detailsUrl(id))}</loc>${lastmod ? `<lastmod>${lastmod}</lastmod>` : ""}</url>`
    ),
  ];
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    // Crawlers ignore comments; this tells a human how stale the live file is
    `<!-- generated ${generatedAt.toISOString()} by the Publish SEO Artifacts workflow -->`,
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls,
    "</urlset>",
    "",
  ].join("\n");
};

if (isSeoCli("sitemap.ts")) {
  runCli(
    import("./fetchCollections")
      .then(({ fetchCollections }) => fetchCollections("id,revision"))
      .then((collections) => generateSitemap(seoDistDir(), collections))
  );
}
