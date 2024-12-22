import React, { useCallback, useEffect, useRef, useState } from "react";
import timeRange from "../../../../../assets/images/time-range.png";
import {
  DateRangeCondition,
  DownloadConditionType,
  IDownloadCondition,
} from "../../../../../pages/detail-page/context/DownloadDefinitions";
import { ControlProps } from "./Definition";
import { Grid, IconButton, Typography } from "@mui/material";
import { MapControl } from "./MenuControl";
import dayjs from "dayjs";
import { dateToValue, valueToDate } from "../../../../../utils/DateUtils";
import _ from "lodash";
import PlainSlider from "../../../../common/slider/PlainSlider";
import { dateDefault } from "../../../../common/constants";

interface DateSliderProps {
  minDate: string;
  maxDate: string;
  onDateRangeChange: (
    event: Event | React.SyntheticEvent<Element, Event>,
    value: number | number[]
  ) => void;
}

interface DateRangeControlProps extends ControlProps {
  minDate: string;
  maxDate: string;
  setDownloadConditions: (
    type: DownloadConditionType,
    conditions: IDownloadCondition[]
  ) => void;
}

const DateSlider: React.FC<DateSliderProps> = ({
  minDate,
  maxDate,
  onDateRangeChange,
}) => {
  const [dateRangeStamp, setDateRangeStamp] = useState<number[]>([
    dateToValue(dayjs(minDate, dateDefault.SIMPLE_DATE_FORMAT)),
    dateToValue(dayjs(maxDate, dateDefault.SIMPLE_DATE_FORMAT)),
  ]);
  const handleSliderChange = useCallback(
    (_: Event, newValue: number | number[]) => {
      const v = newValue as number[];
      setDateRangeStamp(v);
    },
    []
  );

  return (
    <Grid container width="800px" sx={{ padding: "10px" }}>
      <Grid item md={2} container sx={{ paddingX: "10px" }}>
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
          min={dateToValue(dayjs(minDate, dateDefault.SIMPLE_DATE_FORMAT))}
          max={dateToValue(dayjs(maxDate, dateDefault.SIMPLE_DATE_FORMAT))}
          onChangeCommitted={onDateRangeChange}
          onChange={handleSliderChange}
          valueLabelDisplay="auto"
          valueLabelFormat={(value: number) =>
            valueToDate(value).format(dateDefault.SIMPLE_DATE_FORMAT)
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

const DateRange: React.FC<DateRangeControlProps> = ({
  minDate,
  maxDate,
  setDownloadConditions,
  map,
}) => {
  const [isShowingSelector, setIsShowingSelector] = useState(false);

  const onDateRangeChange = useCallback(
    (
      _: Event | React.SyntheticEvent<Element, Event>,
      dateRangeStamps: number | number[]
    ) => {
      const d = dateRangeStamps as number[];
      const start = dayjs(d[0]).format(dateDefault.SIMPLE_DATE_FORMAT);
      const end = dayjs(d[1]).format(dateDefault.SIMPLE_DATE_FORMAT);

      if (minDate === start && maxDate === end) {
        setDownloadConditions(DownloadConditionType.DATE_RANGE, []);
      } else {
        const dateRangeCondition = new DateRangeCondition(
          start,
          end,
          "date_range"
        );
        setDownloadConditions(DownloadConditionType.DATE_RANGE, [
          dateRangeCondition,
        ]);
      }
    },
    [maxDate, minDate, setDownloadConditions]
  );

  useEffect(() => {
    if (isShowingSelector) {
      const slider: MapControl = new MapControl(
        (
          <DateSlider
            minDate={minDate}
            maxDate={maxDate}
            onDateRangeChange={onDateRangeChange}
          />
        )
      );
      map?.addControl(slider, "bottom-right");
      return () => {
        map?.removeControl(slider);
      };
    }
  }, [isShowingSelector, map, maxDate, minDate, onDateRangeChange]);

  return (
    <IconButton onClick={() => setIsShowingSelector((prev) => !prev)}>
      <img alt="" src={timeRange} />
    </IconButton>
  );
};

export default DateRange;
