import { ExpressionSpecification } from "mapbox-gl";

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

/** Feature property holding the nested counts tree (JSON string in MVT). */
export const COUNTS_PROPERTY = "c";
/** Year/month total key inside the nested tree (not a calendar key). */
export const TOTAL_KEY = "t";
/** Day map key under each month node. */
export const DAYS_KEY = "d";

/** Features to sum + setFeatureState per idle slice (keeps the main thread responsive). */
export const FEATURE_STATE_CHUNK_SIZE = 600;
/**
 * Top density total used by paint interpolate and by the feature-state early-stop.
 * Totals at or above this value all paint the same; full accuracy is only needed
 * for the hover popup (which does not use this cap).
 *
 * Color/opacity breakpoints are ratios of this value — change only the cap and
 * the whole scale rescales (see `DENSITY_COLOR_STOPS` / `DENSITY_OPACITY_STOPS`).
 */
export const DENSITY_TOTAL_CAP = 10000;

export type HexFillPaint = {
  "fill-color": ExpressionSpecification | string;
  "fill-opacity": ExpressionSpecification | number;
  "fill-outline-color": ExpressionSpecification | string;
};

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

export { coercePeriodDigits, densityStopValue };
