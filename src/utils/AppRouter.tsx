import LandingPage from "../pages/landing-page/LandingPage";
import SearchPage from "../pages/search-page/SearchPage";
import DetailsPage from "../pages/detail-page/DetailsPage";
import { createBrowserRouter } from "react-router-dom";
import NotFoundPage from "../pages/NotFoundPage";
import ErrorPage from "../pages/ErrorPage";
import ErrorBoundary from "./ErrorBoundary";
import { pageDefault } from "../components/common/constants";
import SearchRedirect from "./SearchRedirect";

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
        <SearchRedirect />
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
