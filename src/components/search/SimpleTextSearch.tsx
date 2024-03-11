import React, { useCallback } from "react";
import { margin } from "../common/constants";
import { useDispatch } from "react-redux";
import store, { AppDispatch, getComponentState } from "../common/store/store";
import {
  createSearchParamFrom,
  fetchResultWithStore,
} from "../common/store/searchReducer";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  InputBase,
  Paper,
} from "@mui/material";
import StyledTextField from "./StyledTextField";
import SearchIcon from "@mui/icons-material/Search";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ClearIcon from "@mui/icons-material/Clear";
import NoBorderButton from "../common/buttons/NoBorderButton";
import grey from "../common/colors/grey";
import {
  ParameterState,
  updateSearchText,
} from "../common/store/componentParamReducer";
import { Tune } from "@mui/icons-material";
import AdvanceFilters from "../common/filters/AdvanceFilters";

const getEndAdornment = (handler: any) => (
  <InputAdornment position="end">
    <NoBorderButton
      startIcon={<Tune />}
      sx={{ color: grey["searchButtonText"] }}
      onClick={(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        return handler(event);
      }}
    >
      Advanced Filters
    </NoBorderButton>
    <NoBorderButton
      startIcon={<LocationOnIcon />}
      sx={{ color: grey["searchButtonText"] }}
    >
      Hobart
    </NoBorderButton>
    <NoBorderButton
      endIcon={<SearchIcon />}
      sx={{ color: grey["searchButtonText"] }}
    />
    <NoBorderButton
      endIcon={<ClearIcon />}
      sx={{ color: grey["searchButtonText"] }}
    />
  </InputAdornment>
);

const SimpleTextSearch = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const [searchText, setSearchText] = React.useState(
    getComponentState(store.getState()).searchText
  );
  const [showFilters, setShowFilters] = React.useState<boolean>(false);

  const executeSearch = useCallback(() => {
    const componentParam: ParameterState = getComponentState(store.getState());
    dispatch(fetchResultWithStore(createSearchParamFrom(componentParam)))
      .unwrap()
      .then((v) => navigate("/search"));
  }, [dispatch, navigate]);

  const handleEnterPressed = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key === "Enter") {
        dispatch(updateSearchText(searchText + ""));
        executeSearch();
      }
    },
    [searchText, dispatch, executeSearch]
  );

  const onAdvancedFilterClicked = useCallback(
    (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      setShowFilters((value) => !value);
      executeSearch();
    },
    [executeSearch]
  );

  return (
    <>
      <Grid container>
        <Grid item xs={12}>
          <Grid container justifyContent={"center"} spacing={2}>
            <Grid item xs={10}>
              <Paper
                variant="outlined"
                sx={{ p: "2px 4px", display: "flex", alignItems: "center" }}
              >
                <IconButton sx={{ p: "10px" }} aria-label="search">
                  <SearchIcon />
                </IconButton>
                <InputBase
                  sx={{ ml: 1, flex: 1 }}
                  placeholder="Search for open data"
                  value={searchText}
                  inputProps={{ "aria-label": "search for open data" }}
                />
                <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
                <Button
                  variant="text"
                  sx={{
                    color: grey["searchButtonText"],
                    pr: 1,
                  }}
                  startIcon={<Tune />}
                  // onClick={(e) => {
                  //   onFilterShowHide(e);
                  // }}
                >
                  Filters
                </Button>
              </Paper>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <AdvanceFilters showFilters={showFilters} />
    </>
  );
};

export default SimpleTextSearch;
