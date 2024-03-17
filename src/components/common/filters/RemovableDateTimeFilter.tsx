import { useCallback, useEffect, useState } from "react";
import { dateDefault, margin } from "../constants";
import { Grid, Box, SxProps, Theme } from "@mui/material";
import TuneIcon from "@mui/icons-material/Tune";
import { DateRangeSlider } from "../slider/RangeSlider";
import { BarChart } from "@mui/x-charts/BarChart";
import dayjs, { Dayjs } from "dayjs";
import { BarSeriesType } from "@mui/x-charts";
import { useDispatch } from "react-redux";
import store, { AppDispatch, getComponentState } from "../store/store";
import { fetchResultNoStore, OGCCollections } from "../store/searchReducer";
import { findSmallestDate } from "./api";
import {
  ParameterState,
  updateDateTimeFilterRange,
} from "../store/componentParamReducer";
import { cqlDefaultFilters } from "../cqlFilters";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { FieldChangeHandlerContext } from "@mui/x-date-pickers/internals/hooks/useField";
import { DateTimeValidationError } from "@mui/x-date-pickers";

interface RemovableDateTimeFilterProps {
  title: string;
  url: string;
  sx?: SxProps<Theme>;
}

interface DataSeries {
  x: Array<Date>;
  y: BarSeriesType[];
}
/**
 * It is belongs to a bucket if
 * 1. target start is within bucket
 * 2. target end is within bucket
 * 3. bucket start is within target && bucket end is within target
 *    |--------------------|       <-target
 * |---1---|----2----|----3---|    <-bucket
 * @param targetStart
 * @param targetEnd
 * @param bucketStart
 * @param bucketEnd
 */
const isIncludedInBucket = (
  targetStart: number,
  targetEnd: number,
  bucketStart: number,
  bucketEnd: number
) =>
  (bucketStart <= targetStart && targetStart <= bucketEnd) ||
  (bucketStart <= targetEnd && targetEnd <= bucketEnd) ||
  (targetStart <= bucketStart && bucketEnd <= targetEnd);

const createSeries = (
  ids: Set<string>,
  ogcCollections: OGCCollections
): [Date, Array<Date>, BarSeriesType[]] => {
  /* Need to convert to something like this
    [
        { data: [3, 4, 1, 6, 5], stack: 'A', label: 'IMOS Data' },
        { data: [4, 3, 1, 5, 8], stack: 'A', label: 'Data amount' }
    ]
    */
  const temp: Date | undefined | null = findSmallestDate(ogcCollections);
  const smallestDate: Date = temp ? temp : dateDefault["min"];
  const largestDate: Date = dateDefault["max"];

  // Since the date series needs to work with the slider, so we need to follow
  // slider assumption where its range is 0 to 100
  const bandWidth = (largestDate.getTime() - smallestDate.getTime()) / 100;

  interface Bucket {
    start: number;
    end: number;
    imosOnlyCount: number;
    total: number;
  }

  // Create bucket of time slot so can count how many records is within
  // that time slot
  const xValues: Array<Date> = [];
  const buckets: Array<Bucket> = [];
  for (let i: number = 0; i < 100; i++) {
    const b: Bucket = {
      start: smallestDate.getTime() + i * bandWidth,
      end: smallestDate.getTime() + (i + 1) * bandWidth,
      imosOnlyCount: 0,
      total: 0,
    };
    buckets.push(b);
    xValues.push(new Date(b.start));
  }

  // Scan through stacs collection and add to bucket count iff within range
  ogcCollections.collections.forEach((i) => {
    i?.extent?.temporal?.interval?.forEach((v) => {
      // Check individual item is within the time range
      // if yes then increase bucket count.
      buckets.forEach((b) => {
        const start = v[0] ? new Date(v[0]).getTime() : null;

        // Some big further date if not specified.
        const end = v[1] ? new Date(v[1]).getTime() : new Date().getTime() * 2;

        // If you do not have a start, it is invalid date, hence skip
        if (start && isIncludedInBucket(start, end, b.start, b.end)) {
          if (ids.has(i.id)) {
            b.imosOnlyCount++;
          }
          b.total++;
        }
      });
    });
  });

  const series: BarSeriesType[] = [];
  const formatter = (value: number): string => {
    return `${value}`;
  };

  const imos: BarSeriesType = {
    id: "imos-data-id",
    type: "bar",
    valueFormatter: formatter,
    stack: "total",
    label: "IMOS Data",
    data: buckets.flatMap((m) => m.imosOnlyCount),
  };

  const total: BarSeriesType = {
    id: "total-data-id",
    type: "bar",
    valueFormatter: formatter,
    stack: "total",
    label: "Total",
    data: buckets.flatMap((m) => m.total),
  };

  series.push(imos);
  series.push(total);

  return [smallestDate, xValues, series];
};

const cloneBarSeriesType = (s: BarSeriesType): BarSeriesType => {
  const c: BarSeriesType = {
    id: s.id,
    type: s.type,
    valueFormatter: s.valueFormatter,
    stack: s.stack,
    label: s.label,
    data: s.data && s.data.map((x) => x),
  };

  return c;
};
// TODO: Bug in end date, it didn't handle correctly, end date = today means ongoing dataset passing today,
// because some dataset do not have end date.
const RemovableDateTimeFilter = (props: RemovableDateTimeFilterProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const componentParam: ParameterState = getComponentState(store.getState());

  // Must separate picker start and end date with slider to avoid feedback loop
  const [pickerStartDate, setPickerStartDate] = useState<Date>(
    dateDefault["min"]
  );
  const [pickerEndDate, setPickerEndDate] = useState<Date>(dateDefault["max"]);

  const [minSliderDate, setSliderMinDate] = useState<Date | undefined>(
    undefined
  );
  const [startSliderDate, setSliderStartDate] = useState<Date>(
    dateDefault["min"]
  );
  const [endSliderDate, setSliderEndDate] = useState<Date>(dateDefault["max"]);

  const [barSeries, setBarSeries] = useState<DataSeries>({ x: [], y: [] });
  const [slicedBarSeries, setSlicedBarSeries] = useState<DataSeries>({
    x: [],
    y: [],
  });

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

            const [min, xValues, series] = createSeries(new Set(ids), value);
            setBarSeries({ x: xValues, y: series });
            setSlicedBarSeries({ x: xValues, y: series });

            setSliderMinDate(min);
            setSliderStartDate(
              componentParam.dateTimeFilterRange?.start
                ? new Date(componentParam.dateTimeFilterRange?.start)
                : min
            );
            setPickerStartDate(
              componentParam.dateTimeFilterRange?.start
                ? new Date(componentParam.dateTimeFilterRange?.start)
                : min
            );

            if (componentParam.dateTimeFilterRange?.end) {
              setSliderEndDate(
                new Date(componentParam.dateTimeFilterRange?.end)
              );
              setPickerEndDate(
                new Date(componentParam.dateTimeFilterRange?.end)
              );
            }
          });
      });
  }, [
    componentParam.dateTimeFilterRange?.end,
    componentParam.dateTimeFilterRange?.start,
    dispatch,
  ]);

  const sliceBarSeries = useCallback(
    (start: Date, end: Date) => {
      // Slider default min/max value is 0-100
      let startIndex = 0;
      let endIndex = 100;

      for (let i: number = 0; i < barSeries.x.length; i++) {
        if (barSeries.x[i] < start) {
          startIndex = i;
        }
        if (barSeries.x[i] < end) {
          endIndex = i;
        }
      }

      const series: BarSeriesType[] = [];

      series.push(cloneBarSeriesType(barSeries.y[0]));
      series.push(cloneBarSeriesType(barSeries.y[1]));

      series[0].data =
        series[0] &&
        series[0].data &&
        series[0].data.slice(startIndex, endIndex);
      series[1].data =
        series[1] &&
        series[1].data &&
        series[1].data.slice(startIndex, endIndex);

      setSlicedBarSeries({
        x: barSeries.x.slice(startIndex, endIndex),
        y: series,
      });
    },
    [setSlicedBarSeries, barSeries]
  );

  const onSlideChanged = useCallback(
    (start: number, end: number, startIndex: number, endIndex: number) => {
      const s = new Date(start);
      const e = new Date(end);
      setPickerStartDate(s);
      setPickerEndDate(e);

      setSliderStartDate(s);
      setSliderEndDate(e);
      dispatch(
        updateDateTimeFilterRange({
          start: startIndex === 0 ? undefined : start,
          end: endIndex === 100 ? undefined : end,
        })
      );

      sliceBarSeries(s, e);
    },
    [setPickerStartDate, setPickerEndDate, sliceBarSeries, dispatch]
  );

  const onStartDatePickerChanged = useCallback(
    (
      value: Dayjs | null,
      context: FieldChangeHandlerContext<DateTimeValidationError>
    ) => {
      // just log this for now
      if (context.validationError) {
        console.log("Validation error", context.validationError);
      }
      const e = value ? value.toDate() : new Date(dateDefault["min"]);
      setPickerStartDate(e);
      setSliderStartDate(e);
      dispatch(
        updateDateTimeFilterRange({
          start: e.getTime(),
          end: pickerEndDate.getTime(),
        })
      );
    },
    [dispatch, setSliderStartDate, setPickerStartDate, pickerEndDate]
  );

  const onEndDatePickerChanged = useCallback(
    (
      value: Dayjs | null,
      context: FieldChangeHandlerContext<DateTimeValidationError>
    ) => {
      // just log this for now
      if (context.validationError) {
        console.log("Validation error", context.validationError);
      }
      const e = value ? value.toDate() : new Date(dateDefault["max"]);
      setPickerEndDate(e);
      setSliderEndDate(e);
      dispatch(
        updateDateTimeFilterRange({
          start: pickerStartDate.getTime(),
          end: e.getTime(),
        })
      );
    },
    [dispatch, setSliderEndDate, setPickerEndDate, pickerStartDate]
  );

  return (
    <Grid
      container
      columns={13}
      sx={{
        backgroundImage: "url(/filters/Background.png)",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        border: "none",
        borderRadius: 0,
        justifyContent: "center",
        minHeight: "90px",
        ...props.sx,
      }}
    >
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
      <Grid
        item
        xs={12}
        sx={{
          marginTop: margin["top"],
          textAlign: "left",
        }}
      >
        <Grid container>
          <Grid item xs={1}>
            <div>{props.title}</div>
            <TuneIcon />
          </Grid>
          <Grid
            item
            xs={11}
            sx={{
              minHeight: "200px",
            }}
          >
            {
              // https://mui.com/x/react-charts/legend/
            }
            <BarChart
              margin={{
                // use to control the space on right, so that it will not overlap with the legend
                right: 150,
              }}
              slotProps={{
                legend: {
                  direction: "column",
                  position: {
                    vertical: "middle",
                    horizontal: "right",
                  },
                  itemMarkWidth: 20,
                  itemMarkHeight: 20,
                  markGap: 10,
                  itemGap: 10,
                },
              }}
              xAxis={[
                {
                  data: slicedBarSeries.x,
                  scaleType: "band",
                  valueFormatter: (date: Date) => date.toLocaleDateString(),
                  tickMinStep: 3600 * 1000 * 48, // min step: 48h,
                  // If you want the label rotate
                  // tickLabelStyle: {
                  //  angle: 45,
                  //  dominantBaseline: 'hanging',
                  //  textAnchor: 'start',
                  // },
                },
              ]}
              series={slicedBarSeries.y}
            />
          </Grid>
        </Grid>
      </Grid>
      <Grid
        item
        xs={1}
        sx={{
          marginBottom: margin["bottom"],
        }}
      />
      <Grid
        item
        xs={12}
        sx={{
          marginBottom: margin["bottom"],
          marginRight: margin["right"],
        }}
      >
        <Grid container>
          <Grid item xs={2}>
            <DateTimePicker
              onChange={onStartDatePickerChanged}
              defaultValue={dayjs(componentParam.dateTimeFilterRange?.start)}
              value={dayjs(pickerStartDate)}
              views={["year", "month", "day"]}
            />
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
                  min={minSliderDate}
                  start={startSliderDate}
                  end={endSliderDate}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={2}>
            <DateTimePicker
              onChange={onEndDatePickerChanged}
              defaultValue={dayjs(componentParam.dateTimeFilterRange?.end)}
              value={dayjs(pickerEndDate)}
              views={["year", "month", "day"]}
            />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default RemovableDateTimeFilter;
