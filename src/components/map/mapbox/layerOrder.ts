import type { LayerSpecification, Map as MapboxMap } from "mapbox-gl";

/**
 * Two logical stacks on the map (bottom → top):
 *
 * 1. **Data layers** – components under `layers/` (cluster, heatmap, pmtiles,
 *    geoserver, spatial extents, …).
 * 2. **Menu overlay layers** – toggled from map menu items (Reference Layers /
 *    static boundaries, world boundaries, location filter selection). These must
 *    always sit above data layers so they remain visible.
 *
 * Mapbox GL draws by style order (later = on top). React child order alone is not
 * enough: layers load asynchronously and re-add on `styledata`, so every add must
 * respect this stack via {@link addDataLayer} / {@link addMenuOverlayLayer}.
 *
 * Mapbox GL Draw (`gl-draw-*`) stays above menu overlays so drawing tools work.
 */

/** Layer ids owned by menu-driven overlays (Reference Layers, etc.). */
const MENU_OVERLAY_LAYER_ID_PATTERNS: ReadonlyArray<RegExp> = [
  // StaticLayer fill + label (id includes map container + static def id)
  /^static-geojson-.*-layer-/,
  /^static-geojson-.*-label-/,
  // MapboxWorldLayer
  /^mapbox-world-country-boundaries-layer$/,
  /^mapbox-world-country-undisputed-country-label$/,
  // Location filter selection (same visual role as a reference overlay)
  /^selected-area-layer$/,
  /^selected-area-label-layer$/,
];

const isDrawLayerId = (layerId: string): boolean =>
  layerId.startsWith("gl-draw-");

export const isMenuOverlayLayerId = (layerId: string): boolean =>
  MENU_OVERLAY_LAYER_ID_PATTERNS.some((re) => re.test(layerId));

const getStyleLayers = (map: MapboxMap): LayerSpecification[] => {
  try {
    return (map.getStyle()?.layers ?? []) as LayerSpecification[];
  } catch {
    // Style may be unloading
    return [];
  }
};

/** Bottom-most menu overlay currently in the style (insert data layers before this). */
export const getFirstMenuOverlayLayerId = (
  map: MapboxMap
): string | undefined => {
  for (const layer of getStyleLayers(map)) {
    if (isMenuOverlayLayerId(layer.id)) return layer.id;
  }
  return undefined;
};

/** Bottom-most Mapbox GL Draw layer (interaction tools stay on top). */
export const getFirstDrawLayerId = (map: MapboxMap): string | undefined => {
  for (const layer of getStyleLayers(map)) {
    if (isDrawLayerId(layer.id)) return layer.id;
  }
  return undefined;
};

/**
 * beforeId for a new **data** layer: keep it under menu overlays, and under
 * draw layers when no menu overlay is present yet.
 */
export const getDataLayerBeforeId = (map: MapboxMap): string | undefined => {
  return getFirstMenuOverlayLayerId(map) ?? getFirstDrawLayerId(map);
};

/**
 * beforeId for a new **menu overlay** layer: under draw tools only, else top.
 */
export const getMenuOverlayBeforeId = (map: MapboxMap): string | undefined => {
  return getFirstDrawLayerId(map);
};

type AddableLayer = Parameters<MapboxMap["addLayer"]>[0];

const safeBeforeId = (
  map: MapboxMap,
  beforeId: string | undefined
): string | undefined =>
  beforeId && map.getLayer(beforeId) ? beforeId : undefined;

/**
 * Add a content/data layer (from `layers/`) below menu overlays and draw tools.
 */
export const addDataLayer = (map: MapboxMap, layer: AddableLayer): void => {
  const beforeId = safeBeforeId(map, getDataLayerBeforeId(map));
  if (beforeId) {
    map.addLayer(layer, beforeId);
  } else {
    map.addLayer(layer);
  }
};

/**
 * Add a menu-toggled overlay layer above data layers (below draw tools if any).
 */
export const addMenuOverlayLayer = (
  map: MapboxMap,
  layer: AddableLayer
): void => {
  const beforeId = safeBeforeId(map, getMenuOverlayBeforeId(map));
  if (beforeId) {
    map.addLayer(layer, beforeId);
  } else {
    map.addLayer(layer);
  }
};

/**
 * Re-assert that every menu overlay sits above data layers and below draw layers.
 * Call after bulk style rebuilds if needed; add helpers already place correctly.
 */
export const ensureMenuOverlayLayersOnTop = (map: MapboxMap): void => {
  const overlayIds = getStyleLayers(map)
    .map((l) => l.id)
    .filter(isMenuOverlayLayerId);

  if (overlayIds.length === 0) return;

  const drawBeforeId = safeBeforeId(map, getFirstDrawLayerId(map));

  for (const id of overlayIds) {
    if (!map.getLayer(id)) continue;
    try {
      if (drawBeforeId) {
        map.moveLayer(id, drawBeforeId);
      } else {
        map.moveLayer(id);
      }
    } catch {
      // Layer may have been removed mid-move during style changes
    }
  }
};
