import React from "react";
import {
  PolygonCondition,
  DownloadConditionType,
} from "../../../pages/detail-page/context/DownloadDefinitions";
import BaseConditionCard from "./BaseConditionCard";
import { Box, Typography } from "@mui/material";
import { portalTheme } from "../../../styles";

interface PolygonConditionCardProps {
  polygonCondition: PolygonCondition;
  onRemove?: () => void;
  disable?: boolean;
}

const PolygonConditionCard: React.FC<PolygonConditionCardProps> = ({
  onRemove,
  polygonCondition,
  disable,
}) => {
  const vertices = polygonCondition.coordinates;

  return (
    <BaseConditionCard
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
    </BaseConditionCard>
  );
};

export default PolygonConditionCard;
