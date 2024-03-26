import { useState, useCallback } from "react";
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
} from "../components/common/store/searchReducer";
import { ResultCards } from "../components/result/ResultCards";
import Layout from "../components/layout/layout";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  ParameterState,
  updateFilterPolygon,
} from "../components/common/store/componentParamReducer";
import store, {
  AppDispatch,
  getComponentState,
  RootState,
  searchQueryResult,
} from "../components/common/store/store";
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
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const [layers, setLayers] = useState<Array<OGCCollection>>([]);
  const contents = useSelector<RootState, CollectionsQueryType>(
    searchQueryResult
  );

  const onMapZoom = useCallback(
    (event: MapEvent<MouseEvent | WheelEvent | TouchEvent | undefined>) => {
      if (event.type === "zoomend") {
        const bounds = event.target.getBounds();
        const ne = bounds.getNorthEast(); // NorthEast corner
        const sw = bounds.getSouthWest(); // SouthWest corner

        // Note order: longitude, latitude.2
        const polygon = turf.bboxPolygon([sw.lng, sw.lat, ne.lng, ne.lat]);
        dispatch(updateFilterPolygon(polygon));

        const componentParam: ParameterState = getComponentState(
          store.getState()
        );
        dispatch(fetchResultWithStore(createSearchParamFrom(componentParam)))
          .unwrap()
          .then((collections) => {
            const ids = collections.collections.map((c) => c.id);
            // remove map uuid not exist in the ids
            setLayers((v) => v.filter((i) => ids.includes(i.id)));
          })
          .then((v) => navigate("/search"));
      }
    },
    [dispatch, navigate, setLayers]
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
        <Grid item xs={12}>
          <SimpleTextSearch />
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
