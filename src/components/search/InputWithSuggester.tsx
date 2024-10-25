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
import _ from "lodash";
import { sortByRelevance } from "../../utils/Helpers";
import { useAppDispatch } from "../common/store/hooks";
import { TEXT_FIELD_MIN_WIDTH } from "./constants";
import { SearchbarButtonNames } from "./SearchbarButtonGroup";

interface InputWithSuggesterProps {
  handleEnterPressed?: (
    event: React.KeyboardEvent<HTMLTextAreaElement | HTMLInputElement>,
    isSearchbarFocused: boolean
  ) => void;
  setPendingSearch?: React.Dispatch<React.SetStateAction<boolean>>;
  setActiveButton?: Dispatch<React.SetStateAction<SearchbarButtonNames>>;
  setShouldExpandSearchbar?: Dispatch<React.SetStateAction<boolean>>;
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
  COMMON = "common",
}

/**
 * Customized input box with suggester. If more customization is needed, please
 * do as the below nullable props.
 * @param handleEnterPressed handle the event when users press the ENTER on keyboard.
 * have default empty implementation. Can be overridden.
 * @constructor
 */
const InputWithSuggester: FC<InputWithSuggesterProps> = ({
  handleEnterPressed = () => {},
  setPendingSearch = () => {},
  setActiveButton = () => {},
  setShouldExpandSearchbar = () => {},
  suggesterWidth = 0,
}) => {
  const dispatch = useAppDispatch();

  const [isSearchbarActive, setIsSearchbarActive] = useState(false);

  const [options, setOptions] = useState<OptionType[]>([]);

  const searchInput = useSelector(
    (state: RootState) => state.paramReducer.searchText
  );

  const refreshOptions = useCallback(
    async (inputValue: string) => {
      // setPendingSearch to true to prevent doing search before refreshing options is finished
      setPendingSearch(true);
      try {
        const currentState: ParameterState = getComponentState(
          store.getState()
        );
        dispatch(fetchSuggesterOptions(createSuggesterParamFrom(currentState)))
          .unwrap()
          .then((data) => {
            const parameterVocabSuggestions = new Set<string>(
              data.suggested_parameter_vocabs
            );
            const phrasesSuggestions = new Set<string>(data.suggested_phrases);
            // Get the intersection of parameterVocabSuggestions and phrasesSuggestions
            const commonSuggestions = [...parameterVocabSuggestions].filter(
              (item) => {
                return phrasesSuggestions.has(item);
              }
            );

            // Create array of all unique suggestions
            const allSuggestions = new Set([
              ...commonSuggestions,
              ...parameterVocabSuggestions,
              ...phrasesSuggestions,
            ]);

            // Sort suggestions by relevance
            const sortedSuggestions = sortByRelevance(
              allSuggestions,
              inputValue
            );

            // Create sorted options array
            const options: OptionType[] = sortedSuggestions.map(
              (suggestion) => {
                if (commonSuggestions.includes(suggestion)) {
                  return { text: suggestion, group: OptionGroup.COMMON };
                } else if (parameterVocabSuggestions.has(suggestion)) {
                  return { text: suggestion, group: OptionGroup.PARAMETER };
                } else {
                  return { text: suggestion, group: OptionGroup.PHRASE };
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
        setPendingSearch(false);
      }
    },
    [dispatch, setPendingSearch]
  );

  const debounceRefreshOptions = useRef(
    _.debounce(refreshOptions, 300)
  ).current;

  // cancel all debounce things when component is unmounted
  useEffect(() => {
    return () => {
      debounceRefreshOptions.cancel();
    };
  }, [debounceRefreshOptions]);

  const handleInputChange = useCallback(
    async (_: any, newInputValue: string) => {
      // If user type anything, then it is not a title search anymore
      dispatch(updateSearchText(newInputValue));
      if (newInputValue?.length > 0) {
        // wait for the debounced refresh to complete
        // dispatch updateCommonKey if there is any during the refreshing-options to ensure the commonKey comes from the latest options given any inputValue changed
        await debounceRefreshOptions(newInputValue);
      }
    },
    [debounceRefreshOptions, dispatch]
  );

  const handleSearchbarOpen = () => {
    setActiveButton(SearchbarButtonNames.Search);
    setIsSearchbarActive(true);
  };

  const handleSearchbarClose = () => {
    setIsSearchbarActive(false);
    setOptions([]);
  };

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    if (event.key === "Enter") {
      handleEnterPressed(event, false);
    }
  };

  // Listen to isSearchbarActive | searchInput.length to update shouldExpandSearchbar with Header
  // Searchbar will keep expanded if searchbar is active or there exists a text input
  useEffect(() => {
    if (isSearchbarActive || (searchInput && searchInput.length > 0)) {
      setShouldExpandSearchbar(true);
    } else {
      setShouldExpandSearchbar(false);
    }
  }, [isSearchbarActive, searchInput, setShouldExpandSearchbar]);

  // Input suggester popper
  const CustomPopper = (props: any): ReactNode => {
    return (
      <Popper
        {...props}
        placement="bottom-start"
        modifiers={[
          {
            name: "offset",
            options: {
              offset: [0, 2], // Vertical offset
            },
          },
          {
            name: "flip",
            enabled: false, // Disable the flip modifier
          },
        ]}
        style={{
          width: suggesterWidth,
        }}
      />
    );
  };

  // Input suggester paper
  const CustomPaper = (props: any): ReactNode => {
    return (
      <Paper
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
  };

  return (
    <Autocomplete
      id="search"
      fullWidth
      freeSolo
      PopperComponent={CustomPopper}
      PaperComponent={CustomPaper}
      open={isSearchbarActive}
      onOpen={handleSearchbarOpen}
      onClose={handleSearchbarClose}
      value={searchInput}
      forcePopupIcon={false}
      options={options.flatMap((option) => option.text)}
      autoComplete
      includeInputInList
      onInputChange={handleInputChange}
      sx={{
        ".MuiOutlinedInput-root": { padding: 0, paddingLeft: padding.small },

        // Keep the clear text button 'X' always visible
        "& .MuiAutocomplete-clearIndicator": {
          visibility: "visible",
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
            }}
          />
        </Box>
      )}
    />
  );
};

export default InputWithSuggester;
