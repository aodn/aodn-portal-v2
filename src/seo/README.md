# SEO

Makes the portal visible to search engines. The app is a JavaScript-only SPA —
a crawler fetching a page gets an empty shell — so this folder adds what
crawlers need, delivered two ways:

- **In the app build** (wired in `vite.config.ts`): `vitePlugins.ts` bakes the
  site-wide head tags from `headTags.ts` into `index.html` and picks the
  per-environment `robots.txt`. At runtime `canonicalUrl.ts` keeps the
  canonical link in step with the route, `useDocumentTitle.ts` sets the
  per-page title, and `useRobotsNoIndex.ts` adds `noindex` to pages that must
  stay out of the index.
- **Weekly to S3** (the [Publish SEO Artifacts workflow](../../.github/workflows/seo.yml)):
  `fetchCollections.ts` pulls every record — the only module here that imports
  app-store code — and feeds two builders. `sitemap.ts` writes `sitemap.xml`.
  `prerender.ts` writes ~15k pages at `prerender/details/<uuid>/index.html`,
  each carrying `jsonLd.ts` structured data and a static body of title,
  abstract, a breadcrumb link home and `relatedRecords.ts` links — crawlers
  discover pages only through `<a href>`.

The pre-rendered pages ship **without the app bundle**. Google indexes a page
after running its JavaScript, so if the bundle is left in, React mounts, empties
`#root` and throws the static body away — every record then looks like the same
unresolved shell, which Search Console reports as "Duplicate, Google chose a
different canonical than user". `seo:verify` fails if the bundle comes back.

A CloudFront function (in `artifacts/`) rewrites crawler requests for
`/details/<uuid>` to the pre-rendered pages; real users always get the latest
SPA shell. The `prerender/` folder never appears in a public URL, sitemap or
canonical, and robots.txt disallows crawling it directly.

## Deployed source revision

The weekly workflow runs from `main`, but each environment's artifacts and
verification scripts run from the **full commit currently deployed to that
environment**. Edge, Staging and Production resolve independently. Neither
`main`, the latest tag nor GitHub environment deployment history identifies
the live application reliably; SEO runs themselves appear in that history.

The [application deployment workflow](../../.github/workflows/trigger_build_deploy.yml)
records `git rev-parse HEAD` after checkout. It excludes `index.html` from
`s3 sync --delete`, uploads the assets first, then uploads the shell with these
S3 user-defined metadata keys:

| Key             | Value                                                         |
| --------------- | ------------------------------------------------------------- |
| `repository`    | `aodn/aodn-portal-v2`                                         |
| `environment`   | `edge`, `staging` or `production`                             |
| `commit-sha`    | Full lowercase 40-character Git SHA of the checked-out source |
| `index-sha256`  | SHA-256 of the uploaded `index.html`                          |
| `deployment-id` | GitHub run ID and run attempt, separated by `-`               |

The shell and metadata change in the same S3 upload. A failed asset upload or
failed shell upload leaves the previous shell and metadata in place. If a later
infrastructure step fails, the metadata still describes the application that
was actually uploaded. No separate metadata file needs protection from sync.

The [publish workflow](../../.github/workflows/seo_publish_and_verify.yml)
assumes the existing environment AWS role and reads `index.html` metadata with
`HeadObject` **before checkout**. It validates the repository, environment,
SHA, digest and deployment ID, and confirms the commit exists in GitHub. Both
the publish job and its dependent live verification job check out that SHA;
Node and dependencies come from that revision's `.nvmrc` and lockfile.

The template still comes from the environment's public `/index.html`. Its
SHA-256 must match the resolved S3 metadata before generation starts. A stale
CloudFront response or changed HTML fails this check; wait for the deployment
and cache invalidation to finish, then rerun SEO. `VITE_API_HOST` still points
to the selected environment's site and backend. Canonical and sitemap rules
are unchanged.

Immediately before any SEO upload, the workflow reads the metadata again and
compares the revision, deployment ID, digest and object properties. A meaningful
S3 `VersionId` is checked when available, but absent or literal `null` IDs are
accepted. The deployment ID detects same-SHA redeployments even without S3
versioning. Failure of resolution, checkout, template validation or this final
check prevents publication, invalidation and Search Console submission. There
is no fallback to `main` or a tag.

### Concurrency and compatibility

Application deployment and SEO publishing share the repository-local
`portal-site-<environment>` concurrency group. Active jobs are not cancelled,
and pending jobs are queued. The weekly caller also lets active runs finish.
GitHub environment approvals remain in place.

GitHub concurrency groups do not coordinate across repositories.
`aodn/appdeploy` manages infrastructure and reads CloudFront function artifacts;
it does not upload the portal shell or bundles. Staging and Production hold
the portal deployment job open until their dispatched `appdeploy` run finishes.
Edge dispatches infrastructure asynchronously. Independent infrastructure
applies may overlap SEO; the existing live verification job checks CloudFront
routing afterward.

Manual uploads and workflows from old tags bypass the new concurrency group.
The final metadata check detects changes made before that check; it does not
lock out these writers during publication. Any future application writer in
another repository must provide equivalent coordination and preserve the
metadata contract.

Workflow steps come from the triggering workflow revision, while `yarn seo:*`
commands come from the deployed source. Keep workflow command names and
arguments compatible with all supported deployed versions. Changing only
the scripts on `main` does not change the scripts used by an older deployment.

### Rollout, recovery and access

Existing deployments have no revision metadata until deployed through the
updated application workflow. Edge receives it on the next successful deploy
from `main`; Staging and Production require a release/deployment containing
the updated workflow. Until then, approved SEO jobs fail safely. Coordinate
that rollout with the team; existing SEO artifacts remain in place.

A rollback through a tag predating this change or a manual shell upload without
the metadata contract blocks subsequent SEO runs. For a `Missing or invalid
deployment metadata` error, deploy the environment through the updated workflow
and rerun SEO. Do not backfill a guessed SHA from a tag or from `main`. If the
deployment changes during generation, rerun against the completed deployment.
For an unknown commit, investigate the recorded SHA and deployment source.

`HeadObject` requires effective `s3:GetObject` access to the target bucket's
`index.html`. Existing public bucket reads were confirmed during investigation,
but authenticated access under each environment's OIDC role must be checked
in CI. Existing `HeadObject` access to `sitemap.xml` alone does not establish
access to `index.html`. No new infrastructure or `appdeploy` changes are needed;
neither `s3:GetBucketVersioning` nor historical-version access is required.
Resolve an `AccessDenied` error for the existing role before retrying.

After deployment, validate Edge first, then Staging and Production with their
normal approvals. For each environment, confirm the logged deployed SHA
matches the application's source, both checkouts use it, local artifact
verification passes and the CloudFront verification job passes. Staging and
Production may use different SHAs. Avoid extra manual Production API scans;
use the normal approved SEO run to validate the complete flow.

### Regression coverage

`__test__/deploymentRevision.test.ts` executes the workflow JavaScript and Bash
with mocked AWS/GitHub interfaces and local command stubs. It covers environment
resolution, invalid/missing metadata, unavailable commits, optional version IDs,
deployment changes, upload ordering/failures, public template validation and
checkout/concurrency wiring without contacting AWS or the live API. Existing
pipeline and CloudFront tests cover sitemap/prerender output and crawler routing.

## Commands

| command                      | does                                                   |
| ---------------------------- | ------------------------------------------------------ |
| `yarn seo:artifacts`         | build sitemap + pre-rendered pages into `dist/`        |
| `yarn seo:verify [site-url]` | validate `dist/`, or the live site after a publish     |
| `yarn seo:gsc <sub-command>` | `submit` / `status` / `inspect`: Google Search Console |
