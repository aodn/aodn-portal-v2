import React, {
  Dispatch,
  FC,
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useSelector } from "react-redux";
import { Autocomplete, Box, Paper, Popper, TextField } from "@mui/material";
import {
  ParameterState,
  updateSearchText,
} from "../common/store/componentParamReducer";
import store, { getComponentState, RootState } from "../common/store/store";
import {
  createSuggesterParamFrom,
  fetchSuggesterOptions,
} from "../common/store/searchReducer";
import { borderRadius, color, padding } from "../../styles/constants";
import { debounce } from "lodash";
import { sortByRelevance } from "../../utils/Helpers";
import { useAppDispatch } from "../common/store/hooks";
import { TEXT_FIELD_MIN_WIDTH } from "./constants";
import { SearchbarButtonNames } from "./SearchbarButtonGroup";
import { useLocation } from "react-router-dom";
import { pageDefault } from "../common/constants";
import useBreakpoint from "../../hooks/useBreakpoint";
import { portalTheme } from "../../styles";

interface InputWithSuggesterProps {
  handleEnterPressed?: (
    event: React.KeyboardEvent<HTMLTextAreaElement | HTMLInputElement>,
    isSearchbarFocused: boolean
  ) => void;
  handleScrollToTop?: () => void;
  setPendingSearch?: React.Dispatch<React.SetStateAction<boolean>>;
  setActiveButton?: Dispatch<React.SetStateAction<SearchbarButtonNames>>;
  setShouldExpandSearchbar?: Dispatch<React.SetStateAction<boolean>>;
  setShouldExpandAllButtons?: Dispatch<React.SetStateAction<boolean>>;
  suggesterWidth?: number;
}

// TODO: Try to only use these two classes inside this file to maintain high cohesion.
//  But if they must be used outside, refactor these two to a common place.
interface OptionType {
  text: string;
  group: string;
}

enum OptionGroup {
  PARAMETER = "parameter",
  PHRASE = "phrase",
  ORGANIZATION = "organization",
  PLATFORM = "platform",
}

/**
 * Customized input box with suggester. If more customization is needed, please
 * do as the below nullable props.
 * @param handleEnterPressed handle the event when users press the ENTER on keyboard.
 * have a default empty implementation. Can be overridden.
 * @param handleScrollToTop
 * @param setPendingSearch
 * @param setActiveButton
 * @param setShouldExpandSearchbar
 * @param setShouldExpandAllButtons
 * @param suggesterWidth
 * @constructor
 */
const InputWithSuggester: FC<InputWithSuggesterProps> = ({
  handleEnterPressed,
  handleScrollToTop,
  setPendingSearch,
  setActiveButton,
  setShouldExpandSearchbar,
  setShouldExpandAllButtons,
  suggesterWidth = 0,
}) => {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { isMobile } = useBreakpoint();
  const [isSearchbarActive, setIsSearchbarActive] = useState(false);
  const [options, setOptions] = useState<OptionType[]>([]);
  const searchInput = useSelector(
    (state: RootState) => state.paramReducer.searchText
  );
  const [inputValue, setInputValue] = useState<string | undefined>(searchInput);

  const refreshOptions = useCallback(
    async (inputValue: string) => {
      // setPendingSearch to true to prevent doing search before refreshing options is finished
      setPendingSearch?.(true);
      try {
        const currentState: ParameterState = getComponentState(
          store.getState()
        );
        dispatch(fetchSuggesterOptions(createSuggesterParamFrom(currentState)))
          .unwrap()
          .then((data) => {
            const parameter = new Set<string>(data.suggested_parameter_vocabs);
            const phrases = new Set<string>(data.suggested_phrases);
            const organization = new Set<string>(
              data.suggested_organizations_vocabs
            );
            const platform = new Set<string>(data.suggested_platform_vocabs);

            // Create an array of all unique suggestions
            const allSuggestions = new Set([
              ...organization,
              ...parameter,
              ...phrases,
              ...platform,
            ]);

            // Sort suggestions by relevance
            const sortedSuggestions = sortByRelevance(
              allSuggestions,
              inputValue
            );

            // Create a sorted options array
            const options: OptionType[] = sortedSuggestions.map(
              (suggestion) => {
                if (organization.has(suggestion)) {
                  return { text: suggestion, group: OptionGroup.ORGANIZATION };
                } else if (parameter.has(suggestion)) {
                  return { text: suggestion, group: OptionGroup.PARAMETER };
                } else if (phrases.has(suggestion)) {
                  return { text: suggestion, group: OptionGroup.PHRASE };
                } else {
                  return { text: suggestion, group: OptionGroup.PLATFORM };
                }
              }
            );

            setOptions(options);
          });
      } catch (error) {
        // TODO: Add error handling in the future.(toast, alert, etc)
        //  Also need to apply error handing
        //  in some other places if needed.
        console.error("Error fetching data:", error);
      } finally {
        // when refreshing options is done, allow to search
        setPendingSearch?.(false);
      }
    },
    [dispatch, setPendingSearch]
  );

  const debounceRefreshOptions = useRef(debounce(refreshOptions, 500)).current;

  // cancel all debounce things when component is unmounted
  useEffect(() => {
    return () => {
      debounceRefreshOptions.cancel();
    };
  }, [debounceRefreshOptions]);

  const handleInputChange = useCallback(
    (_: any, newInputValue: string) => {
      if (newInputValue?.length > 0) {
        debounceRefreshOptions(newInputValue);
      }
      setTimeout(() => {
        // Must use setTimeout so that update can be outside this cycle
        // otherwise the text will not update correctly
        setInputValue(newInputValue);
        dispatch(updateSearchText(newInputValue));
      }, 0);
    },
    [debounceRefreshOptions, dispatch]
  );

  const handleSearchbarOpen = useCallback(() => {
    handleScrollToTop?.();
    setActiveButton?.(SearchbarButtonNames.Search);
    setIsSearchbarActive(true);
    if (location.pathname === pageDefault.landing && !isMobile) {
      setShouldExpandAllButtons?.(false);
    }
  }, [
    handleScrollToTop,
    isMobile,
    location.pathname,
    setActiveButton,
    setShouldExpandAllButtons,
  ]);

  const handleSearchbarClose = useCallback(() => {
    setIsSearchbarActive(false);
    if (location.pathname === pageDefault.landing && !isMobile) {
      setShouldExpandAllButtons?.(true);
    }
    setOptions([]);
  }, [isMobile, location.pathname, setShouldExpandAllButtons]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLTextAreaElement | HTMLInputElement>) => {
      if (event.key === "Enter") {
        handleEnterPressed?.(event, false);
      }
    },
    [handleEnterPressed]
  );

  // Listen to isSearchbarActive | searchInput.length to update shouldExpandSearchbar with Header
  // Searchbar will keep expanded if searchbar is active or there exists a text input
  useEffect(() => {
    if (isSearchbarActive || (searchInput && searchInput.length > 0)) {
      setShouldExpandSearchbar?.(true);
    } else {
      setShouldExpandSearchbar?.(false);
    }
  }, [isSearchbarActive, searchInput, setShouldExpandSearchbar]);

  useEffect(() => {
    setInputValue(searchInput);
  }, [searchInput]);

  // Input suggester popper
  const CustomPopper = useCallback(
    (props: any): ReactNode => {
      return (
        <Popper
          {...props}
          placement="bottom-start"
          modifiers={[
            {
              name: "offset",
              options: {
                offset: [0, 10], // Vertical offset
              },
            },
            {
              name: "flip",
              enabled: false, // Disable the flip modifier
            },
          ]}
          style={{
            width: suggesterWidth,
            borderRadius: borderRadius.small,
          }}
        />
      );
    },
    [suggesterWidth]
  );

  // Input suggester paper
  const CustomPaper = useCallback(
    (props: any): ReactNode => {
      return (
        <Paper
          elevation={location.pathname === pageDefault.search ? 2 : 1}
          sx={{
            backgroundColor: "#fff",
            borderRadius: borderRadius.small,
            "& .MuiAutocomplete-listbox": {
              borderRadius: borderRadius.small,
              paddingX: padding.small,
            },
            "& .MuiAutocomplete-option": {
              color: "#000",
              borderRadius: borderRadius.small,
              "&[aria-selected='true']": {
                backgroundColor: color.blue.xLight,
              },
              "&.Mui-focused": {
                backgroundColor: `${color.blue.xLight} !important`,
              },
              "&:hover": {
                backgroundColor: color.blue.xLight,
              },
            },
          }}
          {...props}
        />
      );
    },
    [location.pathname]
  );

  return (
    <Autocomplete
      id="search"
      fullWidth
      freeSolo
      PopperComponent={CustomPopper}
      PaperComponent={CustomPaper}
      open={isSearchbarActive && options.length > 0}
      onOpen={handleSearchbarOpen}
      onClose={handleSearchbarClose}
      value={inputValue}
      forcePopupIcon={false}
      options={options.flatMap((option) => option.text)}
      autoComplete
      includeInputInList
      disablePortal
      onInputChange={handleInputChange}
      sx={{
        bgcolor: "#fff",
        borderRadius: borderRadius.small,
        ".MuiOutlinedInput-root": { padding: 0, paddingLeft: padding.small },

        // Keep the clear text button 'X' visible when there exists text input
        "& .MuiAutocomplete-clearIndicator": {
          visibility:
            searchInput && searchInput.length > 0 ? "visible" : "hidden",
        },
      }}
      renderInput={(params) => (
        <Box flexGrow={1}>
          <TextField
            sx={{
              minWidth: TEXT_FIELD_MIN_WIDTH,
              "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
                border: "none",
              },
            }}
            {...params}
            placeholder="Search for open data"
            inputProps={{
              "aria-label": "Search for open data",
              ...params.inputProps,
              onKeyDown: handleKeyDown,
              "data-testid": "input-with-suggester",
              sx: {
                "&::placeholder": {
                  ...portalTheme.typography.title1Medium,
                  color: portalTheme.palette.text2,
                  opacity: 1,
                },
              },
            }}
          />
        </Box>
      )}
    />
  );
};

export default InputWithSuggester;
