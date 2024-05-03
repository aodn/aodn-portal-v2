import { useState, useEffect } from "react";
import { Map, MapboxEvent } from "mapbox-gl";
import MapContext from "./MapContext";
import "mapbox-gl/dist/mapbox-gl.css";

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
  styleJson: string;
  onZoomEvent?: (
    event: MapboxEvent<MouseEvent | WheelEvent | TouchEvent | undefined>
  ) => void;
  onMoveEvent?: (
    event: MapboxEvent<MouseEvent | WheelEvent | TouchEvent | undefined>
  ) => void;
}

const ReactMap = ({
  panelId,
  styleJson,
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
            style: styleJson,
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

      return () => {
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
    styleJson,
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
  styleJson: "mapbox://styles/mapbox/satellite-streets-v12",
};

export default ReactMap;
