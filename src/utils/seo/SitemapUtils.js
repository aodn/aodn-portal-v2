/**
 * Generates dist/sitemap.xml so crawlers can discover /details/<uuid> pages.
 * Runs via generateSitemapPlugin in vite.config.ts (prod build only), or
 * standalone: node src/utils/seo/SitemapUtils.js
 *
 * Keep BASE_URL in sync with canonicalUrl.ts and robots.prod.txt.
 */

import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const BASE_URL = "https://portal-beta.aodn.org.au";
const API_URL = `${BASE_URL}/api/v1/ogc/collections`;
const PAGE_SIZE = 1000;
const MAX_RETRIES = 3;

const fetchJsonWithRetry = async (url) => {
  for (let attempt = 1; ; attempt++) {
    try {
      const response = await fetch(url, {
        headers: { Accept: "application/json" },
      });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status} for ${url}`);
      }
      return await response.json();
    } catch (error) {
      if (attempt >= MAX_RETRIES) throw error;
      console.warn(`Attempt ${attempt} failed (${error.message}), retrying...`);
      await new Promise((resolve) => setTimeout(resolve, 2000 * attempt));
    }
  }
};

// Same page_size/search_after pagination the portal search uses
const fetchAllUuids = async () => {
  const uuids = [];
  let searchAfter;
  let total;

  for (;;) {
    let filter = `page_size=${PAGE_SIZE}`;
    if (searchAfter) {
      filter += ` AND search_after='${searchAfter.join("||")}'`;
    }
    const url = `${API_URL}?properties=id&filter=${encodeURIComponent(filter)}`;
    const json = await fetchJsonWithRetry(url);

    total = json.total;
    const ids = (json.collections ?? []).map((collection) => collection.id);
    if (ids.length === 0) break;
    uuids.push(...ids);
    console.log(`Fetched ${uuids.length}/${total} collections`);

    if (!json.search_after || uuids.length >= total) break;
    searchAfter = json.search_after;
  }

  if (uuids.length !== total) {
    console.warn(`Expected ${total} collections but got ${uuids.length}`);
  }
  return uuids;
};

const escapeXml = (value) =>
  value.replace(/[<>&'"]/g, (c) => `&#${c.charCodeAt(0)};`);

const toSitemapXml = (uuids) => {
  const urls = [
    `${BASE_URL}/`,
    ...uuids.map((uuid) => `${BASE_URL}/details/${uuid}`),
  ];
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls.map((url) => `  <url><loc>${escapeXml(url)}</loc></url>`),
    "</urlset>",
    "",
  ].join("\n");
};

export const generateSitemap = async (outDir) => {
  const uuids = await fetchAllUuids();
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

// Standalone entry point; no-op when imported by vite.config.ts
const isRunDirectly =
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isRunDirectly) {
  const outDir = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    "../../../dist"
  );
  generateSitemap(outDir).catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
