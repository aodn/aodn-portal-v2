import { FC, useContext, useEffect, useMemo } from "react";
import MapContext from "../MapContext";
import { LayerBasicType } from "./Layers";
import { mergeWithDefaults } from "../../../../utils/ObjectUtils";
import { formatToUrl } from "../../../../utils/UrlUtils";

interface TileUrlParams {
  LAYERS: string[];
  TRANSPARENT?: string;
  VERSION?: string;
  FORMAT?: string;
  EXCEPTIONS?: string;
  TILED?: string;
  SERVICE?: string;
  REQUEST?: string;
  STYLES?: string;
  QUERYABLE?: string;
  SRS?: string;
  BBOX?: string;
  WIDTH?: number;
  HEIGHT?: number;
}

interface GeoServerTileLayerConfig {
  tileUrlParams: TileUrlParams;
  baseUrl: string;
  tileSize: number;
  minZoom: number;
  maxZoom: number;
  opacity: number;
}

// Example url: "/geowebcache/service/wms?LAYERS=imos%3Aanmn_velocity_timeseries_map&TRANSPARENT=TRUE&VERSION=1.1.1&FORMAT=image%2Fpng&EXCEPTIONS=application%2Fvnd.ogc.se_xml&TILED=true&SERVICE=WMS&REQUEST=GetMap&STYLES=&QUERYABLE=true&SRS=EPSG%3A3857&BBOX={bbox-epsg-3857}&WIDTH=256&HEIGHT=256"

const defaultGeoServerTileLayerConfig: GeoServerTileLayerConfig = {
  tileUrlParams: {
    LAYERS: [],
    TRANSPARENT: "TRUE",
    VERSION: "1.1.1",
    FORMAT: "image/png",
    EXCEPTIONS: "application/vnd.ogc.se_xml",
    TILED: "true",
    SERVICE: "WMS",
    REQUEST: "GetMap",
    STYLES: "",
    QUERYABLE: "true",
    //Change the coordinate system from EPSG:4326 to EPSG:3857 (Web Mercator) which is what Mapbox GL expects for WMS tiles.
    SRS: "EPSG:3857",
    // Adapt to the Mapbox GL WMS Bbox format
    BBOX: "{bbox-epsg-3857}",
    WIDTH: 256,
    HEIGHT: 256,
  },
  tileSize: 256,
  baseUrl: "/geowebcache/service/wms",
  minZoom: 0,
  maxZoom: 20,
  opacity: 1.0,
};

// Helper functions to generate consistent IDs
const getLayerId = (id: string | undefined) => `${id}-geo-server-tile-layer`;
const getTileSourceId = (layerId: string) => `${layerId}-source`;
const getTileLayerId = (layerId: string) => `${layerId}-tile`;

interface GeoServerTileLayerProps extends LayerBasicType {
  geoServerTileLayerConfig?: Partial<GeoServerTileLayerConfig>;
}

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

    const createLayers = async () => {
      // Check if source already exists to avoid duplicates
      if (map?.getSource(tileSourceId)) return;

      const config = mergeWithDefaults(
        defaultGeoServerTileLayerConfig,
        geoServerTileLayerConfig
      );

      if (config.tileUrlParams.LAYERS.length === 0) return;

      const tileUrl = formatToUrl<TileUrlParams>({
        baseUrl: config.baseUrl,
        params: config.tileUrlParams,
      });

      try {
        // Add the WMS source following Mapbox's example
        map?.addSource(tileSourceId, {
          type: "raster",
          tiles: [tileUrl],
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
      } catch (error) {
        console.log("Error adding layer or source:", error);
      }
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
        // TODO: handle error if needed
        console.error("Error removing layer or source:", error);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map]);

  return null;
};

export default GeoServerTileLayer;
