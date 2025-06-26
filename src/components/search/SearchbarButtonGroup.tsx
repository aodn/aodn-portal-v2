import { FC, useCallback, useMemo } from "react";
import { Tune } from "@mui/icons-material";
import { Stack, SxProps } from "@mui/material";
import SearchbarExpandableButton from "./SearchbarExpandableButton";
import SearchIcon from "@mui/icons-material/Search";
import DateRangeIcon from "@mui/icons-material/DateRange";
import PlaceIcon from "@mui/icons-material/Place";
import { borderRadius, color, fontWeight, gap } from "../../styles/constants";
import { useAppSelector } from "../common/store/hooks";
import {
  DEFAULT_SEARCH_LOCATION,
  ParameterState,
} from "../common/store/componentParamReducer";
import useRedirectSearch from "../../hooks/useRedirectSearch";
import { capitalizeFirstLetter } from "../../utils/StringUtils";
import { booleanEqual } from "@turf/boolean-equal";

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
  isPopupOpen: boolean;
  sx?: SxProps;
}

const buttonStyleOnDropdownOpen = {
  color: "#fff",
  backgroundColor: color.blue.dark,
  "&:hover": {
    backgroundColor: color.blue.dark,
  },
};

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
      return filterObj.dateTimeFilterRange?.start !== undefined ||
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

      if (filterObj.hasCOData) {
        count++;
      }

      return count;

    case SearchbarButtonNames.Location:
      // If the polygon is undefined, then it means no filter
      // If the polygon is also the default search polygon, it means no filter too
      // as this is the default
      return filterObj.polygon &&
        !booleanEqual(filterObj.polygon, DEFAULT_SEARCH_LOCATION)
        ? 1
        : 0;

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
  isPopupOpen,
  sx,
}) => {
  const componentParams: ParameterState = useAppSelector(
    (state) => state.paramReducer
  );

  const redirectSearch = useRedirectSearch();

  const handleSearchClick = useCallback(() => {
    handleClickButton(SearchbarButtonNames.Search);
    if (!pendingSearch) redirectSearch("ComplexTextSearch");
  }, [handleClickButton, pendingSearch, redirectSearch]);

  const [dateCount, areaCount, filterCount] = useMemo(
    () => [
      checkCount({
        filterObj: componentParams,
        type: SearchbarButtonNames.Date,
      }),
      checkCount({
        filterObj: componentParams,
        type: SearchbarButtonNames.Location,
      }),
      checkCount({
        filterObj: componentParams,
        type: SearchbarButtonNames.Filter,
      }),
    ],
    [componentParams]
  );

  return (
    <Stack
      height="100%"
      width="auto"
      direction="row"
      justifyContent="end"
      spacing={0.5}
      padding={gap.sm}
      paddingLeft={gap.md}
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
        buttonSx={
          isPopupOpen && activeButton === SearchbarButtonNames.Date
            ? buttonStyleOnDropdownOpen
            : {}
        }
        containerSx={{ flex: 1 }}
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
        buttonSx={
          isPopupOpen && activeButton === SearchbarButtonNames.Location
            ? buttonStyleOnDropdownOpen
            : {}
        }
        containerSx={{ flex: 1 }}
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
        containerSx={{ flex: 1 }}
        buttonSx={
          isPopupOpen && activeButton === SearchbarButtonNames.Filter
            ? buttonStyleOnDropdownOpen
            : {}
        }
        data-testid="filtersBtn"
      />
      <SearchbarExpandableButton
        icon={<SearchIcon />}
        text={capitalizeFirstLetter(SearchbarButtonNames.Search)}
        onClick={handleSearchClick}
        showText={false}
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
