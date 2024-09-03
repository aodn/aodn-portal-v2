import {
  Autocomplete,
  Box,
  Chip,
  Paper,
  Popper,
  Stack,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import React, {
  FC,
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  Vocab,
  ParameterState,
  updateParameterVocabs,
  updateCommonKey,
  updateSearchText,
} from "../common/store/componentParamReducer";
import store, {
  AppDispatch,
  getComponentState,
  RootState,
} from "../common/store/store";
import { useDispatch, useSelector } from "react-redux";
import {
  createSuggesterParamFrom,
  fetchParameterVocabsWithStore,
  fetchSuggesterOptions,
} from "../common/store/searchReducer";
import { borderRadius, color, padding } from "../../styles/constants";
import { filterButtonWidth, searchIconWidth } from "./ComplexTextSearch";

import _ from "lodash";
import { sortByRelevance } from "../../utils/Helpers";

interface InputWithSuggesterProps {
  handleEnterPressed?: (
    event: React.KeyboardEvent<HTMLTextAreaElement | HTMLInputElement>,
    isSuggesterOpen: boolean
  ) => void;
  setPendingSearch?: React.Dispatch<React.SetStateAction<boolean>>;
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

const textfieldMinWidth = 200;

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
}) => {
  const theme = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<OptionType[]>([]);
  const [parameterVocabSet, setParameterVocabSet] = useState<Vocab[]>([]);

  const emptyArray: Vocab[] = [];
  const selectedParameterVocabs: Vocab[] = useSelector(
    (state: RootState) => state.paramReducer.parameterVocabs || emptyArray
  );

  const searchInput = useSelector(
    (state: RootState) => state.paramReducer.searchText
  );

  const selectedParameterVocabsStrs = selectedParameterVocabs
    ? [...new Set(selectedParameterVocabs.map((c) => c.label))]
    : [];
  useCallback(
    (parameter_vocab: string) => {
      const currentParameterVocabs = selectedParameterVocabs
        ? new Array(...selectedParameterVocabs)
        : [];
      // if parameterVocabSet contains a parameter_vocab whose label is parameter_vocab, then add it to the currentParameterVocabs
      const parameterVocabToAdd = parameterVocabSet.find(
        (c) => c.label === parameter_vocab
      );
      if (!parameterVocabToAdd) {
        //may need warning / alert in the future
        console.error("no parameter vocabs found: ", parameter_vocab);
        return;
      }
      if (currentParameterVocabs.find((c) => c.label === parameter_vocab)) {
        //may need warning / alert in the future
        console.error("already have parameter vocab: ", parameter_vocab);
        return;
      }
      currentParameterVocabs.push(parameterVocabToAdd);
      dispatch(updateParameterVocabs(currentParameterVocabs));
    },
    [parameterVocabSet, dispatch, selectedParameterVocabs]
  );

  const removeParameterVocab = useCallback(
    (parameterVocab: string) => {
      const currentParameterVocabs = new Array(...selectedParameterVocabs);
      const parameterVocabToRemove = parameterVocabSet.find(
        (c) => c.label === parameterVocab
      );
      if (!parameterVocabToRemove) {
        //may need warning / alert in the future
        console.error("no parameterVocab found: ", parameterVocab);
        return;
      }
      if (!currentParameterVocabs.find((c) => c.label === parameterVocab)) {
        //may need warning / alert in the future
        console.error(
          "no parameterVocab found in current parameterVocab state: ",
          parameterVocab
        );
        return;
      }
      // remove this parameterVocab from currentParameterVocabs
      _.remove(currentParameterVocabs, (c) => c.label === parameterVocab);
      dispatch(updateParameterVocabs(currentParameterVocabs));
    },
    [parameterVocabSet, dispatch, selectedParameterVocabs]
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

            // check if the current inputValue is a common key or not, then dispatch updateCommonKey
            if (
              commonSuggestions.some(
                (item) => item.toLowerCase() === inputValue.toLowerCase()
              )
            ) {
              dispatch(updateCommonKey(inputValue));
            } else {
              dispatch(updateCommonKey(""));
            }

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

  const onInputChange = useCallback(
    async (_: any, newInputValue: string) => {
      // If user type anything, then it is not a title search anymore
      dispatch(updateSearchText(newInputValue));
      if (newInputValue?.length > 0) {
        // wait for the debounced refresh to complete
        // dispatch updateCommonKey if there is any during the refreshing-options to ensure the commonKey comes from the latest options given any inputValue changed
        await debounceRefreshOptions(newInputValue);
      } else {
        // update to clear the commonKey
        // this happens when user clear input text with button "X"
        dispatch(updateCommonKey(""));
      }
    },
    [debounceRefreshOptions, dispatch]
  );

  useEffect(() => {
    dispatch(fetchParameterVocabsWithStore(null))
      .unwrap()
      .then((parameterVocabs: Array<Vocab>) => {
        const root = parameterVocabs.filter((i) => i.broader?.length === 0);
        let child = new Array<Vocab>();
        root
          .filter((i) => i.narrower?.length !== 0)
          .forEach((i) => i.narrower?.forEach((j) => child.push(j)));

        child = child.sort((a, b) =>
          a.label < b.label ? -1 : a.label > b.label ? 1 : 0
        );
        setParameterVocabSet(child);
      });
  }, [dispatch]);

  const handleSuggesterOpen = () => {
    setOpen(true);
  };

  const handleSuggesterClose = () => {
    setOpen(false);
    setOptions([]);
  };

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    if (event.key === "Enter") {
      if (open) {
        setOpen(false);
      } else {
        handleEnterPressed(event, false);
      }
    }
  };

  const [searchFieldWidth, setSearchFieldWidth] = useState<number>(0);
  const [parameterVocabWidth, setParameterVocabWidth] = useState<number>(0);
  const searchFieldDiv = useRef(null);
  const parameterVocabDiv = useRef(null);

  useEffect(() => {
    // Create a ResizeObserver to monitor changes in element sizes
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.target === searchFieldDiv.current) {
          setSearchFieldWidth(entry.contentRect.width);
        } else if (entry.target === parameterVocabDiv.current) {
          setParameterVocabWidth(entry.contentRect.width);
        }
      }
    });

    // Get the elements from refs
    const searchFieldElement = searchFieldDiv.current;
    const parameterVocabElement = parameterVocabDiv.current;

    // Observe the elements
    if (searchFieldElement) {
      observer.observe(searchFieldElement);
    }

    if (parameterVocabElement) {
      observer.observe(parameterVocabElement);
    }

    // Cleanup observer on component unmount
    return () => {
      if (searchFieldElement) {
        observer.unobserve(searchFieldElement);
      }
      if (parameterVocabElement) {
        observer.unobserve(parameterVocabElement);
      }
    };
  }, []);

  const CustomPopper = (props: any): ReactNode => {
    // Util function for calculating the suggester offset
    const calculateOffset = () => {
      return searchFieldWidth - parameterVocabWidth < textfieldMinWidth
        ? [-searchIconWidth, 0]
        : [-(parameterVocabWidth + searchIconWidth), 0];
    };
    return (
      <Popper
        {...props}
        placement="bottom-start"
        modifiers={[
          {
            name: "offset",
            options: {
              offset: calculateOffset, // Skid horizontally by parameterVocabWidth, no vertical offset
            },
          },
          {
            name: "flip",
            enabled: false, // Disable the flip modifier
          },
        ]}
        style={{
          width: `${searchFieldWidth + searchIconWidth + filterButtonWidth}px`,
        }}
      />
    );
  };

  const CustomPaper = (props: any): ReactNode => {
    return (
      <Paper
        sx={{
          backgroundColor: color.blue.xLight,
          "& .MuiAutocomplete-listbox": {
            borderRadius: borderRadius.medium,
            bgcolor: color.blue.xLight,
          },
          "& .MuiListSubheader-root": {
            bgcolor: color.blue.xLight,
          },
        }}
        {...props}
      />
    );
  };

  return (
    <>
      <Autocomplete
        id="search"
        fullWidth
        freeSolo
        PopperComponent={CustomPopper}
        PaperComponent={CustomPaper}
        open={open}
        onOpen={handleSuggesterOpen}
        onClose={handleSuggesterClose}
        value={searchInput}
        forcePopupIcon={false}
        options={options.flatMap((option) => option.text)}
        autoComplete
        includeInputInList
        onInputChange={onInputChange}
        renderInput={(params) => (
          <Box display="flex" flexWrap="wrap" ref={searchFieldDiv}>
            <Stack
              display={selectedParameterVocabs?.length > 0 ? "flex" : "none"}
              spacing={1}
              direction="row"
              useFlexGap
              flexWrap="wrap"
              paddingY={padding.small}
              ref={parameterVocabDiv}
            >
              <Typography
                fontFamily={theme.typography.fontFamily}
                fontSize="small"
                paddingTop={padding.extraSmall}
              >
                Parameters&nbsp;:&nbsp;
              </Typography>

              {selectedParameterVocabsStrs?.map((c, i) => (
                <Box key={i}>
                  <Chip
                    sx={{ fontSize: "12px" }}
                    label={c}
                    onDelete={() => {
                      removeParameterVocab(c);
                    }}
                  />
                </Box>
              ))}
            </Stack>
            <Box flexGrow={1}>
              <TextField
                sx={{
                  minWidth: textfieldMinWidth,
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
          </Box>
        )}
      />
    </>
  );
};

export default InputWithSuggester;
