import { FC, useCallback, useEffect } from "react";
import { useSelector } from "react-redux";
import { Box, Grid } from "@mui/material";
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
  const {
    result: { collections },
  } = reduxContents;

  useEffect(() => {
    if (collections.length < 20) {
      const componentParam: ParameterState = getComponentState(
        store.getState()
      );
      const paramPaged = createSearchParamFrom(componentParam, {
        pagesize: FULL_LIST_PAGE_SIZE,
      });
      dispatch(fetchResultWithStore(paramPaged));
    }
    //only for fetching initial data
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchMore = useCallback(async () => {
    const componentParam: ParameterState = getComponentState(store.getState());
    const paramPaged = createSearchParamFrom(componentParam, {
      pagesize: FULL_LIST_PAGE_SIZE,
      searchafter: reduxContents.result.search_after,
    });
    await dispatch(fetchResultAppendStore(paramPaged));
  }, [reduxContents.result.search_after, dispatch]);

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
