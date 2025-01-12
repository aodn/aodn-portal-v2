import { FC, useCallback, useEffect, useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import {
  Box,
  Button,
  Divider,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import {
  border,
  color,
  fontColor,
  fontFamily,
  fontSize,
  fontWeight,
  gap,
  padding,
} from "../../styles/constants";
import CloseIcon from "@mui/icons-material/Close";
import { dateDefault } from "../common/constants";
import {
  DataTimeFilterRange,
  updateDateTimeFilterRange,
} from "../common/store/componentParamReducer";
import { useAppDispatch } from "../common/store/hooks";
import store, { getComponentState } from "../common/store/store";
import { OGCCollections } from "../common/store/OGCCollectionDefinitions";
import { fetchResultNoStore } from "../common/store/searchReducer";
import { cqlDefaultFilters } from "../common/cqlFilters";
import TimeRangeBarChart from "../common/charts/TimeRangeBarChart";
import PlainDatePicker from "../common/datetime/PlainDatePicker";
import PlainSlider from "../common/slider/PlainSlider";
import { DEFAULT_DATE_PICKER_SLOT } from "../details/DateRangeSlider";
import { dateToValue, valueToDate } from "../../utils/DateUtils";
import useBreakpoint from "../../hooks/useBreakpoint";

enum DateRangeOptionValues {
  Custom = "custom",
  LastYear = 1,
  LastFiveYears = 5,
  LastTenYears = 10,
}

interface DateRangeOption {
  label: string;
  value: DateRangeOptionValues;
}

const dateRangeOptions: DateRangeOption[] = [
  { label: "Custom", value: DateRangeOptionValues.Custom },
  { label: "Last Year", value: DateRangeOptionValues.LastYear },
  { label: "Last 5 Years", value: DateRangeOptionValues.LastFiveYears },
  { label: "Last 10 Years", value: DateRangeOptionValues.LastTenYears },
];

const initialMinDate: Dayjs = dayjs(dateDefault.min);
const initialMaxDate: Dayjs = dayjs(dateDefault.max);

interface DateRangeFilterProps {
  handleClosePopup: () => void;
}

const DateRangeFilter: FC<DateRangeFilterProps> = ({ handleClosePopup }) => {
  const { isMobile, isTablet } = useBreakpoint();
  const dispatch = useAppDispatch();

  // State from redux
  const { dateTimeFilterRange } = getComponentState(store.getState());

  // Local state for date range
  const [dateRange, setDateRange] = useState<DataTimeFilterRange>({});

  // Local state for min/max date picker
  const [minDate, setMinDate] = useState<Dayjs>(initialMinDate);
  const [maxDate, setMaxDate] = useState<Dayjs>(initialMaxDate);

  // Local state for date-range-slider
  const [value, setValue] = useState<number[]>([
    dateTimeFilterRange?.start ?? dateToValue(dayjs(dateDefault.min)),
    dateTimeFilterRange?.end ?? dateToValue(dayjs(dateDefault.max)),
  ]);

  // Local state for radio group
  const [selectedOption, setSelectedOption] = useState<DateRangeOptionValues>(
    DateRangeOptionValues.Custom
  );

  // Helper to sync date range when radio change
  const updateDateRange = useCallback((startDate: Dayjs, endDate: Dayjs) => {
    const newStart = dateToValue(startDate);
    const newEnd = dateToValue(endDate);

    setMinDate(startDate);
    setMaxDate(endDate);
    setValue([newStart, newEnd]);
    setDateRange({
      start: newStart,
      end: newEnd,
    });
  }, []);

  const handleRadioChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const option = event.target.value;
      setSelectedOption(option as DateRangeOptionValues);

      // If it's custom, don't update the date range
      if (option === DateRangeOptionValues.Custom) {
        return;
      }

      // Convert option to number for year calculation
      const years = Number(option);
      const today = dayjs();
      const startDate = today.subtract(years, "year");

      updateDateRange(startDate, today);
    },
    [updateDateRange]
  );

  const handleSliderChange = useCallback(
    (_: Event, newValue: number | number[]): void => {
      if (!Array.isArray(newValue)) return;
      const [newStart, newEnd] = newValue;

      setValue(newValue);
      setMinDate(dayjs(newStart));
      setMaxDate(dayjs(newEnd));
      setSelectedOption(DateRangeOptionValues.Custom);
      setDateRange({
        start: newStart,
        end: newEnd,
      });
    },
    []
  );

  const handleMinDateChange = useCallback(
    (newMinDate: Dayjs | null) => {
      if (newMinDate && dateToValue(newMinDate) < dateToValue(maxDate)) {
        const newStart = dateToValue(newMinDate);
        setMinDate(newMinDate);
        setValue([newStart, value[1]]);
        setSelectedOption(DateRangeOptionValues.Custom);
        setDateRange((preDateRange) => ({
          ...preDateRange,
          start: newStart,
        }));
      }
    },
    [maxDate, value]
  );

  const handleMaxDateChange = useCallback(
    (newMaxDate: Dayjs | null) => {
      if (newMaxDate && dateToValue(newMaxDate) > dateToValue(minDate)) {
        const newEnd = dateToValue(newMaxDate);
        setMaxDate(newMaxDate);
        setValue([value[0], newEnd]);
        setSelectedOption(DateRangeOptionValues.Custom);
        setDateRange((preDateRange) => ({
          ...preDateRange,
          start: newEnd,
        }));
      }
    },
    [minDate, value]
  );

  const handleClear = useCallback(() => {
    setDateRange({});
    setMinDate(initialMinDate);
    setMaxDate(initialMaxDate);
    setValue([dateToValue(initialMinDate), dateToValue(initialMaxDate)]);
    setSelectedOption(DateRangeOptionValues.Custom);
  }, []);

  const handleApply = useCallback(
    (dateRange: DataTimeFilterRange) => {
      if (dateRange) {
        dispatch(updateDateTimeFilterRange(dateRange));
      } else {
        dispatch(updateDateTimeFilterRange({}));
      }
      handleClosePopup();
    },
    [dispatch, handleClosePopup]
  );

  const handleClose = useCallback(() => {
    handleClear();
    handleClosePopup();
  }, [handleClear, handleClosePopup]);

  // Listen to redux dateTimeFilterRange to initialize local states
  useEffect(() => {
    if (dateTimeFilterRange) {
      setMinDate(
        valueToDate(dateTimeFilterRange.start ?? dateToValue(initialMinDate))
      );
      setMaxDate(
        valueToDate(dateTimeFilterRange.end ?? dateToValue(initialMaxDate))
      );
      setValue([
        dateTimeFilterRange.start ?? dateToValue(initialMinDate),
        dateTimeFilterRange.end ?? dateToValue(initialMaxDate),
      ]);
      setDateRange(dateTimeFilterRange);
    } else {
      // Reset to initial state when dateTimeFilterRange is null or undefined
      setMinDate(initialMinDate);
      setMaxDate(initialMaxDate);
      setValue([dateToValue(initialMinDate), dateToValue(initialMaxDate)]);
      setDateRange({});
    }
  }, [dateTimeFilterRange]);

  // States below are used to store the imos-data ids and all datasets
  // they will be used in TimeRangeBarChart
  const [imosDataIds, setImosDataIds] = useState<string[]>([]);
  const [totalDataset, setTotalDataset] = useState<OGCCollections>(
    new OGCCollections()
  );

  useEffect(() => {
    // Find all collection
    dispatch(
      fetchResultNoStore({
        properties: "id,temporal",
        filter: `${cqlDefaultFilters.get("ALL_TIME_RANGE")}`,
      })
    )
      .unwrap()
      .then((value) => {
        // Find all id of collection from imosOnly
        dispatch(
          fetchResultNoStore({
            properties: "id,providers",
            filter: `${cqlDefaultFilters.get("ALL_TIME_RANGE")} AND ${cqlDefaultFilters.get("IMOS_ONLY")}`,
          })
        )
          .unwrap()
          .then((imosOnlyCollection: OGCCollections) => {
            const ids = imosOnlyCollection.collections.map((value) => value.id);
            setImosDataIds(ids);
            setTotalDataset(value);
          });
      });
  }, [dispatch]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Grid container position="relative">
        <IconButton
          onClick={handleClose}
          sx={{
            position: "absolute",
            top: gap.md,
            right: gap.md,
            bgcolor: color.gray.extraLight,
          }}
        >
          <CloseIcon />
        </IconButton>
        <Grid
          item
          xs={isMobile || isTablet ? 12 : 2}
          display="flex"
          justifyContent="center"
          alignItems="start"
        >
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            p={padding.large}
            pt={isMobile || isTablet ? padding.large : padding.triple}
          >
            <FormControl>
              <RadioGroup
                defaultValue={DateRangeOptionValues.Custom}
                value={selectedOption}
                onChange={handleRadioChange}
                sx={{
                  flexDirection: { xs: "column", sm: "row", md: "column" },
                }}
              >
                {dateRangeOptions.map((item) => (
                  <FormControlLabel
                    value={item.value}
                    control={<Radio />}
                    label={item.label}
                    key={item.value}
                    sx={{
                      ".MuiFormControlLabel-label": {
                        fontFamily: fontFamily.general,
                        fontSize: fontSize.info,
                        padding: 0,
                      },
                    }}
                  />
                ))}
              </RadioGroup>
            </FormControl>
          </Box>
        </Grid>

        <Grid item xs={isMobile || isTablet ? 12 : 10}>
          <Grid
            container
            p={padding.large}
            pt={isMobile || isTablet ? padding.large : padding.triple}
          >
            <Grid
              item
              xs={12}
              sx={{ display: "flex", justifyContent: "center" }}
            >
              <Box
                display="flex"
                flexDirection={isMobile ? "column" : "row"}
                justifyContent="space-between"
                alignItems="center"
                width="100%"
                gap={2}
              >
                <Box display="flex" alignItems="center">
                  <Typography
                    padding={0}
                    paddingRight={padding.large}
                    fontSize={fontSize.info}
                    fontWeight={fontWeight.bold}
                    color={fontColor.blue.dark}
                  >
                    Start&nbsp;Date
                  </Typography>
                  <PlainDatePicker
                    views={["year", "month", "day"]}
                    format="DD/MM/YYYY"
                    value={minDate}
                    minDate={initialMinDate}
                    maxDate={valueToDate(value[1])}
                    onChange={(date) => handleMinDateChange(date as Dayjs)}
                    slotProps={DEFAULT_DATE_PICKER_SLOT}
                  />
                </Box>
                <Box display="flex" alignItems="center">
                  <Typography
                    padding={0}
                    paddingRight={padding.large}
                    fontSize={fontSize.info}
                    fontWeight={fontWeight.bold}
                    color={fontColor.blue.dark}
                  >
                    End&nbsp;&nbsp;&nbsp;Date
                  </Typography>
                  <PlainDatePicker
                    views={["year", "month", "day"]}
                    format="DD/MM/YYYY"
                    value={maxDate}
                    minDate={valueToDate(value[0])}
                    maxDate={initialMaxDate}
                    onChange={(date) => handleMaxDateChange(date as Dayjs)}
                    slotProps={DEFAULT_DATE_PICKER_SLOT}
                  />
                </Box>
              </Box>
            </Grid>
            {!isMobile && (
              <Grid
                item
                xs={12}
                display="flex"
                justifyContent="center"
                alignItems="center"
              >
                <Box sx={{ width: "100%" }}>
                  <TimeRangeBarChart
                    imosDataIds={imosDataIds}
                    totalDataset={totalDataset}
                    selectedStartDate={minDate.toDate()}
                    selectedEndDate={maxDate.toDate()}
                  />
                </Box>
              </Grid>
            )}
            <Grid container>
              <Grid
                item
                xs={12}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Box sx={{ width: "90%", paddingTop: padding.extraLarge }}>
                  <PlainSlider
                    value={value}
                    min={dateToValue(initialMinDate)}
                    max={dateToValue(initialMaxDate)}
                    onChange={handleSliderChange}
                    valueLabelDisplay="auto"
                    valueLabelFormat={(value: number) =>
                      valueToDate(value).format("DD/MM/YYYY")
                    }
                  />
                </Box>
              </Grid>
              <Grid
                item
                xs={12}
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography padding={0} fontSize={fontSize.label}>
                  {initialMinDate.format("DD/MM/YYYY")}
                </Typography>
                <Typography padding={0} fontSize={fontSize.label}>
                  {initialMaxDate.format("DD/MM/YYYY")}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid
          item
          xs={12}
          display="flex"
          flexDirection="row"
          justifyContent="end"
          alignItems="center"
          gap={2}
          pr={2}
          pb={2}
        >
          <Button
            onClick={() => handleApply(dateRange)}
            sx={{
              width: "100px",
              border: `${border.sm} ${color.blue.darkSemiTransparent}`,
              "&:hover": {
                border: `${border.sm} ${color.blue.darkSemiTransparent}`,
                backgroundColor: color.blue.darkSemiTransparent,
              },
            }}
          >
            Apply
          </Button>
          <Button
            onClick={handleClear}
            sx={{
              width: "100px",

              border: `${border.sm} ${color.blue.darkSemiTransparent}`,
              "&:hover": {
                border: `${border.sm} ${color.blue.darkSemiTransparent}`,
                backgroundColor: color.blue.darkSemiTransparent,
              },
            }}
          >
            Clear
          </Button>
        </Grid>
      </Grid>
    </LocalizationProvider>
  );
};

export default DateRangeFilter;
