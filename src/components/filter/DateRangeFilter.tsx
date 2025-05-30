import {
  ChangeEvent,
  FC,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import dayjs, { Dayjs } from "dayjs";
import {
  Box,
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
  color,
  fontColor,
  fontFamily,
  fontSize,
  fontWeight,
  gap,
  padding,
} from "../../styles/constants";
import CloseIcon from "@mui/icons-material/Close";
import ReplayIcon from "@mui/icons-material/Replay";
import { dateDefault } from "../common/constants";
import { updateDateTimeFilterRange } from "../common/store/componentParamReducer";
import { useAppDispatch, useAppSelector } from "../common/store/hooks";
import {
  OGCCollection,
  OGCCollections,
} from "../common/store/OGCCollectionDefinitions";
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

// Tolerance in days for matching predefined date ranges
const TOLERANCE_DAYS = 3;

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

const DateRangeFilter: FC<DateRangeFilterProps> = memo(
  ({ handleClosePopup }: DateRangeFilterProps) => {
    const { isMobile, isTablet } = useBreakpoint();
    const dispatch = useAppDispatch();

    // State from redux
    const dateTimeFilterRange = useAppSelector(
      (state) => state.paramReducer.dateTimeFilterRange
    );

    // Local state for date-range-slider
    const [value, setValue] = useState<number[]>([
      dateToValue(initialMinDate),
      dateToValue(initialMaxDate),
    ]);

    // Local state for radio group
    const [selectedOption, setSelectedOption] = useState<DateRangeOptionValues>(
      DateRangeOptionValues.Custom
    );

    // States below are used to store the imos-data ids and all datasets
    // they will be used in TimeRangeBarChart
    const [imosDataIds, setImosDataIds] = useState<string[]>([]);
    const [totalDataset, setTotalDataset] = useState<OGCCollections>(
      new OGCCollections()
    );

    // Memoized derived dates
    const minDate = useMemo(() => valueToDate(value[0]), [value]);
    const maxDate = useMemo(() => valueToDate(value[1]), [value]);

    // Helper to check if given star-end period falls in any of the radio group year-range options
    const determineSelectedOption = useCallback(
      (startDate: Dayjs, endDate: Dayjs): DateRangeOptionValues => {
        // Only consider predefined ranges if the end date is today
        const today = dayjs();
        const isEndDateToday = endDate
          .startOf("day")
          .isSame(today.startOf("day"));

        if (!isEndDateToday) {
          return DateRangeOptionValues.Custom;
        }

        // Calculate years difference between start date and today
        const diffInYears = today.diff(startDate, "year", true);

        // Convert tolerance days to years
        const toleranceInYears = TOLERANCE_DAYS / 365;

        // Find matching period option
        for (const option of dateRangeOptions) {
          if (option.value !== DateRangeOptionValues.Custom) {
            const yearValue = option.value as number;
            // Apply tolerance in year calculation
            if (Math.abs(diffInYears - yearValue) < toleranceInYears) {
              return option.value;
            }
          }
        }

        return DateRangeOptionValues.Custom;
      },
      []
    );

    const handleRadioChange = useCallback(
      (event: ChangeEvent<HTMLInputElement>) => {
        const option = event.target.value as DateRangeOptionValues;
        setSelectedOption(option);

        // If it's custom, don't update the date range
        if (option !== DateRangeOptionValues.Custom) {
          // Convert option to number for year calculation
          const years = Number(option);
          const today = dayjs();
          const startDate = today.subtract(years, "year");
          const newValue = [dateToValue(startDate), dateToValue(today)];

          setValue(newValue);
          dispatch(
            updateDateTimeFilterRange({
              start: newValue[0],
              end: newValue[1],
            })
          );
        }
      },
      [dispatch]
    );

    const handleSliderChange = useCallback(
      (_: Event, newValue: number | number[]): void => {
        if (!Array.isArray(newValue)) return;
        const [newStart, newEnd] = newValue;
        const newMinDate = valueToDate(newStart);
        const newMaxDate = valueToDate(newEnd);

        setValue(newValue);
        setSelectedOption(determineSelectedOption(newMinDate, newMaxDate));
        dispatch(
          updateDateTimeFilterRange({
            start: newStart,
            end: newEnd,
          })
        );
      },
      [determineSelectedOption, dispatch]
    );

    const handleMinDateChange = useCallback(
      (newMinDate: Dayjs | null) => {
        if (newMinDate && dateToValue(newMinDate) < dateToValue(maxDate)) {
          const newStart = dateToValue(newMinDate);
          setValue([newStart, value[1]]);
          setSelectedOption(determineSelectedOption(newMinDate, maxDate));
          dispatch(
            updateDateTimeFilterRange({
              start: newStart,
              end: dateTimeFilterRange?.end,
            })
          );
        }
      },
      [
        dateTimeFilterRange?.end,
        determineSelectedOption,
        dispatch,
        maxDate,
        value,
      ]
    );

    const handleMaxDateChange = useCallback(
      (newMaxDate: Dayjs | null) => {
        if (newMaxDate && dateToValue(newMaxDate) > dateToValue(minDate)) {
          const newEnd = dateToValue(newMaxDate);
          setValue([value[0], newEnd]);
          setSelectedOption(determineSelectedOption(minDate, newMaxDate));
          dispatch(
            updateDateTimeFilterRange({
              start: dateTimeFilterRange?.start,
              end: newEnd,
            })
          );
        }
      },
      [
        dateTimeFilterRange?.start,
        determineSelectedOption,
        dispatch,
        minDate,
        value,
      ]
    );

    const handleClear = useCallback(() => {
      dispatch(updateDateTimeFilterRange({}));
      setValue([dateToValue(initialMinDate), dateToValue(initialMaxDate)]);
      setSelectedOption(DateRangeOptionValues.Custom);
    }, [dispatch]);

    // Listen to redux dateTimeFilterRange to initialize local states
    useEffect(() => {
      if (dateTimeFilterRange) {
        const newMinDate = valueToDate(
          dateTimeFilterRange.start ?? dateToValue(initialMinDate)
        );
        const newMaxDate = valueToDate(
          dateTimeFilterRange.end ?? dateToValue(initialMaxDate)
        );

        setValue([
          dateTimeFilterRange.start ?? dateToValue(initialMinDate),
          dateTimeFilterRange.end ?? dateToValue(initialMaxDate),
        ]);
        setSelectedOption(determineSelectedOption(newMinDate, newMaxDate));
      } else {
        // Reset to initial state when dateTimeFilterRange is null or undefined
        setValue([dateToValue(initialMinDate), dateToValue(initialMaxDate)]);
        setSelectedOption(DateRangeOptionValues.Custom);
      }
    }, [dateTimeFilterRange, determineSelectedOption]);

    useEffect(() => {
      // Find all collection
      dispatch(
        fetchResultNoStore({
          properties: "id,temporal",
          filter: `${cqlDefaultFilters.get("ALL_TIME_RANGE")}`,
        })
      )
        .unwrap()
        .then((value: OGCCollections) => {
          // Find all id of collection from imosOnly
          dispatch(
            fetchResultNoStore({
              properties: "id,providers",
              filter: `${cqlDefaultFilters.get("ALL_TIME_RANGE")} AND ${cqlDefaultFilters.get("IMOS_ONLY")}`,
            })
          )
            .unwrap()
            .then((imosOnlyCollection: OGCCollections) => {
              const ids = imosOnlyCollection.collections.map(
                (value: OGCCollection) => value.id
              );
              setImosDataIds(ids);
              setTotalDataset(value);
            });
        });
    }, [dispatch]);

    return (
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Grid container position="relative">
          <Box
            sx={{
              position: "absolute",
              top: gap.md,
              right: gap.md,
            }}
          >
            <IconButton
              onClick={handleClear}
              sx={{
                bgcolor: color.gray.extraLight,
                "&:hover": {
                  bgcolor: color.blue.darkSemiTransparent,
                },
              }}
            >
              <ReplayIcon sx={{ fontSize: fontSize.info }} />
            </IconButton>
            <IconButton
              onClick={handleClosePopup}
              sx={{
                bgcolor: color.gray.extraLight,
                "&:hover": {
                  bgcolor: color.blue.darkSemiTransparent,
                },
              }}
            >
              <CloseIcon sx={{ fontSize: fontSize.info }} />
            </IconButton>
          </Box>
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
                      format={dateDefault.DISPLAY_FORMAT}
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
                      format={dateDefault.DISPLAY_FORMAT}
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
                        valueToDate(value).format(dateDefault.DISPLAY_FORMAT)
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
                    {initialMinDate.format(dateDefault.DISPLAY_FORMAT)}
                  </Typography>
                  <Typography padding={0} fontSize={fontSize.label}>
                    {initialMaxDate.format(dateDefault.DISPLAY_FORMAT)}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </LocalizationProvider>
    );
  }
);

DateRangeFilter.displayName = "DateRangeFilter";
export default DateRangeFilter;
