import { FC, useCallback, useEffect, useMemo } from "react";
import { Box, Grid, SxProps } from "@mui/material";
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
import useFetchData from "../../hooks/useFetchData";
import { SEARCH_PAGE_REFERER } from "../../pages/search-page/constants";

export interface ResultCardBasicType {
  content?: OGCCollection;
  onClickCard?: (item: OGCCollection | undefined) => void;
  onClickDetail?: (uuid: string) => void;
  onClickDownload?: (uuid: string) => void;
  onClickLinks?: (uuid: string) => void;
  selectedUuid?: string;
  sx?: SxProps;
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
  onClickCard: ((item: OGCCollection | undefined) => void) | undefined;
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
}) => {
  if (!count || !total || !contents) return;

  const isFullListView = layout === SearchResultLayoutEnum.FULL_LIST;

  return (
    <Box sx={sx} data-testid="resultcard-result-list">
      <Grid container spacing={1}>
        {contents.result.collections.map((collection, index) => (
          // TODO: change to key={collection.id} will find a bug that there exists datasets with same key (duplicated datasets). Need to check front end fetch more or backend
          <Grid
            item
            xs={12}
            sm={6}
            md={isFullListView ? 4 : 12}
            lg={isFullListView ? 3 : 12}
            key={index}
          >
            <ListResultCard
              content={collection}
              onClickCard={onClickCard}
              onClickDetail={onClickDetail}
              onClickLinks={onClickLinks}
              onClickDownload={onClickDownload}
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
}) => {
  if (!count || !total || !contents) return;

  return (
    <Box sx={sx} data-testid="resultcard-result-grid">
      <Grid container spacing={1}>
        {contents.result.collections.map((collection, index) => (
          <Grid item xs={6} sm={4} md={6} lg={6} key={index}>
            <GridResultCard
              content={collection}
              onClickCard={onClickCard}
              onClickDetail={onClickDetail}
              onClickLinks={onClickLinks}
              onClickDownload={onClickDownload}
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
  sx,
  selectedUuids,
}) => {
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
    (uuid: string) => goToDetailPage(uuid, "abstract", SEARCH_PAGE_REFERER),
    [goToDetailPage]
  );

  const onClickDownload = useCallback(
    (uuid: string) =>
      goToDetailPage(uuid, "abstract", SEARCH_PAGE_REFERER, "download-section"),
    [goToDetailPage]
  );

  const onClickLinks = useCallback(
    (uuid: string) => goToDetailPage(uuid, "links", SEARCH_PAGE_REFERER),
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
    // Render full list view
    return renderListCards({
      sx,
      contents,
      count,
      total,
      renderLoadMoreButton,
      onClickCard,
      onClickDetail,
      onClickLinks,
      onClickDownload,
      selectedUuid,
      layout: SearchResultLayoutEnum.FULL_LIST,
    });
  } else if (layout === SearchResultLayoutEnum.GRID) {
    // Render grid view
    return renderGridCards({
      sx,
      contents,
      count,
      total,
      renderLoadMoreButton,
      onClickCard,
      onClickDetail,
      onClickLinks,
      onClickDownload,
      selectedUuid,
      layout: SearchResultLayoutEnum.GRID,
    });
  } else {
    // Default render list view
    return renderListCards({
      sx,
      contents,
      count,
      total,
      renderLoadMoreButton,
      onClickCard,
      onClickDetail,
      onClickLinks,
      onClickDownload,
      selectedUuid,
      layout: SearchResultLayoutEnum.LIST,
    });
  }
};

export default ResultCards;
