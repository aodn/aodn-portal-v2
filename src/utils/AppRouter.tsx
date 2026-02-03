import LandingPage from "../pages/landing-page/LandingPage";
import SearchPage from "../pages/search-page/SearchPage";
import DetailsPage from "../pages/detail-page/DetailsPage";
import { createBrowserRouter, redirect } from "react-router-dom";
import NotFoundPage from "../pages/error-page/NotFoundPage";
import ErrorPage from "../pages/error-page/ErrorPage";
import ErrorBoundary from "./ErrorBoundary";
import { pageDefault } from "../components/common/constants";
import HealthChecker from "./HealthChecker";
import DegradedPage from "../pages/error-page/DegradedPage";

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
    path: pageDefault.landing,
    element: (
      <ErrorBoundary>
        <HealthChecker />
        <LandingPage />
      </ErrorBoundary>
    ),
    children: [],
  },
  {
    path: pageDefault.search,
    loader: searchLoader,
    element: (
      <ErrorBoundary>
        <HealthChecker />
        <SearchPage />
      </ErrorBoundary>
    ),
    children: [],
  },
  {
    path: `${pageDefault.details}/:uuid`,
    element: (
      <ErrorBoundary>
        <HealthChecker />
        <DetailsPage />
      </ErrorBoundary>
    ),
    children: [],
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

export default router;
// TODO: move this to different place that is more related
