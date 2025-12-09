import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SearchPage from "../pages/search-page/SearchPage";
import { pageDefault } from "../components/common/constants";

const SearchRedirect = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Parse the query parameters
    const searchParams = new URLSearchParams(location.search);
    const uuid = searchParams.get("uuid");

    // If uuid parameter exists, redirect to details page
    if (uuid) {
      navigate(`${pageDefault.details}/${uuid}`, { replace: true });
      return;
    }
  }, [location.search, navigate]);

  // If no uuid parameter, render the normal search page
  return <SearchPage />;
};

export default SearchRedirect;
