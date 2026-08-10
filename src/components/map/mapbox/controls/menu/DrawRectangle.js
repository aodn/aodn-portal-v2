/**
 * It is a copy of the DrawRectangle mode from mapbox-gl-draw-rectangle-mode library.
 * Because this library is not actively maintained (newest update was 6 years ago)
 * so i copied the code here to make sure if anything imcompatible, we can fix it.
 * The mapbox-gl-draw-rectangle-mode library is also added to the project as a dependency
 * so we can leverage dependabot to supervise the vulnerabilities.
 * @type {{enable: doubleClickZoom.enable, disable(*): void}}
 */
const doubleClickZoom = {
  enable: (ctx) => {
    setTimeout(() => {
      // First check we've got a map and some context.
      if (
        !ctx.map ||
        !ctx.map.doubleClickZoom ||
        !ctx._ctx ||
        !ctx._ctx.store ||
        !ctx._ctx.store.getInitialConfigValue
      )
        return;
      // Now check initial state wasn't false (we leave it disabled if so)
      if (!ctx._ctx.store.getInitialConfigValue("doubleClickZoom")) return;
      ctx.map.doubleClickZoom.enable();
    }, 0);
  },
  disable(ctx) {
    setTimeout(() => {
      if (!ctx.map || !ctx.map.doubleClickZoom) return;
      // Always disable here, as it's necessary in some cases.
      ctx.map.doubleClickZoom.disable();
    }, 0);
  },
};

const DrawRectangle = {
  // When the mode starts this function will be called.
  onSetup: function (_) {
    const rectangle = this.newFeature({
      type: "Feature",
      properties: {},
      geometry: {
        type: "Polygon",
        coordinates: [[]],
      },
    });
    this.addFeature(rectangle);
    this.clearSelectedFeatures();
    doubleClickZoom.disable(this);
    this.updateUIClasses({ mouse: "add" });
    this.setActionableState({
      trash: true,
    });
    return {
      rectangle,
    };
  },
  // support mobile taps
  onTap: function (state, e) {
    // emulate 'move mouse' to update feature coords
    if (state.startPoint) this.onMouseMove(state, e);
    // emulate onClick
    this.onClick(state, e);
  },
  // Whenever a user clicks on the map, Draw will call `onClick`
  onClick: function (state, e) {
    if (state.startPoint) {
      // Second click: update final rectangle coordinates
      this.onMouseMove(state, e);
      this.updateUIClasses({ mouse: "pointer" });
      state.endPoint = [e.lngLat.lng, e.lngLat.lat];

      const isZeroArea =
        state.startPoint[0] === e.lngLat.lng ||
        state.startPoint[1] === e.lngLat.lat;

      if (isZeroArea) {
        // Single-click without dragging or zero width/height rectangle -> delete feature
        this.deleteFeature([state.rectangle.id], { silent: true });
        setTimeout(() => {
          this.changeMode("simple_select");
        }, 0);
      } else {
        // Defer mode change to allow other click handlers to see we're still in draw mode
        // This prevents accidental popups on the second click
        setTimeout(() => {
          this.changeMode("simple_select", { featuresId: state.rectangle.id });
        }, 0);
      }
      return;
    }
    // on first click, save clicked point coords as starting for rectangle
    state.startPoint = [e.lngLat.lng, e.lngLat.lat];
  },
  onMouseMove: function (state, e) {
    // Bounding box from startPoint → current pointer. One setCoordinates call
    // marks the feature dirty once; five updateCoordinate calls did it five times.
    // Polygon stores rings without a closing vertex (getCoordinates re-closes them).
    if (!state.startPoint) return;

    const { lng, lat } = e.lngLat;
    // Skip no-op moves (same cell as last update) to avoid useless store/render work
    if (
      state.lastPoint &&
      state.lastPoint[0] === lng &&
      state.lastPoint[1] === lat
    ) {
      return;
    }
    state.lastPoint = [lng, lat];

    const [startLng, startLat] = state.startPoint;
    state.rectangle.setCoordinates([
      [
        [startLng, startLat],
        [lng, startLat],
        [lng, lat],
        [startLng, lat],
      ],
    ]);
  },
  // Whenever a user clicks on a key while focused on the map, it will be sent here
  onKeyUp: function (state, e) {
    if (e.key === "Escape" || e.keyCode === 27) {
      return this.changeMode("simple_select");
    }
  },
  onStop: function (state) {
    doubleClickZoom.enable(this);
    this.updateUIClasses({ mouse: "none" });
    this.activateUIButton();

    // check to see if we've deleted this feature
    if (this.getFeature(state.rectangle.id) === undefined) return;

    // getCoordinates() re-closes the ring (4 corners → 5 positions).
    // Require non-zero width and height via opposite corners [0] vs [2].
    const coords = state.rectangle.getCoordinates()[0];
    const isValidRectangle =
      coords &&
      coords.length >= 5 &&
      coords[0][0] !== coords[2][0] &&
      coords[0][1] !== coords[2][1];

    if (isValidRectangle && state.rectangle.isValid()) {
      this.map.fire("draw.create", {
        features: [state.rectangle.toGeoJSON()],
      });
    } else {
      this.deleteFeature([state.rectangle.id], { silent: true });
    }
  },
  toDisplayFeatures: function (state, geojson, display) {
    const isActivePolygon = geojson.properties.id === state.rectangle.id;
    geojson.properties.active = isActivePolygon ? "true" : "false";
    if (!isActivePolygon) return display(geojson);

    // Only render after the first corner is set and the ring has 4 corners
    // (getCoordinates re-closes → length 5)
    if (!state.startPoint) return;
    const coords = state.rectangle.getCoordinates()[0];
    if (!coords || coords.length < 5) return;
    return display(geojson);
  },
  onTrash: function (state) {
    this.deleteFeature([state.rectangle.id], { silent: true });
    this.changeMode("simple_select");
  },
};

export default DrawRectangle;
