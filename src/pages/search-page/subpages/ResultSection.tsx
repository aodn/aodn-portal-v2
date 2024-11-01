import { FC } from "react";
import { useSelector } from "react-redux";
import { Box, SxProps } from "@mui/material";
import { CollectionsQueryType } from "../../../components/common/store/searchReducer";
import ResultPanelSimpleFilter from "../../../components/common/filters/ResultPanelSimpleFilter";
import ResultCards from "../../../components/result/ResultCards";
import {
  RootState,
  searchQueryResult,
} from "../../../components/common/store/store";
import { SearchResultLayoutEnum } from "../../../components/common/buttons/ResultListLayoutButton";
import CircleLoader from "../../../components/loading/CircleLoader";
import { useSearchPageContext } from "../context/SearchPageContext";

interface ResultSectionProps {
  sx: SxProps;
}

const ResultSection: FC<ResultSectionProps> = ({ sx }) => {
  const reduxContents = useSelector<RootState, CollectionsQueryType>(
    searchQueryResult
  );

  const { selectedLayout, isLoading } = useSearchPageContext();

  if (selectedLayout === SearchResultLayoutEnum.FULL_MAP) return;

  return (
    reduxContents && (
      <Box
        sx={{
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
        <Box>
          <ResultPanelSimpleFilter />
        </Box>
        <Box sx={{ flex: 1 }}>
          <ResultCards />
        </Box>
      </Box>
    )
  );
};

export default ResultSection;
