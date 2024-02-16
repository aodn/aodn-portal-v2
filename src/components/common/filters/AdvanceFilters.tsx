import React, {useCallback, useState} from "react";
import {Grid, Collapse, SxProps, Theme, Divider, Switch, FormControlLabel, SwitchProps} from '@mui/material';
import RemovableDateTimeFilter from "./RemovableDateTimeFilter";
import {border, margin, zIndex} from "../constants";
import BorderButton from "../buttons/BorderButton";
import grey from "../colors/grey";
import {Tune, Layers, People, DataThresholding} from "@mui/icons-material";
import {useDispatch} from "react-redux";
import store, {AppDispatch, getComponentState} from "../store/store";
import {ParameterState, updateImosOnly, updateSearchText} from "../store/componentParamReducer";

export interface NonRemovableFiltersProps {
    showFilters: boolean,
    gridColumn: number,
    sx?: SxProps<Theme>
};

const AdvanceFilters = (props: NonRemovableFiltersProps) => {
    const dispatch = useDispatch<AppDispatch>();
    const componentParam : ParameterState = getComponentState(store.getState());

    const onImosOnlySwitch = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
        const p : SwitchProps = event.target as SwitchProps;
        dispatch(updateImosOnly(p.checked))

    },[dispatch]);

    return(
        <Collapse orientation="vertical" in={props.showFilters}>
            <Grid
                container
                sx={{
                    // Make it overlay instead of push smart card downwards
                    zIndex: zIndex['FILTER_OVERLAY'],
                    position:'absolute',
                }}
                justifyContent={'center'}
            >
                <Grid item xs={props.gridColumn}>
                    <Grid container
                          item
                          xs={12}
                          sx = {{
                              backgroundImage: 'url(/filters/Background.png)',
                              backgroundRepeat: 'no-repeat',
                              backgroundSize: 'cover',
                              marginTop: margin['top'],
                              ...props.sx,
                          }}
                    >
                        <Grid item xs={12}>
                            <Grid container sx ={{
                                justifyContent: 'center',
                            }}>
                                <Grid item xs={12}>
                                    Advanced Filters
                                </Grid>
                                <Grid item xs={2}>
                                    <BorderButton
                                        sx={{
                                            marginBottom: margin['bottom'],
                                            border: border['buttonBorder'],
                                            backgroundColor: grey['search'],
                                            color: 'black'
                                        }}
                                        startIcon={<Tune/>}
                                    >
                                        Parameter
                                    </BorderButton>
                                </Grid>
                                <Grid item xs={2}>
                                    <BorderButton
                                        sx={{
                                            border: border['buttonBorder'],
                                            backgroundColor: grey['search'],
                                            color: 'black'
                                        }}
                                        startIcon={<Layers/>}
                                    >
                                        Platform
                                    </BorderButton>
                                </Grid>
                                <Grid item xs={2}>
                                    <BorderButton
                                        sx={{
                                            border: border['buttonBorder'],
                                            backgroundColor: grey['search'],
                                            color: 'black'
                                        }}
                                        startIcon={<DataThresholding/>}
                                    >
                                        Data Settings
                                    </BorderButton>
                                </Grid>
                                <Grid item xs={2}>
                                    <BorderButton
                                        sx={{
                                            border: border['buttonBorder'],
                                            backgroundColor: grey['search'],
                                            color: 'black'
                                        }}
                                        startIcon={<Tune/>}
                                    >
                                        Organization
                                    </BorderButton>
                                </Grid>
                                <Grid item xs={2}>
                                    <BorderButton
                                        sx={{
                                            border: border['buttonBorder'],
                                            backgroundColor: grey['search'],
                                            color: 'black'
                                        }}
                                        startIcon={<People/>}
                                    >
                                        Facilities
                                    </BorderButton>
                                </Grid>
                                <Grid item xs={2}>
                                    <FormControlLabel control={<Switch defaultChecked={componentParam.isImosOnlyDataset} onClick={onImosOnlySwitch}/>} label="IMOS Data" />
                                </Grid>
                                <Grid item xs={12}><Divider sx={{ borderBottomWidth: 2 }}/></Grid>
                                <Grid item xs={12}><RemovableDateTimeFilter title='Data Settings' url='/filters/datasetting.png'/></Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Collapse>
    );
}

AdvanceFilters.defaultProps = {
    showFilters: false,
    gridColumn: 8
}

export default AdvanceFilters;