import { FC } from "react";
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
import FullListAndDetails from "../../../components/result/FullListAndDetails";

interface ResultSectionProps {
  currentSort: SortResultEnum | null;
  currentLayout: Exclude<
    SearchResultLayoutEnum,
    SearchResultLayoutEnum.FULL_MAP
  > | null;
  selectedLayout: SearchResultLayoutEnum;
  onChangeLayout: (layout: SearchResultLayoutEnum) => void;
  onChangeSorting: (v: SortResultEnum) => void;
  isLoading: boolean;
  onClickCard?: (item: OGCCollection | undefined) => void;
  selectedUuids: string[];
}

const RESULT_SECTION_WIDTH = 500;

const ResultSection: FC<ResultSectionProps> = ({
  selectedLayout,
  currentLayout,
  onChangeLayout,
  currentSort,
  onChangeSorting,
  onClickCard,
  selectedUuids,
  isLoading,
}) => {
  const reduxContents = useSelector<RootState, CollectionsQueryType>(
    searchQueryResult
  );

  const isFullMapView = selectedLayout === SearchResultLayoutEnum.FULL_MAP;
  const isFullListAndDetailsView =
    selectedLayout === SearchResultLayoutEnum.FULL_LIST;

  // Early return if it is full map view or no reduxContents
  if (isFullMapView || !reduxContents) return null;

  return (
    <Box
      sx={{
        width: isFullListAndDetailsView ? "100%" : RESULT_SECTION_WIDTH,
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
      {isFullListAndDetailsView ? (
        <Box sx={{ flex: 1, overflowY: "auto" }}>
          <FullListAndDetails
            onClickCard={onClickCard}
            selectedUuid={selectedUuids[0]}
          />
        </Box>
      ) : (
        <Box sx={{ flex: 1 }}>
          <ResultCards
            layout={currentLayout}
            contents={reduxContents}
            onClickCard={onClickCard}
            selectedUuids={selectedUuids}
          />
        </Box>
      )}
    </Box>
  );
};

export default ResultSection;
