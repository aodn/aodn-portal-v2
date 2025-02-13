import React, { FC, useCallback, useMemo } from "react";
import { Box, Grid, Stack } from "@mui/material";
import { padding } from "../../../../styles/constants";
import { useDetailPageContext } from "../../context/detail-page-context";
import Controls from "../../../../components/map/mapbox/controls/Controls";
import NavigationControl from "../../../../components/map/mapbox/controls/NavigationControl";
import ScaleControl from "../../../../components/map/mapbox/controls/ScaleControl";
import Map from "../../../../components/map/mapbox/Map";
import Layers from "../../../../components/map/mapbox/layers/Layers";
import { StaticLayersDef } from "../../../../components/map/mapbox/layers/StaticLayer";
import { MapboxWorldLayersDef } from "../../../../components/map/mapbox/layers/MapboxWorldLayer";
import ExpandableTextArea from "../../../../components/list/listItem/subitem/ExpandableTextArea";
import DetailSymbolLayer from "../../../../components/map/mapbox/layers/DetailSymbolLayer";
import DrawRect from "../../../../components/map/mapbox/controls/menu/DrawRect";
import { LngLatBounds, MapboxEvent as MapEvent } from "mapbox-gl";
import BaseMapSwitcher from "../../../../components/map/mapbox/controls/menu/BaseMapSwitcher";
import MenuControl from "../../../../components/map/mapbox/controls/menu/MenuControl";
import DateRange from "../../../../components/map/mapbox/controls/menu/DateRange";
import dayjs from "dayjs";
import {
  DateRangeCondition,
  DownloadConditionType,
} from "../../context/DownloadDefinitions";
import { dateDefault } from "../../../../components/common/constants";
import { FeatureCollection, Point } from "geojson";
import DisplayCoordinate from "../../../../components/map/mapbox/controls/DisplayCoordinate";
import useBreakpoint from "../../../../hooks/useBreakpoint";

const TRUNCATE_COUNT = 800;
const TRUNCATE_COUNT_TABLET = 500;
const TRUNCATE_COUNT_MOBILE = 200;

// TODO: Add vitest
const getMinMaxDateStamps = (
  featureCollection: FeatureCollection<Point> | undefined
) => {
  if (
    featureCollection &&
    featureCollection.features &&
    featureCollection.features.length > 0
  ) {
    // This default will trigger new value assign in the loop
    let minDate = dayjs(dateDefault.max);
    let maxDate = dayjs(dateDefault.min);

    featureCollection.features?.forEach((feature) => {
      const start = dayjs(feature.properties?.startTime);
      const end = dayjs(feature.properties?.endTime);
      if (start.isBefore(minDate)) {
        minDate = start;
      }
      if (end.isAfter(maxDate)) {
        maxDate = end;
      }
    });
    return [minDate, maxDate];
  } else {
    return [dayjs(dateDefault.min), dayjs(dateDefault.max)];
  }
};

interface AbstractAndDownloadPanelProps {
  bbox?: LngLatBounds;
}

const AbstractAndDownloadPanel: FC<AbstractAndDownloadPanelProps> = ({
  bbox,
}) => {
  const { isUnderLaptop, isMobile } = useBreakpoint();
  const {
    collection,
    featureCollection,
    downloadConditions,
    getAndSetDownloadConditions,
  } = useDetailPageContext();

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
      const start = dayjs(
        feature.properties?.startTime,
        dateDefault.DATE_TIME_FORMAT
      );
      const end = dayjs(
        feature.properties?.endTime,
        dateDefault.DATE_TIME_FORMAT
      );
      return start.isBefore(conditionEnd) && end.isAfter(conditionStart);
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
                  animate={true}
                  panelId={mapContainerId}
                  announcement={
                    collection.hasSummaryFeature()
                      ? undefined
                      : "No data available"
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
                        />
                      }
                    />
                    <MenuControl
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
                    <DetailSymbolLayer
                      featureCollection={filteredFeatureCollection}
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

export default AbstractAndDownloadPanel;
