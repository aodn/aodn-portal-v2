# App

Everything that wires the app together. One of each — created once,
used everywhere.

| Item           | What is inside                                                          |
| -------------- | ----------------------------------------------------------------------- |
| `App.tsx`      | Root component: theme, providers, router                                |
| `router.tsx`   | URL → page table (layout route wraps the pages)                         |
| `layout/`      | Header, Footer and the Layout shell around every page                   |
| `providers/`   | Global React providers (clipboard)                                      |
| `api/`         | All backend requests: axios client, one file per domain, response types |
| `store/`       | Redux: global state, one reducer per slice, thunks per domain           |
| `TECH_DEBT.md` | Known problems and the plan for them                                    |

## How a request flows

Two paths, pick by need:

```
One-off data (most cases):
  component → api/search.ts etc. → .then(...) in the component
  (cancel by passing an AbortSignal)

Cached / polled data (health, more to come):
  component → useXxxQuery hook → store/ogcApi.ts → api layer
  (caching, dedupe and polling come for free)

Search results (legacy, still redux):
  component → dispatch(fetchResultWithStore) → store/searchReducer.ts
```

## Rules

- `api/` does HTTP only — no Redux in it.
- Reducers are pure — side effects (events, localStorage) live in thunks.
- Components never import axios — always go through `api/`.
