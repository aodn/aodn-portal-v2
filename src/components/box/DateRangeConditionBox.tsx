import DownloadConditionBox from "./DownloadConditionBox";
import {
  DateRangeCondition,
  DownloadConditionType,
} from "../../pages/detail-page/context/DownloadDefinitions";
import React, { useMemo } from "react";
import { Typography } from "@mui/material";
import rc8Theme from "../../styles/themeRC8";

interface DateRangeConditionBoxProps {
  dateRangeCondition: DateRangeCondition;
  onRemove?: () => void;
  disable?: boolean;
}

const DateRangeConditionBox: React.FC<DateRangeConditionBoxProps> = ({
  onRemove,
  dateRangeCondition,
  disable,
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
      disable={disable}
    >
      <Typography
        sx={{
          ...rc8Theme.typography.title1Medium,
          color: rc8Theme.palette.text1,
          fontSize: "14px",
          padding: 0,
        }}
        data-testid="date-range-condition-box"
      >
        {start.replace("-", "/") + " - " + end.replace("-", "/")}
      </Typography>
    </DownloadConditionBox>
  );
};

export default DateRangeConditionBox;
