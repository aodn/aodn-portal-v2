import React, { useCallback } from 'react';
import {Grid, Button, Paper, InputBase, IconButton, Divider} from '@mui/material';
import  { useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import grey from '../common/colors/grey';
import {Tune} from "@mui/icons-material";
import { useDispatch } from 'react-redux'
import {createSearchParamFrom, fetchResultWithStore} from '../common/store/searchReducer';
import store, {AppDispatch, getComponentState} from "../common/store/store";
import RemovableFilters from "../common/filters/RemovableFilters";
import AdvanceFilters from '../common/filters/AdvanceFilters';
import {ParameterState, updateSearchText} from "../common/store/componentParamReducer";

export interface ComplexTextSearchProps {
    onFilterCallback: (events : React.MouseEvent<HTMLAnchorElement> | React.MouseEvent<HTMLButtonElement>, show: boolean) => void | null;
}

/**
 * Put it here to avoid refresh the function every time the component is rendered
 * @param handler 
 * @returns 
 */
const searchButton = (handler: () => void) => {

    return(<Button        
        sx={{
            color: grey["searchButtonText"],
            backgroundColor: 'white',
            height: '100%',
            minWidth: '150px'
        }}
        onClick={() => {
            return handler();
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

    const onSearchClick = useCallback(() => {
        dispatch(updateSearchText(searchText + ''));

        const componentParam : ParameterState = getComponentState(store.getState());
        dispatch(fetchResultWithStore(createSearchParamFrom(componentParam)))
            .unwrap()
            .then(() => navigate('/search'));

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
                    onExpandAllFilters={() => setToggleRemovableFilter(false)}
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
                    marginTop: 8,
                      marginBottom: 12
                  }}
                  >
                <Grid container justifyContent={'center'} spacing={2}>
                    <Grid item xs={7}>
                        <Paper component="form" sx={{marginInlineStart: 2, p: '2px 4px', display: 'flex', alignItems: 'center'}}>
                            <IconButton sx={{ p: '10px' }} aria-label="search">
                                <SearchIcon />
                            </IconButton>
                            <InputBase
                                sx={{ ml: 1, flex: 1 }}
                                placeholder="Search for open data"
                                inputProps={{ 'aria-label': 'Search for open data' }}
                                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                    setSearchText(event.target.value);
                                }}
                            />
                            <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
                            <Button
                                variant="text"
                                sx={{
                                    color: grey["searchButtonText"],
                                    pr: 1
                                }}
                                startIcon={<Tune/>}
                                onClick={(e) => {
                                    onFilterShowHide(e);
                                }}
                            >
                                Filters
                            </Button>
                        </Paper>
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