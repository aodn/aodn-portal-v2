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
  fetchResultNoStore,
  SearchParameters,
} from "../components/common/store/searchReducer";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../components/common/store/hooks";
import {
  OGCCollection,
  OGCCollections,
} from "../components/common/store/OGCCollectionDefinitions";

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

  const fillGeometryIfMissing = useCallback(
    async (collection: OGCCollection): Promise<OGCCollection> => {
      if (collection.getGeometry())
        return new Promise((resolve, reject) => resolve(collection));

      const param: SearchParameters = {
        filter: `id='${collection.id}'`,
        properties: "id,bbox,geometry",
      };

      try {
        const value = await dispatch(fetchResultNoStore(param)).unwrap();
        collection.properties = value.collections[0].properties;
        collection.extentInt = value.collections[0].extent;
        return collection;
      } catch (error) {
        console.error("Error fetching collection data:", error);
        return collection;
      }
    },
    [dispatch]
  );

  // const fillGeometryIfMissing = useCallback(
  //   async (collection: OGCCollection): Promise<OGCCollection> => {
  //     if (collection.getGeometry()) {
  //       return collection;
  //     }

  //     const param: SearchParameters = {
  //       filter: `id='${collection.id}'`,
  //       properties: "id,bbox,geometry",
  //     };

  //     try {
  //       // Only fetch the data but don't modify the collection
  //       await dispatch(fetchResultNoStore(param)).unwrap();
  //       return collection;
  //     } catch (error) {
  //       console.error("Error fetching collection data:", error);
  //       return collection;
  //     }
  //   },
  //   [dispatch]
  // );

  return { fetchMore, fillGeometryIfMissing };
};

export default useFetchData;
