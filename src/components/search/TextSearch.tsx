import * as React from 'react';
import {Grid, TextField, InputAdornment, Button, withStyles, TextFieldProps} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import grey from '../common/colors/grey';
import {styled} from "@mui/material/styles";
import {Tune} from "@mui/icons-material";

const StyledTextField = styled(TextField)<TextFieldProps>(({ theme }) => ({
    minWidth: '100%',
    marginInline: '2px',
    backgroundColor: grey['search'],
    "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
        borderColor: "white"
    },
    "& .MuiOutlinedInput-input": {
        color: "black"
    },
    // "&:hover .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
    //     borderColor: "red"
    // },
    // "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
    //     borderColor: "purple"
    // },
    // "&:hover .MuiOutlinedInput-input": {
    //     color: "red"
    // },
    // "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-input": {
    //     color: "purple"
    // },
    // "& .MuiInputLabel-outlined": {
    //     color: "green"
    // },
    // "&:hover .MuiInputLabel-outlined": {
    //     color: "red"
    // },
    // "& .MuiInputLabel-outlined.Mui-focused": {
    //     color: "purple"
    // }
}));

const filterButton = () =>
    <InputAdornment position='end'>
        <Button
            variant="outlined"
            sx={{
                color: grey["searchButtonText"],
                borderColor: grey["searchButtonText"]
            }}
            startIcon={<Tune/>}
        >
            Filters
        </Button>
    </InputAdornment>

const searchButton = () =>
    <Button
        sx={{
            color: grey["searchButtonText"],
            backgroundColor: grey["search"],
            height: '100%',
            borderColor: 'white',
            borderSize: '5px',
            minWidth: '217px'
        }}
    >
        Search
    </Button>

const TextSearch = () => {
    return(
        <Grid container>
            <Grid item xs={12}>
                <Grid container justifyContent={'left'} spacing={2}>
                    <Grid item xs={2}>&nbsp;</Grid>
                    <Grid item xs={7}>
                        <StyledTextField
                            id="outlined-search"
                            label="Search for open data"
                            type="search"
                            InputProps={{
                                style: {color: 'white'},
                                startAdornment: (<InputAdornment position='start'><SearchIcon/></InputAdornment>),
                                endAdornment: filterButton()
                            }}
                        />
                    </Grid>
                    <Grid item>{searchButton()}</Grid>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default TextSearch;