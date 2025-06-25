import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { LngLatBounds, MapboxEvent as MapEvent } from "mapbox-gl";
import { Box } from "@mui/material";
import { bbox as turfBbox, bboxPolygon, booleanEqual } from "@turf/turf";
import store, {
  getComponentState,
  getSearchQueryResult,
} from "../../components/common/store/store";
import {
  createSearchParamFrom,
  DEFAULT_SEARCH_MAP_SIZE,
  DEFAULT_SEARCH_PAGE_SIZE,
  fetchResultByUuidNoStore,
  fetchResultNoStore,
  fetchResultWithStore,
  jsonToOGCCollections,
  SearchParameters,
} from "../../components/common/store/searchReducer";
import {
  formatToUrlParam,
  ParameterState,
  unFlattenToParameterState,
  updateFilterBBox,
  updateLayout,
  updateSort,
  updateSortBy,
  updateZoom,
} from "../../components/common/store/componentParamReducer";
import {
  on,
  off,
  setExpandedItem,
  setTemporaryItem,
} from "../../components/common/store/bookmarkListReducer";
import Layout from "../../components/layout/layout";
import ResultSection from "./subpages/ResultSection";
import MapSection from "./subpages/MapSection";
import { SearchResultLayoutEnum } from "../../components/common/buttons/ResultListLayoutButton";
import { SortResultEnum } from "../../components/common/buttons/ResultListSortButton";
import { OGCCollection } from "../../components/common/store/OGCCollectionDefinitions";
import {
  useAppDispatch,
  useAppSelector,
} from "../../components/common/store/hooks";
import { pageDefault, pageReferer } from "../../components/common/constants";
import { color, padding } from "../../styles/constants";
import {
  BookmarkEvent,
  EVENT_BOOKMARK,
} from "../../components/map/mapbox/controls/menu/Definition";
import {
  SEARCH_PAGE_CONTENT_CONTAINER_HEIGHT_ABOVE_LAPTOP,
  SEARCH_PAGE_CONTENT_CONTAINER_HEIGHT_UNDER_LAPTOP,
  SEARCH_PAGE_MAP_CONTAINER_HEIGHT_FULL_LIST,
  SEARCH_PAGE_MAP_CONTAINER_HEIGHT_ABOVE_LAPTOP,
  SEARCH_PAGE_MAP_CONTAINER_HEIGHT_UNDER_LAPTOP,
  SEARCH_PAGE_MAP_CONTAINER_HEIGHT_FULL_MAP_TABLET,
  SEARCH_PAGE_MAP_CONTAINER_HEIGHT_FULL_MAP_MOBILE,
} from "./constants";
import useBreakpoint from "../../hooks/useBreakpoint";
import useRedirectSearch from "../../hooks/useRedirectSearch";
import { MapDefaultConfig } from "../../components/map/mapbox/constants";

const isLoading = (count: number): boolean => {
  if (count > 0) {
    return true;
  }
  if (count === 0) {
    // a 0.5s late finish loading is useful to improve the stability of the system
    setTimeout(() => false, 500);
  }
  if (count < 0) {
    // TODO: use beffer handling to replace this
    throw new Error("Loading counter is negative");
  }
  return false;
};

const SearchPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isUnderLaptop, isMobile } = useBreakpoint();
  const redirectSearch = useRedirectSearch();
  const layout = useAppSelector((state) => state.paramReducer.layout);
  const currentSort = useAppSelector((state) => state.paramReducer.sort);
  // Layers contains record with uuid and bbox only
  const [layers, setLayers] = useState<Array<OGCCollection>>([]);
  // CurrentLayout is used to remember last layout after change to full map view , which is SearchResultLayoutEnum exclude the value FULL_MAP
  const [currentLayout, setCurrentLayout] = useState<
    Exclude<SearchResultLayoutEnum, SearchResultLayoutEnum.FULL_MAP> | undefined
  >(undefined);
  //State to store the uuid of a selected dataset
  const [selectedUuids, setSelectedUuids] = useState<Array<string>>([]);
  const [bbox, setBbox] = useState<LngLatBounds | undefined>(undefined);
  const [zoom, setZoom] = useState<number | undefined>(
    isUnderLaptop
      ? isMobile
        ? MapDefaultConfig.ZOOM_MOBILE
        : MapDefaultConfig.ZOOM_TABLET
      : undefined
  );
  const [loadingThreadCount, setLoadingThreadCount] = useState<number>(0);

  const urlParamState: ParameterState | undefined = useMemo(() => {
    // The first char is ? in the search string, so we need to remove it.
    const param = location?.search?.substring(1);
    if (param && param.length > 0) {
      return unFlattenToParameterState(param);
    }
    return undefined;
  }, [location?.search]);

  const startOneLoadingThread = useCallback(() => {
    setLoadingThreadCount((prev) => prev + 1);
  }, []);

  const endOneLoadingThread = useCallback(() => {
    setLoadingThreadCount((prev) => prev - 1);
  }, []);

  const doMapSearch = useCallback(async () => {
    const componentParam: ParameterState = getComponentState(store.getState());

    // Use a different parameter so that it returns id and bbox only and do not store the values,
    // we cannot add page because we want to show all record on map
    // and by default we will include record without spatial extents so that BBOX
    // will not exclude record without spatial extents however for map search
    // it is ok to exclude it because it isn't show on map anyway
    const paramNonPaged: SearchParameters = createSearchParamFrom(
      componentParam,
      {
        pagesize: DEFAULT_SEARCH_MAP_SIZE,
      }
    );

    dispatch(
      // add param "sortby: id" for fetchResultNoStore to ensure data source for map is always sorted
      // and ordered by uuid to avoid affecting cluster calculation
      fetchResultNoStore({
        ...paramNonPaged,
        properties: "id,centroid",
        sortby: "id",
      })
    )
      .unwrap()
      .then((collections: string) => {
        setLayers(jsonToOGCCollections(collections).collections);
      });
  }, [dispatch]);

  const doSearch = useCallback(
    (needNavigate: boolean = false) => {
      startOneLoadingThread();
      const componentParam: ParameterState = getComponentState(
        store.getState()
      );

      // Use standard param to get fields you need, record is stored in redux,
      // set page so that it returns fewer records
      const paramPaged = createSearchParamFrom(componentParam, {
        pagesize: DEFAULT_SEARCH_PAGE_SIZE,
      });

      dispatch(fetchResultWithStore(paramPaged));
      doMapSearch()
        .then(() => {
          if (needNavigate) {
            navigate(
              pageDefault.search + "?" + formatToUrlParam(componentParam),
              {
                state: {
                  fromNavigate: true,
                  requireSearch: false,
                  referer: pageReferer.SEARCH_PAGE_REFERER,
                },
              }
            );
          } else {
            if (componentParam.polygon) {
              // If user set the polygon, then we zoom to that area by setting the bbox
              const bbox = turfBbox(componentParam.polygon);
              const polygon = bboxPolygon(bbox);
              setBbox(
                new LngLatBounds(
                  [bbox[0], bbox[1]], // Southwest corner: [minX, minY]
                  [bbox[2], bbox[3]] // Northeast corner: [maxX, maxY]
                )
              );
              dispatch(updateFilterBBox(polygon));

              setZoom(6);
              dispatch(updateZoom(6));
            }
          }
        })
        .finally(() => {
          endOneLoadingThread();
        });
    },
    [
      startOneLoadingThread,
      dispatch,
      doMapSearch,
      navigate,
      endOneLoadingThread,
    ]
  );

  // The result will be changed based on the zoomed area, that is only
  // dataset where spatial extends fall into the zoomed area will be selected.
  const onMapZoomOrMove = useCallback(
    (event: MapEvent<MouseEvent | WheelEvent | TouchEvent | undefined>) => {
      if (event.type === "zoomend" || event.type === "moveend") {
        const componentParam: ParameterState = getComponentState(
          store.getState()
        );

        const bounds = event.target.getBounds();
        const ne = bounds.getNorthEast(); // NorthEast corner
        const sw = bounds.getSouthWest(); // SouthWest corner
        // Note order: longitude, latitude.2
        const bbox = bboxPolygon([sw.lng, sw.lat, ne.lng, ne.lat]);

        // Sometimes the map fire zoomend even nothing happens, this may
        // due to some redraw, so in here we check if the polygon really
        // changed, if not then there is no need to do anything
        if (componentParam.bbox && !booleanEqual(componentParam.bbox, bbox)) {
          setBbox(bounds);
          setZoom(event.target.getZoom());
          dispatch(updateFilterBBox(bbox));
          dispatch(updateZoom(event.target.getZoom()));
          doSearch(true);
        }
      }
    },
    [dispatch, doSearch]
  );

  const handleNavigation = useCallback(() => {
    const reduxContents = getSearchQueryResult(store.getState());
    if (
      location.state?.referer === pageReferer.SEARCH_PAGE_REFERER &&
      location.state?.requireSearch === false
    ) {
      // If the referer is SEARCH_PAGE_REFERER, it means the user is interacting with the search page
      // Meanwhile if the state requireSearch is false, it means the user is not required to do a search. This happens when user just change the layout
      // However the referer = SEARCH_PAGE_REFERER and requireSearch = false will be persist but redux will be cleared when user refresh the page, so we need to do a full search
      // Therefore we need to check if the redux content is empty or not to decide whether to do a full search or no search
      if (reduxContents.result.total > 0) {
        return;
      } else {
        doSearch();
      }
    } else if (
      // If user navigate from DetailPage, as the redux store has results content already we just need to do a map search
      // However when user refresh the page, the redux will be cleared, we need to do a full search
      // Therefore we need to check if the redux content is empty or not to decide whether to do a full search or only map search
      location.state?.referer === pageReferer.DETAIL_PAGE_REFERER &&
      location.state?.requireSearch === false
    ) {
      if (reduxContents.result.total > 0) {
        startOneLoadingThread();
        doMapSearch().finally(() => endOneLoadingThread());
      } else {
        doSearch();
      }
    } else {
      // In the other cases we need to do a full search
      // This including (but not limit): user paste the url directly, navigate from landing page, change sort ...
      doSearch();
    }
  }, [
    location,
    doSearch,
    doMapSearch,
    startOneLoadingThread,
    endOneLoadingThread,
  ]);

  // Value true meaning full map. So if true set the selected layout as full-map
  // Else set the selected layout as the last layout remembered (stored in currentLayout)
  // or LIST view by default if user hasn't chosen any view mode
  const onToggleDisplay = useCallback(
    (isFullMap: boolean) => {
      setCurrentLayout((prev) => {
        dispatch(
          updateLayout(
            isFullMap
              ? SearchResultLayoutEnum.FULL_MAP
              : isUnderLaptop
                ? SearchResultLayoutEnum.FULL_LIST
                : prev || SearchResultLayoutEnum.LIST
          )
        );
        return prev;
      });
      // Form param to url without navigate
      redirectSearch(pageReferer.SEARCH_PAGE_REFERER, true, false);
    },
    [dispatch, isUnderLaptop, redirectSearch]
  );

  const onChangeSorting = useCallback(
    (sort: SortResultEnum) => {
      dispatch(updateSort(sort));

      switch (sort) {
        case SortResultEnum.RELEVANT:
          dispatch(
            updateSortBy([
              { field: "score", order: "DESC" },
              { field: "rank", order: "DESC" },
            ])
          );
          break;

        case SortResultEnum.TITLE:
          dispatch(
            updateSortBy([
              { field: "title", order: "ASC" },
              { field: "rank", order: "DESC" },
            ])
          );
          break;

        case SortResultEnum.POPULARITY:
          //TODO: need ogcapi change
          break;

        case SortResultEnum.MODIFIED:
          dispatch(
            updateSortBy([
              { field: "temporal", order: "DESC" },
              { field: "rank", order: "DESC" },
            ])
          );
          break;
      }

      doSearch(true);
    },
    [dispatch, doSearch]
  );

  const onChangeLayout = useCallback(
    (layout: SearchResultLayoutEnum) => {
      dispatch(updateLayout(layout));
      // Form param to url without navigate
      redirectSearch(pageReferer.SEARCH_PAGE_REFERER, true, false);

      // If user select layout full map, just return the previous layout
      setCurrentLayout((prev) => {
        if (layout === SearchResultLayoutEnum.FULL_MAP) {
          return prev;
        }
        return layout;
      });
    },
    [dispatch, redirectSearch]
  );

  // Helper to check if the item exists in items array or is already a temporary item and return it
  const findTemporaryItemExisting = useCallback(
    (id: string): OGCCollection | undefined => {
      // Check if item exists in bookmark items array
      const existingItem = store
        .getState()
        .bookmarkList.items.find((item: { id: string }) => item.id === id);
      // Check if item is already a temporary item
      const temporaryItem: OGCCollection | undefined =
        store.getState().bookmarkList.temporaryItem;
      const isTemporaryItem = temporaryItem?.id === id;
      if (!!existingItem || isTemporaryItem) {
        return existingItem || temporaryItem;
      } else {
        return undefined;
      }
    },
    []
  );

  // Handler for click on map
  const onClickMapPoint = useCallback(
    (uuids: Array<string>) => {
      if (uuids.length === 0) {
        // This happens when click the empty space of map
        setSelectedUuids([]);
        dispatch(setExpandedItem(undefined));
      } else {
        // Since map point only store uuid in its feature, so need to fetch dataset here
        // Clicking a map dot or a result card will only add a temporary item in bookmark list, until the bookmark icon is clicked
        setSelectedUuids(uuids);

        const temporaryItemExisting = findTemporaryItemExisting(uuids[0]);
        if (temporaryItemExisting) {
          // If the item exists in items array or is already a temporary item, just expand the item
          dispatch(setExpandedItem(temporaryItemExisting));
        } else {
          dispatch(fetchResultByUuidNoStore(uuids[0]))
            .unwrap()
            .then((res: OGCCollection) => {
              dispatch(setTemporaryItem(res));
              dispatch(setExpandedItem(res));
            });
        }
      }
    },
    [dispatch, findTemporaryItemExisting]
  );

  const onClickResultCard = useCallback(
    (item: OGCCollection | undefined) => {
      if (item) {
        setSelectedUuids([item.id]);

        const temporaryItemExisting = findTemporaryItemExisting(item.id);
        if (temporaryItemExisting) {
          // If the item exists in items array or is already a temporary item, just expand the item
          dispatch(setExpandedItem(temporaryItemExisting));
        } else {
          dispatch(setTemporaryItem(item));
          dispatch(setExpandedItem(item));
        }
      }
    },
    [dispatch, findTemporaryItemExisting]
  );

  const onDeselectDataset = useCallback(() => {
    setSelectedUuids([]);
  }, []);

  // You will see this trigger twice, this is due to use of strict-mode
  // which is ok.
  // TODO: Optimize call if possible, this happens when navigate from page
  // to this page.
  useEffect(() => handleNavigation(), [handleNavigation]);

  useEffect(() => {
    const bookmarkSelected = (event: BookmarkEvent) => {
      if (event.action === EVENT_BOOKMARK.EXPAND) {
        onClickResultCard(event.value);
      }
    };
    on(EVENT_BOOKMARK.EXPAND, bookmarkSelected);

    return () => {
      off(EVENT_BOOKMARK.EXPAND, bookmarkSelected);
    };
  }, [onClickResultCard]);

  // Set local states currentLayout according to the url param state and screen size when the page is loaded
  useEffect(() => {
    // Check URL paramState instead of redux state because redux state is not updated before this useEffect
    if (isUnderLaptop) {
      // For small screen, if the layout is not full map or full list, then we need to change it to full list
      // State currentLayout remember the last layout before change to full map, so in this case we set it to full list by default
      if (
        urlParamState &&
        (urlParamState.layout === SearchResultLayoutEnum.FULL_LIST ||
          urlParamState.layout === SearchResultLayoutEnum.FULL_MAP)
      ) {
        setCurrentLayout(SearchResultLayoutEnum.FULL_LIST);
        return;
      }
      // Update redux state to full list
      dispatch(updateLayout(SearchResultLayoutEnum.FULL_LIST));
      // Form param to url without navigate
      redirectSearch(pageReferer.SEARCH_PAGE_REFERER, true, false);
      setCurrentLayout(SearchResultLayoutEnum.FULL_LIST);
    } else {
      // For big screens, if the layout is not full map just update the local state according to the url param state
      if (
        urlParamState &&
        urlParamState.layout !== SearchResultLayoutEnum.FULL_MAP
      ) {
        setCurrentLayout(urlParamState.layout);
        return;
      }
    }
  }, [dispatch, isUnderLaptop, redirectSearch, urlParamState]);

  // Set the local states bbox and zoom according to the url param state when the page is loaded
  useEffect(() => {
    if (urlParamState) {
      setBbox(
        new LngLatBounds(
          urlParamState.bbox?.bbox as [number, number, number, number]
        )
      );
      setZoom(urlParamState.zoom);
    }
  }, [dispatch, urlParamState]);

  return (
    <Layout>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column-reverse", md: "row" },
          justifyContent: "space-between",
          alignItems: "stretch",
          width: "100%",
          height: {
            xs:
              layout === SearchResultLayoutEnum.FULL_MAP
                ? "auto"
                : SEARCH_PAGE_CONTENT_CONTAINER_HEIGHT_UNDER_LAPTOP,
            md: SEARCH_PAGE_CONTENT_CONTAINER_HEIGHT_ABOVE_LAPTOP,
          },
          overflowX: "hidden",
          padding: padding.small,
          bgcolor: color.blue.light,
        }}
        gap={
          layout === SearchResultLayoutEnum.FULL_MAP || isUnderLaptop ? 0 : 2
        }
      >
        <Box
          sx={{
            flex: isUnderLaptop ? 1 : "none",
            width:
              layout === SearchResultLayoutEnum.FULL_LIST ? "100%" : "auto",
            height: layout === SearchResultLayoutEnum.FULL_MAP ? 0 : "auto",
          }}
        >
          <ResultSection
            showFullMap={layout === SearchResultLayoutEnum.FULL_MAP}
            showFullList={layout === SearchResultLayoutEnum.FULL_LIST}
            onClickCard={onClickResultCard}
            selectedUuids={selectedUuids}
            currentSort={currentSort}
            onChangeSorting={onChangeSorting}
            currentLayout={currentLayout}
            onChangeLayout={onChangeLayout}
            onDeselectDataset={onDeselectDataset}
            isLoading={isLoading(loadingThreadCount)}
          />
        </Box>
        <Box
          sx={{
            flex: isUnderLaptop ? "none" : 1,
            height: isUnderLaptop
              ? layout === SearchResultLayoutEnum.FULL_LIST
                ? SEARCH_PAGE_MAP_CONTAINER_HEIGHT_FULL_LIST
                : layout === SearchResultLayoutEnum.FULL_MAP
                  ? isMobile
                    ? SEARCH_PAGE_MAP_CONTAINER_HEIGHT_FULL_MAP_MOBILE
                    : SEARCH_PAGE_MAP_CONTAINER_HEIGHT_FULL_MAP_TABLET
                  : SEARCH_PAGE_MAP_CONTAINER_HEIGHT_UNDER_LAPTOP
              : SEARCH_PAGE_MAP_CONTAINER_HEIGHT_ABOVE_LAPTOP,
          }}
        >
          <MapSection
            showFullMap={layout === SearchResultLayoutEnum.FULL_MAP}
            showFullList={layout === SearchResultLayoutEnum.FULL_LIST}
            collections={layers}
            bbox={bbox}
            zoom={zoom}
            selectedUuids={selectedUuids}
            onMapZoomOrMove={onMapZoomOrMove}
            onToggleClicked={onToggleDisplay}
            onClickMapPoint={onClickMapPoint}
            isLoading={isLoading(loadingThreadCount)}
            onDeselectDataset={onDeselectDataset}
          />
        </Box>
      </Box>
    </Layout>
  );
};

export default SearchPage;
