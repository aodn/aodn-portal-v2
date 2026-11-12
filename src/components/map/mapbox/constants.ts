import { PopupOptions } from "mapbox-gl";
import { portalTheme } from "@/styles";

export enum MapEventEnum {
  CLICK = "click",
  IDLE = "idle",
  STYLEDATA = "styledata",
  LOAD = "load",
  ZOOM_START = "zoomstart",
  ZOOM_END = "zoomend",
  MOVE_START = "movestart",
  MOVE_END = "moveend",
  RENDER = "render",
}

// Australia-wide view, used as the portal's default map extent
export const AUSTRALIA_BBOX_ENDPOINTS = {
  WEST_LON: 104,
  EAST_LON: 163,
  NORTH_LAT: -8,
  SOUTH_LAT: -43,
};

export const AUSTRALIA_CENTER_LNG =
  (AUSTRALIA_BBOX_ENDPOINTS.WEST_LON + AUSTRALIA_BBOX_ENDPOINTS.EAST_LON) / 2;

export const MapDefaultConfig = {
  // Magic number, try and error by experience
  DEBOUNCE_BEFORE_EVENT_FIRE: 300,
  ZOOM: 3.5,
  ZOOM_TABLET: 3,
  ZOOM_MOBILE: 2,
  MIN_ZOOM: 1,
  MAX_ZOOM: 12,
  PROJECTION: "equirectangular",
  DEFAULT_STYLE: 3,
  BBOX_ENDPOINTS: AUSTRALIA_BBOX_ENDPOINTS,
  DEFAULT_POPUP: {
    closeButton: true,
    closeOnClick: false,
    maxWidth: "500px",
    offset: [0, -5],
  } as PopupOptions,
};

// Blue dot used for a single dataset point, shared by the search page cluster
// layer and the detail page spatial extents
export const SINGLE_POINT_SYMBOLOGY = {
  COLOR: "#56B4E9",
  OPACITY: 1,
  RADIUS: 8,
  STROKE_WIDTH: 1,
  STROKE_COLOR: "#fff",
};

// Two-tone outline for the dataset extent: the dark line and the white line
// below it keep a 3:1 contrast on light, dark and satellite base maps (WCAG 1.4.11)
export const EXTENT_OUTLINE_SYMBOLOGY = {
  COLOR: "#1A1A1A",
  WIDTH: 2,
  CASING_COLOR: "#FFFFFF",
  CASING_WIDTH: 4,
};

const { palette } = portalTheme;

// User-drawn bbox and polygon, as in the Figma detail page design.
// Hex values are design colours that are not in the portal theme.
export const DRAW_SELECTION_SYMBOLOGY = {
  BADGE_COLOR: palette.primary1,
  // Bounding box: white dashed line on an amber fill
  BBOX: {
    COLOR: palette.common.white,
    WIDTH: 1.5,
    DASH_PX: [4, 4],
    FILL_COLOR: "#E9BD6A",
    FILL_OPACITY: 0.4,
  },
  // Polygon while drawing: edges up to the cursor are solid, the closing edge is dashed
  POLYGON_DRAWING: {
    COLOR: "#FFEBA1",
    WIDTH: 3,
    CLOSING_DASH_PX: [6, 6],
    FILL_COLOR: "#FFEBA1",
    FILL_OPACITY: 0.4,
  },
  // Polygon when finished: light blue line, purple fill on top of the drawing fill
  POLYGON_DONE: {
    COLOR: "#C1F0F9",
    WIDTH: 3,
    FILL_COLOR: "#756AE9",
    FILL_OPACITY: 0.4,
  },
  // Corner handles shown while drawing or editing
  CORNER: {
    RADIUS: 6.78,
    COLOR: "#4C5DB2",
    STROKE_COLOR: palette.common.white,
    STROKE_WIDTH: 1.8,
    SHADOW_COLOR: palette.common.black,
    SHADOW_OPACITY: 0.25,
    SHADOW_BLUR: 7.2,
  },
};

export const ComponentId = {
  MapLayerSwitcher: {
    Menu: "layer-show-hide-menu",
    MenuButton: "layer-show-hide-menu-button",
    PopperId: "layer-popper-id",
  },
};

export const DataTestId = {
  HeaderSection: {
    ReturnButton: "return-button",
    PageTitle: "detail-page-title",
    AiUpdateFrequencyChip: "ai-update-frequency-chip",
  },
  MapLayerSwitcher: {
    RadioGroup: "layer-style-menu-items",
  },
  BaseMapSwitcher: {
    MenuId: "basemap-show-hide-menu-button",
  },
};
