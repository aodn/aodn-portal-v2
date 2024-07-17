import React from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import { BarSeriesType } from "@mui/x-charts";
import { useTheme } from "@mui/material";
import { OGCCollections } from "../store/OGCCollectionDefinitions";

interface TimeRangeBarChartProps {
  imosDataIds: string[];
  totalDataset: OGCCollections;
  selectedStartDate: Date;
  selectedEndDate: Date;
}

interface Bucket {
  start: number;
  end: number;
  imosOnlyCount: number;
  total: number;
}

enum DividedBy {
  day,
  month,
  year,
}

const TimeRangeBarChart: React.FC<TimeRangeBarChartProps> = ({
  imosDataIds,
  totalDataset,
  selectedStartDate,
  selectedEndDate,
}) => {
  const theme = useTheme();

  // below consts are private functions
  const determineChartUnit = () => {
    if (calculateDaysBetween(selectedStartDate, selectedEndDate) <= 100) {
      return DividedBy.day;
    }
    if (calculateMonthBetween(selectedStartDate, selectedEndDate) <= 100) {
      return DividedBy.month;
    }
    return DividedBy.year;
  };

  // start date and end date are inclusive. So the result should be added by 1
  const calculateDaysBetween = (date1: Date, date2: Date) => {
    const value = Math.floor(
      (date2.getTime() - date1.getTime()) / (1000 * 60 * 60 * 24)
    );
    return value + 1;
  };

  const calculateMonthBetween = (date1: Date, date2: Date) => {
    const value =
      date2.getMonth() -
      date1.getMonth() +
      12 * (date2.getFullYear() - date1.getFullYear());
    return value + 1;
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

  const determineXWithBucketsBy = (unit: DividedBy) => {
    const xValues: Array<Date> = [];
    const buckets: Array<Bucket> = [];
    if (unit === DividedBy.day) {
      const days = calculateDaysBetween(selectedStartDate, selectedEndDate);
      for (let i = 0; i < days; i++) {
        const date = new Date(selectedStartDate);
        date.setDate(date.getDate() + i);
        xValues.push(date);
        buckets.push({
          start: date.getTime(),
          end: date.getTime() + 1000 * 60 * 60 * 24,
          imosOnlyCount: 0,
          total: 0,
        });
      }
    } else if (unit === DividedBy.month) {
      const months = calculateMonthBetween(selectedStartDate, selectedEndDate);
      for (let i = 0; i < months; i++) {
        const date = new Date(selectedStartDate);
        date.setMonth(date.getMonth() + i);
        xValues.push(date);
        buckets.push({
          start: date.getTime(),
          end: date.getTime() + 1000 * 60 * 60 * 24 * 30,
          imosOnlyCount: 0,
          total: 0,
        });
      }
    } else if (unit === DividedBy.year) {
      const years = calculateYearBetween(selectedStartDate, selectedEndDate);
      for (let i = 0; i < years; i++) {
        const date = new Date(selectedStartDate);
        date.setFullYear(date.getFullYear() + i);
        xValues.push(date);
        buckets.push({
          start: date.getTime(),
          end: date.getTime() + 1000 * 60 * 60 * 24 * 365,
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

  const xAxisLabelFormatter = (date: Date): string => {
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
  };

  const createSeries = (buckets: Bucket[]) => {
    const series: BarSeriesType[] = [];
    const imos: BarSeriesType = {
      id: "imos-data-id",
      type: "bar",
      valueFormatter: seriesFormatter,
      stack: "total",
      label: "IMOS Data",
      data: buckets.flatMap((m) => m.imosOnlyCount),
      color: theme.palette.info.dark,
    };
    const others: BarSeriesType = {
      id: "others-data-id",
      type: "bar",
      valueFormatter: seriesFormatter,
      stack: "total",
      label: "All Data",
      data: buckets.flatMap((m) => m.total - m.imosOnlyCount),
      color: theme.palette.info.light,
    };

    series.push(imos);
    series.push(others);
    return series;
  };

  // below consts are private variables
  const unit = determineChartUnit();
  const { xValues, buckets } = determineXWithBucketsBy(unit);
  const series: BarSeriesType[] = createSeries(buckets);

  return (
    <BarChart
      height={200}
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
          data: xValues,
          scaleType: "band",
          // valueFormatter: (date: Date) => date.toLocaleDateString(),
          valueFormatter: xAxisLabelFormatter,
          tickMinStep: 3600 * 1000 * 48, // min step: 48h,
          // If you want the label rotate
          // tickLabelStyle: {
          //  angle: 45,
          //  dominantBaseline: 'hanging',
          //  textAnchor: 'start',
          // },
        },
      ]}
      series={series}
    />
  );
};

export default TimeRangeBarChart;
