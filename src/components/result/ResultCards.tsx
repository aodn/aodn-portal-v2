import { FC, useCallback, useEffect, useMemo } from "react";
import { Box, Grid, SxProps } from "@mui/material";
import {
  CollectionsQueryType,
  DEFAULT_SEARCH_PAGE_SIZE,
  FULL_LIST_PAGE_SIZE,
} from "../common/store/searchReducer";
import useTabNavigation, { OpenType } from "../../hooks/useTabNavigation";
import GridResultCard from "./GridResultCard";
import ListResultCard from "./ListResultCard";
import { OGCCollection } from "../common/store/OGCCollectionDefinitions";
import DetailSubtabBtn from "../common/buttons/DetailSubtabBtn";
import { SearchResultLayoutEnum } from "../common/buttons/ResultListLayoutButton";
import useFetchData from "../../hooks/useFetchData";
import useBreakpoint from "../../hooks/useBreakpoint";
import { GRID_CARD_HEIGHT, LIST_CARD_HEIGHT } from "./constants";
import { detailPageDefault, pageReferer } from "../common/constants";

export interface ResultCardBasicType {
  content?: OGCCollection;
  onClickCard?: (item: OGCCollection | undefined) => void;
  onClickDetail?: (uuid: string, type?: OpenType) => void;
  onClickDownload?: (uuid: string, type?: OpenType) => void;
  onClickLinks?: (uuid: string, type?: OpenType) => void;
  selectedUuid?: string;
  sx?: SxProps;
  isSimplified?: boolean;
}

interface ResultCardsListType extends ResultCardBasicType {
  count: number;
  total: number;
  contents: CollectionsQueryType;
  renderLoadMoreButton: () => JSX.Element;
  layout?:
    | Exclude<SearchResultLayoutEnum, SearchResultLayoutEnum.FULL_MAP>
    | undefined;
}

export interface ResultCardsType {
  layout:
    | Exclude<SearchResultLayoutEnum, SearchResultLayoutEnum.FULL_MAP>
    | undefined;
  contents: CollectionsQueryType;
  onClickCard?: ((item: OGCCollection | undefined) => void) | undefined;
  onClickDetail?: ((uuid: string | undefined) => void) | undefined;
  onClickDownload?: ((uuid: string | undefined) => void) | undefined;
  onClickLinks?: ((uuid: string | undefined) => void) | undefined;
  selectedUuids: string[] | undefined;
}
interface ResultCardsProps extends ResultCardsType {
  sx?: SxProps;
}

const renderListCards: FC<ResultCardsListType> = ({
  sx = {} as SxProps,
  contents,
  count,
  total,
  renderLoadMoreButton,
  onClickCard,
  onClickDetail,
  onClickLinks,
  onClickDownload,
  selectedUuid,
  layout,
  isSimplified,
}) => {
  if (!count || !total || !contents) return;

  const isFullListView = layout === SearchResultLayoutEnum.FULL_LIST;

  return (
    <Box sx={sx} data-testid="resultcard-result-list">
      <Grid container spacing={1}>
        {contents.result.collections.map(
          (collection: OGCCollection, index: number) => (
            <Grid
              item
              xs={12}
              sm={6}
              md={isFullListView ? 6 : 12}
              key={index}
              sx={{
                // Must hardcode, else the box will expand if not enough height
                height: isSimplified ? "auto" : LIST_CARD_HEIGHT,
                maxHeight: LIST_CARD_HEIGHT,
              }}
            >
              <ListResultCard
                content={collection}
                onClickCard={onClickCard}
                onClickDetail={onClickDetail}
                onClickLinks={onClickLinks}
                onClickDownload={
                  collection.hasSummaryFeature() ? onClickDownload : undefined
                }
                selectedUuid={selectedUuid}
                isSimplified={isSimplified}
              />
            </Grid>
          )
        )}
        {renderLoadMoreButton && count < total && (
          <Grid item xs={12} sx={{ display: "flex", justifyContent: "center" }}>
            {renderLoadMoreButton()}
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

const renderGridCards: FC<ResultCardsListType> = ({
  sx = {} as SxProps,
  contents,
  count,
  total,
  renderLoadMoreButton,
  onClickCard,
  onClickDetail,
  onClickLinks,
  onClickDownload,
  selectedUuid,
  isSimplified,
}) => {
  if (!count || !total || !contents) return;

  return (
    <Box sx={sx} data-testid="resultcard-result-grid">
      <Grid container spacing={1}>
        {contents.result.collections.map(
          (collection: OGCCollection, index: number) => (
            <Grid
              item
              xs={6}
              sm={4}
              md={6}
              lg={6}
              key={index}
              sx={{
                // Must hardcode, else the box will expand if not enough height
                height: GRID_CARD_HEIGHT,
              }}
            >
              <GridResultCard
                content={collection}
                onClickCard={onClickCard}
                onClickDetail={onClickDetail}
                onClickLinks={onClickLinks}
                onClickDownload={
                  collection.hasSummaryFeature() ? onClickDownload : undefined
                }
                selectedUuid={selectedUuid}
                isSimplified={isSimplified}
              />
            </Grid>
          )
        )}
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
  onClickDetail,
  onClickLinks,
  onClickDownload,
  sx,
  selectedUuids,
}) => {
  const { isUnderLaptop } = useBreakpoint();
  const goToDetailPage = useTabNavigation();
  const { fetchRecord } = useFetchData();

  const [count, total] = useMemo(() => {
    const count = contents.result.collections.length;
    const total = contents.result.total;
    return [count, total];
  }, [contents.result.collections.length, contents.result.total]);

  const selectedUuid = useMemo(() => selectedUuids?.[0], [selectedUuids]);

  const loadMoreResults = useCallback(
    // Must use async here to make sure load done before return
    // which block any action on new search message with the append
    // action in the fetchRecord.
    async () =>
      await fetchRecord(
        false,
        layout === SearchResultLayoutEnum.FULL_LIST
          ? FULL_LIST_PAGE_SIZE
          : DEFAULT_SEARCH_PAGE_SIZE
      ),
    [fetchRecord, layout]
  );

  const onClickBtnCard = useCallback(
    (item: OGCCollection | undefined) => onClickCard?.(item),
    [onClickCard]
  );

  const onClickBtnDetail = useCallback(
    (uuid: string, type: OpenType | undefined) => {
      onClickDetail?.(uuid);
      goToDetailPage(
        uuid,
        detailPageDefault.SUMMARY,
        pageReferer.SEARCH_PAGE_REFERER,
        undefined,
        type
      );
    },
    [goToDetailPage, onClickDetail]
  );

  const onClickBtnDownload = useCallback(
    (uuid: string, type: OpenType | undefined) => {
      onClickDownload?.(uuid);
      goToDetailPage(
        uuid,
        detailPageDefault.SUMMARY,
        pageReferer.SEARCH_PAGE_REFERER,
        "download-section",
        type
      );
    },
    [goToDetailPage, onClickDownload]
  );

  const onClickBtnLinks = useCallback(
    (uuid: string, type: OpenType | undefined) => {
      onClickLinks?.(uuid);
      goToDetailPage(
        uuid,
        detailPageDefault.DATA_ACCESS,
        pageReferer.SEARCH_PAGE_REFERER,
        undefined,
        type
      );
    },
    [goToDetailPage, onClickLinks]
  );

  const renderLoadMoreButton = useCallback(() => {
    return (
      <DetailSubtabBtn
        id="result-card-load-more-btn"
        title="Show more results"
        onClick={loadMoreResults}
      />
    );
  }, [loadMoreResults]);

  // Fetching more data for full list view if the initial records less than 20
  useEffect(() => {
    // Must use async here to make sure load done before return
    // which block any action on new search message with the append
    // action in the fetchRecord.
    const loadRecords = async () => {
      if (
        layout === SearchResultLayoutEnum.FULL_LIST &&
        count < total &&
        count < 20
      ) {
        await fetchRecord(false, FULL_LIST_PAGE_SIZE);
      }
    };
    loadRecords();
  }, [count, fetchRecord, layout, total]);

  if (!contents) return;

  if (layout === SearchResultLayoutEnum.FULL_LIST) {
    // Render full list view
    return renderListCards({
      sx,
      contents,
      count,
      total,
      renderLoadMoreButton,
      onClickCard: onClickBtnCard,
      onClickDetail: onClickBtnDetail,
      onClickLinks: onClickBtnLinks,
      onClickDownload: onClickBtnDownload,
      selectedUuid,
      layout: SearchResultLayoutEnum.FULL_LIST,
      isSimplified: isUnderLaptop,
    });
  } else if (layout === SearchResultLayoutEnum.GRID) {
    // Render grid view
    return renderGridCards({
      sx,
      contents,
      count,
      total,
      renderLoadMoreButton,
      onClickCard: onClickBtnCard,
      onClickDetail: onClickBtnDetail,
      onClickLinks: onClickBtnLinks,
      onClickDownload: onClickBtnDownload,
      selectedUuid,
      layout: SearchResultLayoutEnum.GRID,
      isSimplified: isUnderLaptop,
    });
  } else {
    // Default render list view
    return renderListCards({
      sx,
      contents,
      count,
      total,
      renderLoadMoreButton,
      onClickCard: onClickBtnCard,
      onClickDetail: onClickBtnDetail,
      onClickLinks: onClickBtnLinks,
      onClickDownload: onClickBtnDownload,
      selectedUuid,
      layout: SearchResultLayoutEnum.LIST,
      isSimplified: isUnderLaptop,
    });
  }
};

export default ResultCards;
