import { useState, useEffect } from "react";
import { Map, MapboxEvent } from "mapbox-gl";
import MapContext from "./MapContext";
import "mapbox-gl/dist/mapbox-gl.css";

interface MapProps {
  centerLongitude: number;
  centerLatitude: number;
  zoom: number;
  panelId: string;
  projection: string;
  styleJson: string;
  onZoomEvent?: (
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
      const z = (
        e: MapboxEvent<MouseEvent | WheelEvent | TouchEvent | undefined>
      ) => onZoomEvent && onZoomEvent(e);

      map.setProjection(projection);
      map.on("zoomend", z);

      return () => {
        map.off("zoomend", z);
      };
    }
  }, [
    centerLatitude,
    centerLongitude,
    panelId,
    styleJson,
    zoom,
    map,
    onZoomEvent,
  ]);

  return (
    map && <MapContext.Provider value={{ map }}>{children}</MapContext.Provider>
  );
};

ReactMap.defaultProps = {
  centerLatitude: -42.88611707886841,
  centerLongitude: 147.3353554138993,
  zoom: 4,
  styleJson: "mapbox://styles/mapbox/satellite-streets-v12",
  projection: "equirectangular",
};

export default ReactMap;
