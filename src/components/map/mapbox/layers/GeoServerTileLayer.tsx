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

interface GeoServerTileLayerProps extends LayerBasicType {
  geoServerTileLayerConfig?: Partial<GeoServerTileLayerConfig>;
  onWMSAvailabilityChange?: (isWMSAvailable: boolean) => void;
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
// This function is specific for IMOS server geoserver-123
// we can speed up the query by calling the cache server we own.
// A proxy setup to redirect the call on firewall level
const applyGeoWebCacheIfPossible = (baseUrl: string, param: TileUrlParams) => {
  if (baseUrl.includes("geoserver-123.aodn.org.au/geoserver/wms")) {
    // We can rewrite value so that it use internal cache server
    return {
      baseUrl: "/geowebcache/service/wms",
      params: {
        ...param,
        SRS: "EPSG:900913", // This is same as "EPSG:3857", but tile server use a old name, mapbox must use 3857
        //BBOX: "{bbox-epsg-900913}",
      },
    };
  } else {
    return {
      baseUrl: baseUrl,
      params: param,
    };
  }
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

const GeoServerTileLayer: FC<GeoServerTileLayerProps> = ({
  geoServerTileLayerConfig,
  onWMSAvailabilityChange,
  visible,
}: GeoServerTileLayerProps) => {
  const { map } = useContext(MapContext);

  const [titleLayerId, sourceLayerId] = useMemo(() => {
    const layerId = getLayerId(map?.getContainer().id);
    const titleLayerId = getTileLayerId(layerId);
    const sourceLayerId = getTileSourceId(layerId);
    return [layerId, titleLayerId, sourceLayerId];
  }, [map]);

  const [config, tileUrl, isWMSAvailable] = useMemo(() => {
    const config = mergeWithDefaults(
      defaultGeoServerTileLayerConfig,
      geoServerTileLayerConfig
    );
    const tileUrl = formatToUrl<TileUrlParams>(
      applyGeoWebCacheIfPossible(config.baseUrl, config.tileUrlParams)
    );
    const isWMSAvailable = checkWMSAvailability(
      config.baseUrl,
      config.tileUrlParams,
      onWMSAvailabilityChange
    );
    return [config, tileUrl, isWMSAvailable];
  }, [geoServerTileLayerConfig, onWMSAvailabilityChange]);

  // Add the tile layer to the map
  useEffect(() => {
    if (map === null || map === undefined) return;

    const createSource = () => {
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
      }
    };

    const createLayers = (layoutVisible: undefined | boolean) => {
      // Check WMS availability before adding the layer
      if (isWMSAvailable) {
        // Add the raster layer
        if (!map?.getLayer(titleLayerId)) {
          map?.addLayer({
            id: titleLayerId,
            type: "raster",
            source: sourceLayerId,
            paint: {},
            layout: {
              visibility: layoutVisible ? "visible" : "none",
            },
          });

          // Handle only if new layer added
          const handleIdle = () => {
            if (!isWMSAvailable) return;
            fitToBound(map, config.bbox, {
              animate: true,
              zoomOffset: 0.5,
            });
          };

          layoutVisible && map?.once("idle", handleIdle);
        }
      }
    };

    const createLayersOnStyleChange = () => {
      createSource();
      createLayers(visible);
    };

    const createLayersOnInit = () => {
      if (map?.isStyleLoaded()) {
        createSource();
        createLayers(visible);
      }
    };

    const cleanUp = () => {
      if (map === null || map === undefined) return;
      map?.off("styledata", createLayersOnStyleChange);
      // Important to check this because the map may be unloading and when you try
      // to access getLayer or similar function, the style will be undefined and throw
      // exception
      if (map?.isStyleLoaded()) {
        if (titleLayerId && map?.getLayer(titleLayerId)) {
          map?.removeLayer(titleLayerId);
        }
      }
    };

    // Must use idle because the map already loaded if this is not
    // the default layer
    map?.once("idle", createLayersOnInit);
    map?.on("styledata", createLayersOnStyleChange);

    // Cleanup function
    return () => {
      map?.once("idle", cleanUp);
    };
  }, [
    config.bbox,
    config.maxZoom,
    config.minZoom,
    config.tileSize,
    isWMSAvailable,
    map,
    sourceLayerId,
    tileUrl,
    titleLayerId,
    visible,
  ]);

  return null;
};

export default GeoServerTileLayer;
