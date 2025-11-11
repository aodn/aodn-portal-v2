import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { LngLatBounds, MapEvent } from "mapbox-gl";
import { Box } from "@mui/material";
import { bboxPolygon, booleanEqual } from "@turf/turf";
import store, {
  getComponentState,
  getSearchQueryResult,
} from "../../components/common/store/store";
import {
  createSearchParamFrom,
  DEFAULT_SEARCH_MAP_SIZE,
  fetchResultByUuidNoStore,
  fetchResultNoStore,
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
import {
  MapDefaultConfig,
  MapEventEnum,
} from "../../components/map/mapbox/constants";
import _ from "lodash";
import useFetchData from "../../hooks/useFetchData";

const SearchPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isUnderLaptop, isMobile } = useBreakpoint();
  const redirectSearch = useRedirectSearch();
  const { fetchRecord } = useFetchData();
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
  // Add these refs outside the functions, e.g., in the component body
  const listSearchAbortRef = useRef<{
    abort: (reason?: string) => void;
  } | null>(null);
  const mapSearchAbortRef = useRef<AbortController | null>(null);
  // This is use to avoid update called too many times in short period that
  // hurt the performace
  const debounceHistoryUpdateRef = useRef<_.DebouncedFunc<
    (url: string) => void
  > | null>(
    _.debounce((url: string) => {
      const pathname = window.location.pathname;
      if (pathname.includes(pageDefault.search)) {
        // Must use navigator, otherwise useLocation will not work, we
        // add a debounce here to avoid user click too fast where
        // search is still happens and user click to other page
        // causing URL incorrect
        navigate(url, {
          replace: true, // Must use replace to avoid page move back
          state: {
            fromNavigate: true,
            requireSearch: false,
            referer: pageReferer.SEARCH_PAGE_REFERER,
          },
        });
      }
    }, 200)
  );

  const urlParamState: ParameterState | undefined = useMemo(() => {
    // The first char is ? in the search string, so we need to remove it.
    const param = location?.search?.substring(1);
    if (param && param.length > 0) {
      return unFlattenToParameterState(param);
    }
    return undefined;
  }, [location?.search]);

  const doMapSearch = useCallback(
    async (needNavigate: boolean = false) => {
      const componentParam: ParameterState = getComponentState(
        store.getState()
      );
      // Use a different parameter so that it returns id and bbox only and do not store the values,
      // we cannot add page because we want to show all record on map
      // and by default we will include record without spatial extents so that BBOX
      // will not exclude record without spatial extents however for map search
      // it is ok to exclude it because it isn't show on map anyway
      // Abort any ongoing search if exists
      if (mapSearchAbortRef.current) {
        mapSearchAbortRef.current.abort();
      }
      const controller = new AbortController();
      mapSearchAbortRef.current = controller;

      const paramNonPaged: SearchParameters = createSearchParamFrom(
        componentParam,
        {
          pagesize: DEFAULT_SEARCH_MAP_SIZE,
        }
      );
      // Make sure no other code abort the search
      if (mapSearchAbortRef.current) {
        dispatch(
          // add param "sortby: id" for fetchResultNoStore to ensure data source for map is always sorted
          // and ordered by uuid to avoid affecting cluster calculation
          fetchResultNoStore({
            ...paramNonPaged,
            properties: "id,centroid",
            sortby: "id",
            signal: controller.signal,
          } as SearchParameters & { signal: AbortSignal })
        )
          .unwrap()
          .then((collections: string) => {
            // This check is need due to user can move the map around when the search
            // is still in progress, the store have the latest map bbox so we can check
            // if the constant we store matches the bbox, if not then we know map
            // moved and results isn't valid
            const current = getComponentState(store.getState())?.bbox;
            if (
              componentParam.bbox !== undefined &&
              current !== undefined &&
              booleanEqual(componentParam.bbox, current)
            ) {
              setLayers(jsonToOGCCollections(collections).collections);
            }
          })
          .then(() => {
            // Must update status after search done, this change the location.state and will
            // cause all search cancel. However, we also need to make sure that the controller is not canceled
            // and replace by a new one due to new search
            if (needNavigate && controller === mapSearchAbortRef.current) {
              debounceHistoryUpdateRef?.current?.cancel();
              debounceHistoryUpdateRef?.current?.(
                pageDefault.search + "?" + formatToUrlParam(componentParam)
              );
            }
          })
          .catch(() => {
            // console.log("doSearchMap signal abort");
          })
          .finally(() => (mapSearchAbortRef.current = null));
      }
    },
    [dispatch]
  );

  const doListSearch = useCallback(
    (needNavigate: boolean = false) => {
      if (listSearchAbortRef.current) {
        listSearchAbortRef.current.abort();
      }
      // The return implicit contains a AbortController due to use of signal in
      // axios call
      listSearchAbortRef.current = fetchRecord(true);
      doMapSearch(needNavigate).finally(() => {});
    },
    [doMapSearch, fetchRecord]
  );

  // The result will be changed based on the zoomed area, that is only
  // dataset where spatial extends fall into the zoomed area will be selected.
  const onMapZoomOrMove = useCallback(
    (event: MapEvent | undefined) => {
      if ((event as any)?.originalEvent || import.meta.env.MODE === "dev") {
        // Make sure it is user generated event, if we zoom map via api we do not
        // want the search cancel OR in dev mode where test case use a lot of api
        // call to move map
        if (
          event?.type === MapEventEnum.ZOOM_START ||
          event?.type === MapEventEnum.MOVE_START
        ) {
          // If another zoom or move starts, we can cancel the current map search
          // as it is useless because another zoom/move end will come and trigger
          // search again
          console.log("Cancel devom ot eu / zoom");
          mapSearchAbortRef.current?.abort();
          mapSearchAbortRef.current = null;
        } else if (
          event?.type === MapEventEnum.ZOOM_END ||
          event?.type === MapEventEnum.MOVE_END
        ) {
          const componentParam: ParameterState = getComponentState(
            store.getState()
          );

          const bounds = event?.target.getBounds();
          if (bounds == null) return;

          const ne = bounds.getNorthEast(); // NorthEast corner
          const sw = bounds.getSouthWest(); // SouthWest corner
          // Note order: longitude, latitude.2
          const bbox = bboxPolygon([sw.lng, sw.lat, ne.lng, ne.lat]);

          // Sometimes the map fire zoomend even nothing happens, this may
          // due to some redraw, so in here we check if the polygon really
          // changed, if not then there is no need to do anything
          if (componentParam.bbox && !booleanEqual(componentParam.bbox, bbox)) {
            // These two lines cause flick on map move, why we need that two line?
            //setBbox(bounds);
            //setZoom(event.target.getZoom());
            dispatch(updateFilterBBox(bbox));
            dispatch(updateZoom(event.target.getZoom()));
            doListSearch(true);
          }
        }
      }
    },
    [dispatch, doListSearch]
  );

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

      return doListSearch(true);
    },
    [dispatch, doListSearch]
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

  const cancelAllSearch = useCallback(() => {
    mapSearchAbortRef.current?.abort();
    mapSearchAbortRef.current = null;
    listSearchAbortRef.current?.abort();
    listSearchAbortRef.current = null;
  }, []);

  // You will see this trigger twice, this is due to use of strict-mode
  // which is ok.
  // TODO: Optimize call if possible, this happens when navigate from page
  // to this page.
  useEffect(() => {
    const handleNavigation = () => {
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
          doListSearch();
        }
      } else if (
        // If user navigate from DetailPage, as the redux store has results content already we just need to do a map search
        // However when user refresh the page, the redux will be cleared, we need to do a full search
        // Therefore we need to check if the redux content is empty or not to decide whether to do a full search or only map search
        location.state?.referer === pageReferer.DETAIL_PAGE_REFERER &&
        location.state?.requireSearch === false
      ) {
        if (reduxContents.result.total > 0) {
          doMapSearch()?.finally(() => {});
        } else {
          doListSearch();
        }
      } else {
        // In other cases, we need to do a full search
        // This including (but not limit): user pastes the url directly, navigate from landing page, change sort ...
        doListSearch();
      }
    };
    handleNavigation();

    return () => {
      cancelAllSearch();
    };
    // Must use location.state as the value inside can be the same reference, and hence will not trigger execution
    // the state object will be different each time.
  }, [cancelAllSearch, doListSearch, doMapSearch, location.state]);

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
            cancelLoading={cancelAllSearch}
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
            isLoading={false}
            onDeselectDataset={onDeselectDataset}
          />
        </Box>
      </Box>
    </Layout>
  );
};

export default SearchPage;
