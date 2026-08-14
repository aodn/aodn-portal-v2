# Tech debt

Found during the 2026-07 restructure. Two things worth fixing, one PR:

| #   | Problem                                                              | Fix                                                                        |
| --- | -------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| 1   | 11 circular import cycles                                            | Move shared types/constants into a third file so imports go one way        |
| 2   | `searchReducer.ts` is 860 lines, mixes axios client + thunks + state | Extract HTTP code into `src/services/api/`, keep only state in the reducer |

## 1. The 11 cycles

Found with `npx madge --circular --extensions ts,tsx src`:

- `componentParamReducer` ⇄ `searchReducer`
- `bookmarkListReducer` ⇄ `store.ts`
- `searchReducer` ⇄ `analytics/searchParamsEvent`
- `searchReducer` ⇄ `components/common/cqlFilters`
- `Filters` ⇄ each of the 4 `tab-filters/*` (4 cycles)
- `ResultCards` ⇄ `GridResultCard` / `ListResultCard` (2 cycles)
- `ResultListLayoutButton` ⇄ `IconSelect` ⇄ `ResultPanelSimpleFilter`

While fixing, also repair the lint gate in the same PR so cycles cannot
come back:

1. Upgrade `eslint-plugin-import` to ^2.32.0
   (2.29 is silently broken with ESLint 9 — it reports nothing)
2. Add to eslint settings:
   `"import/parsers": { "@typescript-eslint/parser": [".ts", ".tsx"] }`
3. After all cycles are fixed, turn on `"import/no-cycle": "error"`

⚠️ Regenerate `yarn.lock` with yarn 4 (`corepack yarn install`), not the
system yarn 1 — yarn 1 rewrites the whole lockfile.

## ESLint rules to enable (found 2026-08)

Type info (`projectService`) is already configured in `eslint.config.cjs`,
so enabling these type-aware rules costs nothing extra.

- [ ] `@typescript-eslint/no-floating-promises` — 89 unhandled promises,
      failures are silently swallowed. Enable as `warn` and cap with
      `--max-warnings` like the `no-explicit-any` backlog, or fix first.
- [ ] `@typescript-eslint/no-misused-promises` — 16 async callbacks passed
      where a sync function is expected.
- [ ] `@typescript-eslint/await-thenable` — 1 violation; fix it and enable
      as `error` directly.
- [ ] `eqeqeq` — 27 spots, mostly autofixable with `--fix`.

## Remaining `any` warnings

- [ ] Remove the last 2 `any` in `src/components/map/mapbox/controls/menu/Definition.tsx`
      (`ControlProps<T = any>` and `BookmarkEvent.value`). Both are relied on
      by consumers (MapPanel, MapSection, SearchPage, BookmarkListAccordionGroup),
      so this needs an event-typing refactor: explicit `ControlProps<T>` type
      arguments per consumer, and `BookmarkEvent` as a discriminated union on
      `action` with narrowing at the call sites. Lower `--max-warnings` in
      package.json to 0 once done.

## Maybe later (fine to ignore)

- Store imports from UI/pages (icons, button enums, page types) — could
  move shared types to `src/types/` bit by bit while breaking cycles
- `app/layout/constant.ts` mixes global/page/layout/search constants
- Old `.tsx` icons in `src/assets/` (913-line files); icons in
  `components/icon/` hardcode colors instead of `currentColor`
- `canned.tsx` test fixture is 15,700 lines
- `ErrorBoundary` / `HealthChecker` live in `utils/` (decided to keep)
- `public/` vs `src/assets/` may hold duplicate images
- Naming convention (kebab-case folders, PascalCase components — see
  `src/README.md`) is not machine-enforced; `eslint-plugin-check-file`
  could do it (new dev dependency, install with yarn 4)
