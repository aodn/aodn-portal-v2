import React, { useCallback, useEffect, useState } from "react";
import { Button, Divider, Grid, IconButton, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import grey from "../common/colors/grey";
import { Tune } from "@mui/icons-material";
import { useDispatch } from "react-redux";
import {
  createSearchParamFrom,
  fetchResultWithStore,
} from "../common/store/searchReducer";
import store, { AppDispatch, getComponentState } from "../common/store/store";
import AdvanceFilters from "../common/filters/AdvanceFilters";
import {
  ParameterState,
  formatToUrlParam,
} from "../common/store/componentParamReducer";
import InputWithSuggester from "./InputWithSuggester";
import { pageDefault } from "../common/constants";
import { padding } from "../../styles/constants.js";

const ComplexTextSearch = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [showFilters, setShowFilters] = useState<boolean>(false);

  const executeSearch = useCallback(() => {
    const componentParam: ParameterState = getComponentState(store.getState());
    dispatch(fetchResultWithStore(createSearchParamFrom(componentParam)))
      .unwrap()
      .then(() =>
        navigate(pageDefault.search + "?" + formatToUrlParam(componentParam), {
          state: { fromNavigate: true },
        })
      );
  }, [dispatch, navigate]);

  const handleEnterPressed = useCallback(
    (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (event.key === "Enter") {
        executeSearch();
      }
    },
    [executeSearch]
  );

  const onFilterClick = useCallback(() => {
    setShowFilters(true);
  }, [setShowFilters]);

  return (
    <Grid container spacing={2}>
      <Grid item xs={10}>
        <Paper
          sx={{
            p: "2px 4px",
            display: "flex",
            alignItems: "center",
          }}
        >
          <IconButton sx={{ p: "10px" }} aria-label="search">
            <SearchIcon />
          </IconButton>
          <InputWithSuggester handleEnterPressed={handleEnterPressed} />
          <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
          <Button
            variant="text"
            sx={{
              color: grey["searchButtonText"],
              paddingX: padding["large"],
            }}
            startIcon={<Tune />}
            onClick={onFilterClick}
            data-testid={"filtersBtn"}
          >
            Filters
          </Button>
        </Paper>
      </Grid>
      <Grid item xs={2}>
        <Button
          sx={{
            color: grey["searchButtonText"],
            backgroundColor: "white",
            height: "100%",
          }}
          fullWidth
          onClick={() => executeSearch()}
        >
          Search
        </Button>
      </Grid>
      <AdvanceFilters
        showFilters={showFilters}
        setShowFilters={setShowFilters}
      />
    </Grid>
  );
};

export default ComplexTextSearch;
