import { DownloadConditionType } from "../../pages/detail-page/context/DownloadDefinitions";
import React, { useCallback } from "react";
import { Grid, IconButton, Typography, useTheme } from "@mui/material";
import bbox from "../../assets/icons/bbox.png";
import CloseIcon from "@mui/icons-material/Close";
import { useDetailPageContext } from "../../pages/detail-page/context/detail-page-context";

interface DownloadConditionBoxProps {
  type: DownloadConditionType;
  children: React.ReactNode;
  conditionId: string;
}

const getIcon = (type: DownloadConditionType) => {
  let img = "";
  switch (type) {
    case DownloadConditionType.BBOX:
      img = bbox;
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
    default:
      return "";
  }
};

const DownloadConditionBox: React.FC<DownloadConditionBoxProps> = ({
  type,
  children,
  conditionId,
}) => {
  const theme = useTheme();
  const { deleteDownloadConditionBy } = useDetailPageContext();

  const onConditionRemove = useCallback(() => {
    deleteDownloadConditionBy(conditionId);
  }, [conditionId, deleteDownloadConditionBy]);

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
        <IconButton onClick={onConditionRemove}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </Grid>
    </Grid>
  );
};

export default DownloadConditionBox;
