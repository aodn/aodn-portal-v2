import * as React from "react";
import {
  Card,
  CardContent,
  Box,
  CardHeader,
  Grid,
  TextField,
  IconButton,
  Tab,
  Tabs,
  Typography,
  CardActionArea,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
} from "@mui/material";
import grey from "../common/colors/grey";
import { LineChart } from "@mui/x-charts/LineChart";
import { PropsWithChildren, useCallback, useState } from "react";
import { OGCCollection } from "../common/store/searchReducer";
import { DateRangeSlider } from "../common/slider/RangeSlider";
import { dateDefault, margin } from "../common/constants";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import SlightRoundButton from "../common/buttons/SlightRoundButton";
import LinkIcon from "@mui/icons-material/Link";
import PublicIcon from "@mui/icons-material/Public";

// import Map from "../map/maplibre/Map";
// import Controls from "../map/maplibre/controls/Controls";
// import NavigationControl from "../map/maplibre/controls/NavigationControl";
// import DisplayCoordinate from "../map/maplibre/controls/DisplayCoordinate";
// import FullScreen from "../map/maplibre/controls/FullScreenControl";

import Map from "../map/mapbox/Map";
import Controls from "../map/mapbox/controls/Controls";
import NavigationControl from "../map/mapbox/controls/NavigationControl";
import ScaleControl from "../map/mapbox/controls/ScaleControl";
import DisplayCoordinate from "../map/mapbox/controls/DisplayCoordinate";
import { MapboxEvent as MapEvent } from "mapbox-gl";
import MenuControl, {
  BaseMapSwitcher,
} from "../map/mapbox/controls/MenuControl";

type Point = {
  date: number;
  y: number;
};

type DataSeries = Array<Point>;

interface DetailCardProps {
  collection: OGCCollection | undefined;
}

interface TabPanelProps {
  index: number;
  value: number;
}

const mapPanelId = "maplibre-detail-page-id";

const MapCard = (props: DetailCardProps) => {
  const [minSliderDate] = useState<Date | undefined>(undefined);
  const [startSliderDate, setSliderStartDate] = useState<Date>(
    dateDefault["min"]
  );
  const [endSliderDate, setSliderEndDate] = useState<Date>(dateDefault["max"]);

  // TODO: Need to fix later to get the number of data points across time.
  const createDataSet = useCallback(
    (collection: OGCCollection | undefined): DataSeries => {
      const r: DataSeries = new Array<Point>();

      if (collection === undefined) {
        // TODO: Create sample info for MVP only
        for (let i = 0; i < 200; i++) {
          r.push({ date: i, y: Math.floor(Math.random() * 100) });
        }
      }

      return r;
    },
    []
  );

  const onSlideChanged = useCallback((start: number, end: number) => {
    setSliderStartDate(new Date(start));
    setSliderEndDate(new Date(end));
  }, []);

  return (
    <Card
      sx={{
        backgroundColor: grey["resultCard"],
      }}
    >
      <CardHeader title="Map Contents" />
      <CardContent>
        <Box
          id={mapPanelId}
          sx={{
            width: "100%",
            minHeight: "460px",
          }}
        >
          <Map panelId={mapPanelId}>
            <Controls>
              <MenuControl menu={<BaseMapSwitcher />} />
              <NavigationControl />
              <DisplayCoordinate />
            </Controls>
          </Map>
        </Box>
        <Box
          sx={{
            width: "100%",
            height: "200px",
            minHeight: "200px",
          }}
        >
          <LineChart
            dataset={createDataSet(props.collection)}
            xAxis={[
              {
                dataKey: "date",
                valueFormatter: (v) => v.toString(),
                min: 0,
                max: 200,
              },
            ]}
            series={[
              {
                id: "timeline",
                dataKey: "y",
                label: "Target data",
                showMark: false,
              },
            ]}
            margin={{
              // use to control the space on right, so that it will not overlap with the legend
              right: 200,
            }}
            slotProps={{
              legend: {
                direction: "column",
                position: {
                  vertical: "middle",
                  horizontal: "right",
                },
                itemMarkWidth: 20,
                itemMarkHeight: 20,
                markGap: 10,
                itemGap: 10,
              },
            }}
            // TODO: Fill not working why?
            sx={{
              "& .MuiAreaElement-series-timeline": {
                fill: "url('#fillStyle')",
              },
              height: "100%",
            }}
          >
            <defs>
              <linearGradient id="fillStyle" gradientTransform="rotate(0)">
                <stop offset="5%" stopColor="blue" />
                <stop offset="95%" stopColor="green" />
              </linearGradient>
            </defs>
          </LineChart>
        </Box>
        <Box
          sx={{
            width: "100%",
            minHeight: "60px",
          }}
        >
          <Grid container xs={12} justifyContent={"center"}>
            <Grid
              item
              xs={2}
              sx={{
                marginRight: margin["right"],
              }}
            >
              <TextField
                value={startSliderDate.toLocaleDateString()}
                variant="outlined"
                size="small"
                disabled={true}
              />
            </Grid>
            <Grid item xs={5}>
              <DateRangeSlider
                title={"temporal"}
                onSlideChanged={onSlideChanged}
                min={minSliderDate}
                start={startSliderDate}
                end={endSliderDate}
              />
            </Grid>
            <Grid
              item
              xs={2}
              sx={{
                marginLeft: margin["left"],
              }}
            >
              <TextField
                value={endSliderDate.toLocaleDateString()}
                variant="outlined"
                size="small"
                disabled={true}
              />
            </Grid>
            <Grid item xs={"auto"} sx={{ marginLeft: "20px" }}>
              <IconButton aria-label="previous">
                <SkipPreviousIcon />
              </IconButton>
              <IconButton aria-label="play/pause">
                <PlayArrowIcon sx={{ height: 38, width: 38 }} />
              </IconButton>
              <IconButton aria-label="next">
                <SkipNextIcon />
              </IconButton>
            </Grid>
          </Grid>
        </Box>
      </CardContent>
    </Card>
  );
};

const ContentTabPanel = ({
  value,
  index,
  children,
}: PropsWithChildren<TabPanelProps>) => {
  return (
    <>
      {value === index && (
        <Box
          sx={{
            //border: border["tabPanelBorder"],
            backgroundColor: grey["contentTabPanel"],
          }}
        >
          <Typography
            sx={{
              margin: margin["top"],
              minHeight: "220px",
            }}
          >
            {children}
          </Typography>
          <Typography
            sx={{
              margin: margin["top"],
            }}
          >
            <CardActionArea>
              {
                // TODO fake here
              }
              <SlightRoundButton>On going</SlightRoundButton>
              <SlightRoundButton>Dataset</SlightRoundButton>
              <SlightRoundButton>netCDF</SlightRoundButton>
            </CardActionArea>
          </Typography>
        </Box>
      )}
    </>
  );
};

const ContentCard = (props: DetailCardProps) => {
  const [value, setValue] = React.useState<number>(1);

  const handleChange = useCallback(
    (event: React.SyntheticEvent, newValue: number) => {
      setValue(newValue);
    },
    [setValue]
  );

  return (
    <Card
      sx={{
        backgroundColor: grey["resultCard"],
      }}
    >
      <CardContent>
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="secondary"
          textColor="inherit"
          aria-label="secondary tabs example"
        >
          <Tab value={1} label="Description" />
          <Tab value={2} label="About this resources" />
          <Tab value={3} label="Metadata Information" />
        </Tabs>
        <ContentTabPanel value={value} index={1}>
          {props.collection?.description}
        </ContentTabPanel>
        <ContentTabPanel value={value} index={2}>
          TODO
        </ContentTabPanel>
        <ContentTabPanel value={value} index={3}>
          TODO
        </ContentTabPanel>
      </CardContent>
    </Card>
  );
};

const LinkTabPanel = ({
  value,
  index,
  children,
}: PropsWithChildren<TabPanelProps>) => {
  return (
    <>
      {value === index && (
        <Box
          sx={{
            //border: border["tabPanelBorder"],
            backgroundColor: grey["contentTabPanel"],
          }}
        >
          <Typography
            sx={{
              margin: margin["top"],
              minHeight: "220px",
            }}
          >
            {children}
          </Typography>
        </Box>
      )}
    </>
  );
};

const LinkCard = (props: DetailCardProps) => {
  const [value, setValue] = React.useState<number>(1);

  const handleChange = useCallback(
    (event: React.SyntheticEvent, newValue: number) => {
      setValue(newValue);
    },
    [setValue]
  );

  return (
    <Card
      sx={{
        backgroundColor: grey["resultCard"],
      }}
    >
      <CardContent>
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="secondary"
          textColor="inherit"
          aria-label="secondary tabs example"
        >
          <Tab value={1} label="Links" />
          <Tab value={2} label="Assoicated resource" />
        </Tabs>
        <LinkTabPanel value={value} index={1}>
          <List>
            {props.collection?.links?.map((f) => (
              <ListItem
                key={f.title}
                secondaryAction={
                  <IconButton edge="end" onClick={() => window.open(f.href)}>
                    <LinkIcon />
                  </IconButton>
                }
              >
                <ListItemAvatar>
                  <Avatar>
                    <PublicIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary={f.title} secondary={f.href} />
              </ListItem>
            ))}
          </List>
        </LinkTabPanel>
        <LinkTabPanel value={value} index={2}>
          TODO
        </LinkTabPanel>
      </CardContent>
    </Card>
  );
};

export { MapCard, ContentCard, LinkCard };
