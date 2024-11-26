import React from "react";
import {
  BBoxCondition,
  DownloadConditionType,
} from "../../pages/detail-page/context/DownloadDefinitions";
import DownloadConditionBox from "./DownloadConditionBox";
import _ from "lodash";

interface BBoxConditionProps {
  bboxCondition: BBoxCondition;
}

const BBoxConditionBox: React.FC<BBoxConditionProps> = ({ bboxCondition }) => {
  const bbox = bboxCondition.bbox;
  const west = _.round(bbox[0], 2);
  const east = _.round(bbox[2], 2);
  const south = _.round(bbox[1], 2);
  const north = _.round(bbox[3], 2);
  return (
    <DownloadConditionBox type={DownloadConditionType.BBOX}>
      <p>W: {west}</p>
      <p>E: {east}</p>
      <p>S: {south}</p>
      <p>N: {north}</p>
    </DownloadConditionBox>
  );
};

export default BBoxConditionBox;
