import { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import {
  createSearchParamFrom,
  fetchResultWithStore,
  SearchParameters,
} from "../common/store/searchReducer";
import { useNavigate } from "react-router-dom";
import { Button, Divider, Grid, IconButton, Paper } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import grey from "../common/colors/grey";
import { Tune } from "@mui/icons-material";
import AdvanceFilters from "../common/filters/AdvanceFilters";
import store, { AppDispatch, getComponentState } from "../common/store/store";
import {
  ParameterState,
  formatToUrlParam,
} from "../common/store/componentParamReducer";
import InputWithSuggester from "./InputWithSuggester.tsx";
import { pageDefault } from "../common/constants";

const SimpleTextSearch = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const executeSearch = useCallback(() => {
    const componentParam: ParameterState = getComponentState(store.getState());
    const searchParameters: SearchParameters =
      createSearchParamFrom(componentParam);

    dispatch(fetchResultWithStore(searchParameters))
      .unwrap()
      .then(() => {
        navigate(pageDefault.search + "?" + formatToUrlParam(componentParam), {
          state: { fromNavigate: true },
        });
      });
  }, [dispatch, navigate]);

  const handleEnterPressed = useCallback(
    (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (event.key === "Enter") {
        executeSearch();
      }
    },
    [executeSearch]
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

  return (
    <>
      <Grid container>
        <Grid item xs={12}>
          <Grid container justifyContent={"center"} spacing={2}>
            <Grid item xs={10}>
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
                <InputWithSuggester handleEnterPressed={handleEnterPressed} />
                <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
                <IconButton sx={{ p: "10px" }} aria-label="search">
                  <SearchIcon />
                </IconButton>
              </Paper>
            </Grid>
            <Grid item xs={2}>
              <Button
                variant="text"
                sx={{
                  color: grey["searchButtonText"],
                  backgroundColor: "white",
                  height: "100%",
                  width: "100%",
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
