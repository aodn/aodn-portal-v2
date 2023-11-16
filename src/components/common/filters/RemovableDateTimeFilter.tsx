import React, { useCallback } from 'react';
import {border, borderRadius, margin} from '../constants';
import {Grid, Box, Button, MenuItem, OutlinedInput} from '@mui/material';
import TuneIcon from "@mui/icons-material/Tune";
import DatePicker from "../datetime/DatePicker";
import {DateRangeSlider} from "../slider/RangeSlider";
import { BarChart } from '@mui/x-charts/BarChart';

interface RemovableDateTimeFilterProps {
    title: string,
    url: string
}

const RemovableDateTimeFilter = (props: RemovableDateTimeFilterProps) => {
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
                            series={[
                                { data: [3, 4, 1, 6, 5], stack: 'A', label: 'IMOS Data' },
                                { data: [4, 3, 1, 5, 8], stack: 'A', label: 'Data amount' }
                            ]}
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
                            views={['year', 'month', 'day']}
                        />
                    </Grid>
                    <Grid item xs={8}>
                        <Grid container sx={{
                            justifyContent: 'center',
                        }}>
                            <Grid item xs={11}>
                                <DateRangeSlider title={'temporal'}/>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={2}>
                        <DatePicker
                            views={['year', 'month', 'day']}
                        />
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default RemovableDateTimeFilter;
