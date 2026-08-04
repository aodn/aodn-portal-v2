/**
 * SEO — a swallowed sitemap/prerender failure must still be visible.
 *
 * Edge builds ignore SEO step errors so an API hiccup can't block a deploy.
 * On GitHub Actions the warning must use the "::warning ...::" syntax, which
 * renders as an annotation on the run page; locally a plain console line is
 * enough.
 */

import { afterEach, describe, expect, test, vi } from "vitest";
import { warnSeoStepFailed } from "../buildReporting";

describe("warnSeoStepFailed", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  test("on GitHub Actions it emits an annotation with the step and error", () => {
    vi.stubEnv("GITHUB_ACTIONS", "true");
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});

    warnSeoStepFailed("Sitemap generation", new Error("fetch failed"));

    expect(warn).toHaveBeenCalledWith(
      "::warning title=Sitemap generation failed::fetch failed — dist is missing SEO artifacts; deploy continues"
    );
  });

  test("outside CI it warns plainly with the original error attached", () => {
    vi.stubEnv("GITHUB_ACTIONS", "");
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const error = new Error("fetch failed");

    warnSeoStepFailed("Detail prerender", error);

    expect(warn).toHaveBeenCalledWith(
      "Detail prerender failed (non-prod, ignored):",
      error
    );
  });

  test("non-Error failures are stringified into the annotation", () => {
    vi.stubEnv("GITHUB_ACTIONS", "true");
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});

    warnSeoStepFailed("Sitemap generation", "boom");

    expect(warn.mock.calls[0][0]).toContain("::boom — dist is missing");
  });
});
