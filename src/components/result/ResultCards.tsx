import React, { useCallback, useEffect, useRef, useState } from "react";
import { CollectionsQueryType } from "../common/store/searchReducer";
import { FixedSizeList, ListChildComponentProps } from "react-window";
import { Box, Grid, ListItem, Stack, SxProps, Theme } from "@mui/material";
import GridResultCard from "./GridResultCard";
import ListResultCard from "./ListResultCard";
import { SearchResultLayoutEnum } from "../common/buttons/MapListToggleButton";
import { OGCCollection } from "../common/store/OGCCollectionDefinitions";
import AutoSizer, { Size } from "react-virtualized-auto-sizer";

interface ResultCardsProps {
  contents: CollectionsQueryType;
  layout?: SearchResultLayoutEnum;
  sx?: SxProps<Theme>;
  onDownload:
    | ((
        event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
        stac: OGCCollection | undefined
      ) => void)
    | undefined;
  onTags?:
    | ((
        event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
        stac: OGCCollection
      ) => void)
    | undefined;
  onMore?:
    | ((
        event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
        stac: OGCCollection
      ) => void)
    | undefined;
  onClickCard: ((uuid: string) => void) | undefined;
  datasetsSelected?: OGCCollection[];
}

const renderCells = (
  { contents, onDownload, onClickCard }: ResultCardsProps,
  child: ListChildComponentProps
) => {
  const { index, style } = child;

  const leftIndex = index * 2;
  const rightIndex = leftIndex + 1;

  return (
    <ListItem sx={{ pl: 0, pr: 0 }} style={style}>
      <Grid container spacing={1}>
        <Grid item xs={6}>
          <GridResultCard
            content={contents.result.collections[leftIndex]}
            onDownload={onDownload}
            onClickCard={onClickCard}
            data-testid="result-cards-grid"
          />
        </Grid>
        <Grid item xs={6}>
          <GridResultCard
            content={contents.result.collections[rightIndex]}
            onDownload={onDownload}
            onClickCard={onClickCard}
          />
        </Grid>
      </Grid>
    </ListItem>
  );
};

const renderRows = (
  { contents, onClickCard, onDownload, onMore, onTags }: ResultCardsProps,
  child: ListChildComponentProps
) => {
  // The style must pass to the listitem else incorrect rendering
  const { index, style } = child;

  return (
    <ListItem sx={{ pl: 0, pr: 0 }} style={style}>
      <ListResultCard
        content={contents.result.collections[index]}
        onDownload={onDownload}
        onTags={onTags}
        onMore={onMore}
        onClickCard={onClickCard}
      />
    </ListItem>
  );
};

const ResultCards = ({
  contents,
  layout,
  sx,
  datasetsSelected,
  onClickCard,
  onDownload,
  onMore,
  onTags,
}: ResultCardsProps) => {
  const componentRef = useRef<HTMLDivElement | null>(null);
  const [height, setHeight] = useState<number>(0);

  const hasSelectedDatasets = datasetsSelected && datasetsSelected.length > 0;

  const renderDatasetSelectedGridCards = useCallback(() => {
    if (!hasSelectedDatasets) return;
    return (
      <Stack
        direction="row"
        flexWrap="wrap"
        gap={1}
        sx={{ width: "100%", height: "305px", overflowY: "auto" }}
      >
        {datasetsSelected?.map((dataset, index) => (
          <Box key={index} width="100%" height="300px">
            <GridResultCard
              content={dataset}
              onDownload={onDownload}
              onClickCard={onClickCard}
              isSelectedDataset
            />
          </Box>
        ))}
      </Stack>
    );
  }, [hasSelectedDatasets, datasetsSelected, onClickCard, onDownload]);

  const renderDatasetSelectedListCards = useCallback(() => {
    if (!hasSelectedDatasets) return;
    return (
      <Stack
        direction="column"
        gap={1}
        sx={{ width: "100%", maxHeight: "260px", overflowY: "auto" }}
      >
        {datasetsSelected?.map((dataset, index) => (
          <ListResultCard
            key={index}
            content={dataset}
            onDownload={onDownload}
            onClickCard={onClickCard}
            isSelectedDataset
          />
        ))}
      </Stack>
    );
  }, [hasSelectedDatasets, datasetsSelected, onClickCard, onDownload]);
  // You must set the height to 100% of view height so the calculation
  // logic .clentHeight.height have values. In short it fill the
  // whole area.
  if (layout === SearchResultLayoutEnum.LIST) {
    return (
      <Box
        sx={{ ...sx, height: "100%" }}
        ref={componentRef}
        data-testid="resultcard-result-list"
      >
        {hasSelectedDatasets && renderDatasetSelectedListCards()}
        <AutoSizer>
          {({ height, width }: Size) => (
            <FixedSizeList
              height={hasSelectedDatasets ? height - 250 : height}
              width={width}
              itemSize={250}
              itemCount={contents.result.collections.length}
            >
              {(child: ListChildComponentProps) =>
                renderRows(
                  { contents, onClickCard, onDownload, onMore, onTags },
                  child
                )
              }
            </FixedSizeList>
          )}
        </AutoSizer>
      </Box>
    );
  } else {
    // or else render grid view
    return (
      <Box
        sx={{ ...sx, height: "100%" }}
        ref={componentRef}
        data-testid="resultcard-result-grid"
      >
        {hasSelectedDatasets && renderDatasetSelectedGridCards()}
        <AutoSizer>
          {({ height, width }: Size) => (
            <FixedSizeList
              height={hasSelectedDatasets ? height - 310 : height}
              width={width}
              itemSize={310}
              itemCount={Math.ceil(contents.result.collections.length / 2)}
            >
              {(child: ListChildComponentProps) =>
                renderCells({ contents, onDownload, onClickCard }, child)
              }
            </FixedSizeList>
          )}
        </AutoSizer>
      </Box>
    );
  }
};

export default ResultCards;
