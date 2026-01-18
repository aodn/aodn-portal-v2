import React from "react";
import {
  DownloadConditionType,
  IDownloadCondition,
  IDownloadConditionCallback,
} from "../../pages/detail-page/context/DownloadDefinitions";
import { Box, Grid, IconButton, Typography, useTheme } from "@mui/material";
import { CloseIcon } from "../../assets/icons/download/close";
import { portalTheme } from "../../styles";
import { BboxSelectionIcon } from "../../assets/icons/download/bbox_selection";
import { TimeRangeIcon } from "../../assets/icons/download/time_range";

interface DownloadConditionBoxProps
  extends IDownloadCondition,
    IDownloadConditionCallback {
  children: React.ReactNode;
  disable?: boolean;
}

const iconMap: Partial<Record<DownloadConditionType, React.ComponentType>> = {
  [DownloadConditionType.BBOX]: BboxSelectionIcon,
  [DownloadConditionType.DATE_RANGE]: TimeRangeIcon,
};

const getIcon = (type: DownloadConditionType) => {
  const IconComponent = iconMap[type];

  if (!IconComponent) {
    return null; // or return a default icon
  }

  return (
    <Box
      sx={{
        width: "30px",
        height: "30px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        pt: "2px",
        pr: "4px",
      }}
    >
      <IconComponent />
    </Box>
  );
};

const getTitle = (type: DownloadConditionType) => {
  switch (type) {
    case DownloadConditionType.BBOX:
      return "Bounding Box Selection";
    case DownloadConditionType.DATE_RANGE:
      return "Time Range";
    default:
      return "";
  }
};

const DownloadConditionBox: React.FC<DownloadConditionBoxProps> = ({
  type,
  children,
  removeCallback,
  disable = false,
}) => {
  const theme = useTheme();
  return (
    <Grid
      container
      sx={{
        position: "relative",
        border: `1px solid ${portalTheme.palette.grey600}`,
        borderRadius: theme.borderRadius.md,
        backgroundColor: portalTheme.palette.primary6,
        mb: "8px",
        py: "8px",
        px: "12px",
      }}
    >
      <Grid
        container
        alignItems="flex-start"
        spacing={"10px"}
        sx={{ pr: "16px" }}
      >
        <Grid item>{getIcon(type)}</Grid>
        <Grid item xs>
          <Typography
            sx={{
              ...portalTheme.typography.body1Medium,
              color: portalTheme.palette.text1,
              padding: 0,
              pb: "4px",
            }}
          >
            {getTitle(type)}
          </Typography>
          {children}
        </Grid>
      </Grid>
      <Box position="absolute" top={"4px"} right={"4px"}>
        <IconButton onClick={removeCallback} disabled={disable}>
          <CloseIcon />
        </IconButton>
      </Box>
    </Grid>
  );
};

export default DownloadConditionBox;
