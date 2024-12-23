import React from "react";
import {
  DownloadConditionType,
  IDownloadCondition,
  IDownloadConditionCallback,
} from "../../pages/detail-page/context/DownloadDefinitions";
import { Grid, IconButton, Typography, useTheme } from "@mui/material";
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
        border: "1.5px solid rgba(97, 140, 165, 0.3)",
        borderRadius: theme.borderRadius.md,
        backgroundColor: "rgba(231, 242, 255, 0.3)",
        marginY: theme.mp.md,
        paddingBottom: theme.mp.md,
      }}
    >
      <Grid item md={2} sx={{ padding: theme.mp.md }}>
        {getIcon(type)}
      </Grid>
      <Grid container item md={8}>
        <Grid
          sx={{ paddingX: theme.mp.lg, paddingY: theme.mp.sm }}
          item
          md={12}
        >
          <Typography
            sx={{
              color: "#7194AB",
              fontSize: "12px",
              fontWeight: "400",
              lineHeight: "8px",
            }}
          >
            {getTitle(type)}
          </Typography>
        </Grid>
        <Grid
          item
          md={12}
          sx={{ paddingX: theme.mp.lg, paddingY: theme.mp.sm }}
        >
          {children}
        </Grid>
      </Grid>
      <Grid item md={1}>
        <IconButton onClick={removeCallback}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </Grid>
    </Grid>
  );
};

export default DownloadConditionBox;
