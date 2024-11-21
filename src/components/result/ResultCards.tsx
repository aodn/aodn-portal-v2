import { useCallback, useMemo, useRef } from "react";
import {
  CollectionsQueryType,
  DEFAULT_SEARCH_PAGE,
} from "../common/store/searchReducer";
import { FixedSizeList, ListChildComponentProps } from "react-window";
import { Box, Grid, ListItem, SxProps, Theme } from "@mui/material";
import GridResultCard from "./GridResultCard";
import ListResultCard from "./ListResultCard";
import { OGCCollection } from "../common/store/OGCCollectionDefinitions";
import AutoSizer, { Size } from "react-virtualized-auto-sizer";
import DetailSubtabBtn from "../common/buttons/DetailSubtabBtn";
import { SearchResultLayoutEnum } from "../common/buttons/ResultListLayoutButton";
import { GRID_CARD_HEIGHT, LIST_CARD_HEIGHT } from "./constants";
import { padding } from "../../styles/constants";
import useTabNavigation from "../../hooks/useTabNavigation";
import useFetchData from "../../hooks/useFetchData";

export interface ResultCard {
  content?: OGCCollection;
  onClickCard?: (item: OGCCollection | undefined) => void;
  onClickDetail?: (uuid: string) => void;
  onClickDownload?: (uuid: string) => void;
  onClickLinks?: (uuid: string) => void;
  selectedUuid?: string;
  sx?: SxProps;
}

interface ResultCardsList extends ResultCard {
  count: number;
  total: number;
  contents: CollectionsQueryType;
  child: ListChildComponentProps;
}

interface ResultCardsProps {
  layout: Exclude<
    SearchResultLayoutEnum,
    SearchResultLayoutEnum.FULL_MAP
  > | null;
  contents: CollectionsQueryType;
  onClickCard: ((item: OGCCollection | undefined) => void) | undefined;
  selectedUuids: string[];
  sx?: SxProps<Theme>;
}

const ResultCards = ({
  layout,
  contents,
  onClickCard,
  sx,
  selectedUuids,
}: ResultCardsProps) => {
  const componentRef = useRef<HTMLDivElement | null>(null);

  const goToDetailPage = useTabNavigation();

  const { fetchMore } = useFetchData();

  const loadMoreResults = useCallback(
    () => fetchMore(DEFAULT_SEARCH_PAGE),
    [fetchMore]
  );

  const count = contents.result.collections.length;

  const total = contents.result.total;

  const selectedUuid = useMemo(() => selectedUuids[0], [selectedUuids]);

  const onClickDetail = useCallback(
    (uuid: string) => goToDetailPage(uuid, "abstract"),
    [goToDetailPage]
  );

  const onClickDownload = useCallback(
    (uuid: string) => goToDetailPage(uuid, "abstract", "download-section"),
    [goToDetailPage]
  );

  const onClickLinks = useCallback(
    (uuid: string) => goToDetailPage(uuid, "links"),
    [goToDetailPage]
  );

  const renderLoadMoreButton = useCallback(() => {
    return (
      <DetailSubtabBtn
        id="result-card-load-more-btn"
        title="Show more results"
        isBordered={false}
        onClick={loadMoreResults}
      />
    );
  }, [loadMoreResults]);

  const renderCells = useCallback(
    ({
      count,
      total,
      contents,
      onClickCard,
      onClickDetail,
      onClickLinks,
      onClickDownload,
      child,
    }: ResultCardsList) => {
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
            {count !== total ? renderLoadMoreButton() : null}
          </ListItem>
        );
      } else {
        return (
          <ListItem sx={{ p: 0, pb: padding.small }} style={style}>
            <Grid container height="100%">
              <Grid item xs={6} sx={{ pr: 0.5 }}>
                <GridResultCard
                  content={contents.result.collections[leftIndex]}
                  onClickCard={onClickCard}
                  onClickDetail={onClickDetail}
                  onClickLinks={onClickLinks}
                  onClickDownload={onClickDownload}
                  selectedUuid={selectedUuid}
                />
              </Grid>
              {rightIndex < contents.result.collections.length && (
                <Grid item xs={6} sx={{ pl: 0.5 }}>
                  <GridResultCard
                    content={contents.result.collections[rightIndex]}
                    onClickCard={onClickCard}
                    onClickDetail={onClickDetail}
                    onClickLinks={onClickLinks}
                    onClickDownload={onClickDownload}
                    selectedUuid={selectedUuid}
                  />
                </Grid>
              )}
            </Grid>
          </ListItem>
        );
      }
    },
    [renderLoadMoreButton, selectedUuid]
  );

  const renderRows = useCallback(
    ({
      count,
      total,
      contents,
      onClickCard,
      onClickDetail,
      onClickLinks,
      onClickDownload,
      child,
    }: ResultCardsList) => {
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
              onClickCard={onClickCard}
              onClickDetail={onClickDetail}
              onClickLinks={onClickLinks}
              onClickDownload={onClickDownload}
              selectedUuid={selectedUuid}
            />
          </ListItem>
        );
      }
    },
    [renderLoadMoreButton, selectedUuid]
  );

  if (!contents) return;

  // You must set the height to 100% of view height so the calculation
  // logic .clentHeight.height have values. In short it fill the
  // whole area.
  // *** We need to dsiplay the load more button, hence item count + 1 ***
  if (
    !layout ||
    layout === SearchResultLayoutEnum.LIST ||
    layout === SearchResultLayoutEnum.FULL_LIST
  ) {
    return (
      <Box
        sx={{ ...sx, height: "100%" }}
        ref={componentRef}
        data-testid="resultcard-result-list"
      >
        <AutoSizer>
          {({ height, width }: Size) => (
            <FixedSizeList
              height={height}
              width={width}
              itemSize={LIST_CARD_HEIGHT}
              itemCount={count + 1}
            >
              {(child: ListChildComponentProps) =>
                renderRows({
                  count,
                  total,
                  contents,
                  onClickCard,
                  onClickDetail,
                  onClickLinks,
                  onClickDownload,
                  child,
                })
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
        <AutoSizer>
          {({ height, width }: Size) => (
            <FixedSizeList
              height={height}
              width={width}
              itemSize={GRID_CARD_HEIGHT}
              itemCount={Math.ceil(count / 2) + 1}
            >
              {(child: ListChildComponentProps) =>
                renderCells({
                  count,
                  total,
                  contents,
                  onClickCard,
                  onClickDetail,
                  onClickLinks,
                  onClickDownload,
                  child,
                })
              }
            </FixedSizeList>
          )}
        </AutoSizer>
      </Box>
    );
  }
};

export default ResultCards;
