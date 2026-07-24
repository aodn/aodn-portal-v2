import { useNavigate } from "react-router-dom";
import { pageDefault } from "../components/common/constants";
import {
  formatToUrlParam,
  ParameterState,
} from "@/app/store/searchParamsReducer";
import store, { getSearchParams } from "@/app/store/store";

const useRedirectSearch = () => {
  const navigate = useNavigate();

  return (
    referer: string,
    fromNavigate: boolean = true,
    requireSearch: boolean = true
  ) => {
    const componentParam: ParameterState = getSearchParams(store.getState());
    navigate(pageDefault.search + "?" + formatToUrlParam(componentParam), {
      state: {
        fromNavigate: fromNavigate,
        requireSearch: requireSearch,
        referer: referer,
      },
    });
  };
};

export default useRedirectSearch;
