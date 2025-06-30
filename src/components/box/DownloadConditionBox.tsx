import React from "react";
import {
  DownloadConditionType,
  IDownloadCondition,
  IDownloadConditionCallback,
} from "../../pages/detail-page/context/DownloadDefinitions";
import { Box, Grid, IconButton, Typography, useTheme } from "@mui/material";
import BBOX_IMG from "../../assets/icons/bbox.png";
import TIME_RANGE_IMG from "../../assets/images/time-range.png";
import CloseIcon from "@mui/icons-material/Close";

interface DownloadConditionBoxProps
  extends IDownloadCondition,
    IDownloadConditionCallback {
  children: React.ReactNode;
}

const getIcon = (type: DownloadConditionType) => {
  let img: string;
  switch (type) {
    case DownloadConditionType.BBOX:
      img = BBOX_IMG;
      break;
    case DownloadConditionType.DATE_RANGE:
      img = TIME_RANGE_IMG;
      break;
    default:
      img = "";
  }
  return <img src={img} alt="icon" width="35px" height="35px" />;
};

const getTitle = (type: DownloadConditionType) => {
  switch (type) {
    case DownloadConditionType.BBOX:
      return "Bounding Box";
    case DownloadConditionType.DATE_RANGE:
      return "Date Range";
    default:
      return "";
  }
};

const DownloadConditionBox: React.FC<DownloadConditionBoxProps> = ({
  type,
  children,
  removeCallback,
}) => {
  const theme = useTheme();
  return (
    <Grid
      container
      sx={{
        position: "relative",
        border: "1.5px solid rgba(97, 140, 165, 0.3)",
        borderRadius: theme.borderRadius.md,
        backgroundColor: "rgba(231, 242, 255, 0.3)",
        marginTop: theme.mp.md,
      }}
    >
      <Grid item xs={2} sm={1} md={3} xl={2} sx={{ padding: theme.mp.md }}>
        {getIcon(type)}
      </Grid>
      <Grid
        container
        item
        xs={10}
        sm={11}
        md={9}
        xl={10}
        gap={2}
        paddingY={theme.mp.lg}
      >
        <Grid item xs={12}>
          <Typography
            sx={{
              color: "#090C02",
              fontSize: "14px",
              fontStyle: "normal",
              fontWeight: 400,
              lineHeight: "22px",
              padding: 0,
            }}
          >
            {getTitle(type)}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          {children}
        </Grid>
      </Grid>
      <Box position="absolute" top={1} right={1}>
        <IconButton onClick={removeCallback}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>
    </Grid>
  );
};

export default DownloadConditionBox;
