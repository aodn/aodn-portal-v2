# SEO

Makes the portal visible to search engines. The app is a JavaScript-only SPA —
a crawler fetching a page gets an empty shell — so this folder adds what
crawlers need, delivered two ways:

- **In the app build** (wired in `vite.config.ts`): `vitePlugins.ts` bakes the
  site-wide head tags from `headTags.ts` into `index.html` and picks the
  per-environment `robots.txt`. At runtime `canonicalUrl.ts` keeps the
  canonical link in step with the route, `useDocumentTitle.ts` sets the
  per-page title, and `useRobotsNoIndex.ts` adds `noindex` to pages that must
  stay out of the index.
- **Weekly to S3** (the [Publish SEO Artifacts workflow](../../.github/workflows/seo.yml)):
  `fetchCollections.ts` pulls every record — the only module here that imports
  app-store code — and feeds two builders. `sitemap.ts` writes `sitemap.xml`.
  `prerender.ts` writes ~15k pages at `prerender/details/<uuid>/index.html`,
  each carrying `jsonLd.ts` structured data and a static body of title,
  abstract, a breadcrumb link home and `relatedRecords.ts` links — crawlers
  discover pages only through `<a href>`.

The pre-rendered pages ship **without the app bundle**. Google indexes a page
after running its JavaScript, so if the bundle is left in, React mounts, empties
`#root` and throws the static body away — every record then looks like the same
unresolved shell, which Search Console reports as "Duplicate, Google chose a
different canonical than user". `seo:verify` fails if the bundle comes back.

A CloudFront function (in `artifacts/`) rewrites crawler requests for
`/details/<uuid>` to the pre-rendered pages; real users always get the latest
SPA shell. The `prerender/` folder never appears in a public URL, sitemap or
canonical, and robots.txt disallows crawling it directly.

## Commands

| command                      | does                                                   |
| ---------------------------- | ------------------------------------------------------ |
| `yarn seo:artifacts`         | build sitemap + pre-rendered pages into `dist/`        |
| `yarn seo:verify [site-url]` | validate `dist/`, or the live site after a publish     |
| `yarn seo:gsc <sub-command>` | `submit` / `status` / `inspect`: Google Search Console |
