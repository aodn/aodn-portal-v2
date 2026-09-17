# Lighthouse CI

Detects performance regressions on pull requests. Every PR measures `/`,
`/search` and `/details/<uuid>` with Lighthouse, on both mobile and desktop
emulation, and reports how they moved against the latest run on `main`, as a
single comment that is updated on each push.

**Small score movements never fail a PR.** The job goes red when a run could not
be trusted — no build, Chrome or Lighthouse erroring, or a page that did not
actually render — or when performance drops 15 points or more against `main`
(see [Blocking threshold](#blocking-threshold)). A score dropping from 75 to 68
leaves the check green and says so in the comment; from 75 to 58 fails it.

## Why it is set up this way

Absolute thresholds ("performance must stay above 80") do not survive on shared
CI runners: mobile Lighthouse throttles a CPU we share with other tenants, and
this app's TBT — dominated by `mapbox-gl` — is exactly what that noise hits. So
the workflow compares against `main` and treats small movements as variability.

Two things make that comparison mean something:

- **The pages have to really render.** `/search` and `/details/:uuid` are empty
  without the OGC API, and every route is wrapped in `HealthChecker`, which
  renders `DegradedPage` unless `/manage/health` reports `UP`. Each run is
  checked for the final URL, a plausible DOM size and the API calls the route
  needs (`metrics.ts`), and anything else fails the job instead of publishing
  meaningless numbers.
- **The backend is not in the numbers.** A warm-up run records every API
  response to `.lighthouse/api-cache`, and the measured runs replay them from
  memory (`apiCache.ts`). Real payloads, no live-backend latency in LCP.

The build is served by a small in-memory server (`appServer.ts`) rather than
`vite preview`: preview's `/api` proxy target is resolved from the `.env` files,
so a developer's local `.env` (pointing at `localhost:8080`) would silently make
the run measure `DegradedPage`. The server gzips text, marks `/assets/*`
immutable and answers any unknown path with `index.html`, which is what
CloudFront does for the app.

## Commands

| command           | does                                                       |
| ----------------- | ---------------------------------------------------------- |
| `yarn lh:build`   | production (edge) build into `dist/`, no tsc/Vitest        |
| `yarn lh:measure` | measures every route, writes `.lighthouse/report.json`     |
| `yarn lh:compare` | `report.json` + baseline → `.lighthouse/report.md`         |
| `yarn lh:comment` | creates/updates the PR comment (needs `GITHUB_TOKEN`)      |
| `yarn lh:gate`    | fails (exit 1) if `lh:compare` found a blocking regression |

Run it locally exactly as CI does:

```bash
yarn lh:build
yarn lh:measure                 # ~4 min: 3 routes x 2 form factors x (1 warm-up + 3 runs)
yarn lh:compare                 # no baseline locally: reports current values
cat .lighthouse/report.md
```

Useful flags on `yarn lh:measure`:

| flag                   | for                                                            |
| ---------------------- | -------------------------------------------------------------- |
| `--runs 1`             | a quick check while changing this tooling                      |
| `--form-factor mobile` | measure only mobile (or only `desktop`); default is both       |
| `--uuid <uuid>`        | measure a different record on `/details`                       |
| `--api-host <url>`     | record from another environment (default `portal-edge`)        |
| `--fresh`              | drop the recorded API responses and record them again          |
| `--serve-only`         | just serve the build + recorded API data, to open in a browser |
| `--no-keep-lhr`        | skip writing the full results to `.lighthouse/lhr/`            |

`LH_RUNS`, `LH_FORM_FACTOR` (`mobile`, `desktop` or `both`), `LH_DETAILS_UUID`,
`LH_API_HOST`, `LH_PORT` and `LH_COMMIT` do the same as their flags, for the
workflow.

## How the baseline works

`main` publishes; PRs consume.

1. A push to `main` builds, measures and uploads `.lighthouse/report.json` as the
   `lighthouse-baseline` artifact.
2. A PR run asks the Actions API for the newest non-expired `lighthouse-baseline`
   from `main`, unpacks it and compares.
3. No baseline yet (first run, or the artifact expired) → the comment reports the
   PR's own values and says a baseline is coming. Never a failure.

Routes are matched by path, then by route id, so changing which record
`/details` measures does not lose the comparison.

## Warning thresholds

Checked independently for mobile and desktop, on every route. Anything smaller
is treated as noise. Regressions are listed in the comment with a ⚠️; any
improvement gets a ✅.

| metric                             | warns at      |
| ---------------------------------- | ------------- |
| Performance                        | −5 points     |
| Accessibility, Best Practices, SEO | −3 points     |
| LCP                                | +500 ms       |
| TBT                                | +100 ms       |
| CLS                                | +0.03         |
| FCP                                | reported only |

FCP moves with LCP, so warning on both would report one regression twice.

## Blocking threshold

Everything above is informational. The one exception: **a Performance score 15
points or more below `main`, on any route, on either mobile or desktop, fails
the job.** That is far outside normal run-to-run variability, so it means the
PR actually made a page slower, not noise.

- `yarn lh:compare` writes the routes that hit this into `.lighthouse/gate.json`;
  `yarn lh:gate` reads it and fails (after the PR comment has already been
  posted, so a failing PR still shows the numbers).
- Only Performance can block. Accessibility, Best Practices, SEO and the web
  metrics only ever warn — see the table above.
- `LH_FAIL_PERFORMANCE_DROP` overrides the 15-point threshold; `0` turns the
  gate off entirely.

## What it does not tell you

- **These are not production numbers.** No CloudFront, no real network, no real
  device; the API is replayed from disk. The number is comparable with other runs
  of this workflow and with nothing else. Field data lives in GA4 via
  `src/analytics/webVitalsEvents.ts`.
- **The recorded payloads change over time.** Each run records fresh responses
  from `portal-edge`, so a record gaining attachments can move a metric on its
  own. Big unexplained jumps are worth checking against
  `.lighthouse/lhr/*.json` in the run artifact.
- **Third parties are measured.** GA and New Relic load in an edge build, and
  the map fetches Mapbox tiles, so their variance is in TBT.
- **Both form factors run on every PR.** They score differently — different
  throttling, different Lighthouse config — so the comment shows them as
  separate columns rather than picking one. Run the workflow manually with the
  `form-factor` input set to `mobile` or `desktop` for a faster, single-factor
  check.
