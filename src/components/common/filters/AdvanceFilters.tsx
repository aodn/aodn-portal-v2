import React from "react";
import {Grid, Collapse, SxProps, Theme, Divider, Switch, FormControlLabel} from '@mui/material';
import RemovableDateTimeFilter from "./RemovableDateTimeFilter";
import {border, margin} from "../constants";
import BorderButton from "../buttons/BorderButton";
import grey from "../colors/grey";
import {Tune, Layers, People, DataThresholding} from "@mui/icons-material";

export interface NonRemovableFiltersProps {
    showFilters: boolean,
    gridColumn: number,
    sx?: SxProps<Theme>
};

const AdvanceFilters = (props: NonRemovableFiltersProps) => {
    return(
        <Collapse orientation="vertical" in={props.showFilters}>
            <Grid
                container
                sx={{
                    // Make it overlay instead of push smart card downwards
                    zIndex:1,
                    position:'absolute',
                }}
                justifyContent={'center'}
            >
                <Grid item xs={props.gridColumn}>
                    <Grid container
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
                                    <FormControlLabel control={<Switch defaultChecked />} label="IMOS Data" />
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