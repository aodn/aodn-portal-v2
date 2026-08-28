/**
 * Pre-renders a static dist/prerender/details/<uuid>/index.html per record,
 * with real title, description, canonical and Dataset JSON-LD in the head —
 * see README.md. CloudFront rewrites crawler requests for /details/<uuid>
 * to these pages; real users always get the live SPA shell.
 * The complete expected page is pinned by the contract test in
 * __test__/prerender.test.ts ("renders the complete crawler page …").
 * Standalone (needs a prior build): npx vite-node src/seo/prerender.ts
 */

import { readFile, writeFile, mkdir } from "fs/promises";
import path from "path";
import type { OGCCollection } from "./fetchCollections";
import { fetchCollections } from "./fetchCollections";
import { buildJsonLd } from "./jsonLd";
import { buildRelatedLinks, RelatedLink } from "./relatedRecords";
import { isSeoCli, runCli, seoDistDir } from "./cli";
import {
  detailsUrl,
  escapeEntities,
  isSafeCollectionId,
  PRERENDER_DETAILS_DIR,
  SHARE_IMAGE_URL,
  SITE_NAME,
} from "./constants";

// A visible, labelled date matching the JSON-LD dates — Google's best practice
// for controlling the date shown next to search results
const renderDateLine = (collection: OGCCollection) => {
  const revision = collection.getRevision();
  const creation = collection.getCreation();
  if (revision)
    return `<p>Updated: ${escapeEntities(revision.slice(0, 10))}</p>`;
  if (creation)
    return `<p>Published: ${escapeEntities(creation.slice(0, 10))}</p>`;
  return "";
};

// Static body for crawlers: title, date, abstract and related-record links —
// crawlers only follow <a href>. The SPA replaces it on mount.
const renderBody = (collection: OGCCollection, related: RelatedLink[]) => {
  const relatedItems = related
    .map(
      (link) =>
        `<li><a href="/details/${link.id}">${escapeEntities(link.title)}</a></li>`
    )
    .join("");
  const relatedNav = relatedItems
    ? `<nav aria-label="Related records"><h2>Related records</h2><ul>${relatedItems}</ul></nav>`
    : "";
  return `<main>
    <h1>${escapeEntities(collection.title ?? "")}</h1>
    ${renderDateLine(collection)}
    <p>${escapeEntities(collection.description ?? "")}</p>
    ${relatedNav}
  </main>`;
};

// Renders what crawlers read for one record — in Google terms: the title link,
// snippet, canonical and Dataset structured data, plus Open Graph / Twitter
// social preview tags, and a static body (see renderBody).
export const renderCrawlerPage = (
  template: string,
  collection: OGCCollection,
  related: RelatedLink[] = []
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
      // New Relic is ~97% of the shell and useless on a crawler-only page
      .replace(/\s*<!-- Tracking code -.*?<\/script>/s, "")
      // Google Analytics: crawler-only pages have no visitors worth counting
      .replace(
        /\s*<script async src="https:\/\/www\.googletagmanager\.com\/gtag\/js[^"]*"><\/script>\s*<script>.*?<\/script>/s,
        ""
      )
      .replace(
        '<div id="root"></div>',
        `<div id="root">${renderBody(collection, related)}</div>`
      )
  );
};

const hasSeoFields = (collection: OGCCollection) =>
  isSafeCollectionId(collection.id) &&
  Boolean(collection.title && collection.description);

export const prerenderDetailPages = async (
  outDir: string,
  prefetched?: OGCCollection[]
) => {
  const template = await readFile(path.join(outDir, "index.html"), "utf8");
  const collections = prefetched ?? (await fetchCollections());

  const detailsDir = path.join(outDir, PRERENDER_DETAILS_DIR);
  await mkdir(detailsDir, { recursive: true });

  const pages = collections.filter(hasSeoFields);
  const skipped = collections.length - pages.length;
  // Built over pages only, so related links never point at a skipped record
  const related = buildRelatedLinks(pages);
  // Bound concurrency so ~15k writes do not hit EMFILE
  const WRITE_CONCURRENCY = 64;
  for (let i = 0; i < pages.length; i += WRITE_CONCURRENCY) {
    await Promise.all(
      pages.slice(i, i + WRITE_CONCURRENCY).map(async (collection) => {
        const pageDir = path.join(detailsDir, collection.id);
        await mkdir(pageDir, { recursive: true });
        await writeFile(
          path.join(pageDir, "index.html"),
          renderCrawlerPage(template, collection, related.get(collection.id))
        );
      })
    );
  }

  if (pages.length === 0) {
    throw new Error(
      "No detail pages pre-rendered; refusing to ship an empty prerender folder."
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
