import { describe, expect, test, beforeEach } from "vitest";
import { createMemoryRouter } from "react-router-dom";
import { syncCanonicalUrl } from "../canonicalUrl";

const canonicalHref = () =>
  document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.href;

const canonicalCount = () =>
  document.head.querySelectorAll('link[rel="canonical"]').length;

const buildRouter = (initialPath: string) =>
  createMemoryRouter(
    [{ path: "/" }, { path: "/search" }, { path: "/details/:uuid" }],
    { initialEntries: [initialPath] }
  );

describe("syncCanonicalUrl", () => {
  beforeEach(() => {
    document.head.querySelector('link[rel="canonical"]')?.remove();
  });

  test("sets the canonical to the prod URL for the initial route", () => {
    syncCanonicalUrl(buildRouter("/details/abc-123"));

    expect(canonicalHref()).toBe("https://portal.aodn.org.au/details/abc-123");
  });

  test("creates the <link rel=canonical> element when the page has none", () => {
    expect(canonicalCount()).toBe(0);

    syncCanonicalUrl(buildRouter("/"));

    expect(canonicalCount()).toBe(1);
    expect(canonicalHref()).toBe("https://portal.aodn.org.au/");
  });

  test("reuses the existing canonical element instead of adding another", () => {
    const existing = document.createElement("link");
    existing.rel = "canonical";
    document.head.appendChild(existing);

    syncCanonicalUrl(buildRouter("/search"));

    expect(canonicalCount()).toBe(1);
    expect(canonicalHref()).toBe("https://portal.aodn.org.au/search");
  });

  test("updates the canonical when the route changes", async () => {
    const router = buildRouter("/");
    syncCanonicalUrl(router);
    expect(canonicalHref()).toBe("https://portal.aodn.org.au/");

    await router.navigate("/details/xyz");

    expect(canonicalHref()).toBe("https://portal.aodn.org.au/details/xyz");
  });
});
