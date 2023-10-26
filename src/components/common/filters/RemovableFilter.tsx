import * as React from 'react';
import {Grid, Box, Select, MenuItem, OutlinedInput} from '@mui/material';
import TuneIcon from '@mui/icons-material/Tune';
import {frameBorder} from '../constants';

const RemovableFilter = () => {
    return (
        <Grid 
            container 
            columns={12} 
            sx={{
                backgroundImage: 'url(/filters/Background.png)',
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover',
                border: frameBorder,
                justifyContent: 'center',
                minHeight: '90px' 
            }}
        >
            <Grid item xs={1}>
                <Box
                    component="img"
                    src="/filters/tune.png"
                />
                </Grid>
            <Grid item xs={2}>
                <div>Parameters</div>
                <TuneIcon/>
            </Grid>
            <Grid item xs={2}>
                <Select
                    input={<OutlinedInput />}
                    renderValue={(selected) => <em>Biological</em>}
                >
                    <MenuItem disabled value="">
                        <em>Biological</em>
                    </MenuItem>
                    <MenuItem>Biologicals</MenuItem>
                </Select>
            </Grid>
        </Grid>
    );
};

export default RemovableFilter;