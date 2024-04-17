import React, { useCallback, useState } from "react";
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
import RemovableFilters from "../common/filters/RemovableFilters";
import AdvanceFilters from "../common/filters/AdvanceFilters";
import {
  ParameterState,
  updateSearchText,
} from "../common/store/componentParamReducer";
import InputWithSuggester from "./InputWithSuggester.tsx";

export interface ComplexTextSearchProps {
  onFilterCallback: (
    events:
      | React.MouseEvent<HTMLAnchorElement>
      | React.MouseEvent<HTMLButtonElement>,
    show: boolean
  ) => void | null;
}

/**
 * Put it here to avoid refresh the function every time the component is rendered
 * @param searchText
 * @param handler
 * @returns
 */
const searchButton = (searchText: string, handler: (t: string) => void) => {
  return (
    <Button
      sx={{
        color: grey["searchButtonText"],
        backgroundColor: "white",
        height: "100%",
      }}
      fullWidth
      onClick={() => {
        return handler(searchText);
      }}
    >
      Search
    </Button>
  );
};

const ComplexTextSearch = ({ onFilterCallback }: ComplexTextSearchProps) => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const [textValue, setTextValue] = useState("");
  const [toggleRemovableFilter, setToggleRemovableFilter] =
    useState<boolean>(true);
  const [showFilters, setShowFilters] = useState<boolean>(false);

  const onSearchClick = useCallback(
    (t: string) => {
      dispatch(updateSearchText(t + ""));

      const componentParam: ParameterState = getComponentState(
        store.getState()
      );

      dispatch(fetchResultWithStore(createSearchParamFrom(componentParam)))
        .unwrap()
        .then(() => navigate("/search"));
    },
    [dispatch, navigate]
  );

  const onFilterShowHide = useCallback(
    (
      events:
        | React.MouseEvent<HTMLAnchorElement>
        | React.MouseEvent<HTMLButtonElement>
    ) => {
      setShowFilters((value) => !value);
      onFilterCallback && onFilterCallback(events, !showFilters);
    },
    [onFilterCallback, showFilters, setShowFilters]
  );

  const showFilter = useCallback(() => {
    if (toggleRemovableFilter) {
      return (
        <RemovableFilters
          showFilters={showFilters}
          onFilterShowHide={onFilterShowHide}
          onExpandAllFilters={() => setToggleRemovableFilter(false)}
        />
      );
    } else {
      return <AdvanceFilters showFilters={showFilters} />;
    }
  }, [toggleRemovableFilter, showFilters, onFilterShowHide]);

  return (
    <Grid container>
      <Grid
        item
        xs={8}
        sx={{
          marginTop: 8,
          marginBottom: 12,
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={10}>
            <Paper sx={{ p: "2px 4px", display: "flex", alignItems: "center" }}>
              <IconButton sx={{ p: "10px" }} aria-label="search">
                <SearchIcon />
              </IconButton>
              <InputWithSuggester
                textValue={textValue}
                onInputChangeCallback={setTextValue}
              />
              <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
              <Button
                variant="text"
                sx={{
                  color: grey["searchButtonText"],
                  pr: 1,
                }}
                startIcon={<Tune />}
                onClick={(e) => {
                  onFilterShowHide(e);
                }}
              >
                Filters
              </Button>
            </Paper>
          </Grid>
          <Grid item xs={2}>
            {searchButton(textValue, onSearchClick)}
          </Grid>
        </Grid>
        {showFilter()}
      </Grid>
    </Grid>
  );
};

ComplexTextSearch.defaultProps = {
  onFilterCallback: null,
};

export default ComplexTextSearch;
