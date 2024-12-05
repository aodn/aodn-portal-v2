import React, { useCallback, useEffect, useRef, useState } from "react";
import { Grid, Typography } from "@mui/material";
import PlainSlider from "../../../../common/slider/PlainSlider";
import { dateToValue, valueToDate } from "../../../../../utils/DateUtils";
import dayjs from "dayjs";
import { useDetailPageContext } from "../../../../../pages/detail-page/context/detail-page-context";
import {
  DownloadConditionType,
  TimeRangeCondition,
} from "../../../../../pages/detail-page/context/DownloadDefinitions";

interface DateSliderProps {
  minDate: string;
  maxDate: string;
  setDownloadConditions: (startDate: string, endDate: string) => void;
}

const DateSlider: React.FC<DateSliderProps> = ({
  minDate,
  maxDate,
  setDownloadConditions,
}) => {
  const [dateRangeStamp, setDateRangeStamp] = useState<number[]>([
    dateToValue(dayjs(minDate, "YYYY-MM")),
    dateToValue(dayjs(maxDate, "YYYY-MM")),
  ]);
  const { setDownloadConditions } = useDetailPageContext();
  const [popperOpen, setPopperOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const parentRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (
      dateRangeStamp[0] !== dateToValue(dayjs(minDate, "YYYY-MM")) ||
      dateRangeStamp[1] !== dateToValue(dayjs(maxDate, "YYYY-MM"))
    ) {
      setPopperOpen(true);
      const start = dayjs(dateRangeStamp[0]).format("YYYY-MM");
      const end = dayjs(dateRangeStamp[1]).format("YYYY-MM");
      const timeRangeToSet = new TimeRangeCondition(start, end, start + end);
      setDownloadConditions(DownloadConditionType.TIME_RANGE, [timeRangeToSet]);
    }
  }, [dateRangeStamp, maxDate, minDate]);

  const handleSliderChange = useCallback(
    (event: Event, newValue: number | number[]) => {
      setDateRangeStamp(newValue as number[]);
    },
    []
  );

  return (
    <Grid container width="800px" sx={{ padding: "10px" }}>
      <Grid item md={2} container ref={parentRef} sx={{ paddingX: "10px" }}>
        <Grid item md={12}>
          {minDate}
        </Grid>
        <Grid item md={12}>
          <Typography fontSize="12px" display="inline">
            Start Date
          </Typography>
        </Grid>
      </Grid>
      <Grid item md={8} container sx={{ paddingTop: "10px" }}>
        <PlainSlider
          value={dateRangeStamp}
          min={dateToValue(dayjs(minDate))}
          max={dateToValue(dayjs(maxDate))}
          onChange={handleSliderChange}
          valueLabelDisplay="auto"
          valueLabelFormat={(value: number) =>
            valueToDate(value).format("MM/YYYY")
          }
        />
      </Grid>
      <Grid item md={2} container sx={{ paddingX: "20px" }}>
        <Grid item md={12}>
          {maxDate}
        </Grid>
        <Grid item md={12}>
          <Typography fontSize="12px" display="inline">
            End Date
          </Typography>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default DateSlider;
