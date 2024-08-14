// Unused component
import { useCallback, useEffect, useRef, useState } from "react";
import { dateDefault } from "../constants";
import { Box, Grid, SxProps, Theme } from "@mui/material";
import { DateRangeSlider } from "../slider/RangeSlider";
import dayjs, { Dayjs } from "dayjs";
import { useDispatch } from "react-redux";
import store, { AppDispatch, getComponentState } from "../store/store";
import { fetchResultNoStore } from "../store/searchReducer";
import { findSmallestDate } from "./api";
import {
  ParameterState,
  updateDateTimeFilterRange,
} from "../store/componentParamReducer";
import { cqlDefaultFilters } from "../cqlFilters";
import TimeRangeBarChart from "../charts/TimeRangeBarChart";
import StyledDateTimePicker from "../../../styles/StyledDateTimePicker";
import { margin } from "../../../styles/constants";
import { OGCCollections } from "../store/OGCCollectionDefinitions";

interface RemovableDateTimeFilterProps {
  url?: string;
  sx?: SxProps<Theme>;
}

// TODO: Bug in end date, it didn't handle correctly, end date = today means ongoing dataset passing today,
// because some dataset do not have end date.
const RemovableDateTimeFilter = (props: RemovableDateTimeFilterProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const componentParam: ParameterState = getComponentState(store.getState());

  // Disable the keyboard input for the date picker. May be changed in the future,
  // according to the customers' feedback.
  const endDateInputRef = useRef<HTMLInputElement>(null);
  const startDateInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const eRef: HTMLInputElement | null = endDateInputRef.current;
    if (eRef) {
      eRef.disabled = true;
    }

    const sRef: HTMLInputElement | null = startDateInputRef.current;
    if (sRef) {
      sRef.disabled = true;
    }
  }, []);

  // This state is the minimun date range from the earliest data in the db.
  // Shouldn't be changed after initializing
  const [minimumDate, _setMinimumDate] = useState<Date>(dateDefault.min);
  // For the accuracy of the displayed data according to the date range,
  // All the date in this component need to be calibrated to 00:00:00 (for min date) and 23:59:59 (for max date)
  const setMinimumDate = (value: Date) => {
    const calibratedDate = new Date(value);
    calibratedDate.setHours(0, 0, 0, 0);
    _setMinimumDate(calibratedDate);
  };

  // The below two states are the date range states selected by users.
  // They are shared by datePickers, dateSlider, and barChart.
  const [startDate, _setStartDate] = useState<Date>(dateDefault.min);
  const [endDate, _setEndDate] = useState<Date>(dateDefault.max);
  const setStartDate = (value: Date) => {
    const calibratedDate = new Date(value);
    calibratedDate.setHours(0, 0, 0, 0);
    _setStartDate(calibratedDate);
  };
  const setEndDate = (value: Date) => {
    const calibratedDate = new Date(value);
    calibratedDate.setHours(23, 59, 59, 999);
    _setEndDate(calibratedDate);
  };

  const [imosDataIds, setImosDataIds] = useState<string[]>([]);
  const [totalDataset, setTotalDataset] = useState<OGCCollections>({
    collections: [],
    links: [],
  });

  // Initialize the component
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
            const temp: Date | undefined | null = findSmallestDate(value);
            const min: Date = temp ? temp : dateDefault["min"];
            if (min > new Date(dateDefault["min"])) {
              setStartDate(min);
              setMinimumDate(min);
            }
          });
      }); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // These 3 functions handle the change of the date slider, and two date pickers.
  // they only update the date range state locally (useState) and globally(Redux)
  // and don't do other things.
  const onSlideChanged = useCallback(
    (start: number, end: number, startIndex: number, endIndex: number) => {
      setStartDate(new Date(start));
      setEndDate(new Date(end));

      dispatch(
        updateDateTimeFilterRange({
          start: startIndex === 0 ? undefined : start,
          end: endIndex === 100 ? undefined : end,
        })
      );
    },
    [dispatch]
  );

  // Second function as mentioned above
  const onStartDatePickerAccepted = useCallback(
    (value: Dayjs | null) => {
      const e = value ? value.toDate() : new Date(dateDefault["min"]);
      setStartDate(e);

      dispatch(
        updateDateTimeFilterRange({
          start: e.getTime(),
          end: endDate.getTime(),
        })
      );
    },
    [dispatch, endDate]
  );

  // Third function as mentioned above
  const onEndDatePickerAccepted = useCallback(
    (value: Dayjs | null) => {
      const e = value ? value.toDate() : new Date(dateDefault["max"]);
      setEndDate(e);
      dispatch(
        updateDateTimeFilterRange({
          start: startDate.getTime(),
          end: e.getTime(),
        })
      );
    },
    [dispatch, startDate]
  );

  return (
    <Grid container sx={{ ...props.sx }}>
      {props.url && (
        <Grid
          item
          xs={1}
          sx={{
            marginTop: margin["top"],
            textAlign: "center",
          }}
        >
          <Box component="img" src={props.url} />
        </Grid>
      )}
      <Grid
        item
        xs={12}
        display="flex"
        justifyContent="center"
        alignContent="center"
      >
        {
          // https://mui.com/x/react-charts/legend/
        }
        <Box sx={{ width: "90%" }}>
          <TimeRangeBarChart
            imosDataIds={imosDataIds}
            totalDataset={totalDataset}
            selectedStartDate={startDate}
            selectedEndDate={endDate}
          />
        </Box>
      </Grid>
      <Grid
        item
        xs={12}
        sx={{
          marginBottom: margin["bottom"],
          marginRight: margin["right"],
        }}
      >
        <Grid container>
          <Grid
            item
            xs={2}
            display="flex"
            justifyContent="center"
            alignContent="center"
          >
            <Box sx={{ width: "80%" }}>
              <StyledDateTimePicker
                onAccept={onStartDatePickerAccepted}
                defaultValue={dayjs(componentParam.dateTimeFilterRange?.start)}
                value={dayjs(startDate)}
                views={["year", "month", "day"]}
                minDate={dayjs(minimumDate)}
                maxDate={dayjs().add(1, "day")}
                inputRef={startDateInputRef}
              />
            </Box>
          </Grid>
          <Grid item xs={8}>
            <Grid
              container
              sx={{
                justifyContent: "center",
              }}
            >
              <Grid item xs={11}>
                <DateRangeSlider
                  title={"temporal"}
                  onSlideChanged={onSlideChanged}
                  min={minimumDate}
                  start={startDate}
                  end={endDate}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid
            item
            xs={2}
            display="flex"
            justifyContent="center"
            alignContent="center"
          >
            <Box sx={{ width: "80%" }}>
              <StyledDateTimePicker
                onAccept={onEndDatePickerAccepted}
                defaultValue={dayjs(componentParam.dateTimeFilterRange?.end)}
                value={dayjs(endDate)}
                views={["year", "month", "day"]}
                minDate={dayjs(minimumDate)}
                maxDate={dayjs().add(1, "day")}
                inputRef={endDateInputRef}
              />
            </Box>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default RemovableDateTimeFilter;
