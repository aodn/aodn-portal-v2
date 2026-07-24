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

```
component → dispatch(thunk)        store/xxxThunks.ts
          → calls the API          api/search.ts etc.
          → response lands in      store/xxxReducer.ts
          → components re-render via useAppSelector (store/hooks.ts)
```

## Rules

- `api/` does HTTP only — no Redux in it.
- Reducers are pure — side effects (events, localStorage) live in thunks.
- Components never import axios — always go through `api/`.
