import React, { useCallback, useEffect, useState } from "react";
import timeRange from "../../../../../assets/images/time-range.png";
import {
  DateRangeCondition,
  DownloadConditionType,
  IDownloadCondition,
  IDownloadConditionCallback,
} from "../../../../../pages/detail-page/context/DownloadDefinitions";
import { ControlProps } from "./Definition";
import { Grid, IconButton, Typography } from "@mui/material";
import { MapControl } from "./MenuControl";
import dayjs from "dayjs";
import { dateToValue, valueToDate } from "../../../../../utils/DateUtils";
import PlainSlider from "../../../../common/slider/PlainSlider";
import { dateDefault } from "../../../../common/constants";
import useBreakpoint from "../../../../../hooks/useBreakpoint";
import { color, fontSize, padding } from "../../../../../styles/constants";

interface DateSliderProps {
  currentMinDate: string | undefined;
  currentMaxDate: string | undefined;
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
  getAndSetDownloadConditions: (
    type: DownloadConditionType,
    conditions: IDownloadCondition[]
  ) => IDownloadCondition[];
}

const COMPONENT_ID = "dateslider-daterange-menu-button";
const SLIDER_WIDTH_DEFAULT = 600;
const SLIDER_WIDTH_TABLET = 400;
const SLIDER_WIDTH_MOBILE = 250;

const DateSlider: React.FC<DateSliderProps> = ({
  currentMinDate,
  currentMaxDate,
  minDate,
  maxDate,
  onDateRangeChange,
}) => {
  const { isMobile, isTablet } = useBreakpoint();
  const [dateRangeStamp, setDateRangeStamp] = useState<number[]>([
    dateToValue(
      dayjs(
        currentMinDate ? currentMinDate : minDate,
        dateDefault.SIMPLE_DATE_FORMAT
      )
    ),
    dateToValue(
      dayjs(
        currentMaxDate ? currentMaxDate : maxDate,
        dateDefault.SIMPLE_DATE_FORMAT
      )
    ),
  ]);
  const handleSliderChange = useCallback(
    (_: Event, newValue: number | number[]) => {
      const v = newValue as number[];
      setDateRangeStamp(v);
    },
    []
  );

  return (
    <Grid
      container
      width={
        isMobile
          ? SLIDER_WIDTH_MOBILE
          : isTablet
            ? SLIDER_WIDTH_TABLET
            : SLIDER_WIDTH_DEFAULT
      }
      data-testid={COMPONENT_ID}
      padding={padding.small}
    >
      <Grid item xs={12} container sx={{ paddingX: padding.medium }}>
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
      <Grid
        item
        xs={12}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <Typography
          padding={0}
          fontSize={fontSize.label}
          color={color.gray.light}
        >
          {minDate}
        </Typography>
        <Typography
          padding={0}
          fontSize={fontSize.label}
          color={color.gray.light}
        >
          {maxDate}
        </Typography>
      </Grid>
    </Grid>
  );
};

const MENU_ID = "daterange-show-hide-menu-button";

const DateRange: React.FC<DateRangeControlProps> = ({
  minDate,
  maxDate,
  getAndSetDownloadConditions,
  map,
}) => {
  const [isShowingSelector, setIsShowingSelector] = useState<boolean>(false);
  const [currentMinDate, setCurrentMinDate] = useState<string | undefined>(
    undefined
  );
  const [currentMaxDate, setCurrentMaxDate] = useState<string | undefined>(
    undefined
  );

  const onDateRangeChange = useCallback(
    (
      _: Event | React.SyntheticEvent<Element, Event>,
      dateRangeStamps: number | number[]
    ) => {
      const d = dateRangeStamps as number[];
      const start = dayjs(d[0]).format(dateDefault.SIMPLE_DATE_FORMAT);
      const end = dayjs(d[1]).format(dateDefault.SIMPLE_DATE_FORMAT);

      if (minDate === start && maxDate === end) {
        const prev = getAndSetDownloadConditions(
          DownloadConditionType.DATE_RANGE,
          []
        );
        prev.forEach((p) => {
          const callback: IDownloadConditionCallback =
            p as IDownloadConditionCallback;
          callback.removeCallback && callback.removeCallback();
        });
      } else {
        const dateRangeCondition = new DateRangeCondition(
          "date_range",
          start,
          end,
          () => {
            setCurrentMinDate(undefined);
            setCurrentMaxDate(undefined);
          }
        );
        getAndSetDownloadConditions(DownloadConditionType.DATE_RANGE, [
          dateRangeCondition,
        ]);
        setCurrentMinDate(start);
        setCurrentMaxDate(end);
      }
    },
    [maxDate, minDate, getAndSetDownloadConditions]
  );

  useEffect(() => {
    if (isShowingSelector) {
      const slider: MapControl = new MapControl(
        (
          <DateSlider
            currentMinDate={currentMinDate}
            currentMaxDate={currentMaxDate}
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
  }, [
    currentMaxDate,
    currentMinDate,
    isShowingSelector,
    map,
    maxDate,
    minDate,
    onDateRangeChange,
  ]);

  return (
    <IconButton
      data-testid={MENU_ID}
      onClick={() => setIsShowingSelector((prev) => !prev)}
    >
      <img alt="" src={timeRange} />
    </IconButton>
  );
};

export { MENU_ID, COMPONENT_ID };

export default DateRange;
