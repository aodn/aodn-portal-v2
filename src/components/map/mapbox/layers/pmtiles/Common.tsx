/** One Mapbox fill band over a PMTiles `hex_z*` source-layer. */
export type PmtilesHexLayerDef = {
  id: string;
  sourceLayer: string;
  minzoom: number;
  maxzoom: number;
};

/**
 * Inclusive calendar period as an integer: `YYYYMMDD` (date buckets) or
 * `YYYYMM` (month buckets). Prefer this over Dayjs for all PMTiles internals.
 *
 * Never treat these as unix timestamps — `dayjs(20100815)` is ~1970.
 */
export type PeriodInt = number;
/** Matches sidecar `{dname}.metadata` `time_group_by` from batch PMTiles gen. */
export enum TimeGroupBy {
  Date = "date",
  Month = "month",
}
/**
 * Period coverage from `{dname}.metadata` as integers (same shape as sidecar
 * `min_date` / `max_date` after validation).
 */
export interface PMTilesMetadataRange {
  minPeriod: PeriodInt;
  maxPeriod: PeriodInt;
}

/** Default when `.metadata` is missing or invalid. */
export const DEFAULT_TIME_GROUP_BY = TimeGroupBy.Date;
/**
 * Build a key allow-set when the filter window has at most this many buckets.
 * Wider day ranges use integer period compares only (building 10k+ keys is wasteful).
 */
export const COUNT_KEY_SET_MAX = 2000;
/** Features to sum + setFeatureState per idle slice (keeps the main thread responsive). */
export const FEATURE_STATE_CHUNK_SIZE = 400;
/**
 * Top density total used by paint interpolate and by the feature-state early-stop.
 * Totals at or above this value all paint the same; full accuracy is only needed
 * for the hover popup (which does not use this cap).
 *
 * Color/opacity breakpoints are ratios of this value — change only the cap and
 * the whole scale rescales (see `DENSITY_COLOR_STOPS` / `DENSITY_OPACITY_STOPS`).
 */
export const DENSITY_TOTAL_CAP = 10000;
/** Parse sidecar metadata; only `"date"` and `"month"` are accepted. */
const parseTimeGroupBy = (value: unknown): TimeGroupBy =>
  value === TimeGroupBy.Month
    ? TimeGroupBy.Month
    : value === TimeGroupBy.Date
      ? TimeGroupBy.Date
      : DEFAULT_TIME_GROUP_BY;

/** Digits from a sidecar period number or numeric string (no dayjs). */
const coercePeriodDigits = (value: unknown): string | undefined => {
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
const densityStopValue = (
  ratio: number,
  cap: number = DENSITY_TOTAL_CAP
): number => (ratio === 0 ? 0 : Math.max(1, Math.round(ratio * cap)));

export { coercePeriodDigits, parseTimeGroupBy, densityStopValue };
