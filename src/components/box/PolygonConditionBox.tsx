import React from "react";
import {
  PolygonCondition,
  DownloadConditionType,
} from "../../pages/detail-page/context/DownloadDefinitions";
import DownloadConditionBox from "./DownloadConditionBox";
import { Box, Typography } from "@mui/material";
import { portalTheme } from "../../styles";

interface PolygonConditionProps {
  polygonCondition: PolygonCondition;
  onRemove?: () => void;
  disable?: boolean;
}

const PolygonConditionBox: React.FC<PolygonConditionProps> = ({
  onRemove,
  polygonCondition,
  disable,
}) => {
  const vertices = polygonCondition.coordinates;

  return (
    <DownloadConditionBox
      id={polygonCondition.id}
      type={DownloadConditionType.POLYGON}
      removeCallback={() => onRemove && onRemove()}
      disable={disable}
    >
      <Box
        component="ul"
        sx={{ m: 0, pl: "20px", listStyleType: "disc" }}
        data-testid="polygon-condition-box"
      >
        {vertices.map(([lng, lat], index) => (
          <li key={index}>
            <Typography
              sx={{
                ...portalTheme.typography.body2Regular,
                color: portalTheme.palette.text2,
                padding: 0,
              }}
            >
              {lat.toFixed(4)}&nbsp;&nbsp;&nbsp;{lng.toFixed(4)}
            </Typography>
          </li>
        ))}
      </Box>
    </DownloadConditionBox>
  );
};

export default PolygonConditionBox;
