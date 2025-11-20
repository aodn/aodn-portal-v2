import { FC, useCallback, useMemo, useState } from "react";
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
import { FeatureCollection, Point } from "geojson";
import DisplayCoordinate from "../../../../components/map/mapbox/controls/DisplayCoordinate";
import HexbinLayer from "../../../../components/map/mapbox/layers/HexbinLayer";
import GeoServerLayer from "../../../../components/map/mapbox/layers/GeoServerLayer";
import MapLayerSwitcher, {
  LayerName,
  LayerSwitcherLayer,
  MapLayers,
} from "../../../../components/map/mapbox/controls/menu/MapLayerSwitcher";
import { DatasetType } from "../../../../components/common/store/OGCCollectionDefinitions";
import ReferenceLayerSwitcher from "../../../../components/map/mapbox/controls/menu/ReferenceLayerSwitcher";
import MenuControlGroup from "../../../../components/map/mapbox/controls/menu/MenuControlGroup";
import GeojsonLayer from "../../../../components/map/mapbox/layers/GeojsonLayer";
import useBreakpoint from "../../../../hooks/useBreakpoint";
import FitToSpatialExtentsLayer from "../../../../components/map/mapbox/layers/FitToSpatialExtentsLayer";
import AIGenTag from "../../../../components/info/AIGenTag";
import { MapEventEnum } from "../../../../components/map/mapbox/constants";

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

const SummaryAndDownloadPanel: FC<SummaryAndDownloadPanelProps> = ({
  mapFocusArea,
  onMapMoveEnd,
}) => {
  const {
    collection,
    featureCollection,
    downloadConditions,
    getAndSetDownloadConditions,
    setSelectedWmsLayer,
    lastSelectedMapLayer,
    setLastSelectedMapLayer,
  } = useDetailPageContext();

  // Need to init with null as collection value can be undefined when it entered this component.
  const [staticLayer, setStaticLayer] = useState<Array<string>>([]);
  const [isWMSAvailable, setIsWMSAvailable] = useState<boolean>(true);
  const [timeSliderSupport, setTimeSliderSupport] = useState<boolean>(true);

  const { isUnderLaptop } = useBreakpoint();

  const [
    abstract,
    hasSummaryFeature,
    hasDownloadService,
    hasSpatialExtent,
    isZarrDataset,
    noMapPreview,
    minDateStamp,
    maxDateStamp,
  ] = useMemo(() => {
    const abstract =
      collection?.getEnhancedDescription() || collection?.description || "";
    const hasSummaryFeature = collection?.hasSummaryFeature() || false;
    const hasDownloadService = isWMSAvailable || hasSummaryFeature;
    const hasSpatialExtent = !!collection?.getBBox();
    const isZarrDataset = collection?.getDatasetType() === DatasetType.ZARR;
    const noMapPreview = !hasDownloadService && !hasSpatialExtent;
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

    return [
      abstract,
      hasSummaryFeature,
      hasDownloadService,
      hasSpatialExtent,
      isZarrDataset,
      noMapPreview,
      start,
      end,
    ];
  }, [collection, isWMSAvailable]);

  const enableSubsetting = useMemo(() => {
    const enable =
      (lastSelectedMapLayer === LayerName.GeoServer && timeSliderSupport) ||
      (lastSelectedMapLayer === LayerName.Hexbin && hasSummaryFeature) ||
      (lastSelectedMapLayer === LayerName.SpatialExtent &&
        hasSummaryFeature &&
        isZarrDataset);

    return hasDownloadService && enable;
  }, [
    hasDownloadService,
    hasSummaryFeature,
    isZarrDataset,
    lastSelectedMapLayer,
    timeSliderSupport,
  ]);

  const mapLayerConfig = useMemo((): LayerSwitcherLayer<LayerName>[] => {
    const layers: LayerSwitcherLayer<LayerName>[] = [];

    if (collection) {
      // Only show hexbin layer when the collection has summary feature and it is NOT a zarr dataset
      const isSupportHexbin = hasSummaryFeature && !isZarrDataset;

      // Must be ordered by Hexbin > GeoServer > Spatial extents
      if (isSupportHexbin) {
        layers.push(MapLayers[LayerName.Hexbin]);
        setLastSelectedMapLayer((v) => (v ? v : LayerName.Hexbin));
      }

      if (isWMSAvailable) {
        const l = MapLayers[LayerName.GeoServer];
        layers.push(l);

        setLastSelectedMapLayer((v) => {
          // If layer selected before, we keep it as is and set default iff it is Geoserver
          if (v) {
            l.default = v === LayerName.GeoServer;
            return v;
          } else {
            l.default = !isSupportHexbin;
            return LayerName.GeoServer;
          }
        });
      } else {
        // isWMSAvailable is a delayed value and will update after system query the WMS server
        // so in  case we have set the GeoServer and finally we know that it is WMS is not available
        // we need to reset the value, otherwise the next if block logic will fail.
        setLastSelectedMapLayer((v) => {
          if (v && v === LayerName.GeoServer) {
            return null;
          } else {
            return v;
          }
        });
      }

      if (!isSupportHexbin && hasSpatialExtent) {
        const l = MapLayers[LayerName.SpatialExtent];
        layers.push(l);

        setLastSelectedMapLayer((v) => {
          // If layer selected before, we keep it as is and set default iff it is SpatialExtent
          if (v) {
            l.default = v === LayerName.SpatialExtent;
            return v;
          } else {
            l.default = !isSupportHexbin && !isWMSAvailable;
            return LayerName.SpatialExtent;
          }
        });
      }
    }

    return layers;
  }, [
    collection,
    hasSummaryFeature,
    isZarrDataset,
    isWMSAvailable,
    hasSpatialExtent,
    setLastSelectedMapLayer,
  ]);

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

  const filteredFeatureCollection = useMemo(() => {
    // TODO: In long run should move it to ogcapi
    if (!featureCollection) {
      return undefined;
    }

    if (filterStartDate !== undefined && filterEndDate !== undefined) {
      const filteredFeatures = featureCollection.features?.filter((feature) => {
        const date = dayjs(feature.properties?.date, dateDefault.DATE_FORMAT);
        return date.isAfter(filterStartDate) && date.isBefore(filterEndDate);
      });

      return {
        ...featureCollection,
        features: filteredFeatures,
      };
    } else if (filterStartDate !== undefined) {
      const filteredFeatures = featureCollection.features?.filter((feature) => {
        const date = dayjs(feature.properties?.date, dateDefault.DATE_FORMAT);
        return date.isAfter(filterStartDate);
      });

      return {
        ...featureCollection,
        features: filteredFeatures,
      };
    } else if (filterEndDate !== undefined) {
      const filteredFeatures = featureCollection.features?.filter((feature) => {
        const date = dayjs(feature.properties?.date, dateDefault.DATE_FORMAT);
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

  const handleMapChange = useCallback(
    (event: MapEvent | undefined) => {
      // implement later
      event && event.type === MapEventEnum.MOVE_END && onMapMoveEnd?.(event);
    },
    [onMapMoveEnd]
  );

  const handleMapLayerChange = useCallback(
    (layerName: LayerName) => {
      setLastSelectedMapLayer((prevLayerName: LayerName | null) =>
        prevLayerName !== layerName ? layerName : prevLayerName
      );
    },
    [setLastSelectedMapLayer]
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

  const onWmsLayerChange = useCallback(
    (wmsLayerName: string) => setSelectedWmsLayer(wmsLayerName),
    [setSelectedWmsLayer]
  );

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
                    body: "The summary content of dataset is reformatted by AI models into a better layout.",
                  }}
                />
              </Box>
              <ExpandableTextArea
                text={abstract}
                showMoreStr={"Show All"}
                sx={{ width: isUnderLaptop ? "95%" : "98%" }}
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
              <Map
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
                      visible={enableSubsetting}
                      menu={
                        <DateRange
                          minDate={minDateStamp.format(dateDefault.DATE_FORMAT)}
                          maxDate={maxDateStamp.format(dateDefault.DATE_FORMAT)}
                          getAndSetDownloadConditions={
                            getAndSetDownloadConditions
                          }
                          downloadConditions={downloadConditions}
                        />
                      }
                    />
                    <MenuControl
                      visible={enableSubsetting}
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
                    featureCollection={filteredFeatureCollection}
                    visible={lastSelectedMapLayer === LayerName.Hexbin}
                  />
                  <GeoServerLayer
                    geoServerLayerConfig={{
                      urlParams: {
                        START_DATE: filterStartDate,
                        END_DATE: filterEndDate,
                      },
                    }}
                    onWMSAvailabilityChange={onWMSAvailabilityChange}
                    onWmsLayerChange={onWmsLayerChange}
                    setTimeSliderSupport={setTimeSliderSupport}
                    collection={collection}
                    visible={lastSelectedMapLayer === LayerName.GeoServer}
                  />
                  <GeojsonLayer
                    collection={collection}
                    visible={lastSelectedMapLayer === LayerName.SpatialExtent}
                  />
                </Layers>
              </Map>
            </Box>
          </Stack>
        </Grid>
      </Grid>
    )
  );
};

export { getMinMaxDateStamps };
export default SummaryAndDownloadPanel;
