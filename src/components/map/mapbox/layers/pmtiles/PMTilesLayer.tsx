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
  COUNTS_PROPERTY,
  DAYS_KEY,
  DENSITY_TOTAL_CAP,
  TOTAL_KEY,
  coercePeriodDigits,
  PmtilesHexLayerDef,
  PMTilesMetadataRange,
  PeriodInt,
  HexFillPaint,
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
import { dayjsToDayPeriod } from "@/utils/DateUtils";

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
 * Full coverage range from `{dname}.metadata` and whether the source had a
 * real TIME column (``hasTime``). Counts always use the nested all-grain tree.
 */
export interface PMTilesMetadata extends PMTilesMetadataRange {
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
}

const resolveRange = (start?: Dayjs, end?: Dayjs) => ({
  start: start || dayjs(DEFAULT_RANGE_START),
  end: end || dayjs(),
});

/** UI Dayjs → day period int (`YYYYMMDD`). */
export const dayjsToPeriodInt = (d: Dayjs): PeriodInt => dayjsToDayPeriod(d);

/** Days in calendar month (1–12); pure integer, no dayjs. */
export const daysInMonth = (year: number, month: number): number => {
  // month is 1–12
  if (month === 2) {
    const leap = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
    return leap ? 29 : 28;
  }
  if (month === 4 || month === 6 || month === 9 || month === 11) return 30;
  return 31;
};

/**
 * Parse a sidecar `min_date` / `max_date` into a validated day {@link PeriodInt}
 * (`YYYYMMDD`). Rejects unix-ms-sized numbers and invalid calendars without
 * using the value as a dayjs timestamp.
 */
export const parsePeriodInt = (value: unknown): PeriodInt | undefined => {
  const digits = coercePeriodDigits(value);
  if (!digits || digits.length !== 8) return undefined;
  // Guard: real unix-ms timestamps are 12–13 digits
  const iso = `${digits.slice(0, 4)}-${digits.slice(4, 6)}-${digits.slice(6, 8)}`;
  const day = dayjs(iso);
  if (!day.isValid() || day.format("YYYY-MM-DD") !== iso) return undefined;
  return Number(digits);
};

/**
 * Convert a day period int (or raw sidecar value) to Dayjs for UI edges only.
 *
 * Never call `dayjs(periodNumber)` — dayjs treats numbers as unix ms (→ 1970).
 * Digits are string-sliced into a calendar date, then parsed as ISO.
 */
export const periodNumberToDayjs = (value: unknown): Dayjs | undefined => {
  const digits = coercePeriodDigits(value);
  if (!digits || digits.length !== 8) return undefined;
  const iso = `${digits.slice(0, 4)}-${digits.slice(4, 6)}-${digits.slice(6, 8)}`;
  const day = dayjs(iso);
  return day.isValid() && day.format("YYYY-MM-DD") === iso
    ? day.startOf("day")
    : undefined;
};

/**
 * UI helper: Dayjs bounds for a metadata period range (slider / display).
 * Returns null if either bound fails to convert.
 */
export const metadataRangeToDayjs = (
  range: PMTilesMetadataRange
): { minDate: Dayjs; maxDate: Dayjs } | null => {
  const minDate = periodNumberToDayjs(range.minPeriod);
  const maxDate = periodNumberToDayjs(range.maxPeriod);
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
  bounds?: PMTilesMetadataRange | null
): { start: Dayjs; end: Dayjs } => {
  if (
    bounds &&
    (!bounds.hasTime || (start === undefined && end === undefined))
  ) {
    const minD = periodNumberToDayjs(bounds.minPeriod);
    const maxD = periodNumberToDayjs(bounds.maxPeriod);
    if (minD && maxD) return { start: minD, end: maxD };
  }

  const { start: s0, end: e0 } = resolveRange(start, end);
  const startPeriod = dayjsToPeriodInt(s0.startOf("day"));
  const endPeriod = dayjsToPeriodInt(e0.startOf("day"));

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

  const minD = periodNumberToDayjs(clamped.startPeriod);
  const maxD = periodNumberToDayjs(clamped.endPeriod);
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
 * Accepts sidecar field names (`min_date`, `max_date`, optional `has_time`).
 * `time_group_by` is ignored — tiles always use the nested all-grain tree.
 * Returns null when either bound is missing or invalid.
 * Bounds are stored as day {@link PeriodInt} (`YYYYMMDD`, not Dayjs).
 */
export const parsePMTilesMetadata = (data: unknown): PMTilesMetadata | null => {
  if (data == null || typeof data !== "object") return null;
  const raw = data as Record<string, unknown>;
  const minPeriod = parsePeriodInt(raw.min_date);
  const maxPeriod = parsePeriodInt(raw.max_date);
  if (minPeriod === undefined || maxPeriod === undefined) return null;
  if (minPeriod > maxPeriod) return null;
  return {
    minPeriod,
    maxPeriod,
    hasTime: parseHasTime(raw.has_time),
  };
};

/**
 * Precomputed filter window for nested counts-tree sums.
 * Prefer this over dayjs-per-key checks in the density hot path.
 */
export type CountFilterRange = {
  /** Inclusive YYYYMMDD integer bound. */
  startPeriod: number;
  /** Inclusive YYYYMMDD integer bound. */
  endPeriod: number;
  /** True when start is after end (sum always 0). */
  empty: boolean;
};

/**
 * Build a reusable filter range for density/popup sums from period ints.
 * Dayjs is not used on this path — convert at the edge with
 * {@link buildCountFilterRange} when the UI still speaks Dayjs.
 */
export const buildCountFilterRangeFromPeriods = (
  startPeriod: PeriodInt,
  endPeriod: PeriodInt,
  options?: {
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
      startPeriod: 0,
      endPeriod: -1,
      empty: true,
    };
  }

  return {
    startPeriod: clamped.startPeriod,
    endPeriod: clamped.endPeriod,
    empty: false,
  };
};

/**
 * Build a reusable filter range for density/popup sums.
 * Converts the UI Dayjs window to day {@link PeriodInt} once, then clamps/sums
 * with integers against the nested counts tree.
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
  options?: {
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
      options
    );
  }

  const { start, end } = resolveRange(filterStart, filterEnd);
  const rangeStart = start.startOf("day");
  const rangeEnd = end.startOf("day");
  if (rangeStart.isAfter(rangeEnd)) {
    return {
      startPeriod: 0,
      endPeriod: -1,
      empty: true,
    };
  }

  return buildCountFilterRangeFromPeriods(
    dayjsToPeriodInt(rangeStart),
    dayjsToPeriodInt(rangeEnd),
    options
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

/** Nested counts tree: year → month → days, with optional `t` totals. */
export type CountsTree = Record<string, unknown>;

/**
 * Parse feature property {@link COUNTS_PROPERTY} (`c`) into a nested tree.
 * MVT stores it as a JSON string; already-parsed objects are accepted too.
 */
export const parseCountsTree = (
  properties: Record<string, unknown> | null | undefined
): CountsTree | null => {
  if (!properties) return null;
  const raw = properties[COUNTS_PROPERTY];
  if (raw == null) return null;
  if (typeof raw === "object" && !Array.isArray(raw)) {
    return raw as CountsTree;
  }
  if (typeof raw !== "string" || raw.trim() === "") return null;
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (parsed == null || typeof parsed !== "object" || Array.isArray(parsed)) {
      return null;
    }
    return parsed as CountsTree;
  } catch {
    return null;
  }
};

/** Format a day period int for popup display: `YYYYMMDD` → `YYYY-MM-DD`. */
export const formatPeriodInt = (period: PeriodInt): string => {
  const d = String(Math.trunc(period)).padStart(8, "0");
  return `${d.slice(0, 4)}-${d.slice(4, 6)}-${d.slice(6, 8)}`;
};

/** Options for nested counts-tree summing (density vs exact popup). */
export type SumSparseCountOptions = {
  /**
   * When set, stop adding once `total` reaches this value and clamp the result.
   * Used for density paint (see `DENSITY_TOTAL_CAP`) so large hexes do not walk
   * every day/month node when the color scale has already saturated.
   */
  maxTotal?: number;
  /**
   * Track min/max periods that contributed to the total (popup time range).
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

export type SumSparseCountResult = {
  total: number;
  /**
   * Formatted period bounds that contributed (popup). Empty when no matches
   * or when collection was skipped. Length is 0 or 2 (`[min, max]` as strings
   * for display via {@link formatPeriodInt}).
   */
  matchedKeys: string[];
  /** Inclusive min day period that contributed (undefined when none / not collected). */
  minPeriod?: PeriodInt;
  /** Inclusive max day period that contributed (undefined when none / not collected). */
  maxPeriod?: PeriodInt;
};

type SumTreeInternal = {
  total: number;
  minPeriod?: PeriodInt;
  maxPeriod?: PeriodInt;
  hitCap: boolean;
};

const notePeriod = (
  state: SumTreeInternal,
  period: PeriodInt,
  collect: boolean
): void => {
  if (!collect) return;
  if (state.minPeriod === undefined || period < state.minPeriod) {
    state.minPeriod = period;
  }
  if (state.maxPeriod === undefined || period > state.maxPeriod) {
    state.maxPeriod = period;
  }
};

const addCount = (
  state: SumTreeInternal,
  count: number,
  period: PeriodInt | undefined,
  collect: boolean,
  maxTotal?: number
): boolean => {
  // Returns true when maxTotal cap is hit (caller should stop).
  if (!Number.isFinite(count) || count <= 0) return false;
  state.total += count;
  if (period !== undefined) notePeriod(state, period, collect);
  if (maxTotal !== undefined && state.total >= maxTotal) {
    state.total = maxTotal;
    state.hitCap = true;
    return true;
  }
  return false;
};

/**
 * Hierarchical sum of the nested all-grain counts tree for an inclusive day
 * filter range (`YYYYMMDD`).
 *
 * Uses pre-baked year/month {@link TOTAL_KEY} when a unit is fully covered so
 * multi-year windows are O(years + partial months) rather than O(days).
 * Density (no period bounds) takes those fast paths; popup walks day leaves
 * so min/max observation dates stay accurate.
 */
export const sumCountsTreeInRange = (
  tree: CountsTree,
  range: CountFilterRange,
  options?: { maxTotal?: number; collectPeriodBounds?: boolean }
): SumTreeInternal => {
  const state: SumTreeInternal = { total: 0, hitCap: false };
  if (range.empty) return state;

  const start = range.startPeriod;
  const end = range.endPeriod;
  const maxTotal = options?.maxTotal;
  const collect = options?.collectPeriodBounds === true;
  const allowUnitTotals = !collect;

  const startYear = Math.floor(start / 10000);
  const endYear = Math.floor(end / 10000);

  for (const yearKey of Object.keys(tree)) {
    const year = Number(yearKey);
    if (!Number.isFinite(year)) continue;
    if (year < startYear || year > endYear) continue;

    const yearNode = tree[yearKey];
    if (yearNode == null || typeof yearNode !== "object") continue;
    const yNode = yearNode as CountsTree;

    const yearStartDay = year * 10000 + 101;
    const yearEndDay = year * 10000 + 1231;
    if (allowUnitTotals && yearStartDay >= start && yearEndDay <= end) {
      const t = coerceCountValue(yNode[TOTAL_KEY]);
      if (addCount(state, t, undefined, false, maxTotal)) return state;
      continue;
    }

    for (const monthKey of Object.keys(yNode)) {
      if (monthKey === TOTAL_KEY) continue;
      const month = Number(monthKey);
      if (!Number.isFinite(month) || month < 1 || month > 12) continue;

      const monthNode = yNode[monthKey];
      if (monthNode == null || typeof monthNode !== "object") continue;
      const mNode = monthNode as CountsTree;

      const dim = daysInMonth(year, month);
      const monthStartDay = year * 10000 + month * 100 + 1;
      const monthEndDay = year * 10000 + month * 100 + dim;

      if (monthEndDay < start || monthStartDay > end) continue;

      if (allowUnitTotals && monthStartDay >= start && monthEndDay <= end) {
        const t = coerceCountValue(mNode[TOTAL_KEY]);
        if (addCount(state, t, undefined, false, maxTotal)) return state;
        continue;
      }

      // Partial month (or popup bounds path): sum day map entries in range.
      const days = mNode[DAYS_KEY];
      if (days == null || typeof days !== "object" || Array.isArray(days)) {
        continue;
      }
      for (const dayKey of Object.keys(days as CountsTree)) {
        const day = Number(dayKey);
        if (!Number.isFinite(day) || day < 1 || day > 31) continue;
        const period = year * 10000 + month * 100 + day;
        if (period < start || period > end) continue;
        const count = coerceCountValue((days as CountsTree)[dayKey]);
        if (addCount(state, count, period, collect, maxTotal)) return state;
      }
    }
  }

  return state;
};

/**
 * Sum nested counts tree (`c`) on a feature for the filter window.
 *
 * Pass `maxTotal` (e.g. `DENSITY_TOTAL_CAP`) for density feature-state so
 * high-count hexes exit early; omit it for popup HTML so counts stay exact.
 * Pass `options.range` from {@link buildCountFilterRange} to avoid dayjs work
 * per feature.
 */
export const sumSparseCountFromProperties = (
  properties: Record<string, unknown> | null | undefined,
  filterStartDate?: Dayjs,
  filterEndDate?: Dayjs,
  options?: SumSparseCountOptions
): SumSparseCountResult => {
  const empty = (): SumSparseCountResult => ({
    total: 0,
    matchedKeys: [],
  });

  if (!properties) return empty();

  const range =
    options?.range ?? buildCountFilterRange(filterStartDate, filterEndDate);
  if (range.empty) return empty();

  const tree = parseCountsTree(properties);
  if (!tree) return empty();

  const maxTotal = options?.maxTotal;
  const collectPeriodBounds =
    options?.collectMatchedKeys ?? maxTotal === undefined;

  const { total, minPeriod, maxPeriod } = sumCountsTreeInRange(tree, range, {
    maxTotal,
    collectPeriodBounds,
  });

  const matchedKeys: string[] = [];
  if (
    collectPeriodBounds &&
    minPeriod !== undefined &&
    maxPeriod !== undefined
  ) {
    matchedKeys.push(formatPeriodInt(minPeriod), formatPeriodInt(maxPeriod));
  }

  return {
    total,
    matchedKeys,
    minPeriod,
    maxPeriod,
  };
};

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
  options?: UpdateFeatureStateTotalsOptions
): UpdateFeatureStateTotalsResult => {
  if (!map.getSource(SOURCE_ID)) {
    return { updated: 0, seen: 0, complete: true };
  }

  const range =
    options?.range ?? buildCountFilterRange(filterStartDate, filterEndDate);
  const session = options?.session;
  const maxFeatures = options?.maxFeatures;
  const layers = options?.layers ?? PMTILE_LAYERS;
  const sumOptions: SumSparseCountOptions = {
    maxTotal: DENSITY_TOTAL_CAP,
    collectMatchedKeys: false,
    range,
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

      // Cap at paint max — further day keys do not change color/opacity.
      // Popup uses an uncapped sum via buildPopupHtml for the exact count.
      const { total } = sumSparseCountFromProperties(
        feature.properties as Record<string, unknown> | null,
        filterStartDate,
        filterEndDate,
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
      return;
    }

    const abortController = new AbortController();
    // Clear parent slider bounds while the new sidecar loads
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
  }, [metadataUrl, onMetadataPeriodChange]);

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
  DENSITY_TOTAL_CAP,
  DENSITY_COLOR_STOPS,
  DENSITY_OPACITY_STOPS,
  PMTILE_LAYERS,
};
