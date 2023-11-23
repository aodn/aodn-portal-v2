import * as React from 'react';
import {FormControlLabel, Grid, MenuItem, Switch, SwitchProps} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import SlightRoundButton from "../buttons/SlightRoundButton";
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import {margin} from "../constants";
import NoBorderButton from "../buttons/NoBorderButton";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import RoundSelect from "../dropdown/RoundSelect";
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import {useDispatch} from "react-redux";
import store, {AppDispatch, getComponentState} from "../store/store";
import {ParameterState, updateImosOnly} from "../store/componentParamReducer";
import {useCallback, useState} from "react";

interface ResultPanelSimpleFilterProps {
    filterClicked?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const ResultPanelSimpleFilter = (props: ResultPanelSimpleFilterProps) => {

    const dispatch = useDispatch<AppDispatch>();
    const componentParam : ParameterState = getComponentState(store.getState());

    const onImosOnlySwitch = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
        const p : SwitchProps = event.target as SwitchProps;
        dispatch(updateImosOnly(p.checked))
    },[dispatch]);

    return(
        <Grid container>
            <Grid item
                  xs={12}
                  sx={{
                      marginTop: margin['top'],
                  }}>
                <Grid container justifyContent='center' columns={11} gap={1 }>
                    <Grid item xs='auto'>
                        <SlightRoundButton
                            startIcon={<PlayArrowIcon/>}
                            endIcon={<FilterAltIcon/>}
                            onClick={props.filterClicked}>Expand filters</SlightRoundButton>
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
                    <Grid item xs='auto'>
                        <FormControlLabel control={<Switch defaultChecked={componentParam.isImosOnlyDataset} onClick={onImosOnlySwitch}/>} label="IMOS Data" />
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
}

export default ResultPanelSimpleFilter;