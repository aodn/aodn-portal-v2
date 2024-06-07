import ResultPanelSimpleFilter from "../../../components/common/filters/ResultPanelSimpleFilter";
import { Grid } from "@mui/material";
import {
  CollectionsQueryType,
  OGCCollection,
} from "../../../components/common/store/searchReducer";
import React, { useContext } from "react";
import ResultCards from "../../../components/result/ResultCards";

enum SearchResultLayoutEnum {
  GRID = "GRID",
  LIST = "LIST",
  MAP = "MAP",
}

interface SearchResultListProps {
  resultLayout: SearchResultLayoutEnum;
  contents: CollectionsQueryType;
  onRemoveLayer: (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    collection: OGCCollection
  ) => void;
}

const ResultSection: React.FC<SearchResultListProps> = ({
  resultLayout,
  contents,
  onRemoveLayer,
}) => {
  return (
    <Grid
      item
      sx={{
        width: "700px",
        display: resultLayout !== SearchResultLayoutEnum.MAP ? "block" : "none",
      }}
      data-testid="search-page-result-list"
    >
      <ResultPanelSimpleFilter />
      <ResultCards
        resultLayout={resultLayout}
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
