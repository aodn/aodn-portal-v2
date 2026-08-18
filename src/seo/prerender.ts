/**
 * Pre-renders a static dist/details/<uuid> page per record, with real title,
 * description, canonical and Dataset JSON-LD in the head — see README.md.
 * Standalone (needs a prior build): npx vite-node src/seo/prerender.ts
 */

import { readFile, writeFile, mkdir } from "fs/promises";
import path from "path";
import type { OGCCollection } from "./fetchCollections";
import { fetchCollections } from "./fetchCollections";
import { buildJsonLd } from "./jsonLd";
import { isSeoCli, runCli, seoDistDir } from "./cli";
import {
  detailsUrl,
  escapeEntities,
  isSafeCollectionId,
  SHARE_IMAGE_URL,
  SITE_NAME,
} from "./constants";

// Renders what crawlers read for one record — in Google terms: the title link,
// snippet, canonical and Dataset structured data, plus Open Graph / Twitter
// social preview tags. The body stays empty; Google's crawler renders it with JS.
export const renderCrawlerPage = (
  template: string,
  collection: OGCCollection
) => {
  const title = escapeEntities(collection.title ?? "");
  const description = escapeEntities(
    (collection.description ?? "").slice(0, 160)
  );
  const pageUrl = detailsUrl(collection.id);
  const headTags = [
    `<link rel="canonical" href="${pageUrl}" />`,
    `<meta name="description" content="${description}" />`,
    '<meta property="og:type" content="website" />',
    `<meta property="og:site_name" content="${SITE_NAME}" />`,
    `<meta property="og:title" content="${title}" />`,
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
      .replace(/<title>.*?<\/title>/s, `<title>${title} | ${SITE_NAME}</title>`)
      // The template carries site-wide description and social tags; the record's replace them
      .replace(/\s*<meta name="description"[^>]*\/?>/, "")
      .replace(/\s*<meta (?:property="og:|name="twitter:)[^>]*\/?>/g, "")
      .replace("</head>", `${headTags}\n  </head>`)
  );
};

export const hasSeoFields = (collection: OGCCollection) =>
  isSafeCollectionId(collection.id) &&
  Boolean(collection.title && collection.description);

export const prerenderDetailPages = async (
  outDir: string,
  prefetched?: OGCCollection[]
) => {
  const template = await readFile(path.join(outDir, "index.html"), "utf8");
  const collections = prefetched ?? (await fetchCollections());

  const detailsDir = path.join(outDir, "details");
  await mkdir(detailsDir, { recursive: true });

  const pages = collections.filter(hasSeoFields);
  const skipped = collections.length - pages.length;
  // Bound concurrency so ~15k writes do not hit EMFILE
  const WRITE_CONCURRENCY = 64;
  for (let i = 0; i < pages.length; i += WRITE_CONCURRENCY) {
    await Promise.all(
      pages
        .slice(i, i + WRITE_CONCURRENCY)
        .map((collection) =>
          writeFile(
            path.join(detailsDir, collection.id),
            renderCrawlerPage(template, collection)
          )
        )
    );
  }

  if (pages.length === 0) {
    throw new Error(
      "No detail pages pre-rendered; refusing to ship an empty details folder."
    );
  }
  console.log(
    `Pre-rendered ${pages.length} detail pages to ${detailsDir}` +
      (skipped
        ? ` (skipped ${skipped} without valid id/title/description)`
        : "")
  );
};

if (isSeoCli("prerender.ts")) {
  runCli(prerenderDetailPages(seoDistDir()));
}
