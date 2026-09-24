# AODN Portal v2 — Agent Guide

React 18 + TypeScript SPA (Vite, MUI v7, Redux Toolkit, mapbox-gl 3) for the
Australian Ocean Data Network portal. Backend: `ogcapi-java` via `/api/v1/ogc/*`.
Versions and dependencies: see `package.json`.

## Working rules

- Never run `git add`, `git commit`, `git push`, or create/switch branches
  unless explicitly asked. Leave changes in the working tree and summarise them.
- Keep changes strictly within the requested scope. No unrelated refactors.
- Search for an existing component, hook, util, or pattern before creating a
  new one; extend established patterns rather than introducing new ones.
- Do not add or upgrade dependencies unless the task requires it.
- Do not hand-edit generated files, e.g. `.env.dev|edge|staging|prod`
  (rewritten by `generateEnv.sh` on every build; edit `.env` or
  `.env.config.<mode>` instead).
- Never reproduce access tokens, API keys, credentials, or full environment
  configuration values in responses, even if they are in the repository.
  Refer to the variable name, config key, or file location instead.
- Do not make repeated or bulk calls to production APIs. Get explicit approval
  before any production call that could return a large payload or otherwise
  affect the production environment. Prefer the MSW mocks or a local/edge
  backend.
- Before refactoring state, imports, or folder layout, read
  `src/app/TECH_DEBT.md`.
- Never read fixtures or lockfiles whole (100k+ tokens each): grep them or
  read a line range. Largest: `src/lighthouse/fixtures/`,
  `src/components/filter/__test__/canned.tsx`, `src/__mocks__/data/*.ts`,
  `src/hooks/__test__/data.tsx`, `playwright/mocks/mock_data/`, `yarn.lock`.
- Run the checks before declaring work done. If one fails, report the output;
  do not work around it.

## Where code goes

| Folder                   | Holds                                     | Not here                                    |
| ------------------------ | ----------------------------------------- | ------------------------------------------- |
| `src/app/`               | App, router, store, providers, app layout | Feature UI                                  |
| `src/pages/<page>/`      | One folder per route                      | Anything used by 2+ pages                   |
| `src/components/`        | UI shared by 2+ pages                     | Page-specific composition                   |
| `src/components/common/` | Generic UI primitives                     | Domain-aware components                     |
| `src/hooks/`             | Hooks shared across pages                 | Single-page hooks (keep with page)          |
| `src/utils/`             | Pure helpers                              | React components (existing ones are legacy) |
| `src/styles/`            | Theme, tokens, fonts                      | Component-local styling                     |
| `src/__mocks__/`         | MSW handlers, fixtures                    | Anything shipped code imports               |

Page layout: `<Page>.tsx` composes; `layout/` = where things render;
`features/` = what renders (multi-file features get their own folder);
`context/` = React context shared across the page's panels; `constants.ts(x)`
= page-scoped constants; `__test__/` = tests.

- Page-scoped state shared by several panels goes in the page's `context/`, not
  the global Redux store.
- Shared types/constants live in leaf modules (`searchTypes.ts`,
  `datasetEnums.ts`, `result/types.ts`, `common/constants.ts`). Imports flow
  one way. After moving shared code, check cycles with
  `npx madge --circular --extensions ts,tsx src`.
- Analytics: add the event to `AnalyticsEvent` in
  `src/analytics/analyticsEvents.ts`, then call
  `trackCustomEvent(AnalyticsEvent.X, {...})`. Never call `window.gtag`.

## Coding conventions

**Naming**

- Folders kebab-case; component files PascalCase matching the component.
- Props: `<Component>Props`. Hooks: `use<Thing>.tsx`. Utils:
  `<Domain>Utils.ts(x)` with named exports. Reducers: `<name>Reducer.ts`.
  Icons: `<Name>Icon.tsx`.
- Module constants `UPPER_SNAKE_CASE`; grouped constants as camelCase objects
  (`pageDefault`). Tests: `<Subject>.test.ts(x)`.

**React**

- Arrow components typed `FC<XProps>`, default export at the bottom, defaults
  via destructuring. No `defaultProps`.
- Export a props interface only when another module needs it.
- Reusable components accept `sx?: SxProps` when callers need styling control.
- No reflexive `useMemo`/`useCallback`. Use them for referential stability,
  memoized children, or expensive work. Preserve existing memoization in the
  map and result-list trees (performance-sensitive).
- List keys: stable domain IDs. Index keys only for truly static lists.

**State**

- Use `useAppDispatch` / `useAppSelector` from `@/app/store/hooks`, never the
  bare `react-redux` hooks.

**Imports**

- Use the `@/` alias in new and touched code. Existing relative imports can
  stay (migration in progress).
- No file extensions in imports, except `.json`.

**Routes, dates, styling**

- Route paths come from `pageDefault` and date formats from `dateDefault`, both
  in `src/components/common/constants.ts`. Never hardcode either.
- `dayjs` (ESLint-enforced):
  - Import it only as `import dayjs from "@/utils/DayjsUtils"`, never from
    `"dayjs"`.
  - No bare `dayjs()`. Use `dayjs.tz(...)` or `toAppDayjs()` (from
    `@/utils/DateUtils`); `dayjs.utc(...)` only for protocol UTC.
  - Plugins are imported/configured only in `src/utils/DayjsUtils.ts`.
- Use theme values (`portalTheme` from `@/styles`), not hardcoded colours,
  typography, or spacing. Use `sx` for one-off styling.

**Formatting / types**

- ESLint + Prettier are authoritative (double quotes, semicolons, 2 spaces,
  80 cols, LF).
- `any` is allowed but prefer a concrete type when easy.
- `tsconfig` has `strict`, `noUnusedLocals`, `noUnusedParameters`: unused
  imports/params fail `yarn typecheck`, even though ESLint doesn't flag them.

## Testing and validation

- AI review scripts: `.github/ai-review/test.sh` runs in `lint-test.yml` on PRs/pushes to `main`, using mocks without AI credits.
- Unit tests: Vitest + jsdom + Testing Library, in a `__test__/` folder next to
  the code.
- Mock HTTP with MSW, not by mocking axios. Handlers are in
  `src/__mocks__/handlers.ts`, fixtures in `src/__mocks__/data/`, and helpers in
  `src/__mocks__/utils/`. New API behaviour needs a handler there.
- `src/setupTests.ts` stubs `ResizeObserver`/`IntersectionObserver` and
  globally mocks `analytics/customEventTracker` (`trackCustomEvent`) and the
  static layer fetches (`fetchMarineParkOptions`,
  `fetchMarineEcoregionOptions`, `fetchAllenCoralAtlasOptions`). Override
  per file when a test needs real behaviour.

Validate with one command:

```bash
yarn verify   # lint (--max-warnings 0) → typecheck → unit tests; stops at first failure
```

- Output is compact: nothing on success, full error + stack for failing tests.
  Use it instead of running lint/typecheck/tests separately.
- Only if a failure needs more context, re-run that file verbosely:
  `yarn test:debug <path>`. Never run `yarn test:debug` on the whole suite
  (~1.3 MB of console output).
- Never run `yarn test` non-interactively. It is watch mode.
- `yarn dev` runs the full unit suite before starting. Use `yarn dev:no-test`
  while iterating.
- `yarn playwright` (dockerized Python E2E, slow) only when the change touches
  an E2E-covered flow. Explain why before running it. CI requires lint, unit
  tests, build, and Playwright to pass.

## Critical gotchas

- **Dev API proxy is an allowlist.** `vite.config.ts` proxies a fixed list of
  `/api/v1/ogc/*` paths. A new backend endpoint needs an entry there or it 404s
  locally while working in production.
- **Keep `build.worker.format: "es"`** in `vite.config.ts`. mapbox-gl 3.x
  workers use dynamic imports that the default `iife` format can't build.
- **Two themes coexist.** `@/styles` exports `portalTheme` = `themeRC8`
  (`designTokensRC8.ts`, `fontsRC8.ts`), which you should use for new work.
  `theme.ts` is the older theme. Check which one a component consumes before
  editing shared styles.
- **`console.log` fails lint/CI.** `no-console` is a warning, and warnings fail.
  `console.warn`/`console.error` are allowed.
- **Yarn 4 only.** Use `corepack yarn install`. System yarn 1 rewrites the
  whole `yarn.lock`.
- **Node 20** (`.nvmrc`; run `nvm use` first). Other versions can fail tests
  unrelated to your change. README's Node 18 reference is outdated.
- Pages are wrapped in `HealthChecker` except when
  `import.meta.env.MODE === "playwright-local"`.
- E2E page objects select by `data-testid`. Renaming or removing one in `src/`
  breaks `playwright/` tests, so grep `playwright/pages` first.
- If asked to commit: the header must be 72 characters or less (commitlint).
  Match the style of recent history. Branch names:
  `feature/<ticket>-kebab-desc` or `bugfix/<ticket>-kebab-desc`, off `main`.

## Further documentation

Read the relevant file before working in these areas:

- E2E tests (`playwright/`, Python): `playwright/AGENTS.md`.
- SEO (`src/seo/`, sitemap, prerendering): `src/seo/README.md`. Only
  `fetchCollections.ts` there may import app-store code.
- Lighthouse CI (`src/lighthouse/`): `src/lighthouse/README.md`.
- Pages, analytics, assets: `src/pages/README.md`, `src/analytics/README.md`,
  `src/assets/README.md`.
- Structural debt and refactor targets: `src/app/TECH_DEBT.md`.
- CI workflows: `.github/workflows/`.

## Keeping AGENTS.md current

When a change makes an `AGENTS.md` wrong or incomplete, update the nearest one
(root or `playwright/`) in the same change. Examples: a new or changed command,
convention, pinned tool version, or how tests run.

- Add only what would change an agent's decision and isn't obvious from the
  code. One line where possible.
- Edit or replace the existing line instead of appending a new one. Delete
  rules that no longer hold.
- If it needs more than a few lines, write it in that area's README and link
  it here.
- Mention the `AGENTS.md` edit in your summary so the reviewer can check it.
