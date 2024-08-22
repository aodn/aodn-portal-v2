import ResultPanelSimpleFilter from "../../../components/common/filters/ResultPanelSimpleFilter";
import { Box, SxProps, Theme } from "@mui/material";
import { CollectionsQueryType } from "../../../components/common/store/searchReducer";
import React, { useCallback, useState } from "react";
import ResultCards from "../../../components/result/ResultCards";
import { SearchResultLayoutEnum } from "../../../components/common/buttons/MapListToggleButton";
import { SortResultEnum } from "../../../components/common/buttons/SortButton";
import { OGCCollection } from "../../../components/common/store/OGCCollectionDefinitions";
import { useSelector } from "react-redux";
import {
  RootState,
  searchQueryResult,
} from "../../../components/common/store/store";

interface SearchResultListProps {
  datasetSelected?: OGCCollection[];
  sx?: SxProps<Theme>;
  onVisibilityChanged?: (v: SearchResultLayoutEnum) => void;
  onChangeSorting: (v: SortResultEnum) => void;
  onClickCard?: (uuid: string) => void;
}

const ResultSection: React.FC<SearchResultListProps> = ({
  datasetSelected,
  sx,
  onVisibilityChanged,
  onChangeSorting,
  onClickCard,
}) => {
  // Use to remember last layout, it is either LIST or GRID at the moment
  const [currentLayout, setCurrentLayout] = useState<
    SearchResultLayoutEnum.LIST | SearchResultLayoutEnum.GRID
  >(SearchResultLayoutEnum.LIST);

  // Get contents when no more navigate needed.
  const contents = useSelector<RootState, CollectionsQueryType>(
    searchQueryResult
  );

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
    contents && (
      <Box
        sx={{ ...sx, display: "flex", flexDirection: "column" }}
        data-testid="search-page-result-list"
      >
        <Box sx={{ height: "50px" }}>
          <ResultPanelSimpleFilter
            count={contents.result.collections.length}
            total={contents.result.total}
            onChangeLayout={onChangeLayout}
            onChangeSorting={onChangeSorting}
          />
        </Box>
        <Box sx={{ flex: 1 }}>
          <ResultCards
            layout={currentLayout}
            contents={contents}
            onDownload={undefined}
            onTags={undefined}
            onMore={undefined}
            onClickCard={onClickCard}
            datasetsSelected={datasetSelected}
          />
        </Box>
      </Box>
    )
  );
};

export default ResultSection;
