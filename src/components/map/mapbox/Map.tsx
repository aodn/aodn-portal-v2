import React, { useState, useEffect, useContext } from "react";
import { Map, MapboxEvent, Style } from "mapbox-gl";
import MapContext from "./MapContext";
import "mapbox-gl/dist/mapbox-gl.css";
import ERSIWorldImagery from "./styles/ESRIWorldImagery.json";

interface MapProps {
  centerLongitude: number;
  centerLatitude: number;
  zoom: number;
  panelId: string;
  projection:
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

const ReactMap = ({
  panelId,
  centerLongitude,
  centerLatitude,
  zoom,
  projection,
  onZoomEvent,
  onMoveEvent,
  children,
}: React.PropsWithChildren<MapProps>) => {
  const [map, setMap] = useState<Map | null>(null);

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
      const zoomEvent = (
        e: MapboxEvent<MouseEvent | WheelEvent | TouchEvent | undefined>
      ) => onZoomEvent && onZoomEvent(e);

      const moveEvent = (
        e: MapboxEvent<MouseEvent | WheelEvent | TouchEvent | undefined>
      ) => onMoveEvent && onMoveEvent(e);

      map.setProjection(projection);
      // Stop drag cause map to rotate.
      map.dragRotate.disable();

      map.on("zoomend", zoomEvent);
      map.on("moveend", moveEvent);

      // Create a resize observer to the canvas so we know if its size have changed
      // and we need to redraw the map
      const canvas = document.getElementById(panelId);
      const resizeObserver = new ResizeObserver((entries) => map.resize());
      resizeObserver.observe(canvas);

      return () => {
        resizeObserver.unobserve(canvas);
        map.off("zoomend", zoomEvent);
        map.off("moveend", moveEvent);

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
  ]);

  return (
    map && <MapContext.Provider value={{ map }}>{children}</MapContext.Provider>
  );
};

ReactMap.defaultProps = {
  centerLatitude: -42.88611707886841,
  centerLongitude: 147.3353554138993,
  zoom: 4,
  projection: "equirectangular",
};

export default ReactMap;

export { styles, defaultStyle };
