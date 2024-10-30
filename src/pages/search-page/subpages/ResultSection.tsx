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
import { SearchResultLayoutEnum } from "../../../components/common/buttons/LayoutViewButton";
import CircleLoader from "../../../components/loading/CircleLoader";
import { OGCCollection } from "../../../components/common/store/OGCCollectionDefinitions";

interface ResultSectionProps {
  currentLayout: Exclude<
    SearchResultLayoutEnum,
    SearchResultLayoutEnum.FULL_MAP
  > | null;
  onChangeLayout: (layout: SearchResultLayoutEnum) => void;
  onChangeSorting: (v: SortResultEnum) => void;
  isLoading: boolean;
  onClickCard?: (uuid: string) => void;
  datasetsSelected?: OGCCollection[];
}

const RESULT_SECTION_WIDTH = 500;

const ResultSection: FC<ResultSectionProps> = ({
  datasetsSelected,
  currentLayout,
  onChangeLayout,
  onChangeSorting,
  onClickCard,
  isLoading,
}) => {
  const reduxContents = useSelector<RootState, CollectionsQueryType>(
    searchQueryResult
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
            currentLayout={currentLayout}
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
