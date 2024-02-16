import Collapse from "@mui/material/Collapse";
import {Grid} from "@mui/material";
import NoBorderButton from "../buttons/NoBorderButton";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import RemovableParameterFilter from "./RemovableParameterFilter";
import React from "react";
import AddIcon from "@mui/icons-material/Add";
import grey from "../colors/grey";
import SettingsOverscanIcon from "@mui/icons-material/SettingsOverscan";
import CheckIcon from "@mui/icons-material/Check";
import Divider from "@mui/material/Divider";

export interface RemovableFiltersProps {
    onFilterShowHide: (events : React.MouseEvent<HTMLAnchorElement> | React.MouseEvent<HTMLButtonElement>) => void | null,
    onExpandAllFilters: (events : React.MouseEvent<HTMLButtonElement>) => void | null,
    showFilters: boolean
};

const filterFooter = (onExpandAllFilters: (events :  React.MouseEvent<HTMLButtonElement>) => void | null) =>
    <Grid item xs={8}>
        <Grid
            container
            columns={6}
        >
            <Grid item xs={1}>
                <NoBorderButton
                    endIcon={<AddIcon/>}
                    sx={{
                        color: grey['searchButtonText'],
                    }}
                >
                    Add Filters
                </NoBorderButton>
            </Grid>
            <Grid item xs={4} sx={{textAlign: 'center'}}>
                <NoBorderButton
                    sx={{
                        color: grey['searchButtonText'],
                    }}
                    endIcon={<SettingsOverscanIcon/>}
                    onClick={(event) => onExpandAllFilters && onExpandAllFilters(event)}
                >
                    Expand All Filters
                </NoBorderButton>
            </Grid>
            <Grid item xs={1} sx={{textAlign: 'right'}}>
                <NoBorderButton
                    endIcon={<CheckIcon/>}
                    sx={{
                        color: grey['searchButtonText'],
                    }}
                >
                    Apply Filters
                </NoBorderButton>
            </Grid>
        </Grid>
        <Divider></Divider>
    </Grid>;

const RemovableFilters = (props : RemovableFiltersProps) => {
    return (
        <Collapse orientation="vertical" in={props.showFilters}>
            <Grid
                container
                gap={2}
                justifyContent={'center'}
            >
                <Grid item xs={8} sx={{textAlign:'center'}}>
                    <NoBorderButton
                        endIcon={<ArrowDropUpIcon/>}
                        sx={{
                            fontWeight: 'bold',
                        }}
                        onClick={(e) => {props.onFilterShowHide(e)}}
                    >
                        Search Filters
                    </NoBorderButton>
                </Grid>
                <Grid item xs={8}><RemovableParameterFilter title='Parameter' url='/filters/tune.png'/></Grid>
                <Grid item xs={8}><RemovableParameterFilter title='Platform' url='/filters/platform.png'/></Grid>
                <Grid item xs={8}><RemovableParameterFilter title='Organization' url='/filters/organization.png'/></Grid>
                <Grid item xs={8}><RemovableParameterFilter title='Data' url='/filters/data.png'/></Grid>
                {
                    // The bottom section of filter group, contains three button
                    filterFooter(props.onExpandAllFilters)
                }

            </Grid>
        </Collapse>
    );
};

RemovableFilters.defaultProps = {
    onFilterShowHide: null,
    onExpandAllFilters: null,
    showFilters: false
}

export default RemovableFilters;