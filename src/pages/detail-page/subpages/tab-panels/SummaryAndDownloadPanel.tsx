import { FC, useCallback, useEffect, useMemo, useState } from "react";
import { Box, Grid, Stack } from "@mui/material";
import { padding } from "../../../../styles/constants";
import { useDetailPageContext } from "../../context/detail-page-context";
import Controls from "../../../../components/map/mapbox/controls/Controls";
import NavigationControl from "../../../../components/map/mapbox/controls/NavigationControl";
import ScaleControl from "../../../../components/map/mapbox/controls/ScaleControl";
import Map from "../../../../components/map/mapbox/Map";
import Layers, {
  createStaticLayers,
} from "../../../../components/map/mapbox/layers/Layers";
import { StaticLayersDef } from "../../../../components/map/mapbox/layers/StaticLayer";
import { MapboxWorldLayersDef } from "../../../../components/map/mapbox/layers/MapboxWorldLayer";
import ExpandableTextArea from "../../../../components/list/listItem/subitem/ExpandableTextArea";
import DrawRect from "../../../../components/map/mapbox/controls/menu/DrawRect";
import { LngLatBounds, MapEvent } from "mapbox-gl";
import BaseMapSwitcher, {
  BaseMapSwitcherLayer,
} from "../../../../components/map/mapbox/controls/menu/BaseMapSwitcher";
import MenuControl from "../../../../components/map/mapbox/controls/menu/MenuControl";
import DateRange from "../../../../components/map/mapbox/controls/menu/DateRange";
import dayjs, { Dayjs } from "dayjs";
import {
  DateRangeCondition,
  DownloadConditionType,
} from "../../context/DownloadDefinitions";
import { dateDefault } from "../../../../components/common/constants";
import { FeatureCollection, Point, Position } from "geojson";
import DisplayCoordinate from "../../../../components/map/mapbox/controls/DisplayCoordinate";
import HexbinLayer from "../../../../components/map/mapbox/layers/HexbinLayer";
import GeoServerLayer from "../../../../components/map/mapbox/layers/GeoServerLayer";
import MapLayerSwitcher, {
  LayerName,
  LayerSwitcherLayer,
  MapLayers,
} from "../../../../components/map/mapbox/controls/menu/MapLayerSwitcher";
// import { ensureHttps } from "../../../../utils/UrlUtils";
import { MapDefaultConfig } from "../../../../components/map/mapbox/constants";
import {
  DatasetType,
  OGCCollection,
} from "../../../../components/common/store/OGCCollectionDefinitions";
import ReferenceLayerSwitcher from "../../../../components/map/mapbox/controls/menu/ReferenceLayerSwitcher";
import MenuControlGroup from "../../../../components/map/mapbox/controls/menu/MenuControlGroup";
import GeojsonLayer from "../../../../components/map/mapbox/layers/GeojsonLayer";
import DownloadSelect from "../side-cards/download-card/components/DownloadSelect";

const mapContainerId = "map-detail-container-id";

interface SummaryAndDownloadPanelProps {
  bbox?: LngLatBounds;
}

const staticBaseLayerConfig: Array<BaseMapSwitcherLayer> = [
  {
    id: StaticLayersDef.AUSTRALIA_MARINE_PARKS.id,
    name: StaticLayersDef.AUSTRALIA_MARINE_PARKS.name,
    label: StaticLayersDef.AUSTRALIA_MARINE_PARKS.label,
    default: false,
  },
  {
    id: MapboxWorldLayersDef.WORLD.id,
    name: MapboxWorldLayersDef.WORLD.name,
    default: false,
  },
];

const getMinMaxDateStamps = (
  featureCollection?: FeatureCollection<Point>
): [Dayjs, Dayjs] => {
  if (!featureCollection?.features?.length) {
    return [dayjs(dateDefault.min), dayjs(dateDefault.max)];
  }

  let minDate: Dayjs | null = null;
  let maxDate: Dayjs | null = null;

  for (const { properties } of featureCollection.features) {
    const dateStr = properties?.date;
    if (typeof dateStr !== "string") continue;

    const date = dayjs(dateStr);
    if (!date.isValid()) continue;

    if (!minDate || date.isBefore(minDate) || date.isSame(minDate)) {
      minDate = date;
    }
    if (!maxDate || date.isAfter(maxDate) || date.isSame(maxDate)) {
      maxDate = date;
    }
  }

  return [
    minDate && minDate.isValid() ? minDate : dayjs(dateDefault.min),
    maxDate && maxDate.isValid() ? maxDate : dayjs(dateDefault.max),
  ];
};

// const getWMSServer = (collection: OGCCollection | undefined) => {
//   const wmsServers = collection?.getWMSLinks()?.map((link) => link.href);
//   return wmsServers && wmsServers.length > 0 ? wmsServers[0] : "";
// };

// TODO: This should be improved to handle multiple WMS layers and servers if needed.
// const getWMSLayerNames = (collection: OGCCollection | undefined) => {
//   const layerNames = collection?.getWMSLinks()?.map((link) => link.title);
//   return layerNames && layerNames.length > 0 ? layerNames : [];
// };

const overallBoundingBox = (
  collection: OGCCollection | undefined
): Position | undefined => {
  const bbox = collection?.getBBox();
  if (!bbox || !bbox[0] || bbox[0].length !== 4) {
    return [
      MapDefaultConfig.BBOX_ENDPOINTS.WEST_LON,
      MapDefaultConfig.BBOX_ENDPOINTS.SOUTH_LAT,
      MapDefaultConfig.BBOX_ENDPOINTS.EAST_LON,
      MapDefaultConfig.BBOX_ENDPOINTS.NORTH_LAT,
    ];
  }
  return bbox[0];
};

const SummaryAndDownloadPanel: FC<SummaryAndDownloadPanelProps> = ({
  bbox,
}) => {
  const {
    collection,
    featureCollection,
    downloadConditions,
    getAndSetDownloadConditions,
    wmsFields,
    wmsLayers,
    isLoadingWmsLayer,
  } = useDetailPageContext();

  const wmsLayersOptions = useMemo(() => {
    if (!wmsLayers || wmsLayers.length === 0) {
      return [];
    }
    return wmsLayers.map((layer) => ({
      value: layer.name,
      label: layer.title,
    }));
  }, [wmsLayers]);

  // Need to init with null as collection value can be undefined when it entered this component.
  const [selectedLayer, setSelectedLayer] = useState<LayerName | null>(null);
  const [staticLayer, setStaticLayer] = useState<Array<string>>([]);
  const [isWMSAvailable, setIsWMSAvailable] = useState<boolean>(true);
  const [timeSliderSupport, setTimeSliderSupport] = useState<boolean>(true);
  const [selectedWMSLayer, setSelectedWMSLayer] = useState<string>(
    wmsLayersOptions?.[0]?.value || ""
  );

  const abstract = useMemo(
    () => collection?.getEnhancedDescription() || collection?.description || "",
    [collection]
  );

  const hasSummaryFeature = useMemo(
    () => collection?.hasSummaryFeature() || false,
    [collection]
  );

  const hasDownloadService = useMemo(
    () => isWMSAvailable || hasSummaryFeature,
    [hasSummaryFeature, isWMSAvailable]
  );

  const hasSpatialExtent = useMemo(() => !!collection?.getBBox(), [collection]);

  const noMapPreview = useMemo(
    () => !hasDownloadService && !hasSpatialExtent,
    [hasDownloadService, hasSpatialExtent]
  );

  const [minDateStamp, maxDateStamp] = useMemo(() => {
    // We trust the metadata value instead of raw data, in fact it is hard to have a common
    // time value, for example cloud optimized date range may be different from the
    // geoserver one
    let start = dayjs(dateDefault.min);
    let end = dayjs(dateDefault.max);

    const extent = collection?.getExtent();
    if (extent) {
      const [s, e] = extent.getOverallTemporal();
      start = s === undefined ? start : dayjs(s, dateDefault.DISPLAY_FORMAT);
      end = e === undefined ? end : dayjs(e, dateDefault.DISPLAY_FORMAT);
    }
    return [start, end];
  }, [collection]);

  const mapLayerConfig = useMemo((): LayerSwitcherLayer<LayerName>[] => {
    const layers: LayerSwitcherLayer<LayerName>[] = [];

    if (collection) {
      const isZarrDataset: boolean =
        collection.getDatasetType() === DatasetType.ZARR;

      // Only show hexbin layer when the collection has summary feature and it is NOT a zarr dataset
      const isSupportHexbin = hasSummaryFeature && !isZarrDataset;

      // Must be order by Hexbin > GeoServer > Spatial extents
      if (isSupportHexbin) {
        layers.push(MapLayers[LayerName.Hexbin]);
      }

      if (isWMSAvailable) {
        layers.push({
          ...MapLayers[LayerName.GeoServer],
          default: !isSupportHexbin,
        });
      }

      if (hasSummaryFeature && isZarrDataset && hasSpatialExtent) {
        layers.push(MapLayers[LayerName.SpatialExtent]);
      }

      if (!hasDownloadService && hasSpatialExtent) {
        layers.push(MapLayers[LayerName.SpatialExtent]);
      }
    }
    return layers;
  }, [
    collection,
    hasSummaryFeature,
    isWMSAvailable,
    hasSpatialExtent,
    hasDownloadService,
  ]);

  useEffect(() => {
    if (mapLayerConfig.length > 0) {
      // Check if current selection is still valid
      const isCurrentLayerValid = mapLayerConfig.some(
        (layer) => layer.id === selectedLayer
      );

      if (!isCurrentLayerValid || selectedLayer === null) {
        // Find the default layer or use the first one
        const defaultLayer = mapLayerConfig.find((l) => l.default);
        setSelectedLayer(defaultLayer ? defaultLayer.id : mapLayerConfig[0].id);
      }
    }
    // Only depend on mapLayerConfig
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapLayerConfig]);

  const [filterStartDate, filterEndDate] = useMemo(() => {
    const dateRangeConditionGeneric = downloadConditions.find(
      (condition) => condition.type === DownloadConditionType.DATE_RANGE
    );
    if (!dateRangeConditionGeneric) {
      return [undefined, undefined];
    }
    const dateRangeCondition = dateRangeConditionGeneric as DateRangeCondition;

    const conditionStart = dayjs(
      dateRangeCondition.start,
      dateDefault.SIMPLE_DATE_FORMAT
    );
    const conditionEnd = dayjs(
      dateRangeCondition.end,
      dateDefault.SIMPLE_DATE_FORMAT
    );
    return [conditionStart, conditionEnd];
  }, [downloadConditions]);

  const filteredFeatureCollection = useMemo(() => {
    // TODO: In long run should move it to ogcapi
    if (!featureCollection) {
      return undefined;
    }

    if (filterStartDate !== undefined && filterEndDate !== undefined) {
      const filteredFeatures = featureCollection.features?.filter((feature) => {
        const date = dayjs(
          feature.properties?.date,
          dateDefault.SIMPLE_Y_M_DATE_FORMAT
        );
        return date.isAfter(filterStartDate) && date.isBefore(filterEndDate);
      });

      return {
        ...featureCollection,
        features: filteredFeatures,
      };
    } else if (filterStartDate !== undefined) {
      const filteredFeatures = featureCollection.features?.filter((feature) => {
        const date = dayjs(
          feature.properties?.date,
          dateDefault.SIMPLE_Y_M_DATE_FORMAT
        );
        return date.isAfter(filterStartDate);
      });

      return {
        ...featureCollection,
        features: filteredFeatures,
      };
    } else if (filterEndDate !== undefined) {
      const filteredFeatures = featureCollection.features?.filter((feature) => {
        const date = dayjs(
          feature.properties?.date,
          dateDefault.SIMPLE_Y_M_DATE_FORMAT
        );
        return date.isBefore(filterStartDate);
      });

      return {
        ...featureCollection,
        features: filteredFeatures,
      };
    } else {
      return featureCollection;
    }
  }, [featureCollection, filterEndDate, filterStartDate]);

  const handleSelectWMSLayer = useCallback((value: string) => {
    setSelectedWMSLayer(value);
  }, []);

  console.log("wms fields", wmsFields);
  console.log("wms layers", wmsLayers);
  console.log("is loading wms layer", isLoadingWmsLayer);
  console.log("wms layer options", wmsLayersOptions);
  console.log("selected wms layer", selectedWMSLayer);

  useEffect(() => {
    if (wmsLayersOptions && wmsLayersOptions.length > 0) {
      setSelectedWMSLayer(wmsLayersOptions[0].value);
    }
  }, [wmsLayersOptions]);

  const handleMapChange = useCallback((event: MapEvent | undefined) => {
    // implement later
    console.log("Map change event", event);
  }, []);

  const handleGeoLayerChange = useCallback(
    (id: LayerName) =>
      setSelectedLayer((v: LayerName | null) => (v !== id ? id : v)),
    []
  );

  const onWMSAvailabilityChange = useCallback((isWMSAvailable: boolean) => {
    setIsWMSAvailable(isWMSAvailable);
  }, []);

  const handleBaseMapSwitch = useCallback(
    (target: EventTarget & HTMLInputElement) =>
      setStaticLayer((values) => {
        // Remove the item and add it back if selected
        const e = values?.filter((i) => i !== target.value);
        if (target.checked) {
          e.push(target.value);
        }
        return [...e];
      }),
    []
  );

  return (
    collection && (
      <Grid container>
        <Grid item xs={12}>
          <Stack direction="column">
            <ExpandableTextArea text={abstract} showMoreStr={"Show All"} />
            <Box sx={{ visibility: "visible" }}>
              <Box
                arial-label="map"
                id={mapContainerId}
                sx={{
                  width: "100%",
                  minHeight: "550px",
                  marginY: padding.large,
                }}
              >
                <Map
                  bbox={bbox}
                  animate={false}
                  panelId={mapContainerId}
                  projection={"mercator"} // Hexbin support this project or globe only
                  announcement={
                    noMapPreview ? "Map Preview Not Available" : undefined
                  }
                  onMoveEvent={handleMapChange}
                  onZoomEvent={handleMapChange}
                >
                  <Controls>
                    <NavigationControl />
                    <ScaleControl />
                    <DisplayCoordinate />
                    <MenuControlGroup>
                      <MenuControl menu={<BaseMapSwitcher />} />
                      <MenuControl
                        menu={
                          <ReferenceLayerSwitcher
                            layers={staticBaseLayerConfig}
                            onEvent={handleBaseMapSwitch}
                          />
                        }
                      />
                      <MenuControl
                        menu={
                          <MapLayerSwitcher
                            layers={mapLayerConfig}
                            onEvent={handleGeoLayerChange}
                          />
                        }
                        visible={mapLayerConfig.length !== 0}
                      />
                      <MenuControl
                        visible={timeSliderSupport && hasDownloadService}
                        menu={
                          <DateRange
                            minDate={minDateStamp.format(
                              dateDefault.SIMPLE_DATE_FORMAT
                            )}
                            maxDate={maxDateStamp.format(
                              dateDefault.SIMPLE_DATE_FORMAT
                            )}
                            getAndSetDownloadConditions={
                              getAndSetDownloadConditions
                            }
                          />
                        }
                      />
                      <MenuControl
                        visible={hasDownloadService}
                        menu={
                          <DrawRect
                            getAndSetDownloadConditions={
                              getAndSetDownloadConditions
                            }
                          />
                        }
                      />
                    </MenuControlGroup>
                  </Controls>
                  <Layers>
                    {createStaticLayers(staticLayer)}
                    {
                      // Put the first two later here so that they all init the same time
                      // GeoServerLayer is heavy to load, so we can load it
                      // but hide it with visible = false
                    }
                    <HexbinLayer
                      featureCollection={filteredFeatureCollection}
                      visible={selectedLayer === LayerName.Hexbin}
                    />
                    <GeoServerLayer
                      geoServerLayerConfig={{
                        uuid: collection.id,
                        // baseUrl: ensureHttps(getWMSServer(collection)),
                        urlParams: {
                          LAYERS: [selectedWMSLayer],
                          START_DATE: filterStartDate,
                          END_DATE: filterEndDate,
                        },
                      }}
                      onWMSAvailabilityChange={onWMSAvailabilityChange}
                      visible={selectedLayer === LayerName.GeoServer}
                      setTimeSliderSupport={setTimeSliderSupport}
                    />
                    <GeojsonLayer
                      collection={collection}
                      isVisible={selectedLayer === LayerName.SpatialExtent}
                    />
                  </Layers>
                </Map>
              </Box>
            </Box>
            {selectedLayer === LayerName.GeoServer && (
              <DownloadSelect
                items={wmsLayersOptions}
                label="Map Layers"
                value={selectedWMSLayer}
                onSelectCallback={handleSelectWMSLayer}
              />
            )}
          </Stack>
        </Grid>
      </Grid>
    )
  );
};

export { getMinMaxDateStamps, overallBoundingBox };
export default SummaryAndDownloadPanel;
