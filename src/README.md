# Source structure

| Folder        | What is inside                                              |
| ------------- | ----------------------------------------------------------- |
| `main.tsx`    | App entry point, renders `<App />`                          |
| `app/`        | App setup: `App.tsx`, router, global providers, Redux store |
| `pages/`      | One folder per page: landing, search, detail, error         |
| `components/` | UI components used by more than one page                    |
| `hooks/`      | Custom React hooks                                          |
| `styles/`     | Theme: colors, fonts, spacing                               |
| `utils/`      | Small helper functions (dates, strings, URLs, ...)          |
| `analytics/`  | Google Analytics tracking                                   |
| `assets/`     | Images, icons, logos                                        |
| `__mocks__/`  | Fake data for tests                                         |

## Rules

- Import with `@/`, for example `@/app/store/store` — avoid long `../../..` paths.
- Put tests in a `__test__/` folder next to the code being tested.
- Get colors and fonts from the theme (`styles/`), do not hardcode values.
