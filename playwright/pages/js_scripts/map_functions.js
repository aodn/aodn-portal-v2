function getTestProps() {
  return window.testProps;
}

function getMap() {
  return getTestProps().getMap();
}

function getMapLayer() {
  if (getTestProps().getClusterLayer) {
    return getTestProps().getClusterLayer();
  } else if (getTestProps().getHeatmapLayer) {
    return getTestProps().getHeatmapLayer();
  } else {
    throw new Error("No Map layer found");
  }
}

function centerMap(lng, lat, zoom) {
  const map = getMap();
  map.setZoom(zoom);
  map.setCenter([lng, lat]);
}

function isMapLoaded() {
  const map = getMap();
  return map.loaded();
}

function getMapLayers() {
  const map = getMap();
  const layer = getMapLayer();
  return map.queryRenderedFeatures({ layers: [layer] }).length;
}

function getAUMarineParksLayer() {
  if (getTestProps().getAUMarineParksLayer) {
    return getTestProps().getAUMarineParksLayer();
  } else {
    throw new Error("AU Marine Parks layer not found");
  }
}

function getWorldBoundariesLayer() {
  if (getTestProps().getWorldBoundariesLayer) {
    return getTestProps().getWorldBoundariesLayer();
  } else {
    throw new Error("World Boundaries layer not found");
  }
}

function getSpiderLayer() {
  if (getTestProps().getSpiderLayer) {
    return getTestProps().getSpiderLayer();
  } else {
    throw new Error("Spider layer not found");
  }
}

function isMapLayerVisible(layerId) {
  const map = getMap();
  return undefined != map.getLayer(layerId);
}

function findAndClickCluster() {
  const map = getMap();
  const canvas = map.getCanvas();
  const width = canvas.width;
  const height = canvas.height;

  const clusters = map.queryRenderedFeatures(
    [
      [0, 0],
      [width, height],
    ],
    { layers: [getMapLayer()] }
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
}

function zoomToLevel(targetZoom) {
  const map = getMap();
  const currentZoom = map.getZoom();
  if (currentZoom < targetZoom) {
    map.zoomTo(targetZoom, { duration: 1000 });
    return true;
  }
  return false;
}
