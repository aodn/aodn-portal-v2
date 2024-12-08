import { FC } from "react";
import { useSelector } from "react-redux";
import { Box } from "@mui/material";
import { CollectionsQueryType } from "../../../components/common/store/searchReducer";
import ResultPanelSimpleFilter, {
  ResultPanelSimpleFilterType,
} from "../../../components/common/filters/ResultPanelSimpleFilter";
import ResultCards, {
  ResultCardsType,
} from "../../../components/result/ResultCards";
import {
  RootState,
  searchQueryResult,
} from "../../../components/common/store/store";
import CircleLoader from "../../../components/loading/CircleLoader";
import { OGCCollection } from "../../../components/common/store/OGCCollectionDefinitions";
import { BookmarkButtonBasicType } from "../../../components/bookmark/BookmarkButton";

interface ResultSectionProps
  extends Partial<ResultPanelSimpleFilterType>,
    Partial<ResultCardsType>,
    Partial<BookmarkButtonBasicType> {
  showFullMap: boolean;
  showFullList: boolean;
  isLoading: boolean;
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
  checkIsBookmarked,
  onClickBookmark,
}) => {
  const reduxContents = useSelector<RootState, CollectionsQueryType>(
    searchQueryResult
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
