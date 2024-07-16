import React, { useCallback } from "react";
import {
  CollectionsQueryType,
  OGCCollection,
} from "../common/store/searchReducer";
import { FixedSizeList, ListChildComponentProps } from "react-window";
import { Box, Grid, ListItem, Stack } from "@mui/material";
import GridResultCard from "./GridResultCard";
import ListResultCard from "./ListResultCard";
import { SearchResultLayoutEnum } from "../common/buttons/MapListToggleButton";

interface ResultCardsProps {
  contents: CollectionsQueryType;
  layout?: SearchResultLayoutEnum;
  onRemoveLayer:
    | ((
        event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
        stac: OGCCollection | undefined
      ) => void)
    | undefined;
  onDownload:
    | ((
        event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
        stac: OGCCollection | undefined
      ) => void)
    | undefined;
  onTags:
    | ((
        event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
        stac: OGCCollection
      ) => void)
    | undefined;
  onMore:
    | ((
        event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
        stac: OGCCollection
      ) => void)
    | undefined;
  onClickCard: ((uuid: string) => void) | undefined;
  datasetsSelected?: OGCCollection[];
}

const renderCells = (
  props: ResultCardsProps,
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
            content={props.contents.result.collections[leftIndex]}
            onRemoveLayer={props.onRemoveLayer}
            onDownload={props.onDownload}
            onClickCard={props.onClickCard}
            data-testid="result-cards-grid"
          />
        </Grid>
        <Grid item xs={6}>
          <GridResultCard
            content={props.contents.result.collections[rightIndex]}
            onRemoveLayer={props.onRemoveLayer}
            onDownload={props.onDownload}
            onClickCard={props.onClickCard}
          />
        </Grid>
      </Grid>
    </ListItem>
  );
};

const renderRows = (
  props: ResultCardsProps,
  child: ListChildComponentProps
) => {
  // The style must pass to the listitem else incorrect rendering
  const { index, style } = child;

  return (
    <ListItem sx={{ pl: 0, pr: 0 }} style={style}>
      <ListResultCard
        content={props.contents.result.collections[index]}
        onRemoveLayer={props.onRemoveLayer}
        onDownload={props.onDownload}
        onTags={props.onTags}
        onMore={props.onMore}
        onClickCard={props.onClickCard}
      />
    </ListItem>
  );
};

const ResultCards = (props: ResultCardsProps) => {
  const hasSelectedDatasets =
    props.datasetsSelected && props.datasetsSelected.length > 0;

  const renderDatasetSelectedGridCards = useCallback(() => {
    if (!hasSelectedDatasets) return;
    return (
      <Stack
        direction="row"
        flexWrap="wrap"
        gap={1}
        sx={{ height: "305px", overflowY: "auto" }}
      >
        {props.datasetsSelected?.map((dataset, index) => (
          <Box key={index} width="327px" height="300px">
            <GridResultCard
              content={dataset}
              onRemoveLayer={props.onRemoveLayer}
              onDownload={props.onDownload}
              onClickCard={props.onClickCard}
              isSelectedDataset
            />
          </Box>
        ))}
      </Stack>
    );
  }, [
    hasSelectedDatasets,
    props.datasetsSelected,
    props.onClickCard,
    props.onDownload,
    props.onRemoveLayer,
  ]);

  const renderDatasetSelectedListCards = useCallback(() => {
    if (!hasSelectedDatasets) return;
    return (
      <Stack
        direction="column"
        gap={1}
        sx={{ maxHeight: "260px", overflowY: "auto" }}
      >
        {props.datasetsSelected?.map((dataset, index) => (
          <ListResultCard
            key={index}
            content={dataset}
            onRemoveLayer={props.onRemoveLayer}
            onDownload={props.onDownload}
            onClickCard={props.onClickCard}
            isSelectedDataset
          />
        ))}
      </Stack>
    );
  }, [
    hasSelectedDatasets,
    props.datasetsSelected,
    props.onClickCard,
    props.onDownload,
    props.onRemoveLayer,
  ]);

  if (props.layout === SearchResultLayoutEnum.LIST) {
    return (
      <>
        {hasSelectedDatasets && renderDatasetSelectedListCards()}
        <FixedSizeList
          height={1500}
          width={"100%"}
          itemSize={260}
          itemCount={props.contents.result.collections.length}
          overscanCount={10}
        >
          {(child: ListChildComponentProps) => renderRows(props, child)}
        </FixedSizeList>
      </>
    );
  } else {
    // or else render grid view
    return (
      <>
        {hasSelectedDatasets && renderDatasetSelectedGridCards()}
        <FixedSizeList
          height={1500}
          width={"100%"}
          itemSize={310}
          itemCount={Math.ceil(props.contents.result.collections.length / 2)}
          overscanCount={10}
        >
          {(child: ListChildComponentProps) => renderCells(props, child)}
        </FixedSizeList>
      </>
    );
  }
};

export default ResultCards;
