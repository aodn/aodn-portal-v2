import { FC, useCallback } from "react";
import { useSelector } from "react-redux";
import { Box } from "@mui/material";
import { CollectionsQueryType } from "../../../components/common/store/searchReducer";
import ResultPanelSimpleFilter from "../../../components/common/filters/ResultPanelSimpleFilter";
import ResultCards from "../../../components/result/ResultCards";
import {
  RootState,
  searchQueryResult,
} from "../../../components/common/store/store";
import { SortResultEnum } from "../../../components/common/buttons/ResultListSortButton";
import { SearchResultLayoutEnum } from "../../../components/common/buttons/ResultListLayoutButton";
import CircleLoader from "../../../components/loading/CircleLoader";
import { OGCCollection } from "../../../components/common/store/OGCCollectionDefinitions";
import {
  addItem,
  selectBookmarkItems,
  selectTemporaryItem,
  setTemporaryItem,
} from "../../../components/common/store/bookmarkListReducer";
import { useAppDispatch } from "../../../components/common/store/hooks";

interface ResultSectionProps {
  showFullMap: boolean;
  showFullList: boolean;
  currentSort: SortResultEnum | null;
  currentLayout: Exclude<
    SearchResultLayoutEnum,
    SearchResultLayoutEnum.FULL_MAP
  > | null;
  onChangeLayout: (layout: SearchResultLayoutEnum) => void;
  onChangeSorting: (v: SortResultEnum) => void;
  isLoading: boolean;
  onClickCard?: (item: OGCCollection | undefined) => void;
  selectedUuids: string[];
}

const RESULT_SECTION_WIDTH = 500;

const ResultSection: FC<ResultSectionProps> = ({
  showFullList,
  showFullMap,
  currentLayout,
  onChangeLayout,
  currentSort,
  onChangeSorting,
  onClickCard,
  selectedUuids,
  isLoading,
}) => {
  const dispatch = useAppDispatch();
  const reduxContents = useSelector<RootState, CollectionsQueryType>(
    searchQueryResult
  );
  const bookmarkItems = useSelector(selectBookmarkItems);
  const bookmarkTemporaryItem = useSelector(selectTemporaryItem);

  const checkIsBookmarked = useCallback(
    (uuid: string) => bookmarkItems?.some((item) => item.id === uuid),
    [bookmarkItems]
  );

  // TODO:need to expand accordion
  const onClickBookmark = useCallback(
    (item: OGCCollection) => {
      // If click on a temporaryItem
      console.log("click bookmark");
      if (bookmarkTemporaryItem && bookmarkTemporaryItem.id === item.id) {
        dispatch(setTemporaryItem(undefined));
        dispatch(addItem(item));
      } else {
        dispatch(addItem(item));
      }
    },
    [bookmarkTemporaryItem, dispatch]
  );

  // Early return if it is full map view or no reduxContents
  if (showFullMap || !reduxContents) return null;

  return (
    <Box
      sx={{
        width: showFullList ? "100%" : RESULT_SECTION_WIDTH,
        height: "100%",
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
          currentLayout={currentLayout}
          onChangeLayout={onChangeLayout}
          currentSort={currentSort}
          onChangeSorting={onChangeSorting}
        />
      </Box>
      <Box sx={{ flex: 1, overflowY: "auto" }}>
        <ResultCards
          layout={currentLayout}
          contents={reduxContents}
          onClickCard={onClickCard}
          onClickBookmark={onClickBookmark}
          checkIsBookmarked={checkIsBookmarked}
          selectedUuids={selectedUuids}
        />
      </Box>
    </Box>
  );
};

export default ResultSection;
