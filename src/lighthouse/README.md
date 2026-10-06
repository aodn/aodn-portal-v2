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
- **The backend is mocked.** The runs never call a real OGC API: every `/api`
  request is answered from responses committed in `fixtures/api/`
  (`apiFixtures.ts`). A down or slow environment cannot fail the job or move
  a metric, and the payloads only change when someone refreshes them — see
  [Refreshing the API fixtures](#refreshing-the-api-fixtures).

The build is served by a small in-memory server (`appServer.ts`) rather than
`vite preview`: preview's `/api` proxy target is resolved from the `.env` files,
so a developer's local `.env` (pointing at `localhost:8080`) would silently make
the run measure `DegradedPage`. The server gzips text, marks `/assets/*`
immutable and answers any unknown path with `index.html`, which is what
CloudFront does for the app.

## Post-deployment release audits

`trigger_build_deploy.yml` dispatches `aodn/appdeploy` for the final Terragrunt
deployment. For staging and production it requests the exact workflow run ID
(`return_run_details: true`) and polls that run for up to 30 minutes. Only a
completed run with conclusion `success` triggers `lighthouse_release.yml`.
Failures, cancellations and timeouts stop the portal deployment job without
dispatching Lighthouse. Edge keeps its dispatch-only behavior and never triggers
the release audit.

The release workflow runs separately on the same branch or tag as the deployment,
and uses `yarn lh:measure` against the actual deployed site and its real backend.
It measures landing, search and details in both mobile and desktop emulation:
one discarded warm-up followed by three measured runs per page and form factor
(24 runs total). The job timeout is 40 minutes to allow for this broader coverage.
Each reported metric is the median of those three runs. Every page and form
factor's median Performance score is checked against **75/100**. A lower score is clearly reported as **FAIL** and
emits a workflow warning during measurement. After publishing the summary and
artifacts, a separate threshold check makes the **Release Lighthouse workflow
red** if Performance or any configured metric fails. The measurement step still
completes all pages. A valid score below the minimum never blocks deployment or
release: the deployment workflow dispatches the audit without waiting for its result.
Lighthouse/Chrome errors and invalid pages (including degraded shells, failed
dataset requests and redirects) still fail the audit job as execution errors.
The audit runs independently of deployment and does not gate promotion.

PR and release audits intentionally use the same pinned Lighthouse `12.8.2`
engine and its built-in mobile and desktop configurations for consistency and
reproducibility. Both workflows run on Node 20; the release workflow reads the
version from `.nvmrc`. The release audit provides repeatable post-deployment
measurements rather than reproducing a manual Chrome DevTools run. The PR
scoring engine and baseline comparisons remain unchanged.

Configuration is shared with PR measurements: `constants.ts` defines the routes
using the app's route constants and the stable detail UUID
`0015db7e-e684-7548-e053-08114f8cd4ad` (IMOS BA SOOP). Set the repository variable
`LH_DETAILS_UUID` to replace that dataset if it is retired. The workflow defines
the staging/production site origins (matching SEO), emulation and run count.
To change the score minimum, edit `MINIMUM_RELEASE_PERFORMANCE` in
`src/lighthouse/releaseReport.ts` (currently `75`). This single constant controls
both the pass/fail checks and the minimum displayed in the release summary.

**Performance >= 75/100 is the agreed QA requirement** and remains the main
release performance threshold. LCP, TBT, CLS and FCP use their **actual median
values**, with lower values being better, rather than Lighthouse audit scores.
Their limits are initial regression guardrails based on current observed portal
performance plus tolerance for normal Lighthouse variability. They are **not
official Core Web Vitals targets or product SLAs**; TBT is not INP.

All metric-value limits are configured in `RELEASE_METRIC_LIMITS` in
`src/lighthouse/releaseReport.ts`, separately for each page and form factor.
LCP, TBT and FCP are in milliseconds; CLS is unitless. Each limit is inclusive:
exactly matching it passes, exceeding it fails. A page/form-factor is **PASS**
only when its median Performance score is >= 75 and all four median metric
values are within their limits. Each median is calculated independently over
three measured runs after one discarded warm-up, protecting against a single
outlier. Release measurements retain actual numeric precision for these checks;
display rounding cannot turn a value just above the limit into a pass.

| Page    | Emulation | LCP maximum | TBT maximum | CLS maximum | FCP maximum |
| ------- | --------- | ----------- | ----------- | ----------- | ----------- |
| Landing | Mobile    | 6500 ms     | 400 ms      | 0.10        | 4200 ms     |
| Search  | Mobile    | 5500 ms     | 700 ms      | 0.10        | 4200 ms     |
| Details | Mobile    | 6500 ms     | 700 ms      | 0.10        | 4200 ms     |
| Landing | Desktop   | 2000 ms     | 150 ms      | 0.10        | 1000 ms     |
| Search  | Desktop   | 2500 ms     | 150 ms      | 0.10        | 1000 ms     |
| Details | Desktop   | 2500 ms     | 150 ms      | 0.10        | 1000 ms     |

Review and recalibrate these starting guardrails after enough staging/production
release data has been collected to understand normal variation. Limits remain
fixed configuration; a release never lowers its own requirements automatically.
Threshold failures make the independent Lighthouse workflow red after report
publication but remain non-blocking for deployment/release.

The QA job summary includes the environment, release/ref, SHA, tested page URL,
emulation, all three measured Performance scores and metric values, medians,
thresholds with explicit units, and **PASS/FAIL** for Performance and each of
LCP, TBT, CLS and FCP. It
shows separate mobile and desktop rows for every page, and execution status
separately from performance status. Execution errors
include the error and any pages already measured; setup failures before a report
exists produce an explicit error summary pointing to the failed step logs.

Artifacts are named `lighthouse-<environment>-<SHA>-<run-id>-<attempt>` and retained
for 90 days (subject to the repository/organization retention policy). Hidden
files are included explicitly because the output directory is `.lighthouse/`.
They contain `.lighthouse/report.json`, `report.md`,
`release-results.json`, and HTML/JSON reports for every measured run in `lhr/`.
Individual reports are saved before rendering checks, so an invalid page can
still be debugged. Warm-ups are excluded from the results. Uploads also run
after execution failures when any reports exist.

`release-results.json` is the structured input for future QA/Slack integrations:
it includes environment/ref/SHA, separate `executionStatus` and
`performanceStatus`, any execution error, and per-page URLs, scores, measured
runs, threshold and status, plus `metricChecks` with median metric values,
measured values, maximum thresholds, units, comparison operator (`<=`) and status.
`metricLimits` contains the configuration used for validation. `executionStatus` is `SUCCESS` or `ERROR`;
`performanceStatus` is `PASS`, `FAIL`, or `INCOMPLETE` when execution stopped
without a completed below-threshold result. Only completed measurements get a
final page score. There are no historical release comparisons or notifications.
The release workflow must be present on the default branch and the deployed ref
before it can be dispatched.

The existing deployment GitHub App needs Actions write access to both
`aodn/appdeploy` and this repository: it dispatches workflows in both and reads
the deployment run's status. No callback or workflow change in `appdeploy` is
needed. The PR workflow and its mocked measurements remain unchanged.

## Commands

| command           | does                                                       |
| ----------------- | ---------------------------------------------------------- |
| `yarn lh:build`   | production (edge) build into `dist/`, no tsc/Vitest        |
| `yarn lh:measure` | measures every route, writes `.lighthouse/report.json`     |
| `yarn lh:record`  | re-records `fixtures/api/` from a real environment         |
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
| `--url <site>`         | measure a deployed site with its real API; report a 75 minimum |
| `--form-factor mobile` | measure only mobile (or only `desktop`); default is both       |
| `--uuid <uuid>`        | measure a different record on `/details` (record it first)     |
| `--serve-only`         | just serve the build + mocked API, to open in a browser        |
| `--no-keep-lhr`        | skip writing the full results to `.lighthouse/lhr/`            |

`LH_RUNS`, `LH_FORM_FACTOR` (`mobile`, `desktop` or `both`), `LH_DETAILS_UUID`,
`LH_URL`, `LH_PORT` and `LH_COMMIT` do the same as their flags, for the workflow.
`--url` uses the site's origin and the shared route paths; it does not start a
local server or load API fixtures. It writes the release summary and applies the
release minimum only in this mode. The default local mode keeps the existing PR
measurement behavior. For a deployed audit, no local build is needed:

```bash
yarn lh:measure --url https://portal-staging.aodn.org.au --form-factor both --runs 3
```

## Refreshing the API fixtures

`fixtures/api/` holds one JSON file per API response plus `manifest.json`,
which maps each request (method + URL) to its file. Bodies are pretty-printed
so a refresh can be reviewed in the PR diff.

Refresh them when the OGC API response format changes, or when a PR changes
the requests the app makes — `yarn lh:measure` then fails with the requests
that have no fixture and tells you to do this:

```bash
yarn lh:build
yarn lh:record   # ~1 min: loads each route on mobile and desktop against portal-edge
git add src/lighthouse/fixtures/api
```

`yarn lh:record` only needs the real environment on the machine running it,
never in CI. It writes nothing unless every page rendered and every request got
an answer, so a flaky environment cannot leave a partial set behind. Flags:
`--api-host <url>` (or `LH_API_HOST`) to record from another environment, and
`--uuid <uuid>` to record a different `/details` record.

Expect the scores to move a little in the PR that refreshes the fixtures: the
new data is what the pages render.

## How the baseline works

`main` publishes; PRs consume.

1. A push to `main` builds, measures and uploads `.lighthouse/report.json` as the
   `lighthouse-baseline` artifact whenever the measurement succeeds and the run
   is not cancelled, even if the performance gate or another later step fails.
   The job still fails when the gate detects a blocking regression, but its
   baseline is refreshed so subsequent PRs compare with the latest measurement.
   A failed build or measurement does not publish a baseline.
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

## What the mocked PR measurements do not tell you

- **These are not production numbers.** No CloudFront, no real network, no real
  device; the API is mocked from committed fixtures. The number is comparable with other runs
  of this workflow and with nothing else. Field data lives in GA4 via
  `src/analytics/webVitalsEvents.ts`.
- **The API data is a snapshot.** It is whatever `portal-edge` returned when the
  fixtures were last recorded (`recordedAt` in `fixtures/api/manifest.json`),
  not what the catalogue holds today.
- **Third parties are measured.** GA and New Relic load in an edge build, and
  the map fetches Mapbox tiles, so their variance is in TBT.
- **Both form factors run on every PR.** They score differently — different
  throttling, different Lighthouse config — so the comment shows them as
  separate columns rather than picking one. Run the workflow manually with the
  `form-factor` input set to `mobile` or `desktop` for a faster, single-factor
  check.
