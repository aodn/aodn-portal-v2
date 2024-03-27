import { useState, useCallback, useEffect } from "react";
import { useDispatch } from "react-redux";
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
  InputBase,
  Paper,
  Autocomplete,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import grey from "../common/colors/grey";
import { Tune } from "@mui/icons-material";
import AdvanceFilters from "../common/filters/AdvanceFilters";
import store, { AppDispatch, getComponentState } from "../common/store/store";
import {
  ParameterState,
  updateSearchText,
} from "../common/store/componentParamReducer";

import StyledTextField from "./StyledTextField";
import axios from "axios";

const SimpleTextSearch = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const [searchText] = useState(getComponentState(store.getState()).searchText);
  const [showFilters, setShowFilters] = useState<boolean>(false);

  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<readonly string[]>([]);
  const [textValue, setTextValue] = useState(searchText);

  const executeSearch = useCallback(() => {
    const componentParam: ParameterState = getComponentState(store.getState());
    dispatch(fetchResultWithStore(createSearchParamFrom(componentParam)))
      .unwrap()
      .then(() => navigate("/search"));
  }, [dispatch, navigate]);

  const handleEnterPressed = useCallback(
    (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (event.key === "Enter") {
        dispatch(updateSearchText(textValue + ""));
        executeSearch();
      }
    },
    [textValue, dispatch, executeSearch]
  );

  const onAdvancedFilterClicked = useCallback(
    (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      setShowFilters((value) => {
        // Only executeSearch when you close the this filter,
        // aka before change value is true
        if (value) executeSearch();
        return !value;
      });
    },
    [executeSearch]
  );

  useEffect(() => {
    const fetchData = async (value) => {
      try {
        const response = await axios.get("/api/v1/ogc/ext/autocomplete", {
          params: {
            input: value,
          },
        });

        const d = response.data;
        setOptions(d);
        setOpen(d.length > 0);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData(textValue);
  }, [textValue]);

  return (
    <>
      <Grid container>
        <Grid item xs={12}>
          <Grid container justifyContent={"center"} spacing={2}>
            <Grid item xs={9}>
              <Paper
                variant="outlined"
                sx={{
                  p: "2px 4px",
                  display: "flex",
                  alignItems: "center",
                  maxHeight: "40px",
                }}
              >
                <IconButton sx={{ p: "10px" }} aria-label="search">
                  <SearchIcon />
                </IconButton>
                <Autocomplete
                  id="search"
                  fullWidth
                  freeSolo
                  open={open}
                  onOpen={() => {
                    setOpen(options.length > 0);
                  }}
                  onClose={() => {
                    setOpen(false);
                  }}
                  forcePopupIcon={false}
                  getOptionLabel={(option) => option}
                  options={options}
                  value={textValue}
                  autoComplete
                  includeInputInList
                  onChange={(_, newValue: string | null) => {
                    if (newValue !== null) {
                      // String quote with double quote to indicate user want the whole phase during search.
                      // fire event here before useState update, need to call function in this case
                      setTextValue(newValue);
                    }
                  }}
                  onInputChange={(
                    event: React.SyntheticEvent,
                    value: string,
                    reason: string
                  ) => {
                    // If user type anything, then it is not a title search anymore
                    setTextValue(value);
                  }}
                  renderInput={(params) => (
                    <StyledTextField
                      {...params}
                      placeholder="Search for open data"
                      inputProps={{
                        "aria-label": "Search for open data",
                        ...params.inputProps,
                        onKeyDown: handleEnterPressed,
                      }}
                    />
                  )}
                />
                <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
                <IconButton sx={{ p: "10px" }} aria-label="search">
                  <SearchIcon />
                </IconButton>
              </Paper>
            </Grid>
            <Grid item xs={3}>
              <Button
                variant="text"
                sx={{
                  color: grey["searchButtonText"],
                  backgroundColor: "white",
                  height: "100%",
                  minWidth: "200px",
                }}
                fullWidth
                startIcon={<Tune />}
                onClick={(e) => onAdvancedFilterClicked(e)}
              >
                Filters
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <AdvanceFilters showFilters={showFilters} />
    </>
  );
};

export default SimpleTextSearch;
