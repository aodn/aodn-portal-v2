import { Root } from "react-dom/client";
import { Map as MapboxMap } from "mapbox-gl";
import { Position } from "geojson";

// Constants with explanations
/**
 * Default base zoom level - represents approximately country/region level detail
 * Mapbox zoom levels typically range from 0 (world view) to 22 (building details)
 */
const DEFAULT_BASE_ZOOM = 8;

/**
 * Default zoom offset to ensure the entire bounding box is visible
 * Negative values zoom out more (showing more area around the bounds)
 */
const DEFAULT_ZOOM_OFFSET = -1;

/**
 * Default width for container if dimensions can't be determined
 * Used for aspect ratio calculations when container size is unknown
 */
const DEFAULT_CONTAINER_WIDTH = 300;

/**
 * Default height for container if dimensions can't be determined
 * Used for aspect ratio calculations when container size is unknown
 */
const DEFAULT_CONTAINER_HEIGHT = 150;

/**
 * Expected number of coordinates in a valid bounding box
 * [west, south, east, north] format
 */
const BBOX_COORDINATES_COUNT = 4;

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
    zoomOffset?: number;
    baseZoom?: number;
  } = {}
): void => {
  // Default options
  const {
    animate = true,
    zoomOffset = DEFAULT_ZOOM_OFFSET,
    baseZoom = DEFAULT_BASE_ZOOM,
  } = options;

  if (!map || !bbox || !bbox.length) {
    console.error("Invalid map or bbox:", { map, bbox });
    return;
  }

  try {
    const boundsArray = bbox as number[];

    if (boundsArray && boundsArray.length === BBOX_COORDINATES_COUNT) {
      const [west, south, east, north] = boundsArray;

      // Calculate center point
      const centerLng = (west + east) / 2;
      const centerLat = (south + north) / 2;

      // Get the container element to check its dimensions
      const container = map.getContainer();
      const containerWidth = container?.offsetWidth || DEFAULT_CONTAINER_WIDTH;
      const containerHeight =
        container?.offsetHeight || DEFAULT_CONTAINER_HEIGHT;

      // Calculate appropriate zoom level based on bounds and container
      const lngDiff = Math.abs(east - west);
      const latDiff = Math.abs(north - south);

      // Adjust for container aspect ratio to prevent cutting off in wide containers
      const maxDiff = Math.max(
        lngDiff,
        latDiff * (containerWidth / containerHeight)
      );

      // Estimate zoom level (lower is more zoomed out)
      // baseZoom is a reference point in Mapbox's zoom scale (country/region level)
      // log2(maxDiff) converts geographic difference to logarithmic scale
      // zoomOffset provides additional margin around the bounds
      const zoom = Math.floor(baseZoom - Math.log2(maxDiff)) + zoomOffset;

      // Use flyTo for more control over the viewport
      map.flyTo({
        center: [centerLng, centerLat],
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
