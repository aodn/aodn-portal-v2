import React, {
  FC,
  startTransition,
  useCallback,
  useMemo,
  useState,
} from "react";
import { Box } from "@mui/material";
import { padding } from "../../../styles/constants";
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
import { dateDefault } from "../../../components/common/constants";
import { Feature, Polygon, MultiPolygon } from "geojson";
import DisplayCoordinate from "../../../components/map/mapbox/controls/DisplayCoordinate";
import HexbinLayer from "../../../components/map/mapbox/layers/HexbinLayer";
import GeoServerLayer, {
  Dimension,
} from "../../../components/map/mapbox/layers/GeoServerLayer";
import MapLayerSwitcher, {
  LayerName,
  LayerSwitcherLayer,
} from "../../../components/map/mapbox/controls/menu/MapLayerSwitcher";
import { DatasetType } from "../../../components/common/store/OGCCollectionDefinitions";
import ReferenceLayerSwitcher, {
  staticBaseLayerConfig,
} from "../../../components/map/mapbox/controls/menu/ReferenceLayerSwitcher";
import MenuControlGroup from "../../../components/map/mapbox/controls/menu/MenuControlGroup";
import GeojsonLayer from "../../../components/map/mapbox/layers/GeojsonLayer";
import useBreakpoint from "../../../hooks/useBreakpoint";
import FitToSpatialExtentsLayer from "../../../components/map/mapbox/layers/FitToSpatialExtentsLayer";
import { MapEventEnum } from "../../../components/map/mapbox/constants";
import { DateSliderPoint } from "../../../components/common/slider/DateSlider";
import { dateToValue } from "../../../utils/DateUtils";
import { GeoserverFieldsResponse } from "../../../components/common/store/GeoserverDefinitions";
import * as turf from "@turf/turf";
import { createStaticLayers } from "../../../components/map/mapbox/layers/StaticLayer";
import {
  buildMapLayerConfig,
  getMinMaxDateStamps,
} from "./SummaryAndDownloadPanel";
import PMTilesHexLayer from "../../../components/map/mapbox/layers/PMTilesLayer";

const mapContainerId = "map-detail-container-id";

interface MapPanelProps {
  mapFocusArea?: LngLatBounds;
  onMapMoveEnd?: (evt: MapEvent) => void;
}

const MapPanel: FC<MapPanelProps> = ({ mapFocusArea, onMapMoveEnd }) => {
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
    selectedCoKey,
    setSelectedCoKey,
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
  const { isUnderLaptop } = useBreakpoint();

  const [hasSummaryFeature, noMapPreview, minDateStamp, maxDateStamp] =
    useMemo(() => {
      const hasSummaryFeature = collection?.hasSummaryFeature() || false;
      const bbox = collection?.getBBox();
      const hasSpatialExtent = Array.isArray(bbox) && bbox.length > 0;
      const isZarrDataset = collection?.getDatasetType() === DatasetType.ZARR;

      const scope = collection?.getScope();
      const isDocumentScope = scope?.toLowerCase() === "document";
      const noMapPreview = isDocumentScope
        ? !hasSpatialExtent
        : downloadService === DownloadServiceType.Unavailable &&
          !hasSpatialExtent &&
          !isWMSAvailable;

      let start: Dayjs;
      let end: Dayjs;

      if (
        downloadService === DownloadServiceType.CloudOptimised &&
        featureCollection?.features?.length
      ) {
        [start, end] = getMinMaxDateStamps(featureCollection);
      } else {
        start = dayjs(dateDefault.min);
        end = dayjs(dateDefault.max);

        const extent = collection?.getExtent();
        if (extent) {
          const [s, e] = extent.getOverallTemporal();
          start =
            s === undefined ? start : dayjs(s, dateDefault.DISPLAY_FORMAT);
          end = e === undefined ? end : dayjs(e, dateDefault.DISPLAY_FORMAT);
        }
      }

      startTransition(() => {
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
      });

      return [hasSummaryFeature, noMapPreview, start, end];
    }, [
      collection,
      downloadService,
      featureCollection,
      isWMSAvailable,
      lastSelectedMapLayer,
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

  const checkSubsettingSupport = useCallback(
    (subsettingType: SubsettingType) => {
      switch (subsettingType) {
        case SubsettingType.TimeSlider:
          return (
            hasSummaryFeature ||
            (mapLayerConfig.filter((m) => m.selected)?.[0]?.id ===
              LayerName.GeoServer &&
              timeSliderSupport)
          );
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

      newFeatures.forEach((feature) => {
        const id = String(feature.id);
        const selectionType = feature.properties?.selectionType || "bbox";
        const removeCallback = () => removeFeature(id);

        if (selectionType === "polygon") {
          const coords = feature.geometry.coordinates[0];
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
        } else {
          const bbox = turf.bbox(feature);
          bboxConditions.push(new BBoxCondition(id, bbox, removeCallback));
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
              visible={checkSubsettingSupport(SubsettingType.TimeSlider)}
              menu={
                <DateRange
                  key="date-range"
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
              visible={checkSubsettingSupport(SubsettingType.DrawRect)}
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
          <PMTilesHexLayer
            collection={collection}
            filterStartDate={filterStartDate}
            filterEndDate={filterEndDate}
            visible={
              mapLayerConfig.filter((m) => m?.selected)?.[0]?.id ===
              LayerName.H3
            }
            selectedCoKey={selectedCoKey}
            onSelectCoKey={setSelectedCoKey}
          />
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
            geoServerLayerConfig={geoServerLayerConfig}
            onWMSAvailabilityChange={onWMSAvailabilityChange}
            onWmsLayerChange={onWmsLayerChange}
            setWmsFields={setWMSFields}
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
  );
};

export default MapPanel;
