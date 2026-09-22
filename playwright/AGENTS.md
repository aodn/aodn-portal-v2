# Playwright E2E suite — Agent Guide

Python (3.10, Poetry) + pytest + `pytest-playwright` (sync API), run against
the app in `playwright-local` mode. The root `../AGENTS.md` working rules
(no Git mutations, stay in scope, reuse before creating) and its "Keeping
AGENTS.md current" section still apply; its Vitest/React/dayjs conventions do
not. Setup details: `README.md`.

## Where code goes

| Folder                | Holds                                                                                   |
| --------------------- | --------------------------------------------------------------------------------------- |
| `tests/<page>/`       | Test files, grouped by page (`landing_page`, `search_page`, `detail_page`)              |
| `tests/conftest.py`   | Page fixtures, tracing, global mock setup                                               |
| `pages/`              | Page objects (`*_page.py`, subclass `BasePage`); shared widgets in `pages/components/`  |
| `mocks/routes.py`     | URL patterns (`Routes.*`) for every mocked endpoint                                     |
| `mocks/api/`          | Route handlers (`handle_<thing>_api(route)`)                                            |
| `mocks/mock_data/`    | JSON fixtures (up to ~330 KB each: grep, never read whole), loaded via `load_json_data` |
| `mocks/api_router.py` | `ApiRouter.route_<thing>(...)` helpers                                                  |
| `mocks/apply.py`      | `apply_mock(page)`: default mocks applied to every page                                 |
| `core/`               | Enums, dataclasses, constants, factories used by tests                                  |
| `utils/`              | Pure helpers (JSON, map, URL, trace)                                                    |

## Conventions

- Use the fixtures from `tests/conftest.py`: `desktop_page`, `mobile_page`, or
  `responsive_page` (runs on both). Do not launch browsers in tests.
- All backend calls are mocked. A new endpoint the app calls needs a
  `Routes` entry, a handler in `mocks/api/`, an `ApiRouter` method, and a
  default registration in `apply_mock`.
- Per-test responses: create `ApiRouter(page=...)` in the test and re-route
  (e.g. `api_router.route_collection_all(handle_sort_by_title)`).
- Interact through page objects, not raw selectors in tests. Add locators and
  actions to the relevant page object or component.
- Prefer `get_by_test_id` / `get_by_role`. Changing a `data-testid` in `src/`
  breaks these tests, so update the page object alongside it.
- Assert with `expect(...)`. Each test gets a docstring describing what it
  validates (existing style).
- Style: ruff (`ruff.toml`). Single quotes, 80 cols, 4-space indent,
  sorted imports, type hints on functions.

## Running

- Full suite, dockerized (as CI does): `yarn playwright` from the repo root.
  Slow, so say why before running it.
- Local: start the app with `yarn playwright-local` from the root (runs Vitest
  first; `yarn playwright:no-vitest` skips it), then in `playwright/`:
  `pytest tests/<path>::<test>` or `pytest -k <name>`.
- Base URL comes from `settings.toml` (`http://localhost:5173`) and is
  overridden by the `BASE_URL` env var.
- Debug a failure: `pytest --tracing retain-on-failure`, then inspect
  `test-results/`. Check flakiness with `pytest -k <name> --count=10`.

## Gotchas

- The app behaves differently in `playwright-local` mode: no `HealthChecker`,
  a map test mode, and other `import.meta.env.MODE === "playwright-local"`
  branches in `src/`. Check those before assuming prod behaviour.
- In the Docker image, test deps live in `/opt/venv` (first on `PATH`) and run
  as `python3 -m pytest`. Poetry (pinned in `Dockerfile.test`) only installs;
  don't install into the system Python, where it breaks Poetry itself.
- Map tests render mapbox-gl on SwiftShader (CPU-bound). Launch flags live in
  `tests/conftest.py`. Don't raise `PYTEST_WORKERS` without measuring.
- CI shards the suite in two (`PYTEST_SPLITS`/`PYTEST_GROUP`, pytest-split,
  `scripts/entrypoint.sh`), balanced by `.test_durations`. After adding or
  substantially changing tests, regenerate it with `pytest --store-durations`.
