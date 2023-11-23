import React, { useCallback } from 'react';
import {Grid, InputAdornment, Button} from '@mui/material';
import  { useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import grey from '../common/colors/grey';
import {Tune} from "@mui/icons-material";
import {margin} from '../common/constants';
import StyledTextField from "./StyledTextField";
import { useDispatch } from 'react-redux'
import {createSearchParamFrom, fetchResultWithStore} from '../common/store/searchReducer';
import store, {AppDispatch, getComponentState} from "../common/store/store";
import RemovableFilters from "../common/filters/RemovableFilters";
import AdvanceFilters from '../common/filters/AdvanceFilters';
import {ParameterState, updateSearchText} from "../common/store/componentParamReducer";

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

    const [toggleRemovableFilter, setToggleRemovableFilter] = React.useState<boolean>(true);
    const [showFilters, setShowFilters] = React.useState<boolean>(false);
    const [searchText, setSearchText] = React.useState<string>('');

    const onSearchClick = useCallback((event : React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        dispatch(updateSearchText(searchText + ''));

        const componentParam : ParameterState = getComponentState(store.getState());
        dispatch(fetchResultWithStore(createSearchParamFrom(componentParam)))
            .unwrap()
            .then((v) => navigate('/search'));

    },[dispatch, navigate, searchText]);

    const onFilterShowHide = useCallback((events : React.MouseEvent<HTMLAnchorElement> | React.MouseEvent<HTMLButtonElement>) => {

        setShowFilters(value => !value);
        onFilterCallback && onFilterCallback(events, !showFilters);

    },[onFilterCallback, showFilters, setShowFilters]);

    const showFilter = useCallback(() => {
        if(toggleRemovableFilter) {
            return(
                <RemovableFilters
                    showFilters={showFilters}
                    onFilterShowHide={onFilterShowHide}
                    onExpandAllFilters={(e) => setToggleRemovableFilter(false)}
                />
            );
        }
        else {
            return(
                <AdvanceFilters
                    showFilters={showFilters}
                />
            );
        }
    },[toggleRemovableFilter, showFilters, onFilterShowHide]);

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
                {
                    showFilter()
                }
            </Grid>
        </Grid>
    );
};

ComplexTextSearch.defaultProps = {
    onFilterCallback: null
}

export default ComplexTextSearch;