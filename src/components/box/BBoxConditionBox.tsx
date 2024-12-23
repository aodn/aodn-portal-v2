import React from "react";
import {
  BBoxCondition,
  DownloadConditionType,
} from "../../pages/detail-page/context/DownloadDefinitions";
import DownloadConditionBox from "./DownloadConditionBox";
import { Grid } from "@mui/material";
import BBoxItem from "./BBoxItem";

interface BBoxConditionProps {
  bboxCondition: BBoxCondition;
  onRemove?: () => void;
}

const BBoxConditionBox: React.FC<BBoxConditionProps> = ({
  onRemove,
  bboxCondition,
}) => {
  const bbox = bboxCondition.bbox;
  return (
    <DownloadConditionBox
      id={bboxCondition.id}
      type={DownloadConditionType.BBOX}
      removeCallback={() => onRemove && onRemove()}
    >
      <Grid container>
        <Grid item md={5}>
          <BBoxItem label={"N"} value={bbox[3]} />
        </Grid>
        <Grid item md={5}>
          <BBoxItem label={"W"} value={bbox[0]} />
        </Grid>
        <Grid item md={5}>
          <BBoxItem label={"S"} value={bbox[1]} />
        </Grid>
        <Grid item md={5}>
          <BBoxItem label={"E"} value={bbox[2]} />
        </Grid>
      </Grid>
    </DownloadConditionBox>
  );
};

export default BBoxConditionBox;
