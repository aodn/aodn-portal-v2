import { Dayjs } from "@/utils/DayjsUtils";
import { ExpressionSpecification } from "mapbox-gl";
import { dateDefault } from "@/components/common/constants";
import { dayjsToDayPeriod, getAppMaxDate, toAppDayjs } from "@/utils/DateUtils";

/** One Mapbox fill band over a PMTiles `hex_z*` source-layer. */
export type PmtilesHexLayerDef = {
  id: string;
  sourceLayer: string;
  minzoom: number;
  maxzoom: number;
};

/**
 * Inclusive calendar day as an integer `YYYYMMDD`. Prefer this over Dayjs for
 * all PMTiles internals.
 *
 * Never treat these as unix timestamps — `dayjs(20100815)` is ~1970.
 *
 * Counts always use the nested year→month→day tree under property
 * {@link COUNTS_PROPERTY} (`time_group_by` is always `all` at generation time).
 */
export type PeriodInt = number;

/**
 * Period coverage from `{dname}.metadata` as integers (same shape as sidecar
 * `min_date` / `max_date` after validation). Always day periods (`YYYYMMDD`).
 */
export interface PMTilesMetadataRange {
  minPeriod: PeriodInt;
  maxPeriod: PeriodInt;
  /**
   * False when the tile used a synthetic period (source parquet had no TIME).
   * Real single-day archives still have hasTime true even when min === max.
   * Legacy sidecars without the field are parsed as true.
   */
  hasTime: boolean;
}

/**
 * Full coverage range from `{dname}.metadata` and whether the source had a
 * real TIME column (``hasTime``). Counts always use the nested all-grain tree.
 */
export interface PMTilesMetadata extends PMTilesMetadataRange {
  /** Always set by {@link parsePMTilesMetadata} (defaults true for legacy). */
  hasTime: boolean;
}

/** Feature property holding the nested counts tree (JSON string in MVT). */
export const COUNTS_PROPERTY = "c";
/** Year/month total key inside the nested tree (not a calendar key). */
export const TOTAL_KEY = "t";
/** Day map key under each month node. */
export const DAYS_KEY = "d";

/**
 * Top density total used by paint interpolate and by the feature-state early-stop.
 * Totals at or above this value all paint the same; full accuracy is only needed
 * for the hover popup (which does not use this cap).
 */
export const DENSITY_TOTAL_CAP = 10000;

/**
 * Fallback UI window start when the user has not set a date filter **and**
 * `.metadata` bounds are not yet available.
 */
export const DEFAULT_RANGE_START = "1900-01-01";

const pmtilesBucket = import.meta.env.VITE_PMTILES_BUCKET;
const pmtilesRegion = import.meta.env.VITE_AWS_REGION;

const pmtilesVisualizationBase = (collectionId: string, key: string): string =>
  `https://${pmtilesBucket}.s3.${pmtilesRegion}.amazonaws.com/portal/visualization/${collectionId}/${key}`;

/** S3 vector-tile URL for a collection parquet key. */
export const buildPmtilesSourceUrl = (
  collectionId: string,
  key: string
): string => `${pmtilesVisualizationBase(collectionId, key)}.pmtiles`;

/** S3 sidecar URL next to the `.pmtiles` object. */
export const buildPmtilesMetadataUrl = (
  collectionId: string,
  key: string
): string => `${pmtilesVisualizationBase(collectionId, key)}.metadata`;

/**
 * Ordered parquet keys to probe for a `.metadata` sidecar.
 * Selected parquet key first (if it is one of the collection keys), then the rest.
 */
export const parquetKeyCandidates = (
  parquetKeys: readonly string[],
  selectedCoKey?: string
): string[] => {
  const selected = selectedCoKey?.trim() ?? "";
  if (selected !== "" && parquetKeys.includes(selected)) {
    return [selected, ...parquetKeys.filter((key) => key !== selected)];
  }
  return [...parquetKeys];
};

export type PmtilesMetadataProbeResult = {
  key: string;
  metadataUrl: string;
  data: unknown;
};

/**
 * GET each `{key}.metadata` until one returns HTTP OK.
 * A 200 with unparsable JSON still counts as the file existing.
 */
export const probePmtilesMetadata = async (
  collectionId: string,
  keys: readonly string[],
  signal?: AbortSignal
): Promise<PmtilesMetadataProbeResult | null> => {
  for (const key of keys) {
    if (signal?.aborted) return null;
    const metadataUrl = buildPmtilesMetadataUrl(collectionId, key);
    try {
      const response = await fetch(metadataUrl, { signal });
      if (!response.ok) continue;
      let data: unknown = null;
      try {
        data = await response.json();
      } catch {
        data = null;
      }
      return { key, metadataUrl, data };
    } catch {
      if (signal?.aborted) return null;
    }
  }
  return null;
};

/** Cap on parsed counts-tree cache entries (string keys from MVT property `c`). */
const COUNTS_TREE_CACHE_MAX = 4000;

export type HexFillPaint = {
  "fill-color": ExpressionSpecification | string;
  "fill-opacity": ExpressionSpecification | number;
  "fill-outline-color": ExpressionSpecification | string;
};

/** Nested counts tree: year → month → days, with optional `t` totals. */
export type CountsTree = Record<string, unknown>;

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

/** Options for nested counts-tree summing (density vs exact popup). */
export type SumSparseCountOptions = {
  /**
   * When set, stop adding once `total` reaches this value and clamp the result.
   * Used for density paint (see `DENSITY_TOTAL_CAP`).
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
   * or when collection was skipped. Length is 0 or 2.
   */
  matchedKeys: string[];
  minPeriod?: PeriodInt;
  maxPeriod?: PeriodInt;
};

export type SumTreeResult = {
  total: number;
  minPeriod?: PeriodInt;
  maxPeriod?: PeriodInt;
};

const EMPTY_SUM_RESULT: SumSparseCountResult = Object.freeze({
  total: 0,
  matchedKeys: [],
}) as SumSparseCountResult;

/** Days per month for non-leap years (index 1–12). */
const DAYS_IN_MONTH_COMMON = [
  0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31,
] as const;
/** Days per month for leap years (index 1–12). */
const DAYS_IN_MONTH_LEAP = [
  0, 31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31,
] as const;

/** Parsed tree cache: same MVT `c` string reuses one tree across density passes. */
const countsTreeCache = new Map<string, CountsTree>();

/** Digits from a sidecar period number or numeric string (no dayjs). */
export const coercePeriodDigits = (value: unknown): string | undefined => {
  if (typeof value === "number" && Number.isFinite(value)) {
    return String(Math.trunc(value));
  }
  if (typeof value === "string" && value.trim() !== "") {
    const n = Number(value.trim());
    if (Number.isFinite(n)) return String(Math.trunc(n));
  }
  return undefined;
};

/** Absolute count at a density ratio (rounded; keeps 0 exact). */
export const densityStopValue = (
  ratio: number,
  cap: number = DENSITY_TOTAL_CAP
): number => (ratio === 0 ? 0 : Math.max(1, Math.round(ratio * cap)));

const isLeapYear = (year: number): boolean =>
  (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;

/** Days in calendar month (1–12); pure integer, no dayjs. */
export const daysInMonth = (year: number, month: number): number => {
  if (month < 1 || month > 12) return 0;
  return (isLeapYear(year) ? DAYS_IN_MONTH_LEAP : DAYS_IN_MONTH_COMMON)[month]!;
};

const resolveRange = (start?: Dayjs, end?: Dayjs) => ({
  start: start || toAppDayjs(DEFAULT_RANGE_START, dateDefault.DATE_FORMAT),
  end: end || getAppMaxDate(),
});

/** UI Dayjs → day period int (`YYYYMMDD`). */
export const dayjsToPeriodInt = (d: Dayjs): PeriodInt => dayjsToDayPeriod(d);

/**
 * Parse a sidecar `min_date` / `max_date` into a validated day {@link PeriodInt}
 * (`YYYYMMDD`). Integer-only calendar check — no dayjs on the hot path.
 */
export const parsePeriodInt = (value: unknown): PeriodInt | undefined => {
  const digits = coercePeriodDigits(value);
  if (!digits || digits.length !== 8) return undefined;
  // Guard: all digits (coercePeriodDigits already truncated finite numbers)
  for (let i = 0; i < 8; i++) {
    const c = digits.charCodeAt(i);
    if (c < 48 || c > 57) return undefined;
  }
  const y =
    (digits.charCodeAt(0) - 48) * 1000 +
    (digits.charCodeAt(1) - 48) * 100 +
    (digits.charCodeAt(2) - 48) * 10 +
    (digits.charCodeAt(3) - 48);
  const m = (digits.charCodeAt(4) - 48) * 10 + (digits.charCodeAt(5) - 48);
  const d = (digits.charCodeAt(6) - 48) * 10 + (digits.charCodeAt(7) - 48);
  if (y < 1000 || y > 9999 || m < 1 || m > 12) return undefined;
  if (d < 1 || d > daysInMonth(y, m)) return undefined;
  return y * 10000 + m * 100 + d;
};

/**
 * Convert a day period int (or raw sidecar value) to Dayjs for UI edges only.
 * Never call `dayjs(periodNumber)` — dayjs treats numbers as unix ms (→ 1970).
 */
export const periodNumberToDayjs = (value: unknown): Dayjs | undefined => {
  const period = parsePeriodInt(value);
  if (period === undefined) return undefined;
  const y = (period / 10000) | 0;
  const m = ((period / 100) | 0) % 100;
  const d = period % 100;
  const mm = m < 10 ? `0${m}` : String(m);
  const dd = d < 10 ? `0${d}` : String(d);
  const day = toAppDayjs(`${y}-${mm}-${dd}`, dateDefault.DATE_FORMAT);
  return day.isValid() ? day : undefined;
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

/** Clamp inclusive period ints to metadata coverage (integer-only, no dayjs). */
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
 * Timeless tiles (``hasTime === false``) always use full metadata coverage.
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

  if (startPeriod > endPeriod) {
    return { start: s0, end: e0 };
  }

  const clamped = clampPeriodsToMetadata(startPeriod, endPeriod, bounds);
  if (clamped.empty) {
    const emptyEnd = s0.startOf("day").subtract(1, "day");
    return { start: s0.startOf("day"), end: emptyEnd };
  }

  const minD = periodNumberToDayjs(clamped.startPeriod);
  const maxD = periodNumberToDayjs(clamped.endPeriod);
  if (!minD || !maxD) return { start: s0, end: e0 };
  return { start: minD, end: maxD };
};

/** Parse sidecar `has_time`. Missing → true (legacy timed tiles). */
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
 * `time_group_by` is ignored — tiles always use the nested all-grain tree.
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

/** Build filter range from period ints (no dayjs). */
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
    return { startPeriod: 0, endPeriod: -1, empty: true };
  }
  return {
    startPeriod: clamped.startPeriod,
    endPeriod: clamped.endPeriod,
    empty: false,
  };
};

/**
 * Build a reusable filter range for density/popup sums.
 * Converts the UI Dayjs window to day {@link PeriodInt} once.
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
    return { startPeriod: 0, endPeriod: -1, empty: true };
  }

  return buildCountFilterRangeFromPeriods(
    dayjsToPeriodInt(rangeStart),
    dayjsToPeriodInt(rangeEnd),
    options
  );
};

/**
 * Coerce MVT property values to a finite number. Hot path prefers bare numbers
 * (typical after tippecanoe); strings are still accepted.
 */
export const coerceCountValue = (value: unknown): number => {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : NaN;
  }
  if (typeof value === "string" && value.length > 0) {
    const n = Number(value);
    if (Number.isFinite(n)) return n;
  }
  return NaN;
};

/**
 * Parse feature property {@link COUNTS_PROPERTY} (`c`) into a nested tree.
 * Caches by the raw JSON string so pan/idle re-sums avoid repeated JSON.parse.
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
  if (typeof raw !== "string" || raw.length === 0) return null;

  const cached = countsTreeCache.get(raw);
  if (cached) return cached;

  try {
    const parsed = JSON.parse(raw) as unknown;
    if (parsed == null || typeof parsed !== "object" || Array.isArray(parsed)) {
      return null;
    }
    const tree = parsed as CountsTree;
    if (countsTreeCache.size >= COUNTS_TREE_CACHE_MAX) {
      // Drop oldest insertion (Map preserves insertion order)
      const first = countsTreeCache.keys().next().value;
      if (first !== undefined) countsTreeCache.delete(first);
    }
    countsTreeCache.set(raw, tree);
    return tree;
  } catch {
    return null;
  }
};

/** Clear the counts-tree parse cache (tests / low-memory). */
export const clearCountsTreeCache = (): void => {
  countsTreeCache.clear();
};

/** Format a day period int for popup display: `YYYYMMDD` → `YYYY-MM-DD`. */
export const formatPeriodInt = (period: PeriodInt): string => {
  const p = Math.trunc(period);
  const y = (p / 10000) | 0;
  const m = ((p / 100) | 0) % 100;
  const d = p % 100;
  const mm = m < 10 ? `0${m}` : String(m);
  const dd = d < 10 ? `0${d}` : String(d);
  return `${y}-${mm}-${dd}`;
};

const readTotal = (node: CountsTree): number => {
  const t = node[TOTAL_KEY];
  if (typeof t === "number" && Number.isFinite(t) && t > 0) return t;
  if (typeof t === "string") {
    const n = Number(t);
    if (Number.isFinite(n) && n > 0) return n;
  }
  return 0;
};

/**
 * Density hot path: hierarchical sum with year/month `t` fast paths and early
 * exit at `maxTotal`. No period-bound tracking (popup uses
 * {@link sumCountsTreeInRange} instead).
 */
export const sumCountsTreeDensityTotal = (
  tree: CountsTree,
  start: number,
  end: number,
  maxTotal: number = DENSITY_TOTAL_CAP
): number => {
  if (start > end) return 0;

  let total = 0;
  const startYear = (start / 10000) | 0;
  const endYear = (end / 10000) | 0;

  for (const yearKey in tree) {
    // Skip non-own / prototype (tree is plain JSON object)
    if (!Object.prototype.hasOwnProperty.call(tree, yearKey)) continue;
    // Year keys are "2012"; skip accidental non-numeric keys
    const year = yearKey.length === 4 ? Number(yearKey) : NaN;
    if (!Number.isFinite(year) || year < startYear || year > endYear) continue;

    const yearNode = tree[yearKey];
    if (yearNode == null || typeof yearNode !== "object") continue;
    const yNode = yearNode as CountsTree;

    const yearStartDay = year * 10000 + 101;
    const yearEndDay = year * 10000 + 1231;
    if (yearStartDay >= start && yearEndDay <= end) {
      total += readTotal(yNode);
      if (total >= maxTotal) return maxTotal;
      continue;
    }

    for (const monthKey in yNode) {
      if (monthKey === TOTAL_KEY) continue;
      if (!Object.prototype.hasOwnProperty.call(yNode, monthKey)) continue;
      if (monthKey.length !== 2) continue;
      const month = Number(monthKey);
      if (!Number.isFinite(month) || month < 1 || month > 12) continue;

      const monthNode = yNode[monthKey];
      if (monthNode == null || typeof monthNode !== "object") continue;
      const mNode = monthNode as CountsTree;

      const dim = daysInMonth(year, month);
      const monthStartDay = year * 10000 + month * 100 + 1;
      const monthEndDay = year * 10000 + month * 100 + dim;

      if (monthEndDay < start || monthStartDay > end) continue;

      if (monthStartDay >= start && monthEndDay <= end) {
        total += readTotal(mNode);
        if (total >= maxTotal) return maxTotal;
        continue;
      }

      const days = mNode[DAYS_KEY];
      if (days == null || typeof days !== "object" || Array.isArray(days)) {
        continue;
      }
      const dayMap = days as CountsTree;
      for (const dayKey in dayMap) {
        if (!Object.prototype.hasOwnProperty.call(dayMap, dayKey)) continue;
        if (dayKey.length > 2) continue;
        const day = Number(dayKey);
        if (!Number.isFinite(day) || day < 1 || day > 31) continue;
        const period = year * 10000 + month * 100 + day;
        if (period < start || period > end) continue;
        const count = coerceCountValue(dayMap[dayKey]);
        if (!Number.isFinite(count) || count <= 0) continue;
        total += count;
        if (total >= maxTotal) return maxTotal;
      }
    }
  }

  return total;
};

/**
 * Hierarchical sum for an inclusive day filter range. When
 * `collectPeriodBounds` is true (popup), walks day leaves for accurate min/max
 * observation dates; otherwise uses year/month `t` fast paths like density.
 */
export const sumCountsTreeInRange = (
  tree: CountsTree,
  range: CountFilterRange,
  options?: { maxTotal?: number; collectPeriodBounds?: boolean }
): SumTreeResult => {
  if (range.empty) return { total: 0 };

  const start = range.startPeriod;
  const end = range.endPeriod;
  const maxTotal = options?.maxTotal;
  const collect = options?.collectPeriodBounds === true;

  // Density-style total without bounds tracking
  if (!collect) {
    const total = sumCountsTreeDensityTotal(
      tree,
      start,
      end,
      maxTotal ?? Number.POSITIVE_INFINITY
    );
    return { total };
  }

  // Popup path: walk days for min/max periods; still use unit totals only when
  // we would lose no bound accuracy (never — always walk days for bounds).
  let total = 0;
  let minPeriod: PeriodInt | undefined;
  let maxPeriod: PeriodInt | undefined;
  const startYear = (start / 10000) | 0;
  const endYear = (end / 10000) | 0;

  for (const yearKey in tree) {
    if (!Object.prototype.hasOwnProperty.call(tree, yearKey)) continue;
    const year = yearKey.length === 4 ? Number(yearKey) : NaN;
    if (!Number.isFinite(year) || year < startYear || year > endYear) continue;

    const yearNode = tree[yearKey];
    if (yearNode == null || typeof yearNode !== "object") continue;
    const yNode = yearNode as CountsTree;

    for (const monthKey in yNode) {
      if (monthKey === TOTAL_KEY) continue;
      if (!Object.prototype.hasOwnProperty.call(yNode, monthKey)) continue;
      if (monthKey.length !== 2) continue;
      const month = Number(monthKey);
      if (!Number.isFinite(month) || month < 1 || month > 12) continue;

      const monthNode = yNode[monthKey];
      if (monthNode == null || typeof monthNode !== "object") continue;
      const mNode = monthNode as CountsTree;

      const dim = daysInMonth(year, month);
      const monthStartDay = year * 10000 + month * 100 + 1;
      const monthEndDay = year * 10000 + month * 100 + dim;
      if (monthEndDay < start || monthStartDay > end) continue;

      const days = mNode[DAYS_KEY];
      if (days == null || typeof days !== "object" || Array.isArray(days)) {
        continue;
      }
      const dayMap = days as CountsTree;
      for (const dayKey in dayMap) {
        if (!Object.prototype.hasOwnProperty.call(dayMap, dayKey)) continue;
        const day = Number(dayKey);
        if (!Number.isFinite(day) || day < 1 || day > 31) continue;
        const period = year * 10000 + month * 100 + day;
        if (period < start || period > end) continue;
        const count = coerceCountValue(dayMap[dayKey]);
        if (!Number.isFinite(count) || count <= 0) continue;
        total += count;
        if (minPeriod === undefined || period < minPeriod) minPeriod = period;
        if (maxPeriod === undefined || period > maxPeriod) maxPeriod = period;
        if (maxTotal !== undefined && total >= maxTotal) {
          return { total: maxTotal, minPeriod, maxPeriod };
        }
      }
    }
  }

  return { total, minPeriod, maxPeriod };
};

/**
 * Sum nested counts tree (`c`) on a feature for the filter window.
 * Density should pass `range` + `maxTotal` and `collectMatchedKeys: false`.
 */
export const sumSparseCountFromProperties = (
  properties: Record<string, unknown> | null | undefined,
  filterStartDate?: Dayjs,
  filterEndDate?: Dayjs,
  options?: SumSparseCountOptions
): SumSparseCountResult => {
  if (!properties) return EMPTY_SUM_RESULT;

  const range =
    options?.range ?? buildCountFilterRange(filterStartDate, filterEndDate);
  if (range.empty) return EMPTY_SUM_RESULT;

  const tree = parseCountsTree(properties);
  if (!tree) return EMPTY_SUM_RESULT;

  const maxTotal = options?.maxTotal;
  const collectPeriodBounds =
    options?.collectMatchedKeys ?? maxTotal === undefined;

  // Density: single number, no allocations for matched keys
  if (!collectPeriodBounds) {
    const total = sumCountsTreeDensityTotal(
      tree,
      range.startPeriod,
      range.endPeriod,
      maxTotal ?? DENSITY_TOTAL_CAP
    );
    return { total, matchedKeys: [] };
  }

  const { total, minPeriod, maxPeriod } = sumCountsTreeInRange(tree, range, {
    maxTotal,
    collectPeriodBounds: true,
  });

  if (minPeriod === undefined || maxPeriod === undefined) {
    return { total, matchedKeys: [] };
  }

  return {
    total,
    matchedKeys: [formatPeriodInt(minPeriod), formatPeriodInt(maxPeriod)],
    minPeriod,
    maxPeriod,
  };
};
