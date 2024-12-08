import { useCallback, useEffect, useState } from "react";
import { Box } from "@mui/material";
import {
  createSearchParamFrom,
  DEFAULT_SEARCH_PAGE_SIZE,
  fetchResultByUuidNoStore,
  fetchResultNoStore,
  fetchResultWithStore,
  SearchParameters,
} from "../../components/common/store/searchReducer";
import Layout from "../../components/layout/layout";
import { useLocation, useNavigate } from "react-router-dom";
import {
  formatToUrlParam,
  ParameterState,
  unFlattenToParameterState,
  updateFilterPolygon,
  updateParameterStates,
  updateSortBy,
  updateZoom,
} from "../../components/common/store/componentParamReducer";
import store, { getComponentState } from "../../components/common/store/store";

// Map section, you can switch to other map library, this is for maplibre
// import { MapLibreEvent as MapEvent } from "maplibre-gl";
// import Map from "../components/map/maplibre/Map";
// import Controls from "../components/map/maplibre/controls/Controls";
// import Layers from "../components/map/maplibre/layers/Layers";
// import NavigationControl from "../components/map/maplibre/controls/NavigationControl";
// import ScaleControl from "../components/map/maplibre/controls/ScaleControl";
// import DisplayCoordinate from "../components/map/maplibre/controls/DisplayCoordinate";
// import ItemsOnMapControl from "../components/map/maplibre/controls/ItemsOnMapControl";
// import MapboxDrawControl from "../components/map/maplibre/controls/MapboxDrawControl";
// import VectorTileLayers from "../components/map/maplibre/layers/VectorTileLayers";
// Map section, you can switch to other map library, this is for mapbox
import { LngLatBounds, MapboxEvent as MapEvent } from "mapbox-gl";
import ResultSection from "./subpages/ResultSection";
import MapSection from "./subpages/MapSection";
import { color, padding } from "../../styles/constants";
import { SearchResultLayoutEnum } from "../../components/common/buttons/ResultListLayoutButton";
import { SortResultEnum } from "../../components/common/buttons/ResultListSortButton";
import { bboxPolygon, booleanEqual } from "@turf/turf";
import { OGCCollection } from "../../components/common/store/OGCCollectionDefinitions";
import { useAppDispatch } from "../../components/common/store/hooks";
import { pageDefault } from "../../components/common/constants";
import {
  collapseAllAccordions,
  insertItemToPinList,
  setSelectedUuid,
} from "../../components/map/mapbox/controls/menu/PinListMenu";

const REFERER = "SEARCH_PAGE";

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
  // Layers contains record with uuid and bbox only
  const [layers, setLayers] = useState<Array<OGCCollection>>([]);
  // State to store the layout that user selected
  const [selectedLayout, setSelectedLayout] = useState<SearchResultLayoutEnum>(
    SearchResultLayoutEnum.LIST
  );
  // CurrentLayout is used to remember last layout, which is SearchResultLayoutEnum exclude the value FULL_MAP
  const [currentLayout, setCurrentLayout] = useState<Exclude<
    SearchResultLayoutEnum,
    SearchResultLayoutEnum.FULL_MAP
  > | null>(null);
  // State to store the sort option that user selected
  const [currentSort, setCurrentSort] = useState<SortResultEnum | null>(null);
  const [selectedUuids, setSelectedUuids] = useState<Array<string>>([]);
  const [bbox, setBbox] = useState<LngLatBounds | undefined>(undefined);
  const [zoom, setZoom] = useState<number | undefined>(undefined);
  const [loadingThreadCount, setLoadingThreadCount] = useState<number>(0);

  const startOneLoadingThread = useCallback(() => {
    setLoadingThreadCount((prev) => prev + 1);
  }, []);

  const endOneLoadingThread = useCallback(() => {
    setLoadingThreadCount((prev) => prev - 1);
  }, []);

  // Value true meaning full map. So if true set the selected layout as full-map
  // Else set the selected layout as the last layout remembered (stored in currentLayout)
  // or LIST view by default if user hasn't chosen any view mode
  const onToggleDisplay = useCallback(
    (value: boolean) => {
      setSelectedLayout(
        value
          ? SearchResultLayoutEnum.FULL_MAP
          : currentLayout || SearchResultLayoutEnum.LIST
      );
    },
    [currentLayout]
  );

  const doMapSearch = useCallback(async () => {
    const componentParam: ParameterState = getComponentState(store.getState());

    // Use a different parameter so that it returns id and bbox only and do not store the values,
    // we cannot add page because we want to show all record on map
    // and by default we will include record without spatial extents so that BBOX
    // will not exclude record without spatial extents however for map search
    // it is ok to exclude it because it isn't show on map anyway
    const paramNonPaged = createSearchParamFrom(componentParam, {
      includeNoSpatialExtents: false,
    });
    const collections = await dispatch(
      // add param "sortby: id" for fetchResultNoStore to ensure data source for map is always sorted
      // and ordered by uuid to avoid affecting cluster calculation
      fetchResultNoStore({
        ...paramNonPaged,
        properties: "id,centroid",
        sortby: "id",
      })
    ).unwrap();
    setLayers(collections.collections);
  }, [dispatch]);

  const doSearch = useCallback(
    (needNavigate: boolean = true) => {
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
                  referer: REFERER,
                },
              }
            );
          }
        })
        .finally(() => {
          endOneLoadingThread();
        });
    },
    [
      startOneLoadingThread,
      endOneLoadingThread,
      doMapSearch,
      dispatch,
      navigate,
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
        const polygon = bboxPolygon([sw.lng, sw.lat, ne.lng, ne.lat]);

        // Sometimes the map fire zoomend even nothing happens, this may
        // due to some redraw, so in here we check if the polygon really
        // changed, if not then there is no need to do anything
        if (
          componentParam.polygon &&
          !booleanEqual(componentParam.polygon, polygon)
        ) {
          setBbox(bounds);
          setZoom(event.target.getZoom());
          dispatch(updateFilterPolygon(polygon));
          dispatch(updateZoom(event.target.getZoom()));
          doSearch();
        }
      }
    },
    [dispatch, doSearch]
  );
  // If this flag is set, that means it is call from within react
  // and the search status already refresh and useSelector contains
  // the correct values, else it is user paste the url directly
  // and content may not refresh
  const handleNavigation = useCallback(() => {
    if (!location.state?.fromNavigate) {
      // The first char is ? in the search string, so we need to remove it.
      const param = location?.search.substring(1);
      if (param !== null) {
        const paramState: ParameterState = unFlattenToParameterState(param);
        dispatch(updateParameterStates(paramState));
        // URL request, we need to adjust the map to the same area as mentioned
        // in the url
        setBbox(
          new LngLatBounds(
            paramState.polygon?.bbox as [number, number, number, number]
          )
        );
        setZoom(paramState.zoom);

        doSearch();
      }
    } else {
      if (location.state?.requireSearch) {
        // Explicitly call search from navigation, so you just need search
        // but do not navigate again.
        doSearch(false);
      }
      // If it is navigated from this component, and no need to search, that
      // mean we already call doSearch() + doMapSearch(), however if you
      // come from other page, the result list is good because we remember it
      // but the map need init again and therefore need to do a doMapSearch()
      else if (location.state?.referer !== REFERER) {
        const componentParam: ParameterState = getComponentState(
          store.getState()
        );
        setBbox(
          new LngLatBounds(
            componentParam.polygon?.bbox as [number, number, number, number]
          )
        );
        setZoom(componentParam.zoom);

        startOneLoadingThread();
        doMapSearch().finally(() => {
          endOneLoadingThread();
        });
      }
    }
  }, [
    location,
    dispatch,
    doSearch,
    doMapSearch,
    startOneLoadingThread,
    endOneLoadingThread,
  ]);

  const onChangeSorting = useCallback(
    (sort: SortResultEnum) => {
      setCurrentSort(sort);
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

      doSearch();
    },
    [dispatch, doSearch]
  );

  const onChangeLayout = useCallback(
    (layout: SearchResultLayoutEnum) => {
      setSelectedLayout(layout);
      // If user select layout full map, just return so the last selected layout is not changed in currentLayout
      if (layout === SearchResultLayoutEnum.FULL_MAP) return;
      setCurrentLayout(layout);
    },
    [setCurrentLayout]
  );

  // util function to get collection data given uuid
  const fillGeometryIfMissing = useCallback(
    async (collection: OGCCollection): Promise<OGCCollection> => {
      if (collection.getGeometry())
        return new Promise((resolve) => resolve(collection));

      const param: SearchParameters = {
        filter: `id='${collection.id}'`,
        properties: "id,bbox,geometry",
      };

      try {
        const value = await dispatch(fetchResultNoStore(param)).unwrap();
        collection.properties = value.collections[0].properties;
        collection.extentInt = value.collections[0].extent;
        return collection;
      } catch (error) {
        console.error("Error fetching collection data:", error);
        return collection;
      }
    },
    [dispatch]
  );

  // Handler for click on map
  const onClickMapPoint = useCallback(
    (uuids: Array<string>) => {
      if (uuids.length === 0) {
        setSelectedUuids([]);
        collapseAllAccordions();
      } else {
        // This set state will store the selected uuid
        setSelectedUuids(uuids);
        // This function is exposed from PinListMenu for expanding an accordion given uuid
        setSelectedUuid(uuids[0]);
        // This function will fetch selected dataset and insert it to pin list
        dispatch(fetchResultByUuidNoStore(uuids[0]))
          .unwrap()
          .then((res: OGCCollection) => {
            insertItemToPinList(res);
          });
      }
    },
    [dispatch]
  );

  const onClickCard = useCallback(
    async (item: OGCCollection | undefined) => {
      if (item) {
        // The item set to pin list assume spatial extents is there
        const e = await fillGeometryIfMissing(item);
        insertItemToPinList(e);
        setSelectedUuids([item.id]);
        setSelectedUuid(item.id);
      }
    },
    [fillGeometryIfMissing]
  );

  const onClickAccordion = useCallback(
    (uuid: string | undefined) => {
      setSelectedUuids(uuid ? [uuid] : []);
    },
    [setSelectedUuids]
  );

  const onRemoveFromPinList = useCallback(
    (uuid: string) => {
      // If the removed uuid is the selected uuid, need to set selected uuids to []
      setSelectedUuids((prevUuids) => {
        if (prevUuids[0] && prevUuids[0] === uuid) {
          return [];
        } else {
          return prevUuids;
        }
      });
    },
    [setSelectedUuids]
  );

  // You will see this trigger twice, this is due to use of strict-mode
  // which is ok.
  // TODO: Optimize call if possible, this happens when navigate from page
  // to this page.
  useEffect(() => handleNavigation(), [handleNavigation]);

  return (
    <Layout>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "stretch",
          width: "100%",
          height: "90vh",
          padding: padding.small,
          bgcolor: color.blue.light,
        }}
        gap={2}
      >
        <Box>
          <ResultSection
            showFullMap={selectedLayout === SearchResultLayoutEnum.FULL_MAP}
            showFullList={selectedLayout === SearchResultLayoutEnum.FULL_LIST}
            onClickCard={onClickCard}
            selectedUuids={selectedUuids}
            currentSort={currentSort}
            onChangeSorting={onChangeSorting}
            currentLayout={currentLayout}
            onChangeLayout={onChangeLayout}
            isLoading={isLoading(loadingThreadCount)}
          />
        </Box>
        <Box flex={1}>
          <MapSection
            showFullMap={selectedLayout === SearchResultLayoutEnum.FULL_MAP}
            showFullList={selectedLayout === SearchResultLayoutEnum.FULL_LIST}
            collections={layers}
            bbox={bbox}
            zoom={zoom}
            selectedUuids={selectedUuids}
            onMapZoomOrMove={onMapZoomOrMove}
            onToggleClicked={onToggleDisplay}
            onClickMapPoint={onClickMapPoint}
            onClickAccordion={onClickAccordion}
            onRemoveFromPinList={onRemoveFromPinList}
            isLoading={isLoading(loadingThreadCount)}
          />
        </Box>
      </Box>
    </Layout>
  );
};
export default SearchPage;
