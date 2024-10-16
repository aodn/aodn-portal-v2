import React, { useCallback, useState } from "react";
import { Badge, Box, Button, Grid, IconButton, Paper } from "@mui/material";
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
import {
  borderRadius,
  color,
  fontColor,
  padding,
} from "../../styles/constants";
import StyledBadge, { Position } from "../common/badge/StyledBadge";
import { filterButtonWidth, searchIconWidth } from "./constants";

const ComplexTextSearch = () => {
  const navigate = useNavigate();
  const [showFilters, setShowFilters] = useState<boolean>(false);

  // set the default value to false to allow user do search without typing anything
  const [pendingSearch, setPendingSearch] = useState<boolean>(false);

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
      // TODO: a more user-friendly way to execute 'enter' press function is to delay the search to wait for pendingSearch turn to true
      // instead of prevent user doing search if pendingSearch is false
      // considering the debounce (300ms) and fetchSuggesterOptions(quite fast according to experience with edge) is not very long
      // we may implement this later if gap is too big
      if (event.key === "Enter" && !isSuggesterOpen && !pendingSearch) {
        redirectSearch();
      }
    },
    [pendingSearch, redirectSearch]
  );

  const handleSearchClick = useCallback(() => {
    if (!pendingSearch) redirectSearch();
  }, [pendingSearch, redirectSearch]);

  const handleFilterClick = useCallback(() => {
    setShowFilters(true);
  }, [setShowFilters]);

  return (
    <Box width="100%">
      <Paper
        elevation={0}
        sx={{
          display: "flex",
          alignItems: "center",
          height: "100%",
          borderRadius: borderRadius.small,
        }}
      >
        <InputWithSuggester
          handleEnterPressed={handleEnterPressed}
          setPendingSearch={setPendingSearch}
        />
        <Box
          sx={{
            height: "100%",
            padding: padding.extraSmall,
            minWidth: `${filterButtonWidth}px`,
          }}
        >
          <StyledBadge badgeContent={4} position={Position.topRight}>
            <Button
              fullWidth
              sx={{
                height: "100%",
                color: fontColor.blue.medium,
                paddingX: padding.large,
                backgroundColor: color.blue.xLight,
                borderRadius: borderRadius.small,
                "&:hover": { backgroundColor: color.blue.light },
              }}
              startIcon={<Tune />}
              onClick={handleFilterClick}
              data-testid="filtersBtn"
            >
              Filters
            </Button>
          </StyledBadge>
        </Box>
        <Box height="100%">
          <IconButton
            sx={{
              height: "100%",
              width: `${searchIconWidth}px`,
              color: "#fff",
              backgroundColor: color.blue.extraDark,
              borderRadius: borderRadius.small,
            }}
            onClick={handleSearchClick}
            aria-label="search"
          >
            <SearchIcon />
          </IconButton>
        </Box>
      </Paper>
      {/* <Grid
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
            borderRadius: borderRadius.small,
            ":hover": {
              backgroundColor: "#fff",
            },
          }}
          fullWidth
          onClick={handleSearchClick}
        >
          Search
        </Button>
      </Grid> */}
      <AdvanceFilters
        showFilters={showFilters}
        setShowFilters={setShowFilters}
      />
    </Box>
  );
};

export default ComplexTextSearch;
