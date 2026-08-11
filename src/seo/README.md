# SEO

Makes the portal visible to search engines. The app is a JavaScript-only SPA —
a crawler fetching a page gets an empty shell — so this folder adds what
crawlers need: head tags, robots.txt, a sitemap, and pre-rendered detail pages.

## Files

Ships with the app bundle (wired up in `vite.config.ts`):

- `headTags.ts` — static head tags: site description, `noindex` on non-prod
- `vitePlugins.ts` — injects the head tags, picks the right robots.txt
- `canonicalUrl.ts` — updates the canonical link as the user navigates
- `constants.ts` — `BASE_URL` (public site) and `OGC_API_BASE` (record source)

Published to S3 by the [Publish SEO Artifacts workflow](../../.github/workflows/seo.yml),
every Monday morning or manually:

- `SitemapUtils.ts` — builds `sitemap.xml` listing all ~15k `/details/<uuid>` pages
- `PrerenderUtils.ts` — one static page per record with real title, description
  and Dataset JSON-LD (extensionless files: S3 key = request path)
- `buildSeoArtifacts.ts` — `yarn seo:artifacts`, runs both from one records fetch

Checks:

- `verifySeoArtifacts.ts` — `yarn seo:verify [site-url]`, validates `dist/` or a deployed site
- `SearchConsoleUtils.ts` — `yarn seo:gsc`, submits the sitemap and reads index
  status from Google (setup below)

## Process

1. Deploy the app — head tags and robots.txt ship with the bundle.
2. The workflow publishes sitemap + pre-rendered pages (Mondays, or run it manually).
3. `yarn seo:gsc submit` — once per property, tells Google where the sitemap is.
4. Wait: indexing ~15k pages takes weeks.

## Verify

Before publishing, locally: `yarn test`, then build + `yarn seo:artifacts` +
`yarn seo:verify` — validates `dist/` without touching S3.

The workflow runs the same checks as steps: `seo:verify` before uploading and
`seo:verify <site>` after the CloudFront invalidation. On production it then
submits the sitemap and reports index coverage in the run log (via the
`GSC_SERVICE_ACCOUNT_KEY` environment secret).

After publishing, against the live site:

- `yarn seo:verify https://portal-edge.aodn.org.au` — head tags, robots.txt,
  sitemap and sampled detail pages as actually served
- `yarn seo:gsc status` / `yarn seo:gsc inspect 50` — has Google fetched the
  sitemap; how many sampled URLs are actually indexed
- [Rich Results Test](https://search.google.com/test/rich-results) on one
  details URL — Dataset markup is recognised

## Search Console setup (one-time)

1. The `https://portal-beta.aodn.org.au/` URL-prefix property is already
   verified (automatically, via Google Analytics).
2. In Google Cloud: create a service account, enable the Search Console API,
   download its JSON key.
3. In [Search Console](https://search.google.com/search-console):
   Settings → Users and permissions → add the service account's email as a
   Full user.
4. Set `GSC_SERVICE_ACCOUNT_KEY` to the key file path or its JSON (CI: a secret).

## Glossary

- **crawler / Googlebot** — the program a search engine sends to fetch pages
- **indexed** — the page is in Google's database and can appear in search
  results; crawled does not imply indexed
- **sitemap.xml** — machine-readable list of every URL we want indexed
- **robots.txt** — tells crawlers what they may fetch
- **noindex** — meta tag keeping a page out of search results; set on non-prod
  so test sites never compete with prod
- **canonical** — link tag naming the one official URL for a page, so
  duplicates (edge/beta) all credit prod
- **pre-render** — writing static HTML at build time so crawlers see real
  content without running JS
- **JSON-LD (schema.org Dataset)** — structured data describing the record;
  what gets datasets into Google Dataset Search
- **Search Console** — Google's dashboard/API showing how it crawls and
  indexes the site
