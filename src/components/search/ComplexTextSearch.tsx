import React, { useCallback } from 'react';
import {Grid, InputAdornment, Button} from '@mui/material';
import  { useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import grey from '../common/colors/grey';
import {Tune} from "@mui/icons-material";
import {margin} from '../common/constants';
import StyledTextField from "./StyledTextField";
import { useDispatch } from 'react-redux'
import { fetchResult, SearchParameters } from '../common/store/searchReducer';
import { AppDispatch } from "../common/store/store";
import RemovableFilters from "../common/filters/RemovableFilters";

export interface ComplexTextSearchProps {
    onFilterCallback: (events : React.MouseEvent<HTMLAnchorElement> | React.MouseEvent<HTMLButtonElement>, show: boolean) => void | null;
};

const filterButton = (onFilterShowHide: (events : React.MouseEvent<HTMLAnchorElement> | React.MouseEvent<HTMLButtonElement>) => void | null) =>

    <InputAdornment position='end'>
        <Button
            variant="outlined"
            sx={{
                color: grey["searchButtonText"],
                borderColor: grey["searchButtonText"]
            }}
            startIcon={<Tune/>}
            onClick={(e) => {
                onFilterShowHide(e);
            }}
        >
            Filters
        </Button>
    </InputAdornment>

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

const ComplexTextSearch = ({onFilterCallback} : ComplexTextSearchProps) => {
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

    const onFilterShowHide = useCallback((events : React.MouseEvent<HTMLAnchorElement> | React.MouseEvent<HTMLButtonElement>) => {

        setShowFilters(value => !value);
        onFilterCallback && onFilterCallback(events, !showFilters);

    },[onFilterCallback, showFilters, setShowFilters]);

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
                                endAdornment: filterButton(onFilterShowHide)
                            }}
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                setSearchText(event.target.value);
                            }}
                        />
                    </Grid>
                    <Grid item>{searchButton(onSearchClick)}</Grid>
                </Grid>
                <RemovableFilters
                    showFilters={showFilters}
                    onFilterShowHide={onFilterShowHide}
                />
            </Grid>
        </Grid>
    );
};

ComplexTextSearch.defaultProps = {
    onFilterCallback: null
}

export default ComplexTextSearch;