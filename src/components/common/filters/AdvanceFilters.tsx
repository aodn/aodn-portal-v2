import React from "react";
import {Grid, Collapse} from '@mui/material';
import RemovableDateTimeFilter from "./RemovableDateTimeFilter";
import {margin} from "../constants";

export interface NonRemovableFiltersProps {
    showFilters: boolean
};

const AdvanceFilters = (props: NonRemovableFiltersProps) => {
    return(
        <Collapse orientation="vertical" in={props.showFilters}>
            <Grid
                container
                gap={2}
                sx={{
                    // Make it overlay instead of push smart card downwards
                    zIndex:1,
                    position:'absolute',
                    marginTop: margin['top'],
                }}
                justifyContent={'center'}
            >
                <Grid item xs={8}><RemovableDateTimeFilter title='Data Settings' url='/filters/datasetting.png'/></Grid>
            </Grid>
        </Collapse>
    );
}

AdvanceFilters.defaultProps = {
    showFilters: false
}

export default AdvanceFilters;