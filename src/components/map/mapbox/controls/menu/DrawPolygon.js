import MapboxDraw from "@mapbox/mapbox-gl-draw";

// draw_polygon with the design look while drawing: the edges up to the cursor are
// solid, the closing edge back to the first corner is dashed, and every corner shows a handle.
// Clicking behaviour is the library's own; only the display features change.
const baseMode = MapboxDraw.modes.draw_polygon;

const lineFeature = (properties, drawEdge, coordinates) => ({
  type: "Feature",
  properties: { ...properties, drawEdge },
  geometry: { type: "LineString", coordinates },
});

// A corner handle that is display only: meta is not "vertex", so clicking it
// still places a new point instead of finishing the shape
const cornerFeature = (parent, index, coordinates) => ({
  type: "Feature",
  properties: {
    meta: "corner",
    parent,
    coord_path: `0.${index}`,
    active: "false",
  },
  geometry: { type: "Point", coordinates },
});

const DrawPolygon = {
  ...baseMode,
  toDisplayFeatures: function (state, geojson, display) {
    // Keep the library's polygon and its two clickable end handles, drop its lines
    baseMode.toDisplayFeatures.call(this, state, geojson, (feature) => {
      if (feature.geometry.type !== "LineString") display(feature);
    });
    if (geojson.properties.id !== state.polygon.id) return;
    // Ring: placed corners, then the cursor, then the first corner again
    const ring = geojson.geometry.coordinates[0] ?? [];
    if (ring.length < 3) return;
    const placed = ring.slice(0, -2);
    const cursor = ring[ring.length - 2];
    const { properties } = geojson;
    display(lineFeature(properties, "drawn", [...placed, cursor]));
    // With one corner the closing edge is the same line as the drawn one
    if (placed.length > 1) {
      display(lineFeature(properties, "closing", [cursor, placed[0]]));
    }
    // The library already shows the first and the last placed corner
    placed.slice(1, -1).forEach((coordinates, index) => {
      display(cornerFeature(properties.id, index + 1, coordinates));
    });
  },
};

export default DrawPolygon;
