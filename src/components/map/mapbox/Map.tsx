import React, { useCallback, useEffect, useRef, useState } from "react";
import { LngLatBounds, Map, MapboxEvent, Projection, Style } from "mapbox-gl";
import MapContext from "./MapContext";
import "mapbox-gl/dist/mapbox-gl.css";
import ERSIWorldImagery from "./styles/ESRIWorldImagery.json";
import lodash from "lodash";
import { TestHelper } from "../../common/test/helper";
import { MapDefaultConfig } from "./constants";

export interface MapBasicType {
  centerLongitude?: number;
  centerLatitude?: number;
  bbox?: LngLatBounds;
  zoom?: number;
  minZoom?: number;
  maxZoom?: number;
  panelId: string;
  animate?: boolean;
  projection?: Projection | string;
  onZoomEvent?: (
    event: MapboxEvent<MouseEvent | WheelEvent | TouchEvent | undefined>
  ) => void;
  onMoveEvent?: (
    event: MapboxEvent<MouseEvent | WheelEvent | TouchEvent | undefined>
  ) => void;
}

interface MapProps extends MapBasicType {}

// Styles can be found here https://developers.arcgis.com/rest/basemap-styles/
// but require feeds.
const styles = [
  {
    id: "1",
    name: "Street map (MapBox)",
    style: "mapbox://styles/mapbox/streets-v12",
  },
  {
    id: "2",
    name: "Topographic map (MapBox)",
    style: "mapbox://styles/mapbox/outdoors-v12",
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
const defaultBbox = new LngLatBounds([
  WEST_LON,
  SOUTH_LAT,
  EAST_LON,
  NORTH_LAT,
]);

const ReactMap = ({
  panelId,
  bbox = defaultBbox,
  zoom = MapDefaultConfig.ZOOM,
  minZoom = MapDefaultConfig.MIN_ZOOM,
  maxZoom = MapDefaultConfig.MAX_ZOOM,
  projection = MapDefaultConfig.PROJECTION,
  animate = false,
  onZoomEvent,
  onMoveEvent,
  children,
}: React.PropsWithChildren<MapProps>) => {
  const [map, setMap] = useState<Map | null>(null);
  const containerRef = useRef<HTMLElement | null>(null);

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

  const initializeMap = useCallback(() => {
    try {
      // Check if container exists
      containerRef.current = document.getElementById(panelId);
      if (!containerRef.current) {
        return null;
      }

      // Create new map instance
      return new Map({
        container: panelId,
        accessToken: import.meta.env.VITE_MAPBOX_ACCESS_TOKEN,
        style: styles[MapDefaultConfig.DEFAULT_STYLE].style,
        minZoom: minZoom,
        maxZoom: maxZoom,
        testMode: import.meta.env.MODE === "dev",
        localIdeographFontFamily: "'Noto Sans', 'Noto Sans CJK SC', sans-serif",
      });
    } catch (err) {
      console.log("Map initialization failed:", err);
    }
  }, [panelId, minZoom, maxZoom]);

  useEffect(() => {
    const setupMap = () => {
      const map = initializeMap();
      if (!map) return;

      map.setProjection(projection);
      // Stop drag cause map to rotate.
      map.dragRotate.disable();

      // If exist fit the map to this area, this useful if url pass around and
      // the bbox in the url is not the default area of the map
      map.on("movestart", () => debounceOnZoomEvent.cancel());
      map.on("zoomestart", () => debounceOnZoomEvent.cancel());

      // Do not setup here, the useEffect block will setup it correctly, if you set it here
      // you will get one extra data load which is of no use.
      // map.on("zoomend", debounceOnZoomEvent);
      // map.on("moveend", debounceOnMoveEvent);

      // Create a resize observer to the canvas so we know if its size have changed
      // and we need to redraw the map
      const resizeObserver = new ResizeObserver((_) =>
        // https://stackoverflow.com/questions/70533564/mapbox-gl-flickers-when-resizing-the-container-div
        setTimeout(() => map?.resize(), 0.1)
      );
      resizeObserver.observe(map.getContainer());

      if (import.meta.env.MODE === "dev") {
        //map.showPadding = true;
        //map.showCollisionBoxes = true;
      }

      setMap(map);

      return () => {
        if (containerRef.current) {
          resizeObserver.unobserve(containerRef.current);
        }
        // We need this when the map destroy
        map.off("zoomend", debounceOnZoomEvent);
        map.off("moveend", debounceOnMoveEvent);
        map.remove();
        setMap(null);
      };
    };

    const cleanup = setupMap();

    return () => {
      cleanup?.();
    };
  }, [initializeMap, projection, debounceOnZoomEvent, debounceOnMoveEvent]);

  useEffect(() => {
    if (!map || !bbox || !containerRef.current?.isConnected) return;
    // Turn off event to avoid looping
    map.off("zoomend", debounceOnZoomEvent);
    map.off("moveend", debounceOnMoveEvent);
    // DO NOT use fitBounds(), it will cause the zoom and padding adjust so
    // you end up map area drift.
    if (animate) {
      map.easeTo({
        center: bbox.getCenter(),
        zoom: zoom,
      });
    } else {
      map.jumpTo({
        center: bbox.getCenter(),
        zoom: zoom,
      });
    }
    map.on("idle", () => {
      map.on("zoomend", debounceOnZoomEvent);
      map.on("moveend", debounceOnMoveEvent);
    });
  }, [bbox, zoom, map, debounceOnZoomEvent, debounceOnMoveEvent, animate]);

  // Only render if map is initialized and container is still connected
  if (!map || !containerRef.current?.isConnected) {
    return null;
  }

  return (
    <MapContext.Provider value={{ map }}>
      <TestHelper mapId={panelId} getMap={() => map} />
      {children}
    </MapContext.Provider>
  );
};

export default ReactMap;

export { styles };
