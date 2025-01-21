export const MapDefaultConfig = {
  // Magic number, try and error by experience
  DEBOUNCE_BEFORE_EVENT_FIRE: 700,
  ZOOM: 3.5,
  ZOOM_TABLET: 3,
  ZOOM_MOBILE: 2,
  MIN_ZOOM: 1,
  MAX_ZOOM: 12,
  PROJECTION: "equirectangular",
  DEFAULT_STYLE: 3,
  BBOX_ENDPOINTS: {
    WEST_LON: 104,
    EAST_LON: 163,
    NORTH_LAT: -8,
    SOUTH_LAT: -43,
  },
};
