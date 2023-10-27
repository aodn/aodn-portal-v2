import * as React from 'react';
import {Grid, Box, Button, MenuItem, OutlinedInput} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import BorderButton from "../buttons/BorderButton";
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import {margin} from "../constants";
import NoBorderButton from "../buttons/NoBorderButton";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import RoundSelect from "../dropdown/RoundSelect";
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

const ResultPanelSimpleFilter = () => {
    return(
        <Grid container>
            <Grid item
                  xs={12}
                  sx={{
                      marginTop: margin['top'],
                      marginBottom: margin['bottom']
                  }}>
                <Grid container justifyContent='center' columns={11} gap={1 }>
                    <Grid item xs='auto'>
                        <BorderButton startIcon={<PlayArrowIcon/>} endIcon={<FilterAltIcon/>}>Expand filters</BorderButton>
                    </Grid>
                    <Grid item xs='auto'><NoBorderButton endIcon={<ArrowBackIosIcon/>}></NoBorderButton></Grid>
                    <Grid item xs={1}>
                        <RoundSelect>
                            <MenuItem>1-20 on 1258 matching</MenuItem>
                        </RoundSelect>
                    </Grid>
                    <Grid item xs='auto'><NoBorderButton startIcon={<ArrowForwardIosIcon/>}></NoBorderButton></Grid>
                    <Grid item xs={2}>
                        <RoundSelect>
                            <MenuItem>Sort By</MenuItem>
                        </RoundSelect>
                    </Grid>
                    <Grid item xs={2}>
                        <RoundSelect>
                            <MenuItem>Sort By</MenuItem>
                        </RoundSelect>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
}

export default ResultPanelSimpleFilter;