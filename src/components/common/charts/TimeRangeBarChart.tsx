import React, { useCallback, useMemo } from "react";
import { axisClasses, BarSeriesType, BarChart } from "@mui/x-charts";
import { OGCCollections } from "@/app/store/OGCCollectionDefinitions";
import { color } from "@/styles/constants";
import { legendClasses } from "@mui/x-charts/ChartsLegend";
import dayjs, { Dayjs } from "@/utils/dayjs";
import { dateDefault } from "@/components/common/constants";
import { toUtcStartOfDay } from "@/utils/DateUtils";

interface TimeRangeBarChartProps {
  imosDataIds: string[];
  totalDataset: OGCCollections;
  selectedStartDate: Dayjs;
  selectedEndDate: Dayjs;
}

export interface Bucket {
  start: number;
  end: number;
  imosOnlyCount: number;
  total: number;
}

export enum DividedBy {
  day = "Day",
  month = "Month",
  year = "Year",
}

const MS_PER_DAY = 1000 * 60 * 60 * 24;

const utcDay = (d: Dayjs): Dayjs => toUtcStartOfDay(d);

const determineChartUnit = (start: Dayjs, end: Dayjs) => {
  if (calculateDaysBetween(start, end) <= 100) {
    return DividedBy.day;
  }
  if (calculateMonthBetween(start, end) <= 100) {
    return DividedBy.month;
  }
  return DividedBy.year;
};

const calculateDaysBetween = (date1: Dayjs, date2: Dayjs) =>
  utcDay(date2).diff(utcDay(date1), "day") + 1;

const calculateMonthBetween = (date1: Dayjs, date2: Dayjs) => {
  const a = utcDay(date1);
  const b = utcDay(date2);
  return b.year() * 12 + b.month() - (a.year() * 12 + a.month()) + 1;
};

const calculateYearBetween = (date1: Dayjs, date2: Dayjs) =>
  utcDay(date2).year() - utcDay(date1).year() + 1;

/**
 * It belongs to a bucket if
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

const addBucket = (
  xValues: Date[],
  buckets: Bucket[],
  date: Dayjs,
  unit: "day" | "month" | "year"
) => {
  xValues.push(date.toDate());
  buckets.push({
    start: date.valueOf(),
    end: date.add(1, unit).valueOf(),
    imosOnlyCount: 0,
    total: 0,
  });
};

const determineXWithBucketsBy = (
  start: Dayjs,
  end: Dayjs,
  imosDataIds: string[],
  totalDataset: OGCCollections,
  unit: DividedBy
) => {
  const xValues: Array<Date> = [];
  const buckets: Array<Bucket> = [];
  const origin = utcDay(start);
  if (unit === DividedBy.day) {
    const days = calculateDaysBetween(start, end);
    for (let i = 0; i < days; i++) {
      addBucket(xValues, buckets, origin.add(i, "day"), "day");
    }
  } else if (unit === DividedBy.month) {
    const months = calculateMonthBetween(start, end);
    for (let i = 0; i < months; i++) {
      addBucket(xValues, buckets, origin.add(i, "month"), "month");
    }
  } else if (unit === DividedBy.year) {
    const years = calculateYearBetween(start, end);
    for (let i = 0; i < years; i++) {
      addBucket(xValues, buckets, origin.add(i, "year"), "year");
    }
  }
  const imosDataSet = new Set(imosDataIds);
  const defaultEndTime = Date.now() * 2;

  totalDataset.collections.forEach((collection) => {
    // Determine this once per collection instead of per interval
    const isImosOnly = collection.id ? imosDataSet.has(collection.id) : false;

    collection.extent?.temporal?.interval?.forEach((interval) => {
      const start = interval[0] ? dayjs.utc(interval[0]).valueOf() : null;
      if (!start) return;

      const end = interval[1]
        ? dayjs.utc(interval[1]).valueOf()
        : defaultEndTime;

      // Since buckets are ordered chronologically, we can skip and break early
      for (const bucket of buckets) {
        if (bucket.end < start) {
          continue; // Bucket is entirely before our target interval
        }
        if (bucket.start > end) {
          break; // Bucket is entirely after, and all subsequent buckets will also be
        }

        // If we reach here, there is an overlap
        if (isImosOnly) {
          bucket.imosOnlyCount++;
        }
        bucket.total++;
      }
    });
  });
  return { xValues, buckets };
};

const seriesFormatter = (value: number | null): string => {
  return value == null ? "" : `${value}`;
};

const createSeries = (buckets: Bucket[]) => {
  const series: BarSeriesType[] = [];
  const imos: BarSeriesType = {
    id: "imos-data-id",
    type: "bar",
    valueFormatter: seriesFormatter,
    stack: "total",
    label: "IMOS Records",
    data: buckets.map((m: Bucket) => m.imosOnlyCount),
    color: color.blue.dark,
  };
  const others: BarSeriesType = {
    id: "others-data-id",
    type: "bar",
    valueFormatter: seriesFormatter,
    stack: "total",
    label: "All Records",
    data: buckets.map((m: Bucket) => m.total - m.imosOnlyCount),
    color: color.blue.darkSemiTransparent,
  };

  series.push(imos);
  series.push(others);
  return series;
};

const TimeRangeBarChart: React.FC<TimeRangeBarChartProps> = ({
  imosDataIds,
  totalDataset,
  selectedStartDate,
  selectedEndDate,
}) => {
  // below consts are private variables
  const unit = useMemo(
    () => determineChartUnit(selectedStartDate, selectedEndDate),
    [selectedStartDate, selectedEndDate]
  );
  const { xValues, buckets } = useMemo(
    () =>
      determineXWithBucketsBy(
        selectedStartDate,
        selectedEndDate,
        imosDataIds,
        totalDataset,
        unit
      ),
    [selectedStartDate, selectedEndDate, imosDataIds, totalDataset, unit]
  );
  const xAxisLabelFormatter = useCallback(
    (date: Date): string => {
      const d = dayjs.utc(date);
      if (unit === DividedBy.day) {
        return d.format(dateDefault.DISPLAY_FORMAT);
      }
      if (unit === DividedBy.month) {
        return `${d.month() + 1}/${d.year()}`;
      }
      return d.year().toString();
    },
    [unit]
  );
  const series: BarSeriesType[] = createSeries(buckets);

  return (
    <BarChart
      height={180}
      margin={{
        right: 50,
        left: 80,
        bottom: 50,
        top: 50,
      }}
      slotProps={{
        legend: {
          direction: "row",
          position: {
            vertical: "top", // Changed to top for better responsiveness
            horizontal: "middle",
          },
          itemMarkWidth: 15,
          itemMarkHeight: 15,
          markGap: 10,
          itemGap: 20,
          labelStyle: {
            fontSize: 12,
          },
        },
      }}
      xAxis={[
        {
          data: xValues,
          scaleType: "band",
          valueFormatter: xAxisLabelFormatter,
          tickMinStep: 3600 * 1000 * 48, // min step: 48h
          label: determineChartUnit(
            selectedStartDate,
            selectedEndDate
          ).toString(), // x-axis label
          labelStyle: {
            fontSize: 12,
            fontWeight: "bold",
          },
        },
      ]}
      yAxis={[
        {
          label: "Count of Records", // y-axis label
          labelStyle: {
            fontSize: 12,
            fontWeight: "bold",
          },
          tickLabelStyle: {
            fontSize: 12,
          },
        },
      ]}
      sx={{
        [`.${axisClasses.left} .${axisClasses.label}`]: {
          transform: "translate(-20px, 0)",
        },
        [`.${legendClasses.mark}`]: {
          rx: 4,
          ry: 4,
        },
      }}
      series={series}
    />
  );
};
// Test-only exports for private functions
if (process.env.NODE_ENV === "test") {
  (TimeRangeBarChart as any).__testExports = {
    determineChartUnit,
    calculateDaysBetween,
    calculateMonthBetween,
    calculateYearBetween,
    isIncludedInBucket,
    determineXWithBucketsBy,
    seriesFormatter,
    createSeries,
    MS_PER_DAY,
  };
}
export default TimeRangeBarChart;
