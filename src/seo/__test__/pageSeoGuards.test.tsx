/**
 * Guards the SEO behaviour of pages that must not be indexed: every route
 * answers HTTP 200, so these pages carry a runtime noindex meta and their own
 * title (see useRobotsNoIndex.ts). If a page refactor drops either, this fails.
 * The unknown-record detail page is covered by NoRecordFound.test.tsx, which
 * already wires up the detail-page provider and mock server.
 */
import { vi, describe, afterEach, test, expect } from "vitest";
import { cleanup, render } from "@testing-library/react";
import NotFoundPage from "@/pages/error-page/NotFoundPage";
import ErrorPage from "@/pages/error-page/ErrorPage";
import DegradedPage from "@/pages/error-page/DegradedPage";

vi.mock("react-router-dom", () => ({
  useNavigate: vi.fn(),
}));

const noIndexMeta = () =>
  document.head.querySelector('meta[name="robots"][content="noindex"]');

describe("error pages carry noindex and their own title", () => {
  afterEach(cleanup);

  test.each([
    ["NotFoundPage", NotFoundPage, "Page not found | AODN Portal"],
    ["ErrorPage", ErrorPage, "Error | AODN Portal"],
    ["DegradedPage", DegradedPage, "Service unavailable | AODN Portal"],
  ] as const)("%s", (_name, Page, title) => {
    const { unmount } = render(<Page />);
    expect(document.title).toBe(title);
    expect(noIndexMeta()).not.toBeNull();
    unmount();
    expect(noIndexMeta()).toBeNull();
  });
});
