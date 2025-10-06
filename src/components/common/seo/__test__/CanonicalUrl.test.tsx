import { describe, it, expect, afterEach } from "vitest";
import { render, waitFor } from "@testing-library/react";
import { HelmetProvider } from "react-helmet-async";
import { MemoryRouter } from "react-router-dom";
import SEO from "../SEO";

const renderSEO = (ui: React.ReactElement, route = "/") => {
  return render(
    <HelmetProvider>
      <MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>
    </HelmetProvider>
  );
};

const getCanonicalUrl = () => {
  return document.querySelector('link[rel="canonical"]')?.getAttribute("href");
};

describe("SEO - Canonical URL", () => {
  afterEach(() => {
    document
      .querySelectorAll('link[rel="canonical"]')
      .forEach((el) => el.remove());
  });

  it("should set canonical URL without double slashes", async () => {
    renderSEO(<SEO />, "/");

    await waitFor(() => {
      const url = getCanonicalUrl();
      expect(url).toBe("https://portal-production.aodn.org.au/");
      expect(url).not.toContain("///");
    });
  });

  it("should handle regular paths", async () => {
    renderSEO(<SEO />, "/search");

    await waitFor(() => {
      expect(getCanonicalUrl()).toBe(
        "https://portal-production.aodn.org.au/search"
      );
    });
  });

  it("should handle detail pages with UUID", async () => {
    renderSEO(<SEO />, "/details/0145df96-3847-474b-8b63-a66f0e03ff54");

    await waitFor(() => {
      expect(getCanonicalUrl()).toBe(
        "https://portal-production.aodn.org.au/details/0145df96-3847-474b-8b63-a66f0e03ff54"
      );
    });
  });
});
