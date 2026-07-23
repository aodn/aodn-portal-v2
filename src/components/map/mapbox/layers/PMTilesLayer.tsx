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
/**
 * Top density total used by paint interpolate and by the feature-state early-stop.
 * Totals at or above this value all paint the same; full accuracy is only needed
 * for the hover popup (which does not use this cap).
 *
 * Color/opacity breakpoints are ratios of this value — change only the cap and
 * the whole scale rescales (see `DENSITY_COLOR_STOPS` / `DENSITY_OPACITY_STOPS`).
 */
export const DENSITY_TOTAL_CAP = 10000;

/**
 * Density fill-color stops as a fraction of {@link DENSITY_TOTAL_CAP}.
 * Ratios must be strictly increasing from 0 to 1.
 */
export const DENSITY_COLOR_STOPS: ReadonlyArray<{
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
export const DENSITY_OPACITY_STOPS: ReadonlyArray<{
  ratio: number;
  opacity: number;
}> = [
  { ratio: 0, opacity: 0 },
  { ratio: 0.0001, opacity: 0.15 }, // 1 @ cap 10000
  { ratio: 0.01, opacity: 0.6 }, // 100
  { ratio: 0.1, opacity: 0.8 }, // 1000
];

/** Absolute count at a density ratio (rounded; keeps 0 exact). */
export const densityStopValue = (
  ratio: number,
  cap: number = DENSITY_TOTAL_CAP
): number => (ratio === 0 ? 0 : Math.max(1, Math.round(ratio * cap)));

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
/**
 * Build a key allow-set when the filter window has at most this many buckets.
 * Wider day ranges use integer period compares only (building 10k+ keys is wasteful).
 */
export const COUNT_KEY_SET_MAX = 2000;
/** Features to sum + setFeatureState per idle slice (keeps the main thread responsive). */
export const FEATURE_STATE_CHUNK_SIZE = 200;

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
 * Precomputed filter window for sparse m* sums.
 * Prefer this over dayjs-per-key checks in the density hot path.
 */
export type CountFilterRange = {
  timeGroupBy: TimeGroupBy;
  /** Inclusive YYYYMM or YYYYMMDD integer bound. */
  startPeriod: number;
  /** Inclusive YYYYMM or YYYYMMDD integer bound. */
  endPeriod: number;
  /** True when start is after end (sum always 0). */
  empty: boolean;
  /**
   * Optional allow-set of `m*` keys when the window is small enough
   * ({@link COUNT_KEY_SET_MAX}). Membership is O(1); wide day ranges omit this
   * and use integer period compares only.
   */
  keySet?: ReadonlySet<string>;
};

/** Calendar day → YYYYMMDD integer (local calendar fields from dayjs). */
export const dayjsToDayPeriod = (d: Dayjs): number =>
  d.year() * 10000 + (d.month() + 1) * 100 + d.date();

/** Calendar month → YYYYMM integer. */
export const dayjsToMonthPeriod = (d: Dayjs): number =>
  d.year() * 100 + (d.month() + 1);

/**
 * Parse an mYYYYMM / mYYYYMMDD property name without dayjs.
 * Returns null when the key is not a count bucket.
 */
export const parseCountPropertyKey = (
  key: string
): { isDay: boolean; period: number } | null => {
  // Fast reject non-count props (e.g. promoteId "h") before regex
  if (key.length < 7 || key.length > 9 || key.charCodeAt(0) !== 109 /* m */) {
    return null;
  }
  const digits = key.slice(1);
  const len = digits.length;
  if (len !== 6 && len !== 8) return null;
  // Require pure digits (same as COUNT_PROPERTY_KEY)
  for (let i = 0; i < len; i++) {
    const c = digits.charCodeAt(i);
    if (c < 48 || c > 57) return null;
  }
  const period = Number(digits);
  if (!Number.isFinite(period)) return null;
  return { isDay: len === 8, period };
};

/**
 * Build a reusable filter range for density/popup sums.
 * Optionally attaches a key allow-set when the window is narrow.
 */
export const buildCountFilterRange = (
  filterStart?: Dayjs,
  filterEnd?: Dayjs,
  timeGroupBy: TimeGroupBy = DEFAULT_TIME_GROUP_BY,
  options?: { includeKeySet?: boolean }
): CountFilterRange => {
  const { start, end } = resolveRange(filterStart, filterEnd);
  const rangeStart = start.startOf("day");
  const rangeEnd = end.startOf("day");
  if (rangeStart.isAfter(rangeEnd)) {
    return {
      timeGroupBy,
      startPeriod: 0,
      endPeriod: -1,
      empty: true,
    };
  }

  const isDate = timeGroupBy === TimeGroupBy.Date;
  const startPeriod = isDate
    ? dayjsToDayPeriod(rangeStart)
    : dayjsToMonthPeriod(rangeStart);
  const endPeriod = isDate
    ? dayjsToDayPeriod(rangeEnd)
    : dayjsToMonthPeriod(rangeEnd);

  const range: CountFilterRange = {
    timeGroupBy,
    startPeriod,
    endPeriod,
    empty: false,
  };

  const includeKeySet = options?.includeKeySet !== false;
  if (includeKeySet) {
    const keys = isDate
      ? getDayKeysInRange(rangeStart, rangeEnd)
      : getMonthKeysInRange(rangeStart, rangeEnd);
    // Only attach when cheap; multi-decade day lists are worse than int compares
    if (keys.length > 0 && keys.length <= COUNT_KEY_SET_MAX) {
      range.keySet = new Set(keys);
    }
  }
  return range;
};

/**
 * Whether a count property key falls in a precomputed {@link CountFilterRange}.
 * Hot path: integer period compare (or Set when present) — no dayjs.
 */
export const isCountKeyInFilterRange = (
  key: string,
  range: CountFilterRange
): boolean => {
  if (range.empty) return false;
  if (range.keySet) {
    return range.keySet.has(key);
  }
  const parsed = parseCountPropertyKey(key);
  if (!parsed) return false;
  const wantDay = range.timeGroupBy === TimeGroupBy.Date;
  if (parsed.isDay !== wantDay) return false;
  return parsed.period >= range.startPeriod && parsed.period <= range.endPeriod;
};

/**
 * Whether a count property key falls in the filter range for the active
 * `time_group_by`. Keys that do not match the expected bucket length are
 * rejected (month tiles → mYYYYMM only; date tiles → mYYYYMMDD only).
 *
 * Convenience wrapper that builds a {@link CountFilterRange} each call —
 * prefer {@link isCountKeyInFilterRange} / {@link buildCountFilterRange} in loops.
 */
export const isCountPropertyInRange = (
  key: string,
  filterStart?: Dayjs,
  filterEnd?: Dayjs,
  timeGroupBy: TimeGroupBy = DEFAULT_TIME_GROUP_BY
): boolean => {
  // No keySet: building keys just for a single membership check is wasteful
  const range = buildCountFilterRange(filterStart, filterEnd, timeGroupBy, {
    includeKeySet: false,
  });
  return isCountKeyInFilterRange(key, range);
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

/** Options for sparse m* summing (density vs exact popup). */
export type SumSparseCountOptions = {
  /**
   * When set, stop adding once `total` reaches this value and clamp the result.
   * Used for density paint (see `DENSITY_TOTAL_CAP`) so large hexes do not walk
   * every day/month property when the color scale has already saturated.
   */
  maxTotal?: number;
  /**
   * Collect and sort matching property keys (needed for popup time range).
   * Density feature-state only needs the total — default false when maxTotal
   * is set, true otherwise.
   */
  collectMatchedKeys?: boolean;
  /**
   * Precomputed filter range. When omitted, built from dayjs args (slower).
   * Density passes should always supply this.
   */
  range?: CountFilterRange;
};

/**
 * Sparse sum of pre-baked m* counts on a feature for the filter window.
 * Only walks properties that exist (not a dense calendar of day keys).
 *
 * Pass `maxTotal` (e.g. `DENSITY_TOTAL_CAP`) for density feature-state so
 * high-count hexes exit early; omit it for popup HTML so counts stay exact.
 * Pass `options.range` from {@link buildCountFilterRange} to avoid dayjs per key.
 */
export const sumSparseCountFromProperties = (
  properties: Record<string, unknown> | null | undefined,
  filterStartDate?: Dayjs,
  filterEndDate?: Dayjs,
  timeGroupBy: TimeGroupBy = DEFAULT_TIME_GROUP_BY,
  options?: SumSparseCountOptions
): { total: number; matchedKeys: string[] } => {
  let total = 0;
  const matchedKeys: string[] = [];
  if (!properties) return { total, matchedKeys };

  const range =
    options?.range ??
    buildCountFilterRange(filterStartDate, filterEndDate, timeGroupBy);
  if (range.empty) return { total, matchedKeys };

  const maxTotal = options?.maxTotal;
  const collectMatchedKeys =
    options?.collectMatchedKeys ?? maxTotal === undefined;
  const wantDay = range.timeGroupBy === TimeGroupBy.Date;
  const keySet = range.keySet;
  const startPeriod = range.startPeriod;
  const endPeriod = range.endPeriod;

  for (const key in properties) {
    // Own properties only (MVT bags are plain objects)
    if (!Object.prototype.hasOwnProperty.call(properties, key)) continue;

    // Fast path: allow-set (narrow windows) — skip period parse for non-members
    if (keySet) {
      if (!keySet.has(key)) continue;
    } else {
      const parsed = parseCountPropertyKey(key);
      if (!parsed || parsed.isDay !== wantDay) continue;
      if (parsed.period < startPeriod || parsed.period > endPeriod) continue;
    }

    const count = coerceCountValue(properties[key]);
    if (!Number.isFinite(count) || count <= 0) continue;

    total += count;
    if (collectMatchedKeys) {
      matchedKeys.push(key);
    }
    if (maxTotal !== undefined && total >= maxTotal) {
      total = maxTotal;
      break;
    }
  }
  // Lexicographic order matches chronological order for mYYYYMM / mYYYYMMDD
  if (collectMatchedKeys) {
    matchedKeys.sort();
  }
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
  timeGroupBy: TimeGroupBy = DEFAULT_TIME_GROUP_BY,
  range?: CountFilterRange
): string => {
  const { total, matchedKeys } = sumSparseCountFromProperties(
    properties,
    filterStartDate,
    filterEndDate,
    timeGroupBy,
    range ? { range } : undefined
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
 *
 * Color and opacity breakpoints scale with {@link DENSITY_TOTAL_CAP} via
 * {@link DENSITY_COLOR_STOPS} / {@link DENSITY_OPACITY_STOPS}.
 */
export const getFeatureStatePaintProperties = (
  cap: number = DENSITY_TOTAL_CAP
): HexFillPaint => {
  const totalIsSet = buildFeatureStateTotalIsSetExpression();
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
      ["interpolate", ["linear"], sumExpr, ...colorStops],
    ] as ExpressionSpecification,
    "fill-opacity": [
      "case",
      ["!", totalIsSet],
      PLACEHOLDER_FILL_OPACITY,
      ["interpolate", ["linear"], sumExpr, ...opacityStops],
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

export type UpdateFeatureStateTotalsOptions = {
  /** Precomputed range (required for hot path; built if omitted). */
  range?: CountFilterRange;
  /**
   * When set, skip features already present in `session.written` and add new
   * ones as they are written. Callers clear the set on filter/metadata change.
   */
  session?: FeatureStateTotalsSession;
  /**
   * Max features to write this call. When hit before all loaded features are
   * processed, `complete` is false so the caller can schedule another chunk.
   */
  maxFeatures?: number;
};

export type UpdateFeatureStateTotalsResult = {
  /** Features written in this call (not cumulative). */
  updated: number;
  /** False when `maxFeatures` stopped the pass early. */
  complete: boolean;
};

/**
 * For each loaded vector feature, sum sparse m* properties in the filter
 * range and write the total to feature-state for paint/filter.
 *
 * Supports incremental updates (skip `session.written`) and chunked work
 * (`maxFeatures`) so wide ranges stay responsive on the main thread.
 */
export const updateFeatureStateTotals = (
  map: Map,
  filterStartDate?: Dayjs,
  filterEndDate?: Dayjs,
  timeGroupBy: TimeGroupBy = DEFAULT_TIME_GROUP_BY,
  options?: UpdateFeatureStateTotalsOptions
): UpdateFeatureStateTotalsResult => {
  if (!map.getSource(SOURCE_ID)) {
    return { updated: 0, complete: true };
  }

  const range =
    options?.range ??
    buildCountFilterRange(filterStartDate, filterEndDate, timeGroupBy);
  const session = options?.session;
  const maxFeatures = options?.maxFeatures;
  const sumOptions: SumSparseCountOptions = {
    maxTotal: DENSITY_TOTAL_CAP,
    collectMatchedKeys: false,
    range,
  };

  let updated = 0;
  let stoppedEarly = false;

  outer: for (const layer of PMTILE_LAYERS) {
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
      const sessionKey = featureStateSessionKey(layer.sourceLayer, id);
      if (session?.written.has(sessionKey)) continue;

      // Cap at paint max — further day/month keys do not change color/opacity.
      // Popup uses an uncapped sum via buildPopupHtml for the exact count.
      const { total } = sumSparseCountFromProperties(
        feature.properties as Record<string, unknown> | null,
        filterStartDate,
        filterEndDate,
        timeGroupBy,
        sumOptions
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
        session?.written.add(sessionKey);
        updated++;
      } catch {
        // Feature may have left the tile cache
      }

      if (maxFeatures !== undefined && updated >= maxFeatures) {
        stoppedEarly = true;
        break outer;
      }
    }
  }
  return { updated, complete: !stoppedEarly };
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

  const timeoutId = setTimeout(run, 0);
  return () => {
    cancelled = true;
    clearTimeout(timeoutId);
  };
};

/**
 * Run `work` in idle slices until it returns true (done) or cancel is called.
 * Each slice is scheduled via {@link scheduleDeferredWork}.
 */
export const scheduleChunkedWork = (
  work: () => boolean,
  isStale?: () => boolean
): (() => void) => {
  let cancelled = false;
  let cancelSlice: (() => void) | undefined;

  const tick = () => {
    if (cancelled || isStale?.()) return;
    let done = false;
    try {
      done = work();
    } catch {
      // Treat errors as terminal for this chain
      return;
    }
    if (cancelled || isStale?.() || done) return;
    cancelSlice = scheduleDeferredWork(tick);
  };

  cancelSlice = scheduleDeferredWork(tick);
  return () => {
    cancelled = true;
    cancelSlice?.();
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
  /** Precomputed integer/key-set range for sparse sums (rebuilt on filter change). */
  const countFilterRangeRef = useRef<CountFilterRange>(
    buildCountFilterRange(undefined, undefined, DEFAULT_TIME_GROUP_BY)
  );
  /** Incremental feature-state session — cleared when the filter window changes. */
  const featureStateSessionRef = useRef<FeatureStateTotalsSession>(
    createFeatureStateTotalsSession()
  );
  // Bumps when a newer feature-state pass is scheduled so stale idle work is dropped
  const featureStateGenRef = useRef(0);
  // Hover popup is disabled until feature-state density has been applied
  const densityReadyRef = useRef(false);
  /**
   * Single density-pass controller. Tile storms set `dirty` instead of cancelling
   * mid-chunk (which used to leave feature-state cleared and never re-applied).
   * Do not wipe Mapbox feature-state on reset — overwrite totals in place so
   * density colors do not flash off.
   */
  const densityPassRef = useRef<{
    cancelDebounce: (() => void) | null;
    cancelChunks: (() => void) | null;
    runningChunks: boolean;
    dirty: boolean;
    pendingReset: boolean;
    /** Only used before density paint has been applied once (initial load). */
    pendingPlaceholder: boolean;
  }>({
    cancelDebounce: null,
    cancelChunks: null,
    runningChunks: false,
    dirty: false,
    pendingReset: false,
    pendingPlaceholder: false,
  });
  const popupRef = useRef<Popup | null>(null);
  // Drives feature-state refresh once `.metadata` is known (`time_group_by`)
  const [timeGroupBy, setTimeGroupBy] = useState<TimeGroupBy>(
    DEFAULT_TIME_GROUP_BY
  );

  const removePopup = useCallback(() => {
    popupRef.current?.remove();
    popupRef.current = null;
  }, []);

  type ScheduleFeatureStateDensity = (options?: {
    showPlaceholder?: boolean;
    delayMs?: number;
    resetSession?: boolean;
  }) => () => void;

  /**
   * Always call the latest scheduler from idle/chunk completions via this ref.
   * Avoids a self-reference inside `useCallback` (accessed-before-declaration /
   * stale closure when the callback identity changes).
   */
  const scheduleFeatureStateDensityRef = useRef<ScheduleFeatureStateDensity>(
    () => () => undefined
  );

  /**
   * Sparse-sum loaded features into feature-state, then paint from those
   * totals (no dense day-key Mapbox expression).
   *
   * Tile loads set a dirty flag rather than aborting an in-flight chunked pass.
   * When a pass finishes, a pending dirty re-run processes only new hexes.
   * Filter changes reset the session (recompute all) but do **not** call
   * `removeFeatureState` first — that flash was wiping colors before the next
   * pass could finish, and a cancelled pass left the map empty.
   *
   * @param showPlaceholder When true and density has never been ready, show
   *   neutral presence paint until the first totals land.
   * @param resetSession When true, drop incremental session so every loaded
   *   feature is re-summed (date / time_group_by change).
   */
  const scheduleFeatureStateDensity = useCallback<ScheduleFeatureStateDensity>(
    (options) => {
      if (!map) return () => undefined;

      const pass = densityPassRef.current;
      const delayMs = options?.delayMs ?? FEATURE_STATE_DEBOUNCE_MS;

      if (options?.resetSession) {
        pass.pendingReset = true;
      }
      if (options?.showPlaceholder) {
        pass.pendingPlaceholder = true;
      }
      pass.dirty = true;

      // Filter change while chunks are running: abort and restart so we do not
      // keep writing totals for the old window into the new session.
      if (pass.runningChunks && options?.resetSession) {
        pass.cancelChunks?.();
        pass.cancelChunks = null;
        pass.runningChunks = false;
        // Invalidate in-flight work so its completion handler does not mark ready
        featureStateGenRef.current += 1;
      }

      // Tile-only update while a pass is in flight: finish current pass, then
      // re-run once for any features that arrived mid-flight.
      if (pass.runningChunks) {
        return () => undefined;
      }

      // Coalesce rapid schedule calls into one debounced start
      pass.cancelDebounce?.();
      pass.cancelDebounce = scheduleDebouncedWork(() => {
        pass.cancelDebounce = null;
        if (!pass.dirty && !pass.pendingReset) return;
        if (!map.getSource(SOURCE_ID)) return;

        const doReset = pass.pendingReset;
        const doPlaceholder = pass.pendingPlaceholder;
        pass.pendingReset = false;
        pass.pendingPlaceholder = false;
        pass.dirty = false;

        if (doReset) {
          // Overwrite totals in place — do not clearFeatureState (avoids empty flash)
          featureStateSessionRef.current = createFeatureStateTotalsSession();
          densityReadyRef.current = false;
          removePopup();
        }

        // Placeholder only on first load (never after density paint has been applied)
        if (doPlaceholder && !densityReadyRef.current) {
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

        // Density paint early so each setFeatureState lights up immediately
        try {
          applyHexLayerStyle(
            map,
            buildDensityLayerFilter(),
            getFeatureStatePaintProperties()
          );
        } catch {
          // Layers may not exist yet
        }

        const generation = ++featureStateGenRef.current;
        pass.runningChunks = true;

        pass.cancelChunks = scheduleChunkedWork(
          () => {
            if (generation !== featureStateGenRef.current) {
              pass.runningChunks = false;
              return true;
            }
            try {
              const { complete } = updateFeatureStateTotals(
                map,
                filterStartDateRef.current,
                filterEndDateRef.current,
                timeGroupByRef.current,
                {
                  range: countFilterRangeRef.current,
                  session: featureStateSessionRef.current,
                  maxFeatures: FEATURE_STATE_CHUNK_SIZE,
                }
              );
              if (!complete) return false;

              if (generation === featureStateGenRef.current) {
                densityReadyRef.current = true;
                pass.runningChunks = false;
                pass.cancelChunks = null;
                // Process hexes that arrived (or a filter reset) during this pass.
                // Call through the ref so we always hit the latest callback.
                if (pass.dirty || pass.pendingReset) {
                  scheduleFeatureStateDensityRef.current({
                    resetSession: pass.pendingReset,
                    showPlaceholder: false,
                    delayMs: 0,
                  });
                }
              }
              return true;
            } catch {
              pass.runningChunks = false;
              pass.cancelChunks = null;
              return true;
            }
          },
          () => generation !== featureStateGenRef.current
        );
      }, delayMs);

      return () => {
        // Effect cleanups only cancel the debounce they own when superseded;
        // in-flight chunks keep running unless a reset aborts them above.
        // Full teardown is handled by the source effect unmount path.
      };
    },
    [map, removePopup]
  );

  // Keep ref current so chunk completions never call a stale scheduler
  useEffect(() => {
    scheduleFeatureStateDensityRef.current = scheduleFeatureStateDensity;
  }, [scheduleFeatureStateDensity]);

  /** Abort all density work (source unmount / dataset change). */
  const cancelAllDensityWork = useCallback(() => {
    const pass = densityPassRef.current;
    pass.cancelDebounce?.();
    pass.cancelChunks?.();
    pass.cancelDebounce = null;
    pass.cancelChunks = null;
    pass.runningChunks = false;
    pass.dirty = false;
    pass.pendingReset = false;
    pass.pendingPlaceholder = false;
    featureStateGenRef.current += 1;
    densityReadyRef.current = false;
  }, []);

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

  // Rebuild integer/key-set range whenever the filter window or grouping changes
  useEffect(() => {
    countFilterRangeRef.current = buildCountFilterRange(
      filterStartDate,
      filterEndDate,
      timeGroupBy
    );
  }, [filterStartDate, filterEndDate, timeGroupBy]);

  // Load `time_group_by` and period coverage from the `.metadata` sidecar
  useEffect(() => {
    const metadataUrl = formMetadataUrl();
    const abortController = new AbortController();

    // Reset while the new sidecar loads
    timeGroupByRef.current = DEFAULT_TIME_GROUP_BY;
    periodBoundsRef.current = null;
    startTransition(() => {
      setTimeGroupBy(DEFAULT_TIME_GROUP_BY);
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
        onMetadataPeriodChange?.(null);
      });

    return () => {
      abortController.abort();
    };
  }, [formMetadataUrl, onMetadataPeriodChange]);

  useEffect(() => {
    if (!map) return;

    const sourceUrl = formSourceUrl();

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
        scheduleFeatureStateDensity({
          showPlaceholder: true,
          resetSession: true,
        });
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
      // Incremental: only new hexes; in-flight passes are not aborted
      scheduleFeatureStateDensity({
        showPlaceholder: false,
        resetSession: false,
      });
    };

    // Tile content arrives in waves; re-sum newly loaded features.
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

      cancelAllDensityWork();

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
    cancelAllDensityWork,
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
            timeGroupByRef.current,
            countFilterRangeRef.current
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

  // Full recompute when the date range or time grouping changes.
  // Intentionally omit periodBounds — metadata bounds only feed the parent
  // slider; re-running here was clearing colors after the first successful fill.
  useEffect(() => {
    if (!map) return;
    scheduleFeatureStateDensity({
      showPlaceholder: true,
      resetSession: true,
    });
    removePopup();
  }, [
    map,
    filterStartDate,
    filterEndDate,
    timeGroupBy,
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
