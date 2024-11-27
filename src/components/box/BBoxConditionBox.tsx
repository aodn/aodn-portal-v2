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
}

const BBoxConditionBox: React.FC<BBoxConditionProps> = ({ bboxCondition }) => {
  const bbox = bboxCondition.bbox;
  return (
    <DownloadConditionBox
      type={DownloadConditionType.BBOX}
      conditionId={bboxCondition.id}
    >
      <Grid container sx={{}}>
        <BBoxItem label={"N"} value={bbox[3]} />
        <BBoxItem label={"W"} value={bbox[0]} />
        <BBoxItem label={"S"} value={bbox[1]} />
        <BBoxItem label={"E"} value={bbox[2]} />
      </Grid>
    </DownloadConditionBox>
  );
};

export default BBoxConditionBox;
