function getTestProps() {
  return window.testProps;
}

function getMap() {
  return getTestProps().getMap();
}

function getHeatmapLayer() {
  return getTestProps().getHeatmapLayer();
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
  const layer = getHeatmapLayer();
  return map.queryRenderedFeatures({ layers: [layer] }).length;
}

function getAUMarineParksLayer() {
  return getTestProps().getAUMarineParksLayer
    ? getTestProps().getAUMarineParksLayer()
    : "";
}

function getWorldBoundariesLayer() {
  return getTestProps().getWorldBoundariesLayer
    ? getTestProps().getWorldBoundariesLayer()
    : "";
}

function getSpiderLayer() {
  return getTestProps().getSpiderLayer ? getTestProps().getSpiderLayer() : "";
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
    { layers: ["cluster-count"] }
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
