/**
 * Pre-renders dist/details/<uuid> pages (extensionless, matching the request
 * path as S3 object key) from dist/index.html, with per-record <title>,
 * meta description, canonical and schema.org Dataset JSON-LD in the <head>,
 * so crawlers get record metadata without running JS. The body still boots
 * the SPA as usual.
 *
 * Runs via prerenderDetailsPlugin in vite.config.ts, or standalone (needs a
 * prior build): npx tsx src/utils/seo/PrerenderUtils.ts
 */

import { readFile, writeFile, mkdir } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { BASE_URL } from "./constants";
import { fetchAllCollections, OgcCollection } from "./SitemapUtils";

// Keep in sync with useDocumentTitle.ts
const SITE_NAME = "AODN Portal";

// Fields the bulk collections endpoint can return; license/citation/contacts
// are only available per-record and are optional in Dataset JSON-LD, so they
// are left out to avoid thousands of extra requests.
const SEO_PROPERTIES = "id,title,description,bbox,temporal,themes,providers";

// The id becomes a file name / S3 object key; skip anything unexpected
const SAFE_ID = /^[A-Za-z0-9._-]+$/;

// A collection with everything a detail page needs pre-rendered
type SeoCollection = OgcCollection & {
  id: string;
  title: string;
  description: string;
};

const hasSeoFields = (collection: OgcCollection): collection is SeoCollection =>
  Boolean(
    collection.id &&
    SAFE_ID.test(collection.id) &&
    collection.title &&
    collection.description
  );

const escapeHtml = (value: string) =>
  value.replace(/[<>&'"]/g, (c) => `&#${c.charCodeAt(0)};`);

// schema.org GeoShape box is "south west north east"; OGC bbox is [west, south, east, north]
const toSpatialCoverage = (collection: SeoCollection) => {
  const bbox = collection.extent?.spatial?.bbox?.[0];
  if (!bbox || bbox.length !== 4) return undefined;
  const [west, south, east, north] = bbox;
  return {
    "@type": "Place",
    geo: { "@type": "GeoShape", box: `${south} ${west} ${north} ${east}` },
  };
};

// ISO interval "start/end"; ".." for an open end
const toTemporalCoverage = (collection: SeoCollection) => {
  const interval = collection.extent?.temporal?.interval?.[0];
  if (!interval || (!interval[0] && !interval[1])) return undefined;
  return `${interval[0] ?? ".."}/${interval[1] ?? ".."}`;
};

const toKeywords = (collection: SeoCollection) => {
  const keywords = (collection.properties?.themes ?? [])
    .flatMap((theme) => theme.concepts?.map((concept) => concept.id) ?? [])
    .filter(Boolean);
  return keywords.length ? keywords : undefined;
};

const toCreators = (collection: SeoCollection) => {
  const names = (collection.providers ?? [])
    .map((provider) => provider.name)
    .filter(Boolean);
  const unique = [...new Set(names)];
  return unique.length
    ? unique.map((name) => ({ "@type": "Organization", name }))
    : undefined;
};

export const buildJsonLd = (collection: SeoCollection) => ({
  "@context": "https://schema.org",
  "@type": "Dataset",
  name: collection.title,
  // Google recommends descriptions under 5000 characters
  description: collection.description.slice(0, 5000),
  url: `${BASE_URL}/details/${collection.id}`,
  identifier: collection.id,
  keywords: toKeywords(collection),
  creator: toCreators(collection),
  spatialCoverage: toSpatialCoverage(collection),
  temporalCoverage: toTemporalCoverage(collection),
});

export const renderPage = (template: string, collection: SeoCollection) => {
  const headTags = [
    `<link rel="canonical" href="${BASE_URL}/details/${collection.id}" />`,
    `<meta name="description" content="${escapeHtml(collection.description.slice(0, 160))}" />`,
    // \u003c-escape keeps a "</script>" inside the JSON from closing the tag early;
    // JSON.stringify drops undefined-valued fields
    `<script type="application/ld+json">${JSON.stringify(buildJsonLd(collection)).replace(/</g, "\\u003c")}</script>`,
  ].join("\n    ");
  return (
    template
      .replace(
        /<title>.*?<\/title>/s,
        `<title>${escapeHtml(collection.title)} | ${SITE_NAME}</title>`
      )
      // The template carries the site-wide description; the record's replaces it
      .replace(/\s*<meta name="description"[^>]*\/?>/, "")
      .replace("</head>", `${headTags}\n  </head>`)
  );
};

export const prerenderDetailPages = async (outDir: string) => {
  const template = await readFile(path.join(outDir, "index.html"), "utf8");
  const collections = await fetchAllCollections(SEO_PROPERTIES);

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

// Standalone entry point; no-op when imported by vite.config.ts
const isRunDirectly =
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isRunDirectly) {
  const outDir = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    "../../../dist"
  );
  prerenderDetailPages(outDir).catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
