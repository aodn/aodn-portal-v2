import ResultPanelSimpleFilter from "../../../components/common/filters/ResultPanelSimpleFilter";
import { Box } from "@mui/material";
import {
  CollectionsQueryType,
  createSearchParamFrom,
  DEFAULT_SEARCH_PAGE,
  fetchResultAppendStore,
} from "../../../components/common/store/searchReducer";
import { FC, useCallback, useState } from "react";
import ResultCards, {
  ResultCardsList,
} from "../../../components/result/ResultCards";
import { useSelector } from "react-redux";
import store, {
  getComponentState,
  RootState,
  searchQueryResult,
} from "../../../components/common/store/store";
import { ParameterState } from "../../../components/common/store/componentParamReducer";
import { SortResultEnum } from "../../../components/common/buttons/ResultListSortButton";
import { SearchResultLayoutEnum } from "../../../components/common/buttons/MapViewButton";
import CircleLoader from "../../../components/loading/CircleLoader";
import { useAppDispatch } from "../../../components/common/store/hooks";

interface ResultSectionProps extends Partial<ResultCardsList> {
  onVisibilityChanged?: (v: SearchResultLayoutEnum) => void;
  onChangeSorting: (v: SortResultEnum) => void;
  isLoading: boolean;
}

const ResultSection: FC<ResultSectionProps> = ({
  datasetsSelected,
  sx,
  onVisibilityChanged,
  onChangeSorting,
  onClickCard,
  onDetail,
  onDownload,
  onLink,
  isLoading,
}) => {
  // Get contents from redux
  const dispatch = useAppDispatch();
  const reduxContents = useSelector<RootState, CollectionsQueryType>(
    searchQueryResult
  );

  // Use to remember last layout, it is either LIST or GRID at the moment
  const [currentLayout, setCurrentLayout] = useState<
    SearchResultLayoutEnum.LIST | SearchResultLayoutEnum.GRID
  >(SearchResultLayoutEnum.LIST);

  const fetchMore = useCallback(async () => {
    // This is very specific to how elastic works and then how to construct the query
    const componentParam: ParameterState = getComponentState(store.getState());
    // Use standard param to get fields you need, record is stored in redux,
    // set page so that it return fewer records and append the search_after
    // to go the next batch of record.
    const paramPaged = createSearchParamFrom(componentParam, {
      pagesize: DEFAULT_SEARCH_PAGE,
      searchafter: reduxContents.result.search_after,
    });
    // Must use await so that record updated before you exit this call
    await dispatch(fetchResultAppendStore(paramPaged));
  }, [dispatch, reduxContents.result.search_after]);

  const onChangeLayout = useCallback(
    (layout: SearchResultLayoutEnum) => {
      if (
        layout === SearchResultLayoutEnum.INVISIBLE ||
        layout === SearchResultLayoutEnum.VISIBLE
      ) {
        // We need to notify on visibility
        if (onVisibilityChanged) {
          onVisibilityChanged(layout);
        }
      } else {
        // Otherwise just remember user last selection
        setCurrentLayout(layout);
      }
    },
    [setCurrentLayout, onVisibilityChanged]
  );

  return (
    reduxContents && (
      <Box
        sx={{
          ...sx,
          display: "flex",
          flexDirection: "column",
          position: "relative",
        }}
        gap={1}
        data-testid="search-page-result-list"
      >
        <CircleLoader isLoading={isLoading} />
        <Box>
          <ResultPanelSimpleFilter
            count={reduxContents.result.collections.length}
            total={reduxContents.result.total}
            onChangeLayout={onChangeLayout}
            onChangeSorting={onChangeSorting}
          />
        </Box>
        <Box sx={{ flex: 1 }}>
          <ResultCards
            layout={currentLayout}
            contents={reduxContents}
            onDownload={onDownload}
            onLink={onLink}
            onDetail={onDetail}
            onClickCard={onClickCard}
            onFetchMore={fetchMore}
            datasetsSelected={datasetsSelected}
          />
        </Box>
      </Box>
    )
  );
};

export default ResultSection;
