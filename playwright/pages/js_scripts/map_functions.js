function getMap() {
  return document.MAP_OBJECT;
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
  const layer = "heatmap-layer-map-container-id-heatmap-layer";
  return map.queryRenderedFeatures({ layers: [layer] }).length;
}

function isMapLayerVisible(layerId) {
  return undefined != document.MAP_OBJECT.getLayer(layerId);
}
