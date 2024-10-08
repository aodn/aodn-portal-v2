import React, { useCallback, useState } from "react";
import { Button, Grid, IconButton, Paper } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import grey from "../common/colors/grey";
import { Tune } from "@mui/icons-material";
import AdvanceFilters from "../common/filters/AdvanceFilters";
import InputWithSuggester from "./InputWithSuggester";
import {
  borderRadius,
  color,
  fontColor,
  padding,
} from "../../styles/constants";

export const filterButtonWidth = 100;
export const searchIconWidth = 44;

interface ComplexTextSearchProps {
  onSearchClick: () => void;
}

const ComplexTextSearch: React.FC<ComplexTextSearchProps> = ({
  onSearchClick,
}) => {
  const [showFilters, setShowFilters] = useState<boolean>(false);

  // set the default value to false to allow user do search without typing anything
  const [pendingSearch, setPendingSearch] = useState<boolean>(false);

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
        onSearchClick();
      }
    },
    [pendingSearch, onSearchClick]
  );

  const handleSearchClick = useCallback(() => {
    if (!pendingSearch) onSearchClick();
  }, [pendingSearch, onSearchClick]);

  const handleFilterClick = useCallback(() => {
    setShowFilters(true);
  }, [setShowFilters]);

  return (
    <Grid container spacing={1}>
      <Grid item xs={10}>
        <Paper
          elevation={0}
          sx={{
            display: "flex",
            alignItems: "center",
            height: "100%",
            borderRadius: borderRadius.small,
          }}
        >
          <IconButton
            sx={{ width: `${searchIconWidth}px`, p: padding.small }}
            aria-label="search"
          >
            <SearchIcon />
          </IconButton>
          <InputWithSuggester
            handleEnterPressed={handleEnterPressed}
            setPendingSearch={setPendingSearch}
          />
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
            onClick={handleFilterClick}
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
      </Grid>
      <AdvanceFilters
        showFilters={showFilters}
        setShowFilters={setShowFilters}
      />
    </Grid>
  );
};

export default ComplexTextSearch;
