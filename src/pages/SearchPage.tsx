import { useCallback, useState } from "react";
import SimpleTextSearch from "../components/search/SimpleTextSearch";
import ResultPanelSimpleFilter, {
  ResultPanelIconFilter,
} from "../components/common/filters/ResultPanelSimpleFilter";
import { Grid, Paper } from "@mui/material";
import {
  CollectionsQueryType,
  createSearchParamFrom,
  fetchResultWithStore,
  OGCCollection,
  SearchParameters,
} from "../components/common/store/searchReducer";
import { ResultCards } from "../components/result/ResultCards";
import Layout from "../components/layout/layout";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  ParameterState,
  updateFilterPolygon,
  updateParameterStates,
  unFlattenToParameterState,
  formatToUrlParam,
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
import Map from "../components/map/mapbox/Map";
import Controls from "../components/map/mapbox/controls/Controls";
import NavigationControl from "../components/map/mapbox/controls/NavigationControl";
import ScaleControl from "../components/map/mapbox/controls/ScaleControl";
import DisplayCoordinate from "../components/map/mapbox/controls/DisplayCoordinate";
import Layers from "../components/map/mapbox/layers/Layers";
import VectorTileLayers from "../components/map/mapbox/layers/VectorTileLayers";
import { MapboxEvent as MapEvent } from "mapbox-gl";

const SearchPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [layers, setLayers] = useState<Array<OGCCollection>>([]);

  const contents = useSelector<RootState, CollectionsQueryType>(
    searchQueryResult
  );

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

  const onMapZoom = useCallback(
    (event: MapEvent<MouseEvent | WheelEvent | TouchEvent | undefined>) => {
      if (event.type === "zoomend") {
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

  const onAddToMap = useCallback(
    (
      event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
      collection: OGCCollection
    ) => {
      // Unique set of layers because we use set, duplicate will be removed
      setLayers((v) => {
        const l = v.filter((i) => i.id !== collection.id);
        l.push(collection);
        return l;
      });
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
        <Grid item xs={4}>
          <ResultPanelSimpleFilter />
          <ResultCards
            contents={contents}
            onAddToMap={onAddToMap}
            onDownload={undefined}
            onTags={undefined}
            onMore={undefined}
          />
        </Grid>
        <Grid item xs={7} sx={{ pr: 2, pb: 2 }}>
          <Paper id="map-container-id" sx={{ minHeight: "726px" }}>
            <Map panelId="map-container-id" onZoomEvent={onMapZoom}>
              <Controls>
                <NavigationControl />
                <DisplayCoordinate />
                <ScaleControl />
              </Controls>
              <Layers>
                <VectorTileLayers collections={layers} />
              </Layers>
            </Map>
          </Paper>
        </Grid>
      </Grid>
    </Layout>
  );
};

export default SearchPage;
