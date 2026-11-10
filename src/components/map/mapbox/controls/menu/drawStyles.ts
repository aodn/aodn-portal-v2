import {
  DRAW_SELECTION_SYMBOLOGY,
  EXTENT_OUTLINE_SYMBOLOGY,
} from "../../constants";

// MapboxDraw styles for the bbox and polygon tools, replacing the library
// default blue and orange that fail WCAG contrast on light base maps
const {
  COLOR,
  WIDTH,
  SELECTED_WIDTH,
  FILL_COLOR,
  FILL_OPACITY,
  SELECTED_FILL_OPACITY,
} = DRAW_SELECTION_SYMBOLOGY;
const { CASING_COLOR, CASING_WIDTH } = EXTENT_OUTLINE_SYMBOLOGY;

const isSelected = ["==", ["get", "active"], "true"];
const isLineOrPolygon = [
  "any",
  ["==", "$type", "LineString"],
  ["==", "$type", "Polygon"],
];

const drawStyles = [
  {
    id: "gl-draw-polygon-fill",
    type: "fill",
    filter: ["==", "$type", "Polygon"],
    paint: {
      "fill-color": FILL_COLOR,
      "fill-opacity": ["case", isSelected, SELECTED_FILL_OPACITY, FILL_OPACITY],
    },
  },
  {
    id: "gl-draw-line-casing",
    type: "line",
    filter: isLineOrPolygon,
    layout: { "line-cap": "round", "line-join": "round" },
    paint: {
      "line-color": CASING_COLOR,
      "line-width": ["case", isSelected, CASING_WIDTH + 2, CASING_WIDTH],
    },
  },
  {
    id: "gl-draw-line",
    type: "line",
    filter: isLineOrPolygon,
    layout: { "line-cap": "round", "line-join": "round" },
    paint: {
      "line-color": COLOR,
      "line-width": ["case", isSelected, SELECTED_WIDTH, WIDTH],
    },
  },
  {
    // Corner handles shown while drawing or editing
    id: "gl-draw-vertex",
    type: "circle",
    filter: ["all", ["==", "meta", "vertex"], ["!=", "mode", "simple_select"]],
    paint: {
      "circle-radius": ["case", isSelected, 7, 6],
      "circle-color": CASING_COLOR,
      "circle-stroke-color": COLOR,
      "circle-stroke-width": 2,
    },
  },
  {
    // Middle handles that add a new corner when dragged
    id: "gl-draw-midpoint",
    type: "circle",
    filter: ["==", "meta", "midpoint"],
    paint: {
      "circle-radius": 4,
      "circle-color": CASING_COLOR,
      "circle-stroke-color": COLOR,
      "circle-stroke-width": 2,
    },
  },
];

export default drawStyles;
