import React from "react";
import {Grid, Collapse} from '@mui/material';
import RemovableParameterFilter from "./RemovableParameterFilter";
import RemovableDateTimeFilter from "./RemovableDateTimeFilter";

export interface NonRemovableFiltersProps {
    showFilters: boolean
};

const AdvanceFilters = (props: NonRemovableFiltersProps) => {
    return(
        <Collapse orientation="vertical" in={props.showFilters}>
            <Grid
                container
                gap={2}
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