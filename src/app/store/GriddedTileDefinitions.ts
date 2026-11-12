export type TileType = "visual" | "data";

export interface TileProduct {
  // "<dataset>:<variable>", e.g. "model_sea_level_anomaly_gridded_realtime:gsla"
  id: string;
  variable?: string | string[];
  tile_types?: TileType[];
  // Full UTC datetimes, e.g. "2024-01-01T00:00:00Z"
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
  // Full UTC datetimes, e.g. "2024-01-01T00:00:00Z", ascending, de-duplicated by calendar day, non-empty.
  dates: string[];
  // Raw "dataset=...&variable=..." taken verbatim from the visual template
  // (keeps %2B intact) for the point-value query. Absent if the template has neither.
  pointQuery?: string;
}

export interface TilePointValueRequest {
  uuid: string;
  pointQuery: string;
  datetime: string;
  lat: number;
  lon: number;
}

export interface TilePointVariableValue {
  // null where the grid cell has no data (e.g. land)
  value: number | null;
  units?: string;
}

export interface TilePointValueResponse {
  // Snapped to the nearest grid cell, not the clicked point.
  lat?: number;
  lon?: number;
  variables?: Record<string, TilePointVariableValue>;
}
