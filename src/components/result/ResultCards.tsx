import { FC, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Box, Grid, SxProps } from "@mui/material";
import {
  CollectionsQueryType,
  DEFAULT_SEARCH_PAGE_SIZE,
  FULL_LIST_PAGE_SIZE,
} from "@/app/store/searchReducer";
import useTabNavigation, { OpenType } from "../../hooks/useTabNavigation";
import GridResultCard from "./GridResultCard";
import ListResultCard from "./ListResultCard";
import { OGCCollection } from "@/app/store/OGCCollectionDefinitions";
import { SearchResultLayoutEnum } from "../common/buttons/ResultListLayoutButton";
import useFetchData from "../../hooks/useFetchData";
import useBreakpoint from "../../hooks/useBreakpoint";
import { GRID_CARD_HEIGHT, LIST_CARD_HEIGHT } from "./constants";
import { ResultCardBasicType } from "./types";
import { detailPageDefault, pageReferer } from "../common/constants";
import ShowMoreDetailBtn from "../common/buttons/ShowMoreDetailBtn";

export type { ResultCardBasicType } from "./types";

interface ResultCardsListType extends ResultCardBasicType {
  count: number;
  total: number;
  contents: CollectionsQueryType;
  renderLoadMoreButton: () => JSX.Element;
  loadMoreRef?: (node: HTMLDivElement | null) => void;
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
  loadMoreRef,
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
      <Grid container spacing={1} sx={{ width: "100%" }}>
        {contents.result.collections.map(
          (collection: OGCCollection, index: number) => (
            <Grid
              key={index}
              sx={{
                // Must hardcode, else the box will expand if not enough height
                height: isSimplified ? "auto" : LIST_CARD_HEIGHT,
                maxHeight: LIST_CARD_HEIGHT,
              }}
              size={{
                xs: 12,
                sm: 6,
                md: isFullListView ? 6 : 12,
                lg: isFullListView ? 4 : 12,
              }}
            >
              <ListResultCard
                content={collection}
                onClickCard={onClickCard}
                onClickDetail={onClickDetail}
                onClickLinks={onClickLinks}
                onClickDownload={
                  collection.hasCloudOptimisedData()
                    ? onClickDownload
                    : undefined
                }
                selectedUuid={selectedUuid}
                isSimplified={isSimplified}
              />
            </Grid>
          )
        )}
        {renderLoadMoreButton && count < total && (
          <Grid sx={{ display: "flex", justifyContent: "center" }} size={12}>
            {isFullListView && (
              <Box ref={loadMoreRef} aria-hidden sx={{ height: 1 }} />
            )}
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
      <Grid container spacing={1} sx={{ width: "100%" }}>
        {contents.result.collections.map(
          (collection: OGCCollection, index: number) => (
            <Grid
              key={index}
              sx={{
                // Must hardcode, else the box will expand if not enough height
                height: GRID_CARD_HEIGHT,
              }}
              size={{
                xs: 6,
                sm: 4,
                md: 6,
                lg: 6,
              }}
            >
              <GridResultCard
                content={collection}
                onClickCard={onClickCard}
                onClickDetail={onClickDetail}
                onClickLinks={onClickLinks}
                onClickDownload={
                  collection.hasCloudOptimisedData()
                    ? onClickDownload
                    : undefined
                }
                selectedUuid={selectedUuid}
                isSimplified={isSimplified}
              />
            </Grid>
          )
        )}
        {renderLoadMoreButton && count < total && (
          <Grid sx={{ display: "flex", justifyContent: "center" }} size={12}>
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
  const tabNavigation = useTabNavigation();
  const { fetchRecord } = useFetchData();
  const [loadMoreNode, setLoadMoreNode] = useState<HTMLDivElement | null>(null);
  const isLoadingMoreRef = useRef(false);

  const [count, total] = useMemo(() => {
    const count = contents.result.collections.length;
    const total = contents.result.total;
    return [count, total];
  }, [contents.result.collections.length, contents.result.total]);

  const selectedUuid = useMemo(() => selectedUuids?.[0], [selectedUuids]);

  const loadMoreResults = useCallback(async () => {
    if (isLoadingMoreRef.current) return;
    isLoadingMoreRef.current = true;
    try {
      await fetchRecord(
        false,
        layout === SearchResultLayoutEnum.FULL_LIST
          ? FULL_LIST_PAGE_SIZE
          : DEFAULT_SEARCH_PAGE_SIZE
      );
    } finally {
      isLoadingMoreRef.current = false;
    }
  }, [fetchRecord, layout]);

  const onClickBtnCard = useCallback(
    (item: OGCCollection | undefined) => onClickCard?.(item),
    [onClickCard]
  );

  const onClickBtnDetail = useCallback(
    (uuid: string, type: OpenType | undefined) => {
      onClickDetail?.(uuid);
      tabNavigation(
        uuid,
        detailPageDefault.SUMMARY,
        pageReferer.SEARCH_PAGE_REFERER,
        undefined,
        type
      );
    },
    [tabNavigation, onClickDetail]
  );

  const onClickBtnDownload = useCallback(
    (uuid: string, type: OpenType | undefined) => {
      onClickDownload?.(uuid);
      tabNavigation(
        uuid,
        detailPageDefault.SUMMARY,
        pageReferer.SEARCH_PAGE_REFERER,
        "download-section",
        type
      );
    },
    [tabNavigation, onClickDownload]
  );

  const onClickBtnLinks = useCallback(
    (uuid: string, type: OpenType | undefined) => {
      onClickLinks?.(uuid);
      tabNavigation(
        uuid,
        detailPageDefault.DATA_ACCESS,
        pageReferer.SEARCH_PAGE_REFERER,
        undefined,
        type
      );
    },
    [tabNavigation, onClickLinks]
  );

  const renderLoadMoreButton = useCallback(() => {
    return (
      <ShowMoreDetailBtn
        id="result-card-load-more-btn"
        isShowingMore={false} // Always false since we're loading more, not toggling
        setIsShowingMore={() => loadMoreResults()}
      />
    );
  }, [loadMoreResults]);

  // Request the next page only when the end of the list approaches the viewport.
  useEffect(() => {
    if (
      layout !== SearchResultLayoutEnum.FULL_LIST ||
      count >= total ||
      !loadMoreNode ||
      typeof IntersectionObserver === "undefined"
    )
      return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) loadMoreResults();
      },
      { rootMargin: "200px 0px" }
    );
    observer.observe(loadMoreNode);
    return () => observer.disconnect();
  }, [count, total, layout, loadMoreResults, loadMoreNode]);

  if (!contents) return;

  if (layout === SearchResultLayoutEnum.FULL_LIST) {
    // Render full list view
    return renderListCards({
      sx,
      contents,
      count,
      total,
      renderLoadMoreButton,
      loadMoreRef: setLoadMoreNode,
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
