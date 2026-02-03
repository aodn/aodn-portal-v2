import React, { FC, useCallback, useEffect, useMemo, useState } from "react";
import { Box, Grid, Stack } from "@mui/material";
import { padding } from "../../../../styles/constants";
import { useDetailPageContext } from "../../context/detail-page-context";
import Controls from "../../../../components/map/mapbox/controls/Controls";
import NavigationControl from "../../../../components/map/mapbox/controls/NavigationControl";
import ScaleControl from "../../../../components/map/mapbox/controls/ScaleControl";
import MapBox from "../../../../components/map/mapbox/Map";
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
  DownloadServiceType,
  SubsettingType,
} from "../../context/DownloadDefinitions";
import { dateDefault } from "../../../../components/common/constants";
import { FeatureCollection, Point } from "geojson";
import DisplayCoordinate from "../../../../components/map/mapbox/controls/DisplayCoordinate";
import HexbinLayer from "../../../../components/map/mapbox/layers/HexbinLayer";
import GeoServerLayer, {
  Dimension,
} from "../../../../components/map/mapbox/layers/GeoServerLayer";
import MapLayerSwitcher, {
  LayerName,
  LayerSwitcherLayer,
} from "../../../../components/map/mapbox/controls/menu/MapLayerSwitcher";
import {
  DatasetType,
  OGCCollection,
} from "../../../../components/common/store/OGCCollectionDefinitions";
import ReferenceLayerSwitcher from "../../../../components/map/mapbox/controls/menu/ReferenceLayerSwitcher";
import MenuControlGroup from "../../../../components/map/mapbox/controls/menu/MenuControlGroup";
import GeojsonLayer from "../../../../components/map/mapbox/layers/GeojsonLayer";
import useBreakpoint from "../../../../hooks/useBreakpoint";
import FitToSpatialExtentsLayer from "../../../../components/map/mapbox/layers/FitToSpatialExtentsLayer";
import AIGenTag from "../../../../components/info/AIGenTag";
import { MapEventEnum } from "../../../../components/map/mapbox/constants";
import { DateSliderPoint } from "../../../../components/common/slider/DateSlider";
import { dateToValue } from "../../../../utils/DateUtils";
import { portalTheme } from "../../../../styles";

const mapContainerId = "map-detail-container-id";

interface SummaryAndDownloadPanelProps {
  mapFocusArea?: LngLatBounds;
  onMapMoveEnd?: (evt: MapEvent) => void;
}

const staticBaseLayerConfig: Array<BaseMapSwitcherLayer> = [
  {
    id: StaticLayersDef.AUSTRALIA_MARINE_PARKS.id,
    name: StaticLayersDef.AUSTRALIA_MARINE_PARKS.name,
    label: StaticLayersDef.AUSTRALIA_MARINE_PARKS.label,
    default: false,
  },
  {
    id: StaticLayersDef.MEOW.id,
    name: StaticLayersDef.MEOW.name,
    label: StaticLayersDef.MEOW.label,
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

// We want to vitest this easier
export const buildMapLayerConfig = (
  collection: OGCCollection | null | undefined,
  hasSummaryFeature: boolean,
  isZarrDataset: boolean,
  isWMSAvailable: boolean,
  hasSpatialExtent: boolean,
  lastSelectedLayer: LayerSwitcherLayer<LayerName> | null = null
): LayerSwitcherLayer<LayerName>[] => {
  const layers: LayerSwitcherLayer<LayerName>[] = [];

  if (collection) {
    // Only show hexbin layer when the collection has summary feature and it is NOT a zarr dataset
    const isSupportHexbin = hasSummaryFeature && !isZarrDataset;

    // Show spatial extent layer when
    // 1. it is a zarr dataset
    // 2. or no geoserver layer nor hexbin layer
    const isSupportSpatialExtent =
      hasSpatialExtent &&
      ((hasSummaryFeature && isZarrDataset) ||
        (!isWMSAvailable && !isSupportHexbin));

    // Must be ordered by Hexbin > GeoServer > Spatial extents
    if (isSupportHexbin) {
      const l: LayerSwitcherLayer<LayerName> = {
        id: LayerName.Hexbin,
        name: "Hex Grid",
        selected: true,
      };
      layers.push(l);
    }

    if (isWMSAvailable) {
      const l: LayerSwitcherLayer<LayerName> = {
        id: LayerName.GeoServer,
        name: "Geoserver",
        // If hexbin is supported, then geoserver is not default
        selected: !isSupportHexbin,
      };
      layers.push(l);
    }

    if (isSupportSpatialExtent) {
      const l: LayerSwitcherLayer<LayerName> = {
        id: LayerName.SpatialExtent,
        name: "Spatial Extent",
        selected: false,
      };
      layers.push(l);
    }

    if (lastSelectedLayer) {
      // Check if we have last selected layer, if yes, select it, otherwise select the first one
      layers.forEach((l) => (l.selected = l.id === lastSelectedLayer.id));
    } else if (
      layers.length > 0 &&
      layers.find((l) => l.selected) === undefined
    ) {
      // If non of the layer is set to selected, select the first one
      layers[0].selected = true;
    }
  }
  return layers;
};

const SummaryAndDownloadPanel: FC<SummaryAndDownloadPanelProps> = ({
  mapFocusArea,
  onMapMoveEnd,
}) => {
  const {
    collection,
    featureCollection,
    downloadConditions,
    getAndSetDownloadConditions,
    lastSelectedMapLayer,
    setLastSelectedMapLayer,
    selectedWmsLayer,
    setSelectedWmsLayer,
    downloadService,
    setDownloadService,
    selectedCoKey,
    setSelectedCoKey,
  } = useDetailPageContext();

  // Need to init with null as collection value can be undefined when it entered this component.
  const [mapLayerConfig, setMapLayerConfig] = useState<
    LayerSwitcherLayer<LayerName>[]
  >([]);
  const [staticLayer, setStaticLayer] = useState<Array<string>>([]);
  const [isWMSAvailable, setIsWMSAvailable] = useState<boolean>(true);
  const [timeSliderSupport, setTimeSliderSupport] = useState<boolean>(false);
  const [discreteTimeSliderValues, setDiscreteTimeSliderValues] = useState<
    Map<string, Array<number>> | undefined
  >(undefined);
  const [datePointValue, setDatePointValue] = useState<number>(
    dateToValue(dayjs(dateDefault.min))
  );
  const [drawRectSupport, setDrawRectSupportSupport] = useState<boolean>(false);
  const { isUnderLaptop } = useBreakpoint();

  const [
    abstract,
    hasSummaryFeature,
    noMapPreview,
    minDateStamp,
    maxDateStamp,
  ] = useMemo(() => {
    const abstract =
      collection?.getEnhancedDescription() || collection?.description || "";
    const hasSummaryFeature = collection?.hasSummaryFeature() || false;
    const bbox = collection?.getBBox();
    const hasSpatialExtent = Array.isArray(bbox) && bbox.length > 0;
    const isZarrDataset = collection?.getDatasetType() === DatasetType.ZARR;

    const scope = collection?.getScope();
    const isDocumentScope = scope?.toLowerCase() === "document";
    const noMapPreview =
      downloadService === DownloadServiceType.Unavailable &&
      !hasSpatialExtent &&
      !isWMSAvailable &&
      isDocumentScope;
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

    setMapLayerConfig(
      buildMapLayerConfig(
        collection,
        hasSummaryFeature,
        isZarrDataset,
        isWMSAvailable,
        hasSpatialExtent,
        lastSelectedMapLayer
      )
    );
    return [abstract, hasSummaryFeature, noMapPreview, start, end];
  }, [collection, downloadService, isWMSAvailable, lastSelectedMapLayer]);

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
      dateDefault.DATE_FORMAT
    );
    const conditionEnd = dayjs(dateRangeCondition.end, dateDefault.DATE_FORMAT);
    return [conditionStart, conditionEnd];
  }, [downloadConditions]);

  const handleMapChange = useCallback(
    (event: MapEvent | undefined) => {
      // implement later
      event && event.type === MapEventEnum.MOVE_END && onMapMoveEnd?.(event);
    },
    [onMapMoveEnd]
  );

  const checkSubsettingSupport = useCallback(
    (subsettingType: SubsettingType) => {
      switch (subsettingType) {
        // Time slider support when
        // 1. CO download is available
        // 2. or the in geoserver and it supports time slider
        case SubsettingType.TimeSlider:
          return (
            hasSummaryFeature ||
            (mapLayerConfig.filter((m) => m.selected)?.[0]?.id ===
              LayerName.GeoServer &&
              timeSliderSupport)
          );

        // Draw rect support when
        // 1. CO download is available
        // 2. or the in geoserver and it supports draw rect
        // Also the download service must be available
        case SubsettingType.DrawRect:
          return (
            (hasSummaryFeature ||
              (mapLayerConfig.filter((m) => m.selected)?.[0]?.id ===
                LayerName.GeoServer &&
                drawRectSupport)) &&
            downloadService !== DownloadServiceType.Unavailable
          );
        default:
          return false;
      }
    },
    [
      hasSummaryFeature,
      mapLayerConfig,
      timeSliderSupport,
      drawRectSupport,
      downloadService,
    ]
  );

  const handleMapLayerChange = useCallback(
    (layer: LayerSwitcherLayer<LayerName>) => {
      layer.selected = true;
      setLastSelectedMapLayer(layer);
      setMapLayerConfig((prevLayers: LayerSwitcherLayer<LayerName>[]) => {
        const layers = [...prevLayers];
        layers.forEach((l) => (l.selected = l.id === layer.id));
        return layers;
      });
    },
    [setLastSelectedMapLayer]
  );

  const handleSliderPointChange = useCallback(
    (
      event: Event | React.SyntheticEvent<Element, Event> | undefined,
      value: number | number[]
    ) => {
      setDatePointValue(value as number);
    },
    []
  );

  const onWMSAvailabilityChange = useCallback((isWMSAvailable: boolean) => {
    setIsWMSAvailable(isWMSAvailable);
  }, []);

  const onWFSAvailabilityChange = useCallback(
    (isWFSAvailable: boolean) => {
      // Strong preference on cloud optimized data, if collection have it
      // then always use it regardless of what WFS told us.
      setDownloadService((type) => {
        if (type !== DownloadServiceType.CloudOptimised) {
          return isWFSAvailable
            ? DownloadServiceType.WFS
            : DownloadServiceType.Unavailable;
        } else {
          return type;
        }
      });
    },
    [setDownloadService]
  );

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

  const onWmsLayerChange = useCallback(
    (wmsLayerName: string) => setSelectedWmsLayer(wmsLayerName),
    [setSelectedWmsLayer]
  );

  useEffect(() => {
    // Set the type of download based on simple  in collection, the value
    // may change by callback if more info available
    const wfsLinks = collection?.getWFSLinks() || [];
    if (hasSummaryFeature) {
      setDownloadService(DownloadServiceType.CloudOptimised);
    } else if (wfsLinks.length > 0) {
      setDownloadService(DownloadServiceType.WFS);
    } else {
      setDownloadService(DownloadServiceType.Unavailable);
    }
  }, [collection, hasSummaryFeature, setDownloadService]);

  return (
    collection && (
      <Grid container>
        <Grid item xs={12}>
          <Stack direction="column">
            <Stack position="relative" direction={"row"}>
              <Box position="absolute" top={-6} right={-6}>
                <AIGenTag
                  infoContent={{
                    title: "Content reformatted",
                    body: "The abstract content of metadata is reformatted by AI models into a better layout.",
                  }}
                />
              </Box>
              <ExpandableTextArea
                text={abstract}
                showMoreStr={"Show All"}
                sx={{
                  width: isUnderLaptop ? "95%" : "98%",
                  "& button": {
                    fontSize: "16px",
                    color: portalTheme.palette.text1,
                    lineHeight: "24px",
                  },
                }}
              />
            </Stack>
            <Box
              arial-label="map"
              id={mapContainerId}
              sx={{
                width: "100%",
                minHeight: "550px",
                marginY: padding.large,
              }}
            >
              <MapBox
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
                  <NavigationControl visible={!isUnderLaptop} />
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
                          onEvent={handleMapLayerChange}
                        />
                      }
                      visible={mapLayerConfig.length !== 0}
                    />
                    <MenuControl
                      visible={checkSubsettingSupport(
                        SubsettingType.TimeSlider
                      )}
                      menu={
                        <DateRange
                          key="date-range"
                          minDate={minDateStamp.format(dateDefault.DATE_FORMAT)}
                          maxDate={maxDateStamp.format(dateDefault.DATE_FORMAT)}
                          getAndSetDownloadConditions={
                            getAndSetDownloadConditions
                          }
                          downloadConditions={downloadConditions}
                          options={
                            discreteTimeSliderValues
                              ? {
                                  additionalSlider: (
                                    <DateSliderPoint
                                      valid_points={discreteTimeSliderValues?.get(
                                        selectedWmsLayer
                                      )}
                                      onDatePointChange={
                                        handleSliderPointChange
                                      }
                                    />
                                  ),
                                }
                              : undefined
                          }
                        />
                      }
                    />
                    <MenuControl
                      visible={checkSubsettingSupport(SubsettingType.DrawRect)}
                      menu={
                        <DrawRect
                          getAndSetDownloadConditions={
                            getAndSetDownloadConditions
                          }
                          downloadConditions={downloadConditions}
                        />
                      }
                    />
                  </MenuControlGroup>
                </Controls>
                <Layers>
                  <FitToSpatialExtentsLayer
                    collection={collection}
                    bbox={mapFocusArea}
                  />
                  {createStaticLayers(staticLayer)}
                  {
                    // Put the first two later here so that they all init the same time
                    // GeoServerLayer is heavy to load, so we can load it
                    // but hide it with visible = false
                  }
                  <HexbinLayer
                    featureCollection={featureCollection}
                    filterStartDate={filterStartDate}
                    filterEndDate={filterEndDate}
                    visible={
                      mapLayerConfig.filter((m) => m?.selected)?.[0]?.id ===
                      LayerName.Hexbin
                    }
                    selectedCoKey={selectedCoKey}
                    onSelectCoKey={setSelectedCoKey}
                  />
                  <GeoServerLayer
                    geoServerLayerConfig={
                      // This value appears only if this dataset layer support single time
                      // move, NOT range
                      discreteTimeSliderValues
                        ? {
                            urlParams: {
                              TIME: dayjs.utc(datePointValue!),
                              MODE: Dimension.SINGLE,
                            },
                          }
                        : {
                            urlParams: {
                              START_DATE: filterStartDate,
                              END_DATE: filterEndDate,
                            },
                          }
                    }
                    onWMSAvailabilityChange={onWMSAvailabilityChange}
                    onWFSAvailabilityChange={onWFSAvailabilityChange}
                    onWmsLayerChange={onWmsLayerChange}
                    setTimeSliderSupport={setTimeSliderSupport}
                    setDiscreteTimeSliderValues={setDiscreteTimeSliderValues}
                    setDrawRectSupportSupport={setDrawRectSupportSupport}
                    collection={collection}
                    visible={
                      mapLayerConfig.filter((m) => m?.selected)?.[0]?.id ===
                      LayerName.GeoServer
                    }
                  />
                  <GeojsonLayer
                    collection={collection}
                    visible={
                      mapLayerConfig.filter((m) => m?.selected)?.[0]?.id ===
                      LayerName.SpatialExtent
                    }
                  />
                </Layers>
              </MapBox>
            </Box>
          </Stack>
        </Grid>
      </Grid>
    )
  );
};

export { getMinMaxDateStamps };
export default SummaryAndDownloadPanel;
