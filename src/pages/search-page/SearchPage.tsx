import { useCallback, useEffect, useState } from "react";
import { Box, Grid } from "@mui/material";
import {
  createSearchParamFrom,
  DEFAULT_SEARCH_PAGE,
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
} from "../../components/common/store/componentParamReducer";
import store, { getComponentState } from "../../components/common/store/store";
import { pageDefault } from "../../components/common/constants";

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
import { LngLatBoundsLike, MapboxEvent as MapEvent } from "mapbox-gl";
import ResultSection from "./subpages/ResultSection";
import MapSection from "./subpages/MapSection";
import { color } from "../../styles/constants";
import ComplexTextSearch from "../../components/search/ComplexTextSearch";
import { SearchResultLayoutEnum } from "../../components/common/buttons/MapViewButton";
import { SortResultEnum } from "../../components/common/buttons/ResultListSortButton";
import { bboxPolygon, booleanEqual } from "@turf/turf";
import {
  OGCCollection,
  OGCCollections,
} from "../../components/common/store/OGCCollectionDefinitions";
import { useAppDispatch } from "../../components/common/store/hooks";
import useTabNavigation from "../../hooks/useTabNavigation";

const SEARCH_BAR_HEIGHT = 56;
const RESULT_SECTION_WIDTH = 500;

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
  const navigateToTabAndSection = useTabNavigation();
  // Layers contains record with uuid and bbox only
  const [layers, setLayers] = useState<Array<OGCCollection>>([]);
  const [visibility, setVisibility] = useState<SearchResultLayoutEnum>(
    SearchResultLayoutEnum.VISIBLE
  );
  const [selectedUuids, setSelectedUuids] = useState<Array<string>>([]);
  const [datasetsSelected, setDatasetsSelected] = useState<OGCCollection[]>();
  const [bbox, setBbox] = useState<LngLatBoundsLike | undefined>(undefined);
  const [loadingThreadCount, setLoadingThreadCount] = useState<number>(0);

  const startOneLoadingThread = useCallback(() => {
    setLoadingThreadCount((prev) => prev + 1);
  }, []);

  const endOneLoadingThread = useCallback(() => {
    setLoadingThreadCount((prev) => prev - 1);
  }, []);

  // value true meaning full map, so we set emum, else keep it as is.
  const onToggleDisplay = useCallback(
    (value: boolean) =>
      setVisibility(
        value
          ? SearchResultLayoutEnum.INVISIBLE
          : SearchResultLayoutEnum.VISIBLE
      ),
    [setVisibility]
  );

  const onVisibilityChanged = useCallback(
    (value: SearchResultLayoutEnum) => setVisibility(value),
    [setVisibility]
  );

  //util function for join uuids in a specific pattern for fetching data
  const createFilterString = (uuids: Array<string>): string => {
    if (!Array.isArray(uuids) || uuids.length === 0) {
      return "";
    }
    return uuids.map((uuid) => `id='${uuid}'`).join(" or ");
  };

  const getCollectionsData = useCallback(
    async (uuids: Array<string>): Promise<void | OGCCollection[]> => {
      const uuidsString = createFilterString(uuids);
      // if uuids array is an empty array, no need fetch collection data
      if (uuidsString.length === 0) return;
      const param: SearchParameters = {
        filter: uuidsString,
      };
      return dispatch(fetchResultNoStore(param))
        .unwrap()
        .then((res: OGCCollections) => {
          setDatasetsSelected(res.collections);
        })
        .catch((error: any) => {
          console.error("Error fetching collection data:", error);
          // TODO: handle error in ErrorBoundary
        });
    },
    [dispatch]
  );

  // On select a dataset, update the states: selected uuid(s) and get the collection data
  const handleDatasetSelecting = useCallback(
    (uuids: Array<string>) => {
      if (uuids.length === 0) {
        setSelectedUuids([]);
        setDatasetsSelected([]);
      }
      setSelectedUuids(uuids);
      getCollectionsData(uuids);
    },
    [getCollectionsData]
  );

  const doSearch = useCallback(
    (needNavigate: boolean = true) => {
      startOneLoadingThread();
      const componentParam: ParameterState = getComponentState(
        store.getState()
      );

      // Use standard param to get fields you need, record is stored in redux,
      // set page so that it returns fewer records
      const paramPaged = createSearchParamFrom(componentParam, {
        pagesize: DEFAULT_SEARCH_PAGE,
      });

      dispatch(fetchResultWithStore(paramPaged)).then(() => {
        // Use a different parameter so that it return id and bbox only and do not store the values,
        // we cannot add page because we want to show all record on map
        const paramNonPaged = createSearchParamFrom(componentParam);
        dispatch(
          // add param "sortby: id" for fetchResultNoStore to ensure data source for map is always sorted
          // and ordered by uuid to avoid affecting cluster calculation
          fetchResultNoStore({
            ...paramNonPaged,
            properties: "id,bbox",
            sortby: "id",
          })
        )
          .unwrap()
          .then((collections) => {
            setLayers(collections.collections);
          })
          .then(() => {
            if (needNavigate) {
              navigate(
                pageDefault.search + "?" + formatToUrlParam(componentParam),
                {
                  state: {
                    fromNavigate: true,
                    requireSearch: false,
                    referer: "SearchPage",
                  },
                }
              );
            }
          })
          .finally(() => {
            endOneLoadingThread();
          });
      });
    },
    [startOneLoadingThread, dispatch, navigate, endOneLoadingThread]
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
          dispatch(updateFilterPolygon(polygon));
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
        setBbox(paramState.polygon?.bbox as LngLatBoundsLike);

        doSearch();
      }
    } else {
      if (location.state?.requireSearch) {
        // Explicitly call search from navigation, so you just need search
        // but do not navigate again.
        doSearch(false);
      }
    }
  }, [location, dispatch, doSearch]);

  const handleNavigateToDetailPage = useCallback(
    (uuid: string) => {
      const searchParams = new URLSearchParams();
      searchParams.append("uuid", uuid);
      navigate(pageDefault.details + "?" + searchParams.toString());
    },
    [navigate]
  );

  const onChangeSorting = useCallback(
    (v: SortResultEnum) => {
      switch (v) {
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

  const handleClickCard = useCallback(
    (uuid: string) => {
      handleDatasetSelecting([uuid]);
    },
    [handleDatasetSelecting]
  );

  // You will see this trigger twice, this is due to use of strict-mode
  // which is ok.
  // TODO: Optimize call if possible, this happens when navigate from page
  // to this page.
  useEffect(() => handleNavigation(), [handleNavigation]);

  return (
    <Layout>
      <Box
        display="flex"
        flexDirection="row"
        justifyContent="center"
        bgcolor={color.blue.light}
        gap={1}
        padding={2}
      >
        <Grid container flex={1} gap={1}>
          <Grid item xs={12} height={`${SEARCH_BAR_HEIGHT}px`}>
            <ComplexTextSearch />
          </Grid>
          <Grid item xs={12}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "stretch",
                width: "100%",
              }}
              gap={2}
            >
              {visibility === SearchResultLayoutEnum.VISIBLE && (
                <Box>
                  <ResultSection
                    sx={{
                      height: "80vh",
                      width: RESULT_SECTION_WIDTH,
                    }}
                    onVisibilityChanged={onVisibilityChanged}
                    onClickCard={handleClickCard}
                    onDetail={handleNavigateToDetailPage}
                    onChangeSorting={onChangeSorting}
                    datasetsSelected={datasetsSelected}
                    onDownload={navigateToTabAndSection}
                    onLink={navigateToTabAndSection}
                    isLoading={isLoading(loadingThreadCount)}
                  />
                </Box>
              )}
              <Box flex={1}>
                <MapSection
                  sx={{
                    height: "80vh",
                  }}
                  collections={layers}
                  bbox={bbox}
                  showFullMap={visibility === SearchResultLayoutEnum.INVISIBLE}
                  selectedUuids={selectedUuids}
                  onMapZoomOrMove={onMapZoomOrMove}
                  onToggleClicked={onToggleDisplay}
                  onDatasetSelected={handleDatasetSelecting}
                  isLoading={isLoading(loadingThreadCount)}
                  onNavigateToDetail={handleNavigateToDetailPage}
                />
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Layout>
  );
};
export default SearchPage;
