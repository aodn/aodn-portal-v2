import {
  FC,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { Dayjs } from "dayjs";
import {
  ExpressionSpecification,
  GeoJSONSource,
  Map,
  MapMouseEvent,
  MapSourceDataEvent,
  Popup,
} from "mapbox-gl";
import { FeatureCollection, Geometry } from "geojson";

import {
  DENSITY_TOTAL_CAP,
  HexFillPaint,
  PMTilesMetadataRange,
  PmtilesHexLayerDef,
  densityStopValue,
  PMTilesMetadata,
  sumSparseCountFromProperties,
  CountFilterRange,
  buildCountFilterRange,
  parseCountsTree,
  sumCountsTreeDensityTotal,
  parsePMTilesMetadata,
} from "./Common";
import MapContext from "@/components/map/mapbox/MapContext";
import { DatasetType } from "@/app/store/OGCCollectionDefinitions";
import { playwrightTestIds } from "@/components/common/constants";
import { LayerBasicType } from "@/components/map/mapbox/layers/Layers";
import { InnerHtmlBuilder } from "@/utils/HtmlUtils";
import { SelectItem } from "@/components/common/dropdown/CommonSelect";
import { MapDefaultConfig } from "@/components/map/mapbox/constants";
import MapLayerSelect from "@/components/map/mapbox/component/MapLayerSelect";
import { TestHelper } from "@/components/common/test/helper";

// Re-export pure helpers so existing imports from PMTilesLayer keep working
// (e.g. MapPanel: metadataRangeToDayjs, PMTilesMetadata).
export type {
  CountFilterRange,
  CountsTree,
  PeriodInt,
  SumSparseCountOptions,
  SumSparseCountResult,
  SumTreeResult,
} from "./Common";
export type { PMTilesMetadata, PMTilesMetadataRange } from "./Common";
export {
  COUNTS_PROPERTY,
  DAYS_KEY,
  DEFAULT_RANGE_START,
  DENSITY_TOTAL_CAP,
  TOTAL_KEY,
  buildCountFilterRange,
  buildCountFilterRangeFromPeriods,
  clampPeriodsToMetadata,
  clampRangeToMetadata,
  clearCountsTreeCache,
  coerceCountValue,
  coercePeriodDigits,
  dayjsToPeriodInt,
  daysInMonth,
  densityStopValue,
  formatPeriodInt,
  metadataRangeToDayjs,
  parseCountsTree,
  parsePMTilesMetadata,
  parsePeriodInt,
  periodNumberToDayjs,
  sumCountsTreeDensityTotal,
  sumCountsTreeInRange,
  sumSparseCountFromProperties,
} from "./Common";

const SOURCE_ID = "pmtiles-source-id";
const HOVER_SOURCE_ID = "pmtiles-hover-source-id";
const HOVER_OUTLINE_LAYER_ID = "pmtiles-hex-hover-outline";
/** Stable id for Playwright visibility checks (zoom-band fill layers share one source). */
export const PMTILES_TEST_LAYER_ID = "pmtiles-hex-z0";
const CURSOR_POINTER_CLASS = "map-cursor-pointer";
/** H3 cell id property; promoted to feature id so feature-state can target hexes. */
const PROMOTE_ID_PROPERTY = "h";
const EMPTY_FEATURE_COLLECTION: FeatureCollection = {
  type: "FeatureCollection",
  features: [],
};
const bucket = import.meta.env.VITE_PMTILES_BUCKET;
const region = import.meta.env.VITE_AWS_REGION;
/**
 * Trailing debounce so rapid tile `sourcedata` / `idle` events collapse into
 * one feature-state pass after the viewport settles (avoids partial updates).
 */
const FEATURE_STATE_DEBOUNCE_MS = 120;

/** Feature-state key written by sparse JS sums for density paint/filter. */
const FEATURE_STATE_TOTAL = "total";

/**
 * Density fill-color stops as a fraction of {@link DENSITY_TOTAL_CAP}.
 * Ratios must be strictly increasing from 0 to 1.
 */
const DENSITY_COLOR_STOPS: ReadonlyArray<{
  ratio: number;
  color: string;
}> = [
  { ratio: 0, color: "rgba(0, 0, 0, 0)" },
  { ratio: 0.0001, color: "#1E293B" }, // 1 @ cap 10000
  { ratio: 0.001, color: "#334155" }, // 10
  { ratio: 0.01, color: "#475569" }, // 100
  { ratio: 0.1, color: "#0284C7" }, // 1000
  { ratio: 0.5, color: "#0D9488" }, // 5000
  { ratio: 1, color: "#14B8A6" }, // cap
];

/**
 * Density fill-opacity stops as a fraction of {@link DENSITY_TOTAL_CAP}.
 * Ratios must be strictly increasing from 0 toward 1 (need not reach 1).
 */
const DENSITY_OPACITY_STOPS: ReadonlyArray<{
  ratio: number;
  opacity: number;
}> = [
  { ratio: 0, opacity: 0 },
  { ratio: 0.0001, opacity: 0.4 }, // 1 @ cap 10000 — readable on dark water
  { ratio: 0.01, opacity: 0.65 }, // 100
  { ratio: 0.1, opacity: 0.8 }, // 1000
];
/**
 * Flatten ratio-based stops into Mapbox `interpolate` input/output pairs,
 * dropping any non-increasing values after rounding so the expression stays valid.
 */
export const buildDensityInterpolateStops = <T extends string | number>(
  stops: ReadonlyArray<{ ratio: number; value: T }>,
  cap: number = DENSITY_TOTAL_CAP
): Array<number | T> => {
  const pairs: Array<number | T> = [];
  let lastInput = -Infinity;
  for (const stop of stops) {
    const input = densityStopValue(stop.ratio, cap);
    // Skip duplicates / regressions from rounding at small caps
    if (input <= lastInput) continue;
    pairs.push(input, stop.value);
    lastInput = input;
  }
  return pairs;
};
/**
 * Zoom bands for hex density fills. Mapbox ranges are half-open:
 * layer is active when `minzoom ≤ zoom < maxzoom` (same as hover gating).
 */
const PMTILE_LAYERS: readonly PmtilesHexLayerDef[] = [
  { id: "pmtiles-hex-z0", sourceLayer: "hex_z0", minzoom: 0, maxzoom: 2 },
  { id: "pmtiles-hex-z2", sourceLayer: "hex_z2", minzoom: 2, maxzoom: 4 },
  { id: "pmtiles-hex-z4", sourceLayer: "hex_z4", minzoom: 4, maxzoom: 6 },
  { id: "pmtiles-hex-z6", sourceLayer: "hex_z6", minzoom: 6, maxzoom: 8 },
  { id: "pmtiles-hex-z8", sourceLayer: "hex_z8", minzoom: 8, maxzoom: 10 },
  { id: "pmtiles-hex-z10", sourceLayer: "hex_z10", minzoom: 10, maxzoom: 13 },
];

/**
 * Hex bands visible at `zoom` for density feature-state work.
 * Usually 0–1 layer. Overzoom past the last `maxzoom` clamps to the top band;
 * underzoom below the first `minzoom` clamps to the bottom band.
 */
export const getActivePmtilesLayers = (zoom: number): PmtilesHexLayerDef[] => {
  const matched = PMTILE_LAYERS.filter(
    (layer) => zoom >= layer.minzoom && zoom < layer.maxzoom
  );
  if (matched.length > 0) return matched;

  const first = PMTILE_LAYERS[0];
  const last = PMTILE_LAYERS[PMTILE_LAYERS.length - 1];
  if (!first || !last) return [];
  if (zoom >= last.minzoom) return [last];
  return [first];
};

/**
 * Drop feature-state on hex bands that are not active at `zoom`.
 * Used on filter-window reset so inactive bands do not keep stale totals
 * (active band is overwritten in place to avoid a density flash).
 */
export const clearInactivePmtilesFeatureState = (
  map: Map,
  zoom: number
): void => {
  if (!map.getSource(SOURCE_ID)) return;
  const activeSourceLayers = new Set(
    getActivePmtilesLayers(zoom).map((layer) => layer.sourceLayer)
  );
  for (const layer of PMTILE_LAYERS) {
    if (activeSourceLayers.has(layer.sourceLayer)) continue;
    try {
      map.removeFeatureState({
        source: SOURCE_ID,
        sourceLayer: layer.sourceLayer,
      });
    } catch {
      // Source or style may already be gone
    }
  }
};
interface PMTilesHexLayerProps extends LayerBasicType {
  filterStartDate?: Dayjs;
  filterEndDate?: Dayjs;
  selectedCoKey?: string;
  onSelectCoKey?: (key: string) => void;
  /**
   * Fired when the `.metadata` sidecar is loaded (or cleared on dataset change /
   * error) so the map time slider can align with tile coverage.
   */
  onMetadataPeriodChange?: (range: PMTilesMetadata | null) => void;
  /**
   * Reports whether the `.metadata` sidecar exists on S3. A 404 means tiles were
   * never generated for this parquet, so the parent can drop the density layer
   * and fall back to another one. Only an http response flips this - a failed
   * request (offline, DNS, CORS) is not evidence the tiles are missing.
   */
  onAvailabilityChange?: (isAvailable: boolean) => void;
}

/**
 * Popup totals come from the nested counts tree on the feature (`c`).
 * Hierarchical year/month totals keep long ranges fast and exact.
 *
 * When ``hasTime`` is false (timeless / synthetic period tiles), the popup
 * omits the Time Range line so the synthetic sentinel is not shown as a
 * real observation date.
 */
export const buildPopupHtml = (
  properties: Record<string, unknown>,
  filterStartDate?: Dayjs,
  filterEndDate?: Dayjs,
  range?: CountFilterRange,
  hasTime: boolean = true
): string => {
  const { total, matchedKeys } = sumSparseCountFromProperties(
    properties,
    filterStartDate,
    filterEndDate,
    range ? { range, collectMatchedKeys: true } : { collectMatchedKeys: true }
  );
  const builder = new InnerHtmlBuilder()
    .addTitle("Data Records In This Area:")
    .addText("Data Record Count: " + total);

  if (hasTime) {
    const first = matchedKeys[0];
    const last = matchedKeys[matchedKeys.length - 1];
    builder.addRange("Time Range", first ?? "N/A", last ?? "N/A");
  }

  return builder.getHtml();
};

/** Density input: sparse total written via setFeatureState (0 when unset). */
export const buildFeatureStateTotalExpression = (): ExpressionSpecification =>
  [
    "coalesce",
    ["feature-state", FEATURE_STATE_TOTAL],
    0,
  ] as ExpressionSpecification;

/**
 * True when feature-state total has been written. Unset state is `null` and must
 * not be treated like a real zero count (new tiles would vanish mid-load).
 */
export const buildFeatureStateTotalIsSetExpression =
  (): ExpressionSpecification =>
    [
      "!=",
      ["feature-state", FEATURE_STATE_TOTAL],
      null,
    ] as ExpressionSpecification;

/**
 * True when the sparse total is strictly greater than zero.
 * Used so zero-count hexes (common after a narrow time-slider window) paint
 * fully transparent — including outline — rather than leaving a faint border.
 */
export const buildFeatureStateHasCountExpression =
  (): ExpressionSpecification =>
    [">", buildFeatureStateTotalExpression(), 0] as ExpressionSpecification;

/**
 * Layer filter for density mode.
 *
 * IMPORTANT: Mapbox/MapLibre do **not** allow `feature-state` in filters — only
 * in paint/layout. Zero-count hexes are hidden via transparent paint instead.
 * Presence filter keeps only real hex features.
 */
export const buildDensityLayerFilter = (): ExpressionSpecification =>
  ["has", PROMOTE_ID_PROPERTY] as ExpressionSpecification;

/** Phase A: any hex feature is present (tiles only contain cells with data). */
export const buildPresenceFilter = (): ExpressionSpecification =>
  ["has", PROMOTE_ID_PROPERTY] as ExpressionSpecification;

export const PLACEHOLDER_FILL_COLOR = "#475569";
export const PLACEHOLDER_FILL_OPACITY = 0.4;
/** Fully opaque white border (no alpha) so edges stay clear on the basemap. */
export const PLACEHOLDER_OUTLINE_COLOR = "#FFFFFF";
/** Fully opaque white border for hexes with a non-zero density total. */
export const DENSITY_OUTLINE_COLOR = "#FFFFFF";
/** Fully transparent fill/outline when a hex has no records in the filter window. */
export const ZERO_COUNT_FILL_COLOR = "rgba(0, 0, 0, 0)";
export const ZERO_COUNT_OUTLINE_COLOR = "rgba(0, 0, 0, 0)";
export const ZERO_COUNT_FILL_OPACITY = 0;

/** Neutral style while feature-state totals are computed in the background. */
export const getPlaceholderPaintProperties = (): HexFillPaint => ({
  "fill-color": PLACEHOLDER_FILL_COLOR,
  "fill-opacity": PLACEHOLDER_FILL_OPACITY,
  "fill-outline-color": PLACEHOLDER_OUTLINE_COLOR,
});

/**
 * Density paint driven by feature-state totals (no dense day-key sum).
 *
 * Unset feature-state (tile not yet processed) keeps the placeholder look so
 * newly loaded hexes do not disappear until their sparse total is written.
 * A real total of 0 paints fully transparent fill **and** outline (hexes with
 * no records in the time-slider window must not appear as empty polygons).
 *
 * Color and opacity breakpoints scale with {@link DENSITY_TOTAL_CAP} via
 * {@link DENSITY_COLOR_STOPS} / {@link DENSITY_OPACITY_STOPS}.
 */
export const getFeatureStatePaintProperties = (
  cap: number = DENSITY_TOTAL_CAP
): HexFillPaint => {
  const totalIsSet = buildFeatureStateTotalIsSetExpression();
  const hasCount = buildFeatureStateHasCountExpression();
  const sumExpr = buildFeatureStateTotalExpression();
  const colorStops = buildDensityInterpolateStops(
    DENSITY_COLOR_STOPS.map(({ ratio, color }) => ({ ratio, value: color })),
    cap
  );
  const opacityStops = buildDensityInterpolateStops(
    DENSITY_OPACITY_STOPS.map(({ ratio, opacity }) => ({
      ratio,
      value: opacity,
    })),
    cap
  );
  return {
    "fill-color": [
      "case",
      ["!", totalIsSet],
      PLACEHOLDER_FILL_COLOR,
      ["!", hasCount],
      ZERO_COUNT_FILL_COLOR,
      ["interpolate", ["linear"], sumExpr, ...colorStops],
    ] as ExpressionSpecification,
    "fill-opacity": [
      "case",
      ["!", totalIsSet],
      PLACEHOLDER_FILL_OPACITY,
      ["!", hasCount],
      ZERO_COUNT_FILL_OPACITY,
      ["interpolate", ["linear"], sumExpr, ...opacityStops],
    ] as ExpressionSpecification,
    // Fully opaque white border when total > 0; transparent when total is 0
    // so empty hexes (after time filter) leave no ghost edges.
    "fill-outline-color": [
      "case",
      ["!", totalIsSet],
      PLACEHOLDER_OUTLINE_COLOR,
      ["!", hasCount],
      ZERO_COUNT_OUTLINE_COLOR,
      DENSITY_OUTLINE_COLOR,
    ] as ExpressionSpecification,
  };
};

/** Apply fill filter + paint to every PMTiles hex zoom band that exists. */
export const applyHexLayerStyle = (
  map: Map,
  filter: ExpressionSpecification | null,
  paint: HexFillPaint
): void => {
  PMTILE_LAYERS.forEach((layer) => {
    if (!map.getLayer(layer.id)) return;
    // Paint first so a filter failure cannot leave density colors unapplied
    map.setPaintProperty(layer.id, "fill-color", paint["fill-color"]);
    map.setPaintProperty(layer.id, "fill-opacity", paint["fill-opacity"]);
    map.setPaintProperty(
      layer.id,
      "fill-outline-color",
      paint["fill-outline-color"]
    );
    if (filter) {
      map.setFilter(layer.id, filter);
    }
  });
};

/** Drop all feature-state for the PMTiles vector source (if present). */
export const clearPmtilesFeatureState = (map: Map): void => {
  if (!map.getSource(SOURCE_ID)) return;
  try {
    // Clears every feature-state entry for this source (all source-layers)
    map.removeFeatureState({ source: SOURCE_ID });
  } catch {
    // Source may already be gone or style unloaded
  }
};

/**
 * Tracks which features already received feature-state for the current filter
 * generation so tile loads only process new hexes.
 */
export type FeatureStateTotalsSession = {
  /** Features already written: `${sourceLayer}\\0${id}` */
  written: Set<string>;
};

export const createFeatureStateTotalsSession =
  (): FeatureStateTotalsSession => ({
    written: new Set(),
  });

export const featureStateSessionKey = (
  sourceLayer: string,
  id: string | number
): string => `${sourceLayer}\0${String(id)}`;

/**
 * Resolve the id Mapbox uses for feature-state on a queried vector feature.
 * Prefer `feature.id` (set by `promoteId`) so setFeatureState matches paint.
 * Falling back to a different type than promoteId leaves hexes stuck in
 * placeholder style while the session thinks they were written.
 */
export const resolvePmtilesFeatureId = (feature: {
  id?: string | number | null;
  properties?: Record<string, unknown> | null;
}): string | number | undefined => {
  const fromId = feature.id;
  if (fromId !== undefined && fromId !== null && fromId !== "") {
    return fromId as string | number;
  }
  const fromProp = feature.properties?.[PROMOTE_ID_PROPERTY];
  if (
    (typeof fromProp === "string" && fromProp !== "") ||
    typeof fromProp === "number"
  ) {
    return fromProp;
  }
  return undefined;
};

/**
 * How many loaded hexes still need feature-state for this session.
 * Used to detect half-painted density (teal cells + empty outlined cells).
 */
export const countUnwrittenLoadedFeatures = (
  map: Map,
  session: FeatureStateTotalsSession,
  layers: readonly PmtilesHexLayerDef[] = PMTILE_LAYERS
): number => {
  if (!map.getSource(SOURCE_ID)) return 0;

  let unwritten = 0;
  for (const layer of layers) {
    let features;
    try {
      features = map.querySourceFeatures(SOURCE_ID, {
        sourceLayer: layer.sourceLayer,
      });
    } catch {
      continue;
    }

    // Same promoteId can appear once per overlapping tile
    const seenIds = new Set<string>();
    for (const feature of features) {
      const id = resolvePmtilesFeatureId(feature);
      if (id === undefined) continue;
      const idKey = String(id);
      if (seenIds.has(idKey)) continue;
      seenIds.add(idKey);
      if (!session.written.has(featureStateSessionKey(layer.sourceLayer, id))) {
        unwritten++;
      }
    }
  }
  return unwritten;
};

export type UpdateFeatureStateTotalsOptions = {
  /** Precomputed range (required for hot path; built if omitted). */
  range?: CountFilterRange;
  /**
   * When set, skip features already present in `session.written` and add new
   * ones as they are written. Callers clear the set on filter/metadata change.
   */
  session?: FeatureStateTotalsSession;
  /**
   * When set, only query/sum these bands. Default: all {@link PMTILE_LAYERS}
   * (tests and tooling). Density hot path passes the active zoom band only.
   */
  layers?: readonly PmtilesHexLayerDef[];
};

export type UpdateFeatureStateTotalsResult = {
  /** Features written in this call (not cumulative). */
  updated: number;
  /** Features seen in querySourceFeatures (including already-written). */
  seen: number;
};

/**
 * For each loaded vector feature, sum the nested counts tree in the filter
 * range and write the total to feature-state for paint/filter.
 *
 * Supports incremental updates (skip `session.written`).
 * Pass `layers` (e.g. from {@link getActivePmtilesLayers}) to skip bands
 * that are not visible at the current zoom.
 */
export const updateFeatureStateTotals = (
  map: Map,
  filterStartDate?: Dayjs,
  filterEndDate?: Dayjs,
  options?: UpdateFeatureStateTotalsOptions
): UpdateFeatureStateTotalsResult => {
  if (!map.getSource(SOURCE_ID)) {
    return { updated: 0, seen: 0 };
  }

  const range =
    options?.range ?? buildCountFilterRange(filterStartDate, filterEndDate);
  const session = options?.session;
  const layers = options?.layers ?? PMTILE_LAYERS;
  const startPeriod = range.startPeriod;
  const endPeriod = range.endPeriod;
  const rangeEmpty = range.empty;

  let updated = 0;
  let seen = 0;

  for (const layer of layers) {
    let features;
    try {
      features = map.querySourceFeatures(SOURCE_ID, {
        sourceLayer: layer.sourceLayer,
      });
    } catch {
      continue;
    }

    for (const feature of features) {
      // Must match promoteId exactly — wrong type ⇒ paint stays on placeholder
      const id = resolvePmtilesFeatureId(feature);
      if (id === undefined) continue;
      seen++;
      const sessionKey = featureStateSessionKey(layer.sourceLayer, id);
      if (session?.written.has(sessionKey)) continue;

      // Density-only sum: year/month `t` fast paths + tree parse cache.
      // Cap at paint max — popup uses uncapped sum via buildPopupHtml.
      let total = 0;
      if (!rangeEmpty) {
        const tree = parseCountsTree(
          feature.properties as Record<string, unknown> | null
        );
        if (tree) {
          total = sumCountsTreeDensityTotal(
            tree,
            startPeriod,
            endPeriod,
            DENSITY_TOTAL_CAP
          );
        }
      }

      try {
        map.setFeatureState(
          {
            source: SOURCE_ID,
            sourceLayer: layer.sourceLayer,
            id,
          },
          { [FEATURE_STATE_TOTAL]: total }
        );
        session?.written.add(sessionKey);
        updated++;
      } catch {
        // Feature may have left the tile cache — do not mark written
      }
    }
  }
  return { updated, seen };
};

/**
 * Schedule work after the browser is idle (or on the next macrotask).
 * Returns a cancel function so stale density updates can be dropped.
 */
export const scheduleDeferredWork = (work: () => void): (() => void) => {
  let cancelled = false;
  const run = () => {
    if (!cancelled) work();
  };

  const ric = (
    globalThis as typeof globalThis & {
      requestIdleCallback?: (
        cb: (deadline: {
          timeRemaining: () => number;
          didTimeout: boolean;
        }) => void,
        opts?: { timeout: number }
      ) => number;
      cancelIdleCallback?: (id: number) => void;
    }
  ).requestIdleCallback;

  if (typeof ric === "function") {
    const id = ric(() => run(), { timeout: 250 });
    const cancelRic = (
      globalThis as typeof globalThis & {
        cancelIdleCallback?: (id: number) => void;
      }
    ).cancelIdleCallback;
    return () => {
      cancelled = true;
      cancelRic?.(id);
    };
  }

  const timeoutId = setTimeout(run, 10);
  return () => {
    cancelled = true;
    clearTimeout(timeoutId);
  };
};

export const scheduleDebouncedWork = (
  work: () => void,
  delayMs: number = FEATURE_STATE_DEBOUNCE_MS
): (() => void) => {
  let cancelled = false;
  const timeoutId = setTimeout(() => {
    if (!cancelled) work();
  }, delayMs);
  return () => {
    cancelled = true;
    clearTimeout(timeoutId);
  };
};
const PMTilesHexLayer: FC<PMTilesHexLayerProps> = ({
  collection,
  selectedCoKey,
  onSelectCoKey,
  filterStartDate,
  filterEndDate,
  visible = true,
  onMetadataPeriodChange,
  onAvailabilityChange,
}) => {
  const { map } = useContext(MapContext);
  const popupRef = useRef<Popup | null>(null);

  /** True after at least one density write against loaded tiles. */
  const [densityReady, setDensityReady] = useState(false);

  /**
   * Sidecar load result keyed by URL. When the URL changes, derived
   * `periodBounds` fall back immediately (no setState reset in an effect).
   */
  const [loadedMeta, setLoadedMeta] = useState<{
    url: string;
    bounds: PMTilesMetadataRange | null;
  } | null>(null);

  const resolveParquetKey = useCallback((): string | undefined => {
    let key =
      typeof selectedCoKey === "string" && selectedCoKey.trim() !== ""
        ? selectedCoKey.trim()
        : undefined;
    if (key && collection?.getDatasetTypeByKey(key) !== DatasetType.PARQUET) {
      key = collection?.getAllParquetKeys()[0];
    }
    if (!key) {
      key = collection?.getAllParquetKeys()[0];
    }
    return key || undefined;
  }, [collection, selectedCoKey]);

  const formSourceUrl = useCallback((): string | undefined => {
    const key = resolveParquetKey();
    const collectionId = collection?.id;
    if (!key || !collectionId) return undefined;
    return `https://${bucket}.s3.${region}.amazonaws.com/portal/visualization/${collectionId}/${key}.pmtiles`;
  }, [collection?.id, resolveParquetKey]);

  const formMetadataUrl = useCallback((): string | undefined => {
    const key = resolveParquetKey();
    const collectionId = collection?.id;
    if (!key || !collectionId) return undefined;
    return `https://${bucket}.s3.${region}.amazonaws.com/portal/visualization/${collectionId}/${key}.metadata`;
  }, [collection?.id, resolveParquetKey]);

  const metadataUrl = formMetadataUrl();
  const metaMatchesUrl = loadedMeta != null && loadedMeta.url === metadataUrl;
  const periodBounds = metaMatchesUrl ? loadedMeta.bounds : null;

  const countFilterRange = useMemo(
    () =>
      buildCountFilterRange(filterStartDate, filterEndDate, {
        bounds: periodBounds,
      }),
    [filterStartDate, filterEndDate, periodBounds]
  );

  /**
   * Latest values for map event handlers (hover). Updated in an effect — not
   * during render — so react-hooks/refs stays clean.
   */
  const hoverCtxRef = useRef({
    filterStartDate,
    filterEndDate,
    countFilterRange,
    hasTime: periodBounds?.hasTime !== false,
    densityReady,
    visible,
  });
  useEffect(() => {
    hoverCtxRef.current = {
      filterStartDate,
      filterEndDate,
      countFilterRange,
      hasTime: periodBounds?.hasTime !== false,
      densityReady,
      visible,
    };
  }, [
    filterStartDate,
    filterEndDate,
    countFilterRange,
    periodBounds?.hasTime,
    densityReady,
    visible,
  ]);

  const removePopup = useCallback(() => {
    popupRef.current?.remove();
    popupRef.current = null;
  }, []);

  const handleSelectDataset = useCallback(
    (key: string) => {
      onSelectCoKey?.(key);
    },
    [onSelectCoKey]
  );

  const datasetOptions = useMemo<SelectItem<string>[]>(() => {
    const coKeys = collection?.getAllCOKeys() ?? [];
    return coKeys.map((key) => ({
      value: key,
      label: key.replace(/\.(zarr|parquet)$/i, ""),
    }));
  }, [collection]);

  // Load `.metadata`. Parent is notified from fetch callbacks only (not a
  // synchronous setState reset at effect start).
  useEffect(() => {
    if (!metadataUrl) {
      onMetadataPeriodChange?.(null);
      // No parquet key resolvable, so there is nothing for this layer to render
      onAvailabilityChange?.(false);
      return;
    }

    const abortController = new AbortController();
    // Clear parent slider bounds while the new sidecar loads
    onMetadataPeriodChange?.(null);
    // Optimistic reset: this effect re-runs on every url change, so a new
    // dataset / CO key always gets a fresh chance before its fetch resolves
    onAvailabilityChange?.(true);

    fetch(metadataUrl, { signal: abortController.signal })
      .then((response) => {
        onAvailabilityChange?.(response.ok);
        if (!response.ok) {
          throw new Error(`Metadata fetch failed: ${response.status}`);
        }
        return response.json();
      })
      .then((data: unknown) => {
        if (abortController.signal.aborted) return;
        const metadata = parsePMTilesMetadata(data);
        if (!metadata) {
          setLoadedMeta({
            url: metadataUrl,
            bounds: null,
          });
          onMetadataPeriodChange?.(null);
          return;
        }
        const bounds: PMTilesMetadataRange = {
          minPeriod: metadata.minPeriod,
          maxPeriod: metadata.maxPeriod,
          hasTime: metadata.hasTime,
        };
        setLoadedMeta({
          url: metadataUrl,
          bounds,
        });
        onMetadataPeriodChange?.(metadata);
      })
      .catch((err: unknown) => {
        if (err instanceof DOMException && err.name === "AbortError") return;
        if (abortController.signal.aborted) return;
        setLoadedMeta({
          url: metadataUrl,
          bounds: null,
        });
        onMetadataPeriodChange?.(null);
      });

    return () => {
      abortController.abort();
    };
  }, [metadataUrl, onMetadataPeriodChange, onAvailabilityChange]);

  // Source + layers lifecycle (dataset URL only).
  useEffect(() => {
    if (!map) return;

    const sourceUrl = formSourceUrl();
    if (!sourceUrl) return;

    const addSourceAndLayers = () => {
      try {
        if (!map.getSource(SOURCE_ID)) {
          map.addSource(SOURCE_ID, {
            type: "vector",
            url: sourceUrl,
            promoteId: PROMOTE_ID_PROPERTY,
          });
        }

        // Density paint from the start (feature-state expressions). Unset totals
        // use the paint expression's unset branch until refreshDensity writes them.
        const densityPaint = getFeatureStatePaintProperties();
        PMTILE_LAYERS.forEach((layer) => {
          if (!map.getLayer(layer.id)) {
            map.addLayer({
              id: layer.id,
              type: "fill",
              source: SOURCE_ID,
              "source-layer": layer.sourceLayer,
              minzoom: layer.minzoom,
              maxzoom: layer.maxzoom,
              filter: buildDensityLayerFilter(),
              layout: {
                // Visibility effect owns show/hide; avoid remounting source on toggle
                visibility: "visible",
              },
              paint: {
                "fill-color": densityPaint["fill-color"],
                "fill-opacity": densityPaint["fill-opacity"],
                "fill-outline-color": densityPaint["fill-outline-color"],
              },
            });
          }
        });

        if (!map.getSource(HOVER_SOURCE_ID)) {
          map.addSource(HOVER_SOURCE_ID, {
            type: "geojson",
            data: EMPTY_FEATURE_COLLECTION,
          });
        }
        if (!map.getLayer(HOVER_OUTLINE_LAYER_ID)) {
          map.addLayer({
            id: HOVER_OUTLINE_LAYER_ID,
            type: "line",
            source: HOVER_SOURCE_ID,
            layout: {
              visibility: "visible",
              "line-join": "round",
              "line-cap": "round",
            },
            paint: {
              "line-color": "rgba(255, 255, 255, 0.9)",
              "line-width": 1.5,
            },
          });
        }
      } catch {
        // Style may not be ready
      }
    };

    if (map.isStyleLoaded()) {
      addSourceAndLayers();
    } else {
      map.once("load", addSourceAndLayers);
    }

    const onStyleData = () => {
      addSourceAndLayers();
    };
    map.on("styledata", onStyleData);

    return () => {
      map.off("styledata", onStyleData);
      map.off("load", addSourceAndLayers);
      try {
        map.getCanvas().classList.remove(CURSOR_POINTER_CLASS);
        clearPmtilesFeatureState(map);
        PMTILE_LAYERS.forEach((layer) => {
          if (map.getLayer(layer.id)) {
            map.removeLayer(layer.id);
          }
        });
        if (map.getLayer(HOVER_OUTLINE_LAYER_ID)) {
          map.removeLayer(HOVER_OUTLINE_LAYER_ID);
        }
        if (map.getSource(SOURCE_ID)) {
          map.removeSource(SOURCE_ID);
        }
        if (map.getSource(HOVER_SOURCE_ID)) {
          map.removeSource(HOVER_SOURCE_ID);
        }
      } catch {
        // Map may already be torn down
      }
      removePopup();
      setDensityReady(false);
    };
  }, [map, formSourceUrl, removePopup]);

  /**
   * Density refresh: debounced full rewrite of feature-state for all currently
   * loaded hexes in the active zoom band.
   *
   * No session / generation / dirty-ref machine. Effect-local flags only:
   * - `needsRefresh` is set by tile/viewport/filter events
   * - cleared when a pass runs against a fully loaded source (all queryable
   *   hexes were just written), so setFeatureState → idle does not loop
   */
  useEffect(() => {
    if (!map) return;

    let cancelled = false;
    let debounceTimer: ReturnType<typeof setTimeout> | undefined;
    let needsRefresh = true;

    const refreshDensity = () => {
      if (cancelled) return;
      if (!map.getSource(SOURCE_ID)) return;

      // Claim this pass. Tile events during the write may set needsRefresh again.
      needsRefresh = false;

      try {
        applyHexLayerStyle(
          map,
          buildDensityLayerFilter(),
          getFeatureStatePaintProperties()
        );

        const range = buildCountFilterRange(filterStartDate, filterEndDate, {
          bounds: periodBounds,
        });

        // Write every loaded feature in the active band (no incremental session).
        const { seen } = updateFeatureStateTotals(
          map,
          filterStartDate,
          filterEndDate,
          {
            range,
            layers: getActivePmtilesLayers(map.getZoom()),
          }
        );

        if (seen > 0) {
          setDensityReady(true);
        }

        let sourceLoaded;
        try {
          sourceLoaded = map.isSourceLoaded(SOURCE_ID);
        } catch {
          sourceLoaded = false;
        }
        // More tiles may still arrive — keep refreshing on the next idle.
        // Do not force needsRefresh=false here: a concurrent sourcedata may have
        // already set it true for tiles that arrived mid-pass.
        if (!sourceLoaded) {
          needsRefresh = true;
        }
      } catch {
        // Source/layers may not exist yet — try again on idle/sourcedata
        needsRefresh = true;
      }
    };

    const scheduleRefresh = () => {
      needsRefresh = true;
      if (debounceTimer !== undefined) {
        clearTimeout(debounceTimer);
      }
      debounceTimer = setTimeout(refreshDensity, FEATURE_STATE_DEBOUNCE_MS);
    };

    const onSourceData = (e: MapSourceDataEvent) => {
      if (e.sourceId !== SOURCE_ID) return;
      if (e.sourceDataType === "metadata") return;
      scheduleRefresh();
    };

    const onIdle = () => {
      // Only continue while tiles are still arriving / first paint pending.
      // Avoids idle ↔ setFeatureState infinite loops after a full write.
      if (needsRefresh) {
        scheduleRefresh();
      }
    };

    map.on("sourcedata", onSourceData);
    map.on("moveend", scheduleRefresh);
    map.on("idle", onIdle);

    // Immediate pass when filter/metadata/source deps change
    scheduleRefresh();

    return () => {
      cancelled = true;
      if (debounceTimer !== undefined) {
        clearTimeout(debounceTimer);
      }
      map.off("sourcedata", onSourceData);
      map.off("moveend", scheduleRefresh);
      map.off("idle", onIdle);
    };
  }, [map, formSourceUrl, filterStartDate, filterEndDate, periodBounds]);

  // Hover popup + outline
  useEffect(() => {
    if (!map) return;

    let hoveredId: string | number | undefined;

    const setHoverOutline = (geometry?: Geometry) => {
      const source = map.getSource<GeoJSONSource>(HOVER_SOURCE_ID);
      source?.setData(
        geometry
          ? {
              type: "FeatureCollection",
              features: [{ type: "Feature", geometry, properties: {} }],
            }
          : EMPTY_FEATURE_COLLECTION
      );
    };

    const clearHover = () => {
      map.getCanvas().classList.remove(CURSOR_POINTER_CLASS);
      hoveredId = undefined;
      setHoverOutline(undefined);
      removePopup();
    };

    const onHexHover = (
      layer: (typeof PMTILE_LAYERS)[number],
      e: MapMouseEvent
    ) => {
      const ctx = hoverCtxRef.current;
      if (!ctx.visible || !ctx.densityReady) {
        clearHover();
        return;
      }
      const zoom = map.getZoom();
      if (zoom < layer.minzoom || zoom >= layer.maxzoom) return;

      const feature = e.features?.[0];
      if (!feature) return;

      const { total: hoverTotal } = sumSparseCountFromProperties(
        (feature.properties ?? {}) as Record<string, unknown>,
        ctx.filterStartDate,
        ctx.filterEndDate,
        {
          range: ctx.countFilterRange,
          collectMatchedKeys: false,
        }
      );
      if (hoverTotal <= 0) {
        clearHover();
        return;
      }

      map.getCanvas().classList.add(CURSOR_POINTER_CLASS);

      if (!popupRef.current) {
        popupRef.current = new Popup({
          ...MapDefaultConfig.DEFAULT_POPUP,
          closeButton: false,
        });
        hoveredId = undefined;
      }

      if (feature.id === undefined || feature.id !== hoveredId) {
        hoveredId = feature.id;
        popupRef.current.setHTML(
          buildPopupHtml(
            feature.properties ?? {},
            ctx.filterStartDate,
            ctx.filterEndDate,
            ctx.countFilterRange,
            ctx.hasTime
          )
        );
        setHoverOutline(feature.geometry);
      }

      popupRef.current.setLngLat(e.lngLat);
      if (!popupRef.current.isOpen()) {
        popupRef.current.addTo(map);
      }

      const popupElement = popupRef.current.getElement();
      if (popupElement) {
        popupElement.dataset.testid = playwrightTestIds.DETAIL_MAP_POPUP;
      }
    };

    const onHexLeave = () => {
      clearHover();
    };

    const onZoom = () => {
      clearHover();
    };

    const hoverHandlers = PMTILE_LAYERS.map((layer) => ({
      layerId: layer.id,
      onMouseMove: (e: MapMouseEvent) => onHexHover(layer, e),
    }));

    hoverHandlers.forEach(({ layerId, onMouseMove }) => {
      map.on("mousemove", layerId, onMouseMove);
      map.on("mouseleave", layerId, onHexLeave);
    });
    map.on("zoom", onZoom);

    return () => {
      hoverHandlers.forEach(({ layerId, onMouseMove }) => {
        map.off("mousemove", layerId, onMouseMove);
        map.off("mouseleave", layerId, onHexLeave);
      });
      map.off("zoom", onZoom);
      try {
        clearHover();
      } catch {
        // Map may already be torn down
      }
    };
  }, [map, removePopup]);

  // Visibility
  useEffect(() => {
    if (!map) return;
    try {
      PMTILE_LAYERS.forEach((layer) => {
        if (map.getLayer(layer.id)) {
          map.setLayoutProperty(
            layer.id,
            "visibility",
            visible ? "visible" : "none"
          );
        }
      });
      if (map.getLayer(HOVER_OUTLINE_LAYER_ID)) {
        map.setLayoutProperty(
          HOVER_OUTLINE_LAYER_ID,
          "visibility",
          visible ? "visible" : "none"
        );
      }
    } catch {
      // OK to ignore
    }
    if (!visible) {
      map.getCanvas().classList.remove(CURSOR_POINTER_CLASS);
      map
        .getSource<GeoJSONSource>(HOVER_SOURCE_ID)
        ?.setData(EMPTY_FEATURE_COLLECTION);
      removePopup();
    }
  }, [map, visible, removePopup]);

  return (
    <>
      {visible && (
        <MapLayerSelect
          mapLayersOptions={datasetOptions}
          selectedItem={selectedCoKey || ""}
          handleSelectItem={handleSelectDataset}
          isLoading={false}
          loadingText="Loading Data Density Layers..."
        />
      )}
      <TestHelper
        id={map?.getContainer().id || ""}
        getPmtilesLayer={() => PMTILES_TEST_LAYER_ID}
        isPmtilesVisible={() => visible}
      />
    </>
  );
};

export default PMTilesHexLayer;

export {
  FEATURE_STATE_TOTAL,
  DENSITY_COLOR_STOPS,
  DENSITY_OPACITY_STOPS,
  PMTILE_LAYERS,
};
