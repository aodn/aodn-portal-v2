import ResultPanelSimpleFilter from "../../../components/common/filters/ResultPanelSimpleFilter";
import { Box } from "@mui/material";
import { CollectionsQueryType } from "../../../components/common/store/searchReducer";
import { FC, useCallback, useState } from "react";
import ResultCards from "../../../components/result/ResultCards";
import { useSelector } from "react-redux";
import {
  RootState,
  searchQueryResult,
} from "../../../components/common/store/store";
import { SortResultEnum } from "../../../components/common/buttons/ResultListSortButton";
import { SearchResultLayoutEnum } from "../../../components/common/buttons/MapViewButton";
import CircleLoader from "../../../components/loading/CircleLoader";
import { OGCCollection } from "../../../components/common/store/OGCCollectionDefinitions";

interface ResultSectionProps {
  onVisibilityChanged?: (v: SearchResultLayoutEnum) => void;
  onChangeSorting: (v: SortResultEnum) => void;
  isLoading: boolean;
  onClickCard?: (uuid: string) => void;
  datasetsSelected?: OGCCollection[];
}

const RESULT_SECTION_WIDTH = 500;

const ResultSection: FC<ResultSectionProps> = ({
  datasetsSelected,
  onVisibilityChanged,
  onChangeSorting,
  onClickCard,
  isLoading,
}) => {
  const reduxContents = useSelector<RootState, CollectionsQueryType>(
    searchQueryResult
  );
  // Use to remember last layout, it is either LIST or GRID at the moment
  const [currentLayout, setCurrentLayout] = useState<
    SearchResultLayoutEnum.LIST | SearchResultLayoutEnum.GRID
  >(SearchResultLayoutEnum.LIST);

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
          width: RESULT_SECTION_WIDTH,
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
            onChangeLayout={onChangeLayout}
            onChangeSorting={onChangeSorting}
          />
        </Box>
        <Box sx={{ flex: 1 }}>
          <ResultCards
            layout={currentLayout}
            contents={reduxContents}
            onClickCard={onClickCard}
            datasetsSelected={datasetsSelected}
          />
        </Box>
      </Box>
    )
  );
};

export default ResultSection;
