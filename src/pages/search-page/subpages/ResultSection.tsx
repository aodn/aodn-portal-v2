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
import { SearchResultLayoutEnum } from "../../../components/common/buttons/MapListToggleButton";
import { SortResultEnum } from "../../../components/common/buttons/SortButton";
import {
  OGCCollection,
  OGCCollections,
} from "../../../components/common/store/OGCCollectionDefinitions";
import { useSelector, useDispatch } from "react-redux";
import store, {
  AppDispatch,
  getComponentState,
  RootState,
  searchQueryResult,
} from "../../../components/common/store/store";
import { ParameterState } from "../../../components/common/store/componentParamReducer";

interface SearchResultListProps {
  datasetSelected?: OGCCollection[];
  sx?: SxProps<Theme>;
  onVisibilityChanged?: (v: SearchResultLayoutEnum) => void;
  onChangeSorting: (v: SortResultEnum) => void;
  onClickCard?: (uuid: string) => void;
}

const ResultSection: React.FC<SearchResultListProps> = ({
  datasetSelected,
  sx,
  onVisibilityChanged,
  onChangeSorting,
  onClickCard,
}) => {
  // Get contents from redux
  const dispatch = useDispatch<AppDispatch>();
  const reduxContents = useSelector<RootState, CollectionsQueryType>(
    searchQueryResult
  );
  // Use to remember last layout, it is either LIST or GRID at the moment
  const [currentLayout, setCurrentLayout] = useState<
    SearchResultLayoutEnum.LIST | SearchResultLayoutEnum.GRID
  >(SearchResultLayoutEnum.LIST);

  const [contents, setContents] = useState<CollectionsQueryType>(reduxContents);

  useEffect(() => {
    setContents(reduxContents);
  }, [reduxContents]);

  const fetchMore = useCallback(() => {
    // This is very specific to how elastic works and then how to construct the query
    const componentParam: ParameterState = getComponentState(store.getState());
    // Use standard param to get fields you need, record is stored in redux,
    // set page so that it return fewer records and append the search_after
    // to go the next batch of record.
    const paramPaged = createSearchParamFrom(componentParam, {
      pagesize: DEFAULT_SEARCH_PAGE,
      searchafter: contents.result.search_after,
    });

    dispatch(fetchResultAppendStore(paramPaged))
      .unwrap()
      .then((collections: OGCCollections) => {
        // Make a new object so useState trigger
        contents.result = contents.result.clone();
        contents.result.merge(collections);
        setContents(contents);
      });
  }, [dispatch, contents]);

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
    contents && (
      <Box
        sx={{ ...sx, display: "flex", flexDirection: "column" }}
        data-testid="search-page-result-list"
      >
        <Box sx={{ height: "50px" }}>
          <ResultPanelSimpleFilter
            count={contents.result.collections.length}
            total={contents.result.total}
            onChangeLayout={onChangeLayout}
            onChangeSorting={onChangeSorting}
          />
        </Box>
        <Box sx={{ flex: 1 }}>
          <ResultCards
            layout={currentLayout}
            contents={contents}
            onDownload={undefined}
            onTags={undefined}
            onMore={undefined}
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
