import {
  FC,
  startTransition,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import MapContext from "../MapContext";
import dayjs, { Dayjs } from "dayjs";
import {
  ExpressionSpecification,
  GeoJSONSource,
  Map,
  MapMouseEvent,
  MapSourceDataEvent,
  Popup,
} from "mapbox-gl";
import { FeatureCollection, Geometry } from "geojson";
import { LayerBasicType } from "./Layers";
import MapLayerSelect from "../component/MapLayerSelect";
import { SelectItem } from "../../../common/dropdown/CommonSelect";
import { InnerHtmlBuilder } from "../../../../utils/HtmlUtils";
import { MapDefaultConfig } from "../constants";
import { playwrightTestIds } from "../../../common/constants";
import { DatasetType } from "../../../common/store/OGCCollectionDefinitions";

const SOURCE_ID = "pmtiles-source-id";
const HOVER_SOURCE_ID = "pmtiles-hover-source-id";
const HOVER_OUTLINE_LAYER_ID = "pmtiles-hex-hover-outline";
const CURSOR_POINTER_CLASS = "map-cursor-pointer";
/** Feature-state key written by sparse JS sums for density paint/filter. */
export const FEATURE_STATE_TOTAL = "total";
/** H3 cell id property; promoted to feature id so feature-state can target hexes. */
const PROMOTE_ID_PROPERTY = "h";
const EMPTY_FEATURE_COLLECTION: FeatureCollection = {
  type: "FeatureCollection",
  features: [],
};
const bucket = import.meta.env.VITE_PMTILES_BUCKET;
const region = import.meta.env.VITE_AWS_REGION;
// Caps keep legacy key-list helpers bounded (tests / optional tooling).
// Day cap is high enough for multi-decade daily PMTiles (~55 years).
const MONTH_KEY_LIMIT = 1200;
const DAY_KEY_LIMIT = 20000;
const DEFAULT_RANGE_START = "2000-01-01";
// mYYYYMM (month bucket) or mYYYYMMDD (day bucket)
const COUNT_PROPERTY_KEY = /^m(\d{6}|\d{8})$/;

/** Matches sidecar `{dname}.metadata` `time_group_by` from batch PMTiles gen. */
export enum TimeGroupBy {
  Date = "date",
  Month = "month",
}

/** Default when `.metadata` is missing or invalid. */
export const DEFAULT_TIME_GROUP_BY = TimeGroupBy.Date;

const PMTILE_LAYERS = [
  { id: "pmtiles-hex-z0", sourceLayer: "hex_z0", minzoom: 0, maxzoom: 2 },
  { id: "pmtiles-hex-z2", sourceLayer: "hex_z2", minzoom: 2, maxzoom: 4 },
  { id: "pmtiles-hex-z4", sourceLayer: "hex_z4", minzoom: 4, maxzoom: 6 },
  { id: "pmtiles-hex-z6", sourceLayer: "hex_z6", minzoom: 6, maxzoom: 8 },
  { id: "pmtiles-hex-z8", sourceLayer: "hex_z8", minzoom: 8, maxzoom: 10 },
  { id: "pmtiles-hex-z10", sourceLayer: "hex_z10", minzoom: 10, maxzoom: 13 },
];

/**
 * Period bounds from `{dname}.metadata`, as Dayjs values.
 * Built via period string-slicing (never `dayjs(YYYYMMDD)` which treats the
 * int as unix ms → ~1970).
 */
export interface PMTilesMetadataRange {
  minDate: Dayjs;
  maxDate: Dayjs;
}

/**
 * Full coverage range from `{dname}.metadata` including grouping mode.
 */
export interface PMTilesMetadata extends PMTilesMetadataRange {
  timeGroupBy: TimeGroupBy;
}

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
}

const resolveRange = (start?: Dayjs, end?: Dayjs) => ({
  start: start || dayjs(DEFAULT_RANGE_START),
  end: end || dayjs(),
});

/** Parse sidecar metadata; only `"date"` and `"month"` are accepted. */
export const parseTimeGroupBy = (value: unknown): TimeGroupBy =>
  value === TimeGroupBy.Month
    ? TimeGroupBy.Month
    : value === TimeGroupBy.Date
      ? TimeGroupBy.Date
      : DEFAULT_TIME_GROUP_BY;

/**
 * Convert a sidecar `min_date` / `max_date` value (YYYYMM or YYYYMMDD number
 * or numeric string) to a Dayjs bound.
 *
 * Never call `dayjs(periodNumber)` — dayjs treats numbers as unix ms (→ 1970).
 * Digits are string-sliced into a calendar date, then parsed as ISO.
 *
 * bound is use when groupby month only, for date it is ignored
 */
export const periodNumberToDayjs = (
  value: unknown,
  timeGroupBy: TimeGroupBy = DEFAULT_TIME_GROUP_BY,
  bound: "start" | "end" = "start"
): Dayjs | undefined => {
  let digits: string | undefined;
  if (typeof value === "number" && Number.isFinite(value)) {
    digits = String(Math.trunc(value));
  } else if (typeof value === "string" && value.trim() !== "") {
    const n = Number(value.trim());
    if (Number.isFinite(n)) digits = String(Math.trunc(n));
  }
  if (!digits) return undefined;
  // Guard: real unix-ms timestamps are 12–13 digits; period keys are 6 or 8
  if (digits.length > 8) return undefined;

  const isDayPeriod =
    timeGroupBy === TimeGroupBy.Date ||
    digits.length === 8 ||
    digits.length > 6;

  if (isDayPeriod && digits.length >= 8) {
    const iso = `${digits.slice(0, 4)}-${digits.slice(4, 6)}-${digits.slice(6, 8)}`;
    const day = dayjs(iso);
    return day.isValid() && day.format("YYYY-MM-DD") === iso
      ? day.startOf("day")
      : undefined;
  }

  if (digits.length < 6) return undefined;
  const monthStart = dayjs(`${digits.slice(0, 4)}-${digits.slice(4, 6)}-01`);
  if (!monthStart.isValid()) return undefined;
  return bound === "end"
    ? monthStart.endOf("month").startOf("day")
    : monthStart.startOf("month");
};

/**
 * Intersect the UI filter window with metadata period coverage so paint
 * expressions only reference keys that can exist in the PMTiles.
 */
export const clampRangeToMetadata = (
  start?: Dayjs,
  end?: Dayjs,
  bounds?: PMTilesMetadataRange | null,
  _timeGroupBy: TimeGroupBy = DEFAULT_TIME_GROUP_BY
): { start: Dayjs; end: Dayjs } => {
  let { start: s, end: e } = resolveRange(start, end);
  if (!bounds) return { start: s, end: e };
  if (s.isBefore(bounds.minDate, "day")) s = bounds.minDate;
  if (e.isAfter(bounds.maxDate, "day")) e = bounds.maxDate;
  return { start: s, end: e };
};

/**
 * Parse the `{dname}.metadata` JSON body into app `PMTilesMetadata`.
 * Accepts the sidecar field names (`min_date`, `max_date`, `time_group_by`).
 * Returns null when either bound is missing or invalid.
 */
export const parsePMTilesMetadata = (data: unknown): PMTilesMetadata | null => {
  if (data == null || typeof data !== "object") return null;
  const raw = data as Record<string, unknown>;
  const timeGroupBy = parseTimeGroupBy(raw.time_group_by);
  const minDate = periodNumberToDayjs(raw.min_date, timeGroupBy, "start");
  const maxDate = periodNumberToDayjs(raw.max_date, timeGroupBy, "end");
  if (!minDate || !maxDate) return null;
  if (minDate.isAfter(maxDate, "day")) return null;
  return { minDate, maxDate, timeGroupBy };
};

// Exported following functions for unit testing
export const getMonthKeysInRange = (start?: Dayjs, end?: Dayjs): string[] => {
  const { start: s, end: e } = resolveRange(start, end);
  const keys: string[] = [];
  let current = s.startOf("month");
  const last = e.startOf("month");
  let limit = 0;
  while (
    (current.isBefore(last) || current.isSame(last)) &&
    limit < MONTH_KEY_LIMIT
  ) {
    keys.push(`m${current.format("YYYYMM")}`);
    current = current.add(1, "month");
    limit++;
  }
  return keys;
};

export const getDayKeysInRange = (start?: Dayjs, end?: Dayjs): string[] => {
  const { start: s, end: e } = resolveRange(start, end);
  const keys: string[] = [];
  let current = s.startOf("day");
  const last = e.startOf("day");
  let limit = 0;
  while (
    (current.isBefore(last) || current.isSame(last)) &&
    limit < DAY_KEY_LIMIT
  ) {
    keys.push(`m${current.format("YYYYMMDD")}`);
    current = current.add(1, "day");
    limit++;
  }
  return keys;
};

/**
 * Count property keys for the filter range, using only the bucket format
 * declared by PMTiles `.metadata` `time_group_by` (`date` → mYYYYMMDD,
 * `month` → mYYYYMM). When metadata min/max are provided, the range is
 * clamped so paint/filter expressions do not expand empty calendar days
 * outside the tile's actual coverage (counts are already pre-aggregated
 * as m* properties — we only sum those keys).
 */
export const getDateKeysInRange = (
  start?: Dayjs,
  end?: Dayjs,
  timeGroupBy: TimeGroupBy = DEFAULT_TIME_GROUP_BY,
  bounds?: PMTilesMetadataRange | null
): string[] => {
  const clamped = clampRangeToMetadata(start, end, bounds, timeGroupBy);
  return timeGroupBy === TimeGroupBy.Date
    ? getDayKeysInRange(clamped.start, clamped.end)
    : getMonthKeysInRange(clamped.start, clamped.end);
};

/** Format mYYYYMM → YYYY-MM or mYYYYMMDD → YYYY-MM-DD. */
export const formatDateKey = (key: string): string => {
  const digits = key.startsWith("m") ? key.slice(1) : key;
  if (digits.length >= 8) {
    return `${digits.slice(0, 4)}-${digits.slice(4, 6)}-${digits.slice(6, 8)}`;
  }
  return `${digits.slice(0, 4)}-${digits.slice(4, 6)}`;
};

/**
 * Whether a count property key falls in the filter range for the active
 * `time_group_by`. Keys that do not match the expected bucket length are
 * rejected (month tiles → mYYYYMM only; date tiles → mYYYYMMDD only).
 */
export const isCountPropertyInRange = (
  key: string,
  filterStart?: Dayjs,
  filterEnd?: Dayjs,
  timeGroupBy: TimeGroupBy = DEFAULT_TIME_GROUP_BY
): boolean => {
  if (!COUNT_PROPERTY_KEY.test(key)) return false;
  const digits = key.slice(1);
  const isDayKey = digits.length === 8;
  if (timeGroupBy === TimeGroupBy.Date ? !isDayKey : isDayKey) return false;

  const { start, end } = resolveRange(filterStart, filterEnd);
  const rangeStart = start.startOf("day");
  const rangeEnd = end.startOf("day");
  if (rangeStart.isAfter(rangeEnd)) return false;

  if (isDayKey) {
    const day = dayjs(
      `${digits.slice(0, 4)}-${digits.slice(4, 6)}-${digits.slice(6, 8)}`
    );
    if (!day.isValid()) return false;
    return (
      (day.isAfter(rangeStart) || day.isSame(rangeStart, "day")) &&
      (day.isBefore(rangeEnd) || day.isSame(rangeEnd, "day"))
    );
  }

  // Month bucket: include when the month overlaps the filter window
  const monthStart = dayjs(`${digits.slice(0, 4)}-${digits.slice(4, 6)}-01`);
  if (!monthStart.isValid()) return false;
  const monthEnd = monthStart.endOf("month").startOf("day");
  return (
    !monthStart.isAfter(rangeEnd, "day") &&
    !monthEnd.isBefore(rangeStart, "day")
  );
};

/**
 * Coerce MVT property values to a finite number. Vector tiles often deliver
 * counts as strings; treating only typeof === "number" would zero every total.
 */
export const coerceCountValue = (value: unknown): number => {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() !== "") {
    const n = Number(value);
    if (Number.isFinite(n)) return n;
  }
  return NaN;
};

/**
 * Sparse sum of pre-baked m* counts on a feature for the filter window.
 * Only walks properties that exist (not a dense calendar of day keys).
 */
export const sumSparseCountFromProperties = (
  properties: Record<string, unknown> | null | undefined,
  filterStartDate?: Dayjs,
  filterEndDate?: Dayjs,
  timeGroupBy: TimeGroupBy = DEFAULT_TIME_GROUP_BY
): { total: number; matchedKeys: string[] } => {
  let total = 0;
  const matchedKeys: string[] = [];
  if (!properties) return { total, matchedKeys };

  for (const [key, value] of Object.entries(properties)) {
    const count = coerceCountValue(value);
    if (!Number.isFinite(count) || count <= 0) continue;
    if (
      !isCountPropertyInRange(key, filterStartDate, filterEndDate, timeGroupBy)
    ) {
      continue;
    }
    total += count;
    matchedKeys.push(key);
  }
  // Lexicographic order matches chronological order for mYYYYMM / mYYYYMMDD
  matchedKeys.sort();
  return { total, matchedKeys };
};

/**
 * Popup totals come from properties present on the feature (not a pre-built
 * key list), so long day-bucket series are not truncated by DAY_KEY_LIMIT.
 * Only properties matching `time_group_by` are summed.
 */
export const buildPopupHtml = (
  properties: Record<string, unknown>,
  filterStartDate?: Dayjs,
  filterEndDate?: Dayjs,
  timeGroupBy: TimeGroupBy = DEFAULT_TIME_GROUP_BY
): string => {
  const { total, matchedKeys } = sumSparseCountFromProperties(
    properties,
    filterStartDate,
    filterEndDate,
    timeGroupBy
  );
  const firstKey = matchedKeys[0];
  const lastKey = matchedKeys[matchedKeys.length - 1];
  return new InnerHtmlBuilder()
    .addTitle("Data Records In This Area:")
    .addText("Data Record Count: " + total)
    .addRange(
      "Time Range",
      firstKey ? formatDateKey(firstKey) : "N/A",
      lastKey ? formatDateKey(lastKey) : "N/A"
    )
    .getHtml();
};

/** @deprecated Prefer feature-state totals; kept for unit tests / tooling. */
export const buildSumExpression = (keys: string[]) => {
  if (keys.length === 0) return 0;
  if (keys.length === 1) return ["coalesce", ["get", keys[0]], 0];
  return ["+", ...keys.map((k) => ["coalesce", ["get", k], 0])];
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
 * Layer filter for density mode.
 *
 * IMPORTANT: Mapbox/MapLibre do **not** allow `feature-state` in filters — only
 * in paint/layout. Zero-count hexes are hidden via transparent paint instead.
 * Presence filter keeps only real hex features.
 */
export const buildDensityLayerFilter = (): ExpressionSpecification =>
  ["has", PROMOTE_ID_PROPERTY] as ExpressionSpecification;

/** @deprecated Use buildDensityLayerFilter — feature-state cannot be used in filters. */
export const buildFeatureStateNonZeroFilter = (): ExpressionSpecification =>
  buildDensityLayerFilter();

/** Phase A: any hex feature is present (tiles only contain cells with data). */
export const buildPresenceFilter = (): ExpressionSpecification =>
  ["has", PROMOTE_ID_PROPERTY] as ExpressionSpecification;

export type HexFillPaint = {
  "fill-color": ExpressionSpecification | string;
  "fill-opacity": ExpressionSpecification | number;
  "fill-outline-color": string;
};

export const PLACEHOLDER_FILL_COLOR = "#475569";
export const PLACEHOLDER_FILL_OPACITY = 0.4;

/** Neutral style while feature-state totals are computed in the background. */
export const getPlaceholderPaintProperties = (): HexFillPaint => ({
  "fill-color": PLACEHOLDER_FILL_COLOR,
  "fill-opacity": PLACEHOLDER_FILL_OPACITY,
  "fill-outline-color": "rgba(255, 255, 255, 0.4)",
});

/**
 * Density paint driven by feature-state totals (no dense day-key sum).
 *
 * Unset feature-state (tile not yet processed) keeps the placeholder look so
 * newly loaded hexes do not disappear until their sparse total is written.
 * A real total of 0 paints transparent (out of filter range).
 */
export const getFeatureStatePaintProperties = (): HexFillPaint => {
  const totalIsSet = buildFeatureStateTotalIsSetExpression();
  const sumExpr = buildFeatureStateTotalExpression();
  return {
    "fill-color": [
      "case",
      ["!", totalIsSet],
      PLACEHOLDER_FILL_COLOR,
      [
        "interpolate",
        ["linear"],
        sumExpr,
        0,
        "rgba(0, 0, 0, 0)",
        1,
        "#1E293B",
        10,
        "#334155",
        100,
        "#475569",
        1000,
        "#0284C7",
        5000,
        "#0D9488",
        10000,
        "#14B8A6",
      ],
    ] as ExpressionSpecification,
    "fill-opacity": [
      "case",
      ["!", totalIsSet],
      PLACEHOLDER_FILL_OPACITY,
      ["interpolate", ["linear"], sumExpr, 0, 0, 1, 0.15, 100, 0.6, 1000, 0.8],
    ] as ExpressionSpecification,
    "fill-outline-color": "rgba(255, 255, 255, 0.4)",
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
 * For each loaded vector feature, sum sparse m* properties in the filter
 * range and write the total to feature-state for paint/filter.
 */
export const updateFeatureStateTotals = (
  map: Map,
  filterStartDate?: Dayjs,
  filterEndDate?: Dayjs,
  timeGroupBy: TimeGroupBy = DEFAULT_TIME_GROUP_BY
): number => {
  if (!map.getSource(SOURCE_ID)) return 0;

  let updated = 0;
  for (const layer of PMTILE_LAYERS) {
    let features;
    try {
      features = map.querySourceFeatures(SOURCE_ID, {
        sourceLayer: layer.sourceLayer,
      });
    } catch {
      continue;
    }

    for (const feature of features) {
      // promoteId: "h" should populate feature.id; fall back to property
      const rawId = feature.id ?? feature.properties?.[PROMOTE_ID_PROPERTY];
      if (rawId === undefined || rawId === null || rawId === "") continue;
      // Mapbox feature ids are string | number; keep type from promoteId
      const id = rawId as string | number;

      const { total } = sumSparseCountFromProperties(
        feature.properties as Record<string, unknown> | null,
        filterStartDate,
        filterEndDate,
        timeGroupBy
      );

      try {
        map.setFeatureState(
          {
            source: SOURCE_ID,
            sourceLayer: layer.sourceLayer,
            id,
          },
          { [FEATURE_STATE_TOTAL]: total }
        );
        updated++;
      } catch {
        // Feature may have left the tile cache
      }
    }
  }
  return updated;
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
        cb: () => void,
        opts?: { timeout: number }
      ) => number;
      cancelIdleCallback?: (id: number) => void;
    }
  ).requestIdleCallback;

  if (typeof ric === "function") {
    const id = ric(run, { timeout: 250 });
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

  const timeoutId = setTimeout(run, 0);
  return () => {
    cancelled = true;
    clearTimeout(timeoutId);
  };
};

/**
 * Trailing debounce so rapid tile `sourcedata` / `idle` events collapse into
 * one feature-state pass after the viewport settles (avoids partial updates).
 */
export const FEATURE_STATE_DEBOUNCE_MS = 120;

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
}) => {
  const { map } = useContext(MapContext);
  const filterStartDateRef = useRef(filterStartDate);
  const filterEndDateRef = useRef(filterEndDate);
  const visibleRef = useRef(visible);
  const timeGroupByRef = useRef<TimeGroupBy>(DEFAULT_TIME_GROUP_BY);
  const periodBoundsRef = useRef<PMTilesMetadataRange | null>(null);
  // Bumps when a newer feature-state pass is scheduled so stale idle work is dropped
  const featureStateGenRef = useRef(0);
  // Hover popup is disabled until feature-state density has been applied
  const densityReadyRef = useRef(false);
  const popupRef = useRef<Popup | null>(null);
  // Drives feature-state refresh once `.metadata` is known
  const [timeGroupBy, setTimeGroupBy] = useState<TimeGroupBy>(
    DEFAULT_TIME_GROUP_BY
  );
  const [periodBounds, setPeriodBounds] = useState<PMTilesMetadataRange | null>(
    null
  );

  const removePopup = useCallback(() => {
    popupRef.current?.remove();
    popupRef.current = null;
  }, []);

  /**
   * Sparse-sum loaded features into feature-state, then paint from those
   * totals (no dense day-key Mapbox expression).
   *
   * Tile loads arrive in waves; we debounce trailing updates so a pass runs
   * after the viewport settles and covers as many loaded features as possible.
   * Paint treats unset feature-state as placeholder (not transparent) so hexes
   * never vanish between tile fetch and the next state pass.
   *
   * Hover popups stay disabled from the moment a pass is scheduled until
   * feature-state totals are written and density paint is applied.
   *
   * @param showPlaceholder When true (date/metadata change), flash a cheap
   *   presence style first while totals recompute for a new filter window.
   */
  const scheduleFeatureStateDensity = useCallback(
    (options?: { showPlaceholder?: boolean; delayMs?: number }) => {
      if (!map) return () => undefined;

      const generation = ++featureStateGenRef.current;
      const showPlaceholder = options?.showPlaceholder ?? false;
      const delayMs = options?.delayMs ?? FEATURE_STATE_DEBOUNCE_MS;

      // Block popups while this (and any superseded) density pass is in flight
      densityReadyRef.current = false;
      removePopup();

      if (showPlaceholder) {
        try {
          applyHexLayerStyle(
            map,
            buildPresenceFilter(),
            getPlaceholderPaintProperties()
          );
        } catch {
          // Map may already be torn down
        }
      }

      return scheduleDebouncedWork(() => {
        if (generation !== featureStateGenRef.current) return;
        try {
          updateFeatureStateTotals(
            map,
            filterStartDateRef.current,
            filterEndDateRef.current,
            timeGroupByRef.current
          );
          // Density colors from feature-state; filter must NOT use feature-state
          // (unsupported). Unset totals stay placeholder; real 0 is transparent.
          applyHexLayerStyle(
            map,
            buildDensityLayerFilter(),
            getFeatureStatePaintProperties()
          );
          // Only the latest generation may re-enable hover popups
          if (generation === featureStateGenRef.current) {
            densityReadyRef.current = true;
          }
        } catch {
          // Map may already be torn down — leave densityReady false
        }
      }, delayMs);
    },
    [map, removePopup]
  );

  const handleSelectDataset = useCallback(
    (key: string) => {
      onSelectCoKey?.(key);
    },
    [onSelectCoKey]
  );

  // Derive dataset options from the collection's CO keys
  const datasetOptions = useMemo<SelectItem<string>[]>(() => {
    const coKeys = collection?.getAllCOKeys() ?? [];
    return coKeys.map((key) => ({
      value: key,
      label: key.replace(/\.(zarr|parquet)$/i, ""),
    }));
  }, [collection]);

  // The PMTiles visualization only exists for parquet datasets, so in a mixed
  // zarr/parquet collection, a non-parquet key falls back to the first parquet key
  const resolveParquetKey = useCallback((): string | undefined => {
    let key = selectedCoKey;
    if (key && collection?.getDatasetTypeByKey(key) !== DatasetType.PARQUET) {
      key = collection?.getAllParquetKeys()[0] ?? key;
    }
    return key;
  }, [collection, selectedCoKey]);

  const formSourceUrl = useCallback(() => {
    const key = resolveParquetKey();
    return `https://${bucket}.s3.${region}.amazonaws.com/portal/visualization/${collection?.id}/${key}.pmtiles`;
  }, [collection?.id, resolveParquetKey]);

  // Sidecar written next to the archive by batch PMTiles generation
  const formMetadataUrl = useCallback(() => {
    const key = resolveParquetKey();
    return `https://${bucket}.s3.${region}.amazonaws.com/portal/visualization/${collection?.id}/${key}.metadata`;
  }, [collection?.id, resolveParquetKey]);

  useEffect(() => {
    filterStartDateRef.current = filterStartDate;
    filterEndDateRef.current = filterEndDate;
    visibleRef.current = visible;
  }, [filterStartDate, filterEndDate, visible]);

  // Load `time_group_by` and period coverage from the `.metadata` sidecar
  useEffect(() => {
    const metadataUrl = formMetadataUrl();
    const abortController = new AbortController();

    // Reset while the new sidecar loads
    timeGroupByRef.current = DEFAULT_TIME_GROUP_BY;
    periodBoundsRef.current = null;
    startTransition(() => {
      setTimeGroupBy(DEFAULT_TIME_GROUP_BY);
      setPeriodBounds(null);
    });
    onMetadataPeriodChange?.(null);

    fetch(metadataUrl, { signal: abortController.signal })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Metadata fetch failed: ${response.status}`);
        }
        return response.json();
      })
      .then((data: unknown) => {
        if (abortController.signal.aborted) return;
        const metadata = parsePMTilesMetadata(data);
        if (!metadata) {
          timeGroupByRef.current = DEFAULT_TIME_GROUP_BY;
          periodBoundsRef.current = null;
          setTimeGroupBy(DEFAULT_TIME_GROUP_BY);
          setPeriodBounds(null);
          onMetadataPeriodChange?.(null);
          return;
        }
        const bounds: PMTilesMetadataRange = {
          minDate: metadata.minDate,
          maxDate: metadata.maxDate,
        };
        timeGroupByRef.current = metadata.timeGroupBy;
        periodBoundsRef.current = bounds;
        setTimeGroupBy(metadata.timeGroupBy);
        setPeriodBounds(bounds);
        onMetadataPeriodChange?.(metadata);
      })
      .catch((err: unknown) => {
        // Abort on unmount / URL change is expected — do not reset state twice
        if (err instanceof DOMException && err.name === "AbortError") return;
        // Missing or unreadable sidecar → date aggregation, no period clamp
        if (abortController.signal.aborted) return;
        timeGroupByRef.current = DEFAULT_TIME_GROUP_BY;
        periodBoundsRef.current = null;
        setTimeGroupBy(DEFAULT_TIME_GROUP_BY);
        setPeriodBounds(null);
        onMetadataPeriodChange?.(null);
      });

    return () => {
      abortController.abort();
    };
  }, [formMetadataUrl, onMetadataPeriodChange]);

  useEffect(() => {
    if (!map) return;

    const sourceUrl = formSourceUrl();
    let cancelDensity: (() => void) | undefined;

    const addSourceAndLayers = () => {
      try {
        addSourceAndLayersUnsafe();
      } catch (error) {
        // OK to ignore error here
      }
    };

    const addSourceAndLayersUnsafe = () => {
      if (!map.getSource(SOURCE_ID)) {
        map.addSource(SOURCE_ID, {
          type: "vector",
          url: sourceUrl,
          // Promote H3 cell id so setFeatureState can address each hex
          promoteId: PROMOTE_ID_PROPERTY,
        });
      }

      const placeholderPaint = getPlaceholderPaintProperties();
      let addedFillLayer = false;

      PMTILE_LAYERS.forEach((layer) => {
        if (!map.getLayer(layer.id)) {
          console.log(`Adding layer ${layer.id}`);
          addedFillLayer = true;
          map.addLayer({
            id: layer.id,
            type: "fill",
            source: SOURCE_ID,
            "source-layer": layer.sourceLayer,
            minzoom: layer.minzoom,
            maxzoom: layer.maxzoom,
            // Phase A until feature-state totals are written
            filter: buildPresenceFilter(),
            layout: {
              visibility: visibleRef.current ? "visible" : "none",
            },
            paint: {
              "fill-color": placeholderPaint["fill-color"],
              "fill-opacity": placeholderPaint["fill-opacity"],
              "fill-outline-color": placeholderPaint["fill-outline-color"],
            },
          });
        }
      });

      // Highlight outline for the hovered hexbin, drawn above the fill layers
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
            visibility: visibleRef.current ? "visible" : "none",
            "line-join": "round",
            "line-cap": "round",
          },
          paint: {
            // Brighter and slightly thicker than the fill layers' default
            // outline (rgba(255, 255, 255, 0.4), 1px)
            "line-color": "rgba(255, 255, 255, 0.9)",
            "line-width": 1.5,
          },
        });
      }

      if (addedFillLayer) {
        cancelDensity?.();
        cancelDensity = scheduleFeatureStateDensity({ showPlaceholder: true });
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

    const rescheduleDensityFromTiles = () => {
      cancelDensity?.();
      // No placeholder flash — paint already keeps unset totals as placeholder
      cancelDensity = scheduleFeatureStateDensity({ showPlaceholder: false });
    };

    // Tile content arrives in waves; re-sum all currently loaded features.
    // Skip metadata-only events. Do not require isSourceLoaded — intermediate
    // tile batches must still get feature-state or hexes look "half missing".
    const onSourceData = (e: MapSourceDataEvent) => {
      if (e.sourceId !== SOURCE_ID) return;
      if (e.sourceDataType === "metadata") return;
      rescheduleDensityFromTiles();
    };
    map.on("sourcedata", onSourceData);

    // After pan/zoom settles, run another pass for any tiles that finished
    // loading after the last sourcedata debounce window.
    const onMoveEnd = () => {
      rescheduleDensityFromTiles();
    };
    map.on("moveend", onMoveEnd);

    return () => {
      if (!map) return;

      cancelDensity?.();
      featureStateGenRef.current += 1;
      densityReadyRef.current = false;

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
        // Removing sources drops tile cache + remaining feature-state
        if (map.getSource(SOURCE_ID)) {
          map.removeSource(SOURCE_ID);
        }
        if (map.getSource(HOVER_SOURCE_ID)) {
          map.removeSource(HOVER_SOURCE_ID);
        }
      } catch (error) {
        // OK to ignore error here
      } finally {
        map.off("styledata", onStyleData);
        map.off("sourcedata", onSourceData);
        map.off("moveend", onMoveEnd);
        map.off("load", addSourceAndLayers);
        removePopup();
      }
    };
  }, [
    map,
    collection?.id,
    selectedCoKey,
    formSourceUrl,
    removePopup,
    scheduleFeatureStateDensity,
  ]);

  // Show an aggregation-details popup and highlight outline while hovering
  // a hexbin
  useEffect(() => {
    if (!map) return;

    // Identity of the currently hovered hexbin, so the popup HTML and the
    // highlight outline are only rebuilt when the cursor moves onto a
    // different feature
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
      // The deck.gl overlay (HexbinLayer) rewrites the canvas's inline
      // cursor on every pointer move, so toggle a CSS class instead
      map.getCanvas().classList.remove(CURSOR_POINTER_CLASS);
      hoveredId = undefined;
      setHoverOutline(undefined);
      removePopup();
    };

    const onHexHover = (
      layer: (typeof PMTILE_LAYERS)[number],
      e: MapMouseEvent
    ) => {
      if (!visibleRef.current) return;
      // Wait until feature-state density totals are applied — popup counts
      // would be incomplete or wrong during the placeholder phase.
      if (!densityReadyRef.current) {
        clearHover();
        return;
      }
      // queryRenderedFeatures ignores layer minzoom/maxzoom, so retained
      // lower-zoom tiles can still report hexbins from bands that are no
      // longer rendered — skip those.
      const zoom = map.getZoom();
      if (zoom < layer.minzoom || zoom >= layer.maxzoom) return;

      const feature = e.features?.[0];
      if (!feature) return;

      map.getCanvas().classList.add(CURSOR_POINTER_CLASS);

      if (!popupRef.current) {
        // A hover popup must not show a close button
        popupRef.current = new Popup({
          ...MapDefaultConfig.DEFAULT_POPUP,
          closeButton: false,
        });
        hoveredId = undefined;
      }

      // Vector tile features may not carry an id; rebuild every event then
      if (feature.id === undefined || feature.id !== hoveredId) {
        hoveredId = feature.id;
        popupRef.current.setHTML(
          buildPopupHtml(
            feature.properties ?? {},
            filterStartDateRef.current,
            filterEndDateRef.current,
            timeGroupByRef.current
          )
        );
        setHoverOutline(feature.geometry);
      }

      popupRef.current.setLngLat(e.lngLat);
      if (!popupRef.current.isOpen()) {
        popupRef.current.addTo(map);
      }

      // add test id for playwright tests
      const popupElement = popupRef.current.getElement();
      if (popupElement) {
        popupElement.dataset.testid = playwrightTestIds.DETAIL_MAP_POPUP;
      }
    };

    const onHexLeave = () => {
      clearHover();
    };

    // Drop any open hover popup/outline when the zoom changes, so a hexbin
    // hovered just before crossing a zoom band can't linger once hidden
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
      } catch (error) {
        // OK to ignore error here — the map may already be torn down
      }
    };
  }, [map, removePopup]);

  // Update visibility on changes
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
    } catch (error) {
      // OK to ignore error here
    }
    if (!visible) {
      map.getCanvas().classList.remove(CURSOR_POINTER_CLASS);
      map
        .getSource<GeoJSONSource>(HOVER_SOURCE_ID)
        ?.setData(EMPTY_FEATURE_COLLECTION);
      removePopup();
    }
  }, [map, visible, removePopup]);

  // Recompute sparse feature-state totals when the date range or metadata changes.
  useEffect(() => {
    if (!map) return;
    const cancel = scheduleFeatureStateDensity({ showPlaceholder: true });
    removePopup();
    return cancel;
  }, [
    map,
    filterStartDate,
    filterEndDate,
    timeGroupBy,
    periodBounds,
    removePopup,
    scheduleFeatureStateDensity,
  ]);

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
    </>
  );
};

export default PMTilesHexLayer;
