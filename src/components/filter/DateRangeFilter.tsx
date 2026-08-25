import {
  ChangeEvent,
  FC,
  memo,
  startTransition,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Dayjs } from "@/utils/DayjsUtils";
import {
  Box,
  Divider,
  FormControl,
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";
import { color, padding } from "@/styles/constants";
import { dateDefault } from "../common/constants";
import { updateDateTimeFilterRange } from "@/app/store/componentParamReducer";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import {
  OGCCollection,
  OGCCollections,
} from "@/app/store/OGCCollectionDefinitions";
import {
  fetchResultNoStore,
  jsonToOGCCollections,
} from "@/app/store/searchReducer";
import {
  cqlDefaultFilters,
  DatasetGroup,
  TemporalDuring,
} from "../common/cqlFilters";
import TimeRangeBarChart from "../common/charts/TimeRangeBarChart";
import PlainDatePicker from "../common/datetime/PlainDatePicker";
import PlainSlider from "../common/slider/PlainSlider";
import {
  dateToValue,
  toAppDayjs,
  toUtcEndOfDay,
  toUtcStartOfDay,
  valueToDate,
} from "@/utils/DateUtils";
import useBreakpoint from "../../hooks/useBreakpoint";
import theme from "../../styles/themeRC8";
import { CalendarIcon } from "../../assets/icons/search/calendar";
import { DEFAULT_DATE_PICKER_SLOT } from "../common/datetime/datePickerSlots";
import { TestHelper } from "../common/test/helper";

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
  { label: "Last year", value: DateRangeOptionValues.LastYear },
  { label: "Last 5 years", value: DateRangeOptionValues.LastFiveYears },
  { label: "Last 10 years", value: DateRangeOptionValues.LastTenYears },
];

const initialMinDate: Dayjs = dateDefault.min;
const initialMaxDate: Dayjs = dateDefault.max;

interface DateRangeFilterProps {}

const DateRangeFilter: FC<DateRangeFilterProps> = memo(() => {
  const { isMobile, isTablet } = useBreakpoint();
  const dispatch = useAppDispatch();

  // State from redux
  const dateTimeFilterRange = useAppSelector(
    (state) => state.paramReducer.dateTimeFilterRange
  );

  // Local state for date-range-slider
  const [value, setValue] = useState<number[]>([
    dateToValue(toUtcStartOfDay(initialMinDate)),
    dateToValue(toUtcEndOfDay(initialMaxDate)),
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
      const today = toAppDayjs();
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
        const today = toAppDayjs();
        const startDate = toUtcStartOfDay(today.subtract(years, "year"));
        const newValue = [
          dateToValue(startDate),
          dateToValue(toUtcEndOfDay(today)),
        ];

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
      const newStart = dateToValue(toUtcStartOfDay(valueToDate(newValue[0])));
      const newEnd = dateToValue(toUtcEndOfDay(valueToDate(newValue[1])));
      const newMinDate = valueToDate(newStart);
      const newMaxDate = valueToDate(newEnd);

      setValue([newStart, newEnd]);
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
      // Date-only picker: the chosen calendar day at UTC 00:00:00, not host midnight.
      const localMinDate = newMinDate ? toUtcStartOfDay(newMinDate) : null;

      if (localMinDate && dateToValue(localMinDate) < dateToValue(maxDate)) {
        const newStart = dateToValue(localMinDate);
        setValue([newStart, value[1]]);
        setSelectedOption(determineSelectedOption(localMinDate, maxDate));
        dispatch(
          updateDateTimeFilterRange({
            start: newStart,
            end: value[1],
          })
        );
      }
    },
    [determineSelectedOption, dispatch, maxDate, value]
  );

  const handleMaxDateChange = useCallback(
    (newMaxDate: Dayjs | null) => {
      // Date-only picker: the chosen calendar day at UTC 23:59:59, not host local.
      const localMaxDate = newMaxDate ? toUtcEndOfDay(newMaxDate) : null;

      if (localMaxDate && dateToValue(localMaxDate) > dateToValue(minDate)) {
        const newEnd = dateToValue(localMaxDate);
        setValue([value[0], newEnd]);
        setSelectedOption(determineSelectedOption(minDate, localMaxDate));
        dispatch(
          updateDateTimeFilterRange({
            start: value[0],
            end: newEnd,
          })
        );
      }
    },
    [determineSelectedOption, dispatch, minDate, value]
  );

  const renderFilterBy = useCallback(
    (isMobile: boolean, isTablet: boolean) => (
      <Grid
        display="flex"
        justifyContent="flex-start"
        alignItems="flex-start"
        // Must be a direct Grid child of the container (no Fragment).
        // Do not set width:100% — it overrides `size` and stacks columns.
        sx={{
          order: isMobile || isTablet ? 3 : 1,
          borderRight:
            isMobile || isTablet
              ? "none"
              : `1px solid ${color.gray.extraLight}`,
        }}
        size={isMobile || isTablet ? 12 : 2}
      >
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="flex-start"
          alignItems="flex-start"
          p={padding.large}
          pt={isMobile || isTablet ? padding.large : padding.triple}
          width="100%"
        >
          <Typography mb={2} variant="title1Medium">
            Filter by
          </Typography>
          <FormControl sx={{ paddingLeft: "20px" }}>
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
                  control={
                    <Radio
                      sx={{
                        "&.Mui-checked": {
                          color: theme.palette.secondary2,
                        },
                      }}
                    />
                  }
                  label={item.label}
                  key={item.value}
                  data-testid={`radio-${item.label}`}
                  slotProps={{
                    typography: {
                      variant: "body2Regular",
                      sx: { padding: 0 },
                    },
                  }}
                />
              ))}
            </RadioGroup>
          </FormControl>
        </Box>
      </Grid>
    ),
    [handleRadioChange, selectedOption]
  );

  // Listen to redux dateTimeFilterRange to initialize local states
  useEffect(() => {
    // Avoid eslint error on set state in useEffect
    startTransition(() => {
      if (dateTimeFilterRange) {
        const fallbackMin = dateToValue(toUtcStartOfDay(initialMinDate));
        const fallbackMax = dateToValue(toUtcEndOfDay(initialMaxDate));
        const newMinDate = valueToDate(
          dateTimeFilterRange.start ?? fallbackMin
        );
        const newMaxDate = valueToDate(dateTimeFilterRange.end ?? fallbackMax);

        setValue([
          dateTimeFilterRange.start ?? fallbackMin,
          dateTimeFilterRange.end ?? fallbackMax,
        ]);
        setSelectedOption(determineSelectedOption(newMinDate, newMaxDate));
      } else {
        // Reset to initial state when dateTimeFilterRange is null or undefined
        setValue([
          dateToValue(toUtcStartOfDay(initialMinDate)),
          dateToValue(toUtcEndOfDay(initialMaxDate)),
        ]);
        setSelectedOption(DateRangeOptionValues.Custom);
      }
    });
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
      .then((value: string) => {
        // Find all id of collection from imosOnly
        dispatch(
          fetchResultNoStore({
            properties: "id,providers",
            filter: `${cqlDefaultFilters.get("ALL_TIME_RANGE")} AND ${(cqlDefaultFilters.get("DATASET_GROUP") as DatasetGroup)("imos")}`,
          })
        )
          .unwrap()
          .then((imosOnlyCollection: string) => {
            const ids = jsonToOGCCollections(
              imosOnlyCollection
            ).collections.map((value: OGCCollection) => value.id);
            setImosDataIds(ids);
            setTotalDataset(jsonToOGCCollections(value));
          });
      });
  }, [dispatch]);

  return (
    <>
      {/*
        Grid v2: only the *container* should force full width.
        Column items must rely on `size` — width:100% on them stacks the layout.
      */}
      <Grid container position="relative" sx={{ width: "100%" }}>
        {(isMobile || isTablet) && (
          <Grid sx={{ order: 2 }} size={12}>
            <Divider sx={{ borderColor: theme.palette.primary4 }} />
          </Grid>
        )}
        <Grid
          sx={{ order: isMobile || isTablet ? 1 : 2 }}
          size={isMobile || isTablet ? 12 : 10}
        >
          <Box
            sx={{
              width: "100%",
              pt: padding.triple,
              pb: padding.large,
              pl: padding.triple,
              pr: padding.triple,
            }}
          >
            <Box
              display="flex"
              flexDirection={isMobile ? "column" : "row"}
              justifyContent="space-between"
              width="100%"
              gap={2}
            >
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                width={{ xs: "100%", md: "auto" }}
                gap={2}
                data-testid="start-date-picker"
              >
                <Typography
                  variant="title1Medium"
                  sx={{ textAlign: "left", minWidth: "85px" }}
                >
                  Start&nbsp;Date
                </Typography>
                <PlainDatePicker
                  sx={{ maxWidth: { xs: "216px", sm: "none" } }}
                  views={["year", "month", "day"]}
                  format={dateDefault.DISPLAY_FORMAT}
                  value={minDate}
                  minDate={initialMinDate}
                  maxDate={valueToDate(value[1])}
                  onChange={(date) => handleMinDateChange(date as Dayjs)}
                  slots={{
                    openPickerIcon: CalendarIcon,
                  }}
                  slotProps={{
                    ...DEFAULT_DATE_PICKER_SLOT,
                    openPickerIcon: {
                      color: theme.palette.grey600,
                      width: 22,
                      height: 22,
                    },
                  }}
                />
              </Box>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                width={{ xs: "100%", md: "auto" }}
                gap={2}
                data-testid="end-date-picker"
              >
                <Typography
                  variant="title1Medium"
                  sx={{ textAlign: "left", minWidth: "85px" }}
                >
                  End&nbsp;Date
                </Typography>
                <PlainDatePicker
                  sx={{ maxWidth: { xs: "216px", sm: "none" } }}
                  views={["year", "month", "day"]}
                  format={dateDefault.DISPLAY_FORMAT}
                  value={maxDate}
                  minDate={valueToDate(value[0])}
                  maxDate={initialMaxDate}
                  onChange={(date) => handleMaxDateChange(date as Dayjs)}
                  slots={{
                    openPickerIcon: CalendarIcon,
                  }}
                  slotProps={{
                    ...DEFAULT_DATE_PICKER_SLOT,
                    openPickerIcon: {
                      color: theme.palette.grey600,
                      width: 22,
                      height: 22,
                    },
                  }}
                />
              </Box>
            </Box>
            {!isMobile && (
              <Box sx={{ width: "100%" }}>
                <TimeRangeBarChart
                  imosDataIds={imosDataIds}
                  totalDataset={totalDataset}
                  selectedStartDate={minDate}
                  selectedEndDate={maxDate}
                />
              </Box>
            )}
            <Box
              sx={{
                width: "90%",
                mx: "auto",
                paddingTop: padding.extraLarge,
              }}
            >
              <PlainSlider
                value={value}
                min={dateToValue(toUtcStartOfDay(initialMinDate))}
                max={dateToValue(toUtcEndOfDay(initialMaxDate))}
                step={432000000} // 5 days in mils
                onChange={handleSliderChange}
                valueLabelDisplay="auto"
                valueLabelFormat={(value: number) =>
                  valueToDate(value).format(dateDefault.DISPLAY_FORMAT)
                }
              />
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography padding={0} variant="body2Regular">
                  {initialMinDate.format(dateDefault.DISPLAY_FORMAT)}
                </Typography>
                <Typography padding={0} variant="body2Regular">
                  {initialMaxDate.format(dateDefault.DISPLAY_FORMAT)}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Grid>
        {renderFilterBy(isMobile, isTablet)}
      </Grid>

      <TestHelper
        id="temporal-during"
        getTemporalDuring={() => {
          const funcIntersectPolygon = cqlDefaultFilters.get(
            "BETWEEN_TIME_RANGE"
          ) as TemporalDuring;
          return funcIntersectPolygon(value[0], value[1]);
        }}
      />
    </>
  );
});

DateRangeFilter.displayName = "DateRangeFilter";
export default DateRangeFilter;
