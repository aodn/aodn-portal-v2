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
