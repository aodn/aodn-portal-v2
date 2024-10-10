import { BBox } from "geojson";
import { LngLatLike } from "mapbox-gl";

export const MapDefaultConfig = {
  // Magic number, try and error by experience
  DEBOUNCE_BEFORE_EVENT_FIRE: 700,
  BBOX: [111.4, -44.5, 155.8, -7.0] as BBox,
  POLYGON: [
    [
      [111.4, -44.5],
      [155.8, -44.5],
      [155.8, -7.0],
      [111.4, -7.0],
      [111.4, -44.5],
    ],
  ],
  MIN_ZOOM: 1,
  MAX_ZOOM: 12,
  PROJECTION: "equirectangular",
  DEFAULT_STYLE: 3,
};
