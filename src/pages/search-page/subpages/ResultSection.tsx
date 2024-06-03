import ResultPanelSimpleFilter from "../../../components/common/filters/ResultPanelSimpleFilter";
import { Grid } from "@mui/material";
import {
  CollectionsQueryType,
  OGCCollection,
} from "../../../components/common/store/searchReducer";
import React from "react";
import ResultCards from "../../../components/result/ResultCards";

enum SearchResultLayoutEnum {
  GRID = "GRID",
  LIST = "LIST",
}

interface SearchResultListProps {
  layout: SearchResultLayoutEnum;
  setLayout: (layout: SearchResultLayoutEnum) => void;
  setIsShowingResult: (value: boolean) => void;
  contents: CollectionsQueryType;
  onRemoveLayer: (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    collection: OGCCollection
  ) => void;
}

const ResultSection: React.FC<SearchResultListProps> = ({
  layout,
  setLayout,
  setIsShowingResult,
  contents,
  onRemoveLayer,
}) => {
  return (
    <Grid item sx={{ width: "700px" }} data-testid="search-page-result-list">
      <ResultPanelSimpleFilter
        layout={layout}
        setLayout={setLayout}
        setIsShowingResult={setIsShowingResult}
      />
      <ResultCards
        contents={contents}
        onRemoveLayer={onRemoveLayer}
        onDownload={undefined}
        onTags={undefined}
        onMore={undefined}
        layout={layout}
      />
    </Grid>
  );
};

export { SearchResultLayoutEnum };
export default ResultSection;
