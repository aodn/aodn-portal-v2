import React, { useState, useEffect, useCallback, useRef } from "react";
import { Map, MapboxEvent, Style } from "mapbox-gl";
import MapContext from "./MapContext";
import "mapbox-gl/dist/mapbox-gl.css";
import ERSIWorldImagery from "./styles/ESRIWorldImagery.json";
import loadash from "lodash";

interface MapProps {
  centerLongitude?: number;
  centerLatitude?: number;
  zoom?: number;
  panelId: string;
  projection?:
    | "mercator"
    | "globe"
    | "albers"
    | "equalEarth"
    | "equirectangular"
    | "lambertConformalConic"
    | "naturalEarth"
    | "winkelTripel";
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

const defaultStyle = 3;

// Magic number, try and error by experience
const DEBOUNCE_BEFORE_EVENT_FIRE = 1250;

const ReactMap = ({
  panelId,
  centerLongitude = 147.3353554138993,
  centerLatitude = -42.88611707886841,
  zoom = 4,
  projection = "equirectangular",
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
      DEBOUNCE_BEFORE_EVENT_FIRE
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
      DEBOUNCE_BEFORE_EVENT_FIRE
    )
  ).current;

  useEffect(() => {
    setMap((m) =>
      m === null
        ? (new Map({
            container: panelId,
            accessToken: import.meta.env.VITE_MAPBOX_ACCESS_TOKEN,
            style: styles[defaultStyle].style,
            center: [centerLongitude, centerLatitude],
            zoom: zoom,
            localIdeographFontFamily:
              "'Noto Sans', 'Noto Sans CJK SC', sans-serif",
          }) as Map)
        : m
    );

    if (map !== null) {
      // const zoomEvent = (
      //   e: MapboxEvent<MouseEvent | WheelEvent | TouchEvent | undefined>
      // ) => onZoomEvent && onZoomEvent(e);

      // const moveEvent = (
      //   e: MapboxEvent<MouseEvent | WheelEvent | TouchEvent | undefined>
      // ) => onMoveEvent && onMoveEvent(e);

      map.setProjection(projection);
      // Stop drag cause map to rotate.
      map.dragRotate.disable();

      map.on("movestart", () => debounceOnZoomEvent.cancel());
      map.on("zoomestart", () => debounceOnZoomEvent.cancel());

      map.on("zoomend", debounceOnZoomEvent);
      map.on("moveend", debounceOnMoveEvent);

      // Create a resize observer to the canvas so we know if its size have changed
      // and we need to redraw the map
      const resizeObserver = new ResizeObserver((entries) =>
        // https://stackoverflow.com/questions/70533564/mapbox-gl-flickers-when-resizing-the-container-div
        setTimeout(() => map.resize(), 0)
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

  return (
    map && <MapContext.Provider value={{ map }}>{children}</MapContext.Provider>
  );
};

export default ReactMap;

export { styles, defaultStyle };
