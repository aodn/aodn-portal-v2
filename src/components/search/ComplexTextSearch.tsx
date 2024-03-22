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
//import RemovableFilters from "../common/filters/RemovableFilters";
//import AdvanceFilters from "../common/filters/AdvanceFilters";
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
const searchButton = (searchText: string, handler: () => void) => {
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

  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<readonly string[]>([]);
  const loading = open && options.length === 0;

  // This is use store what need to display on the autocomplete text box, we cannot merge the item together
  const [textValue, setTextValue] = useState("");
  //const [toggleRemovableFilter] = useState<boolean>(true);
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

  // const showFilter = useCallback(() => {
  //   if (toggleRemovableFilter) {
  //     return <AdvanceFilters showFilters={showFilters} />;
  //     // return (
  //     //   <RemovableFilters
  //     //     showFilters={showFilters}
  //     //     onFilterShowHide={onFilterShowHide}
  //     //     onExpandAllFilters={() => setToggleRemovableFilter(false)}
  //     //   />
  //     // );
  //   } else {
  //     return <AdvanceFilters showFilters={showFilters} />;
  //   }
  // }, [toggleRemovableFilter, showFilters, onFilterShowHide]);

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
  }, [textValue, loading]);

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
            <Paper sx={{ p: "2px 4px", display: "flex", alignItems: "center" }}>
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
                onInputChange={(_, newInputValue) => {
                  // If user type anything, then it is not a title search anymore
                  setTextValue(newInputValue);
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
          </Grid>
          <Grid item xs={2}>
            {searchButton(textValue, onSearchClick)}
          </Grid>
        </Grid>
        {/* {showFilter()} */}
      </Grid>
    </Grid>
  );
};

ComplexTextSearch.defaultProps = {
  onFilterCallback: null,
};

export default ComplexTextSearch;
