import React, { useCallback, useEffect, useRef, useState } from "react";
import { Grid, Typography } from "@mui/material";
import PlainSlider from "../../../../common/slider/PlainSlider";
import { dateToValue, valueToDate } from "../../../../../utils/DateUtils";
import dayjs from "dayjs";
import _ from "lodash";
import { SIMPLE_DATE_FORMAT } from "../../../../../pages/detail-page/subpages/tab-panels/AbstractAndDownloadPanel";

interface DateSliderProps {
  minDate: string;
  maxDate: string;
  onDateRangeChange: (dateRangeStamp: number[]) => void;
}

const DateSlider: React.FC<DateSliderProps> = ({
  minDate,
  maxDate,
  onDateRangeChange,
}) => {
  const [dateRangeStamp, setDateRangeStamp] = useState<number[]>([
    dateToValue(dayjs(minDate, SIMPLE_DATE_FORMAT)),
    dateToValue(dayjs(maxDate, SIMPLE_DATE_FORMAT)),
  ]);
  const parentRef = useRef<HTMLDivElement | null>(null);

  const debounceSliderChange = useRef<_.DebouncedFunc<
    (dateStamps: any) => void
  > | null>(null);

  useEffect(() => {
    debounceSliderChange.current = _.debounce((_: number | number[]) => {
      onDateRangeChange(dateRangeStamp);
    }, 500);

    return () => {
      debounceSliderChange.current?.cancel();
    };
  }, [dateRangeStamp, onDateRangeChange]);

  useEffect(() => {
    debounceSliderChange?.current?.(dateRangeStamp);
  }, [dateRangeStamp]);

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
          min={dateToValue(dayjs(minDate, SIMPLE_DATE_FORMAT))}
          max={dateToValue(dayjs(maxDate, SIMPLE_DATE_FORMAT))}
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
