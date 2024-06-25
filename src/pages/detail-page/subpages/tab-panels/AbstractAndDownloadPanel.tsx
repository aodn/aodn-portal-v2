import { useState } from "react";
import {
  AccordionDetails,
  AccordionSummary,
  Box,
  Grid,
  Typography,
  useTheme,
  Icon,
  Stack,
  IconButton,
  LinearProgress,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CommonSelect from "../../../../components/common/dropdown/CommonSelect";
import InfoIcon from "@mui/icons-material/Info";
import {
  color,
  fontColor,
  fontSize,
  fontWeight,
  margin,
  padding,
} from "../../../../styles/constants";
import DateRangeSlider from "../../../../components/details/DateRangeSlider";
import TimeRangeIcon from "../../../../components/details/icons/TimeRangeIcon";
import DownloadIcon from "../../../../components/details/icons/DownloadIcon";
import SpatialIcon from "../../../../components/details/icons/SpatialIcon";
import DimensionsIcon from "../../../../components/details/icons/Dimensions";
import { useDetailPageContext } from "../../context/detail-page-context";
import Controls from "../../../../components/map/mapbox/controls/Controls";
import NavigationControl from "../../../../components/map/mapbox/controls/NavigationControl";
import MenuControl, {
  BaseMapSwitcher,
} from "../../../../components/map/mapbox/controls/MenuControl";
import ScaleControl from "../../../../components/map/mapbox/controls/ScaleControl";
import Map from "../../../../components/map/mapbox/Map";
import PlainAccordion from "../../../../components/common/accordion/PlainAccordion";
import Layers from "../../../../components/map/mapbox/layers/Layers";
import GeojsonLayer from "../../../../components/map/mapbox/layers/GeojsonLayer";

// TODO: replace with real select options
export const selects = {
  download: {
    selectOptions: ["NetCDFs", "1", "2"],
  },
  selectionMode: {
    label: "Selection mode",
    selectOptions: ["All", "Polygon", "Point", "Line"],
  },
  selectedArea: {
    label: "Selected area",
    selectOptions: ["All", "-124.248... 145.2895", "1", "2"],
  },
  depth: {
    label: "Depth",
    selectOptions: ["All", "1", "2"],
  },
  instrument: {
    label: "Instrument",
    selectOptions: ["All", "1", "2"],
  },
  siteName: {
    label: "Site name",
    selectOptions: ["All", "1", "2"],
  },
  institution: {
    label: "Institution",
    selectOptions: ["All", "1", "2"],
  },
};

const AbstractAndDownloadPanel = () => {
  const { collection } = useDetailPageContext();

  const abstract = collection?.description ? collection.description : "";
  const mapContainerId = "map-detail-container-id";
  const theme = useTheme();
  const [accordionExpanded, setAccordionExpanded] = useState<boolean>(true);

  const selectSxProps = {
    height: "30px",
    textAlign: "start",
    backgroundColor: color.blue.extraLight,
    boxShadow: theme.shadows[5],
  };

  const renderSelect = (select: {
    label?: string;
    selectOptions: string[];
  }) => (
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
      <CommonSelect items={select.selectOptions} sxProps={selectSxProps} />
    </Stack>
  );
  if (!collection) return;
  return (
    <>
      <Grid container>
        <Grid item xs={12}>
          <Stack direction="column">
            <Typography sx={{ padding: 0 }}>{abstract}</Typography>
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
                    <MenuControl menu={<BaseMapSwitcher />} />
                  </Controls>
                  <Layers>
                    <GeojsonLayer collection={collection} />
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
                    <Icon
                      color="disabled"
                      sx={{
                        paddingLeft: padding.large,
                        paddingRight: padding.small,
                      }}
                    >
                      <InfoIcon />
                    </Icon>
                    <Typography fontSize={fontSize.info} sx={{ padding: 0 }}>
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
