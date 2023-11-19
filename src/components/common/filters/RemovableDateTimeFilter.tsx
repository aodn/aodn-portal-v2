import React, {useCallback, useEffect, useState} from 'react';
import {border, borderRadius, dateDefault, margin} from '../constants';
import {Grid, Box, Button, MenuItem, OutlinedInput} from '@mui/material';
import TuneIcon from "@mui/icons-material/Tune";
import DatePicker from "../datetime/DatePicker";
import {DateRangeSlider} from "../slider/RangeSlider";
import { BarChart } from '@mui/x-charts/BarChart';
import dayjs from "dayjs";
import { BarSeriesType } from '@mui/x-charts';
import { MakeOptional } from '@mui/x-charts/models/helpers';
import {useDispatch} from "react-redux";
import {AppDispatch} from "../store/store";
import {fetchResultNoStore, SearchParameters, OGCCollections} from "../store/searchReducer";
import {findSmallestDate} from "./api";

interface Dataset {
    imos: number,
    total: number,
    date: Date
}

interface RemovableDateTimeFilterProps {
    title: string,
    url: string
}

const createSeries = (ogcCollections : OGCCollections) : [Date, MakeOptional<BarSeriesType, "type">[]] => {
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
    const buckets : Array<Bucket> = []
    for(let i: number = 0; i < 100; i++) {
        let b : Bucket = {
            start: smallestDate.getTime() + i * bandWidth,
            end: smallestDate.getTime() + (i+1) * bandWidth,
            imosOnlyCount: 0,
            totalCount: 0
        };
        buckets.push(b);
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
                    let start = v[0]? new Date(v[0]) : null;
                    let end = v[1]? new Date(v[1]) : null;
                    if(start && b.start >= start.getTime() && b.end <= start.getTime() // Start within range
                        || !v[1]   // There is no end date, so it spans all bucket
                        || end && b.start >= end.getTime() && b.end <= end.getTime()) {
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
        data: buckets.flatMap(m => m.imosOnlyCount)
    }

    let total : BarSeriesType = {
        type: "bar",
        valueFormatter: formatter,
        stack: 'S',
        data: buckets.flatMap(m => m.totalCount)
    }

    series.push(imos);
    series.push(total);

    return [smallestDate, series];
}

const RemovableDateTimeFilter = (props: RemovableDateTimeFilterProps) => {
    const dispatch = useDispatch<AppDispatch>();

    const [startDate, setStartDate] = useState<Date>(dateDefault['min']);
    const [endDate, setEndDate] = useState<Date>(dateDefault['max']);
    const [series, setSeries] = useState<MakeOptional<BarSeriesType, "type">[]>([]);

    useEffect(() => {
        dispatch(fetchResultNoStore({
                property: 'id,temporal',
                filter: 'temporal after 1970-01-01T00:00:00Z'
            }))
            .unwrap()
            .then((value => {
                const [min, series] = createSeries(value);
                setSeries(series);
            }));
    }, []);

    const onSlideChanged = useCallback((start: number, end: number) => {
        setStartDate(new Date(start));
        setEndDate(new Date(end));
    },[setStartDate, setEndDate]);

    const onStartDatePickerChanged = useCallback((value: any) => {
        setStartDate(new Date(value));
    },[setStartDate]);

    const onEndDatePickerChanged = useCallback((value: any) => {
        setEndDate(new Date(value));
    },[setEndDate]);

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
                            series={series}
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
                            value={dayjs(startDate)}
                            views={['year', 'month', 'day']}
                        />
                    </Grid>
                    <Grid item xs={8}>
                        <Grid container sx={{
                            justifyContent: 'center',
                        }}>
                            <Grid item xs={11}>
                                <DateRangeSlider title={'temporal'} onSlideChanged={onSlideChanged} start={startDate} end={endDate}/>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={2}>
                        <DatePicker
                            onChange={onEndDatePickerChanged}
                            value={dayjs(endDate)}
                            views={['year', 'month', 'day']}
                        />
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default RemovableDateTimeFilter;
