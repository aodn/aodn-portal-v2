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
import { BASE_URL, OGC_API_BASE } from "./constants";

// Fetch host is independent of the public URLs written into the sitemap
const API_URL = `${OGC_API_BASE}/api/v1/ogc/collections`;
const PAGE_SIZE = 1000;
const MAX_RETRIES = 3;

// Node's fetch defaults to "user-agent: node", which WAF bot rules flag;
// present a browser-like UA so CI traffic is not challenged
const USER_AGENT =
  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36";

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

// Node reports every network failure as "fetch failed" and puts the reason that
// actually identifies it — DNS, TLS, connection reset — in error.cause
export const describeFetchError = (error: unknown) => {
  if (!(error instanceof Error)) return String(error);
  // Node has carried .cause since 16.9; the ES2020 lib just does not type it
  const { cause } = error as Error & { cause?: unknown };
  return cause instanceof Error
    ? `${error.message}: ${cause.message}`
    : error.message;
};

const fetchJsonWithRetry = async (url: string): Promise<CollectionsPage> => {
  for (let attempt = 1; ; attempt++) {
    try {
      const response = await fetch(url, {
        headers: { Accept: "application/json", "User-Agent": USER_AGENT },
      });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status} for ${url}`);
      }
      const body = await response.text();
      try {
        return JSON.parse(body) as CollectionsPage;
      } catch {
        // A 2xx non-JSON body means the CDN answered with a fallback or
        // challenge page instead of the API; surface what actually came back
        throw new Error(
          `Non-JSON response (HTTP ${response.status}, content-type ${response.headers.get("content-type")}) for ${url}; body starts: ${JSON.stringify(body.slice(0, 100))}`
        );
      }
    } catch (error) {
      if (attempt >= MAX_RETRIES) {
        throw new Error(
          `Gave up after ${MAX_RETRIES} attempts on ${url} — ${describeFetchError(error)}`
        );
      }
      const retryInSeconds = (2000 * attempt) / 1000;
      console.warn(
        `Attempt ${attempt}/${MAX_RETRIES} failed (${describeFetchError(error)}), retrying in ${retryInSeconds}s`
      );
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

  console.log(`Fetching ${properties} from ${API_URL}`);

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

export const toSitemapXml = (uuids: string[], generatedAt = new Date()) => {
  const urls = [
    `${BASE_URL}/`,
    ...uuids.map((uuid) => `${BASE_URL}/details/${uuid}`),
  ];
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    // Crawlers ignore comments; this tells a human how stale the live file is
    `<!-- generated ${generatedAt.toISOString()} by the Publish SEO Artifacts workflow -->`,
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls.map((url) => `  <url><loc>${escapeXml(url)}</loc></url>`),
    "</urlset>",
    "",
  ].join("\n");
};

// Pass collections in to reuse a fetch the caller has already paid for
export const generateSitemap = async (
  outDir: string,
  collections?: OgcCollection[]
) => {
  const uuids = (collections ?? (await fetchAllCollections()))
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
