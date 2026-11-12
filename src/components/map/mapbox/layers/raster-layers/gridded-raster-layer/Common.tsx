import { SelectItem } from "@/components/common/dropdown/CommonSelect";
import {
  DatasetType,
  OGCCollection,
} from "@/app/store/OGCCollectionDefinitions";
import {
  GriddedRasterProduct,
  TilePointValueResponse,
  TileProduct,
  TileProductsResponse,
} from "@/app/store/GriddedTileDefinitions";
import { InnerHtmlBuilder } from "@/utils/HtmlUtils";
import { utcDayKeyToUnixMs, utcIsoToDayKey } from "@/utils/DateUtils";
import { LayerSelectable } from "@/components/map/mapbox/layers/Layers";

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

export interface GriddedRasterLayerControls extends LayerSelectable<string> {
  products: GriddedRasterProduct[];

  layerConfig: string;
  onLayerChange: (id: string) => void;
  /** Full UTC datetime, round-tripped verbatim from the listing — never derived from a Date. */
  selectedDate?: string;
  /** Collection the point-value query is scoped to. */
  uuid?: string;
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
    // Extract the day key from the full UTC datetime, then convert that to a Unix timestamp in ms for the slider value, the utc full time string kept.
    const dayKey = utcIsoToDayKey(date);
    if (dayKey === undefined) return;
    const value = utcDayKeyToUnixMs(dayKey);
    // De-duplicates by day: the first datetime seen for that day wins.
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

const POINT_QUERY_KEYS = ["dataset", "variable"];

/**
 * Picks `dataset=...&variable=...` out of a tile template's query string,
 * verbatim. Plain string splitting (not URLSearchParams) for the same reason
 * as buildGriddedTileUrl: `ucur%2Bvcur` must reach the wire unchanged.
 */
export const extractPointQuery = (template?: string): string | undefined => {
  const query = template?.split("?")[1];
  if (!query) return undefined;
  const picked = query
    .split("&")
    .filter((pair) => POINT_QUERY_KEYS.includes(pair.split("=")[0]));
  return picked.length > 0 ? picked.join("&") : undefined;
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

    // available_dates are full UTC datetimes ("2024-01-01T00:00:00Z"). Kept
    // verbatim: the tile request must echo the same string back, so only
    // buildTileDateMarks derives a day from each one, for sorting/dedup and
    // the slider.
    const marks = buildTileDateMarks(product.available_dates);
    if (marks.dates.length === 0) return;

    const pointQuery = extractPointQuery(template);
    result.push({
      id: product.id,
      label: formatProductLabel(product),
      template,
      dates: marks.dates,
      ...(pointQuery ? { pointQuery } : {}),
    });
  });
  return result;
};

export const toSelectItems = (
  products: GriddedRasterProduct[]
): SelectItem<string>[] =>
  products.map((product) => ({ value: product.id, label: product.label }));

/**
 * Substitutes the datetime into a tile template and translates the backend's
 * OGC placeholder names into the ones Mapbox recognises — pure string
 * replacement, nothing else.
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
  datetime?: string
): string | undefined => {
  if (!template) return undefined;
  if (!datetime) return undefined;
  return template
    .split("{datetime}")
    .join(datetime)
    .split("{tileRow}")
    .join("{y}")
    .split("{tileCol}")
    .join("{x}");
};

const COORDINATE_DECIMALS = 4;
const VALUE_SIGNIFICANT_DIGITS = 4;

/** Mapbox reports unwrapped longitudes past ±180 on world copies; the backend rejects them. */
export const wrapLongitude = (lon: number): number =>
  ((((lon + 180) % 360) + 360) % 360) - 180;

export const formatPointValue = (value: number | null | undefined): string =>
  typeof value === "number" && Number.isFinite(value)
    ? String(Number(value.toPrecision(VALUE_SIGNIFICANT_DIGITS)))
    : "No data";

const formatCoordinate = (value: number): string =>
  value.toFixed(COORDINATE_DECIMALS);

/**
 * Popup body for a point-value lookup. Coordinates are the grid cell the
 * backend snapped to, falling back to the clicked point.
 */
export const buildPointValuePopupHtml = (
  response: TilePointValueResponse | undefined,
  clicked: { lat: number; lon: number }
): string => {
  const lat = response?.lat ?? clicked.lat;
  const lon = response?.lon ?? clicked.lon;
  const builder = new InnerHtmlBuilder()
    .addTitle("Gridded Data Value")
    .addText(`Lat: ${formatCoordinate(lat)}`)
    .addText(`Lon: ${formatCoordinate(lon)}`);

  const variables = Object.entries(response?.variables ?? {});
  if (variables.length === 0) return builder.addText("No data").getHtml();

  variables.forEach(([name, entry]) => {
    const value = formatPointValue(entry?.value);
    const units = entry?.units && value !== "No data" ? ` ${entry.units}` : "";
    builder.addText(`${name}: ${value}${units}`);
  });
  return builder.getHtml();
};

export const buildPointValueMessageHtml = (message: string): string =>
  new InnerHtmlBuilder()
    .addTitle("Gridded Data Value")
    .addText(message)
    .getHtml();
