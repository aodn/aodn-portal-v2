import { FC, useState } from "react";
import {
  AccordionDetails,
  AccordionSummary,
  Box,
  Grid,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CommonSelect, {
  SelectItem,
} from "../../../../components/common/dropdown/CommonSelect";
import InfoIcon from "@mui/icons-material/Info";
import {
  color,
  fontColor,
  fontSize,
  fontWeight,
  margin,
  padding,
  shadow,
} from "../../../../styles/constants";
import DateRangeSlider from "../../../../components/details/DateRangeSlider";
import TimeRangeIcon from "../../../../components/icon/TimeRangeIcon";
import DownloadIcon from "../../../../components/icon/DownloadIcon";
import SpatialIcon from "../../../../components/icon/SpatialIcon";
import DimensionsIcon from "../../../../components/icon/Dimensions";
import { useDetailPageContext } from "../../context/detail-page-context";
import Controls from "../../../../components/map/mapbox/controls/Controls";
import NavigationControl from "../../../../components/map/mapbox/controls/NavigationControl";
import MenuControl, {
  BaseMapSwitcher,
} from "../../../../components/map/mapbox/controls/MenuControl";
import ScaleControl from "../../../../components/map/mapbox/controls/ScaleControl";
import Map from "../../../../components/map/mapbox/Map";
import PlainAccordion from "../../../../components/common/accordion/PlainAccordion";
import Layers, {
  createStaticLayers,
} from "../../../../components/map/mapbox/layers/Layers";
import GeojsonLayer from "../../../../components/map/mapbox/layers/GeojsonLayer";
import { StaticLayersDef } from "../../../../components/map/mapbox/layers/StaticLayer";
import { MapboxWorldLayersDef } from "../../../../components/map/mapbox/layers/MapboxWorldLayer";
import useScrollToSection from "../../../../hooks/useScrollToSection";
import { decodeHtmlEntities } from "../../../../utils/StringUtils";

interface DownloadSelect {
  label?: string;
  options: SelectItem[];
}

type DownloadSelectName =
  | "download"
  | "selectionMode"
  | "selectedArea"
  | "depth"
  | "instrument"
  | "siteName"
  | "institution";

// TODO: replace with real select options
export const selects: Record<DownloadSelectName, DownloadSelect> = {
  download: {
    options: [
      { label: "NetCDFs", value: "NetCDFs" },
      { label: "1", value: "1" },
    ],
  },
  selectionMode: {
    label: "Selection mode",
    options: [
      { label: "All", value: "all" },
      { label: "Polygon", value: "polygon" },
      { label: "Point", value: "point" },
      { label: "Line", value: "line" },
    ],
  },
  selectedArea: {
    label: "Selected area",
    options: [
      { label: "All", value: "all" },
      { label: "-124.248... 145.2895n", value: "-124.248... 145.2895" },
    ],
  },
  depth: {
    label: "Depth",
    options: [
      { label: "All", value: "all" },
      { label: "1", value: "1" },
    ],
  },
  instrument: {
    label: "Instrument",
    options: [
      { label: "All", value: "all" },
      { label: "1", value: "1" },
    ],
  },
  siteName: {
    label: "Site name",
    options: [
      { label: "All", value: "all" },
      { label: "1", value: "1" },
    ],
  },
  institution: {
    label: "Institution",
    options: [
      { label: "All", value: "all" },
      { label: "1", value: "1" },
    ],
  },
};

const selectSxProps = {
  height: "30px",
  textAlign: "start",
  backgroundColor: color.blue.extraLightSemiTransparent,
  boxShadow: shadow.inner,
};

const renderSelect = (select: DownloadSelect) => (
  <Stack spacing={1}>
    {select.label && (
      <Typography
        sx={{
          padding: 0,
        }}
      >
        {select.label}
      </Typography>
    )}
    <CommonSelect items={select.options} sx={selectSxProps} />
  </Stack>
);

const DOWNLOAD_SECTION_ID = "download-section";

const AbstractAndDownloadPanel: FC = () => {
  const { collection } = useDetailPageContext();
  const downloadSectionRef = useScrollToSection({
    sectionId: DOWNLOAD_SECTION_ID,
  });
  const [accordionExpanded, setAccordionExpanded] = useState<boolean>(true);
  const [staticLayer, setStaticLayer] = useState<Array<string>>([]);

  const abstract = collection?.description ? collection.description : "";
  const mapContainerId = "map-detail-container-id";

  if (!collection) return;
  return (
    <>
      <Grid container>
        <Grid item xs={12}>
          <Stack direction="column">
            <Typography sx={{ padding: 0 }} data-testid="detail-abstract">
              {decodeHtmlEntities(abstract)}
            </Typography>
            <Box sx={{ visibility: "visible" }}>
              <Box
                arial-label="map"
                id={mapContainerId}
                sx={{
                  width: "100%",
                  minHeight: "500px",
                  marginY: padding.large,
                }}
              >
                <Map panelId={mapContainerId}>
                  <Controls>
                    <NavigationControl />
                    <ScaleControl />
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
                  </Controls>
                  <Layers>
                    <GeojsonLayer collection={collection} />
                    {createStaticLayers(staticLayer)}
                  </Layers>
                </Map>
              </Box>
            </Box>
          </Stack>
        </Grid>
        <Grid item xs={12} aria-label="download section">
          <Grid container spacing={2} aria-label="download as section">
            <Grid item xs={12}>
              <Typography
                fontWeight={fontWeight.bold}
                color={fontColor.gray.dark}
                sx={{ padding: 0 }}
                ref={downloadSectionRef}
                id={DOWNLOAD_SECTION_ID}
              >
                Download as
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Grid container spacing={4}>
                <Grid item xs={2}>
                  <IconButton
                    sx={{
                      padding: 0,
                      paddingLeft: padding.medium,
                      "&:hover": {
                        backgroundColor: "transparent",
                      },
                    }}
                  >
                    <DownloadIcon />
                  </IconButton>
                </Grid>
                <Grid item xs={5}>
                  {renderSelect(selects.download)}
                </Grid>
                <Grid item xs={5}>
                  <Stack
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "start",
                    }}
                  >
                    <InfoIcon color="disabled" />
                    <Typography
                      fontSize={fontSize.info}
                      color={fontColor.gray.light}
                      sx={{ padding: 0, pl: padding.extraSmall }}
                    >
                      The full data collection will be downloaded. Please
                      consider filtering the collection. Citation file is
                      automatically included as part of the download.
                    </Typography>
                  </Stack>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid container aria-label="download subset section">
            <Grid item xs={12}>
              {/* TODO: clear subsets */}
              <PlainAccordion
                expanded={accordionExpanded}
                elevation={0}
                onChange={() => setAccordionExpanded((prevState) => !prevState)}
              >
                <AccordionSummary
                  sx={{ padding: 0, width: "20%" }}
                  expandIcon={<ExpandMoreIcon />}
                >
                  <Typography
                    fontWeight={fontWeight.bold}
                    color={fontColor.gray.dark}
                    sx={{ padding: 0 }}
                  >
                    Download Subset
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={4}>
                    <Grid container item spacing={4} arial-babel="time range">
                      <Grid item xs={2}>
                        <TimeRangeIcon />
                      </Grid>
                      <Grid item xs={10}>
                        <DateRangeSlider />
                      </Grid>
                    </Grid>
                    <Grid container item spacing={4} arial-babel="spatial">
                      <Grid item xs={2}>
                        <SpatialIcon />
                      </Grid>
                      <Grid item xs={5}>
                        {renderSelect(selects.selectionMode)}
                      </Grid>
                      <Grid item xs={5}>
                        {renderSelect(selects.selectedArea)}
                      </Grid>
                    </Grid>
                    <Grid container item spacing={4} arial-babel="dimensions">
                      <Grid item xs={2}>
                        <DimensionsIcon />
                      </Grid>
                      <Grid item xs={10}>
                        <Grid container spacing={4}>
                          <Grid item xs={6}>
                            {renderSelect(selects.depth)}
                          </Grid>
                          <Grid item xs={6}>
                            {renderSelect(selects.instrument)}
                          </Grid>
                          <Grid
                            item
                            xs={6}
                            sx={{ marginTop: `-${margin.top}` }}
                          >
                            {renderSelect(selects.siteName)}
                          </Grid>
                          <Grid
                            item
                            xs={6}
                            sx={{ marginTop: `-${margin.top}` }}
                          >
                            {renderSelect(selects.institution)}
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </PlainAccordion>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default AbstractAndDownloadPanel;
