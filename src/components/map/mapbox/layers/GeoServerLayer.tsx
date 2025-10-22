import {
  FC,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
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
  MapLayerResponse,
  MapTileRequest,
} from "../../../common/store/GeoserverDefinitions";
import { useAppDispatch } from "../../../common/store/hooks";
import {
  fetchGeoServerMapFeature,
  fetchGeoServerMapFields,
  fetchGeoServerMapLayers,
} from "../../../common/store/searchReducer";
import { CardContent, Typography } from "@mui/material";
import { createRoot, Root } from "react-dom/client";
import dayjs, { Dayjs } from "dayjs";
import { dateDefault } from "../../../common/constants";
import GeoserverLayerSelect from "../component/GeoserverLayerSelect";
import {
  ILink,
  OGCCollection,
} from "../../../common/store/OGCCollectionDefinitions";
import { ErrorResponse } from "../../../../utils/ErrorBoundary";
import { SelectItem } from "../../../common/dropdown/CommonSelect";

interface UrlParams {
  LAYERS?: string[];
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
  tileSize: number;
  minZoom: number;
  maxZoom: number;
  opacity: number;
  bbox: Position;
}

interface GeoServerLayerProps extends LayerBasicType {
  geoServerLayerConfig?: Partial<GeoServerLayerConfig>;
  onWMSAvailabilityChange?: (isWMSAvailable: boolean) => void;
  onWmsLayerChange?: (wmsLayerName: string) => void;
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
  onWMSNotAvailable: () => void,
  onWMSAvailabilityChange: ((isWMSAvailable: boolean) => void) | undefined
): boolean => {
  // Check if LAYERS is undefined, null, empty array, or contains only empty strings
  const hasValidLayers =
    urlConfig.LAYERS &&
    urlConfig.LAYERS.length > 0 &&
    urlConfig.LAYERS.some((layer) => layer && layer.trim() !== "");

  if (!hasValidLayers) {
    onWMSAvailabilityChange?.(false);
    onWMSNotAvailable();
    return false;
  }

  onWMSAvailabilityChange?.(true);
  return true;
};

const getWmsLayerNames = (collection: OGCCollection | undefined) => {
  const layerNames = collection?.getWMSLinks()?.map((link) => link.title);
  return layerNames && layerNames.length > 0 ? layerNames : [];
};

const formWmsLayerOptions = (
  layers: MapLayerResponse[] | undefined
): SelectItem[] => {
  if (!layers || layers.length === 0) return [];
  return layers.map((layer) => ({
    value: layer.name,
    label: layer.title,
  }));
};

const formWmsLinkOptions = (layers: ILink[] | undefined): SelectItem[] => {
  if (!layers || layers.length === 0) return [];
  return layers?.map((layer) => ({
    value: layer.title,
    label: layer.title, // Use title for label for now. Could be changed to ai:label in future
  }));
};

const GeoServerLayer: FC<GeoServerLayerProps> = ({
  geoServerLayerConfig,
  visible,
  collection,
  onWMSAvailabilityChange,
  onWmsLayerChange,
  setTimeSliderSupport,
}: GeoServerLayerProps) => {
  const { map, setLoading: setMapLoading } = useContext(MapContext);
  const dispatch = useAppDispatch();
  const popupRef = useRef<Popup | null>();
  const popupRootRef = useRef<Root | null>();
  const [isFetchingWmsLayers, setIsFetchingWmsLayers] = useState(false);
  const [wmsLayers, setWmsLayers] = useState<SelectItem<string>[]>([]);
  const [selectedWmsLayer, setSelectedWmsLayer] = useState<string>(""); // Only handle single wms layer for now. Could be extended to multi-layer in multi-select in future

  const [titleLayerId, sourceLayerId] = useMemo(() => {
    const layerId = getLayerId(map?.getContainer().id);
    const titleLayerId = getTileLayerId(layerId);
    const sourceLayerId = getTileSourceId(layerId);
    return [titleLayerId, sourceLayerId];
  }, [map]);

  const [config, isWMSAvailable] = useMemo(() => {
    const updateConfig = mergeWithDefaults(geoServerLayerConfig || {}, {
      uuid: collection?.id,
      urlParams: { LAYERS: [selectedWmsLayer] },
    });
    const config = mergeWithDefaults(DEFAULT_WMS_MAP_CONFIG, updateConfig);

    const isWMSAvailable = checkWMSAvailability(
      config.urlParams,
      () => setIsFetchingWmsLayers(false),
      onWMSAvailabilityChange
    );
    return [config, isWMSAvailable];
  }, [
    collection,
    geoServerLayerConfig,
    onWMSAvailabilityChange,
    selectedWmsLayer,
  ]);

  const tileUrl = useMemo(() => {
    const start =
      config.urlParams.START_DATE === undefined
        ? dayjs(dateDefault.min)
        : config.urlParams.START_DATE;

    const end =
      config.urlParams.END_DATE === undefined
        ? dayjs(dateDefault.max)
        : config.urlParams.END_DATE;

    return [
      formatToUrl<MapTileRequest>({
        baseUrl: `/api/v1/ogc/collections/${config.uuid}/items/wms_map_tile`,
        params: {
          layerName: config.urlParams.LAYERS?.join(",") || "",
          bbox: config?.urlParams?.BBOX,
          datetime: `${start.format(dateDefault.DATE_TIME_FORMAT)}/${end.format(dateDefault.DATE_TIME_FORMAT)}`,
        },
      }),
    ];
  }, [
    config.urlParams?.BBOX,
    config.urlParams.END_DATE,
    config.urlParams.LAYERS,
    config.urlParams.START_DATE,
    config.uuid,
  ]);

  const handleWmsLayerChange = useCallback(
    (value: string) => {
      setSelectedWmsLayer(value);
      onWmsLayerChange?.(value);
    },
    [onWmsLayerChange]
  );

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
        uuid: config.uuid || "",
        layerName: config.urlParams.LAYERS?.join(",") || "",
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
              setMapLoading?.(true);
              map?.on<MapMouseEventType>(MapEventEnum.CLICK, handlePopup);
              const layerName = config.urlParams.LAYERS?.join(",") || "";

              // Check time slider support - only fetch fields if we have a valid layer name
              if (layerName && layerName.trim() !== "") {
                const request: MapFeatureRequest = {
                  uuid: config.uuid || "",
                  layerName: layerName,
                };
                dispatch(fetchGeoServerMapFields(request))
                  .unwrap()
                  .then((value) => {
                    const found = value.find((v) => v.type === "dateTime");
                    setTimeSliderSupport?.(found !== undefined);
                  })
                  .finally(() => setMapLoading?.(false));
              } else {
                // If no valid layer name, just set loading to false and assume no time slider support
                setTimeSliderSupport?.(false);
                setMapLoading?.(false);
              }
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
    config.urlParams.LAYERS,
    config.uuid,
    dispatch,
    map,
    setMapLoading,
    setTimeSliderSupport,
    titleLayerId,
    visible,
  ]);

  // call wms_download_fields first to get wms selector fields
  // if it doesn't work that means the wms link is invalid (invalid server url or layerName)
  // in this case we will call wms_layers to get all the possible layers
  // once get the all the layers we will use the correct layerName to for wms_download_fields, wms_map_tile and wms_map_feature
  useEffect(() => {
    if (!collection || isFetchingWmsLayers) return;

    setIsFetchingWmsLayers(true);
    setMapLoading?.(true);

    const wmsLinksOptions = formWmsLinkOptions(collection?.getWMSLinks());
    if (wmsLinksOptions && wmsLinksOptions.length > 0) {
      handleWmsLayerChange(wmsLinksOptions[0].value);
      setWmsLayers(wmsLinksOptions);
    }

    const layerName = getWmsLayerNames(collection)?.[0] || "";

    const wmsFieldsRequest: MapFeatureRequest = {
      uuid: collection.id,
      layerName: layerName,
    };

    dispatch(fetchGeoServerMapFields(wmsFieldsRequest))
      .unwrap()
      .then(() => {
        // Successfully fetched fields, loading is complete
        setIsFetchingWmsLayers(false);
      })
      .catch((error: ErrorResponse) => {
        // For now only catch 404 error for further fetching layers
        // TODO: we could fetch layers even there is no error to find all wms layers that support wfs download
        if (error.statusCode === 404) {
          const wmsLayersRequest: MapFeatureRequest = {
            uuid: collection.id,
          };

          dispatch(fetchGeoServerMapLayers(wmsLayersRequest))
            .unwrap()
            .then((layers) => {
              if (layers && layers.length > 0) {
                handleWmsLayerChange(
                  formWmsLayerOptions(layers)[0].value || ""
                );
                setWmsLayers(formWmsLayerOptions(layers));
                setIsFetchingWmsLayers(false);
              }
            })
            .catch((error) => {
              console.log("Failed to fetch layers, ok to ignore", error);
              setIsFetchingWmsLayers(false);
            });
        } else {
          console.log("Failed to fetch fields, ok to ignore", error);
        }
      })
      .finally(() => {
        setMapLoading?.(false);
      });
    // Only listen to collection change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, collection]);

  return (
    <>
      {visible && (
        <GeoserverLayerSelect
          wmsLayersOptions={wmsLayers}
          selectedWMSLayer={selectedWmsLayer}
          handleSelectWMSLayer={(value: string) => handleWmsLayerChange(value)}
          isLoading={isFetchingWmsLayers}
        />
      )}

      <TestHelper
        id={map?.getContainer().id || ""}
        getGeoServerTileLayer={() => titleLayerId}
      />
    </>
  );
};

export default GeoServerLayer;
