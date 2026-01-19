import DownloadConditionBox from "./DownloadConditionBox";
import {
  DateRangeCondition,
  DownloadConditionType,
} from "../../pages/detail-page/context/DownloadDefinitions";
import React, { useMemo } from "react";
import { Typography } from "@mui/material";
import { portalTheme } from "../../styles";
import dayjs from "dayjs";
import { dateDefault } from "../common/constants";

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
          ...portalTheme.typography.title1Medium,
          color: portalTheme.palette.text1,
          fontSize: "14px",
          padding: 0,
        }}
        data-testid="date-range-condition-box"
      >
        {dayjs(start).format(dateDefault.DISPLAY_FORMAT) +
          " - " +
          dayjs(end).format(dateDefault.DISPLAY_FORMAT)}
      </Typography>
    </DownloadConditionBox>
  );
};

export default DateRangeConditionBox;
