import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { pageDefault } from "../components/common/constants";

export type TabNavigation = (
  uuid: string,
  tab: string,
  referer: string,
  section?: string
) => void;

const useTabNavigation = () => {
  const navigate = useNavigate();

  return useCallback<TabNavigation>(
    (uuid: string, tab: string, referer: string, section?: string) => {
      const searchParams = new URLSearchParams();

      // Add tab parameter
      searchParams.set("tab", tab);

      // Add section parameter if provided
      if (section) {
        searchParams.set("section", section);
      }

      // Navigate to the constructed URL
      navigate(`${pageDefault.details}/${uuid}?${searchParams.toString()}`, {
        state: {
          referer: referer,
        },
      });
    },
    [navigate]
  );
};

export default useTabNavigation;
