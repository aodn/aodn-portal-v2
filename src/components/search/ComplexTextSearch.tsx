import React, { useCallback } from 'react';
import {Grid, InputAdornment, Button} from '@mui/material';
import  { useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import grey from '../common/colors/grey';
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
import StyledTextField from "./StyledTextField";
import { useDispatch } from 'react-redux'
import { fetchResult, SearchParameters } from '../common/store/searchReducer';
import { AppDispatch } from "../common/store/store";

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
/**
 * Put it here to avoid refresh the function every time the component is rendered
 * @param handler 
 * @returns 
 */
const searchButton = (handler: any) => {

    return(<Button
        sx={{
            color: grey["searchButtonText"],
            backgroundColor: grey["search"],
            height: '100%',
            borderColor: 'white',
            borderSize: '5px',
            minWidth: '150px'
        }}
        onClick={(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
            return handler(event);
        }}
    >
        Search
    </Button>);
}

const ComplexTextSearch = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();

    const [showFilters, setShowFilters] = React.useState(false);
    const [searchText, setSearchText] = React.useState('');

    const onSearchClick = useCallback((event : React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        const parameters : SearchParameters = {};
        // OGC api requires comma separated values as list of search terms
        parameters.text = (searchText || '').replace(' ',',');

        dispatch(fetchResult(parameters))
            .unwrap()
            .then((v) => navigate('/search'));

    },[searchText, dispatch, navigate]);

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
                            value={searchText}
                            InputProps={{
                                style: {color: 'white'},
                                startAdornment: (<InputAdornment position='start'><SearchIcon/></InputAdornment>),
                                endAdornment: filterButton(setShowFilters)
                            }}
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                setSearchText(event.target.value);
                            }}
                        />
                    </Grid>
                    <Grid item>{searchButton(onSearchClick)}</Grid>
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

export default ComplexTextSearch;