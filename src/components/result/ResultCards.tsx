import { FC, useCallback, useEffect, useMemo, useRef } from "react";
import { FixedSizeList, ListChildComponentProps } from "react-window";
import AutoSizer, { Size } from "react-virtualized-auto-sizer";
import { Box, Grid, ListItem, SxProps } from "@mui/material";
import {
  CollectionsQueryType,
  DEFAULT_SEARCH_PAGE_SIZE,
  FULL_LIST_PAGE_SIZE,
} from "../common/store/searchReducer";
import useTabNavigation from "../../hooks/useTabNavigation";
import GridResultCard from "./GridResultCard";
import ListResultCard from "./ListResultCard";
import { OGCCollection } from "../common/store/OGCCollectionDefinitions";
import DetailSubtabBtn from "../common/buttons/DetailSubtabBtn";
import { SearchResultLayoutEnum } from "../common/buttons/ResultListLayoutButton";
import { GRID_CARD_HEIGHT, LIST_CARD_HEIGHT } from "./constants";
import { padding } from "../../styles/constants";
import useFetchData from "../../hooks/useFetchData";
import { BookmarkButtonBasicType } from "../bookmark/BookmarkButton";

export interface ResultCard extends Partial<BookmarkButtonBasicType> {
  content?: OGCCollection;
  onClickCard?: (item: OGCCollection | undefined) => void;
  onClickDetail?: (uuid: string) => void;
  onClickDownload?: (uuid: string) => void;
  onClickLinks?: (uuid: string) => void;
  selectedUuid?: string;
  sx?: SxProps;
}

interface ResultCardsListType extends ResultCard {
  count: number;
  total: number;
  contents: CollectionsQueryType;
  renderLoadMoreButton: () => JSX.Element;
  child: ListChildComponentProps;
}

export interface ResultCardsType extends Partial<BookmarkButtonBasicType> {
  layout:
    | Exclude<SearchResultLayoutEnum, SearchResultLayoutEnum.FULL_MAP>
    | undefined;
  contents: CollectionsQueryType;
  onClickCard: ((item: OGCCollection | undefined) => void) | undefined;
  selectedUuids: string[] | undefined;
  sx?: SxProps;
}
interface ResultCardsProps extends ResultCardsType {}

const renderGridView: FC<ResultCardsListType> = ({
  count,
  total,
  contents,
  onClickCard,
  onClickDetail,
  onClickLinks,
  onClickDownload,
  onClickBookmark,
  checkIsBookmarked,
  renderLoadMoreButton,
  selectedUuid,
  child,
}) => {
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
              onClickBookmark={onClickBookmark}
              checkIsBookmarked={checkIsBookmarked}
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
                onClickBookmark={onClickBookmark}
                checkIsBookmarked={checkIsBookmarked}
                selectedUuid={selectedUuid}
              />
            </Grid>
          )}
        </Grid>
      </ListItem>
    );
  }
};

const renderListView: FC<ResultCardsListType> = ({
  count,
  total,
  contents,
  onClickCard,
  onClickDetail,
  onClickLinks,
  onClickDownload,
  onClickBookmark,
  checkIsBookmarked,
  renderLoadMoreButton,
  selectedUuid,
  child,
}) => {
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
          onClickBookmark={onClickBookmark}
          checkIsBookmarked={checkIsBookmarked}
          selectedUuid={selectedUuid}
        />
      </ListItem>
    );
  }
};

const renderFullListView: FC<Partial<ResultCardsListType>> = ({
  sx = {} as SxProps,
  contents,
  count,
  total,
  renderLoadMoreButton,
  onClickCard,
  onClickDetail,
  onClickLinks,
  onClickDownload,
  onClickBookmark,
  checkIsBookmarked,
  selectedUuid,
}) => {
  if (!count || !total || !contents) return;
  return (
    <Box sx={{ ...sx }}>
      <Grid container spacing={1}>
        {contents.result.collections.map((collection) => (
          <Grid item xs={12} md={6} lg={4} key={collection.id}>
            <ListResultCard
              content={collection}
              onClickCard={onClickCard}
              onClickDetail={onClickDetail}
              onClickLinks={onClickLinks}
              onClickDownload={onClickDownload}
              onClickBookmark={onClickBookmark}
              checkIsBookmarked={checkIsBookmarked}
              selectedUuid={selectedUuid}
            />
          </Grid>
        ))}
        {renderLoadMoreButton && count < total && (
          <Grid item xs={12} sx={{ display: "flex", justifyContent: "center" }}>
            {renderLoadMoreButton()}
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

const ResultCards: FC<ResultCardsProps> = ({
  layout,
  contents,
  onClickCard,
  onClickBookmark,
  checkIsBookmarked,
  sx,
  selectedUuids,
}) => {
  const componentRef = useRef<HTMLDivElement | null>(null);

  const goToDetailPage = useTabNavigation();

  const { fetchMore } = useFetchData();

  const loadMoreResults = useCallback(
    () =>
      fetchMore(
        layout === SearchResultLayoutEnum.FULL_LIST
          ? FULL_LIST_PAGE_SIZE
          : DEFAULT_SEARCH_PAGE_SIZE
      ),
    [fetchMore, layout]
  );

  const count = useMemo(
    () => contents.result.collections.length,
    [contents.result.collections.length]
  );

  const total = useMemo(() => contents.result.total, [contents.result.total]);

  const selectedUuid = useMemo(
    () => selectedUuids && selectedUuids[0],
    [selectedUuids]
  );

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

  // Fetching more data for full list view if the initial records less than 20
  useEffect(() => {
    if (
      layout === SearchResultLayoutEnum.FULL_LIST &&
      count < total &&
      count < 20
    ) {
      fetchMore(FULL_LIST_PAGE_SIZE);
    }
  }, [count, fetchMore, layout, total]);

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

  if (!contents) return;

  if (layout === SearchResultLayoutEnum.FULL_LIST) {
    return renderFullListView({
      sx,
      contents,
      count,
      total,
      renderLoadMoreButton,
      onClickCard,
      onClickDetail,
      onClickLinks,
      onClickDownload,
      onClickBookmark,
      checkIsBookmarked,
      selectedUuid,
    });
  } else if (layout === SearchResultLayoutEnum.GRID) {
    // You must set the height to 100% of view height so the calculation
    // logic .clentHeight.height have values. In short it fill the
    // whole area.
    // *** We need to dsiplay the load more button, hence item count + 1 ***
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
                renderGridView({
                  count,
                  total,
                  contents,
                  onClickCard,
                  onClickDetail,
                  onClickLinks,
                  onClickDownload,
                  renderLoadMoreButton,
                  onClickBookmark,
                  checkIsBookmarked,
                  selectedUuid,
                  child,
                })
              }
            </FixedSizeList>
          )}
        </AutoSizer>
      </Box>
    );
  } else {
    // default list view
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
                renderListView({
                  count,
                  total,
                  contents,
                  onClickCard,
                  onClickDetail,
                  onClickLinks,
                  onClickDownload,
                  onClickBookmark,
                  checkIsBookmarked,
                  renderLoadMoreButton,
                  selectedUuid,
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
