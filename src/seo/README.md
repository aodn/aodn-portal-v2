# SEO

Makes the portal visible to search engines. The app is a JavaScript-only SPA —
a crawler fetching a page gets an empty shell — so this folder generates what
crawlers need.

## What gets generated

`yarn seo:artifacts` (run weekly by the
[Publish SEO Artifacts workflow](../../.github/workflows/seo.yml)) builds into `dist/`:

- `sitemap.xml` — every URL below, handed to Google
- `details/<uuid>` × ~15k — one page per record: real title, description and
  Dataset JSON-LD in the head
- `browse/<theme>` — one directory page per theme, plain links to its records,
  so crawlers can walk from page to page

`fetchCollections.ts` fetches the records once for all three, and is the only
module here that touches app-store code.

Shipped with the app bundle instead (wired in `vite.config.ts`): site-wide head
tags, robots.txt and the live canonical link — `headTags.ts`, `vitePlugins.ts`,
`canonicalUrl.ts`.

## Commands

| command                      | does                                                   |
| ---------------------------- | ------------------------------------------------------ |
| `yarn seo:artifacts`         | build the three artifacts above into `dist/`           |
| `yarn seo:verify [site-url]` | validate `dist/`, or the live site after a publish     |
| `yarn seo:gsc <sub-command>` | `submit` / `status` / `inspect`: Google Search Console |
