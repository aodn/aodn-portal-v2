import React, {useCallback} from 'react';
import {margin} from "../common/constants";
import { useDispatch } from 'react-redux'
import store, {AppDispatch, getComponentState} from "../common/store/store";
import {createSearchParamFrom, fetchResultWithStore, SearchParameters} from '../common/store/searchReducer';
import  { useNavigate } from 'react-router-dom';
import {Grid, InputAdornment} from '@mui/material';
import StyledTextField from "./StyledTextField";
import SearchIcon from "@mui/icons-material/Search";
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ClearIcon from '@mui/icons-material/Clear';
import NoBorderButton from "../common/buttons/NoBorderButton";
import grey from "../common/colors/grey";
import {useSelector} from "react-redux/es/hooks/useSelector";
import {ParameterState, updateSearchText} from "../common/store/componentParamReducer";

const getEndAdornment = () =>
    <InputAdornment position='end'>
        <NoBorderButton startIcon={<LocationOnIcon/>} sx={{color: grey['searchButtonText']}}>Hobart</NoBorderButton>
        <NoBorderButton endIcon={<SearchIcon/>} sx={{color: grey['searchButtonText']}}/>
        <NoBorderButton endIcon={<ClearIcon/>} sx={{color: grey['searchButtonText']}}/>
    </InputAdornment>


const SimpleTextSearch = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();

    const [searchText, setSearchText] = React.useState(getComponentState(store.getState()).searchText);

    const handleEnterPressed = useCallback((event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === 'Enter') {
            dispatch(updateSearchText(searchText + ''));

            const componentParam : ParameterState = getComponentState(store.getState());
            dispatch(fetchResultWithStore(createSearchParamFrom(componentParam)))
                .unwrap()
                .then((v) => navigate('/search'));
        }

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
                    <Grid item xs={8}>
                        <StyledTextField
                            id="outlined-search"
                            label="Search for open data"
                            type="search"
                            value={searchText}
                            InputProps={{
                                style: {color: 'white'},
                                endAdornment: getEndAdornment()
                            }}
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                setSearchText(event.target.value);
                            }}
                            onKeyDown={handleEnterPressed}
                        />
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
}

export default SimpleTextSearch;