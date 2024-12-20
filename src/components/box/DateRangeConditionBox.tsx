import DownloadConditionBox from "./DownloadConditionBox";
import {
  DateRangeCondition,
  DownloadConditionType,
} from "../../pages/detail-page/context/DownloadDefinitions";
import React, { useMemo } from "react";
import { Typography } from "@mui/material";

interface DateRangeConditionBoxProps {
  dateRangeCondition: DateRangeCondition;
}

const DateRangeConditionBox: React.FC<DateRangeConditionBoxProps> = ({
  dateRangeCondition,
}) => {
  const start = useMemo(
    () => dateRangeCondition.start,
    [dateRangeCondition.start]
  );
  const end = useMemo(() => dateRangeCondition.end, [dateRangeCondition.end]);
  return (
    <DownloadConditionBox
      type={DownloadConditionType.DATE_RANGE}
      id={dateRangeCondition.id}
    >
      <Typography
        sx={{
          color: "#7194AB",
          fontSize: "12px",
          fontWeight: "400",
          lineHeight: "8px",
        }}
      >
        {start + " to " + end}
      </Typography>
    </DownloadConditionBox>
  );
};

export default DateRangeConditionBox;
