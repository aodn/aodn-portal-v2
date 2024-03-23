import { useState, useEffect } from "react";
import { Box } from "@mui/material";
import mapboxgl, { Map, MapboxEvent } from 'mapbox-gl';
import MapContext from "./MapContext";
 
mapboxgl.accessToken = 'myz@dkf-MCR3nkq4twd';

interface MapProps {
  centerLongitude: number;
  centerLatitude: number;
  zoom: number;
  panelId: string;
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
  onZoomEvent,
  children,
}: React.PropsWithChildren<MapProps>) => {
  const [map, setMap] = useState<Map | null>(null);

  useEffect(() => {
    const m = new mapboxgl.Map({
      container: panelId,
      style: styleJson,
      center: [centerLongitude, centerLatitude],
      zoom: zoom,
      localIdeographFontFamily: "'Noto Sans', 'Noto Sans CJK SC', sans-serif",
    }) as Map;

    const z = (
      e: MapboxEvent<MouseEvent | WheelEvent | TouchEvent | undefined>
    ) => onZoomEvent && onZoomEvent(e);

    m.on('zoomend', z);

    setMap(m);

    return () => {
      m.off("zoomend", z);
    };
  }, [centerLatitude, centerLongitude, panelId, styleJson, zoom, onZoomEvent]);

  return (
    map && (
      <MapContext.Provider value={{ map }}>
        <Box>{children}</Box>
      </MapContext.Provider>
    )
  );
};

ReactMap.defaultProps = {
  centerLatitude: -42.88611707886841,
  centerLongitude: 147.3353554138993,
  zoom: 2,
  styleJson: 'mapbox://styles/mapbox/streets-v12',
};

export default ReactMap;