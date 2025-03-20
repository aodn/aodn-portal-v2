import { FC } from "react";
import { useSelector } from "react-redux";
import { Box, SxProps } from "@mui/material";
import { CollectionsQueryType } from "../../../components/common/store/searchReducer";
import ResultPanelSimpleFilter, {
  ResultPanelSimpleFilterType,
} from "../../../components/filter/ResultPanelSimpleFilter";
import ResultCards, {
  ResultCardsType,
} from "../../../components/result/ResultCards";
import {
  RootState,
  searchQueryResult,
} from "../../../components/common/store/store";
import CircleLoader from "../../../components/loading/CircleLoader";
import BookmarkListButton, {
  BookmarkListButtonBasicType,
} from "../../../components/result/BookmarkListButton";
import { SearchResultLayoutEnum } from "../../../components/common/buttons/ResultListLayoutButton";
import useBreakpoint from "../../../hooks/useBreakpoint";
import { SEARCH_PAGE_RESULT_SECTION_CONTAINER_MIN_WIDTH } from "../constants";

interface ResultSectionProps
  extends Partial<ResultPanelSimpleFilterType>,
    Partial<ResultCardsType>,
    BookmarkListButtonBasicType {
  showFullMap: boolean;
  showFullList: boolean;
  isLoading: boolean;
  sx?: SxProps;
}

const ResultSection: FC<ResultSectionProps> = ({
  showFullList,
  showFullMap,
  currentLayout,
  onChangeLayout,
  currentSort,
  onChangeSorting,
  onClickCard,
  selectedUuids,
  onDeselectDataset,
  isLoading,
  sx,
}) => {
  const { isUnderLaptop, isMobile } = useBreakpoint();
  const reduxContents = useSelector<RootState, CollectionsQueryType>(
    searchQueryResult
  );

  // Early return if it is full map view or no reduxContents
  if (showFullMap || !reduxContents) return null;

  return (
    <Box
      sx={{
        width:
          showFullList || isUnderLaptop
            ? "100%"
            : SEARCH_PAGE_RESULT_SECTION_CONTAINER_MIN_WIDTH,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        ...sx,
      }}
      gap={1}
      data-testid="search-page-result-list"
    >
      <CircleLoader isLoading={isLoading} />
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
        }}
        gap={1}
      >
        <ResultPanelSimpleFilter
          count={reduxContents.result.collections.length}
          total={reduxContents.result.total}
          currentLayout={currentLayout}
          onChangeLayout={onChangeLayout}
          currentSort={currentSort}
          onChangeSorting={onChangeSorting}
          isIconOnly={isMobile}
        />
        {(currentLayout === SearchResultLayoutEnum.FULL_LIST ||
          isUnderLaptop) && (
          <BookmarkListButton
            onDeselectDataset={onDeselectDataset}
            sx={{ width: isUnderLaptop ? "100%" : "50%" }}
          />
        )}
      </Box>
      <Box sx={{ flex: 1, height: "100%", overflowY: "auto" }}>
        <ResultCards
          layout={currentLayout}
          contents={reduxContents}
          onClickCard={onClickCard}
          selectedUuids={selectedUuids}
        />
      </Box>
    </Box>
  );
};

export default ResultSection;
