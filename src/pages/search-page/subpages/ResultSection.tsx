import ResultPanelSimpleFilter from "../../../components/common/filters/ResultPanelSimpleFilter";
import { Box, SxProps, Theme } from "@mui/material";
import {
  CollectionsQueryType,
  createSearchParamFrom,
  DEFAULT_SEARCH_PAGE,
  fetchResultAppendStore,
} from "../../../components/common/store/searchReducer";
import React, { useCallback, useEffect, useState } from "react";
import ResultCards from "../../../components/result/ResultCards";
import {
  OGCCollection,
  OGCCollections,
} from "../../../components/common/store/OGCCollectionDefinitions";
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

interface SearchResultListProps {
  datasetSelected?: OGCCollection[];
  sx?: SxProps<Theme>;
  onVisibilityChanged?: (v: SearchResultLayoutEnum) => void;
  onChangeSorting: (v: SortResultEnum) => void;
  onClickCard?: (uuid: string) => void;
  onNavigateToDetail?: (uuid: string) => void;
  isLoading: boolean;
}

const ResultSection: React.FC<SearchResultListProps> = ({
  datasetSelected,
  sx,
  onVisibilityChanged,
  onChangeSorting,
  onClickCard,
  onNavigateToDetail,
  isLoading,
}) => {
  // Get contents from redux
  const dispatch = useAppDispatch();
  const reduxContents = useSelector<RootState, CollectionsQueryType>(
    searchQueryResult
  );
  const [content, setContent] = useState<CollectionsQueryType>(reduxContents);

  useEffect(() => {
    setContent(reduxContents);
  }, [reduxContents]);

  // Use to remember last layout, it is either LIST or GRID at the moment
  const [currentLayout, setCurrentLayout] = useState<
    SearchResultLayoutEnum.LIST | SearchResultLayoutEnum.GRID
  >(SearchResultLayoutEnum.LIST);

  const fetchMore = useCallback(() => {
    // This is very specific to how elastic works and then how to construct the query
    const componentParam: ParameterState = getComponentState(store.getState());
    // Use standard param to get fields you need, record is stored in redux,
    // set page so that it return fewer records and append the search_after
    // to go the next batch of record.
    const paramPaged = createSearchParamFrom(componentParam, {
      pagesize: DEFAULT_SEARCH_PAGE,
      searchafter: content.result.search_after,
    });

    dispatch(fetchResultAppendStore(paramPaged))
      .unwrap()
      .then((collections: OGCCollections) => {
        // Make a new object so useState trigger
        const c: CollectionsQueryType = {
          result: content.result.clone(),
          query: content.query,
        };
        c.result.merge(collections);
        setContent(c);
      });
  }, [dispatch, content]);

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
    content && (
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
            count={content.result.collections.length}
            total={content.result.total}
            onChangeLayout={onChangeLayout}
            onChangeSorting={onChangeSorting}
          />
        </Box>
        <Box sx={{ flex: 1 }}>
          <ResultCards
            layout={currentLayout}
            contents={content}
            onDownload={undefined}
            onDetail={onNavigateToDetail}
            onClickCard={onClickCard}
            onFetchMore={fetchMore}
            datasetsSelected={datasetSelected}
          />
        </Box>
      </Box>
    )
  );
};

export default ResultSection;
