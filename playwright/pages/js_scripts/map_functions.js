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
  getAllenCoralAtlasLayer: function (mapId) {
    if (this.getTestProps(mapId).getAllenCoralAtlasLayer) {
      return this.getTestProps(mapId).getAllenCoralAtlasLayer();
    } else {
      throw new Error("Allen Coral Atlas layer not found");
    }
  },
  getAUMarineParksLayer: function (mapId) {
    if (this.getTestProps(mapId).getAUMarineParksLayer) {
      return this.getTestProps(mapId).getAUMarineParksLayer();
    } else {
      throw new Error("AU Marine Parks layer not found");
    }
  },
  getMarineEcoregionLayer: function (mapId) {
    if (this.getTestProps(mapId).getMarineEcoregionLayer) {
      return this.getTestProps(mapId).getMarineEcoregionLayer();
    } else {
      throw new Error("Marine Ecoregion layer not found");
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
    console.log("[DEBUG] isMapLayerVisible checking layerId:", layerId);

    const testProps = this.getTestProps(mapId);
    if (
      testProps &&
      typeof testProps.isHexbinVisible === "function" &&
      typeof testProps.getHexbinLayer === "function"
    ) {
      if (layerId === testProps.getHexbinLayer()) {
        const isVisible = testProps.isHexbinVisible();
        console.log(
          "[DEBUG] Hexbin layer visibility from testProps:",
          isVisible
        );
        return !!isVisible;
      }
    }

    const style = map.getStyle();
    if (style && style.layers) {
      console.log(
        "[DEBUG] Available layers in map style:",
        style.layers.map((l) => l.id)
      );
    }
    const layer = map.getLayer(layerId);
    if (layer == undefined) {
      console.log("[DEBUG] Layer", layerId, "not found (undefined)");
      return false;
    } else if (layer.props == undefined) {
      console.log(
        "[DEBUG] Layer",
        layerId,
        "found, but props is undefined. Returning true."
      );
      return true;
    } else {
      console.log(
        "[DEBUG] Layer",
        layerId,
        "found, visible prop:",
        layer.props.visible
      );
      return layer.props.visible;
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
  fireClickAtLngLat: function (mapId, lng, lat) {
    const map = this.getMap(mapId);
    const lngLat = { lng, lat };
    const point = map.project(lngLat);
    map.fire("click", {
      lngLat: lngLat,
      point: point,
      originalEvent: { preventDefault: () => {} },
    });
  },
  getMapBounds: function (mapId) {
    const map = this.getMap(mapId);
    const bounds = map.getBounds();
    return {
      west: bounds.getWest(),
      east: bounds.getEast(),
      south: bounds.getSouth(),
      north: bounds.getNorth(),
    };
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
