/**
 * Failure reporting for the SEO build steps (sitemap, detail prerender).
 * Edge builds swallow their errors so an API hiccup can't block a deploy,
 * but the failure must still be visible on the GitHub Actions run page.
 */

export const warnSeoStepFailed = (step: string, error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  if (process.env.GITHUB_ACTIONS) {
    // "::warning ...::" renders as an annotation on the Actions run page
    console.warn(
      `::warning title=${step} failed::${message} — dist is missing SEO artifacts; deploy continues`
    );
  } else {
    console.warn(`${step} failed (non-prod, ignored):`, error);
  }
};
