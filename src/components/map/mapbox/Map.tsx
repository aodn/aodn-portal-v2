import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  LngLatBounds,
  LngLatBoundsLike,
  Map,
  MapboxEvent,
  Projection,
  Style,
} from "mapbox-gl";
import MapContext from "./MapContext";
import "mapbox-gl/dist/mapbox-gl.css";
import ERSIWorldImagery from "./styles/ESRIWorldImagery.json";
import loadash from "lodash";
import { TestHelper } from "../../common/test/helper";

interface MapProps {
  centerLongitude?: number;
  centerLatitude?: number;
  bbox?: LngLatBoundsLike;
  zoom?: number;
  panelId: string;
  projection?: Projection | string;
  onZoomEvent?: (
    event: MapboxEvent<MouseEvent | WheelEvent | TouchEvent | undefined>
  ) => void;
  onMoveEvent?: (
    event: MapboxEvent<MouseEvent | WheelEvent | TouchEvent | undefined>
  ) => void;
}

const MapDefault = {
  // Magic number, try and error by experience
  DEBOUNCE_BEFORE_EVENT_FIRE: 1250,
  CENTER_LONGITUDE: 147.3353554138993,
  CENTER_LATITUDE: -42.88611707886841,
  ZOOM: 4,
  PROJECTION: "equirectangular",
  DEFAULT_STYLE: 3,
};

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

const ReactMap = ({
  panelId,
  centerLongitude = MapDefault.CENTER_LONGITUDE,
  centerLatitude = MapDefault.CENTER_LATITUDE,
  bbox,
  zoom = MapDefault.ZOOM,
  projection = MapDefault.PROJECTION,
  onZoomEvent,
  onMoveEvent,
  children,
}: React.PropsWithChildren<MapProps>) => {
  const [map, setMap] = useState<Map | null>(null);

  // Debouce to make the map transit smoother
  const debounceOnZoomEvent = useRef(
    loadash.debounce(
      useCallback(
        async (
          event: MapboxEvent<MouseEvent | WheelEvent | TouchEvent | undefined>
        ) => onZoomEvent && onZoomEvent(event),
        [onZoomEvent]
      ),
      MapDefault.DEBOUNCE_BEFORE_EVENT_FIRE
    )
  ).current;

  const debounceOnMoveEvent = useRef(
    loadash.debounce(
      useCallback(
        async (
          event: MapboxEvent<MouseEvent | WheelEvent | TouchEvent | undefined>
        ) => onMoveEvent && onMoveEvent(event),
        [onMoveEvent]
      ),
      MapDefault.DEBOUNCE_BEFORE_EVENT_FIRE
    )
  ).current;

  useEffect(() => {
    setMap((m) =>
      m === null
        ? (new Map({
            container: panelId,
            accessToken: import.meta.env.VITE_MAPBOX_ACCESS_TOKEN,
            style: styles[MapDefault.DEFAULT_STYLE].style,
            center: [centerLongitude, centerLatitude],
            zoom: zoom,
            maxZoom: 14,
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

        {
          const entry = entries[0];
          if (entry && entry.contentRect) {
            const { width, height } = entry.contentRect;

            // The below check is used to prevent unexpected triggering the resize
            // event from some rerendering which only have slightly different size
            if (
              Math.abs(map.getContainer().clientWidth - width) > 1 ||
              Math.abs(map.getContainer().clientHeight - height) > 1
            ) {
              setTimeout(() => map.resize(), 0);
            }
          }
        }
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
    centerLatitude,
    centerLongitude,
    panelId,
    zoom,
    projection,
    map,
    onZoomEvent,
    onMoveEvent,
    debounceOnZoomEvent,
    debounceOnMoveEvent,
  ]);

  useEffect(() => {
    // The map center is use to set the initial center point, however we may need
    // to set to other place, for example if the user pass the url to someone
    bbox &&
      map &&
      map.setCenter(
        new LngLatBounds(bbox as [number, number, number, number]).getCenter()
      );
  }, [bbox, map]);

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

export { styles, MapDefault };
