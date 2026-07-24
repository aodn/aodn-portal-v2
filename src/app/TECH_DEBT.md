# Tech debt — TODO

## Import cycles (one PR: fix + turn on the lint gate)

- [ ] Break the 8 component-layer cycles by moving shared
      types/constants into a third file so imports go one way:
  - `Filters` ⇄ each of the 4 `tab-filters/*` (4 cycles)
  - `ResultCards` ⇄ `GridResultCard` / `ListResultCard` (2 cycles)
  - `ResultListLayoutButton` / `ResultListSortButton` ⇄ `IconSelect` ⇄
    `ResultPanelSimpleFilter` (2 cycles)
  - Check with `npx madge --circular --extensions ts,tsx src`; ignore
    the `import type { RootState }` cycles it also reports (standard
    redux pattern, erased at build time)
- [ ] Upgrade `eslint-plugin-import` to ^2.32.0 (2.29 is silently
      broken with ESLint 9). Regenerate `yarn.lock` with yarn 4
      (`corepack yarn install`), never the system yarn 1
- [ ] Add to eslint settings:
      `"import/parsers": { "@typescript-eslint/parser": [".ts", ".tsx"] }`
- [ ] After the cycles are fixed, turn on `"import/no-cycle": "error"`

## Finish the server-state cleanup

- [ ] Migrate `fetchResultWithStore` / `fetchResultAppendStore` (the
      last hand-written fetch thunks in `searchReducer.ts`): move their
      consumers (`getSearchQueryResult` readers) to RTK Query hooks,
      then delete the search slice
- [ ] Store plain objects instead of `OGCCollections` class instances,
      then re-enable `serializableCheck`
- [ ] Replace the bookmark EventEmitter bridge with store subscriptions
      or RTK listener middleware

## Maybe later (fine to ignore)

- [ ] Move remaining store-imported UI types (button enums) to a
      neutral home if they ever block something
- [ ] Split `app/layout/constant.ts` by owner (breakpoints vs page
      widths vs layout sizes) together with page work
- [ ] Old `.tsx` icons in `src/assets/` (913-line files, SVG not
      optimized); icons in `components/icon/` hardcode colors against
      their own README (`currentColor` rule)
- [ ] `components/filter/__test__/canned.tsx` is 15,700 lines —
      convert to JSON data or split per test case
- [ ] `ErrorBoundary` / `HealthChecker` live in `utils/` (discussed
      2026-07, decided to keep)
- [ ] `public/` vs `src/assets/` may hold duplicate images — audit
- [ ] Naming convention (kebab-case folders, PascalCase components) is
      not machine-enforced; `eslint-plugin-check-file` could do it
