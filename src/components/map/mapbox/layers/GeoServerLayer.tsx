import { FC, useContext, useEffect, useMemo, useRef } from "react";
import MapContext from "../MapContext";
import { LayerBasicType } from "./Layers";
import { mergeWithDefaults } from "../../../../utils/ObjectUtils";
import { formatToUrl } from "../../../../utils/UrlUtils";
import { MapDefaultConfig, MapEventEnum } from "../constants";
import { Position } from "geojson";
import { TestHelper } from "../../../common/test/helper";
import { MapMouseEvent, MapMouseEventType, Popup } from "mapbox-gl";
import {
  MapFeatureRequest,
  MapFeatureResponse,
} from "../../../common/store/GeoserverDefinitions";
import { useAppDispatch } from "../../../common/store/hooks";
import { fetchMapFeature } from "../../../common/store/searchReducer";
import { CardContent, Typography } from "@mui/material";
import { createRoot, Root } from "react-dom/client";

interface UrlParams {
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
  QUERY_LAYERS?: string[];
  INFO_FORMAT?: string;
  FEATURE_COUNT?: number;
  BUFFER?: number;
  SRS?: string;
  CRS?: string;
  BBOX?: string;
  WIDTH?: number;
  HEIGHT?: number;
  X?: number;
  Y?: number;
  I?: number;
  J?: number;
}

interface GeoServerLayerConfig {
  urlParams: UrlParams;
  uuid: string;
  baseUrl: string;
  tileSize: number;
  minZoom: number;
  maxZoom: number;
  opacity: number;
  bbox: Position;
}

interface GeoServerLayerProps extends LayerBasicType {
  geoServerLayerConfig?: Partial<GeoServerLayerConfig>;
  onWMSAvailabilityChange?: (isWMSAvailable: boolean) => void;
}

// Example url for mapbox wms resource: "/geowebcache/service/wms?LAYERS=imos%3Aanmn_velocity_timeseries_map&TRANSPARENT=TRUE&VERSION=1.1.1&FORMAT=image%2Fpng&EXCEPTIONS=application%2Fvnd.ogc.se_xml&TILED=true&SERVICE=WMS&REQUEST=GetMap&STYLES=&QUERYABLE=true&SRS=EPSG%3A3857&BBOX={bbox-epsg-3857}&WIDTH=256&HEIGHT=256"

const DEFAULT_WMS_MAP_CONFIG: GeoServerLayerConfig = {
  urlParams: {
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
    // Change the coordinate system from EPSG:4326 to EPSG:3857 (Web Mercator) which is what Mapbox GL expects for WMS tiles.
    // "EPSG:900913" is same as EPSG:3857, just it is an old name
    SRS: "EPSG:900913",
    // Adapt to the Mapbox GL WMS Bbox format
    BBOX: "{bbox-epsg-3857}",
    WIDTH: 256,
    HEIGHT: 256,
  },
  uuid: "",
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

const DEFAULT_NCWMS_MAP_CONFIG: GeoServerLayerConfig = {
  urlParams: {
    LAYERS: [],
    TRANSPARENT: "TRUE",
    VERSION: "1.3.0",
    FORMAT: "image/png",
    EXCEPTIONS: "application/vnd.ogc.se_xml",
    TILED: "true",
    SERVICE: "ncwms",
    REQUEST: "GetMap",
    STYLES: "",
    QUERYABLE: "true",
    //Change the coordinate system from EPSG:4326 to EPSG:3857 (Web Mercator) which is what Mapbox GL expects for WMS tiles.
    CRS: "EPSG:3857",
    // Adapt to the Mapbox GL WMS Bbox format
    // BBOX: `${MapDefaultConfig.BBOX_ENDPOINTS.SOUTH_LAT},${MapDefaultConfig.BBOX_ENDPOINTS.WEST_LON},${MapDefaultConfig.BBOX_ENDPOINTS.NORTH_LAT},${MapDefaultConfig.BBOX_ENDPOINTS.EAST_LON}`,
    // Adapt to the Mapbox GL WMS Bbox format
    BBOX: "{bbox-epsg-3857}",
    WIDTH: 256,
    HEIGHT: 256,
  },
  uuid: "",
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
const applyGeoWebCacheIfPossible = (baseUrl: string, param: UrlParams) => {
  if (baseUrl.includes("geoserver-123.aodn.org.au/geoserver/wms")) {
    // We can rewrite value so that it use internal cache server
    return {
      baseUrl: "/geowebcache/service/wms",
      params: param,
    };
  } else {
    return {
      baseUrl: baseUrl,
      params: param,
    };
  }
};

// Helper functions to generate consistent IDs
const getLayerId = (id: string | undefined) => `${id}-geo-server-layer`;
const getTileSourceId = (layerId: string) => `${layerId}-source`;
const getTileLayerId = (layerId: string) => `${layerId}-tile`;

const checkWMSAvailability = (
  baseUrl: string,
  urlConfig: UrlParams,
  onWMSAvailabilityChange: ((isWMSAvailable: boolean) => void) | undefined
): boolean => {
  // TODO: Implement a proper WMS availability check if needed, e.g., by making a request to the WMS endpoint
  if (urlConfig.LAYERS.length === 0 || baseUrl === "") {
    onWMSAvailabilityChange?.(false);
    return false;
  }
  return true;
};

const GeoServerLayer: FC<GeoServerLayerProps> = ({
  geoServerLayerConfig,
  onWMSAvailabilityChange,
  visible,
}: GeoServerLayerProps) => {
  const { map } = useContext(MapContext);
  const dispatch = useAppDispatch();
  const popupRef = useRef<Popup | null>();
  const popupRootRef = useRef<Root | null>();

  const [titleLayerId, sourceLayerId] = useMemo(() => {
    const layerId = getLayerId(map?.getContainer().id);
    const titleLayerId = getTileLayerId(layerId);
    const sourceLayerId = getTileSourceId(layerId);
    return [titleLayerId, sourceLayerId];
  }, [map]);

  const [config, tileUrl, isWMSAvailable] = useMemo(() => {
    const config = mergeWithDefaults(
      // ncwms is a customise instance by IMOS in the geoserver-123, no cache server
      // is provided in this case.
      geoServerLayerConfig?.baseUrl?.endsWith("ncwms")
        ? DEFAULT_NCWMS_MAP_CONFIG
        : DEFAULT_WMS_MAP_CONFIG,
      geoServerLayerConfig
    );
    // We append cache server URL in front, if layer is not in cache server, it
    // will fall back to the original URL.
    const tileUrl = [
      formatToUrl<UrlParams>(
        applyGeoWebCacheIfPossible(config.baseUrl, config.urlParams)
      ),
      formatToUrl<UrlParams>({
        baseUrl: config.baseUrl,
        params: config.urlParams,
      }),
    ];
    const isWMSAvailable = checkWMSAvailability(
      config.baseUrl,
      config.urlParams,
      onWMSAvailabilityChange
    );
    return [config, tileUrl, isWMSAvailable];
  }, [geoServerLayerConfig, onWMSAvailabilityChange]);

  // Add the tile layer to the map
  useEffect(() => {
    if (map === null || map === undefined) return;

    const createSource = () => {
      if (isWMSAvailable) {
        // Add the WMS source following Mapbox's example
        if (!map?.getSource(sourceLayerId)) {
          map?.addSource(sourceLayerId, {
            type: "raster",
            tiles: tileUrl,
            tileSize: config.tileSize,
            minzoom: config.minZoom,
            maxzoom: config.maxZoom,
          });
        }
      }
    };

    const createLayers = () => {
      // Check WMS availability before adding the layer
      if (isWMSAvailable) {
        // Add the raster layer, do not add any fitBounds here, it makes the map animate strange. Control it at map level
        if (!map?.getLayer(titleLayerId)) {
          map?.addLayer({
            id: titleLayerId,
            type: "raster",
            source: sourceLayerId,
            paint: {
              // This make sure we can see the rect draw by subsetting.
              "raster-opacity": 0.6,
            },
            layout: {
              visibility: "none", // By default invisible
            },
          });
        }
      }
    };

    const createLayersOnStyleChange = () => {
      createSource();
      createLayers();
    };

    const createLayersOnInit = () => {
      if (map?.isStyleLoaded()) {
        createSource();
        createLayers();
      }
    };

    const cleanUp = () => {
      if (map === null || map === undefined) return;
      map?.off(MapEventEnum.STYLEDATA, createLayersOnStyleChange);
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
    map?.once(MapEventEnum.IDLE, createLayersOnInit);
    map?.on(MapEventEnum.STYLEDATA, createLayersOnStyleChange);

    // Cleanup function
    return () => {
      cleanUp();
    };
  }, [
    config.baseUrl,
    config.maxZoom,
    config.minZoom,
    config.tileSize,
    config.urlParams,
    isWMSAvailable,
    map,
    sourceLayerId,
    tileUrl,
    titleLayerId,
  ]);

  useEffect(() => {
    // Create a temporary div for React rendering

    const cleanPopup = () => {
      popupRootRef.current?.unmount();
      popupRootRef.current = null;
      popupRef.current?.remove();
      popupRef.current = null;
    };

    const popupContent = (c: MapFeatureResponse) => {
      return (
        <>
          {c.longitude && c.longitude && (
            <CardContent>
              <Typography component="div" variant="body3Small">
                Latitude: {c.latitude}
              </Typography>
              <Typography component="div" variant="body3Small">
                Longitude: {c.longitude}
              </Typography>
            </CardContent>
          )}
          {c.featureInfo?.map((value, index) => (
            <CardContent key={index}>
              {value.time && (
                <Typography component="div" variant="body3Small">
                  Time: {value.time.toString()}
                </Typography>
              )}
              {value.value && (
                <Typography component="div" variant="body3Small">
                  Value: {value.value}
                </Typography>
              )}
            </CardContent>
          ))}
        </>
      );
    };

    const handlePopup = (event: MapMouseEvent) => {
      if (!map) return;

      const request: MapFeatureRequest = {
        uuid: geoServerLayerConfig?.uuid || "",
        layerName: geoServerLayerConfig?.urlParams?.LAYERS.join(",") || "",
        width: map.getCanvas().width,
        height: map.getCanvas().height,
        // Protocol 1.3.0 use I J instead of X Y
        i: Math.round(event.point.x),
        x: Math.round(event.point.x),
        j: Math.round(event.point.y),
        y: Math.round(event.point.y),
        bbox: map.getBounds()?.toArray().flat().join(","),
      };

      dispatch(fetchMapFeature(request))
        .unwrap()
        .then((response) => {
          cleanPopup();
          if (
            response.featureInfo !== undefined ||
            response.html !== undefined
          ) {
            const popupContainer = document.createElement("div");
            // Some content from server is super long
            popupContainer.style.overflow = "auto";
            popupContainer.style.maxHeight =
              MapDefaultConfig.DEFAULT_POPUP.maxWidth || "300px";

            if (response.html) {
              // The server can return html directly, so we can only use it
              // which restricted our formatting
              popupContainer.innerHTML = response.html;
            } else {
              if (popupRootRef.current === null) {
                popupRootRef.current = createRoot(popupContainer);
              }
              popupRootRef.current?.render(popupContent(response));
            }
            setTimeout(() => {
              // Give time for root render then popup can cal the position
              popupRef.current = new Popup(MapDefaultConfig.DEFAULT_POPUP);
              popupRef.current
                .setLngLat(event.lngLat)
                .setDOMContent(popupContainer)
                .addTo(map);
            }, 100);
          }
        })
        .catch((err) => console.error("Popup:", err));
    };

    if (map) {
      // Given the useEffect run in order, the layer creation is call via MapEventEnum.IDLE
      // so here we need to use MapEventEnum.IDLE too so that it become the next call when
      // IDLE
      map.once(MapEventEnum.IDLE, () => {
        const layer = map?.getLayer(titleLayerId);
        if (layer) {
          const vis = map.getLayoutProperty(titleLayerId, "visibility");
          const targetVis = visible ? "visible" : "none";

          if (vis !== targetVis) {
            // Need update if value diff, this is used to avoid duplicate call to useEffect
            map.setLayoutProperty(
              titleLayerId,
              "visibility",
              visible ? "visible" : "none"
            );

            if (visible) {
              map?.on<MapMouseEventType>(MapEventEnum.CLICK, handlePopup);
            }
          }
        }
      });
    }
    return () => {
      map?.off<MapMouseEventType>(MapEventEnum.CLICK, handlePopup);
      cleanPopup();
    };
  }, [dispatch, geoServerLayerConfig, map, titleLayerId, visible]);

  return (
    <TestHelper
      id={map?.getContainer().id || ""}
      getGeoServerTileLayer={() => titleLayerId}
    />
  );
};

export default GeoServerLayer;
