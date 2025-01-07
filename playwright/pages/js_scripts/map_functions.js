window.__map_functions = {
  getTestProps: function () {
    return window.testProps;
  },
  getMap: function () {
    return this.getTestProps().getMap();
  },
  getMapLayer: function () {
    if (this.getTestProps().getClusterLayer) {
      return this.getTestProps().getClusterLayer();
    } else if (this.getTestProps().getHeatmapLayer) {
      return this.getTestProps().getHeatmapLayer();
    } else {
      throw new Error("No Map layer found");
    }
  },
  centerMap: function (lng, lat, zoom) {
    const map = this.getMap();
    map.setZoom(zoom);
    map.setCenter([lng, lat]);
  },
  isMapLoaded: function () {
    const map = this.getMap();
    return map.loaded();
  },
  getMapLayers: function () {
    const map = this.getMap();
    const layer = this.getMapLayer();
    return map.queryRenderedFeatures({ layers: [layer] }).length;
  },
  getAUMarineParksLayer: function () {
    if (this.getTestProps().getAUMarineParksLayer) {
      return this.getTestProps().getAUMarineParksLayer();
    } else {
      throw new Error("AU Marine Parks layer not found");
    }
  },
  getWorldBoundariesLayer: function () {
    if (this.getTestProps().getWorldBoundariesLayer) {
      return this.getTestProps().getWorldBoundariesLayer();
    } else {
      throw new Error("World Boundaries layer not found");
    }
  },
  getSpiderLayer: function () {
    if (this.getTestProps().getSpiderLayer) {
      return this.getTestProps().getSpiderLayer();
    } else {
      throw new Error("Spider layer not found");
    }
  },
  isMapLayerVisible: function (layerId) {
    const map = this.getMap();
    return undefined != map.getLayer(layerId);
  },
  findAndClickCluster: function () {
    const map = this.getMap();
    const canvas = map.getCanvas();
    const width = canvas.width;
    const height = canvas.height;

    const clusters = map.queryRenderedFeatures(
      [
        [0, 0],
        [width, height],
      ],
      { layers: [this.getMapLayer()] }
    );

    if (clusters.length > 0) {
      const cluster = clusters[0];
      const coordinates = cluster.geometry.coordinates;
      const point = map.project(coordinates);

      map.fire("click", {
        lngLat: coordinates,
        point: point,
        originalEvent: { preventDefault: () => {} },
      });
      return true;
    }

    return false;
  },
  zoomToLevel: function (targetZoom) {
    const map = this.getMap();
    const currentZoom = map.getZoom();
    if (currentZoom < targetZoom) {
      map.zoomTo(targetZoom, { duration: 1000 });
      return true;
    }
    return false;
  },
  getMapCenter: function () {
    const map = this.getMap();
    return map.getCenter();
  },
  getMapZoom: function () {
    const map = this.getMap();
    return map.getZoom();
  },
};
