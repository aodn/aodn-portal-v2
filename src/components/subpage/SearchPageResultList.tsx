import ResultPanelSimpleFilter from "../common/filters/ResultPanelSimpleFilter";
import { Grid } from "@mui/material";
import {
  CollectionsQueryType,
  OGCCollection,
} from "../common/store/searchReducer";
import React from "react";
import ResultCards from "../result/ResultCards";

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

const SearchPageResultList: React.FC<SearchResultListProps> = ({
  layout,
  setLayout,
  setIsShowingResult,
  contents,
  onRemoveLayer,
}) => {
  return (
    <Grid item sx={{ width: "700px" }}>
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
export default SearchPageResultList;
