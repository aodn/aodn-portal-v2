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
  alpha,
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
import { cqlDefaultFilters, TemporalDuring } from "../common/cqlFilters";
import TimeRangeBarChart from "../common/charts/TimeRangeBarChart";
import PlainDatePicker from "../common/datetime/PlainDatePicker";
import PlainSlider from "../common/slider/PlainSlider";
import {
  dayjsToUnixMs,
  formatDate,
  toAppDayjs,
  toUtcEndOfDay,
  toUtcStartOfDay,
  unixMsToAppDayjs,
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

const DEFAULT_SEARCH_START_DATE = toAppDayjs(
  "1970-01-01",
  dateDefault.DATE_FORMAT
);

const DATE_PICKER_SX = {
  width: { xs: "240px", sm: "auto", md: "240px" },
  maxWidth: { xs: "216px", sm: "none", md: "240px" },
  border: "none",
  borderRadius: theme.borderRadius.sm,
  boxShadow: "0 0 4px 1px rgba(0, 0, 0, 0.15)",
  "& .MuiInputBase-root": { height: "46px", pl: { xs: 1, sm: 2 }, pr: 1.5 },
  "& input": {
    ...theme.typography.title2Regular,
    fontSize: { xs: "14px", sm: theme.typography.title2Regular.fontSize },
    color: theme.palette.grey700,
  },
};

interface DateRangeFilterProps {}

const DateRangeFilter: FC<DateRangeFilterProps> = memo(() => {
  const { isMobile, isTablet } = useBreakpoint();
  const dispatch = useAppDispatch();
  // Snapshot per mount so a live `dateDefault.max` getter cannot retrigger effects.
  const initialMaxDate = useMemo(() => dateDefault.max, []);

  // State from redux
  const dateTimeFilterRange = useAppSelector(
    (state) => state.paramReducer.dateTimeFilterRange
  );
  const rangeStart = dateTimeFilterRange?.start;
  const rangeEnd = dateTimeFilterRange?.end;
  const initialMinDate = useMemo(() => {
    const restoredBounds = [rangeStart, rangeEnd].filter(
      (bound): bound is number => bound !== undefined
    );
    // Keep the full historical scale, including any earlier restored bounds.
    const min = Math.min(
      dayjsToUnixMs(toUtcStartOfDay(dateDefault.min)),
      ...restoredBounds
    );
    return toUtcStartOfDay(unixMsToAppDayjs(min));
  }, [rangeStart, rangeEnd]);
  const defaultStart = dayjsToUnixMs(
    toUtcStartOfDay(DEFAULT_SEARCH_START_DATE)
  );
  const fallbackStart =
    rangeEnd !== undefined && rangeEnd < defaultStart
      ? dayjsToUnixMs(initialMinDate)
      : defaultStart;

  // Local state for date-range-slider
  const [value, setValue] = useState<number[]>(() => [
    rangeStart ?? fallbackStart,
    rangeEnd ?? dayjsToUnixMs(toUtcEndOfDay(initialMaxDate)),
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
  const [minDate, maxDate] = useMemo(
    () => [unixMsToAppDayjs(value[0]), unixMsToAppDayjs(value[1])],
    [value]
  );

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
          dayjsToUnixMs(startDate),
          dayjsToUnixMs(toUtcEndOfDay(today)),
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
      const newStart = dayjsToUnixMs(
        toUtcStartOfDay(unixMsToAppDayjs(newValue[0]))
      );
      const newEnd = dayjsToUnixMs(
        toUtcEndOfDay(unixMsToAppDayjs(newValue[1]))
      );
      const newMinDate = unixMsToAppDayjs(newStart);
      const newMaxDate = unixMsToAppDayjs(newEnd);

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
      const localMinDate = newMinDate?.isValid()
        ? toUtcStartOfDay(newMinDate)
        : null;
      const newStart = localMinDate ? dayjsToUnixMs(localMinDate) : NaN;

      if (
        localMinDate?.isValid() &&
        Number.isFinite(newStart) &&
        !localMinDate.isBefore(initialMinDate, "day") &&
        !localMinDate.isAfter(maxDate, "day")
      ) {
        setValue([newStart, value[1]]);
        setSelectedOption(determineSelectedOption(localMinDate, maxDate));
        dispatch(
          updateDateTimeFilterRange({
            start: newStart,
            end: value[1],
          })
        );
      } else {
        // Force reset to previous value and text box refresh
        setValue([value[0], value[1]]);
      }
    },
    [determineSelectedOption, dispatch, initialMinDate, maxDate, value]
  );

  const handleMaxDateChange = useCallback(
    (newMaxDate: Dayjs | null) => {
      // Date-only picker: the chosen calendar day at UTC 23:59:59, not host local.
      const localMaxDate = newMaxDate?.isValid()
        ? toUtcEndOfDay(newMaxDate)
        : null;
      const newEnd = localMaxDate ? dayjsToUnixMs(localMaxDate) : NaN;

      if (
        localMaxDate?.isValid() &&
        Number.isFinite(newEnd) &&
        !localMaxDate.isBefore(minDate, "day") &&
        !localMaxDate.isAfter(initialMaxDate, "day")
      ) {
        setValue([value[0], newEnd]);
        setSelectedOption(determineSelectedOption(minDate, localMaxDate));
        dispatch(
          updateDateTimeFilterRange({
            start: value[0],
            end: newEnd,
          })
        );
      } else {
        // Force reset to previous value and text box refresh
        setValue([value[0], value[1]]);
      }
    },
    [determineSelectedOption, dispatch, initialMaxDate, minDate, value]
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
          <Typography mb={2} variant="title2Regular">
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
                        color: alpha(theme.palette.text1, 0.38),
                        "& .MuiSvgIcon-root": { fontSize: 22 },
                        "&.Mui-checked": {
                          color: theme.palette.primary1,
                        },
                      }}
                    />
                  }
                  label={item.label}
                  key={item.value}
                  data-testid={`radio-${item.label}`}
                  slotProps={{
                    typography: {
                      variant: "title2Regular",
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
        const fallbackMin = fallbackStart;
        const fallbackMax = dayjsToUnixMs(toUtcEndOfDay(initialMaxDate));
        const newMinDate = unixMsToAppDayjs(
          dateTimeFilterRange.start ?? fallbackMin
        );
        const newMaxDate = unixMsToAppDayjs(
          dateTimeFilterRange.end ?? fallbackMax
        );

        setValue([
          dateTimeFilterRange.start ?? fallbackMin,
          dateTimeFilterRange.end ?? fallbackMax,
        ]);
        setSelectedOption(determineSelectedOption(newMinDate, newMaxDate));
      } else {
        // Reset to initial state when dateTimeFilterRange is null or undefined
        setValue([defaultStart, dayjsToUnixMs(toUtcEndOfDay(initialMaxDate))]);
        setSelectedOption(DateRangeOptionValues.Custom);
      }
    });
  }, [
    dateTimeFilterRange,
    defaultStart,
    determineSelectedOption,
    fallbackStart,
    initialMaxDate,
  ]);

  useEffect(() => {
    // Find all collection, with simple sort by id, query run faster than the default sort
    dispatch(
      fetchResultNoStore({
        properties: "id,temporal,dataset_group",
        filter: `${cqlDefaultFilters.get("ALL_TIME_RANGE")}`,
        sortby: "id",
      })
    )
      .unwrap()
      .then((value: string) => {
        const collections = jsonToOGCCollections(value);
        const ids = collections.collections
          .filter((value: OGCCollection) => value.isImosOnly())
          .map((value: OGCCollection) => value.id);
        setImosDataIds(ids);
        setTotalDataset(collections);
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
              pt: isMobile ? padding.triple : 4.5,
              pb: isMobile ? padding.large : 6,
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
                gap={{ xs: 2, md: 3.5 }}
                data-testid="start-date-picker"
              >
                <Typography
                  variant="title2Regular"
                  sx={{ textAlign: "left", minWidth: "85px", padding: 0 }}
                >
                  Start&nbsp;Date
                </Typography>
                <PlainDatePicker
                  sx={DATE_PICKER_SX}
                  views={["year", "month", "day"]}
                  format={dateDefault.DISPLAY_FORMAT}
                  value={minDate}
                  minDate={initialMinDate}
                  maxDate={unixMsToAppDayjs(value[1])}
                  onChange={(date) => handleMinDateChange(date as Dayjs)}
                  slots={{
                    openPickerIcon: CalendarIcon,
                  }}
                  slotProps={{
                    ...DEFAULT_DATE_PICKER_SLOT,
                    popper: { disablePortal: true },
                    openPickerIcon: {
                      color: theme.palette.secondary1,
                      width: 24,
                      height: 24,
                    },
                  }}
                />
              </Box>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                width={{ xs: "100%", md: "auto" }}
                gap={{ xs: 2, md: 3.5 }}
                data-testid="end-date-picker"
              >
                <Typography
                  variant="title2Regular"
                  sx={{ textAlign: "left", minWidth: "85px", padding: 0 }}
                >
                  End&nbsp;Date
                </Typography>
                <PlainDatePicker
                  sx={DATE_PICKER_SX}
                  views={["year", "month", "day"]}
                  format={dateDefault.DISPLAY_FORMAT}
                  value={maxDate}
                  minDate={unixMsToAppDayjs(value[0])}
                  maxDate={initialMaxDate}
                  onChange={(date) => handleMaxDateChange(date as Dayjs)}
                  slots={{
                    openPickerIcon: CalendarIcon,
                  }}
                  slotProps={{
                    ...DEFAULT_DATE_PICKER_SLOT,
                    popper: { disablePortal: true },
                    openPickerIcon: {
                      color: theme.palette.secondary1,
                      width: 24,
                      height: 24,
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
                paddingTop: isMobile ? padding.extraLarge : 8,
              }}
            >
              <PlainSlider
                value={value}
                min={dayjsToUnixMs(toUtcStartOfDay(initialMinDate))}
                max={dayjsToUnixMs(toUtcEndOfDay(initialMaxDate))}
                step={432000000} // 5 days in mils
                onChange={handleSliderChange}
                valueLabelDisplay="auto"
                valueLabelFormat={(value: number) =>
                  formatDate(unixMsToAppDayjs(value))
                }
                sx={{
                  mx: 0,
                  "& .MuiSlider-rail": {
                    height: "8px",
                    opacity: 1,
                    "&::before, &::after": {
                      content: '""',
                      position: "absolute",
                      top: "50%",
                      width: "9px",
                      height: "9px",
                      borderRadius: "50%",
                      backgroundColor: theme.palette.common.white,
                      boxShadow: "0 0 4px rgba(0, 0, 0, 0.5)",
                      transform: "translate(-50%, -50%)",
                    },
                    "&::before": { left: 0 },
                    "&::after": { left: "100%" },
                  },
                  "& .MuiSlider-valueLabel, & .MuiSlider-valueLabelLabel": {
                    ...theme.typography.title2Regular,
                  },
                  "& .MuiSlider-valueLabel": {
                    backgroundColor: theme.palette.common.white,
                    border: "none",
                    borderRadius: "6px",
                    boxShadow: "1px 1px 4px rgba(0, 0, 0, 0.1)",
                    padding: theme.spacing(0.5, 1),
                    backdropFilter: "none",
                    WebkitBackdropFilter: "none",
                  },
                }}
              />
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography
                  padding={0}
                  variant="title2Regular"
                  sx={{ transform: "translateX(-50%)" }}
                >
                  {formatDate(initialMinDate)}
                </Typography>
                <Typography
                  padding={0}
                  variant="title2Regular"
                  sx={{ transform: "translateX(50%)" }}
                >
                  {formatDate(initialMaxDate)}
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
