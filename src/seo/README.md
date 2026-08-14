# SEO

Makes the portal visible to search engines. The app is a JavaScript-only SPA —
a crawler fetching a page gets an empty shell — so this folder adds what
crawlers need, delivered two ways:

- **With the app bundle** (wired in `vite.config.ts`): head tags, robots.txt
  and a live canonical link — `headTags.ts`, `vitePlugins.ts`, `canonicalUrl.ts`
- **Weekly to S3** (the [Publish SEO Artifacts workflow](../../.github/workflows/seo.yml)):
  `sitemap.xml` plus ~15k pre-rendered `/details/<uuid>` pages —
  `fetchCollections.ts` feeds `sitemap.ts` and `prerender.ts` (which embeds
  `jsonLd.ts`); `fetchCollections.ts` is the only module importing app-store code

## Commands

| command                      | does                                                   |
| ---------------------------- | ------------------------------------------------------ |
| `yarn seo:artifacts`         | build sitemap + pre-rendered pages into `dist/`        |
| `yarn seo:verify [site-url]` | validate `dist/`, or the live site after a publish     |
| `yarn seo:gsc <sub-command>` | `submit` / `status` / `inspect`: Google Search Console |
