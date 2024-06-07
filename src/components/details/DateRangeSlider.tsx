import React, { useState } from "react";
import { Slider, Box, Grid } from "@mui/material";
import dayjs, { Dayjs } from "dayjs";
import { padding } from "../../styles/constants";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

const initialMinDate: Dayjs = dayjs("2000-01-01");
const initialMaxDate: Dayjs = dayjs("2024-01-01");

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

  const handleSliderChange = (
    event: Event,
    newValue: number | number[]
  ): void => {
    setValue(newValue as number[]);
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
            <Slider
              value={value}
              min={dateToValue(minDate)}
              max={dateToValue(maxDate)}
              onChange={handleSliderChange}
              valueLabelDisplay="on"
              valueLabelFormat={(value: number) =>
                valueToDate(value).format("MM/DD/YYYY")
              }
            />
          </Box>
        </Grid>
        <Grid item xs={6}>
          <DatePicker
            label="Start Date"
            value={minDate}
            onChange={handleMinDateChange}
          />
        </Grid>
        <Grid item xs={6}>
          <DatePicker
            label="End Date"
            value={maxDate}
            onChange={handleMaxDateChange}
          />
        </Grid>
      </Grid>
    </LocalizationProvider>
  );
};

export default DateRangeSlider;
