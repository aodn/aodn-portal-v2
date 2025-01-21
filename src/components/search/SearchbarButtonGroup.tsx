import { FC, useCallback, useMemo } from "react";
import { Tune } from "@mui/icons-material";
import { Stack, SxProps } from "@mui/material";
import SearchbarExpandableButton from "./SearchbarExpandableButton";
import SearchIcon from "@mui/icons-material/Search";
import DateRangeIcon from "@mui/icons-material/DateRange";
import PlaceIcon from "@mui/icons-material/Place";
import { borderRadius, color, fontWeight, gap } from "../../styles/constants";
import store, { getComponentState } from "../common/store/store";
import { ParameterState } from "../common/store/componentParamReducer";
import useRedirectSearch from "../../hooks/useRedirectSearch";
import { capitalizeFirstLetter } from "../../utils/StringUtils";

export enum SearchbarButtonNames {
  Search = "search",
  Filter = "filter",
  Date = "date",
  Location = "location",
}
interface SearchbarButtonGroupProps {
  pendingSearch: boolean;
  activeButton: SearchbarButtonNames;
  handleClickButton: (button: SearchbarButtonNames) => void;
  shouldExpandAllButtons: boolean;
  shouldShrinkAllButtons?: boolean;
  sx?: SxProps;
}

const checkCount = ({
  filterObj,
  type,
}: {
  filterObj: ParameterState;
  type: SearchbarButtonNames;
}): number => {
  let count = 0;

  switch (type) {
    case SearchbarButtonNames.Date:
      return filterObj.dateTimeFilterRange?.start !== undefined &&
        filterObj.dateTimeFilterRange?.end !== undefined
        ? 1
        : 0;

    case SearchbarButtonNames.Filter:
      if (filterObj.isImosOnlyDataset === true) {
        count++;
      }

      if (filterObj.parameterVocabs) {
        count += filterObj.parameterVocabs.length;
      }

      if (filterObj.platform) {
        count += filterObj.platform.length;
      }

      if (filterObj.updateFreq !== undefined) {
        count++;
      }

      return count;

    default:
      return 0;
  }
};

const SearchbarButtonGroup: FC<SearchbarButtonGroupProps> = ({
  pendingSearch,
  activeButton,
  handleClickButton,
  shouldExpandAllButtons = false,
  shouldShrinkAllButtons = false,
  sx,
}) => {
  const componentParams: ParameterState = getComponentState(store.getState());

  const redirectSearch = useRedirectSearch();

  const handleSearchClick = useCallback(() => {
    handleClickButton(SearchbarButtonNames.Search);
    if (!pendingSearch) redirectSearch("ComplexTextSearch");
  }, [handleClickButton, pendingSearch, redirectSearch]);

  const dateCount = useMemo(
    () =>
      checkCount({
        filterObj: componentParams,
        type: SearchbarButtonNames.Date,
      }),
    [componentParams]
  );

  const areaCount = useMemo(
    () =>
      checkCount({
        filterObj: componentParams,
        type: SearchbarButtonNames.Location,
      }),
    [componentParams]
  );

  const filterCount = useMemo(
    () =>
      checkCount({
        filterObj: componentParams,
        type: SearchbarButtonNames.Filter,
      }),
    [componentParams]
  );

  return (
    <Stack
      height="100%"
      width={{ xs: "100%", sm: "auto" }}
      direction="row"
      justifyContent="end"
      spacing={0.5}
      padding={gap.sm}
      sx={sx}
    >
      <SearchbarExpandableButton
        icon={<DateRangeIcon />}
        text={capitalizeFirstLetter(SearchbarButtonNames.Date)}
        badgeContent={dateCount}
        dotBadge
        onClick={() => handleClickButton(SearchbarButtonNames.Date)}
        showText={
          shouldShrinkAllButtons
            ? false
            : shouldExpandAllButtons
              ? true
              : activeButton === SearchbarButtonNames.Date
        }
        data-testid="date-range-button"
      />
      <SearchbarExpandableButton
        icon={<PlaceIcon />}
        text={capitalizeFirstLetter(SearchbarButtonNames.Location)}
        badgeContent={areaCount}
        dotBadge
        onClick={() => handleClickButton(SearchbarButtonNames.Location)}
        showText={
          shouldShrinkAllButtons
            ? false
            : shouldExpandAllButtons
              ? true
              : activeButton === SearchbarButtonNames.Location
        }
        data-testid="location-button"
      />
      <SearchbarExpandableButton
        icon={<Tune />}
        text={capitalizeFirstLetter(SearchbarButtonNames.Filter)}
        badgeContent={filterCount}
        onClick={() => handleClickButton(SearchbarButtonNames.Filter)}
        showText={
          shouldShrinkAllButtons
            ? false
            : shouldExpandAllButtons
              ? true
              : activeButton === SearchbarButtonNames.Filter
        }
        data-testid="filtersBtn"
      />
      <SearchbarExpandableButton
        icon={<SearchIcon />}
        text={capitalizeFirstLetter(SearchbarButtonNames.Search)}
        onClick={handleSearchClick}
        showText={
          shouldShrinkAllButtons
            ? false
            : shouldExpandAllButtons
              ? true
              : activeButton === SearchbarButtonNames.Search
        }
        buttonSx={{
          color: "#fff",
          fontWeight: fontWeight.light,
          backgroundColor: color.blue.extraDark,
          borderRadius: borderRadius.small,
          "&:hover": {
            backgroundColor: color.brightBlue.dark,
          },
        }}
        data-testid="search-button"
      />
    </Stack>
  );
};

export default SearchbarButtonGroup;
