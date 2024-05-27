import { useCallback, useEffect, useState } from "react";
import SimpleTextSearch from "../components/search/SimpleTextSearch";
import { Grid } from "@mui/material";
import {
  CollectionsQueryType,
  createSearchParamFrom,
  fetchResultWithStore,
  OGCCollection,
} from "../components/common/store/searchReducer";
import Layout from "../components/layout/layout";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  formatToUrlParam,
  ParameterState,
  unFlattenToParameterState,
  updateFilterPolygon,
  updateParameterStates,
} from "../components/common/store/componentParamReducer";
import store, {
  AppDispatch,
  getComponentState,
  RootState,
  searchQueryResult,
} from "../components/common/store/store";
import { pageDefault } from "../components/common/constants";
import * as turf from "@turf/turf";

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
import { MapboxEvent as MapEvent } from "mapbox-gl";
import SearchPageResultList, {
  SearchResultLayoutEnum,
} from "../components/subpage/SearchPageResultList";
import ResultPanelIconFilter from "../components/common/filters/ResultPanelIconFilter";
import SearchPageMap from "../components/subpage/SearchPageMap";

const mapContainerId = "map-container-id";

const SearchPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [resultLayout, setResultLayout] = useState<SearchResultLayoutEnum>(
    SearchResultLayoutEnum.LIST
  );
  const [isShowingResult, setIsShowingResult] = useState<boolean>(true);

  // Layers inside this array will be add to map
  const [layers, setLayers] = useState<Array<OGCCollection>>([]);

  const doSearch = useCallback(() => {
    const componentParam: ParameterState = getComponentState(store.getState());
    dispatch(fetchResultWithStore(createSearchParamFrom(componentParam)))
      .unwrap()
      .then((collections) => {
        const ids = collections.collections.map((c) => c.id);
        //Remove map uuid not exist in the ids
        setLayers((v) => v.filter((i) => ids.includes(i.id)));
      })
      .then((v) =>
        navigate(pageDefault.search + "?" + formatToUrlParam(componentParam), {
          state: { fromNavigate: true },
        })
      );
  }, [dispatch, navigate, setLayers]);

  // The result will be changed based on the zoomed area, that is only
  // dataset where spatial extends fall into the zoomed area will be selected.
  const onMapZoomOrMove = useCallback(
    (event: MapEvent<MouseEvent | WheelEvent | TouchEvent | undefined>) => {
      if (event.type === "zoomend" || event.type === "moveend") {
        const bounds = event.target.getBounds();
        const ne = bounds.getNorthEast(); // NorthEast corner
        const sw = bounds.getSouthWest(); // SouthWest corner

        // Note order: longitude, latitude.2
        const polygon = turf.bboxPolygon([sw.lng, sw.lat, ne.lng, ne.lat]);
        dispatch(updateFilterPolygon(polygon));
        doSearch();
      }
    },
    [dispatch, doSearch]
  );

  const onRemoveLayer = useCallback(
    (
      event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
      collection: OGCCollection
    ) => {
      // Remove the layer if found
      setLayers((v) => v.filter((i) => i.id !== collection.id));
    },
    [setLayers]
  );
  // If this flag is set, that means it is call from within react
  // and the search status already refresh and useSelector contains
  // the correct values, else it is user paste the url directly
  // and content may not refreshed
  if (!location.state?.fromNavigate) {
    // The first char is ? in the search string, so we need to remove it.
    const param = location?.search.substring(1);
    if (param !== null) {
      const paramState: ParameterState = unFlattenToParameterState(param);
      dispatch(updateParameterStates(paramState));
      doSearch();
    }
  }

  // Get contents when no more navigate needed.
  const contents = useSelector<RootState, CollectionsQueryType>(
    searchQueryResult
  );

  // Now set the first 10 layers on map, will cause map big issue but
  // we want to see how things go.
  useEffect(
    () => setLayers(contents.result.collections.slice(0, 10)),
    [contents]
  );

  return (
    <Layout>
      <Grid
        container
        spacing={2}
        sx={{
          backgroundImage: "url(/bg_search_results.png)",
          backgroundSize: "cover",
        }}
      >
        <Grid container item xs={12}>
          <Grid item xs={1} />
          <Grid item xs={10}>
            <SimpleTextSearch />
          </Grid>
          <Grid item xs={1} />
        </Grid>
        <Grid item xs={1}>
          <ResultPanelIconFilter />
        </Grid>
        {isShowingResult ? (
          <>
            <SearchPageResultList
              contents={contents}
              onRemoveLayer={onRemoveLayer}
              layout={resultLayout}
              setLayout={setResultLayout}
              setIsShowingResult={setIsShowingResult}
            />
            <SearchPageMap
              onMapZoomOrMove={onMapZoomOrMove}
              isShowingResult={isShowingResult}
              setIsShowingResult={setIsShowingResult}
            />
          </>
        ) : (
          <SearchPageMap
            onMapZoomOrMove={onMapZoomOrMove}
            isShowingResult={isShowingResult}
            setIsShowingResult={setIsShowingResult}
          />
        )}
      </Grid>
    </Layout>
  );
};

export default SearchPage;
