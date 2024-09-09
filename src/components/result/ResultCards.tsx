import React, { useCallback, useRef } from "react";
import { CollectionsQueryType } from "../common/store/searchReducer";
import { FixedSizeList, ListChildComponentProps } from "react-window";
import { Box, Grid, ListItem, Stack, SxProps, Theme } from "@mui/material";
import GridResultCard from "./GridResultCard";
import ListResultCard from "./ListResultCard";
import { OGCCollection } from "../common/store/OGCCollectionDefinitions";
import AutoSizer, { Size } from "react-virtualized-auto-sizer";
import DetailSubtabBtn from "../common/buttons/DetailSubtabBtn";
import { SearchResultLayoutEnum } from "../common/buttons/MapViewButton";
import { LIST_CARD_GAP, LIST_CARD_HEIGHT } from "./constants";
import { gap, padding } from "../../styles/constants";

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
  onDetail?: (uuid: string) => void;
  onClickCard: ((uuid: string) => void) | undefined;
  onFetchMore?: (() => void) | undefined;
  datasetsSelected?: OGCCollection[];
}

const GRID_ITEM_SIZE = 310;

const ResultCards = ({
  contents,
  layout,
  sx,
  datasetsSelected,
  onClickCard,
  onDownload,
  onMore,
  onTags,
  onDetail,
  onFetchMore,
}: ResultCardsProps) => {
  const componentRef = useRef<HTMLDivElement | null>(null);
  const hasSelectedDatasets = datasetsSelected && datasetsSelected.length > 0;

  const count = contents.result.collections.length;
  const total = contents.result.total;

  const renderDatasetSelectedGridCards = useCallback(() => {
    if (!hasSelectedDatasets) return;
    return (
      <Stack
        direction="row"
        flexWrap="wrap"
        gap={1}
        sx={{ width: "100%", overflowY: "auto" }}
      >
        {datasetsSelected?.map((dataset, index) => (
          <Box key={index} width="49%" height="300px">
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
      <Box height={LIST_CARD_HEIGHT - LIST_CARD_GAP * 2} mb={gap.lg}>
        <ListResultCard
          content={datasetsSelected[0]}
          onDownload={onDownload}
          onDetail={onDetail}
          onClickCard={onClickCard}
          isSelectedDataset
        />
      </Box>
    );
  }, [
    hasSelectedDatasets,
    datasetsSelected,
    onDownload,
    onDetail,
    onClickCard,
  ]);

  const renderLoadMoreButton = useCallback(() => {
    return (
      <DetailSubtabBtn
        title="Show more results"
        isBordered={false}
        navigate={() => {
          onFetchMore && onFetchMore();
        }}
      />
    );
  }, [onFetchMore]);

  const renderCells = useCallback(
    (
      { contents, onDownload, onClickCard }: ResultCardsProps,
      child: ListChildComponentProps
    ) => {
      const { index, style } = child;

      const leftIndex = index * 2;
      const rightIndex = leftIndex + 1;

      if (leftIndex >= count && leftIndex <= total) {
        // We need to display load more button/placeholder in the last index place
        return (
          <ListItem
            sx={{
              display: "flex",
              alignItems: "flex-start", // Aligns the Box to the top of the ListItem
              justifyContent: "center", // Centers the Box horizontally
            }}
            style={style}
          >
            {renderLoadMoreButton()}
          </ListItem>
        );
      } else {
        return (
          <ListItem sx={{ pl: 0, pr: 0 }} style={style}>
            <Grid container spacing={1}>
              <Grid item xs={6}>
                <GridResultCard
                  content={contents.result.collections[leftIndex]}
                  onDownload={onDownload}
                  onClickCard={onClickCard}
                />
              </Grid>
              {rightIndex < contents.result.collections.length && (
                <Grid item xs={6}>
                  <GridResultCard
                    content={contents.result.collections[rightIndex]}
                    onDownload={onDownload}
                    onClickCard={onClickCard}
                  />
                </Grid>
              )}
            </Grid>
          </ListItem>
        );
      }
    },
    [count, renderLoadMoreButton, total]
  );

  const renderRows = useCallback(
    (
      {
        contents,
        onClickCard,
        onDownload,
        onMore,
        onTags,
        onDetail,
      }: ResultCardsProps,
      child: ListChildComponentProps
    ) => {
      // The style must pass to the listitem else incorrect rendering
      const { index, style } = child;

      if (index === count && index < total) {
        // We need to display load more button/placeholder in the last index place
        return (
          <ListItem
            sx={{
              display: "flex",
              alignItems: "flex-start", // Aligns the Box to the top of the ListItem
              justifyContent: "center", // Centers the Box horizontally
            }}
            style={style}
          >
            {renderLoadMoreButton()}
          </ListItem>
        );
      } else {
        return (
          <ListItem sx={{ p: 0, pb: padding.small }} style={style}>
            <ListResultCard
              content={contents.result.collections[index]}
              onDownload={onDownload}
              onTags={onTags}
              onMore={onMore}
              onDetail={onDetail}
              onClickCard={onClickCard}
            />
          </ListItem>
        );
      }
    },
    [count, renderLoadMoreButton, total]
  );

  // You must set the height to 100% of view height so the calculation
  // logic .clentHeight.height have values. In short it fill the
  // whole area.
  // *** We need to dsiplay the load more button, hence item count + 1 ***
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
              height={hasSelectedDatasets ? height - LIST_CARD_HEIGHT : height}
              width={width}
              itemSize={LIST_CARD_HEIGHT}
              itemCount={count + 1}
            >
              {(child: ListChildComponentProps) =>
                renderRows(
                  {
                    contents,
                    onClickCard,
                    onDownload,
                    onMore,
                    onDetail,
                    onTags,
                  },
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
              height={hasSelectedDatasets ? height - GRID_ITEM_SIZE : height}
              width={width}
              itemSize={GRID_ITEM_SIZE}
              itemCount={Math.ceil(count / 2) + 1}
            >
              {(child: ListChildComponentProps) =>
                renderCells(
                  { contents, onDownload, onDetail, onClickCard },
                  child
                )
              }
            </FixedSizeList>
          )}
        </AutoSizer>
      </Box>
    );
  }
};

export default ResultCards;
