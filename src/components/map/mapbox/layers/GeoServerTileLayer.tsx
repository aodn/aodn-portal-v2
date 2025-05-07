import { FC, useContext, useEffect, useMemo } from "react";
import MapContext from "../MapContext";
import { LayerBasicType } from "./Layers";
import { mergeWithDefaults } from "../../../../utils/ObjectUtils";

interface GeoServerTileLayerConfig {
  tileUrl: string;
  tileSize: number;
  minZoom: number;
  maxZoom: number;
  opacity: number;
}

interface GeoServerTileLayerProps extends LayerBasicType {
  geoServerTileLayerConfig?: Partial<GeoServerTileLayerConfig>;
}

const defaultGeoServerTileLayerConfig: GeoServerTileLayerConfig = {
  // TODO: this url is an example, replace with the actual URL
  // which needs actual parameters for your GeoServer WMS service
  tileUrl:
    "/geowebcache/service/wms?LAYERS=imos%3Aanmn_velocity_timeseries_map&TRANSPARENT=TRUE&VERSION=1.1.1&FORMAT=image%2Fpng&EXCEPTIONS=application%2Fvnd.ogc.se_xml&TILED=true&SERVICE=WMS&REQUEST=GetMap&STYLES=&QUERYABLE=true&SRS=EPSG%3A3857&BBOX={bbox-epsg-3857}&WIDTH=256&HEIGHT=256", // example url
  tileSize: 256,
  minZoom: 0,
  maxZoom: 22,
  opacity: 1.0,
};

const formatTileUrl = (layerName: string) =>
  `/geowebcache/service/wms?LAYERS=${layerName}&TRANSPARENT=TRUE&VERSION=1.1.1&FORMAT=image%2Fpng&EXCEPTIONS=application%2Fvnd.ogc.se_xml&TILED=true&SERVICE=WMS&REQUEST=GetMap&STYLES=&QUERYABLE=true&SRS=EPSG%3A3857&BBOX={bbox-epsg-3857}&WIDTH=256&HEIGHT=256`;

// Helper functions to generate consistent IDs
export const getLayerId = (id: string | undefined) =>
  `geo-server-tile-layer-${id}`;
export const getTileSourceId = (layerId: string) => `${layerId}-source`;
export const getTileLayerId = (layerId: string) => `${layerId}-tile`;

const GeoServerTileLayer: FC<GeoServerTileLayerProps> = ({
  geoServerTileLayerConfig,
}: GeoServerTileLayerProps) => {
  const { map } = useContext(MapContext);

  const layerId = useMemo(() => getLayerId(map?.getContainer().id), [map]);
  const tileSourceId = useMemo(() => getTileSourceId(layerId), [layerId]);
  const tileLayer = useMemo(() => getTileLayerId(layerId), [layerId]);

  // Add the tile layer to the map
  useEffect(() => {
    if (map === null) return;

    const createLayers = () => {
      // Check if source already exists to avoid duplicates
      if (map?.getSource(tileSourceId)) return;

      const config = mergeWithDefaults(
        defaultGeoServerTileLayerConfig,
        geoServerTileLayerConfig
      );

      // Add the WMS source following Mapbox's example
      map?.addSource(tileSourceId, {
        type: "raster",
        tiles: [config.tileUrl],
        tileSize: config.tileSize,
        minzoom: config.minZoom,
        maxzoom: config.maxZoom,
      });

      // Add the raster layer
      map?.addLayer({
        id: tileLayer,
        type: "raster",
        source: tileSourceId,
        paint: {},
      });
    };

    // Create layers when map loads
    map?.once("load", createLayers);

    // Re-add layers when map style changes
    map?.on("styledata", createLayers);

    // Cleanup function
    return () => {
      try {
        map?.off("styledata", createLayers);

        if (map?.getLayer(tileLayer)) {
          map?.removeLayer(tileLayer);
        }

        if (map?.getSource(tileSourceId)) {
          map?.removeSource(tileSourceId);
        }
      } catch (error) {
        // TODO: handle error in ErrorBoundary
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map]);

  return null;
};

export default GeoServerTileLayer;
