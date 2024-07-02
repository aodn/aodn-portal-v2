import React, { useCallback, useState } from "react";
import { Button, Divider, Grid, IconButton, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import grey from "../common/colors/grey";
import { Tune } from "@mui/icons-material";
import store, { getComponentState } from "../common/store/store";
import AdvanceFilters from "../common/filters/AdvanceFilters";
import {
  ParameterState,
  formatToUrlParam,
} from "../common/store/componentParamReducer";
import InputWithSuggester from "./InputWithSuggester";
import { pageDefault } from "../common/constants";
import { color, fontColor, padding } from "../../styles/constants.js";

export const filterButtonWidth = 100;
export const searchIconWidth = 44;

const ComplexTextSearch = () => {
  const navigate = useNavigate();
  const [showFilters, setShowFilters] = useState<boolean>(false);

  const redirectSearch = useCallback(() => {
    const componentParam: ParameterState = getComponentState(store.getState());
    navigate(pageDefault.search + "?" + formatToUrlParam(componentParam), {
      state: {
        fromNavigate: true,
        requireSearch: true,
        referer: "ComplexTextSearch",
      },
    });
  }, [navigate]);

  const handleEnterPressed = useCallback(
    (
      event: React.KeyboardEvent<HTMLTextAreaElement | HTMLInputElement>,
      isSuggesterOpen: boolean
    ) => {
      if (event.key === "Enter" && !isSuggesterOpen) {
        redirectSearch();
      }
    },
    [redirectSearch]
  );

  const onFilterClick = useCallback(() => {
    setShowFilters(true);
  }, [setShowFilters]);

  return (
    <Grid container spacing={2}>
      <Grid item xs={10}>
        <Paper
          sx={{
            display: "flex",
            alignItems: "center",
            height: "100%",
          }}
        >
          <IconButton
            sx={{ width: `${searchIconWidth}px`, p: padding.small }}
            aria-label="search"
          >
            <SearchIcon />
          </IconButton>
          <InputWithSuggester handleEnterPressed={handleEnterPressed} />
          <Button
            variant="text"
            sx={{
              height: "100%",
              minWidth: `${filterButtonWidth}px`,
              color: fontColor.blue.medium,
              paddingX: padding.large,
              backgroundColor: color.gray.xxLight,
            }}
            startIcon={<Tune />}
            onClick={onFilterClick}
            data-testid={"filtersBtn"}
          >
            Filters
          </Button>
        </Paper>
      </Grid>
      <Grid
        item
        xs={2}
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <Button
          sx={{
            color: grey["searchButtonText"],
            backgroundColor: "#fff",
            height: "100%",

            ":hover": {
              backgroundColor: "#fff",
            },
          }}
          fullWidth
          onClick={redirectSearch}
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
