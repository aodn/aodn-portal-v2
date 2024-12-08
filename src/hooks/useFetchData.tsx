import { useCallback } from "react";
import { ParameterState } from "../components/common/store/componentParamReducer";
import store, {
  getComponentState,
  RootState,
  searchQueryResult,
} from "../components/common/store/store";
import {
  CollectionsQueryType,
  createSearchParamFrom,
  DEFAULT_SEARCH_PAGE_SIZE,
  fetchResultAppendStore,
} from "../components/common/store/searchReducer";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../components/common/store/hooks";

const useFetchData = () => {
  const dispatch = useAppDispatch();
  const reduxContents = useSelector<RootState, CollectionsQueryType>(
    searchQueryResult
  );
  const componentParam: ParameterState = getComponentState(store.getState());

  const fetchMore = useCallback(
    async (pageSize?: number) => {
      // This is very specific to how elastic works and then how to construct the query

      // Use standard param to get fields you need, record is stored in redux,
      // set page so that it return fewer records and append the search_after
      // to go the next batch of record.
      const paramPaged = createSearchParamFrom(componentParam, {
        pagesize: pageSize ?? DEFAULT_SEARCH_PAGE_SIZE,
        searchafter: reduxContents.result.search_after,
      });
      // Must use await so that record updated before you exit this call
      await dispatch(fetchResultAppendStore(paramPaged));
    },
    [componentParam, dispatch, reduxContents.result.search_after]
  );

  return { fetchMore };
};

export default useFetchData;
