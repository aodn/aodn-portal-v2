import { FC, useContext, useEffect, useMemo, useRef } from "react";
import MapContext from "../MapContext";
import { LayerBasicType } from "./Layers";
import { mergeWithDefaults } from "../../../../utils/ObjectUtils";
import { formatToUrl } from "../../../../utils/UrlUtils";
import { MapDefaultConfig, MapEventEnum } from "../constants";
import { Position } from "geojson";
import { TestHelper } from "../../../common/test/helper";
import {
  MapMouseEvent,
  MapMouseEventType,
  Popup,
  RasterTileSource,
} from "mapbox-gl";
import {
  MapFeatureRequest,
  MapFeatureResponse,
  MapTileRequest,
} from "../../../common/store/GeoserverDefinitions";
import { useAppDispatch } from "../../../common/store/hooks";
import {
  fetchGeoServerMapFeature,
  fetchGeoServerMapFields,
} from "../../../common/store/searchReducer";
import { CardContent, Typography } from "@mui/material";
import { createRoot, Root } from "react-dom/client";
import dayjs, { Dayjs } from "dayjs";
import { dateDefault } from "../../../common/constants";

interface UrlParams {
  LAYERS: string[];
  BBOX?: string;
  START_DATE?: Dayjs;
  END_DATE?: Dayjs;
  WIDTH?: number;
  HEIGHT?: number;
  X?: number;
  Y?: number;
}

interface GeoServerLayerConfig {
  urlParams: UrlParams;
  uuid: string;
  // baseUrl: string;
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
    // Adapt to the Mapbox GL WMS Bbox format
    BBOX: "{bbox-epsg-3857}",
  },
  uuid: "",
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
const getLayerId = (id: string | undefined) => `${id}-geo-server-layer`;
const getTileSourceId = (layerId: string) => `${layerId}-source`;
const getTileLayerId = (layerId: string) => `${layerId}-tile`;

const checkWMSAvailability = (
  urlConfig: UrlParams,
  onWMSAvailabilityChange: ((isWMSAvailable: boolean) => void) | undefined
): boolean => {
  // Check if LAYERS is undefined, null, empty array, or contains only empty strings
  const hasValidLayers =
    urlConfig.LAYERS &&
    urlConfig.LAYERS.length > 0 &&
    urlConfig.LAYERS.some((layer) => layer && layer.trim() !== "");

  if (!hasValidLayers) {
    onWMSAvailabilityChange?.(false);
    return false;
  }

  onWMSAvailabilityChange?.(true);
  return true;
};

const GeoServerLayer: FC<GeoServerLayerProps> = ({
  geoServerLayerConfig,
  onWMSAvailabilityChange,
  visible,
  setTimeSliderSupport,
}: GeoServerLayerProps) => {
  const { map, setLoading } = useContext(MapContext);
  const dispatch = useAppDispatch();
  const popupRef = useRef<Popup | null>();
  const popupRootRef = useRef<Root | null>();

  const [titleLayerId, sourceLayerId] = useMemo(() => {
    const layerId = getLayerId(map?.getContainer().id);
    const titleLayerId = getTileLayerId(layerId);
    const sourceLayerId = getTileSourceId(layerId);
    return [titleLayerId, sourceLayerId];
  }, [map]);

  const [config, isWMSAvailable] = useMemo(() => {
    const config = mergeWithDefaults(
      DEFAULT_WMS_MAP_CONFIG,
      geoServerLayerConfig
    );

    const isWMSAvailable = checkWMSAvailability(
      config.urlParams,
      onWMSAvailabilityChange
    );
    return [config, isWMSAvailable];
  }, [geoServerLayerConfig, onWMSAvailabilityChange]);

  const tileUrl = useMemo(() => {
    const start =
      geoServerLayerConfig?.urlParams?.START_DATE === undefined
        ? dayjs(dateDefault.min)
        : geoServerLayerConfig?.urlParams?.START_DATE;

    const end =
      geoServerLayerConfig?.urlParams?.END_DATE === undefined
        ? dayjs(dateDefault.max)
        : geoServerLayerConfig?.urlParams?.END_DATE;

    return [
      formatToUrl<MapTileRequest>({
        baseUrl: `/api/v1/ogc/collections/${config.uuid}/items/wms_map_tile`,
        params: {
          layerName: geoServerLayerConfig?.urlParams?.LAYERS.join(",") || "",
          bbox: config?.urlParams?.BBOX,
          datetime: `${start.format(dateDefault.DATE_TIME_FORMAT)}/${end.format(dateDefault.DATE_TIME_FORMAT)}`,
        },
      }),
    ];
  }, [
    config?.urlParams?.BBOX,
    config.uuid,
    geoServerLayerConfig?.urlParams?.END_DATE,
    geoServerLayerConfig?.urlParams?.LAYERS,
    geoServerLayerConfig?.urlParams?.START_DATE,
  ]);

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
    // Update source if tileUrl changed
    if (map?.getSource(sourceLayerId)) {
      const rasterSource = map.getSource(sourceLayerId) as RasterTileSource;
      rasterSource.setTiles(tileUrl);
    }
  }, [map, sourceLayerId, tileUrl]);

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
        x: Math.round(event.point.x),
        y: Math.round(event.point.y),
        bbox: map.getBounds()?.toArray().flat().join(","),
      };

      dispatch(fetchGeoServerMapFeature(request))
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
            popupContainer.style.maxHeight = "300px";

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
              setLoading?.(true);
              map?.on<MapMouseEventType>(MapEventEnum.CLICK, handlePopup);
              // Check if this layer support time slider
              const request: MapFeatureRequest = {
                uuid: geoServerLayerConfig?.uuid || "",
                layerName:
                  geoServerLayerConfig?.urlParams?.LAYERS.join(",") || "",
              };
              dispatch(fetchGeoServerMapFields(request))
                .unwrap()
                .then((value) => {
                  const found = value.find((v) => v.type === "dateTime");
                  setTimeSliderSupport?.(found !== undefined);
                })
                .finally(() => setLoading?.(false));
            }
          }
        }
      });
    }
    return () => {
      map?.off<MapMouseEventType>(MapEventEnum.CLICK, handlePopup);
      cleanPopup();
    };
  }, [
    dispatch,
    geoServerLayerConfig,
    map,
    setLoading,
    setTimeSliderSupport,
    titleLayerId,
    visible,
  ]);

  return (
    <TestHelper
      id={map?.getContainer().id || ""}
      getGeoServerTileLayer={() => titleLayerId}
    />
  );
};

export default GeoServerLayer;
