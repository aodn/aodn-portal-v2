import {
  FC,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

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

import {
  COUNT_KEY_SET_MAX,
  DEFAULT_TIME_GROUP_BY,
  DENSITY_TOTAL_CAP,
  coercePeriodDigits,
  PmtilesHexLayerDef,
  PMTilesMetadataRange,
  PeriodInt,
  HexFillPaint,
  parseTimeGroupBy,
  TimeGroupBy,
  densityStopValue,
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
import { dayjsToDayPeriod, dayjsToMonthPeriod } from "@/utils/DateUtils";

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
// Caps keep legacy key-list helpers bounded (tests / optional tooling).
// Day cap is high enough for multi-decade daily PMTiles (~55 years).
const MONTH_KEY_LIMIT = 1200;
const DAY_KEY_LIMIT = 20000;
/**
 * Fallback UI window start when the user has not set a date filter **and**
 * `.metadata` bounds are not yet available.
 *
 * Must predate any realistic dataset min (was `"2000-01-01"`, which zeroed
 * all density for pre-2000 tiles such as single-day `19700121` coverage once
 * clamped against metadata). Prefer using metadata bounds when present —
 * see {@link buildCountFilterRange}.
 */
const DEFAULT_RANGE_START = "1900-01-01";
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
/**
 * Full coverage range from `{dname}.metadata` including grouping mode
 * and whether the source had a real TIME column (``hasTime``).
 */
export interface PMTilesMetadata extends PMTilesMetadataRange {
  timeGroupBy: TimeGroupBy;
  /** Always set by {@link parsePMTilesMetadata} (defaults true for legacy). */
  hasTime: boolean;
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
  /**
   * Reports whether the `.metadata` sidecar exists on S3. A 404 means tiles were
   * never generated for this parquet, so the parent can drop the density layer
   * and fall back to another one.
   */
  onAvailabilityChange?: (isAvailable: boolean) => void;
}

const resolveRange = (start?: Dayjs, end?: Dayjs) => ({
  start: start || dayjs(DEFAULT_RANGE_START),
  end: end || dayjs(),
});

/**
 * Parse a sidecar `min_date` / `max_date` into a validated {@link PeriodInt}.
 * Rejects unix-ms-sized numbers and invalid calendars without using the value
 * as a dayjs timestamp.
 */
export const parsePeriodInt = (
  value: unknown,
  timeGroupBy: TimeGroupBy = DEFAULT_TIME_GROUP_BY
): PeriodInt | undefined => {
  const digits = coercePeriodDigits(value);
  if (!digits) return undefined;
  // Guard: real unix-ms timestamps are 12–13 digits; period keys are 6 or 8
  if (digits.length > 8 || digits.length < 6) return undefined;

  const isDate = timeGroupBy === TimeGroupBy.Date;
  // Date mode requires day periods; month mode requires month periods
  if (isDate) {
    if (digits.length !== 8) return undefined;
    const iso = `${digits.slice(0, 4)}-${digits.slice(4, 6)}-${digits.slice(6, 8)}`;
    const day = dayjs(iso);
    if (!day.isValid() || day.format("YYYY-MM-DD") !== iso) return undefined;
    return Number(digits);
  }

  // Month mode: accept YYYYMM only (sidecar month keys)
  if (digits.length !== 6) return undefined;
  const monthStart = dayjs(`${digits.slice(0, 4)}-${digits.slice(4, 6)}-01`);
  if (!monthStart.isValid()) return undefined;
  if (monthStart.format("YYYYMM") !== digits) return undefined;
  return Number(digits);
};

/**
 * Convert a period int (or raw sidecar value) to Dayjs for UI edges only.
 *
 * Never call `dayjs(periodNumber)` — dayjs treats numbers as unix ms (→ 1970).
 * Digits are string-sliced into a calendar date, then parsed as ISO.
 *
 * `bound` matters for month periods only (start → 1st, end → last day).
 */
export const periodNumberToDayjs = (
  value: unknown,
  timeGroupBy: TimeGroupBy = DEFAULT_TIME_GROUP_BY,
  bound: "start" | "end" = "start"
): Dayjs | undefined => {
  const digits = coercePeriodDigits(value);
  if (!digits || digits.length > 8) return undefined;

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
 * UI helper: Dayjs bounds for a metadata period range (slider / display).
 * Returns null if either bound fails to convert.
 */
export const metadataRangeToDayjs = (
  range: PMTilesMetadataRange,
  timeGroupBy: TimeGroupBy = DEFAULT_TIME_GROUP_BY
): { minDate: Dayjs; maxDate: Dayjs } | null => {
  const minDate = periodNumberToDayjs(range.minPeriod, timeGroupBy, "start");
  const maxDate = periodNumberToDayjs(range.maxPeriod, timeGroupBy, "end");
  if (!minDate || !maxDate) return null;
  return { minDate, maxDate };
};

/**
 * Clamp inclusive period ints to metadata coverage (integer-only, no dayjs).
 */
export const clampPeriodsToMetadata = (
  startPeriod: PeriodInt,
  endPeriod: PeriodInt,
  bounds?: PMTilesMetadataRange | null
): { startPeriod: PeriodInt; endPeriod: PeriodInt; empty: boolean } => {
  let s = startPeriod;
  let e = endPeriod;
  if (bounds) {
    if (s < bounds.minPeriod) s = bounds.minPeriod;
    if (e > bounds.maxPeriod) e = bounds.maxPeriod;
  }
  if (s > e) {
    return { startPeriod: 0, endPeriod: -1, empty: true };
  }
  return { startPeriod: s, endPeriod: e, empty: false };
};

/**
 * Intersect the UI filter window with metadata period coverage.
 * Converts Dayjs → period ints, clamps with integers, converts back for callers
 * that still expand key lists via dayjs walkers.
 *
 * When the UI has not set a filter (`start`/`end` both undefined) and metadata
 * bounds exist, use the full tile coverage — do not invent a default calendar
 * window that can miss pre-2000 data.
 *
 * Timeless tiles (``hasTime === false``) always use the full metadata coverage.
 */
export const clampRangeToMetadata = (
  start?: Dayjs,
  end?: Dayjs,
  bounds?: PMTilesMetadataRange | null,
  timeGroupBy: TimeGroupBy = DEFAULT_TIME_GROUP_BY
): { start: Dayjs; end: Dayjs } => {
  if (
    bounds &&
    (!bounds.hasTime || (start === undefined && end === undefined))
  ) {
    const minD = periodNumberToDayjs(bounds.minPeriod, timeGroupBy, "start");
    const maxD = periodNumberToDayjs(bounds.maxPeriod, timeGroupBy, "end");
    if (minD && maxD) return { start: minD, end: maxD };
  }

  const { start: s0, end: e0 } = resolveRange(start, end);
  const isDate = timeGroupBy === TimeGroupBy.Date;
  const startPeriod = isDate
    ? dayjsToDayPeriod(s0.startOf("day"))
    : dayjsToMonthPeriod(s0);
  const endPeriod = isDate
    ? dayjsToDayPeriod(e0.startOf("day"))
    : dayjsToMonthPeriod(e0);

  // Already inverted UI window — keep order so key walkers yield []
  if (startPeriod > endPeriod) {
    return { start: s0, end: e0 };
  }

  const clamped = clampPeriodsToMetadata(startPeriod, endPeriod, bounds);
  if (clamped.empty) {
    // No intersection with metadata — force start after end for key walkers
    const emptyEnd = s0.startOf("day").subtract(1, "day");
    return { start: s0.startOf("day"), end: emptyEnd };
  }

  const minD = periodNumberToDayjs(clamped.startPeriod, timeGroupBy, "start");
  const maxD = periodNumberToDayjs(clamped.endPeriod, timeGroupBy, "end");
  if (!minD || !maxD) return { start: s0, end: e0 };
  return { start: minD, end: maxD };
};

/**
 * Parse sidecar `has_time`. Missing → true (legacy timed tiles).
 */
const parseHasTime = (value: unknown): boolean => {
  if (value === undefined || value === null) return true;
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value !== 0;
  if (typeof value === "string") {
    const s = value.trim().toLowerCase();
    if (s === "false" || s === "0" || s === "no") return false;
    if (s === "true" || s === "1" || s === "yes") return true;
  }
  return Boolean(value);
};

/**
 * Parse the `{dname}.metadata` JSON body into app `PMTilesMetadata`.
 * Accepts the sidecar field names (`min_date`, `max_date`, `time_group_by`,
 * optional `has_time`).
 * Returns null when either bound is missing or invalid.
 * Bounds are stored as {@link PeriodInt} (not Dayjs).
 */
export const parsePMTilesMetadata = (data: unknown): PMTilesMetadata | null => {
  if (data == null || typeof data !== "object") return null;
  const raw = data as Record<string, unknown>;
  const timeGroupBy = parseTimeGroupBy(raw.time_group_by);
  const minPeriod = parsePeriodInt(raw.min_date, timeGroupBy);
  const maxPeriod = parsePeriodInt(raw.max_date, timeGroupBy);
  if (minPeriod === undefined || maxPeriod === undefined) return null;
  if (minPeriod > maxPeriod) return null;
  return {
    minPeriod,
    maxPeriod,
    timeGroupBy,
    hasTime: parseHasTime(raw.has_time),
  };
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
    // Date grain uses dYYYYMMDD (month stays mYYYYMM).
    keys.push(`d${current.format("YYYYMMDD")}`);
    current = current.add(1, "day");
    limit++;
  }
  return keys;
};

/**
 * Count property keys for the filter range, using only the bucket format
 * declared by PMTiles `.metadata` `time_group_by` (`date` → dYYYYMMDD,
 * `month` → mYYYYMM). When metadata min/max are provided, the range is
 * clamped so paint/filter expressions do not expand empty calendar days
 * outside the tile's actual coverage (counts are already pre-aggregated
 * as period properties — we only sum those keys).
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

/**
 * Format period property keys for display:
 * - ``dYYYYMMDD`` → YYYY-MM-DD
 * - ``mYYYYMM`` → YYYY-MM
 */
export const formatDateKey = (key: string): string => {
  const first = key.charCodeAt(0);
  const digits =
    first === 100 /* d */ || first === 109 /* m */ || first === 121 /* y */
      ? key.slice(1)
      : key;
  if (digits.length === 8) {
    return `${digits.slice(0, 4)}-${digits.slice(4, 6)}-${digits.slice(6, 8)}`;
  }
  if (digits.length === 4) {
    return digits; // yYYYY (future multi-grain)
  }
  return `${digits.slice(0, 4)}-${digits.slice(4, 6)}`;
};

/**
 * Precomputed filter window for sparse period-key sums.
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
   * Optional allow-set of period keys when the window is small enough
   * ({@link COUNT_KEY_SET_MAX}). Membership is O(1); wide day ranges omit this
   * and use integer period compares only.
   */
  keySet?: ReadonlySet<string>;
};

/**
 * Parse a count property name without dayjs.
 *
 * Accepted forms:
 * - ``dYYYYMMDD`` — date grain
 * - ``mYYYYMM`` — month grain
 *
 * Returns null when the key is not a count bucket.
 */
export const parseCountPropertyKey = (
  key: string
): { isDay: boolean; period: number } | null => {
  if (key.length < 7 || key.length > 9) return null;
  const prefix = key.charCodeAt(0);
  // d (100) or m (109) only for now; y (year) lands with multi-grain
  if (prefix !== 100 && prefix !== 109) return null;

  const digits = key.slice(1);
  const len = digits.length;
  // dYYYYMMDD (9 chars total) or mYYYYMM (7 chars total)
  if (prefix === 100 /* d */ && len !== 8) return null;
  if (prefix === 109 /* m */ && len !== 6) return null;

  for (let i = 0; i < len; i++) {
    const c = digits.charCodeAt(i);
    if (c < 48 || c > 57) return null;
  }
  const period = Number(digits);
  if (!Number.isFinite(period)) return null;

  return { isDay: prefix === 100 /* d */, period };
};

/**
 * Build a reusable filter range for density/popup sums from period ints.
 * Dayjs is not used on this path — convert at the edge with
 * {@link buildCountFilterRange} when the UI still speaks Dayjs.
 */
export const buildCountFilterRangeFromPeriods = (
  startPeriod: PeriodInt,
  endPeriod: PeriodInt,
  timeGroupBy: TimeGroupBy = DEFAULT_TIME_GROUP_BY,
  options?: {
    includeKeySet?: boolean;
    bounds?: PMTilesMetadataRange | null;
  }
): CountFilterRange => {
  const clamped = clampPeriodsToMetadata(
    startPeriod,
    endPeriod,
    options?.bounds
  );
  if (clamped.empty) {
    return {
      timeGroupBy,
      startPeriod: 0,
      endPeriod: -1,
      empty: true,
    };
  }

  const range: CountFilterRange = {
    timeGroupBy,
    startPeriod: clamped.startPeriod,
    endPeriod: clamped.endPeriod,
    empty: false,
  };

  // keySet is opt-in only — integer period compares are the default and are
  // safer for small tiles (a mismatched allow-set zeros every total).
  if (options?.includeKeySet === true) {
    // Key expansion still walks with dayjs once per filter change (not per feature)
    const startD = periodNumberToDayjs(
      clamped.startPeriod,
      timeGroupBy,
      "start"
    );
    const endD = periodNumberToDayjs(clamped.endPeriod, timeGroupBy, "end");
    if (startD && endD) {
      const keys =
        timeGroupBy === TimeGroupBy.Date
          ? getDayKeysInRange(startD, endD)
          : getMonthKeysInRange(startD, endD);
      if (keys.length > 0 && keys.length <= COUNT_KEY_SET_MAX) {
        range.keySet = new Set(keys);
      }
    }
  }
  return range;
};

/**
 * Build a reusable filter range for density/popup sums.
 * Converts the UI Dayjs window to {@link PeriodInt} once, then clamps/sums
 * with integers. Optionally attaches a key allow-set when the window is narrow.
 *
 * Full-coverage path: when the user has not applied a date filter (both ends
 * undefined) and `.metadata` bounds are known, sum the entire tile period —
 * including single-day archives such as min=max=`19700121`. A default window
 * starting in 2000 would clamp to empty against that coverage.
 *
 * Timeless path: when sidecar ``has_time`` is false, always sum the full
 * synthetic period from metadata — ignore UI date filters so density is not
 * zeroed by a collection extent that excludes the sentinel period.
 */
export const buildCountFilterRange = (
  filterStart?: Dayjs,
  filterEnd?: Dayjs,
  timeGroupBy: TimeGroupBy = DEFAULT_TIME_GROUP_BY,
  options?: {
    includeKeySet?: boolean;
    bounds?: PMTilesMetadataRange | null;
  }
): CountFilterRange => {
  const bounds = options?.bounds;
  const timeless = bounds != null && !bounds.hasTime;

  if (
    timeless ||
    (filterStart === undefined && filterEnd === undefined && bounds)
  ) {
    return buildCountFilterRangeFromPeriods(
      bounds!.minPeriod,
      bounds!.maxPeriod,
      timeGroupBy,
      options
    );
  }

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

  return buildCountFilterRangeFromPeriods(
    startPeriod,
    endPeriod,
    timeGroupBy,
    options
  );
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
 * `time_group_by`. Keys that do not match the expected grain are rejected
 * (month → mYYYYMM; date → dYYYYMMDD).
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
  /**
   * When true (default), if no keys match the expected day/month format but the
   * other format is present (common before `.metadata` loads on small monthly
   * tiles), re-sum with the inferred grouping so hexes are not painted as 0.
   */
  inferTimeGroupBy?: boolean;
};

export type SumSparseCountResult = {
  total: number;
  matchedKeys: string[];
  /** True when at least one m* key matched the active day/month format. */
  sawExpectedFormat: boolean;
  /** True when at least one m* key used the opposite day/month format. */
  sawOtherFormat: boolean;
  /** Grouping actually used for the total (may differ if inference ran). */
  timeGroupBy: TimeGroupBy;
};
/**
 * Sparse sum of pre-baked m* counts on a feature for the filter window.
 * Only walks properties that exist (not a dense calendar of day keys).
 *
 * Pass `maxTotal` (e.g. `DENSITY_TOTAL_CAP`) for density feature-state so
 * high-count hexes exit early; omit it for popup HTML so counts stay exact.
 * Pass `options.range` from {@link buildCountFilterRange} to avoid dayjs per key.
 *
 * Uses integer period compares by default (not a key allow-set) so small
 * datasets cannot vanish due to a mismatched keySet. If the tile uses the
 * opposite bucket format from `timeGroupBy` and nothing matches, optionally
 * infers the format from the property bag (see `inferTimeGroupBy`).
 */
export const sumSparseCountFromProperties = (
  properties: Record<string, unknown> | null | undefined,
  filterStartDate?: Dayjs,
  filterEndDate?: Dayjs,
  timeGroupBy: TimeGroupBy = DEFAULT_TIME_GROUP_BY,
  options?: SumSparseCountOptions
): SumSparseCountResult => {
  const empty = (): SumSparseCountResult => ({
    total: 0,
    matchedKeys: [],
    sawExpectedFormat: false,
    sawOtherFormat: false,
    timeGroupBy,
  });

  if (!properties) return empty();

  const range =
    options?.range ??
    buildCountFilterRange(filterStartDate, filterEndDate, timeGroupBy, {
      includeKeySet: false,
    });
  if (range.empty) {
    return { ...empty(), timeGroupBy: range.timeGroupBy };
  }

  const maxTotal = options?.maxTotal;
  const collectMatchedKeys =
    options?.collectMatchedKeys ?? maxTotal === undefined;
  const wantDay = range.timeGroupBy === TimeGroupBy.Date;
  const startPeriod = range.startPeriod;
  const endPeriod = range.endPeriod;

  let total = 0;
  const matchedKeys: string[] = [];
  let sawExpectedFormat = false;
  let sawOtherFormat = false;

  for (const key of Object.keys(properties)) {
    const parsed = parseCountPropertyKey(key);
    if (!parsed) continue;

    if (parsed.isDay !== wantDay) {
      sawOtherFormat = true;
      continue;
    }
    sawExpectedFormat = true;
    if (parsed.period < startPeriod || parsed.period > endPeriod) continue;

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

  // Small monthly tiles often load before `.metadata` sets time_group_by=month
  // while the UI still defaults to date — day-format sum is 0 and density paint
  // treats that as transparent (hexes disappear). Infer once from the bag.
  const allowInfer = options?.inferTimeGroupBy !== false;
  if (allowInfer && total === 0 && !sawExpectedFormat && sawOtherFormat) {
    const inferred = wantDay ? TimeGroupBy.Month : TimeGroupBy.Date;
    const inferredRange = buildCountFilterRange(
      filterStartDate,
      filterEndDate,
      inferred,
      { includeKeySet: false }
    );
    return sumSparseCountFromProperties(
      properties,
      filterStartDate,
      filterEndDate,
      inferred,
      {
        ...options,
        range: inferredRange,
        inferTimeGroupBy: false,
      }
    );
  }

  if (collectMatchedKeys) {
    matchedKeys.sort();
  }
  return {
    total,
    matchedKeys,
    sawExpectedFormat,
    sawOtherFormat,
    timeGroupBy: range.timeGroupBy,
  };
};

/**
 * Popup totals come from properties present on the feature (not a pre-built
 * key list), so long day-bucket series are not truncated by DAY_KEY_LIMIT.
 * Only properties matching `time_group_by` are summed.
 *
 * When ``hasTime`` is false (timeless / synthetic period tiles), the popup
 * omits the Time Range line so the synthetic sentinel is not shown as a
 * real observation date.
 */
export const buildPopupHtml = (
  properties: Record<string, unknown>,
  filterStartDate?: Dayjs,
  filterEndDate?: Dayjs,
  timeGroupBy: TimeGroupBy = DEFAULT_TIME_GROUP_BY,
  range?: CountFilterRange,
  hasTime: boolean = true
): string => {
  const { total, matchedKeys } = sumSparseCountFromProperties(
    properties,
    filterStartDate,
    filterEndDate,
    timeGroupBy,
    range ? { range } : undefined
  );
  const builder = new InnerHtmlBuilder()
    .addTitle("Data Records In This Area:")
    .addText("Data Record Count: " + total);

  if (hasTime) {
    const firstKey = matchedKeys[0];
    const lastKey = matchedKeys[matchedKeys.length - 1];
    builder.addRange(
      "Time Range",
      firstKey ? formatDateKey(firstKey) : "N/A",
      lastKey ? formatDateKey(lastKey) : "N/A"
    );
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
   * Max features to write this call. When hit before all loaded features are
   * processed, `complete` is false so the caller can schedule another chunk.
   */
  maxFeatures?: number;
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
  /** False when `maxFeatures` stopped the pass early. */
  complete: boolean;
};

/**
 * For each loaded vector feature, sum sparse m* properties in the filter
 * range and write the total to feature-state for paint/filter.
 *
 * Supports incremental updates (skip `session.written`) and chunked work
 * (`maxFeatures`) so wide ranges stay responsive on the main thread.
 * Pass `layers` (e.g. from {@link getActivePmtilesLayers}) to skip bands
 * that are not visible at the current zoom.
 */
export const updateFeatureStateTotals = (
  map: Map,
  filterStartDate?: Dayjs,
  filterEndDate?: Dayjs,
  timeGroupBy: TimeGroupBy = DEFAULT_TIME_GROUP_BY,
  options?: UpdateFeatureStateTotalsOptions
): UpdateFeatureStateTotalsResult => {
  if (!map.getSource(SOURCE_ID)) {
    return { updated: 0, seen: 0, complete: true };
  }

  const range =
    options?.range ??
    buildCountFilterRange(filterStartDate, filterEndDate, timeGroupBy, {
      includeKeySet: false,
    });
  const session = options?.session;
  const maxFeatures = options?.maxFeatures;
  const layers = options?.layers ?? PMTILE_LAYERS;
  // Infer opposite day/month format so small monthly tiles still light up
  // before (or without) a correct `.metadata` time_group_by.
  const sumOptions: SumSparseCountOptions = {
    maxTotal: DENSITY_TOTAL_CAP,
    collectMatchedKeys: false,
    range,
    inferTimeGroupBy: true,
  };

  let updated = 0;
  let seen = 0;
  let stoppedEarly = false;

  outer: for (const layer of layers) {
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
        // Feature may have left the tile cache — do not mark written
      }

      if (maxFeatures !== undefined && updated >= maxFeatures) {
        stoppedEarly = true;
        break outer;
      }
    }
  }
  return { updated, seen, complete: !stoppedEarly };
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
   * `timeGroupBy` / `periodBounds` fall back immediately (no setState reset
   * in an effect).
   */
  const [loadedMeta, setLoadedMeta] = useState<{
    url: string;
    timeGroupBy: TimeGroupBy;
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
  const timeGroupBy = metaMatchesUrl
    ? loadedMeta.timeGroupBy
    : DEFAULT_TIME_GROUP_BY;
  const periodBounds = metaMatchesUrl ? loadedMeta.bounds : null;

  const countFilterRange = useMemo(
    () =>
      buildCountFilterRange(filterStartDate, filterEndDate, timeGroupBy, {
        includeKeySet: false,
        bounds: periodBounds,
      }),
    [filterStartDate, filterEndDate, timeGroupBy, periodBounds]
  );

  /**
   * Latest values for map event handlers (hover). Updated in an effect — not
   * during render — so react-hooks/refs stays clean.
   */
  const hoverCtxRef = useRef({
    filterStartDate,
    filterEndDate,
    timeGroupBy,
    countFilterRange,
    hasTime: periodBounds?.hasTime !== false,
    densityReady,
    visible,
  });
  useEffect(() => {
    hoverCtxRef.current = {
      filterStartDate,
      filterEndDate,
      timeGroupBy,
      countFilterRange,
      hasTime: periodBounds?.hasTime !== false,
      densityReady,
      visible,
    };
  }, [
    filterStartDate,
    filterEndDate,
    timeGroupBy,
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

    // Undefined until a response arrives, so the catch below can tell a network
    // failure apart from a sidecar that responded but could not be parsed
    let sidecarFound: boolean | undefined;

    fetch(metadataUrl, { signal: abortController.signal })
      .then((response) => {
        // The sidecar's http status is the availability signal, independent of
        // whether its body parses
        sidecarFound = response.ok;
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
            timeGroupBy: DEFAULT_TIME_GROUP_BY,
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
          timeGroupBy: metadata.timeGroupBy,
          bounds,
        });
        onMetadataPeriodChange?.(metadata);
      })
      .catch((err: unknown) => {
        if (err instanceof DOMException && err.name === "AbortError") return;
        if (abortController.signal.aborted) return;
        // Network failure before any response. A sidecar that responded but
        // failed to parse keeps its reported availability - the tiles can still
        // render, they just lose their period bounds
        if (sidecarFound === undefined) {
          onAvailabilityChange?.(false);
        }
        setLoadedMeta({
          url: metadataUrl,
          timeGroupBy: DEFAULT_TIME_GROUP_BY,
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

        const range = buildCountFilterRange(
          filterStartDate,
          filterEndDate,
          timeGroupBy,
          { includeKeySet: false, bounds: periodBounds }
        );

        // Write every loaded feature in the active band (no incremental session).
        const { seen } = updateFeatureStateTotals(
          map,
          filterStartDate,
          filterEndDate,
          timeGroupBy,
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
  }, [
    map,
    formSourceUrl,
    filterStartDate,
    filterEndDate,
    timeGroupBy,
    periodBounds,
  ]);

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
        ctx.timeGroupBy,
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
            ctx.timeGroupBy,
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
  DENSITY_TOTAL_CAP,
  DENSITY_COLOR_STOPS,
  DENSITY_OPACITY_STOPS,
  PMTILE_LAYERS,
};
