import React from "react";
import {
  BBoxCondition,
  DownloadConditionType,
} from "../../../context/DownloadDefinitions";
import BaseConditionCard from "./BaseConditionCard";
import { Grid, Typography } from "@mui/material";
import _ from "lodash";
import { portalTheme } from "../../../../../styles";

interface BBoxConditionCardProps {
  bboxCondition: BBoxCondition;
  onRemove?: () => void;
  disable?: boolean;
}

const BBoxItem: React.FC<{ label: string; value: number }> = ({
  label,
  value,
}) => (
  <Typography
    sx={{
      ...portalTheme.typography.body2Regular,
      color: portalTheme.palette.text2,
      padding: 0,
    }}
  >
    {label}: {_.round(value, 2)}
  </Typography>
);

const BBoxConditionCard: React.FC<BBoxConditionCardProps> = ({
  onRemove,
  bboxCondition,
  disable,
}) => {
  const bbox = bboxCondition.bbox;
  return (
    <BaseConditionCard
      id={bboxCondition.id}
      type={DownloadConditionType.BBOX}
      removeCallback={() => onRemove && onRemove()}
      disable={disable}
    >
      <Grid
        container
        rowSpacing={"4px"}
        columnSpacing={"12px"}
        data-testid="bbox-condition-box"
      >
        <Grid item xs={6} sm={2} md={6}>
          <BBoxItem label={"N"} value={bbox[3]} />
        </Grid>
        <Grid item xs={6} sm={2} md={6}>
          <BBoxItem label={"W"} value={bbox[0]} />
        </Grid>
        <Grid item xs={6} sm={2} md={6}>
          <BBoxItem label={"S"} value={bbox[1]} />
        </Grid>
        <Grid item xs={6} sm={2} md={6}>
          <BBoxItem label={"E"} value={bbox[2]} />
        </Grid>
      </Grid>
    </BaseConditionCard>
  );
};

export default BBoxConditionCard;
