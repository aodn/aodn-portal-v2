import { Dispatch, FC, useCallback, useState } from "react";
import { Tune } from "@mui/icons-material";
import { Stack } from "@mui/material";
import SearchbarExpandableButton from "./SearchbarExpandableButton";
import SearchIcon from "@mui/icons-material/Search";
import { borderRadius, color, fontWeight, gap } from "../../styles/constants";
import { useSelector } from "react-redux";
import { getComponentState, RootState } from "../common/store/store";
import { ParameterState } from "../common/store/componentParamReducer";
import useRedirectSearch from "../../hooks/useRedirectSearch";
import { capitalizeFirstLetter } from "../../utils/StringUtils";

export enum SearchbarButtonNames {
  Search = "search",
  Filter = "filter",
}
interface SearchbarButtonGroupProps {
  pendingSearch: boolean;
  setShowFilters: Dispatch<React.SetStateAction<boolean>>;
  activeButton: SearchbarButtonNames;
  setActiveButton: Dispatch<React.SetStateAction<SearchbarButtonNames>>;
}

const checkFilterCount = (filterObj: ParameterState) => {
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
};
// Todo: determine which one should expand
const SearchbarButtonGroup: FC<SearchbarButtonGroupProps> = ({
  pendingSearch,
  setShowFilters,
  activeButton,
  setActiveButton,
}) => {
  const redirectSearch = useRedirectSearch();
  const handleSearchClick = useCallback(() => {
    setActiveButton(SearchbarButtonNames.Search);
    if (!pendingSearch) redirectSearch("ComplexTextSearch");
  }, [pendingSearch, redirectSearch, setActiveButton]);

  const handleFilterClick = useCallback(() => {
    setShowFilters(true);
    setActiveButton(SearchbarButtonNames.Filter);
  }, [setActiveButton, setShowFilters]);

  const filterCount: number = useSelector((state: RootState) => {
    const componentParams = getComponentState(state);
    return checkFilterCount(componentParams);
  });

  return (
    <Stack height="100%" direction="row" spacing={0.5} padding={gap.sm}>
      <SearchbarExpandableButton
        icon={<Tune />}
        text={capitalizeFirstLetter(SearchbarButtonNames.Filter)}
        badgeContent={filterCount}
        onClick={handleFilterClick}
        showText={activeButton === SearchbarButtonNames.Filter}
        data-testid="filtersBtn"
      />
      <SearchbarExpandableButton
        icon={<SearchIcon />}
        text={capitalizeFirstLetter(SearchbarButtonNames.Search)}
        onClick={handleSearchClick}
        showText={activeButton === SearchbarButtonNames.Search}
        buttonSx={{
          color: "#fff",
          fontWeight: fontWeight.light,
          backgroundColor: color.blue.extraDark,
          borderRadius: borderRadius.small,
          "&:hover": {
            backgroundColor: color.brightBlue.dark,
          },
        }}
      />
    </Stack>
  );
};

export default SearchbarButtonGroup;
