import StyledTextField from "./StyledTextField.tsx";
import { Autocomplete, Box, Chip, Grid } from "@mui/material";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Category,
  ParameterState,
  updateCategories,
  updateSearchText,
} from "../common/store/componentParamReducer.tsx";
import store, {
  AppDispatch,
  getComponentState,
  RootState,
} from "../common/store/store.tsx";
import { useDispatch, useSelector } from "react-redux";
import {
  createSuggesterParamFrom,
  fetchParameterCategoriesWithStore,
  fetchSuggesterOptions,
} from "../common/store/searchReducer.tsx";
import _ from "lodash";

interface InputWithSuggesterProps {
  handleEnterPressed?: (
    event: React.KeyboardEvent<HTMLTextAreaElement>
  ) => void;
}

// TODO: Try to only use these two classes inside this file to maintain high cohesion.
//  But if they must be used outside, refactor these two to a common place.
interface OptionType {
  text: string;
  group: string;
}

enum OptionGroup {
  CATEGORY = "category",
  TITLE = "title",
}

/**
 * Customized input box with suggester. If more customization is needed, please
 * do as the below nullable props.
 * @param handleEnterPressed handle the event when users press the ENTER on keyboard.
 * have default empty implementation. Can be overridden.
 * @constructor
 */
const InputWithSuggester: React.FC<InputWithSuggesterProps> = ({
  handleEnterPressed = () => {},
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<OptionType[]>([]);
  const [categorySet, setCategorySet] = useState<Category[]>([]);

  const selectedCategories: Category[] = useSelector(
    (state: RootState) => state.paramReducer.categories
  );

  const searchInput = useSelector(
    (state: RootState) => state.paramReducer.searchText
  );

  const selectedCategoryStrs = selectedCategories
    ? [...new Set(selectedCategories.map((c) => c.label))]
    : [];
  const addCategory = (category: string) => {
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
  };

  const removeCategory = (category: string) => {
    const currentCategories = new Array(...selectedCategories);
    const categoryToRemove = categorySet.find((c) => c.label === category);
    if (!categoryToRemove) {
      //may need warning / alert in the future
      console.error("no category found: ", category);
      return;
    }
    if (!currentCategories.find((c) => c.label === category)) {
      //may need warning / alert in the future
      console.error("no category found in current category state: ", category);
      return;
    }
    // remove this category from currentCategories
    _.remove(currentCategories, (c) => c.label === category);
    dispatch(updateCategories(currentCategories));
  };

  const refreshOptions = useCallback(async () => {
    try {
      const currentState: ParameterState = getComponentState(store.getState());
      dispatch(fetchSuggesterOptions(createSuggesterParamFrom(currentState)))
        .unwrap()
        .then((data) => {
          const options: OptionType[] = [];

          const categorySuggestions = new Set(data.category_suggestions);
          const titleSuggestions = new Set(data.record_suggestions.titles);

          categorySuggestions.forEach((category: string) => {
            options.push({ text: category, group: OptionGroup.CATEGORY });
          });
          titleSuggestions.forEach((title: string) => {
            options.push({ text: title, group: OptionGroup.TITLE });
          });

          setOptions(options);
        });
    } catch (error) {
      // TODO: Add error handling in the future.(toast, alert, etc)
      //  Also need to apply error handing
      //  in some other places if needed.
      console.error("Error fetching data:", error);
    }
  }, [dispatch]);

  const debounceRefreshOptions = useRef(
    _.debounce(refreshOptions, 300)
  ).current;

  // cancel all debounce things when component is unmounted
  useEffect(() => {
    return () => {
      debounceRefreshOptions.cancel();
    };
  }, [debounceRefreshOptions]);

  const onChange = (_: any, newValue: string | null) => {
    if (newValue !== null) {
      // String quote with double quote to indicate user want the whole phase during search.
      // fire event here before useState update, need to call function in this case
      if (getGroup(newValue) === OptionGroup.CATEGORY) {
        addCategory(newValue);
        dispatch(updateSearchText(""));
      }
    }
  };

  const onInputChange = (_: any, newInputValue: string) => {
    // If user type anything, then it is not a title search anymore
    dispatch(updateSearchText(newInputValue));
    if (newInputValue?.length > 1) {
      debounceRefreshOptions()?.then();
    }
  };
  // Whenever suggestion is closed, clear the options
  useEffect(() => {
    if (!open) {
      setOptions([]);
    }
  }, [open]);

  useEffect(() => {
    dispatch(fetchParameterCategoriesWithStore(null))
      .unwrap()
      .then((categories: Array<Category>) => {
        const root = categories.filter((i) => i.broader.length === 0);
        let child = new Array<Category>();
        root
          .filter((i) => i.narrower.length !== 0)
          .forEach((i) => i.narrower.forEach((j) => child.push(j)));

        child = child.sort((a, b) =>
          a.label < b.label ? -1 : a.label > b.label ? 1 : 0
        );
        setCategorySet(child);
      });
  }, [dispatch]);

  const getGroup = (option: string) => {
    return options.find((o) => o.text.toLowerCase() === option.toLowerCase())
      ?.group;
  };

  return (
    <>
      <Box display="flex" flexDirection="row">
        <Box
          display={selectedCategories?.length > 0 ? "flex" : "none"}
          flexDirection="row"
          alignItems="center"
        >
          Categories:{" "}
        </Box>
        <Box
          sx={{
            display: "flex",
            flexWrap: "nowrap",
            width: "50%",
            gap: "0px",
          }}
        >
          {selectedCategoryStrs?.map((c, i) => (
            <Grid item key={i}>
              <Chip
                sx={{ fontSize: "12px" }}
                label={c}
                onDelete={() => {
                  removeCategory(c);
                }}
              />
            </Grid>
          ))}
        </Box>
      </Box>
      <Autocomplete
        id="search"
        fullWidth
        freeSolo
        onOpen={() => {
          setOpen(options.length > 0);
        }}
        onClose={() => {
          setOpen(false);
        }}
        value={searchInput}
        forcePopupIcon={false}
        options={options.flatMap((option) => option.text)}
        groupBy={(option) => options.find((o) => o.text === option)?.group}
        autoComplete
        includeInputInList
        onChange={onChange}
        onInputChange={onInputChange}
        renderInput={(params) => (
          <StyledTextField
            {...params}
            placeholder="Search for open data"
            inputProps={{
              "aria-label": "Search for open data",
              ...params.inputProps,
              onKeyDown: handleEnterPressed,
            }}
          />
        )}
      />
    </>
  );
};

export default InputWithSuggester;
