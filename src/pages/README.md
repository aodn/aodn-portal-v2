# Pages

Top-level route entries. Each page composes layout regions and features.

## Folder structure

```
pages/
├── landing-page/         Public landing page (banner, topics, news, logos).
├── search-page/          Catalogue search with map + result list.
├── detail-page/          Single-record metadata view.
└── error-page/           Error / 404 / degraded fallbacks.
```

Within a page:

```
<page>/
├── <Page>.tsx            Entry — composes layout regions.
├── layout/               WHERE things render (header, content, side, map regions).
├── features/             WHAT renders. Single-file features sit flat;
│                         multi-file features get their own folder.
├── context/              React context shared across the page (optional).
└── __test__/             Tests colocated with the page.
```
