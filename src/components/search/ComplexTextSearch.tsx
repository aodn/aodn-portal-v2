import React, { useCallback, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Box, Button, Paper } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { Tune } from "@mui/icons-material";
import store, { getComponentState, RootState } from "../common/store/store";
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
  gap,
  padding,
} from "../../styles/constants";
import StyledBadge, { Position } from "../common/badge/StyledBadge";
import { FILTER_BUTTON_WIDTH, SEARCH_ICON_WIDTH } from "./constants";

const ComplexTextSearch = () => {
  const navigate = useNavigate();
  const [showFilters, setShowFilters] = useState<boolean>(false);

  // set the default value to false to allow user do search without typing anything
  const [pendingSearch, setPendingSearch] = useState<boolean>(false);

  const checkFilterCount = useCallback((filterObj: ParameterState) => {
    let count = 0;

    if (
      filterObj.dateTimeFilterRange?.start !== undefined &&
      filterObj.dateTimeFilterRange?.end !== undefined
    ) {
      count++;
    }

    if (filterObj.isImosOnlyDataset === true) {
      count++;
    }

    if (filterObj.parameterVocabs) {
      count += filterObj.parameterVocabs.length;
    }

    if (filterObj.updateFreq !== undefined) {
      count++;
    }

    return count;
  }, []);

  const filterCount: number = useSelector((state: RootState) => {
    const componentParams = getComponentState(state);
    return checkFilterCount(componentParams);
  });

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
            padding: gap.md,
            minWidth: `${FILTER_BUTTON_WIDTH}px`,
          }}
        >
          <StyledBadge badgeContent={filterCount} position={Position.topRight}>
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
        <Box height="100%" width={SEARCH_ICON_WIDTH} padding={gap.sm}>
          <Button
            sx={{
              height: "100%",
              minWidth: "100%",
              color: "#fff",
              backgroundColor: color.blue.extraDark,
              borderRadius: borderRadius.small,
              "&:hover": {
                backgroundColor: color.brightBlue.dark,
              },
            }}
            onClick={handleSearchClick}
            aria-label="search"
          >
            <SearchIcon />
          </Button>
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
