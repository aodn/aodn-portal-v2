import React, {
  FC,
  startTransition,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Box } from "@mui/material";
import { padding } from "@/styles/constants";
import { useDetailPageContext } from "../context/detail-page-context";
import Controls from "../../../components/map/mapbox/controls/Controls";
import NavigationControl from "../../../components/map/mapbox/controls/NavigationControl";
import ScaleControl from "../../../components/map/mapbox/controls/ScaleControl";
import MapBox from "../../../components/map/mapbox/Map";
import Layers from "../../../components/map/mapbox/layers/Layers";
import DrawRect from "../../../components/map/mapbox/controls/menu/DrawRect";
import { LngLatBounds, MapEvent } from "mapbox-gl";
import BaseMapSwitcher from "../../../components/map/mapbox/controls/menu/BaseMapSwitcher";
import MenuControl from "../../../components/map/mapbox/controls/menu/MenuControl";
import DateRange from "../../../components/map/mapbox/controls/menu/DateRange";
import dayjs, { Dayjs } from "dayjs";
import {
  BBoxCondition,
  DateRangeCondition,
  DownloadConditionType,
  DownloadServiceType,
  PolygonCondition,
  SubsettingType,
} from "../context/DownloadDefinitions";
import { isValidPolygonFeature } from "@/utils/GeoJsonUtils";
import { dateDefault } from "@/components/common/constants";
import { Feature, MultiPolygon, Polygon } from "geojson";
import DisplayCoordinate from "../../../components/map/mapbox/controls/DisplayCoordinate";
import GeoServerLayer, {
  Dimension,
} from "../../../components/map/mapbox/layers/GeoServerLayer";
import MapLayerSwitcher, {
  LayerName,
  LayerSwitcherLayer,
} from "../../../components/map/mapbox/controls/menu/MapLayerSwitcher";
import ReferenceLayerSwitcher, {
  staticBaseLayerConfig,
} from "../../../components/map/mapbox/controls/menu/ReferenceLayerSwitcher";
import MenuControlGroup from "../../../components/map/mapbox/controls/menu/MenuControlGroup";
import GeojsonLayer from "../../../components/map/mapbox/layers/GeojsonLayer";
import useBreakpoint from "../../../hooks/useBreakpoint";
import FitToSpatialExtentsLayer from "../../../components/map/mapbox/layers/FitToSpatialExtentsLayer";
import { MapEventEnum } from "@/components/map/mapbox/constants";
import { fitToDefaultExtent } from "@/utils/MapUtils";
import { DateSliderPoint } from "@/components/common/slider/DateSlider";
import { dateToValue } from "@/utils/DateUtils";
import { GeoserverFieldsResponse } from "@/app/store/GeoserverDefinitions";
import * as turf from "@turf/turf";
import { createStaticLayers } from "@/components/map/mapbox/layers/StaticLayer";

import WmsLegend from "./WmsLegend";
import {
  DatasetType,
  OGCCollection,
} from "@/app/store/OGCCollectionDefinitions";
import PMTilesHexLayer from "@/components/map/mapbox/layers/pmtiles/PMTilesLayer";
import {
  metadataRangeToDayjs,
  type PMTilesMetadata,
} from "@/components/map/mapbox/layers/pmtiles/Common";

const mapContainerId = "map-detail-container-id";

// Exported for unit tests
export const buildMapLayerConfig = (
  collection: OGCCollection | null | undefined,
  isWMSAvailable: boolean,
  hasSpatialExtent: boolean,
  isSupportPMTiles: boolean,
  lastSelectedLayer: LayerSwitcherLayer<LayerName> | null = null
): LayerSwitcherLayer<LayerName>[] => {
  const layers: LayerSwitcherLayer<LayerName>[] = [];

  if (collection) {
    const datasetTypes = collection.getDatasetType() ?? [];
    const zarrOnlyDataset =
      datasetTypes.length === 1 && datasetTypes[0] === DatasetType.ZARR;
    // Parquet / mixed CO density is shown via PMTiles.
    const hasCoDensity =
      datasetTypes.includes(DatasetType.PARQUET) ||
      datasetTypes.includes(DatasetType.ZARR);

    const isSupportSpatialExtent =
      hasSpatialExtent &&
      (zarrOnlyDataset ||
        (!isWMSAvailable && !hasCoDensity && !isSupportPMTiles));

    if (isSupportPMTiles) {
      const pmtiles: LayerSwitcherLayer<LayerName> = {
        id: LayerName.PMTiles,
        name: "Data Density",
        selected: true,
      };
      layers.push(pmtiles);
    }

    if (isWMSAvailable) {
      const l: LayerSwitcherLayer<LayerName> = {
        id: LayerName.GeoServer,
        name: "Geoserver",
        selected: !isSupportPMTiles,
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
      layers.forEach((l) => (l.selected = l.id === lastSelectedLayer.id));
    } else if (
      layers.length > 0 &&
      layers.find((l) => l.selected) === undefined
    ) {
      layers[0].selected = true;
    }
  }
  return layers;
};

interface MapPanelProps {
  mapFocusArea?: LngLatBounds;
  onMapMoveEnd?: (evt: MapEvent) => void;
}

const MapPanel: FC<MapPanelProps> = ({ mapFocusArea, onMapMoveEnd }) => {
  const {
    collection,
    downloadConditions,
    getAndSetDownloadConditions,
    lastSelectedMapLayer,
    setLastSelectedMapLayer,
    selectedWmsLayer,
    setSelectedWmsLayer,
    downloadService,
    selectedCoKey,
    setSelectedCoKey,
    isSupportPMTiles,
    setMapSubsettingCapabilities,
    isSubsettingSupported,
  } = useDetailPageContext();

  const [mapLayerConfig, setMapLayerConfig] = useState<
    LayerSwitcherLayer<LayerName>[]
  >([]);
  const [staticLayer, setStaticLayer] = useState<Array<string>>([]);
  const [isWMSAvailable, setIsWMSAvailable] = useState<boolean>(
    collection ? (collection.getWMSLinks()?.length || 0) > 0 : true
  );

  const [_wmsFields, setWMSFields] = useState<GeoserverFieldsResponse[]>([]);
  const [timeSliderSupport, setTimeSliderSupport] = useState<boolean>(false);
  const [drawRectSupport, setDrawRectSupportSupport] = useState<boolean>(false);
  const [discreteTimeSliderValues, setDiscreteTimeSliderValues] = useState<
    Map<string, Array<number>> | undefined
  >(undefined);
  const [datePointValue, setDatePointValue] = useState<number>(
    dateToValue(dayjs(dateDefault.min))
  );
  // Period coverage from the selected parquet's PMTiles `.metadata` sidecar
  const [pmtilesPeriodRange, setPmtilesPeriodRange] =
    useState<PMTilesMetadata | null>(null);
  const { isUnderLaptop } = useBreakpoint();

  const handlePmtilesMetadataPeriodChange = useCallback(
    (range: PMTilesMetadata | null) => {
      setPmtilesPeriodRange(range);
    },
    []
  );

  const selectedMapLayerId = useMemo(
    () => mapLayerConfig.find((m) => m.selected)?.id,
    [mapLayerConfig]
  );

  // A `rel=summary` link means the record has cloud optimised (zarr / parquet)
  // data behind it, which always supports spatial and datetime subsetting
  const hasCloudOptimisedData = useMemo(
    () => collection?.hasCloudOptimisedData() ?? false,
    [collection]
  );

  const [noMapPreview, minDateStamp, maxDateStamp] = useMemo(() => {
    const bbox = collection?.getBBox();
    const hasSpatialExtent = Array.isArray(bbox) && bbox.length > 0;
    const scope = collection?.getScope();
    const isDocumentScope = scope?.toLowerCase() === "document";
    const noMapPreview = isDocumentScope
      ? !hasSpatialExtent
      : downloadService === DownloadServiceType.Unavailable &&
        !hasSpatialExtent &&
        !isWMSAvailable;

    let start: Dayjs;
    let end: Dayjs;

    // PMTiles layer: sidecar periods are ints; convert to Dayjs only for the slider
    const pmtilesDayjs =
      selectedMapLayerId === LayerName.PMTiles && pmtilesPeriodRange
        ? metadataRangeToDayjs(pmtilesPeriodRange)
        : null;

    if (pmtilesDayjs) {
      start = pmtilesDayjs.minDate;
      end = pmtilesDayjs.maxDate;
    } else {
      start = dayjs(dateDefault.min);
      end = dayjs(dateDefault.max);

      const extent = collection?.getExtent();
      if (extent) {
        const [s, e] = extent.getOverallTemporal();
        start = s === undefined ? start : dayjs(s, dateDefault.DISPLAY_FORMAT);
        end = e === undefined ? end : dayjs(e, dateDefault.DISPLAY_FORMAT);
      }
    }

    startTransition(() => {
      setMapLayerConfig(
        buildMapLayerConfig(
          collection,
          isWMSAvailable,
          hasSpatialExtent,
          isSupportPMTiles,
          lastSelectedMapLayer
        )
      );
    });

    return [noMapPreview, start, end];
  }, [
    collection,
    downloadService,
    isWMSAvailable,
    isSupportPMTiles,
    lastSelectedMapLayer,
    selectedMapLayerId,
    pmtilesPeriodRange,
  ]);

  const [filterStartDate, filterEndDate] = useMemo(() => {
    // Only apply stored date range to the map when the selected layer supports time
    if (!isSubsettingSupported(SubsettingType.TimeSlider)) {
      return [undefined, undefined];
    }
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
  }, [downloadConditions, isSubsettingSupported]);

  const drawFeatures = useMemo(() => {
    const existingBboxConditions = downloadConditions.filter(
      (condition) => condition.type === DownloadConditionType.BBOX
    ) as BBoxCondition[];

    const existingPolygonConditions = downloadConditions.filter(
      (condition) => condition.type === DownloadConditionType.POLYGON
    ) as PolygonCondition[];

    const features: Feature<Polygon>[] = [];

    existingBboxConditions.forEach((condition) => {
      const [west, south, east, north] = condition.bbox;
      features.push({
        type: "Feature",
        geometry: {
          type: "Polygon",
          coordinates: [
            [
              [west, north],
              [east, north],
              [east, south],
              [west, south],
              [west, north],
            ],
          ],
        },
        properties: { selectionType: "bbox" },
      });
    });

    existingPolygonConditions.forEach((condition) => {
      const closedCoords = [...condition.coordinates, condition.coordinates[0]];
      features.push({
        type: "Feature",
        geometry: {
          type: "Polygon",
          coordinates: [closedCoords],
        },
        properties: { selectionType: "polygon" },
      });
    });

    return features;
  }, [downloadConditions]);

  const geoServerLayerConfig = useMemo(() => {
    return discreteTimeSliderValues
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
        };
  }, [
    discreteTimeSliderValues,
    datePointValue,
    filterStartDate,
    filterEndDate,
  ]);

  const handleMapChange = useCallback(
    (event: MapEvent | undefined) => {
      event && event.type === MapEventEnum.MOVE_END && onMapMoveEnd?.(event);
    },
    [onMapMoveEnd]
  );

  // Publish live layer/capabilities so download subsetting UI can re-evaluate
  // support independently of when conditions were created.
  useEffect(() => {
    setMapSubsettingCapabilities({
      selectedLayerId: selectedMapLayerId ?? null,
      // undefined metadata → null (unknown); false = timeless PMTiles
      pmtilesHasTime:
        pmtilesPeriodRange == null ? null : pmtilesPeriodRange.hasTime,
      geoServerHasTime: timeSliderSupport,
      geoServerDrawRect: drawRectSupport,
      isSupportPMTiles,
      downloadServiceAvailable:
        downloadService !== DownloadServiceType.Unavailable,
      hasCloudOptimisedData,
    });
  }, [
    selectedMapLayerId,
    pmtilesPeriodRange,
    timeSliderSupport,
    drawRectSupport,
    isSupportPMTiles,
    downloadService,
    hasCloudOptimisedData,
    setMapSubsettingCapabilities,
  ]);

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
      _event: Event | React.SyntheticEvent<Element, Event> | undefined,
      value: number | number[]
    ) => {
      setDatePointValue(value as number);
    },
    []
  );

  const onWMSAvailabilityChange = useCallback((isAvailable: boolean) => {
    setIsWMSAvailable(isAvailable);
  }, []);

  const handleBaseMapSwitch = useCallback(
    (target: EventTarget & HTMLInputElement) =>
      setStaticLayer((values) => {
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

  const handleFeaturesChange = useCallback(
    (
      newFeatures: Feature<Polygon | MultiPolygon>[],
      removeFeature: (id: string) => void
    ) => {
      const bboxConditions: BBoxCondition[] = [];
      const polygonConditions: PolygonCondition[] = [];
      const validFeatures = newFeatures.filter(isValidPolygonFeature);

      validFeatures.forEach((feature) => {
        const id = String(feature.id);
        const selectionType = feature.properties?.selectionType || "bbox";
        const removeCallback = () => removeFeature(id);

        if (selectionType === "polygon") {
          const coords = feature.geometry.coordinates[0];
          if (coords && coords.length >= 4) {
            const vertices =
              coords.length > 1 &&
              coords[0][0] === coords[coords.length - 1][0] &&
              coords[0][1] === coords[coords.length - 1][1]
                ? coords.slice(0, -1)
                : coords;
            polygonConditions.push(
              new PolygonCondition(
                id,
                vertices as [number, number][],
                removeCallback
              )
            );
          }
        } else {
          try {
            const bbox = turf.bbox(feature);
            if (bbox && bbox.every((n) => isFinite(n))) {
              bboxConditions.push(new BBoxCondition(id, bbox, removeCallback));
            }
          } catch (e) {
            console.warn("turf.bbox failed on feature", e, feature);
          }
        }
      });

      getAndSetDownloadConditions(DownloadConditionType.BBOX, bboxConditions);
      getAndSetDownloadConditions(
        DownloadConditionType.POLYGON,
        polygonConditions
      );
    },
    [getAndSetDownloadConditions]
  );

  if (!collection) return null;

  return (
    <>
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
          projection={"mercator"}
          announcement={
            noMapPreview ? "Dataset preview is not available" : undefined
          }
          onMoveEvent={handleMapChange}
          onZoomEvent={handleMapChange}
        >
          <Controls>
            <NavigationControl
              visible={!isUnderLaptop}
              // Reset flies back to this collection's spatial extent
              onReset={(map) => fitToDefaultExtent(map, collection)}
            />
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
                visible={isSubsettingSupported(SubsettingType.TimeSlider)}
                menu={
                  <DateRange
                    // Remount when slider bounds change so thumbs reset to full coverage
                    key={`date-range-${minDateStamp.format(dateDefault.DATE_FORMAT)}-${maxDateStamp.format(dateDefault.DATE_FORMAT)}`}
                    minDate={minDateStamp.format(dateDefault.DATE_FORMAT)}
                    maxDate={maxDateStamp.format(dateDefault.DATE_FORMAT)}
                    getAndSetDownloadConditions={getAndSetDownloadConditions}
                    downloadConditions={downloadConditions}
                    options={
                      discreteTimeSliderValues
                        ? {
                            additionalSlider: (
                              <DateSliderPoint
                                valid_points={discreteTimeSliderValues?.get(
                                  selectedWmsLayer
                                )}
                                onDatePointChange={handleSliderPointChange}
                              />
                            ),
                          }
                        : undefined
                    }
                  />
                }
              />
              <MenuControl
                visible={isSubsettingSupported(SubsettingType.DrawRect)}
                menu={
                  <DrawRect
                    onChangeFeatures={handleFeaturesChange}
                    features={drawFeatures}
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
            {isSupportPMTiles && ( // Avoid fetching S3 when not support PMTiles
              <PMTilesHexLayer
                collection={collection}
                filterStartDate={filterStartDate}
                filterEndDate={filterEndDate}
                visible={selectedMapLayerId === LayerName.PMTiles}
                selectedCoKey={selectedCoKey}
                onSelectCoKey={setSelectedCoKey}
                onMetadataPeriodChange={handlePmtilesMetadataPeriodChange}
              />
            )}
            <GeoServerLayer
              geoServerLayerConfig={geoServerLayerConfig}
              onWMSAvailabilityChange={onWMSAvailabilityChange}
              onWmsLayerChange={onWmsLayerChange}
              setWmsFields={setWMSFields}
              setTimeSliderSupport={setTimeSliderSupport}
              setDiscreteTimeSliderValues={setDiscreteTimeSliderValues}
              setDrawRectSupportSupport={setDrawRectSupportSupport}
              collection={collection}
              visible={selectedMapLayerId === LayerName.GeoServer}
            />
            <GeojsonLayer
              collection={collection}
              visible={selectedMapLayerId === LayerName.SpatialExtent}
            />
          </Layers>
        </MapBox>
      </Box>
      {/* Show the legend exactly when the GeoServer (WMS) layer is the selected
          map layer - same gate as the GeoServerLayer's own `visible` prop */}
      {mapLayerConfig.filter((m) => m?.selected)?.[0]?.id ===
        LayerName.GeoServer && (
        <Box sx={{ mb: 1 }}>
          <WmsLegend uuid={collection.id} layerName={selectedWmsLayer} />
        </Box>
      )}
    </>
  );
};

export default MapPanel;
