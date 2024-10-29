import { useNavigate } from "react-router-dom";
import { pageDefault } from "../components/common/constants";
import {
  formatToUrlParam,
  ParameterState,
} from "../components/common/store/componentParamReducer";
import store, { getComponentState } from "../components/common/store/store";

const useRedirectSearch = () => {
  const navigate = useNavigate();

  const redirectSearch = (
    referer: string,
    fromNavigate: boolean = true,
    requireSearch: boolean = true
  ) => {
    const componentParam: ParameterState = getComponentState(store.getState());
    navigate(pageDefault.search + "?" + formatToUrlParam(componentParam), {
      state: {
        fromNavigate: fromNavigate,
        requireSearch: requireSearch,
        referer: referer,
      },
    });
  };

  return redirectSearch;
};

export default useRedirectSearch;
