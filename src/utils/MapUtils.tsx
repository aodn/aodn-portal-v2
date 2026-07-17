import { Root } from "react-dom/client";
import {
  LngLat,
  LngLatBoundsLike,
  Map as MapboxMap,
  MercatorCoordinate,
} from "mapbox-gl";
import { Position } from "geojson";
import { OGCCollection } from "../components/common/store/OGCCollectionDefinitions";
import { MapDefaultConfig } from "../components/map/mapbox/constants";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import { DRAW_RECTANGLE_MODE } from "../components/map/mapbox/controls/menu/DrawRect";

const DEFAULT_MAPBOX_TEXT_FONT = [
  "Open Sans Regular",
  "Arial Unicode MS Regular",
] as const;

const isFontWeightAtLeastMedium = (
  fontWeight: number | string | undefined
): boolean => {
  if (fontWeight === undefined || fontWeight === "") return false;
  const n =
    typeof fontWeight === "number"
      ? fontWeight
      : Number.parseInt(String(fontWeight), 10);
  return !Number.isNaN(n) && n >= 500;
};

/**
 * Mapbox symbol `layout["text-font"]` must list glyph font names from the active map style,
 * not browser CSS `font-family` values. This maps common RC8 / token stacks to the Open Sans
 * and Arial Unicode faces used elsewhere in this app (`MapboxWorldLayer`, `SpatialExtents`, etc.).
 *
 * @param cssFontFamily - CSS `font-family` string (may include `var()`, quotes, fallbacks).
 * @param options.fontWeight - MUI / CSS weight; values ≥ 500 pick a bolder Mapbox stack when available.
 */
export const cssFontFamilyToMapboxTextFont = (
  cssFontFamily: string | undefined,
  options?: { fontWeight?: number | string }
): string[] => {
  const bold = isFontWeightAtLeastMedium(options?.fontWeight);
  const s = (cssFontFamily ?? "").toLowerCase();

  if (s.includes("din")) {
    return ["DIN Offc Pro Medium", "Arial Unicode MS Bold"];
  }

  if (s.includes("open sans") || s.includes("poppins")) {
    return bold
      ? ["Open Sans Semibold", "Arial Unicode MS Bold"]
      : ["Open Sans Regular", "Arial Unicode MS Regular"];
  }

  return [...DEFAULT_MAPBOX_TEXT_FONT];
};

// Constants with explanations
/**
 * Default base zoom level - represents approximately country/region level detail
 * Mapbox zoom levels typically range from 0 (world view) to 22 (building details)
 */
const DEFAULT_BASE_ZOOM = 8;

/**
 * Expected number of coordinates in a valid bounding box
 * [west, south, east, north] format
 */
const BBOX_COORDINATES_COUNT = 4;

const worldSize = 40075016.68; // Full projected width/height in meters
const half = worldSize / 2;

// Keep east greater than west for bbox crossing the antimeridian,
// otherwise cameraForBounds fits the opposite side of the globe
const ensureEastGreaterThanWest = (west: number, east: number): number =>
  east < west ? east + 360 : east;

const AUSTRALIA_CENTER_LNG =
  (MapDefaultConfig.BBOX_ENDPOINTS.WEST_LON +
    MapDefaultConfig.BBOX_ENDPOINTS.EAST_LON) /
  2;

// Only recentre when the bbox actually reaches Australia's longitudes,
// otherwise data such as an Atlantic-hemisphere bbox would end up off-screen
const overlapsAustraliaLng = (west: number, east: number): boolean => {
  const { WEST_LON, EAST_LON } = MapDefaultConfig.BBOX_ENDPOINTS;
  return (
    Math.max(west, WEST_LON) <= Math.min(east, EAST_LON) ||
    // for bboxes unwrapped past 180, Australia repeats at +360
    Math.max(west, WEST_LON + 360) <= Math.min(east, EAST_LON + 360)
  );
};

// A bbox this wide (or tall — catches degenerate metadata like
// [180, -71, 180, 63]) fits at world-level zoom anyway, so the view is
// centred on Australia instead of the bbox's own centre
const WORLD_SCALE_LNG_SPAN = 180;
const WORLD_SCALE_LAT_SPAN = 90;

const isWorldScale = (
  west: number,
  south: number,
  east: number,
  north: number
): boolean =>
  east - west >= WORLD_SCALE_LNG_SPAN || north - south >= WORLD_SCALE_LAT_SPAN;

/**
 * Fits the map view to the specified bounding box with intelligent zoom calculation
 * based on the map container's dimensions.
 * TODO: This temporary resolve fitting map to bound cut off problem, can refactor if have better solution
 *
 * @param map - The Mapbox map instance
 * @param bbox - Array of positions representing the bounding box
 * @param options - Additional options for fitting the bbox
 * @returns void
 */
export const fitToBound = (
  map: MapboxMap | null | undefined,
  bbox: Position | undefined,
  options: {
    animate?: boolean;
    baseZoom?: number;
  } = {}
): void => {
  // Default options
  const { animate = false, baseZoom = DEFAULT_BASE_ZOOM } = options;

  if (!map || !bbox || !bbox.length) {
    console.error("Invalid map or bbox:", { map, bbox });
    return;
  }

  try {
    map.resize();

    const boundsArray = bbox as number[];
    if (boundsArray && boundsArray.length === BBOX_COORDINATES_COUNT) {
      const [west, south, rawEast, north] = boundsArray;
      const east = ensureEastGreaterThanWest(west, rawEast);
      const bounds: LngLatBoundsLike = [
        [west, south],
        [east, north],
      ];

      const camera = map.cameraForBounds(bounds, {
        padding: 20, // or zoomOffset equivalent
        maxZoom: baseZoom,
      });
      if (!camera) {
        console.error("cameraForBounds returned no camera for:", bounds);
        return;
      }

      // Use flyTo for more control over the viewport
      map.flyTo({
        // Swap only the lng and keep the computed lat, so high-latitude
        // data (e.g. around Antarctica) stays in view
        center:
          camera.center !== undefined &&
          isWorldScale(west, south, east, north) &&
          overlapsAustraliaLng(west, east)
            ? [AUSTRALIA_CENTER_LNG, LngLat.convert(camera.center).lat]
            : camera.center,
        zoom: camera.zoom,
        animate: animate,
      });
    } else {
      console.error("Invalid bounds format:", boundsArray);
    }
  } catch (error) {
    console.error("Error fitting to bounds:", error);
  }
};

export const safeRemoveControl = (
  container: HTMLDivElement | null,
  root: Root | null
) => {
  // https://github.com/facebook/react/issues/25675#issuecomment-1518272581
  // Keep the old pointer
  if (container?.parentNode) {
    setTimeout(() => {
      container?.parentNode?.removeChild(container);
      container = null;
      root?.unmount();
    });
  }
};

export const overallBoundingBox = (
  collection: OGCCollection | undefined
): Position | undefined => {
  const bbox = collection?.getBBox();
  if (!bbox || !bbox[0] || bbox[0].length !== 4) {
    return [
      MapDefaultConfig.BBOX_ENDPOINTS.WEST_LON,
      MapDefaultConfig.BBOX_ENDPOINTS.SOUTH_LAT,
      MapDefaultConfig.BBOX_ENDPOINTS.EAST_LON,
      MapDefaultConfig.BBOX_ENDPOINTS.NORTH_LAT,
    ];
  }
  return bbox[0];
};
/**
 * This is use to check if map have inserted the MapboxDraw control and is current set to draw rectangle mode
 * @param map
 */
export const isDrawModeRectangle = (
  map: MapboxMap | null | undefined
): boolean => {
  if (!map) return false;
  // The control is the instance we added with `map.addControl(draw)`
  const ctrl = map._controls?.find((c: any) => c instanceof MapboxDraw);
  return (ctrl as unknown as MapboxDraw)?.getMode() === DRAW_RECTANGLE_MODE;
};
// Mapbox do not create a bbox box align with EPSG:3857 if you use the bounds value, you need to adjust it
// with functions, however, if you use the url directly with "{bbox-epsg-3857}", then mapbox will do the cal for you.
// in case you are not able to use the "{bbox-epsg-3857}" then you need to do the cal yourself
export const boundingBoxInEpsg3857 = (map: MapboxMap) => {
  const bounds = map.getBounds();
  const sw = bounds?.getSouthWest();
  const ne = bounds?.getNorthEast();

  if (sw && ne) {
    // Project to EPSG:3857 meters
    const sw3857 = MercatorCoordinate.fromLngLat(sw);
    const ne3857 = MercatorCoordinate.fromLngLat(ne);

    const minX = sw3857.x * worldSize - half;
    const maxX = ne3857.x * worldSize - half;
    const maxY = -(ne3857.y * worldSize - half); // south: higher normalized y
    const minY = -(sw3857.y * worldSize - half); // north: lower normalized y

    return [minX, minY, maxX, maxY].join(",");
  }
  return undefined;
};
