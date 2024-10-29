import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  LngLatBounds,
  LngLatLike,
  Map,
  MapboxEvent,
  Projection,
  Style,
} from "mapbox-gl";
import MapContext from "./MapContext";
import "mapbox-gl/dist/mapbox-gl.css";
import ERSIWorldImagery from "./styles/ESRIWorldImagery.json";
import lodash from "lodash";
import { TestHelper } from "../../common/test/helper";
import { MapDefaultConfig } from "./constants";

interface MapProps {
  centerLongitude?: number;
  centerLatitude?: number;
  bbox?: LngLatBounds;
  zoom?: number;
  minZoom?: number;
  maxZoom?: number;
  panelId: string;
  projection?: Projection | string;
  onZoomEvent?: (
    event: MapboxEvent<MouseEvent | WheelEvent | TouchEvent | undefined>
  ) => void;
  onMoveEvent?: (
    event: MapboxEvent<MouseEvent | WheelEvent | TouchEvent | undefined>
  ) => void;
}

// Styles can be found here https://developers.arcgis.com/rest/basemap-styles/
// but require feeds.
const styles = [
  {
    id: "1",
    name: "Street map (MapBox)",
    style: "mapbox://styles/mapbox/streets-v11",
  },
  {
    id: "2",
    name: "Topographic map (MapBox)",
    style: "mapbox://styles/mapbox/outdoors-v11",
  },
  {
    id: "3",
    name: "Satellite map (MapBox)",
    style: "mapbox://styles/mapbox/satellite-v9",
  },
  {
    id: "4",
    name: "ESRI World Imagery (ArcGIS)",
    style: ERSIWorldImagery as Style,
  },
  // Add more styles as needed
];

const { WEST_LON, EAST_LON, NORTH_LAT, SOUTH_LAT } =
  MapDefaultConfig.BBOX_ENDPOINTS;

const ReactMap = ({
  panelId,
  bbox = new LngLatBounds([WEST_LON, SOUTH_LAT, EAST_LON, NORTH_LAT]),
  zoom = MapDefaultConfig.ZOOM,
  minZoom = MapDefaultConfig.MIN_ZOOM,
  maxZoom = MapDefaultConfig.MAX_ZOOM,
  projection = MapDefaultConfig.PROJECTION,
  onZoomEvent,
  onMoveEvent,
  children,
}: React.PropsWithChildren<MapProps>) => {
  const [map, setMap] = useState<Map | null>(null);

  // Debouce to make the map transit smoother
  const debounceOnZoomEvent = useRef(
    lodash.debounce(
      useCallback(
        async (
          event: MapboxEvent<MouseEvent | WheelEvent | TouchEvent | undefined>
        ) => onZoomEvent && onZoomEvent(event),
        [onZoomEvent]
      ),
      MapDefaultConfig.DEBOUNCE_BEFORE_EVENT_FIRE
    )
  ).current;

  const debounceOnMoveEvent = useRef(
    lodash.debounce(
      useCallback(
        async (
          event: MapboxEvent<MouseEvent | WheelEvent | TouchEvent | undefined>
        ) => onMoveEvent && onMoveEvent(event),
        [onMoveEvent]
      ),
      MapDefaultConfig.DEBOUNCE_BEFORE_EVENT_FIRE
    )
  ).current;

  useEffect(() => {
    setMap((m) =>
      m === null
        ? (new Map({
            container: panelId,
            accessToken: import.meta.env.VITE_MAPBOX_ACCESS_TOKEN,
            style: styles[MapDefaultConfig.DEFAULT_STYLE].style,
            minZoom: minZoom,
            maxZoom: maxZoom,
            testMode: import.meta.env.MODE === "dev",
            localIdeographFontFamily:
              "'Noto Sans', 'Noto Sans CJK SC', sans-serif",
          }) as Map)
        : m
    );

    if (map !== null) {
      map.setProjection(projection);
      // Stop drag cause map to rotate.
      map.dragRotate.disable();

      // If exist fit the map to this area, this useful if url pass around and
      // the bbox in the url is not the default area of the map
      map.on("movestart", () => debounceOnZoomEvent.cancel());
      map.on("zoomestart", () => debounceOnZoomEvent.cancel());

      map.on("zoomend", debounceOnZoomEvent);
      map.on("moveend", debounceOnMoveEvent);

      // Create a resize observer to the canvas so we know if its size have changed
      // and we need to redraw the map
      const resizeObserver = new ResizeObserver((entries) =>
        // https://stackoverflow.com/questions/70533564/mapbox-gl-flickers-when-resizing-the-container-div
        setTimeout(() => map.resize(), 0.1)
      );
      resizeObserver.observe(map.getContainer());

      return () => {
        resizeObserver.unobserve(map.getContainer());
        map.off("zoomend", debounceOnZoomEvent);
        map.off("moveend", debounceOnMoveEvent);

        // This cleanup all associated resources include controls, so no need to
        // call removeControl()
        map.remove();
        setMap(null);
      };
    }
  }, [
    panelId,
    projection,
    map,
    onZoomEvent,
    onMoveEvent,
    debounceOnZoomEvent,
    debounceOnMoveEvent,
    minZoom,
    maxZoom,
  ]);

  useEffect(() => {
    // The map center is use to set the initial center point, however we may need
    // to set to other place, for example if the user pass the url to someone
    if (bbox && map) {
      // Turn off event to avoid looping
      map.off("zoomend", debounceOnZoomEvent);
      map.off("moveend", debounceOnMoveEvent);
      // DO NOT use fitBounds(), it will cause the zoom and padding adjust so
      // you end up map area drift.
      map.jumpTo({
        center: bbox.getCenter(),
        zoom: zoom,
        padding: { top: 0, bottom: 0, left: 0, right: 0 },
      });
      map.on("idle", () => {
        map.on("zoomend", debounceOnZoomEvent);
        map.on("moveend", debounceOnMoveEvent);
      });
    }
  }, [bbox, zoom, map, debounceOnZoomEvent, debounceOnMoveEvent]);

  return (
    map && (
      <MapContext.Provider value={{ map }}>
        <TestHelper getMap={() => map} />
        {children}
      </MapContext.Provider>
    )
  );
};

export default ReactMap;

export { styles, MapDefaultConfig as MapDefault };
