import {
  Dispatch,
  FC,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import {
  Box,
  Button,
  Divider,
  FormControl,
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";
import dayjs, { Dayjs } from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import {
  border,
  color,
  fontColor,
  fontFamily,
  fontSize,
  fontWeight,
  margin,
  padding,
} from "../../../styles/constants";
import DateRangeIcon from "@mui/icons-material/DateRange";
import { dateDefault } from "../constants";
import { ParameterState } from "../store/componentParamReducer";
import TimeRangeBarChart from "../charts/TimeRangeBarChart";
import { OGCCollections } from "../store/OGCCollectionDefinitions";
import { fetchResultNoStore } from "../store/searchReducer";
import { cqlDefaultFilters } from "../cqlFilters";
import PlainDatePicker from "../datetime/PlainDatePicker";
import PlainSlider from "../slider/PlainSlider";
import { DEFAULT_DATE_PICKER_SLOT } from "../../details/DateRangeSlider";
import { useAppDispatch } from "../store/hooks";

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

// Utility function to convert a date to a numeric value
const dateToValue = (date: Dayjs): number => date.valueOf();

// Utility function to convert a numeric value back to a date
const valueToDate = (value: number): Dayjs => dayjs(value);

interface DateRangeFilterProps {
  filter: ParameterState;
  setFilter: Dispatch<SetStateAction<ParameterState>>;
  handleApplyFilter: (filter: ParameterState) => void;
}

const DateRange: FC<DateRangeFilterProps> = ({
  filter,
  setFilter,
  handleApplyFilter,
}) => {
  const dispatch = useAppDispatch();
  const { dateTimeFilterRange } = filter;
  const [selectedOption, setSelectedOption] = useState<DateRangeOptionValues>(
    DateRangeOptionValues.Custom
  );
  const [minDate, setMinDate] = useState<Dayjs>(initialMinDate);
  const [maxDate, setMaxDate] = useState<Dayjs>(initialMaxDate);
  const [value, setValue] = useState<number[]>([
    dateTimeFilterRange?.start ?? dateToValue(dayjs(dateDefault.min)),
    dateTimeFilterRange?.end ?? dateToValue(dayjs(dateDefault.max)),
  ]);

  const updateDateRange = useCallback(
    (startDate: Dayjs, endDate: Dayjs) => {
      const newStart = dateToValue(startDate);
      const newEnd = dateToValue(endDate);

      setMinDate(startDate);
      setMaxDate(endDate);
      setValue([newStart, newEnd]);

      setFilter((prevFilter) => ({
        ...prevFilter,
        dateTimeFilterRange: {
          start: newStart,
          end: newEnd,
        },
      }));
    },
    [setFilter]
  );

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

      setFilter((prevFilter) => ({
        ...prevFilter,
        dateTimeFilterRange: {
          start: newStart,
          end: newEnd,
        },
      }));
    },
    [setFilter]
  );

  const handleMinDateChange = useCallback(
    (newMinDate: Dayjs | null) => {
      if (newMinDate && dateToValue(newMinDate) < dateToValue(maxDate)) {
        const newStart = dateToValue(newMinDate);
        setMinDate(newMinDate);
        setValue([newStart, value[1]]);
        setSelectedOption(DateRangeOptionValues.Custom);

        setFilter((prevFilter) => ({
          ...prevFilter,
          dateTimeFilterRange: {
            ...prevFilter.dateTimeFilterRange,
            start: newStart,
          },
        }));
      }
    },
    [maxDate, setFilter, value]
  );

  const handleMaxDateChange = useCallback(
    (newMaxDate: Dayjs | null) => {
      if (newMaxDate && dateToValue(newMaxDate) > dateToValue(minDate)) {
        const newEnd = dateToValue(newMaxDate);
        setMaxDate(newMaxDate);
        setValue([value[0], newEnd]);
        setSelectedOption(DateRangeOptionValues.Custom);

        setFilter((prevFilter) => ({
          ...prevFilter,
          dateTimeFilterRange: {
            ...prevFilter.dateTimeFilterRange,
            end: newEnd,
          },
        }));
      }
    },
    [minDate, setFilter, value]
  );

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
    } else {
      // Reset to initial state when dateTimeFilterRange is null or undefined
      setMinDate(initialMinDate);
      setMaxDate(initialMaxDate);
      setValue([dateToValue(initialMinDate), dateToValue(initialMaxDate)]);
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
      <Grid container>
        <Grid
          item
          xs={2}
          display="flex"
          justifyContent="center"
          alignItems="start"
        >
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            padding={padding.large}
          >
            <FormControl>
              <RadioGroup
                defaultValue={DateRangeOptionValues.Custom}
                value={selectedOption}
                onChange={handleRadioChange}
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

          <Divider
            sx={{
              borderColor: color.blue.darkSemiTransparent,
            }}
            orientation="vertical"
          />
        </Grid>
        <Grid item xs={8}>
          <Grid container padding={padding.large}>
            <Grid
              item
              xs={12}
              sx={{ display: "flex", justifyContent: "center" }}
            >
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                width="100%"
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
                    End&nbsp;Date
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
          xs={2}
          display="flex"
          flexDirection="column"
          justifyContent="end"
          alignItems="center"
          paddingY={padding.large}
        >
          <Button
            sx={{
              width: "100px",
              marginBottom: margin.lg,
              border: `${border.sm} ${color.blue.darkSemiTransparent}`,
              "&:hover": {
                border: `${border.sm} ${color.blue.darkSemiTransparent}`,
                backgroundColor: color.blue.darkSemiTransparent,
              },
            }}
            onClick={() => handleApplyFilter(filter)}
          >
            Clear
          </Button>
          <Button
            sx={{
              width: "100px",
              border: `${border.sm} ${color.blue.darkSemiTransparent}`,
              "&:hover": {
                border: `${border.sm} ${color.blue.darkSemiTransparent}`,
                backgroundColor: color.blue.darkSemiTransparent,
              },
            }}
            onClick={() => handleApplyFilter(filter)}
          >
            Apply
          </Button>
        </Grid>
      </Grid>
    </LocalizationProvider>
  );
};

export default DateRange;
