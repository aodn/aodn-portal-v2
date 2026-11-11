export type TileType = "visual" | "data";

export interface TileProduct {
  // "<dataset>:<variable>", e.g. "model_sea_level_anomaly_gridded_realtime:gsla"
  id: string;
  variable?: string | string[];
  tile_types?: TileType[];
  // true = discrete flag values, false = continuous, null = DAS can't tell yet.
  categorical?: boolean | null;
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

// Per-date data-tile manifest; only the fields the portal reads.
export interface TileManifest {
  // Scalar products only: [min, max] of the date's data, entries null when empty.
  valueRange?: (number | null)[] | null;
  // Categorical products only.
  flagValues?: number[] | null;
  // Categorical products only, one per flag value when the dataset has them.
  flagMeanings?: string[] | null;
}

export type GriddedValueRange = [number, number];

export interface GriddedRasterProduct {
  id: string;
  label: string;
  // Variable name(s) as listed, e.g. "GSLA"; shown beside the legend.
  variable?: string;
  // Visual tile template with this product's colormap (and rescale) applied.
  template: string;
  // Full UTC datetimes, e.g. "2024-01-01T00:00:00Z", ascending, de-duplicated by calendar day, non-empty.
  dates: string[];
  // Colormap used for both the tiles and the legend.
  colormap: string;
  // Discrete flag values: never sent a rescale, legend has no range labels.
  categorical: boolean;
  // Fixed colour range; absent means the server scales each date to its own min/max.
  rescale?: GriddedValueRange;
  legendTemplate?: string;
  manifestTemplate?: string;
}
