import ResultPanelSimpleFilter from "../../../components/common/filters/ResultPanelSimpleFilter";
import { Grid } from "@mui/material";
import { CollectionsQueryType } from "../../../components/common/store/searchReducer";
import React, { useCallback, useState } from "react";
import ResultCards from "../../../components/result/ResultCards";
import { SearchResultLayoutEnum } from "../../../components/common/buttons/MapListToggleButton";
import { OGCCollection } from "../../../components/common/store/OGCCollectionDefinitions";

interface SearchResultListProps {
  visibility: SearchResultLayoutEnum;
  contents: CollectionsQueryType;
  onRemoveLayer?: (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    collection: OGCCollection | undefined
  ) => void;
  onVisibilityChanged?: (v: SearchResultLayoutEnum) => void;
  onClickCard?: (uuid: string) => void;
  datasetSelected?: OGCCollection[];
}

const ResultSection: React.FC<SearchResultListProps> = ({
  visibility,
  contents,
  onRemoveLayer,
  onVisibilityChanged,
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
    <Grid
      item
      sx={{
        width: "700px",
        height: "81vh",
        overflow: "hidden",
        display:
          visibility === SearchResultLayoutEnum.VISIBLE ? "block" : "none",
      }}
      data-testid="search-page-result-list"
    >
      <ResultPanelSimpleFilter onChangeLayout={onChangeLayout} />
      <ResultCards
        layout={currentLayout}
        contents={contents}
        onRemoveLayer={undefined}
        onDownload={undefined}
        onTags={undefined}
        onMore={undefined}
        onClickCard={onClickCard}
        datasetsSelected={datasetSelected}
      />
    </Grid>
  );
};

export default ResultSection;
