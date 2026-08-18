/**
 * Builds both SEO artifacts in one pass over the records: yarn seo:artifacts
 * dist/index.html must already exist — it is the pre-render template.
 */

import { seoDistDir } from "./cli";
import { generateBrowsePages } from "./browse";
import { fetchCollections } from "./fetchCollections";
import { prerenderDetailPages } from "./prerender";
import { generateSitemap } from "./sitemap";

const outDir = seoDistDir();

// One fetchResultNoStore walk, shared by all three artifacts
const collections = await fetchCollections();
const browseUrls = await generateBrowsePages(outDir, collections);
await generateSitemap(outDir, collections, browseUrls);
await prerenderDetailPages(outDir, collections);
