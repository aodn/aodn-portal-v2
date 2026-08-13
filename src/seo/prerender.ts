/**
 * Pre-renders a static dist/details/<uuid> page per record, with real title,
 * description, canonical and Dataset JSON-LD in the head — see README.md.
 * Standalone (needs a prior build): npx vite-node src/seo/prerender.ts
 */

import { readFile, writeFile, mkdir } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { configureStore } from "@reduxjs/toolkit";
import { OGCCollection } from "@/app/store/OGCCollectionDefinitions";
import {
  createSearchParamFrom,
  fetchResultNoStore,
  jsonToOGCCollections,
  ogcAxiosWithRetry,
} from "@/app/store/searchReducer";
import { BASE_URL, OGC_API_BASE, SHARE_IMAGE_URL } from "./constants";

// Keep in sync with useDocumentTitle.ts
const SITE_NAME = "AODN Portal";

// Fields the bulk collections endpoint can return; license/citation/contacts
// are only available per-record and are optional in Dataset JSON-LD, so they
// are left out to avoid thousands of extra requests.
export const SEO_PROPERTIES =
  "id,title,description,bbox,temporal,themes,providers";

// fetchResultNoStore returns one page; walk search_after until we have them all
const API_URL = `${OGC_API_BASE}/api/v1/ogc/collections`;
const PAGE_SIZE = 1000;

// Axios defaults to "axios/x.y.z", which WAF bot rules flag; present a
// browser-like UA so CI traffic is not challenged
const USER_AGENT =
  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36";

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

export const fetchCollections = async (
  properties = SEO_PROPERTIES
): Promise<OGCCollection[]> => {
  const collections: OGCCollection[] = [];
  let searchAfter: string[] | undefined;
  let total: number | undefined;

  console.log(`Fetching ${properties} from ${API_URL}`);

  // Point the shared app client at the absolute OGC host; restore afterwards
  // so importing this module in tests does not leak Node-only defaults
  const originalBaseURL = ogcAxiosWithRetry.defaults.baseURL;
  const originalUA = ogcAxiosWithRetry.defaults.headers.common["User-Agent"];
  ogcAxiosWithRetry.defaults.baseURL = `${OGC_API_BASE}/api/v1`;
  ogcAxiosWithRetry.defaults.headers.common["User-Agent"] = USER_AGENT;

  const store = configureStore({ reducer: (state = {}) => state });

  try {
    for (;;) {
      const params = createSearchParamFrom(
        {},
        {
          pagesize: PAGE_SIZE,
          ...(searchAfter ? { searchafter: searchAfter } : {}),
        }
      );
      params.properties = properties;

      let payload: string;
      try {
        payload = await store.dispatch(fetchResultNoStore(params)).unwrap();
      } catch (error) {
        throw new Error(
          `Failed to fetch collections from ${API_URL} — ${describeFetchError(error)}`
        );
      }

      const pageResult = jsonToOGCCollections(payload);
      total = pageResult.total;
      const page = pageResult.collections;
      if (page.length === 0) break;
      collections.push(...page);
      console.log(`Fetched ${collections.length}/${total} collections`);

      if (
        pageResult.search_after.length === 0 ||
        collections.length >= (total ?? 0)
      ) {
        break;
      }
      searchAfter = pageResult.search_after;
    }
  } finally {
    ogcAxiosWithRetry.defaults.baseURL = originalBaseURL;
    if (originalUA === undefined) {
      delete ogcAxiosWithRetry.defaults.headers.common["User-Agent"];
    } else {
      ogcAxiosWithRetry.defaults.headers.common["User-Agent"] = originalUA;
    }
  }

  if (collections.length !== total) {
    console.warn(`Expected ${total} collections but got ${collections.length}`);
  }
  return collections;
};

// The id becomes a file name / S3 object key; skip anything unexpected
const SAFE_ID = /^[A-Za-z0-9._-]+$/;

const hasSeoFields = (collection: OGCCollection) =>
  Boolean(
    collection.id &&
    collection.id !== "undefined" &&
    SAFE_ID.test(collection.id) &&
    collection.title &&
    collection.description
  );

const escapeHtml = (value: string) =>
  value.replace(/[<>&'"]/g, (c) => `&#${c.charCodeAt(0)};`);

// schema.org GeoShape box is "south west north east"; OGC bbox is [west, south, east, north]
const toSpatialCoverage = (collection: OGCCollection) => {
  const bbox = collection.getBBox()?.[0];
  if (!bbox || bbox.length !== 4) return undefined;
  const [west, south, east, north] = bbox;
  return {
    "@type": "Place",
    geo: { "@type": "GeoShape", box: `${south} ${west} ${north} ${east}` },
  };
};

// ISO interval "start/end"; ".." for an open end
const toTemporalCoverage = (collection: OGCCollection) => {
  const interval = collection.extent?.temporal?.interval?.[0];
  if (!interval || (!interval[0] && !interval[1])) return undefined;
  return `${interval[0] ?? ".."}/${interval[1] ?? ".."}`;
};

const toKeywords = (collection: OGCCollection) => {
  const keywords = (collection.getThemes() ?? [])
    .flatMap((theme) => theme.concepts?.map((concept) => concept.id) ?? [])
    .filter(Boolean);
  return keywords.length ? keywords : undefined;
};

// providers is on the API payload but not modelled on OGCCollection
const toCreators = (collection: OGCCollection) => {
  const names = (
    (collection as OGCCollection & { providers?: { name?: string }[] })
      .providers ?? []
  )
    .map((provider) => provider.name)
    .filter(Boolean);
  const unique = [...new Set(names)];
  return unique.length
    ? unique.map((name) => ({ "@type": "Organization", name }))
    : undefined;
};

export const buildJsonLd = (collection: OGCCollection) => ({
  "@context": "https://schema.org",
  "@type": "Dataset",
  name: collection.title,
  // Google recommends descriptions under 5000 characters
  description: collection.description?.slice(0, 5000),
  url: `${BASE_URL}/details/${collection.id}`,
  identifier: collection.id,
  keywords: toKeywords(collection),
  creator: toCreators(collection),
  spatialCoverage: toSpatialCoverage(collection),
  temporalCoverage: toTemporalCoverage(collection),
});

export const renderPage = (template: string, collection: OGCCollection) => {
  const description = escapeHtml((collection.description ?? "").slice(0, 160));
  const pageUrl = `${BASE_URL}/details/${collection.id}`;
  const headTags = [
    `<link rel="canonical" href="${pageUrl}" />`,
    `<meta name="description" content="${description}" />`,
    '<meta property="og:type" content="website" />',
    `<meta property="og:site_name" content="${SITE_NAME}" />`,
    `<meta property="og:title" content="${escapeHtml(collection.title ?? "")}" />`,
    `<meta property="og:description" content="${description}" />`,
    `<meta property="og:url" content="${pageUrl}" />`,
    `<meta property="og:image" content="${SHARE_IMAGE_URL}" />`,
    '<meta name="twitter:card" content="summary" />',
    // \u003c-escape keeps a "</script>" inside the JSON from closing the tag early;
    // JSON.stringify drops undefined-valued fields
    `<script type="application/ld+json">${JSON.stringify(buildJsonLd(collection)).replace(/</g, "\\u003c")}</script>`,
  ].join("\n    ");
  return (
    template
      .replace(
        /<title>.*?<\/title>/s,
        `<title>${escapeHtml(collection.title ?? "")} | ${SITE_NAME}</title>`
      )
      // The template carries site-wide description and social tags; the record's replace them
      .replace(/\s*<meta name="description"[^>]*\/?>/, "")
      .replace(/\s*<meta (?:property="og:|name="twitter:)[^>]*\/?>/g, "")
      .replace("</head>", `${headTags}\n  </head>`)
  );
};

export const prerenderDetailPages = async (
  outDir: string,
  prefetched?: OGCCollection[]
) => {
  const template = await readFile(path.join(outDir, "index.html"), "utf8");
  const collections = prefetched ?? (await fetchCollections());

  const detailsDir = path.join(outDir, "details");
  await mkdir(detailsDir, { recursive: true });

  let written = 0;
  let skipped = 0;
  for (const collection of collections) {
    if (!hasSeoFields(collection)) {
      skipped++;
      continue;
    }
    await writeFile(
      path.join(detailsDir, collection.id),
      renderPage(template, collection)
    );
    written++;
  }

  if (written === 0) {
    throw new Error(
      "No detail pages pre-rendered; refusing to ship an empty details folder."
    );
  }
  console.log(
    `Pre-rendered ${written} detail pages to ${detailsDir}` +
      (skipped
        ? ` (skipped ${skipped} without valid id/title/description)`
        : "")
  );
};

const isRunDirectly = process.argv.some((arg) =>
  arg.replace(/\\/g, "/").endsWith("/src/seo/prerender.ts")
);

if (isRunDirectly) {
  const outDir = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    "../../dist"
  );
  prerenderDetailPages(outDir).catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
