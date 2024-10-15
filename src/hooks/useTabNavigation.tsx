import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { pageDefault } from "../components/common/constants";

const useTabNavigation = () => {
  const navigate = useNavigate();

  return useCallback(
    (uuid: string, tab: string, section?: string) => {
      console.log("is called navi,tab=", tab);
      const searchParams = new URLSearchParams();

      // Add uuid parameter
      searchParams.set("uuid", uuid);

      // Add tab parameter
      searchParams.set("tab", tab);

      // Add section parameter if provided
      if (section) {
        searchParams.set("section", section);
      }

      // Navigate to the constructed URL
      navigate(`${pageDefault.details}?${searchParams.toString()}`);
    },
    [navigate]
  );
};

export default useTabNavigation;
