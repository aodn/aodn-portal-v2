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
} from "../components/common/store/searchReducer";
import { useAppDispatch } from "../components/common/store/hooks";

const useFetchData = () => {
  const dispatch = useAppDispatch();

  const fetchMore = useCallback(
    async (pageSize?: number) => {
      // This is very specific to how elastic works and then how to construct the query
      const componentParam: ParameterState = getComponentState(
        store.getState()
      );
      const collectionContext = getSearchQueryResult(store.getState());

      // Use standard param to get fields you need, record is stored in redux,
      // set page so that it return fewer records and append the search_after
      // to go the next batch of record.
      const paramPaged = createSearchParamFrom(componentParam, {
        pagesize: pageSize ?? DEFAULT_SEARCH_PAGE_SIZE,
        searchafter: collectionContext.result.search_after,
      });
      // Must use await so that record updated before you exit this call
      await dispatch(fetchResultAppendStore(paramPaged));
    },
    [dispatch]
  );

  return { fetchMore };
};

export default useFetchData;
