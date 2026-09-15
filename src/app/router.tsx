import { createBrowserRouter, redirect, useLocation } from "react-router-dom";
import NotFoundPage from "../pages/error-page/NotFoundPage";
import ErrorPage from "../pages/error-page/ErrorPage";
import ErrorBoundary from "@/utils/ErrorBoundary";
import { pageDefault } from "../components/common/constants";
import HealthChecker from "@/utils/HealthChecker";
import DegradedPage from "../pages/error-page/DegradedPage";
import { syncCanonicalUrl } from "@/seo/canonicalUrl";
import Layout from "./layout/Layout";
import React, { Suspense, lazy } from "react";
import Fallback from "@/pages/error-page/Fallback";

const LandingPage = lazy(() => import("../pages/landing-page/LandingPage"));
const SearchPage = lazy(() => import("../pages/search-page/SearchPage"));
const DetailsPage = lazy(() => import("../pages/detail-page/DetailsPage"));
const DownloadsPage = lazy(
  () => import("@/pages/downloads-page/DownloadsPage")
);

// Helper to conditionally wrap a page with HealthChecker based on the mode
const wrapWithHealthChecker = (node: React.ReactNode) =>
  import.meta.env.MODE !== "playwright-local" ? (
    <HealthChecker>{node}</HealthChecker>
  ) : (
    node
  );

/**
 * Suspense sits inside ErrorBoundary and inside HealthChecker so a chunk that
 * fails to load still surfaces through the existing error/degraded handling
 * rather than bubbling past it.
 *
 * Keyed on pathname on purpose. React 18 keeps the previous route mounted
 * while the next one's chunk is still loading, so during a landing -> search
 * navigation the Header already renders its search-page Searchbar while the
 * landing page (and its own Searchbar) is still on screen -- two elements with
 * the same test id for ~2.7s, which fails Playwright's strict mode. Changing
 * the key forces the old subtree to unmount and the fallback to show instead.
 */
const RouteSuspense = ({ children }: { children: React.ReactNode }) => {
  const { pathname } = useLocation();
  return (
    <Suspense key={pathname} fallback={<Fallback />}>
      {children}
    </Suspense>
  );
};

const wrapPage = (node: React.ReactNode) => (
  <ErrorBoundary>
    {wrapWithHealthChecker(<RouteSuspense>{node}</RouteSuspense>)}
  </ErrorBoundary>
);

export const searchLoader = ({ request }: { request: Request }) => {
  const url = new URL(request.url);
  const uuid = url.searchParams.get("uuid");

  // If uuid parameter exists, redirect to details page
  if (uuid) {
    return redirect(`${pageDefault.details}/${uuid}`);
  }

  // Otherwise, continue to search page
  return null;
};

const router = createBrowserRouter([
  {
    // Layout route: renders Header/Footer once, pages render into its <Outlet />
    element: <Layout />,
    children: [
      {
        path: pageDefault.landing,
        element: wrapPage(<LandingPage />),
      },
      {
        path: pageDefault.search,
        loader: searchLoader,
        element: wrapPage(<SearchPage />),
      },
      {
        path: `${pageDefault.details}/:uuid`,
        element: wrapPage(<DetailsPage />),
      },
      {
        path: pageDefault.downloads,
        element: wrapPage(<DownloadsPage />),
      },
    ],
  },
  {
    path: pageDefault.error,
    Component: ErrorPage,
    children: [],
  },
  {
    path: pageDefault.degraded,
    Component: DegradedPage,
    children: [],
  },
  {
    path: "*",
    Component: NotFoundPage,
    children: [],
  },
]);

// Keep the canonical URL in sync with the current route (SEO).
syncCanonicalUrl(router);

export default router;
// TODO: move this to different place that is more related
