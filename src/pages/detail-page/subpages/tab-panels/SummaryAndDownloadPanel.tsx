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
import { FeatureCollection, Point, Position } from "geojson";
import DisplayCoordinate from "../../../../components/map/mapbox/controls/DisplayCoordinate";
import HexbinLayer from "../../../../components/map/mapbox/layers/HexbinLayer";
import GeoServerTileLayer from "../../../../components/map/mapbox/layers/GeoServerTileLayer";
import MapLayerSwitcher, {
  LayerName,
  LayerSwitcherLayer,
  MapLayers,
} from "../../../../components/map/mapbox/controls/menu/MapLayerSwitcher";
import { ensureHttps } from "../../../../utils/UrlUtils";
import { MapDefaultConfig } from "../../../../components/map/mapbox/constants";
import { OGCCollection } from "../../../../components/common/store/OGCCollectionDefinitions";
import ReferenceLayerSwitcher from "../../../../components/map/mapbox/controls/menu/ReferenceLayerSwitcher";
import MenuControlGroup from "../../../../components/map/mapbox/controls/menu/MenuControlGroup";

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

// As WMSServer may be an array if there are multiple wms links, for now we only use the first one.
// TODO: This should be improved to handle multiple WMS layers and servers if needed.
const getWMSServer = (collection: OGCCollection | undefined) => {
  const dataAccessLinks = collection?.getDataAccessLinks();
  if (!dataAccessLinks || dataAccessLinks.length === 0) {
    return [];
  }
  return dataAccessLinks
    .filter((link) => link.rel === "wms" && link.href)
    .map((link) => link.href);
};

const getWMSLayerNames = (collection: OGCCollection | undefined) => {
  const DataAccessLinks = collection?.getDataAccessLinks();
  if (!DataAccessLinks || DataAccessLinks.length === 0) {
    return [];
  }
  return DataAccessLinks.filter((link) => link.rel === "wms" && link.title).map(
    (link) => link.title
  );
};

const overallBoundingBox = (
  collection: OGCCollection | undefined
): Position | undefined => {
  const bbox = collection?.extent?.bbox;
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
  } = useDetailPageContext();

  // Need to init with null as collection value can be undefined when it entered this component.
  const [selectedLayer, setSelectedLayer] = useState<LayerName | null>(null);
  const [staticLayer, setStaticLayer] = useState<Array<string>>([]);
  const [isWMSAvailable, setIsWMSAvailable] = useState<boolean>(true);
  const [minDateStamp, maxDateStamp] = getMinMaxDateStamps(featureCollection);
  const abstract =
    collection?.getEnhancedDescription() || collection?.description || "";

  const mapLayerConfig = useMemo((): LayerSwitcherLayer<LayerName>[] => {
    const layers: LayerSwitcherLayer<LayerName>[] = [];

    if (collection) {
      const isSupportHexbin = collection?.hasSummaryFeature() === true;
      if (isSupportHexbin) {
        layers.push(MapLayers[LayerName.Hexbin]);
      }

      layers.push({
        ...MapLayers[LayerName.GeoServer],
        default: !isSupportHexbin,
      });

      // Init the layer with values here taking the default
      setSelectedLayer((v: LayerName | null): LayerName | null => {
        if (v) {
          return v;
        } else {
          // Not init before, make it the same as the default value of this config
          const layer: LayerSwitcherLayer<LayerName> | undefined = layers.find(
            (l) => l.default
          );
          return layer != null ? layer.id : null;
        }
      });
    }
    return layers;
  }, [collection]);

  const filteredFeatureCollection = useMemo(() => {
    if (!featureCollection) {
      return undefined;
    }

    const dateRangeConditionGeneric = downloadConditions.find(
      (condition) => condition.type === DownloadConditionType.DATE_RANGE
    );
    if (!dateRangeConditionGeneric) {
      return featureCollection;
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

    const filteredFeatures = featureCollection.features?.filter((feature) => {
      const date = dayjs(
        feature.properties?.date,
        dateDefault.SIMPLE_Y_M_DATE_FORMAT
      );
      return date.isAfter(conditionStart) && date.isBefore(conditionEnd);
    });

    return {
      ...featureCollection,
      features: filteredFeatures,
    };
  }, [downloadConditions, featureCollection]);

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
                    selectedLayer === LayerName.Hexbin
                      ? collection.hasSummaryFeature()
                        ? undefined
                        : "model:No data available"
                      : isWMSAvailable
                        ? undefined
                        : "model: Map preview not available" // No GeoServer WMS data available
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
                      />
                      <MenuControl
                        visible={selectedLayer === LayerName.Hexbin}
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
                        visible={selectedLayer === LayerName.Hexbin}
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
                    <GeoServerTileLayer
                      geoServerTileLayerConfig={{
                        baseUrl: ensureHttps(getWMSServer(collection)[0]),
                        tileUrlParams: { LAYERS: getWMSLayerNames(collection) },
                        bbox: overallBoundingBox(collection),
                      }}
                      onWMSAvailabilityChange={onWMSAvailabilityChange}
                      visible={selectedLayer === LayerName.GeoServer}
                    />
                    <HexbinLayer
                      featureCollection={filteredFeatureCollection}
                      visible={selectedLayer === LayerName.Hexbin}
                    />
                  </Layers>
                </Map>
              </Box>
            </Box>
          </Stack>
        </Grid>
      </Grid>
    )
  );
};

export { getMinMaxDateStamps, overallBoundingBox };
export default SummaryAndDownloadPanel;
