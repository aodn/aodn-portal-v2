import { useCallback } from "react";
import { ParameterState } from "../components/common/store/componentParamReducer";
import store, {
  getComponentState,
  getSearchQueryResult,
} from "../components/common/store/store";
import {
  createSearchParamFrom,
  DEFAULT_SEARCH_PAGE_SIZE,
  fetchResultAppendStore,
  fetchResultWithStore,
} from "../components/common/store/searchReducer";
import { useAppDispatch } from "../components/common/store/hooks";

const useFetchData = () => {
  const dispatch = useAppDispatch();

  const fetchRecord = useCallback(
    (restart: boolean, pageSize?: number) => {
      // This is very specific to how elastic works and then how to construct the query
      const componentParam: ParameterState = getComponentState(
        store.getState()
      );
      if (restart) {
        const paramPaged = createSearchParamFrom(
          { ...componentParam, includeNoGeometry: true },
          {
            pagesize: pageSize ?? DEFAULT_SEARCH_PAGE_SIZE,
          }
        );
        return dispatch(fetchResultWithStore(paramPaged));
      } else {
        const collectionContext = getSearchQueryResult(store.getState());
        // Use standard param to get fields you need, record is stored in redux,
        // set page so that it return fewer records and append the search_after
        // to go the next batch of record.
        const paramPaged = createSearchParamFrom(
          { ...componentParam, includeNoGeometry: true },
          {
            pagesize: pageSize ?? DEFAULT_SEARCH_PAGE_SIZE,
            searchafter: collectionContext.result.search_after,
          }
        );
        return dispatch(fetchResultAppendStore(paramPaged));
      }
    },
    [dispatch]
  );

  return { fetchRecord };
};

export default useFetchData;
