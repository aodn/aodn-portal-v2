import { DRAW_SELECTION_SYMBOLOGY } from "../../constants";

// MapboxDraw styles for the bbox and polygon tools, following the Figma design.
// A feature is one of: a polygon being drawn, a finished polygon, or a bbox.
const { BBOX, POLYGON_DRAWING, POLYGON_DONE, CORNER } =
  DRAW_SELECTION_SYMBOLOGY;

// Figma default line ends: flat caps and sharp corners
const LINE_LAYOUT = { "line-cap": "butt", "line-join": "miter" };

// Mapbox sets dash lengths in multiples of the line width, the design in px
const dashes = (px: number[], width: number) =>
  px.map((value) => value / width);

const SHADOW_RADIUS =
  CORNER.RADIUS + CORNER.STROKE_WIDTH + CORNER.SHADOW_BLUR / 2;

const geometry = (type: string) => ["==", ["geometry-type"], type];
const isLineOrPolygon = ["any", geometry("LineString"), geometry("Polygon")];
// Only the polygon being drawn is active while the polygon tool is on
const isDrawing = [
  "all",
  ["==", ["get", "mode"], "draw_polygon"],
  ["==", ["get", "active"], "true"],
];
// MapboxDraw adds the "user_" prefix to the properties set by the app
const isPolygon = ["==", ["get", "user_selectionType"], "polygon"];
const isDonePolygon = ["all", isPolygon, ["!", isDrawing]];
const isBbox = ["all", ["!", isPolygon], ["!", isDrawing]];
const isHandle = [
  "all",
  geometry("Point"),
  ["any", ["==", ["get", "meta"], "vertex"], ["==", ["get", "meta"], "corner"]],
  ["!=", ["get", "mode"], "simple_select"],
];
const drawEdge = (kind: string) => [
  "all",
  geometry("LineString"),
  ["==", ["get", "drawEdge"], kind],
];

const drawStyles = [
  {
    // Base fill for a polygon in both states; a finished one adds the purple fill on top
    id: "gl-draw-polygon-fill",
    type: "fill",
    filter: ["all", geometry("Polygon"), ["any", isDrawing, isDonePolygon]],
    paint: {
      "fill-color": POLYGON_DRAWING.FILL_COLOR,
      "fill-opacity": POLYGON_DRAWING.FILL_OPACITY,
    },
  },
  {
    id: "gl-draw-polygon-fill-done",
    type: "fill",
    filter: ["all", geometry("Polygon"), isDonePolygon],
    paint: {
      "fill-color": POLYGON_DONE.FILL_COLOR,
      "fill-opacity": POLYGON_DONE.FILL_OPACITY,
    },
  },
  {
    id: "gl-draw-bbox-fill",
    type: "fill",
    filter: ["all", geometry("Polygon"), isBbox],
    paint: {
      "fill-color": BBOX.FILL_COLOR,
      "fill-opacity": BBOX.FILL_OPACITY,
    },
  },
  {
    id: "gl-draw-bbox-line",
    type: "line",
    filter: ["all", isLineOrPolygon, isBbox],
    layout: LINE_LAYOUT,
    paint: {
      "line-color": BBOX.COLOR,
      "line-width": BBOX.WIDTH,
      "line-dasharray": dashes(BBOX.DASH_PX, BBOX.WIDTH),
    },
  },
  {
    id: "gl-draw-polygon-line-done",
    type: "line",
    filter: ["all", isLineOrPolygon, isDonePolygon],
    layout: LINE_LAYOUT,
    paint: {
      "line-color": POLYGON_DONE.COLOR,
      "line-width": POLYGON_DONE.WIDTH,
    },
  },
  {
    id: "gl-draw-polygon-line-drawn",
    type: "line",
    filter: drawEdge("drawn"),
    layout: LINE_LAYOUT,
    paint: {
      "line-color": POLYGON_DRAWING.COLOR,
      "line-width": POLYGON_DRAWING.WIDTH,
    },
  },
  {
    id: "gl-draw-polygon-line-closing",
    type: "line",
    filter: drawEdge("closing"),
    layout: LINE_LAYOUT,
    paint: {
      "line-color": POLYGON_DRAWING.COLOR,
      "line-width": POLYGON_DRAWING.WIDTH,
      "line-dasharray": dashes(
        POLYGON_DRAWING.CLOSING_DASH_PX,
        POLYGON_DRAWING.WIDTH
      ),
    },
  },
  {
    // Mapbox circles have no drop shadow; a blurred circle under the handle comes close
    id: "gl-draw-corner-shadow",
    type: "circle",
    filter: isHandle,
    paint: {
      "circle-radius": SHADOW_RADIUS,
      "circle-color": CORNER.SHADOW_COLOR,
      "circle-opacity": CORNER.SHADOW_OPACITY,
      "circle-blur": CORNER.SHADOW_BLUR / SHADOW_RADIUS,
    },
  },
  {
    // Corner handles shown while drawing or editing; the stroke sits outside the radius
    id: "gl-draw-corner",
    type: "circle",
    filter: isHandle,
    paint: {
      "circle-radius": CORNER.RADIUS,
      "circle-color": CORNER.COLOR,
      "circle-stroke-color": CORNER.STROKE_COLOR,
      "circle-stroke-width": CORNER.STROKE_WIDTH,
    },
  },
  {
    // Middle handles that add a new corner when dragged (not in the design)
    id: "gl-draw-midpoint",
    type: "circle",
    filter: ["all", geometry("Point"), ["==", ["get", "meta"], "midpoint"]],
    paint: {
      "circle-radius": CORNER.RADIUS / 2,
      "circle-color": CORNER.STROKE_COLOR,
      "circle-stroke-color": CORNER.COLOR,
      "circle-stroke-width": CORNER.STROKE_WIDTH,
    },
  },
];

export default drawStyles;
