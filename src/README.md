# Source structure

| Folder        | What is inside                                            |
| ------------- | --------------------------------------------------------- |
| `main.tsx`    | App entry point, renders `<App />`                        |
| `app/`        | App setup: router, layout, api, store (see app/README.md) |
| `pages/`      | One folder per page: landing, search, detail, error       |
| `components/` | UI components used by more than one page                  |
| `hooks/`      | Custom React hooks                                        |
| `styles/`     | Theme: colors, fonts, spacing                             |
| `utils/`      | Small helper functions (dates, strings, URLs, ...)        |
| `analytics/`  | Google Analytics tracking                                 |
| `assets/`     | Images, icons, logos                                      |
| `__mocks__/`  | Fake data for tests                                       |

## Rules

- Folder names: kebab-case (`detail-page`, `list-item`).
  Component files: PascalCase matching the component (`DocumentList.tsx`).
- Import with `@/`, for example `@/app/store/store` — avoid long `../../..` paths.
- Put tests in a `__test__/` folder next to the code being tested.
- Get colors and fonts from the theme (`styles/`), do not hardcode values.
