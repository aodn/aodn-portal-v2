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
  Category,
  ParameterState,
  updateCategories,
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
  fetchParameterCategoriesWithStore,
  fetchSuggesterOptions,
} from "../common/store/searchReducer";
import _, { sortBy } from "lodash";
import { borderRadius, color, padding } from "../../styles/constants";
import { filterButtonWidth, searchIconWidth } from "./ComplexTextSearch";

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
  CATEGORY = "category",
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
  const [categorySet, setCategorySet] = useState<Category[]>([]);

  const emptyArray: Category[] = [];
  const selectedCategories: Category[] = useSelector(
    (state: RootState) => state.paramReducer.categories || emptyArray
  );

  const searchInput = useSelector(
    (state: RootState) => state.paramReducer.searchText
  );

  const selectedCategoryStrs = selectedCategories
    ? [...new Set(selectedCategories.map((c) => c.label))]
    : [];
  useCallback(
    (category: string) => {
      const currentCategories = selectedCategories
        ? new Array(...selectedCategories)
        : [];
      // if categorySet contains a category whose label is category, then add it to the currentCategories
      const categoryToAdd = categorySet.find((c) => c.label === category);
      if (!categoryToAdd) {
        //may need warning / alert in the future
        console.error("no category found: ", category);
        return;
      }
      if (currentCategories.find((c) => c.label === category)) {
        //may need warning / alert in the future
        console.error("already have category: ", category);
        return;
      }
      currentCategories.push(categoryToAdd);
      dispatch(updateCategories(currentCategories));
    },
    [categorySet, dispatch, selectedCategories]
  );

  const removeCategory = useCallback(
    (category: string) => {
      const currentCategories = new Array(...selectedCategories);
      const categoryToRemove = categorySet.find((c) => c.label === category);
      if (!categoryToRemove) {
        //may need warning / alert in the future
        console.error("no category found: ", category);
        return;
      }
      if (!currentCategories.find((c) => c.label === category)) {
        //may need warning / alert in the future
        console.error(
          "no category found in current category state: ",
          category
        );
        return;
      }
      // remove this category from currentCategories
      _.remove(currentCategories, (c) => c.label === category);
      dispatch(updateCategories(currentCategories));
    },
    [categorySet, dispatch, selectedCategories]
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
            const categorySuggestions = new Set<string>(
              data.category_suggestions
            );
            const phrasesSuggestions = new Set<string>(
              data.record_suggestions.suggest_phrases
            );

            // Get the intersection of categorySuggestions and phrasesSuggestions
            const commonSuggestions = [...categorySuggestions].filter(
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
            const allSuggestions = [
              ...new Set([
                ...commonSuggestions,
                ...categorySuggestions,
                ...phrasesSuggestions,
              ]),
            ];

            // Sort suggestions by relevance
            const sortedSuggestions = sortBy(allSuggestions, [
              // Exact match first
              (s) => s.toLowerCase() !== inputValue.toLowerCase(),
              // Then by whether it starts with the input
              (s) => !s.toLowerCase().startsWith(inputValue.toLowerCase()),
              // Then by the index where the input appears in the suggestion
              (s) => s.toLowerCase().indexOf(inputValue.toLowerCase()),
              // Finally by length (shorter suggestions first)
              (s) => s.length,
            ]);

            // Create sorted options array
            const options: OptionType[] = sortedSuggestions.map(
              (suggestion) => {
                if (commonSuggestions.includes(suggestion)) {
                  return { text: suggestion, group: OptionGroup.COMMON };
                } else if (categorySuggestions.has(suggestion)) {
                  return { text: suggestion, group: OptionGroup.CATEGORY };
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
    dispatch(fetchParameterCategoriesWithStore(null))
      .unwrap()
      .then((categories: Array<Category>) => {
        const root = categories.filter((i) => i.broader?.length === 0);
        let child = new Array<Category>();
        root
          .filter((i) => i.narrower?.length !== 0)
          .forEach((i) => i.narrower?.forEach((j) => child.push(j)));

        child = child.sort((a, b) =>
          a.label < b.label ? -1 : a.label > b.label ? 1 : 0
        );
        setCategorySet(child);
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
  const [categoryWidth, setCategoryWidth] = useState<number>(0);
  const searchFieldDiv = useRef(null);
  const categoryDiv = useRef(null);

  useEffect(() => {
    // Create a ResizeObserver to monitor changes in element sizes
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.target === searchFieldDiv.current) {
          setSearchFieldWidth(entry.contentRect.width);
        } else if (entry.target === categoryDiv.current) {
          setCategoryWidth(entry.contentRect.width);
        }
      }
    });

    // Get the elements from refs
    const searchFieldElement = searchFieldDiv.current;
    const categoryElement = categoryDiv.current;

    // Observe the elements
    if (searchFieldElement) {
      observer.observe(searchFieldElement);
    }

    if (categoryElement) {
      observer.observe(categoryElement);
    }

    // Cleanup observer on component unmount
    return () => {
      if (searchFieldElement) {
        observer.unobserve(searchFieldElement);
      }
      if (categoryElement) {
        observer.unobserve(categoryElement);
      }
    };
  }, []);

  const CustomPopper = (props: any): ReactNode => {
    // Util function for calculating the suggester offset
    const calculateOffset = () => {
      return searchFieldWidth - categoryWidth < textfieldMinWidth
        ? [-searchIconWidth, 0]
        : [-(categoryWidth + searchIconWidth), 0];
    };
    return (
      <Popper
        {...props}
        placement="bottom-start"
        modifiers={[
          {
            name: "offset",
            options: {
              offset: calculateOffset, // Skid horizontally by categoryWidth, no vertical offset
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
              display={selectedCategories?.length > 0 ? "flex" : "none"}
              spacing={1}
              direction="row"
              useFlexGap
              flexWrap="wrap"
              paddingY={padding.small}
              ref={categoryDiv}
            >
              <Typography
                fontFamily={theme.typography.fontFamily}
                fontSize="small"
                paddingTop={padding.extraSmall}
              >
                Categories&nbsp;:&nbsp;
              </Typography>

              {selectedCategoryStrs?.map((c, i) => (
                <Box key={i}>
                  <Chip
                    sx={{ fontSize: "12px" }}
                    label={c}
                    onDelete={() => {
                      removeCategory(c);
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
