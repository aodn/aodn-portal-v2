import React, { useCallback, useState } from "react";
import useBreakpoint from "../../../../../hooks/useBreakpoint";
import { dateToValue, valueToDate } from "../../../../../utils/DateUtils";
import dayjs from "dayjs";
import { dateDefault } from "../../../../common/constants";
import { Grid, Typography } from "@mui/material";
import { color, fontSize, padding } from "../../../../../styles/constants";
import PlainSlider from "../../../../common/slider/PlainSlider";
import { COMPONENT_ID } from "./DateRange";
import {
  DateRangeCondition,
  DownloadConditionType,
  IDownloadCondition,
  IDownloadConditionCallback,
} from "../../../../../pages/detail-page/context/DownloadDefinitions";

interface DateSliderProps {
  currentMinDate?: string | undefined;
  currentMaxDate?: string | undefined;
  minDate: string;
  maxDate: string;
  getAndSetDownloadConditions: (
    type: DownloadConditionType,
    conditions: IDownloadCondition[]
  ) => IDownloadCondition[];
}

const SLIDER_WIDTH_DEFAULT = 600;
const SLIDER_WIDTH_TABLET = 400;
const SLIDER_WIDTH_MOBILE = 250;

const DateSlider: React.FC<DateSliderProps> = ({
  minDate,
  maxDate,
  getAndSetDownloadConditions,
}) => {
  const { isMobile, isTablet } = useBreakpoint();
  const [currentMinDate, setCurrentMinDate] = useState<string | undefined>(
    undefined
  );
  const [currentMaxDate, setCurrentMaxDate] = useState<string | undefined>(
    undefined
  );
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
      paddingY={padding.extraSmall}
      paddingX={padding.small}
    >
      <Grid
        item
        xs={12}
        container
        sx={{ paddingX: padding.medium, pt: padding.small }}
      >
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

export default DateSlider;
