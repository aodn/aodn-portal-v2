# Detail Page

## Folder structure

```
detail-page/
├── DetailsPage.tsx        Page entry — composes layout regions inside the provider.
├── context/               React context shared by all features on this page.
├── layout/                Layout regions (Header/Content/Side sections, NavigatablePanel,
│                          SideCardContainer). These decide WHERE features render, not WHAT.
├── features/              Page-specific features. Single-file features sit flat;
│                          multi-file features (e.g. download/) get their own folder.
└── __tests__/             All tests for the page, colocated at the top level.
```

## Naming conventions

- **`XXXPanel`** — top-level content tab (e.g. AbstractPanel, AdditionalInfoPanel). Lives in `features/`.
- **`XXXCard`** — side-bar card (e.g. OverviewCard, DownloadCard). Lives in `features/`.
- **`XXXList`** — second-level grouping inside a panel (e.g. KeywordsList, ContactsList). Lives in `src/components/list/`.

A list may show a single item (e.g. metadata identifier) — the `*List` suffix is a structural convention, not a literal "list of N items".

```
panel → contains one or more lists
list  → contains one or more items
```

## Adding a new feature

1. Single-file feature → add `features/MyFeatureCard.tsx` (or `MyFeaturePanel.tsx`).
2. Multi-file feature → add `features/my-feature/MyFeatureCard.tsx` plus any sub-components, hooks, constants alongside it.
3. Wire it up in the appropriate layout region (`layout/SideSection.tsx` for cards, `layout/ContentSection.tsx` for panels).
4. Tests go in `__tests__/`.
