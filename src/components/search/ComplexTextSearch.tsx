import React, { Dispatch, FC, useCallback, useState } from "react";
import { Box, Paper } from "@mui/material";
import AdvanceFilters from "../common/filters/AdvanceFilters";
import InputWithSuggester from "./InputWithSuggester";
import { border, borderRadius, color } from "../../styles/constants";
import SearchbarButtonGroup, {
  SearchbarButtonNames,
} from "./SearchbarButtonGroup";
import useRedirectSearch from "../../hooks/useRedirectSearch";
import useElementSize from "../../hooks/useElementSize";

interface ComplexTextSearchProps {
  setShouldExpandSearchbar?: Dispatch<React.SetStateAction<boolean>>;
}

const ComplexTextSearch: FC<ComplexTextSearchProps> = ({
  setShouldExpandSearchbar,
}) => {
  const [activeButton, setActiveButton] = useState<SearchbarButtonNames>(
    SearchbarButtonNames.Filter
  );

  const [showFilters, setShowFilters] = useState<boolean>(false);

  // set the default value to false to allow user do search without typing anything
  const [pendingSearch, setPendingSearch] = useState<boolean>(false);

  const { ref, width: searchbarWidth } = useElementSize();

  const redirectSearch = useRedirectSearch();

  const handleEnterPressed = useCallback(
    (
      event: React.KeyboardEvent<HTMLTextAreaElement | HTMLInputElement>,
      isSearchbarFocused: boolean
    ) => {
      // TODO: a more user-friendly way to execute 'enter' press function is to delay the search to wait for pendingSearch turn to true
      // instead of prevent user doing search if pendingSearch is false
      // considering the debounce (300ms) and fetchSuggesterOptions(quite fast according to experience with edge) is not very long
      // we may implement this later if gap is too big
      if (event.key === "Enter" && !isSearchbarFocused && !pendingSearch) {
        redirectSearch("ComplexTextSearch");
      }
    },
    [pendingSearch, redirectSearch]
  );

  return (
    <Box width="100%">
      <Paper
        ref={ref}
        elevation={0}
        sx={{
          display: "flex",
          alignItems: "center",
          height: "100%",
          border: `${border.xs} ${color.gray.extraLight}`,
          borderRadius: borderRadius.small,
        }}
      >
        <InputWithSuggester
          handleEnterPressed={handleEnterPressed}
          setPendingSearch={setPendingSearch}
          setActiveButton={setActiveButton}
          setShouldExpandSearchbar={setShouldExpandSearchbar}
          suggesterWidth={searchbarWidth}
        />
        <SearchbarButtonGroup
          setShowFilters={setShowFilters}
          pendingSearch={pendingSearch}
          activeButton={activeButton}
          setActiveButton={setActiveButton}
        />
      </Paper>
      <AdvanceFilters
        showFilters={showFilters}
        setShowFilters={setShowFilters}
      />
    </Box>
  );
};

export default ComplexTextSearch;
