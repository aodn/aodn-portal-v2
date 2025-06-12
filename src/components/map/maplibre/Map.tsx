// import { useState, useEffect } from "react";
// import "maplibre-gl/dist/maplibre-gl.css";
// import MapContext, { MapCombined } from "./MapContext";
// import { Box } from "@mui/material";
// import { Map as MaplibreMap, MapLibreEvent as MapEvent } from "maplibre-gl";
//
// interface MapProps {
//   centerLongitude: number;
//   centerLatitude: number;
//   zoom: number;
//   panelId: string;
//   styleJson: string;
//   onZoomEvent?: (
//     event: MapEvent<MouseEvent | WheelEvent | TouchEvent | undefined>
//   ) => void;
// }
//
// const osmStyle = {
//   version: 8,
//   sources: {
//     "osm-tiles": {
//       type: "raster",
//       tiles: [
//         "https://a.tile.openstreetmap.org/{z}/{x}/{y}.png",
//         "https://b.tile.openstreetmap.org/{z}/{x}/{y}.png",
//         "https://c.tile.openstreetmap.org/{z}/{x}/{y}.png",
//       ],
//       tileSize: 256,
//     },
//   },
//   layers: [
//     {
//       id: "osm-tiles",
//       type: "raster",
//       source: "osm-tiles",
//       minzoom: 0,
//       maxzoom: 22,
//     },
//   ],
// };
//
// const ReactMap = ({
//   panelId,
//   styleJson,
//   centerLongitude,
//   centerLatitude,
//   zoom,
//   onZoomEvent,
//   children,
// }: React.PropsWithChildren<MapProps>) => {
//   const [map, setMap] = useState<MapCombined | null>(null);
//
//   useEffect(() => {
//     const m = new MaplibreMap({
//       container: panelId,
//       style: styleJson,
//       center: [centerLongitude, centerLatitude],
//       zoom: zoom,
//       localIdeographFontFamily: "'Noto Sans', 'Noto Sans CJK SC', sans-serif",
//     }) as MapCombined;
//
//     const z = (e: MapEvent<MouseEvent | WheelEvent | TouchEvent | undefined>) =>
//       onZoomEvent && onZoomEvent(e);
//
//     // https://github.com/maplibre/maplibre-gl-js/issues/2601
//     m.getCanvas().classList.add("mapboxgl-canvas");
//     m.getContainer().classList.add("mapboxgl-map");
//     m.getCanvasContainer().classList.add("mapboxgl-canvas-container");
//     m.getCanvasContainer().classList.add("mapboxgl-interactive");
//     m.on("zoomend", z);
//
//     setMap(m);
//
//     return () => {
//       m.off("zoomend", z);
//     };
//   }, [centerLatitude, centerLongitude, panelId, styleJson, zoom, onZoomEvent]);
//
//   return (
//     map && (
//       <MapContext.Provider value={{ map }}>
//         <Box>{children}</Box>
//       </MapContext.Provider>
//     )
//   );
// };
//
// ReactMap.defaultProps = {
//   centerLatitude: -42.88611707886841,
//   centerLongitude: 147.3353554138993,
//   zoom: 2,
//   //'https://demotiles.maplibre.org/style.json'
//   styleJson: osmStyle,
// };
//
// export default ReactMap;
