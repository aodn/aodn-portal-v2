import React, {useCallback, useEffect, useState} from 'react';
import {border, borderRadius, dateDefault, margin} from '../constants';
import {Grid, Box} from '@mui/material';
import TuneIcon from "@mui/icons-material/Tune";
import DatePicker from "../datetime/DatePicker";
import {DateRangeSlider} from "../slider/RangeSlider";
import { BarChart } from '@mui/x-charts/BarChart';
import dayjs from "dayjs";
import { BarSeriesType } from '@mui/x-charts';
import { MakeOptional } from '@mui/x-charts/models/helpers';
import {useDispatch} from "react-redux";
import {AppDispatch} from "../store/store";
import {fetchResultNoStore, OGCCollections} from "../store/searchReducer";
import {findSmallestDate} from "./api";

interface RemovableDateTimeFilterProps {
    title: string,
    url: string
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
const isIncludedInBucket = (targetStart: number, targetEnd: number, bucketStart: number, bucketEnd: number) =>
    (bucketStart <= targetStart && targetStart <= bucketEnd)
    || (bucketStart <= targetEnd && targetEnd <= bucketEnd)
    || ((targetStart <= bucketStart && bucketEnd <= targetEnd));

const createSeries = (ogcCollections : OGCCollections) : [Date, Array<Date>, MakeOptional<BarSeriesType, "type">[]] => {
    /* Need to convert to something like this
    [
        { data: [3, 4, 1, 6, 5], stack: 'A', label: 'IMOS Data' },
        { data: [4, 3, 1, 5, 8], stack: 'A', label: 'Data amount' }
    ]
    */
    const temp : Date | undefined | null = findSmallestDate(ogcCollections);
    const smallestDate : Date = temp ? temp : dateDefault['min'];
    const largestDate : Date = dateDefault['max'];

    // Since the date series needs to work with the slider, so we need to follow
    // slider assumption where its range is 0 to 100
    const bandWidth = (largestDate.getTime() - smallestDate.getTime()) / 100

    interface Bucket {
        start: number
        end: number
        imosOnlyCount: number,
        totalCount: number
    };

    // Create bucket of time slot so can count how many records is within
    // that time slot
    const xValues : Array<Date> = [];
    const buckets : Array<Bucket> = [];
    for(let i: number = 0; i < 100; i++) {
        let b : Bucket = {
            start: smallestDate.getTime() + i * bandWidth,
            end: smallestDate.getTime() + (i+1) * bandWidth,
            imosOnlyCount: 0,
            totalCount: 0
        };
        buckets.push(b);
        xValues.push(new Date(b.start));
    }

    // Scan through stacs collection and add to bucket count iff within range
    ogcCollections.collections.forEach(i => {
        i?.extent
            ?.temporal
            ?.interval
            ?.forEach(v => {
                // Check individual item is within the time range
                // if yes then increase bucket count.
                buckets.forEach(b => {
                    let start = v[0]? new Date(v[0]).getTime() : null;

                    // Some big further date if not specified.
                    let end = v[1]? new Date(v[1]).getTime() : new Date().getTime() * 2;

                    // If you do not have a start, it is invalid date, hence skip
                    if(start && isIncludedInBucket(start, end, b.start, b.end)) {
                        b.imosOnlyCount++;  // TODO: need to fix
                        b.totalCount++;
                    }
                });
            })
    });

    const series : BarSeriesType[] = [];
    const formatter = (value: number): string => {
        return `${value}`;
    };

    let imos : BarSeriesType = {
        type: "bar",
        valueFormatter: formatter,
        stack: 'S',
        label: 'IMOS Data',
        data: buckets.flatMap(m => m.imosOnlyCount)
    }

    let total : BarSeriesType = {
        type: "bar",
        valueFormatter: formatter,
        stack: 'S',
        label: 'Total',
        data: buckets.flatMap(m => m.totalCount)
    }

    series.push(imos);
    series.push(total);

    return [smallestDate, xValues, series];
}

const RemovableDateTimeFilter = (props: RemovableDateTimeFilterProps) => {
    const dispatch = useDispatch<AppDispatch>();

    // Must separate picker start and end date with slider to avoid feedback loop
    const [pickerStartDate, setPickerStartDate] = useState<Date>(dateDefault['min']);
    const [pickerEndDate, setPickerEndDate] = useState<Date>(dateDefault['max']);

    const [minSliderDate, setSliderMinDate] = useState<Date | undefined>(undefined);
    const [startSliderDate, setSliderStartDate] = useState<Date>(dateDefault['min']);
    const [endSliderDate, setSliderEndDate] = useState<Date>(dateDefault['max']);

    const [barSeries, setBarSeries] = useState<MakeOptional<BarSeriesType, "type">[]>([]);
    const [barX, setBarX] = useState<Array<Date>>([]);

    useEffect(() => {
        dispatch(fetchResultNoStore({
                property: 'id,temporal',
                filter: 'temporal after 1970-01-01T00:00:00Z'
            }))
            .unwrap()
            .then((value => {
                const [min, xValues, series] = createSeries(value);
                setBarSeries(series);
                setBarX(xValues);

                setSliderMinDate(min);
                setSliderStartDate(min);

                setPickerStartDate(min);
            }));
    }, [dispatch]);

    const onSlideChanged = useCallback((start: number, end: number) => {
        setPickerStartDate(new Date(start));
        setPickerEndDate(new Date(end));
    },[setPickerStartDate, setPickerEndDate]);

    const onStartDatePickerChanged = useCallback((value: any) => {
        setSliderStartDate(new Date(value));
    },[setSliderStartDate]);

    const onEndDatePickerChanged = useCallback((value: any) => {
        setSliderEndDate(new Date(value));
    },[setSliderEndDate]);

    return(
        <Grid
            container
            columns={13}
            sx={{
                backgroundImage: 'url(/filters/Background.png)',
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover',
                border: border['frameBorder'],
                borderRadius: borderRadius['filter'],
                justifyContent: 'center',
                minHeight: '90px'
            }}
        >
            <Grid item xs={1}
                  sx={{
                      marginTop: margin['top'],
                      textAlign: 'center',
                  }}>
                <Box
                    component="img"
                    src={props.url}
                />
            </Grid>
            <Grid item xs={12}
                  sx={{
                      marginTop: margin['top'],
                      textAlign: 'left',
                  }}>
                <Grid container>
                    <Grid item xs={1}>
                        <div>{props.title}</div>
                        <TuneIcon/>
                    </Grid>
                    <Grid item xs={11} sx={{
                        minHeight: '200px'
                    }}>
                        {
                            // https://mui.com/x/react-charts/legend/
                        }
                        <BarChart
                            margin={{
                                // use to control the space on right, so that it will not overlap with the legend
                                right: 150
                            }}
                            slotProps={{
                                legend: {
                                    direction: 'column',
                                    position: {
                                        vertical: 'middle',
                                        horizontal: 'right',
                                    },
                                    itemMarkWidth: 20,
                                    itemMarkHeight: 20,
                                    markGap: 10,
                                    itemGap: 10,
                                }
                            }}
                            series={barSeries}
                            xAxis={[{
                                data: barX,
                                scaleType: 'band',
                                valueFormatter: (date: Date) => date.toLocaleDateString(),
                                tickMinStep: 3600 * 1000 * 24, // min step: 24h
                            }]}
                        />
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={1}
                  sx={{
                      marginBottom: margin['bottom'],
                  }}/>
            <Grid item xs={12}
                  sx={{
                      marginBottom: margin['bottom'],
                      marginRight: margin['right']
                  }}>
                <Grid container>
                    <Grid item xs={2}>
                        <DatePicker
                            onChange={onStartDatePickerChanged}
                            value={dayjs(pickerStartDate)}
                            views={['year', 'month', 'day']}
                        />
                    </Grid>
                    <Grid item xs={8}>
                        <Grid container sx={{
                            justifyContent: 'center',
                        }}>
                            <Grid item xs={11}>
                                <DateRangeSlider title={'temporal'}
                                                 onSlideChanged={onSlideChanged}
                                                 min={minSliderDate}
                                                 start={startSliderDate}
                                                 end={endSliderDate}/>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={2}>
                        <DatePicker
                            onChange={onEndDatePickerChanged}
                            value={dayjs(pickerEndDate)}
                            views={['year', 'month', 'day']}
                        />
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default RemovableDateTimeFilter;
