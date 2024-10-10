import {
  Dispatch,
  FC,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import { Box, Grid } from "@mui/material";
import dayjs, { Dayjs } from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { padding } from "../../../styles/constants";
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

const initialMinDate: Dayjs = dayjs(dateDefault.min);
const initialMaxDate: Dayjs = dayjs(dateDefault.max);

// Utility function to convert a date to a numeric value
const dateToValue = (date: Dayjs): number => date.valueOf();

// Utility function to convert a numeric value back to a date
const valueToDate = (value: number): Dayjs => dayjs(value);

interface DateRangeFilterProps {
  filter: ParameterState;
  setFilter: Dispatch<SetStateAction<ParameterState>>;
}

const DateRangeFilter: FC<DateRangeFilterProps> = ({ filter, setFilter }) => {
  const dispatch = useAppDispatch();
  const { dateTimeFilterRange } = filter;

  const [minDate, setMinDate] = useState<Dayjs>(initialMinDate);
  const [maxDate, setMaxDate] = useState<Dayjs>(initialMaxDate);
  const [value, setValue] = useState<number[]>([
    dateTimeFilterRange?.start ?? dateToValue(dayjs(dateDefault.min)),
    dateTimeFilterRange?.end ?? dateToValue(dayjs(dateDefault.max)),
  ]);

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

  const handleSliderChange = useCallback(
    (_: Event, newValue: number | number[]): void => {
      if (!Array.isArray(newValue)) return;
      const [newStart, newEnd] = newValue;

      setValue(newValue);
      setMinDate(dayjs(newStart));
      setMaxDate(dayjs(newEnd));

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
          xs={12}
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <Box sx={{ width: "90%" }}>
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
            xs={2}
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <Box sx={{ width: "80%" }}>
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
            </Box>
          </Grid>
          <Grid
            item
            xs={8}
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
                  valueToDate(value).format("MM/YYYY")
                }
              />
            </Box>
          </Grid>
          <Grid
            item
            xs={2}
            height="100%"
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <Box sx={{ width: "80%", height: "30px" }}>
              <PlainDatePicker
                views={["month", "year"]}
                format="MM/YYYY"
                value={maxDate}
                minDate={valueToDate(value[0])}
                maxDate={initialMaxDate}
                onChange={(date) => handleMaxDateChange(date as Dayjs)}
                slotProps={DEFAULT_DATE_PICKER_SLOT}
              />
            </Box>
          </Grid>
        </Grid>
      </Grid>
    </LocalizationProvider>
  );
};

export default DateRangeFilter;
