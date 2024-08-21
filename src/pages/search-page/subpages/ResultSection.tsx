import ResultPanelSimpleFilter from "../../../components/common/filters/ResultPanelSimpleFilter";
import { Box } from "@mui/material";
import { CollectionsQueryType } from "../../../components/common/store/searchReducer";
import React, { useCallback, useState } from "react";
import ResultCards from "../../../components/result/ResultCards";
import { SearchResultLayoutEnum } from "../../../components/common/buttons/MapListToggleButton";
import { SortResultEnum } from "../../../components/common/buttons/SortButton";
import { OGCCollection } from "../../../components/common/store/OGCCollectionDefinitions";

interface SearchResultListProps {
  visibility: SearchResultLayoutEnum;
  contents: CollectionsQueryType;
  onVisibilityChanged?: (v: SearchResultLayoutEnum) => void;
  onChangeSorting: (v: SortResultEnum) => void;
  onClickCard?: (uuid: string) => void;
  datasetSelected?: OGCCollection[];
}

const ResultSection: React.FC<SearchResultListProps> = ({
  visibility,
  contents,
  onVisibilityChanged,
  onChangeSorting,
  onClickCard,
  datasetSelected,
}) => {
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
    <Box
      sx={{
        maxHeight: "85vh",
        overflow: "hidden",
        display:
          visibility === SearchResultLayoutEnum.VISIBLE ? "block" : "none",
      }}
      data-testid="search-page-result-list"
    >
      <ResultPanelSimpleFilter
        count={contents.result.collections.length}
        total={contents.result.total}
        onChangeLayout={onChangeLayout}
        onChangeSorting={onChangeSorting}
      />
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
  );
};

export default ResultSection;
