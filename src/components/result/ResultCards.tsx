import React, { useCallback, useRef } from "react";
import { CollectionsQueryType } from "../common/store/searchReducer";
import { FixedSizeList, ListChildComponentProps } from "react-window";
import { Box, Grid, ListItem, SxProps, Theme } from "@mui/material";
import GridResultCard from "./GridResultCard";
import ListResultCard from "./ListResultCard";
import { OGCCollection } from "../common/store/OGCCollectionDefinitions";
import AutoSizer, { Size } from "react-virtualized-auto-sizer";
import DetailSubtabBtn from "../common/buttons/DetailSubtabBtn";
import { SearchResultLayoutEnum } from "../common/buttons/MapViewButton";
import { GRID_CARD_HEIGHT, LIST_CARD_GAP, LIST_CARD_HEIGHT } from "./constants";
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
  onDetail?: (uuid: string) => void;
  onClickCard: ((uuid: string) => void) | undefined;
  onFetchMore?: (() => void) | undefined;
  datasetsSelected?: OGCCollection[];
}

const renderDatasetSelectedListCards = (
  hasSelectedDatasets: boolean,
  collection: OGCCollection,
  onDownload:
    | ((
        event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
        stac: OGCCollection | undefined
      ) => void)
    | undefined,
  onClickCard: ((uuid: string) => void) | undefined,
  onDetail?: (uuid: string) => void
) => {
  if (!hasSelectedDatasets) return;
  return (
    <Box height={LIST_CARD_HEIGHT - LIST_CARD_GAP * 2} mb={gap.lg}>
      <ListResultCard
        content={collection}
        onDownload={onDownload}
        onDetail={onDetail}
        onClickCard={onClickCard}
        isSelectedDataset
      />
    </Box>
  );
};

// For now only one dataset can be selected at a time, so use datasetsSelected[0] for selected list/grid card
const renderDatasetSelectedGridCards = (
  hasSelectedDatasets: boolean,
  collection: OGCCollection,
  onDownload:
    | ((
        event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
        stac: OGCCollection | undefined
      ) => void)
    | undefined,
  onClickCard: ((uuid: string) => void) | undefined,
  onDetail?: (uuid: string) => void
) => {
  if (!hasSelectedDatasets) return;
  return (
    <Box
      width={"calc(50% - 7px)"}
      height={GRID_CARD_HEIGHT - LIST_CARD_GAP}
      mb={gap.lg}
    >
      <GridResultCard
        content={collection}
        onDownload={onDownload}
        onClickCard={onClickCard}
        onDetail={onDetail}
        isSelectedDataset
      />
    </Box>
  );
};

const ResultCards = ({
  contents,
  layout,
  sx,
  datasetsSelected,
  onClickCard,
  onDownload,
  onDetail,
  onFetchMore,
}: ResultCardsProps) => {
  const componentRef = useRef<HTMLDivElement | null>(null);

  const hasSelectedDatasets = datasetsSelected && datasetsSelected.length > 0;

  const count = contents.result.collections.length;
  const total = contents.result.total;

  const renderLoadMoreButton = useCallback(() => {
    return (
      <DetailSubtabBtn
        id="result-card-load-more-btn"
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
      count: number,
      total: number,
      { contents, onClickCard, onDownload, onDetail }: ResultCardsProps,
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
          <ListItem sx={{ p: 0, pb: padding.small }} style={style}>
            <Grid container height="100%">
              <Grid item xs={6} sx={{ pr: 0.5 }}>
                <GridResultCard
                  content={contents.result.collections[leftIndex]}
                  onDownload={onDownload}
                  onClickCard={onClickCard}
                  onDetail={onDetail}
                />
              </Grid>
              {rightIndex < contents.result.collections.length && (
                <Grid item xs={6} sx={{ pl: 0.5 }}>
                  <GridResultCard
                    content={contents.result.collections[rightIndex]}
                    onDownload={onDownload}
                    onClickCard={onClickCard}
                    onDetail={onDetail}
                  />
                </Grid>
              )}
            </Grid>
          </ListItem>
        );
      }
    },
    [renderLoadMoreButton]
  );

  const renderRows = useCallback(
    (
      count: number,
      total: number,
      { contents, onClickCard, onDownload, onDetail }: ResultCardsProps,
      child: ListChildComponentProps
    ) => {
      // The style must pass to the listitem else incorrect rendering
      const { index, style } = child;

      if (index === count && index < total) {
        // We need to display load more button/placeholder in the last index place
        return (
          <ListItem
            id="result-card-load-more-btn"
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
              onDetail={onDetail}
              onClickCard={onClickCard}
            />
          </ListItem>
        );
      }
    },
    [renderLoadMoreButton]
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
        {hasSelectedDatasets &&
          renderDatasetSelectedListCards(
            hasSelectedDatasets,
            datasetsSelected[0],
            onDownload,
            onClickCard,
            onDetail
          )}
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
                  count,
                  total,
                  {
                    contents,
                    onClickCard,
                    onDownload,
                    onDetail,
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
        {hasSelectedDatasets &&
          renderDatasetSelectedGridCards(
            hasSelectedDatasets,
            datasetsSelected[0],
            onDownload,
            onClickCard,
            onDetail
          )}
        <AutoSizer>
          {({ height, width }: Size) => (
            <FixedSizeList
              height={hasSelectedDatasets ? height - GRID_CARD_HEIGHT : height}
              width={width}
              itemSize={GRID_CARD_HEIGHT}
              itemCount={Math.ceil(count / 2) + 1}
            >
              {(child: ListChildComponentProps) =>
                renderCells(
                  count,
                  total,
                  {
                    contents,
                    onClickCard,
                    onDownload,
                    onDetail,
                  },
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
