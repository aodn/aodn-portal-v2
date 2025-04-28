import React, { useCallback } from "react";
import { axisClasses, BarSeriesType, BarChart } from "@mui/x-charts";
import { OGCCollections } from "../store/OGCCollectionDefinitions";
import { color } from "../../../styles/constants";

interface TimeRangeBarChartProps {
  imosDataIds: string[];
  totalDataset: OGCCollections;
  selectedStartDate: Date;
  selectedEndDate: Date;
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
const MS_PER_MONTH = MS_PER_DAY * 30;
const MS_PER_YEAR = MS_PER_DAY * 365;

// below consts are private functions
const determineChartUnit = (start: Date, end: Date) => {
  if (calculateDaysBetween(start, end) <= 100) {
    return DividedBy.day;
  }
  if (calculateMonthBetween(start, end) <= 12) {
    return DividedBy.month;
  }
  return DividedBy.year;
};

// start date and end date are inclusive. So the result should be added by 1
const calculateDaysBetween = (date1: Date, date2: Date) => {
  return Math.floor((date2.getTime() - date1.getTime()) / MS_PER_DAY) + 1;
};

const calculateMonthBetween = (date1: Date, date2: Date) => {
  return (
    date2.getMonth() -
    date1.getMonth() +
    12 * (date2.getFullYear() - date1.getFullYear()) +
    1
  );
};

const calculateYearBetween = (date1: Date, date2: Date) => {
  const value = date2.getFullYear() - date1.getFullYear();
  return value + 1;
};

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

const determineXWithBucketsBy = (
  start: Date,
  end: Date,
  imosDataIds: string[],
  totalDataset: OGCCollections,
  unit: DividedBy
) => {
  const xValues: Array<Date> = [];
  const buckets: Array<Bucket> = [];
  if (unit === DividedBy.day) {
    const days = calculateDaysBetween(start, end);
    for (let i = 0; i < days; i++) {
      const date = new Date(start);
      date.setDate(date.getDate() + i);
      xValues.push(date);
      buckets.push({
        start: date.getTime(),
        end: date.getTime() + MS_PER_DAY,
        imosOnlyCount: 0,
        total: 0,
      });
    }
  } else if (unit === DividedBy.month) {
    const months = calculateMonthBetween(start, end);
    for (let i = 0; i < months; i++) {
      const date = new Date(start);
      date.setMonth(date.getMonth() + i);
      xValues.push(date);
      buckets.push({
        start: date.getTime(),
        end: date.getTime() + MS_PER_MONTH,
        imosOnlyCount: 0,
        total: 0,
      });
    }
  } else if (unit === DividedBy.year) {
    const years = calculateYearBetween(start, end);
    for (let i = 0; i < years; i++) {
      const date = new Date(start);
      date.setFullYear(date.getFullYear() + i);
      xValues.push(date);
      buckets.push({
        start: date.getTime(),
        end: date.getTime() + MS_PER_YEAR,
        imosOnlyCount: 0,
        total: 0,
      });
    }
  }
  totalDataset.collections.forEach((collection) => {
    collection.extent?.temporal?.interval?.forEach((interval) => {
      const start = interval[0] ? new Date(interval[0]).getTime() : null;
      // Some big further date if not specified.
      const end = interval[1]
        ? new Date(interval[1]).getTime()
        : new Date().getTime() * 2;
      const isImosOnly = collection.id && imosDataIds.includes(collection.id);
      buckets.forEach((bucket) => {
        if (start) {
          if (isIncludedInBucket(start, end, bucket.start, bucket.end)) {
            if (isImosOnly) {
              bucket.imosOnlyCount++;
            }
            bucket.total++;
          }
        }
      });
    });
  });
  return { xValues, buckets };
};

const seriesFormatter = (value: number): string => {
  return `${value}`;
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
  const unit = determineChartUnit(selectedStartDate, selectedEndDate);
  const { xValues, buckets } = determineXWithBucketsBy(
    selectedStartDate,
    selectedEndDate,
    imosDataIds,
    totalDataset,
    unit
  );
  const xAxisLabelFormatter = useCallback(
    (date: Date): string => {
      if (unit === DividedBy.day) {
        return date.toLocaleDateString();
      } else if (unit === DividedBy.month) {
        // return mm/yyyy
        return `${date.getMonth() + 1}/${date.getFullYear()}`;
      } else if (unit === DividedBy.year) {
        return date.getFullYear().toString();
      } else {
        return date.getFullYear().toString();
      }
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
