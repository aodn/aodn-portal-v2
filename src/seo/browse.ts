/**
 * Builds dist/browse/<theme> — one static directory page per theme, so
 * crawlers can reach every record by following links, not only the sitemap.
 * Standalone: npx vite-node src/seo/browse.ts
 */

import { writeFile, mkdir } from "fs/promises";
import path from "path";
import type { OGCCollection } from "./fetchCollections";
import { hasSeoFields } from "./prerender";
import { isSeoCli, runCli, seoDistDir } from "./cli";
import { BASE_URL, detailsUrl, escapeEntities, SITE_NAME } from "./constants";

// Records without a theme concept still need a page linking to them
const OTHER_THEME = "Other datasets";

// "Oceans | Ocean Temperature" → "oceans-ocean-temperature"
export const toBrowseSlug = (theme: string) =>
  theme
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export const browseUrl = (slug: string) => `${BASE_URL}/browse/${slug}`;

// The "theme"-scheme concepts are the parameter-style vocabulary searchers
// use; the other schemes (place, Categories) are too geographic or too coarse
const themeNames = (collection: OGCCollection) => {
  const names = (collection.getThemes() ?? [])
    .filter((theme) => theme.scheme === "theme")
    .flatMap((theme) => theme.concepts?.map((concept) => concept.id) ?? [])
    .filter(Boolean);
  return names.length ? names : [OTHER_THEME];
};

// Below this, a theme reads as thin content and folds into "Other datasets"
const MIN_RECORDS_PER_PAGE = 3;

export const groupByTheme = (
  collections: OGCCollection[],
  minRecords = MIN_RECORDS_PER_PAGE
) => {
  const groups = new Map<string, { name: string; records: OGCCollection[] }>();
  // Only records that get a detail page; a browse link must never 404
  for (const collection of collections.filter(hasSeoFields)) {
    for (const name of new Set(themeNames(collection))) {
      const slug = toBrowseSlug(name);
      if (!slug) continue;
      const group = groups.get(slug) ?? { name, records: [] };
      group.records.push(collection);
      groups.set(slug, group);
    }
  }

  // Fold thin themes away, keeping every record on at least one page
  const otherSlug = toBrowseSlug(OTHER_THEME);
  const kept = new Map(
    [...groups].filter(
      ([slug, group]) =>
        slug === otherSlug || group.records.length >= minRecords
    )
  );
  const covered = new Set(
    [...kept.values()].flatMap((group) =>
      group.records.map((record) => record.id)
    )
  );
  for (const [slug, group] of groups) {
    if (kept.has(slug)) continue;
    for (const record of group.records) {
      if (covered.has(record.id)) continue;
      covered.add(record.id);
      const other = kept.get(otherSlug) ?? { name: OTHER_THEME, records: [] };
      other.records.push(record);
      kept.set(otherSlug, other);
    }
  }
  return kept;
};

export const renderBrowsePage = (name: string, records: OGCCollection[]) => {
  const title = escapeEntities(name);
  return [
    "<!doctype html>",
    '<html lang="en">',
    "<head>",
    '<meta charset="utf-8" />',
    '<meta name="viewport" content="width=device-width, initial-scale=1" />',
    `<title>${title} | ${SITE_NAME}</title>`,
    `<link rel="canonical" href="${browseUrl(toBrowseSlug(name))}" />`,
    `<meta name="description" content="${records.length} ${title} datasets from the Australian Ocean Data Network." />`,
    "</head>",
    "<body>",
    `<p><a href="${BASE_URL}/">${SITE_NAME}</a></p>`,
    `<h1>${title}</h1>`,
    "<ul>",
    ...records.map(
      (record) =>
        `<li><a href="${detailsUrl(record.id)}">${escapeEntities(record.title ?? "")}</a></li>`
    ),
    "</ul>",
    "</body>",
    "</html>",
    "",
  ].join("\n");
};

export const generateBrowsePages = async (
  outDir: string,
  collections: OGCCollection[]
): Promise<string[]> => {
  const groups = groupByTheme(collections);
  if (groups.size === 0) {
    throw new Error(
      "No browse pages to write; refusing an empty browse folder."
    );
  }

  const browseDir = path.join(outDir, "browse");
  await mkdir(browseDir, { recursive: true });
  for (const [slug, group] of groups) {
    group.records.sort((a, b) => (a.title ?? "").localeCompare(b.title ?? ""));
    await writeFile(
      path.join(browseDir, slug),
      renderBrowsePage(group.name, group.records)
    );
  }
  console.log(`Wrote ${groups.size} browse pages to ${browseDir}`);
  return [...groups.keys()].sort().map(browseUrl);
};

if (isSeoCli("browse.ts")) {
  runCli(
    import("./fetchCollections")
      .then(({ fetchCollections }) => fetchCollections())
      .then((collections) => generateBrowsePages(seoDistDir(), collections))
  );
}
