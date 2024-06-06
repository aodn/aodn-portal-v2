import ResultPanelSimpleFilter from "../../../components/common/filters/ResultPanelSimpleFilter";
import { Grid } from "@mui/material";
import {
  CollectionsQueryType,
  OGCCollection,
} from "../../../components/common/store/searchReducer";
import React, { useContext } from "react";
import ResultCards from "../../../components/result/ResultCards";
import { SearchResultLayoutContext } from "../SearchPage";

enum SearchResultLayoutEnum {
  GRID = "GRID",
  LIST = "LIST",
}

interface SearchResultListProps {
  contents: CollectionsQueryType;
  onRemoveLayer: (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    collection: OGCCollection
  ) => void;
}

const ResultSection: React.FC<SearchResultListProps> = ({
  contents,
  onRemoveLayer,
}) => {
  const { isShowingResult } = useContext(SearchResultLayoutContext);

  return (
    <Grid
      item
      sx={{ width: "700px", display: isShowingResult ? "block" : "none" }}
      data-testid="search-page-result-list"
    >
      <ResultPanelSimpleFilter />
      <ResultCards
        contents={contents}
        onRemoveLayer={onRemoveLayer}
        onDownload={undefined}
        onTags={undefined}
        onMore={undefined}
      />
    </Grid>
  );
};

export { SearchResultLayoutEnum };
export default ResultSection;
