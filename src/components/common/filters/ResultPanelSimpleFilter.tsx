import * as React from 'react';
import {Grid, MenuItem} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import SlightRoundButton from "../buttons/SlightRoundButton";
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import {margin} from "../constants";
import NoBorderButton from "../buttons/NoBorderButton";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import RoundSelect from "../dropdown/RoundSelect";
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

interface ResultPanelSimpleFilterProps {
    filterClicked?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const ResultPanelSimpleFilter = (props: ResultPanelSimpleFilterProps) => {

    return(
        <Grid container>
            <Grid item
                  xs={12}
                  sx={{
                      marginTop: margin['top'],
                  }}>
                <Grid container justifyContent='center' columns={11} gap={1}>
                    <Grid item xs='auto'>
                        <SlightRoundButton
                            startIcon={<PlayArrowIcon/>}
                            endIcon={<FilterAltIcon/>}
                            onClick={props.filterClicked}>Expand filters</SlightRoundButton>
                    </Grid>
                    <Grid item xs='auto'><NoBorderButton endIcon={<ArrowBackIosIcon/>}></NoBorderButton></Grid>
                    <Grid item xs={1}>
                        
                    </Grid>
                    <Grid item xs='auto'><NoBorderButton startIcon={<ArrowForwardIosIcon/>}></NoBorderButton></Grid>
                    <Grid item xs={2}>
                        
                    </Grid>
                    <Grid item xs={2}>
                        
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
}

export default ResultPanelSimpleFilter;