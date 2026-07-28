/**
 * Generates dist/sitemap.xml so crawlers can discover /details/<uuid> pages.
 * Runs via generateSitemapPlugin in vite.config.ts (prod build only), or
 * standalone: npx tsx src/utils/seo/SitemapUtils.ts
 *
 * BASE_URL comes from constants.ts; keep robots.prod.txt in sync with it.
 */

import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { BASE_URL } from "./constants";

const API_URL = `${BASE_URL}/api/v1/ogc/collections`;
const PAGE_SIZE = 1000;
const MAX_RETRIES = 3;

// The subset of an OGC collection the SEO build steps read
export interface OgcCollection {
  id?: string;
  title?: string;
  description?: string;
  extent?: {
    spatial?: { bbox?: number[][] };
    temporal?: { interval?: (string | null)[][] };
  };
  properties?: { themes?: { concepts?: { id?: string }[] }[] };
  providers?: { name?: string }[];
}

interface CollectionsPage {
  total?: number;
  collections?: OgcCollection[];
  search_after?: string[];
}

const fetchJsonWithRetry = async (url: string): Promise<CollectionsPage> => {
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
      const message = error instanceof Error ? error.message : String(error);
      console.warn(`Attempt ${attempt} failed (${message}), retrying...`);
      await new Promise((resolve) => setTimeout(resolve, 2000 * attempt));
    }
  }
};

// Same page_size/search_after pagination the portal search uses
export const fetchAllCollections = async (
  properties = "id"
): Promise<OgcCollection[]> => {
  const collections: OgcCollection[] = [];
  let searchAfter: string[] | undefined;
  let total: number | undefined;

  for (;;) {
    let filter = `page_size=${PAGE_SIZE}`;
    if (searchAfter) {
      filter += ` AND search_after='${searchAfter.join("||")}'`;
    }
    const url = `${API_URL}?properties=${properties}&filter=${encodeURIComponent(filter)}`;
    const json = await fetchJsonWithRetry(url);

    total = json.total;
    const page = json.collections ?? [];
    if (page.length === 0) break;
    collections.push(...page);
    console.log(`Fetched ${collections.length}/${total} collections`);

    if (!json.search_after || collections.length >= (total ?? 0)) break;
    searchAfter = json.search_after;
  }

  if (collections.length !== total) {
    console.warn(`Expected ${total} collections but got ${collections.length}`);
  }
  return collections;
};

const escapeXml = (value: string) =>
  value.replace(/[<>&'"]/g, (c) => `&#${c.charCodeAt(0)};`);

const toSitemapXml = (uuids: string[]) => {
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

export const generateSitemap = async (outDir: string) => {
  const uuids = (await fetchAllCollections())
    .map((collection) => collection.id)
    .filter((id): id is string => Boolean(id));
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
