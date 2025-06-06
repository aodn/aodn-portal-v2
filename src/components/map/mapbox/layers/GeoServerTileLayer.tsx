import { FC, useContext, useEffect, useMemo } from "react";
import MapContext from "../MapContext";
import { LayerBasicType } from "./Layers";
import { mergeWithDefaults } from "../../../../utils/ObjectUtils";
import { formatToUrl } from "../../../../utils/UrlUtils";
import { MapDefaultConfig } from "../constants";
import { Position } from "geojson";
import { fitToBound } from "../../../../utils/MapUtils";

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
  bbox: Position;
}

// Example url for mapbox wms resource: "/geowebcache/service/wms?LAYERS=imos%3Aanmn_velocity_timeseries_map&TRANSPARENT=TRUE&VERSION=1.1.1&FORMAT=image%2Fpng&EXCEPTIONS=application%2Fvnd.ogc.se_xml&TILED=true&SERVICE=WMS&REQUEST=GetMap&STYLES=&QUERYABLE=true&SRS=EPSG%3A3857&BBOX={bbox-epsg-3857}&WIDTH=256&HEIGHT=256"

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
  baseUrl: "",
  tileSize: 256,
  minZoom: MapDefaultConfig.MIN_ZOOM,
  maxZoom: MapDefaultConfig.MAX_ZOOM,
  bbox: [
    MapDefaultConfig.BBOX_ENDPOINTS.WEST_LON,
    MapDefaultConfig.BBOX_ENDPOINTS.SOUTH_LAT,
    MapDefaultConfig.BBOX_ENDPOINTS.EAST_LON,
    MapDefaultConfig.BBOX_ENDPOINTS.NORTH_LAT,
  ],
  opacity: 1.0,
};

// Helper functions to generate consistent IDs
const getLayerId = (id: string | undefined) => `${id}-geo-server-tile-layer`;
const getTileSourceId = (layerId: string) => `${layerId}-source`;
const getTileLayerId = (layerId: string) => `${layerId}-tile`;

const checkWMSAvailability = (
  baseUrl: string,
  urlConfig: TileUrlParams,
  onWMSAvailabilityChange: ((isWMSAvailable: boolean) => void) | undefined
): boolean => {
  // TODO: Implement a proper WMS availability check if needed, e.g., by making a request to the WMS endpoint
  if (urlConfig.LAYERS.length === 0 || baseUrl === "") {
    onWMSAvailabilityChange?.(false);
    return false;
  }
  return true;
};

interface GeoServerTileLayerProps extends LayerBasicType {
  geoServerTileLayerConfig?: Partial<GeoServerTileLayerConfig>;
  onWMSAvailabilityChange?: (isWMSAvailable: boolean) => void;
}

const GeoServerTileLayer: FC<GeoServerTileLayerProps> = ({
  geoServerTileLayerConfig,
  onWMSAvailabilityChange,
}: GeoServerTileLayerProps) => {
  const { map } = useContext(MapContext);

  const config = useMemo(
    () =>
      mergeWithDefaults(
        defaultGeoServerTileLayerConfig,
        geoServerTileLayerConfig
      ),
    [geoServerTileLayerConfig]
  );

  const tileUrl = useMemo(
    () =>
      formatToUrl<TileUrlParams>({
        baseUrl: config.baseUrl,
        params: config.tileUrlParams,
      }),
    [config.baseUrl, config.tileUrlParams]
  );

  const isWMSAvailable = useMemo(
    () =>
      checkWMSAvailability(
        config.baseUrl,
        config.tileUrlParams,
        onWMSAvailabilityChange
      ),
    [config.baseUrl, config.tileUrlParams, onWMSAvailabilityChange]
  );

  // Add the tile layer to the map
  useEffect(() => {
    if (map === null || map === undefined) return;

    const layerId = getLayerId(map.getContainer().id);
    const titleLayerId = getTileLayerId(layerId);
    const sourceLayerId = getTileSourceId(layerId);

    const createLayers = () => {
      // Check WMS availability before adding the layer
      if (isWMSAvailable) {
        // Add the WMS source following Mapbox's example
        if (!map?.getSource(sourceLayerId)) {
          map?.addSource(sourceLayerId, {
            type: "raster",
            tiles: [tileUrl],
            tileSize: config.tileSize,
            minzoom: config.minZoom,
            maxzoom: config.maxZoom,
          });
        }

        // Add the raster layer
        if (!map?.getLayer(titleLayerId)) {
          map?.addLayer({
            id: titleLayerId,
            type: "raster",
            source: sourceLayerId,
            paint: {},
          });
        }

        const handleIdle = () => {
          if (!isWMSAvailable) return;
          fitToBound(map, config.bbox, {
            animate: true,
            zoomOffset: 0.5,
          });
        };
        map?.once("idle", handleIdle);
        // Re-add layers when map style changes
        map?.on("styledata", createLayers);
      }
    };

    const cleanUp = () => {
      if (map === null || map === undefined) return;

      map?.off("styledata", createLayers);

      // Important to check this because the map may be unloading and when you try
      // to access getLayer or similar function, the style will be undefined and throw
      // exception
      if (isWMSAvailable && map?.isStyleLoaded()) {
        if (titleLayerId && map?.getLayer(titleLayerId)) {
          map?.removeLayer(titleLayerId);
        }

        if (sourceLayerId && map?.getSource(sourceLayerId)) {
          map?.removeSource(sourceLayerId);
        }
      }
    };

    // Create layers when map loads
    map?.once("load", createLayers);

    // Cleanup function
    return () => {
      cleanUp();
    };
  }, [
    config.bbox,
    config.maxZoom,
    config.minZoom,
    config.tileSize,
    isWMSAvailable,
    map,
    tileUrl,
  ]);

  return null;
};

export default GeoServerTileLayer;
