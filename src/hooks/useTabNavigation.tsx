import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { pageDefault } from "../components/common/constants";

export enum OpenType {
  TAB = "TAB",
  WINDOW = "WINDOW",
}

export type TabNavigation = (
  uuid: string,
  tab: string,
  referer: string,
  section?: string,
  type?: OpenType
) => void;

const useTabNavigation = (): TabNavigation => {
  const navigate = useNavigate();

  return useCallback<TabNavigation>(
    (
      uuid: string,
      tab: string,
      referer: string,
      section?: string,
      type?: OpenType
    ) => {
      const searchParams = new URLSearchParams();

      // Add tab parameter
      searchParams.set("tab", tab);

      // Add section parameter if provided
      if (section) {
        searchParams.set("section", section);
      }

      switch (type) {
        case OpenType.TAB:
          window.open(
            `${pageDefault.details}/${uuid}?${searchParams.toString()}`,
            "_blank"
          );
          break;
        case OpenType.WINDOW:
          window.open(
            `${pageDefault.details}/${uuid}?${searchParams.toString()}`,
            "_blank",
            "width=800,height=600"
          );
          break;
        default:
          // Navigate to the constructed URL
          navigate(
            `${pageDefault.details}/${uuid}?${searchParams.toString()}`,
            {
              state: {
                referer: referer,
              },
            }
          );
          break;
      }
    },
    [navigate]
  );
};

export default useTabNavigation;
