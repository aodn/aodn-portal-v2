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
import { dayKeyToUtcValue } from "@/utils/DateUtils";

/**
 * The placeholders a template must still carry. `{tileRow}`/`{tileCol}` are the
 * backend's OGC path-variable names (tileRow=y, tileCol=x) — not Mapbox's own
 * `{x}`/`{y}` — because Mapbox only ever fills those in per-tile as the map
 * pans/zooms, so `buildGriddedTileUrl` must translate the names first.
 */
const REQUIRED_TEMPLATE_TOKENS = [
  "{datetime}",
  "{z}",
  "{tileRow}",
  "{tileCol}",
];

export interface TileDateMarks {
  values: number[];
  byValue: Map<number, string>;
  dates: string[];
  latest?: string;
}

export const EMPTY_TILE_DATE_MARKS: TileDateMarks = {
  values: [],
  byValue: new Map<number, string>(),
  dates: [],
  latest: undefined,
};

export interface GriddedRasterLayerControls {
  products: GriddedRasterProduct[];

  selectedProductId: string;
  onSelectProduct: (id: string) => void;
  /** `YYYY-MM-DD`, round-tripped from the listing — never derived from a Date. */
  selectedDate?: string;
  /** A refetch failed while this layer was selected. */
  error?: boolean;
  onRetry?: () => void;
}

export const shouldQueryGriddedTiles = (
  collection?: OGCCollection | null
): boolean => collection?.getDatasetType()?.includes(DatasetType.ZARR) === true;

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
 * Substitutes the day into a tile template and translates the backend's OGC
 * placeholder names into the ones Mapbox recognises — pure string replacement,
 * nothing else.
 *
 * Deliberately NOT `new URL()`, `URLSearchParams` or `formatToUrl`: any of them
 * would turn `variable=ucur%2Bvcur` into `ucur+vcur` (which decodes to a space
 * and 400s) or `ucur%252Bvcur`, and would encode braces that must stay raw.
 *
 * `{tileRow}`/`{tileCol}` (not `{x}`/`{y}`) is deliberate on the backend: it
 * stops the row/col order from being "corrected" back into slippy shape by
 * someone who doesn't know the swap is intentional (tileRow=y, tileCol=x).
 * Mapbox's raster source only ever recognises the literal `{z}`/`{x}`/`{y}`
 * tokens — it fills them in per-tile as the map pans/zooms — so this renames
 * the placeholders (not their eventual values) before handing the URL to
 * Mapbox.
 */
export const buildGriddedTileUrl = (
  template?: string,
  dayKey?: string
): string | undefined => {
  if (!template) return undefined;
  if (!dayKey) return undefined;
  return template
    .split("{datetime}")
    .join(dayKey)
    .split("{tileRow}")
    .join("{y}")
    .split("{tileCol}")
    .join("{x}");
};
