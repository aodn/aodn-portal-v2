# SEO

Makes the portal visible to search engines. The app is a JavaScript-only SPA —
a crawler fetching a page gets an empty shell — so this folder adds what
crawlers need, delivered two ways:

- **With the app bundle** (wired in `vite.config.ts`): head tags, robots.txt
  and a live canonical link — `headTags.ts`, `vitePlugins.ts`, `canonicalUrl.ts`
- **Weekly to S3** (the [Publish SEO Artifacts workflow](../../.github/workflows/seo.yml)):
  `sitemap.xml` plus ~15k pre-rendered detail pages under
  `prerender/details/<uuid>/index.html` —
  `fetchCollections.ts` feeds `sitemap.ts` and `prerender.ts` (which embeds
  `jsonLd.ts`); `fetchCollections.ts` is the only module importing app-store code

A CloudFront function (in the appdeploy repo) rewrites crawler requests for
`/details/<uuid>` to the pre-rendered pages; real users always get the latest
SPA shell. The `prerender/` folder never appears in a public URL, sitemap or
canonical, and robots.txt disallows crawling it directly.

## Commands

| command                      | does                                                   |
| ---------------------------- | ------------------------------------------------------ |
| `yarn seo:artifacts`         | build sitemap + pre-rendered pages into `dist/`        |
| `yarn seo:verify [site-url]` | validate `dist/`, or the live site after a publish     |
| `yarn seo:gsc <sub-command>` | `submit` / `status` / `inspect`: Google Search Console |
