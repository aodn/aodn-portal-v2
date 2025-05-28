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
// import DetailSymbolLayer from "../../../../components/map/mapbox/layers/DetailSymbolLayer";
import DrawRect from "../../../../components/map/mapbox/controls/menu/DrawRect";
import { LngLatBounds, MapboxEvent as MapEvent } from "mapbox-gl";
import BaseMapSwitcher from "../../../../components/map/mapbox/controls/menu/BaseMapSwitcher";
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
import useBreakpoint from "../../../../hooks/useBreakpoint";
import HexbinLayer from "../../../../components/map/mapbox/layers/HexbinLayer";
import GeoServerTileLayer from "../../../../components/map/mapbox/layers/GeoServerTileLayer";
import MapLayerSwitcher from "../../../../components/map/mapbox/controls/menu/MapLayerSwitcher";
import { capitalizeFirstLetter } from "../../../../utils/StringUtils";
import { ensureHttps } from "../../../../utils/UrlUtils";
import { MapDefaultConfig } from "../../../../components/map/mapbox/constants";

const TRUNCATE_COUNT = 800;
const TRUNCATE_COUNT_TABLET = 500;
const TRUNCATE_COUNT_MOBILE = 200;

enum LayerName {
  Hexbin = "hexbin",
  GeoServer = "geoServer",
}

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

interface SummaryAndDownloadPanelProps {
  bbox?: LngLatBounds;
}

const SummaryAndDownloadPanel: FC<SummaryAndDownloadPanelProps> = ({
  bbox,
}) => {
  const { isUnderLaptop, isMobile } = useBreakpoint();
  const {
    collection,
    featureCollection,
    downloadConditions,
    getAndSetDownloadConditions,
  } = useDetailPageContext();
  // Add state for selected layer
  const [selectedLayer, setSelectedLayer] = useState<string | null>(
    collection?.hasSummaryFeature() ? LayerName.Hexbin : LayerName.GeoServer
  );
  const [staticLayer, setStaticLayer] = useState<Array<string>>([]);
  const [isWMSAvailable, setIsWMSAvailable] = useState<boolean>(true);
  const [minDateStamp, maxDateStamp] = getMinMaxDateStamps(featureCollection);
  const abstract = collection?.description ? collection.description : "";
  const mapContainerId = "map-detail-container-id";

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

  const handleMapChange = useCallback(
    (event: MapEvent<MouseEvent | WheelEvent | TouchEvent | undefined>) => {
      // implement later
      console.log("Map change event", event);
    },
    []
  );

  const WMSLayerNames = useMemo(() => {
    const DataAccessLinks = collection?.getDataAccessLinks();
    if (!DataAccessLinks || DataAccessLinks.length === 0) {
      return [];
    }
    return DataAccessLinks.filter(
      (link) => link.rel === "wms" && link.title
    ).map((link) => link.title);
  }, [collection]);

  // As WMSServer may be an array if there are multiple wms links, for now we only use the first one.
  // TODO: This should be improved to handle multiple WMS layers and servers if needed.
  const WMSServer = useMemo(() => {
    const DataAccessLinks = collection?.getDataAccessLinks();
    if (!DataAccessLinks || DataAccessLinks.length === 0) {
      return [];
    }
    return DataAccessLinks.filter(
      (link) => link.rel === "wms" && link.href
    ).map((link) => link.href);
  }, [collection]);

  const overallBoundingBox = useMemo(() => {
    const bbox = collection?.extent?.bbox[0];
    if (!bbox || bbox.length < 4) {
      return [
        MapDefaultConfig.BBOX_ENDPOINTS.WEST_LON,
        MapDefaultConfig.BBOX_ENDPOINTS.SOUTH_LAT,
        MapDefaultConfig.BBOX_ENDPOINTS.EAST_LON,
        MapDefaultConfig.BBOX_ENDPOINTS.NORTH_LAT,
      ];
    }
    return bbox;
  }, [collection?.extent?.bbox]);

  const onWMSAvailabilityChange = useCallback((isWMSAvailable: boolean) => {
    setIsWMSAvailable(isWMSAvailable);
  }, []);

  // Function to create the appropriate layer based on selection
  const createPresentationLayer = useCallback(
    (id: string | null) => {
      switch (id) {
        case LayerName.GeoServer:
          return (
            <GeoServerTileLayer
              geoServerTileLayerConfig={{
                baseUrl: ensureHttps(WMSServer[0]),
                tileUrlParams: { LAYERS: WMSLayerNames },
                bbox: overallBoundingBox,
              }}
              onWMSAvailabilityChange={onWMSAvailabilityChange}
            />
          );
        default:
          return <HexbinLayer featureCollection={filteredFeatureCollection} />;
      }
    },
    [
      WMSServer,
      WMSLayerNames,
      overallBoundingBox,
      onWMSAvailabilityChange,
      filteredFeatureCollection,
    ]
  );

  return (
    collection && (
      <Grid container>
        <Grid item xs={12}>
          <Stack direction="column">
            <ExpandableTextArea
              text={abstract}
              showMoreStr={"Show All"}
              truncateCount={
                isUnderLaptop
                  ? isMobile
                    ? TRUNCATE_COUNT_MOBILE
                    : TRUNCATE_COUNT_TABLET
                  : TRUNCATE_COUNT
              }
            />
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
                        : "model:No GeoServer WMS data available"
                  }
                  onMoveEvent={handleMapChange}
                  onZoomEvent={handleMapChange}
                >
                  <Controls>
                    <NavigationControl />
                    <ScaleControl />
                    <DisplayCoordinate />
                    <MenuControl
                      menu={
                        <BaseMapSwitcher
                          layers={[
                            {
                              id: StaticLayersDef.AUSTRALIA_MARINE_PARKS.id,
                              name: StaticLayersDef.AUSTRALIA_MARINE_PARKS.name,
                              label:
                                StaticLayersDef.AUSTRALIA_MARINE_PARKS.label,
                              default: false,
                            },
                            {
                              id: MapboxWorldLayersDef.WORLD.id,
                              name: MapboxWorldLayersDef.WORLD.name,
                              default: false,
                            },
                          ]}
                          onEvent={(target: EventTarget & HTMLInputElement) =>
                            setStaticLayer((values) => {
                              // Remove the item and add it back if selected
                              const e = values?.filter(
                                (i) => i !== target.value
                              );
                              if (target.checked) {
                                e.push(target.value);
                              }
                              return [...e];
                            })
                          }
                        />
                      }
                    />
                    <MenuControl
                      menu={
                        <MapLayerSwitcher
                          layers={[
                            {
                              id: LayerName.Hexbin,
                              name: capitalizeFirstLetter(LayerName.Hexbin),
                              default: selectedLayer === LayerName.Hexbin,
                            },
                            {
                              id: LayerName.GeoServer,
                              name: "GeoServer",
                              default: selectedLayer === LayerName.GeoServer,
                            },
                          ]}
                          onEvent={(id: string) => setSelectedLayer(id)}
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
                  </Controls>
                  <Layers>
                    {createPresentationLayer(selectedLayer)}
                    {createStaticLayers(staticLayer)}
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

export { getMinMaxDateStamps };
export default SummaryAndDownloadPanel;
