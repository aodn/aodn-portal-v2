import LandingPage from "../pages/LandingPage";
import SearchPage from "../pages/search-page/SearchPage";
import DetailsPage from "../pages/detail-page/DetailsPage";
import { pageDefault } from "../components/common/constants";
import { createBrowserRouter } from "react-router-dom";
import NotFoundPage from "../pages/NotFoundPage";
import ErrorPage from "../pages/ErrorPage";
import ErrorBoundary from "./ErrorBoundary";

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
    element: (
      <ErrorBoundary>
        <SearchPage />
      </ErrorBoundary>
    ),
    children: [],
  },
  {
    path: pageDefault.details,
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
