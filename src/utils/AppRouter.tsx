import LandingPage from "../pages/LandingPage";
import SearchPage from "../pages/SearchPage";
import DetailsPage from "../pages/DetailsPage";
import { pageDefault } from "../components/common/constants";
import { createBrowserRouter } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: pageDefault.landing,
    element: <LandingPage />,
    children: [],
  },
  {
    path: pageDefault.search,
    Component: SearchPage,
    children: [],
  },
  {
    path: pageDefault.details,
    Component: DetailsPage,
    children: [],
  },
]);

export default router;