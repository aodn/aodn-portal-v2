import { FC, useCallback, useMemo } from "react";
import { Stack, SxProps } from "@mui/material";
import SearchbarExpandableButton from "./SearchbarExpandableButton";
import { gap } from "../../styles/constants";
import { useAppSelector } from "../common/store/hooks";
import {
  DEFAULT_SEARCH_LOCATION,
  ParameterState,
} from "../common/store/componentParamReducer";
import useRedirectSearch from "../../hooks/useRedirectSearch";
import { capitalizeFirstLetter } from "../../utils/StringUtils";
import { booleanEqual } from "@turf/boolean-equal";
import { pageReferer } from "../common/constants";
import { DateRangeIcon } from "../../assets/icons/search/date";
import { PlaceIcon } from "../../assets/icons/search/location";
import { TuneIcon } from "../../assets/icons/search/filter";
import { portalTheme } from "../../styles";
import { SearchIcon } from "../../assets/icons/search/search";
import useBreakpoint from "../../hooks/useBreakpoint";

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
      if (filterObj.datasetGroup !== undefined) {
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
  const { isMobile, isUnderLaptop } = useBreakpoint();
  const filterButtonWidth = isUnderLaptop ? "100%" : "120px";
  const buttonStyleOnDropdownOpen = {
    color: "#fff",
    backgroundColor: portalTheme.palette.primary1,
    width: filterButtonWidth,
    "&:hover": {
      backgroundColor: portalTheme.palette.primary1,
    },
  };

  const componentParams: ParameterState = useAppSelector(
    (state) => state.paramReducer
  );

  const redirectSearch = useRedirectSearch();

  const handleSearchClick = useCallback(() => {
    handleClickButton(SearchbarButtonNames.Search);
    if (!pendingSearch) {
      redirectSearch(pageReferer.COMPONENT_COMPLEX_TEXT_REFERER);
    }
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
      alignItems="center"
      spacing={0.5}
      padding={gap.sm}
      paddingLeft={gap.md}
      sx={sx}
    >
      <SearchbarExpandableButton
        icon={<DateRangeIcon />}
        iconProps={{
          color:
            isPopupOpen && activeButton === SearchbarButtonNames.Date
              ? "#FFF"
              : portalTheme.palette.primary1,
        }}
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
            : {
                width: (
                  shouldShrinkAllButtons
                    ? false
                    : shouldExpandAllButtons
                      ? true
                      : activeButton === SearchbarButtonNames.Date
                )
                  ? filterButtonWidth
                  : isUnderLaptop
                    ? "42px"
                    : "48px",
              }
        }
        containerSx={{ flex: 1 }}
        data-testid="date-range-button"
      />
      <SearchbarExpandableButton
        icon={<PlaceIcon />}
        iconProps={{
          color:
            isPopupOpen && activeButton === SearchbarButtonNames.Location
              ? "#FFF"
              : portalTheme.palette.primary1,
        }}
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
            : {
                width: (
                  shouldShrinkAllButtons
                    ? false
                    : shouldExpandAllButtons
                      ? true
                      : activeButton === SearchbarButtonNames.Location
                )
                  ? filterButtonWidth
                  : isUnderLaptop
                    ? "42px"
                    : "48px",
              }
        }
        containerSx={{ flex: 1 }}
        data-testid="location-button"
      />
      <SearchbarExpandableButton
        icon={<TuneIcon />}
        iconProps={{
          color:
            isPopupOpen && activeButton === SearchbarButtonNames.Filter
              ? "#FFF"
              : portalTheme.palette.primary1,
        }}
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
            : {
                width: (
                  shouldShrinkAllButtons
                    ? false
                    : shouldExpandAllButtons
                      ? true
                      : activeButton === SearchbarButtonNames.Filter
                )
                  ? filterButtonWidth
                  : isUnderLaptop
                    ? "42px"
                    : "48px",
              }
        }
        data-testid="filtersBtn"
      />
      <SearchbarExpandableButton
        icon={<SearchIcon />}
        text={capitalizeFirstLetter(SearchbarButtonNames.Search)}
        onClick={handleSearchClick}
        showText={false}
        buttonSx={{
          width: "48px",
          height: "48px",
          color: "#FFF",
          backgroundColor: portalTheme.palette.primary2,
          borderRadius: "8px",
          ml: isUnderLaptop ? "0" : "2px",
          "&:hover": {
            backgroundColor: portalTheme.palette.secondary1,
            ml: isUnderLaptop ? "0" : "2px",
          },
        }}
        data-testid="search-button"
      />
    </Stack>
  );
};

export default SearchbarButtonGroup;
