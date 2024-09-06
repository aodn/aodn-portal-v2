import { useCallback, useEffect, useMemo, useState } from "react";
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
import { useDispatch } from "react-redux";
import {
  formatToUrlParam,
  ParameterState,
  unFlattenToParameterState,
  updateFilterPolygon,
  updateParameterStates,
  updateSortBy,
} from "../../components/common/store/componentParamReducer";
import store, {
  AppDispatch,
  getComponentState,
} from "../../components/common/store/store";
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
import ResultPanelIconFilter from "../../components/common/filters/ResultPanelIconFilter";
import MapSection from "./subpages/MapSection";
import { color } from "../../styles/constants";
import ComplexTextSearch from "../../components/search/ComplexTextSearch";
import { SearchResultLayoutEnum } from "../../components/common/buttons/MapViewButton";
import { SortResultEnum } from "../../components/common/buttons/ResultListSortButton";
import { bboxPolygon } from "@turf/turf";
import {
  OGCCollection,
  OGCCollections,
} from "../../components/common/store/OGCCollectionDefinitions";
import LoadingModal from "../../components/loading/LoadingModal";

const SEARCH_BAR_HEIGHT = 56;
const RESULT_SECTION_WIDTH = 550;

const SearchPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  // Layers contains record with uuid and bbox only
  const [layers, setLayers] = useState<Array<OGCCollection>>([]);
  const [visibility, setVisibility] = useState<SearchResultLayoutEnum>(
    SearchResultLayoutEnum.VISIBLE
  );
  const [datasetsSelected, setDatasetsSelected] = useState<OGCCollection[]>();
  const [bbox, setBbox] = useState<LngLatBoundsLike | undefined>(undefined);

  // please don't set this state directly. Use startLoading() and endLoading() instead
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const onMapMoveLoadingTag = "on map move loading";

  //the search page may have multiple loadings simutaniously. So the buffer here
  // is to control them. On the other hand, because of debounce and rendering time,
  // the search page triggers a "map move" very late (a couple of seconds after
  // the searchpage rendered), and we don't want users to touch anything until
  // the onMapZoomOrMove() is fully completed. So assume the
  // "onMapZoomOrMove()" start to run at the very begining to make sure the
  // loading modal still appear
  const loadingThreadBuffer: string[] = useMemo(
    () => [onMapMoveLoadingTag],
    []
  );
  const startLoading = useCallback(
    (tag: string) => {
      loadingThreadBuffer.push(tag);
      setIsLoading(true);
    },
    [loadingThreadBuffer]
  );
  const endLoading = useCallback(
    (tag: string) => {
      // remove the first match element in loadingthreadbuffer
      const index = loadingThreadBuffer.indexOf(tag);
      if (index !== -1) {
        loadingThreadBuffer.splice(index, 1);
      }
      if (loadingThreadBuffer.length === 0) {
        setIsLoading(false);
      }
      if (loadingThreadBuffer.length < 0) {
        throw new Error("aaa Loading thread count is negative");
      }
    },
    [loadingThreadBuffer]
  );

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
        properties: "id,title,description",
      };
      return dispatch(fetchResultNoStore(param))
        .unwrap()
        .then((res: OGCCollections) => res.collections)
        .catch((error: any) => {
          console.error("Error fetching collection data:", error);
          // TODO: handle error in ErrorBoundary
        });
    },
    [dispatch]
  );

  const onDatasetSelected = useCallback(
    async (uuids: Array<string>) => {
      if (Array.isArray(uuids) && uuids.length === 0) {
        setDatasetsSelected([]);
        return;
      }
      const collections = await getCollectionsData(uuids);
      if (collections) setDatasetsSelected(collections);
    },
    [getCollectionsData]
  );

  const doSearch = useCallback(
    async (needNavigate: boolean = true): Promise<void> => {
      const loadingTag = "do search";
      startLoading(loadingTag);
      const componentParam: ParameterState = getComponentState(
        store.getState()
      );

      // Use standard param to get fields you need, record is stored in redux,
      // set page so that it returns fewer records
      const paramPaged = createSearchParamFrom(componentParam, {
        pagesize: DEFAULT_SEARCH_PAGE,
      });

      await dispatch(fetchResultWithStore(paramPaged));
      // Use a different parameter so that it returns id and bbox only and do not store the values,
      // we cannot add page because we want to show all record on map
      const paramNonPaged = createSearchParamFrom(componentParam);
      const collections = await dispatch(
        // add param "sortby: id" for fetchResultNoStore to ensure data source for map is always sorted
        // and ordered by uuid to avoid affecting cluster calculation
        fetchResultNoStore({
          ...paramNonPaged,
          properties: "id,bbox",
          sortby: "id",
        })
      ).unwrap();

      setLayers(collections.collections);

      if (needNavigate) {
        navigate(pageDefault.search + "?" + formatToUrlParam(componentParam), {
          state: {
            fromNavigate: true,
            requireSearch: false,
            referer: "SearchPage",
          },
        });
      }
      endLoading(loadingTag);
    },
    [dispatch, endLoading, navigate, startLoading]
  );
  // The result will be changed based on the zoomed area, that is only
  // dataset where spatial extends fall into the zoomed area will be selected.
  const onMapZoomOrMove = useCallback(
    (event: MapEvent<MouseEvent | WheelEvent | TouchEvent | undefined>) => {
      if (!loadingThreadBuffer.includes(onMapMoveLoadingTag)) {
        loadingThreadBuffer.push(onMapMoveLoadingTag);
      }

      if (event.type === "zoomend" || event.type === "moveend") {
        const bounds = event.target.getBounds();
        const ne = bounds.getNorthEast(); // NorthEast corner
        const sw = bounds.getSouthWest(); // SouthWest corner
        // Note order: longitude, latitude.2
        const polygon = bboxPolygon([sw.lng, sw.lat, ne.lng, ne.lat]);
        dispatch(updateFilterPolygon(polygon));
        doSearch().then(() => endLoading(onMapMoveLoadingTag));
      }
    },
    [dispatch, doSearch, endLoading, loadingThreadBuffer]
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

        doSearch().then();
      }
    } else {
      if (location.state?.requireSearch) {
        // Explicitly call search from navigation, so you just need search
        // but do not navigate again.
        doSearch(false).then();
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
          dispatch(updateSortBy([{ field: "score", order: "DESC" }]));
          break;

        case SortResultEnum.TITLE:
          dispatch(updateSortBy([{ field: "title", order: "ASC" }]));
          break;

        case SortResultEnum.POPULARITY:
          //TODO: need ogcapi change
          break;

        case SortResultEnum.MODIFIED:
          dispatch(updateSortBy([{ field: "temporal", order: "DESC" }]));
          break;
      }

      doSearch().then();
    },
    [dispatch, doSearch]
  );

  // You will see this trigger twice, this is due to use of strict-mode
  // which is ok.
  // TODO: Optimize call if possible, this happens when navigate from page
  // to this page.
  useEffect(() => handleNavigation(), [handleNavigation]);

  return (
    <Layout>
      <LoadingModal isLoading={isLoading} />
      <Box
        display="flex"
        flexDirection="row"
        justifyContent="center"
        bgcolor={color.blue.light}
        gap={1}
        padding={2}
      >
        <Box paddingTop={`${SEARCH_BAR_HEIGHT}px`}>
          <ResultPanelIconFilter />
        </Box>
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
                    onClickCard={handleNavigateToDetailPage}
                    onChangeSorting={onChangeSorting}
                    datasetSelected={datasetsSelected}
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
                  onMapZoomOrMove={onMapZoomOrMove}
                  onToggleClicked={onToggleDisplay}
                  onDatasetSelected={onDatasetSelected}
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
