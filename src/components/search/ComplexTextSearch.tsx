import React, { useCallback, useState, useEffect } from "react";
import {
  Grid,
  Button,
  Paper,
  IconButton,
  Divider,
  Autocomplete,
} from "@mui/material";
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
import axios from "axios";
import StyledTextField from "./StyledTextField";

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
 * @param handler
 * @returns
 */
const searchButton = (handler: () => void) => {
  return (
    <Button
      sx={{
        color: grey["searchButtonText"],
        backgroundColor: "white",
        height: "100%",
      }}
      fullWidth
      onClick={() => {
        return handler();
      }}
    >
      Search
    </Button>
  );
};

const ComplexTextSearch = ({ onFilterCallback }: ComplexTextSearchProps) => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [options, setOptions] = useState<readonly string[]>([]);
  const loading = open && options.length === 0;

  const [toggleRemovableFilter, setToggleRemovableFilter] =
    useState<boolean>(true);
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [searchText] = useState<string>("");

  const onSearchClick = useCallback(() => {
    dispatch(updateSearchText(searchText + ""));

    const componentParam: ParameterState = getComponentState(store.getState());
    dispatch(fetchResultWithStore(createSearchParamFrom(componentParam)))
      .unwrap()
      .then(() => navigate("/search"));
  }, [dispatch, navigate, searchText]);

  const onSearchSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      onSearchClick();
    },
    [onSearchClick]
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

  useEffect(() => {
    if (inputValue.trim() === "") {
      setOptions(value ? [value] : []);
      return undefined;
    }

    const fetchData = async () => {
      try {
        const response = await axios.get("/api/v1/ogc/ext/autocomplete", {
          params: {
            input: inputValue,
          },
        });
        setOptions(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [inputValue, loading, value]);

  useEffect(() => {
    if (!open) {
      setOptions([]);
    }
  }, [open]);

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
            <form onSubmit={onSearchSubmit}>
              <Paper
                sx={{ p: "2px 4px", display: "flex", alignItems: "center" }}
              >
                <IconButton sx={{ p: "10px" }} aria-label="search">
                  <SearchIcon />
                </IconButton>
                <Autocomplete
                  id="search"
                  fullWidth
                  open={open}
                  onOpen={() => {
                    setOpen(true);
                  }}
                  onClose={() => {
                    setOpen(false);
                  }}
                  loading={loading}
                  getOptionLabel={(option) => option}
                  filterOptions={(x) => x}
                  options={options}
                  autoComplete
                  includeInputInList
                  filterSelectedOptions
                  value={value}
                  noOptionsText="No locations"
                  onChange={(_, newValue: string | null) => {
                    setOptions(newValue ? [newValue, ...options] : options);
                    setValue(newValue);
                    onSearchClick();
                  }}
                  onInputChange={(_, newInputValue) => {
                    setInputValue(newInputValue);
                  }}
                  renderInput={(params) => (
                    <StyledTextField
                      {...params}
                      placeholder="Search for open data"
                      inputProps={{
                        "aria-label": "Search for open data",
                        ...params.inputProps,
                      }}
                    />
                  )}
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
            </form>
          </Grid>
          <Grid item xs={2}>
            {searchButton(onSearchClick)}
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
