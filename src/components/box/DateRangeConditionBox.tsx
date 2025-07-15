import DownloadConditionBox from "./DownloadConditionBox";
import {
  DateRangeCondition,
  DownloadConditionType,
} from "../../pages/detail-page/context/DownloadDefinitions";
import React, { useMemo } from "react";
import { Typography } from "@mui/material";

interface DateRangeConditionBoxProps {
  dateRangeCondition: DateRangeCondition;
  onRemove?: () => void;
}

const DateRangeConditionBox: React.FC<DateRangeConditionBoxProps> = ({
  onRemove,
  dateRangeCondition,
}) => {
  const start = useMemo(
    () => dateRangeCondition.start,
    [dateRangeCondition.start]
  );
  const end = useMemo(() => dateRangeCondition.end, [dateRangeCondition.end]);
  return (
    <DownloadConditionBox
      id={dateRangeCondition.id}
      type={DownloadConditionType.DATE_RANGE}
      removeCallback={() => onRemove && onRemove()}
    >
      <Typography
        sx={{
          color: "#090C02",
          fontSize: "14px",
          fontStyle: "normal",
          fontWeight: 400,
          lineHeight: "22px",
          padding: 0,
        }}
        data-testid="date-range-condition-box"
      >
        {start + " to " + end}
      </Typography>
    </DownloadConditionBox>
  );
};

export default DateRangeConditionBox;
