import React, { FC, useMemo } from "react";
import { Box, Grid, Stack } from "@mui/material";
import { useDetailPageContext } from "../context/detail-page-context";
import ExpandableTextArea from "../../../components/list/listItem/subitem/ExpandableTextArea";
import dayjs, { Dayjs } from "dayjs";
import { FeatureCollection, Point } from "geojson";
import { OGCCollection } from "../../../components/common/store/OGCCollectionDefinitions";
import {
  LayerName,
  LayerSwitcherLayer,
} from "../../../components/map/mapbox/controls/menu/MapLayerSwitcher";
import useBreakpoint from "../../../hooks/useBreakpoint";
import AIGenTag from "../../../components/info/AIGenTag";
import { portalTheme } from "../../../styles";
import { dateDefault } from "../../../components/common/constants";

// Exported for unit tests
export const getMinMaxDateStamps = (
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

// Exported for unit tests and MapPanel
export const buildMapLayerConfig = (
  collection: OGCCollection | null | undefined,
  hasSummaryFeature: boolean,
  isZarrDataset: boolean,
  isWMSAvailable: boolean,
  hasSpatialExtent: boolean,
  isSupportH3: boolean,
  lastSelectedLayer: LayerSwitcherLayer<LayerName> | null = null
): LayerSwitcherLayer<LayerName>[] => {
  const layers: LayerSwitcherLayer<LayerName>[] = [];

  if (collection) {
    const isSupportHexbin = hasSummaryFeature && !isZarrDataset;

    const isSupportSpatialExtent =
      hasSpatialExtent &&
      ((hasSummaryFeature && isZarrDataset) ||
        (!isWMSAvailable && !isSupportHexbin));

    if (isSupportH3) {
      const h3: LayerSwitcherLayer<LayerName> = {
        id: LayerName.H3,
        name: "H3",
        selected: true,
      };
      layers.push(h3);
    }

    if (isSupportHexbin) {
      const l: LayerSwitcherLayer<LayerName> = {
        id: LayerName.Hexbin,
        name: "Hex Grid",
        // H3 takes priority when both are available
        selected: !isSupportH3,
      };
      layers.push(l);
    }

    if (isWMSAvailable) {
      const l: LayerSwitcherLayer<LayerName> = {
        id: LayerName.GeoServer,
        name: "Geoserver",
        selected: !isSupportHexbin && !isSupportH3,
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

const SummaryAndDownloadPanel: FC = () => {
  const { collection } = useDetailPageContext();
  const { isUnderLaptop, isMobile } = useBreakpoint();

  const abstract = useMemo(
    () => collection?.getEnhancedDescription() || collection?.description || "",
    [collection]
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
                    body: "The abstract content of metadata is reformatted by AI models into a better layout.",
                  }}
                />
              </Box>
              <ExpandableTextArea
                text={abstract}
                showMoreStr={"Show All"}
                defaultExpanded={isMobile}
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
          </Stack>
        </Grid>
      </Grid>
    )
  );
};

export default SummaryAndDownloadPanel;
