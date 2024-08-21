import React, { useCallback, useEffect, useRef, useState } from "react";
import { CollectionsQueryType } from "../common/store/searchReducer";
import { FixedSizeList, ListChildComponentProps } from "react-window";
import { Box, Grid, ListItem, Stack } from "@mui/material";
import GridResultCard from "./GridResultCard";
import ListResultCard from "./ListResultCard";
import { SearchResultLayoutEnum } from "../common/buttons/MapListToggleButton";
import { OGCCollection } from "../common/store/OGCCollectionDefinitions";

interface ResultCardsProps {
  contents: CollectionsQueryType;
  layout?: SearchResultLayoutEnum;
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

const ResultCards = (props: ResultCardsProps) => {
  const componentRef = useRef<HTMLDivElement | null>(null);
  const [height, setHeight] = useState<number>(0);

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
  ]);
  // This block is use to get the height of this component and
  // use it to adjust the FixSizeList height
  useEffect(() => {
    const handleResize = () => {
      if (
        componentRef.current &&
        componentRef.current.getBoundingClientRect()
      ) {
        // Update height on resize
        setHeight(componentRef.current.getBoundingClientRect().height);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      // Clean up the event listener
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  // You must set the height to 100vh, 100% of view height to may the
  // div occupy the rest
  if (props.layout === SearchResultLayoutEnum.LIST) {
    return (
      <div
        ref={componentRef}
        style={{ height: "100vh" }}
        data-testid="resultcard-result-list"
      >
        {hasSelectedDatasets && renderDatasetSelectedListCards()}
        <FixedSizeList
          height={height}
          width={"100%"}
          itemSize={250}
          itemCount={props.contents.result.collections.length}
        >
          {(child: ListChildComponentProps) => renderRows(props, child)}
        </FixedSizeList>
      </div>
    );
  } else {
    // or else render grid view
    return (
      <div
        ref={componentRef}
        style={{ height: "100vh" }}
        data-testid="resultcard-result-grid"
      >
        {hasSelectedDatasets && renderDatasetSelectedGridCards()}
        <FixedSizeList
          height={height}
          width={"100%"}
          itemSize={310}
          itemCount={Math.ceil(props.contents.result.collections.length / 2)}
        >
          {(child: ListChildComponentProps) => renderCells(props, child)}
        </FixedSizeList>
      </div>
    );
  }
};

export default ResultCards;
