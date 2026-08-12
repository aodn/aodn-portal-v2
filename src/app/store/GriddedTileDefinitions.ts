/**
 * Wire types for the ogcapi-java gridded tile product listing:
 * `GET /api/v1/ogc/ext/tiles/collections/{uuid}/products`.
 *
 * Every field is optional on purpose — the listing is passthrough-heavy over
 * DAS's own catalogue, so it can grow or drift without the portal breaking.
 */
export type TileType = "visual" | "data";

export interface TileProduct {
  // "<dataset>:<variable>", e.g. "model_sea_level_anomaly_gridded_realtime:gsla"
  id: string;
  variable?: string | string[];
  tile_types?: TileType[];
  // Australia/Sydney local-day keys, NOT UTC instants.
  available_dates?: string[];
  full_date_range?: { start?: string; end?: string };
  // Present only when tile_types includes "visual".
  visual_tile_url_template?: string;
  legend_url?: string;
  data_tile_url_template?: string;
  data_manifest_url_template?: string;
}

export interface TileProductsResponse {
  products?: TileProduct[];
}

/**
 * Post-filter shape the UI consumes — no optionals left. Anything that reaches
 * this type is guaranteed renderable: a usable tile template and at least one
 * valid day.
 */
export interface GriddedRasterProduct {
  id: string;
  label: string;
  template: string;
  // Ascending, de-duplicated, non-empty.
  dates: string[];
}
