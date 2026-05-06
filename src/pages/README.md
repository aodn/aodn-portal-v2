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
└── __tests__/            Tests colocated with the page.
```

## Naming conventions

- **`XXXPanel`** — top-level content tab (e.g. AbstractPanel). Lives in `features/`.
- **`XXXCard`** — side-bar card (e.g. OverviewCard, DownloadCard). Lives in `features/`.
- **`XXXList`** — second-level grouping inside a panel (e.g. KeywordsList). Lives in `src/components/list/`.

```
panel → contains one or more lists
list  → contains one or more items
```

A list may show a single item — the `*List` suffix is a structural convention, not a literal "list of N items".

## Adding a new feature

1. Single-file feature → `features/MyFeatureCard.tsx` (or `MyFeaturePanel.tsx`).
2. Multi-file feature → `features/my-feature/MyFeatureCard.tsx` plus its sub-components, hooks, constants.
3. Wire it into the appropriate `layout/` region.
4. Add tests under `__tests__/`.
