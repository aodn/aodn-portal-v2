import { FC, useCallback, useEffect } from "react";
import { useSelector } from "react-redux";
import { Box, Button, Grid } from "@mui/material";
import { useAppDispatch } from "../common/store/hooks";
import store, {
  getComponentState,
  RootState,
  searchQueryResult,
} from "../common/store/store";
import {
  CollectionsQueryType,
  createSearchParamFrom,
  fetchResultAppendStore,
  fetchResultWithStore,
} from "../common/store/searchReducer";
import { ParameterState } from "../common/store/componentParamReducer";
import ListResultCard from "./ListResultCard";
import { ResultCard } from "./ResultCards";
import DetailSubtabBtn from "../common/buttons/DetailSubtabBtn";

interface FullListAndDetailsProps extends ResultCard {}

const FULL_LIST_PAGE_SIZE = 21;

const FullListAndDetails: FC<FullListAndDetailsProps> = () => {
  const dispatch = useAppDispatch();
  const reduxContents = useSelector<RootState, CollectionsQueryType>(
    searchQueryResult
  );
  const fetchDatasets = useCallback(() => {
    const componentParam: ParameterState = getComponentState(store.getState());
    const paramPaged = createSearchParamFrom(componentParam, {
      pagesize: FULL_LIST_PAGE_SIZE,
    });
    dispatch(fetchResultWithStore(paramPaged));
  }, [dispatch]);

  const fetchMore = useCallback(async () => {
    // This is very specific to how elastic works and then how to construct the query
    const componentParam: ParameterState = getComponentState(store.getState());
    // Use standard param to get fields you need, record is stored in redux,
    // set page so that it return fewer records and append the search_after
    // to go the next batch of record.
    const paramPaged = createSearchParamFrom(componentParam, {
      pagesize: FULL_LIST_PAGE_SIZE,
      searchafter: reduxContents.result.search_after,
    });
    // Must use await so that record updated before you exit this call
    await dispatch(fetchResultAppendStore(paramPaged));
  }, [reduxContents.result.search_after, dispatch]);

  useEffect(() => {
    fetchDatasets();
  }, []);

  const {
    result: { collections },
  } = reduxContents;

  if (!collections || collections.length === 0) return;
  return (
    <Box>
      <Grid container spacing={1}>
        {collections.map((collection) => (
          <Grid item xs={12} md={6} lg={4} key={collection.id}>
            <ListResultCard content={collection} />
          </Grid>
        ))}
        <Grid item xs={12} sx={{ display: "flex", justifyContent: "center" }}>
          <DetailSubtabBtn
            id="full-list-load-more-btn"
            title="Show more results"
            isBordered={false}
            onClick={fetchMore}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default FullListAndDetails;
