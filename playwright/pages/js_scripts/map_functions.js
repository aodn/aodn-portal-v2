window.__map_functions = {
  getTestProps: function (id) {
    return window.testProps[id];
  },
  getMap: function (mapId) {
    return this.getTestProps(mapId).getMap();
  },
  getMapLayer: function (mapId) {
    if (this.getTestProps(mapId).getClusterLayer) {
      return this.getTestProps(mapId).getClusterLayer();
    } else if (this.getTestProps(mapId).getHeatmapLayer) {
      return this.getTestProps(mapId).getHeatmapLayer();
    } else {
      throw new Error("No Map layer found");
    }
  },
  centerMap: function (mapId, lng, lat) {
    const map = this.getMap(mapId);
    map.setCenter([lng, lat]);
  },
  isMapLoaded: function (mapId) {
    const map = this.getMap(mapId);
    return map.loaded();
  },
  isMapIdle: function (mapId) {
    const map = this.getMap(mapId);
    return map.idle();
  },
  getMapLayers: function (mapId) {
    const map = this.getMap(mapId);
    const layer = this.getMapLayer(mapId);
    return map.queryRenderedFeatures({ layers: [layer] }).length;
  },
  getAUMarineParksLayer: function (mapId) {
    if (this.getTestProps(mapId).getAUMarineParksLayer) {
      return this.getTestProps(mapId).getAUMarineParksLayer();
    } else {
      throw new Error("AU Marine Parks layer not found");
    }
  },
  getWorldBoundariesLayer: function (mapId) {
    if (this.getTestProps(mapId).getWorldBoundariesLayer) {
      return this.getTestProps(mapId).getWorldBoundariesLayer();
    } else {
      throw new Error("World Boundaries layer not found");
    }
  },
  getSpiderLayer: function (mapId) {
    if (this.getTestProps(mapId).getSpiderLayer) {
      return this.getTestProps(mapId).getSpiderLayer();
    } else {
      throw new Error("Spider layer not found");
    }
  },
  getGeoServerLayer: function (mapId) {
    if (this.getTestProps(mapId).getGeoServerTileLayer) {
      return this.getTestProps(mapId).getGeoServerTileLayer();
    } else {
      throw new Error("Geoserver layer not found");
    }
  },
  getHexbinLayer: function (mapId) {
    if (this.getTestProps(mapId).getHexbinLayer) {
      return this.getTestProps(mapId).getHexbinLayer();
    } else {
      throw new Error("Hexbin layer not found");
    }
  },
  getSpatialExtentLayer: function (mapId) {
    if (this.getTestProps(mapId).getSpatialExtentLayer) {
      return this.getTestProps(mapId).getSpatialExtentLayer();
    } else {
      throw new Error("Spatial Extent layer not found");
    }
  },
  isMapLayerVisible: function (mapId, layerId) {
    const map = this.getMap(mapId);
    if (map.getLayer(layerId) == undefined) {
      return false;
    } else if (map.getLayer(layerId).props == undefined) {
      return true;
    } else {
      return map.getLayer(layerId).props.visible;
    }
  },
  findAndClickCluster: function (mapId) {
    const map = this.getMap(mapId);
    const canvas = map.getCanvas();
    const width = canvas.width;
    const height = canvas.height;

    const clusters = map.queryRenderedFeatures(
      [
        [0, 0],
        [width, height],
      ],
      { layers: [this.getMapLayer(mapId)] }
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
  zoomToLevel: function (mapId, zoom_level) {
    const map = this.getMap(mapId);
    map.setZoom(zoom_level);
  },
  getMapCenter: function (mapId) {
    const map = this.getMap(mapId);
    return map.getCenter();
  },
  getMapZoom: function (mapId) {
    const map = this.getMap(mapId);
    return map.getZoom();
  },
  getMapClickLngLat: function (mapId) {
    return this.getTestProps(mapId).getMapClickLngLat();
  },
  findAndClickDataPoint: function (mapId, uuid) {
    const map = this.getMap(mapId);
    const featuresArray = map.queryRenderedFeatures();
    const feature = featuresArray.find((f) => f.properties.uuid === uuid);
    if (feature) {
      const coordinates = feature.geometry.coordinates;
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
};
