# Tech debt

Found during the 2026-07 restructure. Main remaining work, one PR:

| #   | Problem                  | Fix                                                                 |
| --- | ------------------------ | ------------------------------------------------------------------- |
| 1   | 8 circular import cycles | Move shared types/constants into a third file so imports go one way |

(An earlier item — `searchReducer.ts` mixing axios client + thunks +
state — was fixed 2026-07: HTTP code now lives in `src/app/api/`,
split per domain, with one shared error normalizer in `httpClient.ts`.
That also removed 3 of the original 11 cycles.)

## 1. The 8 cycles

Found with `npx madge --circular --extensions ts,tsx src`. Note: madge
also reports `import type { RootState }` cycles between store and
reducers — ignore those, they are the standard redux pattern and are
erased at build time. The real cycles are:

- `Filters` ⇄ each of the 4 `tab-filters/*` (4 cycles)
- `ResultCards` ⇄ `GridResultCard` / `ListResultCard` (2 cycles)
- `ResultListLayoutButton` / `ResultListSortButton` ⇄ `IconSelect` ⇄
  `ResultPanelSimpleFilter` (2 cycles)

While fixing, also repair the lint gate in the same PR so cycles cannot
come back:

1. Upgrade `eslint-plugin-import` to ^2.32.0
   (2.29 is silently broken with ESLint 9 — it reports nothing)
2. Add to eslint settings:
   `"import/parsers": { "@typescript-eslint/parser": [".ts", ".tsx"] }`
3. After all cycles are fixed, turn on `"import/no-cycle": "error"`

⚠️ Regenerate `yarn.lock` with yarn 4 (`corepack yarn install`), not the
system yarn 1 — yarn 1 rewrites the whole lockfile.

## Redux official-alignment roadmap (bigger projects, in order)

1. Replace the bookmark EventEmitter bridge with store subscriptions or
   RTK listener middleware — components should react via useAppSelector,
   not a side channel.
2. Migrate data fetching to RTK Query. This retires the hand-written
   fetch thunks, the odd "NoStore" thunks (callers can just use
   `@/app/api` directly), and enables automatic caching/dedupe.
3. Store plain objects instead of OGCCollections class instances, then
   re-enable `serializableCheck`. Do together with 2.

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
