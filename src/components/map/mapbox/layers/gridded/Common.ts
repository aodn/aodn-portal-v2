import { SelectItem } from "@/components/common/dropdown/CommonSelect";
import {
  DatasetType,
  OGCCollection,
} from "@/app/store/OGCCollectionDefinitions";
import {
  GriddedRasterProduct,
  TileProduct,
  TileProductsResponse,
} from "@/app/store/GriddedTileDefinitions";

/**
 * React-free helpers for the gridded raster tile layer, so they unit-test
 * without jsdom or a mapbox mock.
 *
 * This module is where two vocabularies meet. The backend's `"visual"` is a
 * *capability* flag — "can DAS turn this product into a picture at all", as
 * opposed to a data tile carrying numbers for a shader. The portal-side name for
 * what we draw is `GriddedRaster`. So `"visual"` appears here only where it is
 * literally the wire contract (`tile_types`, `visual_tile_url_template`), and
 * never in an identifier we own.
 */

/** A `YYYY-MM-DD` DAS local-day key. */
const DAY_KEY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

/** The placeholders a template must still carry for Mapbox to be able to use it. */
const REQUIRED_TEMPLATE_TOKENS = ["{datetime}", "{z}", "{x}", "{y}"];

export interface TileDateMarks {
  /** Ascending epoch-ms values; feeds `DateSliderPoint.valid_points`. */
  values: number[];
  /** value -> ORIGINAL day key. The only supported reverse path. */
  byValue: Map<number, string>;
  /** Ascending original day-key strings. */
  dates: string[];
  /** The newest day, i.e. `dates.at(-1)`. */
  latest?: string;
}

export const EMPTY_TILE_DATE_MARKS: TileDateMarks = {
  values: [],
  byValue: new Map<number, string>(),
  dates: [],
  latest: undefined,
};

/**
 * Gridded raster tiles exist only for zarr datasets, so skip discovery entirely
 * for everything else rather than asking the backend about every collection.
 */
export const shouldQueryGriddedTiles = (
  collection?: OGCCollection | null
): boolean => collection?.getDatasetType()?.includes(DatasetType.ZARR) === true;

/**
 * `"2024-01-02"` -> `Date.UTC(2024, 0, 2)`.
 *
 * Rejects impossible dates, not just badly-shaped ones: after the regex the
 * value is round-tripped through `Date.UTC` and the y/m/d must come back
 * unchanged, so `2024-02-31` is dropped rather than silently becoming 2 March.
 */
export const dayKeyToUtcValue = (key: string): number | undefined => {
  if (!DAY_KEY_PATTERN.test(key)) return undefined;

  const year = Number(key.slice(0, 4));
  const month = Number(key.slice(5, 7));
  const day = Number(key.slice(8, 10));

  const value = Date.UTC(year, month - 1, day);
  const back = new Date(value);
  if (
    back.getUTCFullYear() !== year ||
    back.getUTCMonth() !== month - 1 ||
    back.getUTCDate() !== day
  ) {
    return undefined;
  }
  return value;
};

/**
 * Builds the whole date round-trip for one product.
 *
 * The values are UTC midnight so `DateSliderPoint`'s own label renders the
 * correct calendar day in every timezone, but they are only ever slider keys:
 * the day sent to the backend is always recovered through `byValue`. NEVER
 * format a value back into a date — `available_dates` are Australia/Sydney local
 * days, and formatting UTC midnight in a UTC-08:00 browser gives the day before.
 */
export const buildTileDateMarks = (dates?: string[]): TileDateMarks => {
  if (!Array.isArray(dates) || dates.length === 0) {
    return EMPTY_TILE_DATE_MARKS;
  }

  const byValue = new Map<number, string>();
  dates.forEach((date) => {
    if (typeof date !== "string") return;
    const value = dayKeyToUtcValue(date);
    // De-duplicates: the same day key maps to the same value.
    if (value !== undefined && !byValue.has(value)) byValue.set(value, date);
  });

  // Sorted here so response order is never trusted for "latest".
  const values = Array.from(byValue.keys()).sort((a, b) => a - b);
  const sorted = new Map<number, string>();
  values.forEach((value) => sorted.set(value, byValue.get(value) as string));
  const sortedDates = values.map((value) => byValue.get(value) as string);

  return {
    values,
    byValue: sorted,
    dates: sortedDates,
    latest: sortedDates[sortedDates.length - 1],
  };
};

/** `"a_b:GSLA"` + `["UCUR","VCUR"]` -> `"a b — UCUR + VCUR"`. */
export const formatProductLabel = (product: TileProduct): string => {
  const id = product.id ?? "";
  const separator = id.indexOf(":");
  const dataset = (separator >= 0 ? id.slice(0, separator) : id).replace(
    /_/g,
    " "
  );
  const variables = Array.isArray(product.variable)
    ? product.variable.join(" + ")
    : (product.variable ?? "");

  if (!variables) return dataset;
  return `${dataset} — ${variables}`;
};

/**
 * Narrows the wire listing to the products the map can actually render.
 *
 * Server order is preserved so the backend keeps control of which product is
 * offered first. A single malformed entry is skipped rather than taking out its
 * valid siblings; only a payload that is not an array under `products` is a
 * discovery error.
 */
export const toGriddedRasterProducts = (
  response?: TileProductsResponse
): GriddedRasterProduct[] => {
  const products = response?.products;
  if (products === undefined) return [];
  if (!Array.isArray(products)) {
    throw new Error("Gridded tile products payload is not an array");
  }

  const result: GriddedRasterProduct[] = [];
  products.forEach((product) => {
    if (!product || typeof product.id !== "string" || product.id === "") return;

    // Capability is what the backend advertises — never inferred from variable
    // arity, since a single-variable product can legitimately be data-only.
    if (!product.tile_types?.includes("visual")) return;

    const template = product.visual_tile_url_template;
    if (typeof template !== "string" || template === "") return;

    // Cheap boundary check: a template that lost its placeholders turns a
    // backend contract drift into "product absent" rather than a raster source
    // that 404s on every tile.
    if (!REQUIRED_TEMPLATE_TOKENS.every((token) => template.includes(token))) {
      return;
    }

    const marks = buildTileDateMarks(product.available_dates);
    if (marks.dates.length === 0) return;

    result.push({
      id: product.id,
      label: formatProductLabel(product),
      template,
      dates: marks.dates,
    });
  });
  return result;
};

export const toSelectItems = (
  products: GriddedRasterProduct[]
): SelectItem<string>[] =>
  products.map((product) => ({ value: product.id, label: product.label }));

/**
 * Substitutes the day into a tile template — pure string replacement, nothing
 * else.
 *
 * Deliberately NOT `new URL()`, `URLSearchParams` or `formatToUrl`: any of them
 * would turn `variable=ucur%2Bvcur` into `ucur+vcur` (which decodes to a space
 * and 400s) or `ucur%252Bvcur`, and would encode the braces of `{z}/{x}/{y}`
 * that Mapbox needs raw.
 */
export const buildGriddedTileUrl = (
  template?: string,
  dayKey?: string
): string | undefined => {
  if (!template) return undefined;
  // A missing or malformed date must never yield a URL still carrying a literal
  // "{datetime}".
  if (!dayKey || !DAY_KEY_PATTERN.test(dayKey)) return undefined;
  return template.split("{datetime}").join(dayKey);
};
