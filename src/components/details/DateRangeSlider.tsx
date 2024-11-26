import React, { useState } from "react";
import { Slider, Box, Grid, styled } from "@mui/material";
import dayjs, { Dayjs } from "dayjs";
import {
  border,
  borderRadius,
  color,
  fontColor,
  fontSize,
  fontWeight,
  padding,
} from "../../styles/constants";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { dateDefault } from "../common/constants";

export const DEFAULT_DATE_PICKER_SLOT = {
  desktopPaper: {
    sx: {
      border: `${border.sm} ${color.blue.darkSemiTransparent}`,
      borderRadius: borderRadius.small,
      width: "350px",
      ".MuiPickersYear-yearButton": {
        color: fontColor.gray.dark,
        padding: 0,
      },
      ".MuiPickersYear-yearButton.Mui-selected": {
        color: "#fff",
        backgroundColor: color.blue.dark,
      },
      ".MuiPickersMonth-monthButton": {
        color: fontColor.gray.dark,
        padding: 0,
      },

      ".MuiPickersMonth-monthButton.Mui-selected": {
        color: "#fff",
        backgroundColor: color.blue.dark,
      },
    },
  },
};

const initialMinDate: Dayjs = dayjs(dateDefault.min);
const initialMaxDate: Dayjs = dayjs(dateDefault.max);

// Utility function to convert a date to a numeric value
const dateToValue = (date: Dayjs): number => date.valueOf();

// Utility function to convert a numeric value back to a date
const valueToDate = (value: number): Dayjs => dayjs(value);

const DateRangeSlider: React.FC = () => {
  const [minDate, setMinDate] = useState<Dayjs>(initialMinDate);
  const [maxDate, setMaxDate] = useState<Dayjs>(initialMaxDate);
  const [value, setValue] = useState<number[]>([
    dateToValue(minDate),
    dateToValue(maxDate),
  ]);

  const handleSliderChange = (_: Event, newValue: number | number[]): void => {
    setValue(newValue as number[]);
    if (!Array.isArray(newValue)) return;
    setMinDate(valueToDate(newValue[0]));
    setMaxDate(valueToDate(newValue[1]));
  };

  const handleMinDateChange = (newMinDate: Dayjs | null) => {
    if (newMinDate && newMinDate.isBefore(maxDate)) {
      setMinDate(newMinDate);
      setValue([dateToValue(newMinDate), value[1]]);
    }
  };

  const handleMaxDateChange = (newMaxDate: Dayjs | null) => {
    if (newMaxDate && newMaxDate.isAfter(minDate)) {
      setMaxDate(newMaxDate);
      setValue([value[0], dateToValue(newMaxDate)]);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Grid container>
        <Grid
          item
          xs={12}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
          }}
        >
          <Box sx={{ width: "90%", paddingTop: padding.extraLarge }}>
            <PlainSlider
              value={value}
              min={dateToValue(initialMinDate)}
              max={dateToValue(initialMaxDate)}
              onChange={handleSliderChange}
              valueLabelDisplay="on"
              valueLabelFormat={(value: number) =>
                valueToDate(value).format("MM/YYYY")
              }
            />
          </Box>
        </Grid>
        <Grid
          item
          xs={6}
          sx={{
            display: "flex",
            justifyContent: "start",
            alignItems: "center",
          }}
        >
          <PlainDatePicker
            views={["month", "year"]}
            format="MM/YYYY"
            value={minDate}
            minDate={initialMinDate}
            maxDate={valueToDate(value[1])}
            onChange={(date) => handleMinDateChange(date as Dayjs)}
            slotProps={{
              inputAdornment: {
                position: "start",
              },
              ...DEFAULT_DATE_PICKER_SLOT,
            }}
          />
        </Grid>
        <Grid
          item
          xs={6}
          sx={{ display: "flex", justifyContent: "end", alignItems: "center" }}
        >
          <PlainDatePicker
            views={["month", "year"]}
            format="MM/YYYY"
            value={maxDate}
            minDate={valueToDate(value[0])}
            maxDate={initialMaxDate}
            onChange={(date) => handleMaxDateChange(date as Dayjs)}
            slotProps={DEFAULT_DATE_PICKER_SLOT}
          />
        </Grid>
      </Grid>
    </LocalizationProvider>
  );
};

export default DateRangeSlider;

const PlainDatePicker = styled(DatePicker)(() => ({
  backgroundColor: "transparent",
  width: "100px",
  "& fieldset": {
    border: "none",
  },
  "& input": {
    fontSize: "14px",
    color: fontColor.gray.dark,
    fontWeight: fontWeight.regular,
    padding: 0,
    textAlign: "center",
  },
  "& .MuiInputBase-root": {
    padding: 0,
  },
}));

const PlainSlider = styled(Slider)(() => ({
  "& .MuiSlider-valueLabel": {
    fontSize: fontSize.info,
    fontWeight: fontWeight.regular,
    color: fontColor.gray.medium,
    top: -6,
    backgroundColor: "transparent",
  },
}));
