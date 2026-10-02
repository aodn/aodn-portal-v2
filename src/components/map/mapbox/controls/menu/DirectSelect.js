import MapboxDraw from "@mapbox/mapbox-gl-draw";

// direct_select is the MapboxDraw mode for editing a drawn shape: the user
// clicks a selected shape, then drags its vertices (corners) or its midpoints
// (the handles between two vertices, which add a new vertex when dragged).
const defaultDirectSelect = MapboxDraw.modes.direct_select;

// DrawRect tags each shape with selectionType "bbox" or "polygon".
// Untagged shapes are treated as bounding boxes, same as in DrawRect.
const isBoundingBox = (feature) =>
  (feature.properties.selectionType ?? "bbox") === "bbox";

// Moves one corner of a rectangle to `newPosition`. The opposite corner stays
// fixed and the other two corners follow, so the shape stays a rectangle.
// Corners keep their order, so MapboxDraw still knows which one is dragged.
const moveBoundingBoxCorner = (corners, cornerIndex, newPosition) => {
  const [draggedLng, draggedLat] = corners[cornerIndex];
  const [oppositeLng, oppositeLat] = corners[(cornerIndex + 2) % 4];
  return corners.map(([lng, lat]) => [
    lng === draggedLng ? newPosition[0] : oppositeLng,
    lat === draggedLat ? newPosition[1] : oppositeLat,
  ]);
};

/**
 * Replaces MapboxDraw's direct_select mode so a bounding box can be resized
 * from its corners but never edited into a polygon. No shape shows midpoints.
 */
const DirectSelect = {
  ...defaultDirectSelect,
  // Called while a vertex is dragged; delta is how far the mouse moved
  dragVertex: function (state, e, delta) {
    // MapboxDraw stores a polygon without repeating the first point at the
    // end, so a bounding box has exactly 4 corners
    const corners = state.feature.coordinates[0];
    if (!isBoundingBox(state.feature) || corners.length !== 4) {
      return defaultDirectSelect.dragVertex.call(this, state, e, delta);
    }
    // Vertex paths look like "0.2" (ring 0, corner 2). Shift-click can select
    // several corners, but a rectangle can only be resized from one, so use
    // the last one selected.
    const draggedPath = state.selectedCoordPaths.at(-1);
    const cornerIndex = Number(draggedPath.split(".")[1]);
    const [lng, lat] = corners[cornerIndex];
    state.feature.setCoordinates([
      moveBoundingBoxCorner(corners, cornerIndex, [
        lng + delta.lng,
        lat + delta.lat,
      ]),
    ]);
  },
  // Called to draw the shape and its handles; push adds one item to the map.
  // Midpoints are hidden, so a shape can only be edited by dragging its corners.
  toDisplayFeatures: function (state, geojson, push) {
    const pushUnlessMidpoint = (feature) => {
      if (feature.properties.meta !== "midpoint") push(feature);
    };
    return defaultDirectSelect.toDisplayFeatures.call(
      this,
      state,
      geojson,
      pushUnlessMidpoint
    );
  },
};

export default DirectSelect;
