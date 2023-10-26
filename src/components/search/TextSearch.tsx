
import {Grid, TextField, InputAdornment, Button, TextFieldProps} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import grey from '../common/colors/grey';
import {styled} from "@mui/material/styles";
import {Tune} from "@mui/icons-material";
import {margin} from '../common/constants';
import NoBorderButton from '../common/buttons/NoBorderButton';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import RemovableFilter from '../common/filters/RemovableFilter';
import Collapse from '@mui/material/Collapse';
import SettingsOverscanIcon from '@mui/icons-material/SettingsOverscan';
import AddIcon from '@mui/icons-material/Add';
import CheckIcon from '@mui/icons-material/Check';
import Divider from '@mui/material/Divider';
import React from 'react';

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

const filterButton = (setValue: React.Dispatch<React.SetStateAction<boolean>>) =>
    <InputAdornment position='end'>
        <Button
            variant="outlined"
            sx={{
                color: grey["searchButtonText"],
                borderColor: grey["searchButtonText"]
            }}
            startIcon={<Tune/>}
            onClick={() => setValue(true)}
        >
            Filters
        </Button>
    </InputAdornment>

const filterFooter = () => 
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
                    endIcon={<SettingsOverscanIcon/>}
                    sx={{
                        color: grey['searchButtonText'],
                    }}
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

const searchButton = () =>
    <Button
        sx={{
            color: grey["searchButtonText"],
            backgroundColor: grey["search"],
            height: '100%',
            borderColor: 'white',
            borderSize: '5px',
            minWidth: '150px'
        }}
    >
        Search
    </Button>

const TextSearch = () => {

    const [showFilters, setShowFilters] = React.useState(false);

    return(
        <Grid container>
            <Grid item
                  xs={12}
                  sx={{
                      marginTop: margin['top'],
                      marginBottom: margin['bottom']
                  }}>
                <Grid container justifyContent={'center'} spacing={2}>
                    <Grid item xs={7}>
                        <StyledTextField
                            id="outlined-search"
                            label="Search for open data"
                            type="search"
                            InputProps={{
                                style: {color: 'white'},
                                startAdornment: (<InputAdornment position='start'><SearchIcon/></InputAdornment>),
                                endAdornment: filterButton(setShowFilters)
                            }}
                        />
                    </Grid>
                    <Grid item>{searchButton()}</Grid>
                </Grid>
                <Collapse orientation="vertical" in={showFilters}>
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
                                onClick={() => {setShowFilters(false)}}
                            >
                                Search Filters 
                            </NoBorderButton>
                        </Grid>
                        <Grid item xs={8}><RemovableFilter title='Parameter' url='/filters/tune.png'/></Grid>
                        <Grid item xs={8}><RemovableFilter title='Platform' url='/filters/platform.png'/></Grid>
                        <Grid item xs={8}><RemovableFilter title='Organization' url='/filters/organization.png'/></Grid>
                        <Grid item xs={8}><RemovableFilter title='Data' url='/filters/data.png'/></Grid>
                        {
                            // The bottom section of filter group, contains three button
                            filterFooter()
                        }

                    </Grid>
                </Collapse>
            </Grid>
        </Grid>
    );
};

export default TextSearch;