This repository is `aodn-portal-v2`, the React frontend of the AODN data portal:
React 18, TypeScript (strict), Vite, Redux Toolkit, MUI, Mapbox GL, Vitest for
unit tests and Playwright for end-to-end tests. It reads metadata from
`ogcapi-java` (OGC API records/features) and data from `data-access-service`.

Pay particular attention to:

- React correctness: hook dependency arrays, stale closures, effects that
  subscribe or add map layers/sources without cleaning up, state updates after
  unmount, and keys in lists.
- Mapbox GL: layers and sources added more than once, event handlers not
  removed, and work done before the map or style has loaded.
- Async and data fetching: unhandled promise rejections, race conditions
  between overlapping requests, and assumptions about the shape of
  `ogcapi-java` responses (fields may be missing).
- Security: `dangerouslySetInnerHTML`, building URLs or queries from user or
  API data, and anything committed that looks like a token or key. Values in
  `.env*` files are build-time config and end up in the public bundle.
- Tests: behaviour changes and bug fixes should have Vitest coverage in a
  colocated `__test__` folder or `*.test.ts(x)` file. UI flow changes may need
  Playwright page objects under `playwright/` updated.

Conventions: double quotes, extensionless imports, PascalCase component files,
`use`-prefixed hooks. Do not report issues that ESLint or Prettier would catch.
