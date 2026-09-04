import { Root } from "react-dom/client";
import {
  LngLat,
  LngLatBoundsLike,
  Map as MapboxMap,
  MercatorCoordinate,
} from "mapbox-gl";
import { FeatureCollection, Position } from "geojson";
import {
  ISpatialExtent,
  OGCCollection,
} from "@/app/store/OGCCollectionDefinitions";
import { bbox as turfBbox } from "@turf/turf";
import {
  AUSTRALIA_CENTER_LNG,
  MapDefaultConfig,
} from "../components/map/mapbox/constants";
import MapboxDraw from "@mapbox/mapbox-gl-draw";

/** Keep string literals here so MapUtils does not import the DrawRect React module. */
const DRAW_RECTANGLE_MODE = "draw_rectangle";
const DRAW_POLYGON_MODE = "draw_polygon";

/**
 * Flag set on the map instance by {@link setMapDrawInteractionActive} (DrawRect).
 * Preferred over control inspection: more reliable when `instanceof MapboxDraw`
 * fails across bundle copies, or `getMode()` is briefly unavailable.
 */
export const MAP_DRAW_INTERACTION_FLAG = "__aodnDrawInteractionActive";

/**
 * Publish whether bbox/polygon draw (or edit/selection) should suppress data popups.
 * Called from DrawRect when mode/selection changes.
 */
export const setMapDrawInteractionActive = (
  map: MapboxMap | null | undefined,
  active: boolean
): void => {
  if (!map) return;
  (map as MapboxMap & Record<string, boolean>)[MAP_DRAW_INTERACTION_FLAG] =
    active;
};

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
 * @param options
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
 * Attach the matching spatial extent description to each feature, so the map
 * can show it in a popup. Features and extents both come from the same
 * EX_Extent blocks, so they are matched by bbox value.
 *
 * @param featureCollection - Features built from the collection extent bboxes
 * @param spatialExtents - The spatial_extents summary of the collection
 * @returns The same feature collection with description set where matched
 */
export const attachSpatialExtentDescriptions = (
  featureCollection: FeatureCollection | undefined,
  spatialExtents: Array<ISpatialExtent> | undefined
): FeatureCollection | undefined => {
  if (!featureCollection || !spatialExtents?.length) return featureCollection;
  const tolerance = 0.000001;
  const matches = (a: Array<number>, b: Array<number>) =>
    a.length === 4 &&
    b.length === 4 &&
    a.every((value, i) => Math.abs(value - b[i]) < tolerance);
  featureCollection.features.forEach((feature) => {
    const featureBbox = turfBbox(feature);
    const extent = spatialExtents.find((e) => matches(e.bbox, featureBbox));
    if (extent) {
      feature.properties = {
        ...feature.properties,
        description: extent.description,
      };
    }
  });
  return featureCollection;
};

/**
 * Fits the map view to the specified bounding box with intelligent zoom calculation
 * based on the map container's dimensions.
 * TODO: This temporary resolve fitting map to bound cut off problem, can refactor if have better solution
 *
 * Zoom and lat always follow the record's own bbox. The only intervention
 * (bug 8271): when the bbox is world-scale AND reaches Australia's longitudes,
 * the view centre's lng is swapped to Australia so the world view is centred
 * on Australia instead of the Atlantic. Everything else fits as-is.
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

/**
 * Fit the map to the collection's overall extent (or the default extent
 * when the collection has none), animated. Used by the map reset buttons:
 * - detail page: passes its collection, so reset refits the dataset's extent
 * - search page: passes undefined, so reset refits the default Australia-wide extent
 * - location filter: not this function — calls fitToBound directly with baseZoom 0
 *   for a world view centred on Australia
 */
export const fitToDefaultExtent = (
  map: MapboxMap,
  collection: OGCCollection | undefined
): void => {
  fitToBound(map, overallBoundingBox(collection), { animate: true });
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
const DRAW_INTERACTION_MODES = new Set([
  DRAW_RECTANGLE_MODE,
  DRAW_POLYGON_MODE,
  "direct_select",
]);

type DrawLikeControl = {
  getMode?: () => string;
  getSelectedIds?: () => Array<string | number>;
  changeMode?: (...args: unknown[]) => unknown;
  getAll?: () => unknown;
};

const isDrawLikeControl = (c: unknown): c is DrawLikeControl => {
  if (!c || typeof c !== "object") return false;
  const ctrl = c as DrawLikeControl;
  return (
    typeof ctrl.getMode === "function" &&
    typeof ctrl.getSelectedIds === "function" &&
    typeof ctrl.changeMode === "function"
  );
};

const findMapboxDrawControl = (map: MapboxMap): DrawLikeControl | undefined => {
  const controls = map._controls;
  if (!controls?.length) return undefined;

  // Prefer instanceof when the same module instance is shared
  for (const c of controls) {
    if (c instanceof MapboxDraw) {
      return c as unknown as DrawLikeControl;
    }
  }

  // Duck-type fallback (duplicate package copies break instanceof)
  for (const c of controls) {
    if (isDrawLikeControl(c)) return c;
  }
  return undefined;
};

/**
 * True when MapboxDraw interaction should block data-layer hover/click popups:
 * - actively drawing bbox/polygon
 * - editing vertices (`direct_select`)
 * - a drawn feature is selected/highlighted (`simple_select` with selection)
 *
 * Popups resume in idle `simple_select` with nothing selected.
 *
 * Prefers the flag published by DrawRect; falls back to inspecting the control.
 */
export const isMapDrawModeActive = (
  map: MapboxMap | null | undefined
): boolean => {
  if (!map) return false;

  const flagged = (map as MapboxMap & Record<string, boolean | undefined>)[
    MAP_DRAW_INTERACTION_FLAG
  ];
  if (flagged === true) return true;
  if (flagged === false) {
    // Explicit idle from DrawRect — still fall through to control check so
    // transient races (flag cleared slightly early) can re-detect selection.
  }

  const ctrl = findMapboxDrawControl(map);
  if (!ctrl) return false;

  try {
    const mode = ctrl.getMode?.();
    if (mode && DRAW_INTERACTION_MODES.has(mode)) return true;
    return (ctrl.getSelectedIds?.() ?? []).length > 0;
  } catch {
    // Control not fully mounted yet (getMode needs events from onAdd)
    return false;
  }
};

/** @deprecated Prefer {@link isMapDrawModeActive} (draw + edit + selection). */
export const isDrawModeRectangle = isMapDrawModeActive;
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
