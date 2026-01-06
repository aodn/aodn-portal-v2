import { Root } from "react-dom/client";
import {
  LngLatBoundsLike,
  Map as MapboxMap,
  MercatorCoordinate,
} from "mapbox-gl";
import { Position } from "geojson";
import { OGCCollection } from "../components/common/store/OGCCollectionDefinitions";
import { MapDefaultConfig } from "../components/map/mapbox/constants";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import { DRAW_RECTANGLE_MODE } from "../components/map/mapbox/controls/menu/DrawRect";

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
    const boundsArray = bbox as number[];

    if (boundsArray && boundsArray.length === BBOX_COORDINATES_COUNT) {
      const [west, south, east, north] = boundsArray;
      const bounds: LngLatBoundsLike = [
        [west, south],
        [east, north],
      ];

      const { center, zoom } = map.cameraForBounds(bounds, {
        padding: 20, // or zoomOffset equivalent
        maxZoom: baseZoom,
      })!;

      // Use flyTo for more control over the viewport
      map.flyTo({
        center: center,
        zoom: zoom,
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
  return ctrl?.getMode() === DRAW_RECTANGLE_MODE;
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
