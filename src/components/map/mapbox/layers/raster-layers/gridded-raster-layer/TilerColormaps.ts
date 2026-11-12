import { GriddedValueRange } from "@/app/store/GriddedTileDefinitions";

/**
 * Every colour the gridded tiles are drawn with. Both the tile request and
 * the legend request read from here, so they always match.
 */
export const DEFAULT_GRIDDED_COLORMAP = "viridis";
export const DEFAULT_CATEGORICAL_COLORMAP = "default_categorical";

/**
 * An inline continuous colormap, in the DAS colormaps.json entry format:
 * 2-256 colour stops, interpolated evenly from min to max. Continuous
 * products only.
 */
export interface RampColormap {
  mode: "ramp";
  colors: string[];
}

/**
 * An inline categorical colormap, in the DAS colormaps.json entry format.
 * `values` must equal the variable's CF flag_values (same values, same
 * count), and `colors` must have one colour per value, in the same order.
 * Categorical products only.
 */
export interface CategoricalColormap {
  mode: "categorical";
  values: number[];
  colors: string[];
}

export type InlineColormap = RampColormap | CategoricalColormap;

/** Serialises an inline colormap for the `colormap` query parameter. */
const inlineColormap = (colormap: InlineColormap): string =>
  JSON.stringify(colormap);

export interface GriddedRenderStyle {
  // Colormap name, as listed by GET /api/v1/ogc/ext/tiles/colormaps, or an
  // inline colormap built with inlineColormap().
  colormap?: string;
  // Fixed colour range [min, max]. Omit to let the server scale each date to
  // its own data range. Never set it for a categorical product (rejected).
  rescale?: GriddedValueRange;
}

// Heatwave/cold-spell category flags: 0 none, 1 moderate, 2 strong,
// 3 severe, 4 extreme.
const HEATWAVE_CATEGORY_COLORMAP = inlineColormap({
  mode: "categorical",
  values: [0, 1, 2, 3, 4],
  colors: ["#8c0000", "#ff9701", "#67ff96", "#007bff", "#00078f"],
});

/**
 * Single source of truth for how each product is coloured: both the tile
 * request and the legend request read from here. Keyed by product id
 * ("<dataset>:<variable>"). Unlisted products use DEFAULT_GRIDDED_COLORMAP
 * (continuous) or DEFAULT_CATEGORICAL_COLORMAP (categorical) and the
 * server's per-date range. Never give a categorical product a continuous
 * colormap — every tile would 400.
 */
export const GRIDDED_RENDER_STYLE_BY_PRODUCT: Record<
  string,
  GriddedRenderStyle
> = {
  // Categorical products (variables with CF flag_values), as of 2026-11-11.
  "satellite_austemp_heatwave_14day:mcs_category": {
    colormap: HEATWAVE_CATEGORY_COLORMAP,
  },
  "satellite_austemp_heatwave_14day:mcs_category_mosaic": {
    colormap: HEATWAVE_CATEGORY_COLORMAP,
  },
  "satellite_austemp_heatwave_14day:mhw_category_mosaic": {
    colormap: HEATWAVE_CATEGORY_COLORMAP,
  },
  "satellite_austemp_heatwave_14day:ssta_mosaic": {
    colormap: inlineColormap({
      mode: "ramp",
      colors: [
        "#052F61", // dark blue
        "#184FA2",
        "#387ABD",
        "#65A5D1",
        "#9EC9E1",
        "#D1E5F0",
        "#F7F7F7", // near white (centre)
        "#FDDBC7",
        "#F4B18B",
        "#E37D56",
        "#C64639",
        "#9E1A1E",
        "#67001F", // dark red
      ],
    }),
    rescale: [-4, 4],
  },
  "satellite_austemp_heatwave_14day:sst_mosaic": {
    colormap: inlineColormap({
      mode: "ramp",
      colors: [
        "#6E0096", // violet (coldest)
        "#5000C8",
        "#0000FF", // blue
        "#0064FF",
        "#00B4FF",
        "#00FFFF", // cyan
        "#00FFB4",
        "#00FF50",
        "#50FF00", // green
        "#B4FF00",
        "#FFFF00", // yellow
        "#FFC800",
        "#FF8C00", // orange
        "#FF4600",
        "#FF0000", // red
        "#B40000",
        "#780000", // dark red/maroon (warmest)
      ],
    }),
    rescale: [0, 40],
  },
  "model_sea_level_anomaly_gridded_realtime:gsla": {
    colormap: inlineColormap({
      mode: "ramp",
      colors: [
        "#00008F",
        "#00009F",
        "#0000AF",
        "#0000BF",
        "#0000CF",
        "#0000DF",
        "#0000EF",
        "#0000FF",
        "#000BFF",
        "#001BFF",
        "#002BFF",
        "#003BFF",
        "#004BFF",
        "#005BFF",
        "#006BFF",
        "#007BFF",
        "#008BFF",
        "#009BFF",
        "#00ABFF",
        "#00BBFF",
        "#00CBFF",
        "#00DBFF",
        "#00EBFF",
        "#00FBFF",
        "#07FFF7",
        "#17FFE7",
        "#27FFD7",
        "#37FFC7",
        "#47FFB7",
        "#57FFA7",
        "#67FF97",
        "#77FF87",
        "#87FF77",
        "#97FF67",
        "#A7FF57",
        "#B7FF47",
        "#C7FF37",
        "#D7FF27",
        "#E7FF17",
        "#F7FF07",
        "#FFFB00",
        "#FFE700",
        "#FFD700",
        "#FFC700",
        "#FFB700",
        "#FFA700",
        "#FF9700",
        "#FF8700",
        "#FF7700",
        "#FF6700",
        "#FF5700",
        "#FF4700",
        "#FF3700",
        "#FF2700",
        "#FF1700",
        "#FF0700",
        "#F60000",
        "#E40000",
        "#D30000",
        "#C10000",
        "#AF0000",
        "#9E0000",
        "#8C0000",
      ],
    }),
    rescale: [-1.2, 1.2],
  },
};
