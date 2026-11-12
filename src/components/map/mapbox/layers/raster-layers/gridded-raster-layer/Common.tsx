import { SelectItem } from "@/components/common/dropdown/CommonSelect";
import {
  DatasetType,
  OGCCollection,
} from "@/app/store/OGCCollectionDefinitions";
import {
  TileManifest,
  GriddedRasterProduct,
  TilePointValueResponse,
  GriddedValueRange,
  TileProduct,
  TileProductsResponse,
} from "@/app/store/GriddedTileDefinitions";
import { InnerHtmlBuilder } from "@/utils/HtmlUtils";
import { utcDayKeyToUnixMs, utcIsoToDayKey } from "@/utils/DateUtils";
import { LayerSelectable } from "@/components/map/mapbox/layers/Layers";
import {
  DEFAULT_CATEGORICAL_COLORMAP,
  DEFAULT_GRIDDED_COLORMAP,
  GRIDDED_RENDER_STYLE_BY_PRODUCT,
  GriddedRenderStyle,
} from "./TilerColormaps";

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

export const getGriddedRenderStyle = (
  productId: string,
  categorical: boolean = false,
  styles: Record<string, GriddedRenderStyle> = GRIDDED_RENDER_STYLE_BY_PRODUCT
): { colormap: string; rescale?: GriddedValueRange } => {
  const style = styles[productId];
  return {
    colormap:
      style?.colormap ||
      (categorical ? DEFAULT_CATEGORICAL_COLORMAP : DEFAULT_GRIDDED_COLORMAP),
    // DAS rejects rescale for a categorical product.
    rescale: categorical ? undefined : style?.rescale,
  };
};

const formatRescale = ([min, max]: GriddedValueRange) => `${min},${max}`;

/**
 * Appends raw query params. Plain string concatenation for the same reason as
 * buildGriddedTileUrl: the template's `{placeholders}` and `%2B` must survive.
 */
const appendQueryParams = (
  url: string,
  params: Record<string, string | undefined>
): string => {
  const query = Object.entries(params)
    .filter((entry): entry is [string, string] => entry[1] !== undefined)
    .map(([key, value]) => `${key}=${value}`)
    .join("&");
  if (!query) return url;
  return `${url}${url.includes("?") ? "&" : "?"}${query}`;
};

/** Applies the product's colormap (and fixed range, if any) to its tile template. */
export const applyRenderStyleToTemplate = (
  template: string,
  colormap: string,
  rescale?: GriddedValueRange
): string =>
  appendQueryParams(template, {
    colormap: encodeURIComponent(colormap),
    rescale: rescale ? formatRescale(rescale) : undefined,
  });

/**
 * Fills `{colormap}` in a product's legend_url. The tiler only ever returns
 * the bare colour bar; GriddedRasterLegend draws the range labels itself.
 */
export const buildGriddedLegendUrl = (
  legendTemplate?: string,
  colormap: string = DEFAULT_GRIDDED_COLORMAP
): string | undefined =>
  legendTemplate
    ? legendTemplate.split("{colormap}").join(encodeURIComponent(colormap))
    : undefined;

/**
 * Fills `{datetime}`, `{lat}` and `{lon}` in a product's point template,
 * verbatim, so the `%2B` in a multi-variable product reaches the wire as-is.
 */
export const buildGriddedPointUrl = (
  pointTemplate: string | undefined,
  datetime: string | undefined,
  lat: number,
  lon: number
): string | undefined =>
  pointTemplate && datetime
    ? pointTemplate
        .split("{datetime}")
        .join(datetime)
        .split("{lat}")
        .join(String(lat))
        .split("{lon}")
        .join(String(lon))
    : undefined;

/** Fills `{datetime}` in a product's manifest template, verbatim. */
export const buildGriddedManifestUrl = (
  manifestTemplate?: string,
  datetime?: string
): string | undefined =>
  manifestTemplate && datetime
    ? manifestTemplate.split("{datetime}").join(datetime)
    : undefined;

/**
 * The range DAS coloured the date's tiles with when no rescale was sent.
 * Undefined for categorical products (the legend rejects a range) and for
 * empty/malformed ranges.
 */
export const toLegendRange = (
  manifest?: TileManifest | null
): GriddedValueRange | undefined => {
  if (!manifest) return undefined;
  if (Array.isArray(manifest.flagValues) && manifest.flagValues.length > 0) {
    return undefined;
  }
  const range = manifest.valueRange;
  if (!Array.isArray(range) || range.length !== 2) return undefined;
  const [min, max] = range;
  if (typeof min !== "number" || typeof max !== "number") return undefined;
  if (!Number.isFinite(min) || !Number.isFinite(max)) return undefined;
  return [min, max];
};

/** Flag values in an inline categorical colormap; undefined for a name. */
const inlineColormapValues = (colormap?: string): unknown[] | undefined => {
  try {
    const values = JSON.parse(colormap ?? "")?.values;
    return Array.isArray(values) ? values : undefined;
  } catch {
    return undefined;
  }
};

/**
 * One label per block of a categorical legend bar, in flag-value order: the
 * flag meanings, or the values themselves when the dataset has no meanings.
 * Undefined for continuous products, and when an inline colormap draws a
 * different number of blocks than there are flags (labels would misalign).
 */
export const toCategoricalLabels = (
  manifest?: TileManifest | null,
  colormap?: string
): string[] | undefined => {
  const values = manifest?.flagValues;
  if (!Array.isArray(values) || values.length === 0) return undefined;
  const blocks = inlineColormapValues(colormap);
  if (blocks && blocks.length !== values.length) return undefined;
  const meanings = manifest?.flagMeanings;
  return Array.isArray(meanings) && meanings.length === values.length
    ? meanings
    : values.map(String);
};

/** The variable's units for the legend title; undefined when blank or absent. */
export const toLegendUnit = (
  manifest?: TileManifest | null
): string | undefined => {
  const unit = manifest?.valueUnit;
  return typeof unit === "string" && unit.trim() !== ""
    ? unit.trim()
    : undefined;
};

const nonEmptyString = (value?: string): string | undefined =>
  typeof value === "string" && value !== "" ? value : undefined;

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

export const toGriddedRasterProducts = (
  response?: TileProductsResponse,
  styles: Record<string, GriddedRenderStyle> = GRIDDED_RENDER_STYLE_BY_PRODUCT
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

    const categorical = product.categorical === true;
    const { colormap, rescale } = getGriddedRenderStyle(
      product.id,
      categorical,
      styles
    );

    result.push({
      id: product.id,
      label: formatProductLabel(product),
      variable: Array.isArray(product.variable)
        ? product.variable.join(" + ")
        : nonEmptyString(product.variable),
      tileTemplate: applyRenderStyleToTemplate(template, colormap, rescale),
      dates: marks.dates,
      colormap,
      categorical,
      rescale,
      legendTemplate: nonEmptyString(product.legend_url),
      manifestTemplate: nonEmptyString(product.visual_manifest_url_template),
      pointTemplate: nonEmptyString(product.point_url_template),
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
