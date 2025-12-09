import LandingPage from "../pages/landing-page/LandingPage";
import SearchPage from "../pages/search-page/SearchPage";
import DetailsPage from "../pages/detail-page/DetailsPage";
import { createBrowserRouter, redirect } from "react-router-dom";
import NotFoundPage from "../pages/NotFoundPage";
import ErrorPage from "../pages/ErrorPage";
import ErrorBoundary from "./ErrorBoundary";
import { pageDefault } from "../components/common/constants";

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
        <SearchPage />
      </ErrorBoundary>
    ),
    children: [],
  },
  {
    path: `${pageDefault.details}/:uuid`,
    element: (
      <ErrorBoundary>
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
    path: "*",
    Component: NotFoundPage,
    children: [],
  },
]);

export default router;
// TODO: move this to different place that is more related
