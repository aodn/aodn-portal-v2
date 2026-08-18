export type TileType = "visual" | "data";

export interface TileProduct {
  // "<dataset>:<variable>", e.g. "model_sea_level_anomaly_gridded_realtime:gsla"
  id: string;
  variable?: string | string[];
  tile_types?: TileType[];
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

export interface GriddedRasterProduct {
  id: string;
  label: string;
  template: string;
  // Ascending, de-duplicated, non-empty.
  dates: string[];
}
