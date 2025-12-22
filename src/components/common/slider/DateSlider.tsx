import React, { useCallback, useEffect, useState } from "react";
import { Dayjs } from "dayjs";
import { Grid, Stack, Typography } from "@mui/material";
import { dateToValue, valueToDate } from "../../../utils/DateUtils";
import { dateDefault } from "../constants";
import rc8Theme from "../../../styles/themeRC8";
import { padding } from "../../../styles/constants";
import PlainSlider from "./PlainSlider";

interface DateSliderProps {
  visible?: boolean;
  currentMinDate: Dayjs | undefined;
  currentMaxDate: Dayjs | undefined;
  minDate: Dayjs;
  maxDate: Dayjs;
  optionMidDate?: Date | undefined;
  onDateRangeChange: (
    event: Event | React.SyntheticEvent<Element, Event>,
    value: number | number[]
  ) => void;
}

const COMPONENT_ID = "dateslider-daterange-menu-button";

const DateSlider: React.FC<DateSliderProps> = ({
  currentMinDate,
  currentMaxDate,
  minDate,
  maxDate,
  onDateRangeChange,
}) => {
  const [dateRangeStamp, setDateRangeStamp] = useState<number[]>([
    dateToValue(currentMinDate ? currentMinDate : minDate),
    dateToValue(currentMaxDate ? currentMaxDate : maxDate),
  ]);

  const handleSliderChange = useCallback(
    (_: Event, newValue: number | number[]) => {
      const v = newValue as number[];
      setDateRangeStamp(v);
    },
    []
  );

  useEffect(() => {
    const newDateRangeStamp = [
      dateToValue(currentMinDate ? currentMinDate : minDate),
      dateToValue(currentMaxDate ? currentMaxDate : maxDate),
    ];
    setDateRangeStamp(newDateRangeStamp);
  }, [currentMinDate, currentMaxDate, minDate, maxDate]);

  return (
    <Grid
      container
      sx={{
        backgroundColor: rc8Theme.palette.primary6,
        borderRadius: "6px",
        display: "flex",
        width: "100%",
        mx: "8px",
      }}
      data-testid={COMPONENT_ID}
    >
      <Grid
        item
        xs={12}
        container
        sx={{
          px: padding.medium,
          pt: { xs: "24px", md: padding.small },
        }}
      >
        <Stack
          width="100%"
          direction="row"
          alignItems="center"
          mx={{ xs: "18px", sm: "6px" }}
          gap="16px"
        >
          <Typography
            sx={{
              ...rc8Theme.typography.title1Medium,
              color: rc8Theme.palette.text1,
              whiteSpace: "nowrap",
              mr: "8px",
              display: { xs: "none", sm: "block" },
            }}
          >
            Start Date
          </Typography>
          <PlainSlider
            value={dateRangeStamp}
            min={dateToValue(minDate)}
            max={dateToValue(maxDate)}
            onChangeCommitted={(_, value) => onDateRangeChange(_, value)}
            onChange={handleSliderChange}
            valueLabelDisplay="auto"
            valueLabelFormat={(value: number) =>
              valueToDate(value).format(dateDefault.DISPLAY_FORMAT)
            }
          />
          <Typography
            sx={{
              ...rc8Theme.typography.title1Medium,
              color: rc8Theme.palette.text1,
              whiteSpace: "nowrap",
              ml: "8px",
              display: { xs: "none", sm: "block" },
            }}
          >
            On going
          </Typography>
        </Stack>
      </Grid>
      <Grid
        item
        xs={12}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        sx={{
          mx: "20px",
          mt: { xs: "2px", md: "6px" },
          mb: { xs: "2px", md: "6px" },
        }}
      >
        <Typography
          sx={{
            ...rc8Theme.typography.body1Medium,
            color: rc8Theme.palette.text1,
          }}
        >
          {minDate.format(dateDefault.DISPLAY_FORMAT)}
        </Typography>
        <Typography
          sx={{
            ...rc8Theme.typography.body1Medium,
            color: rc8Theme.palette.text1,
          }}
        >
          {maxDate.format(dateDefault.DISPLAY_FORMAT)}
        </Typography>
      </Grid>
    </Grid>
  );
};

export default DateSlider;
