import StyledTextField from "./StyledTextField.tsx";
import { Autocomplete } from "@mui/material";
import React, { useEffect, useState } from "react";
import {
  ParameterState,
  updateSearchText,
} from "../common/store/componentParamReducer.tsx";
import store, {
  AppDispatch,
  getComponentState,
} from "../common/store/store.tsx";
import { useDispatch } from "react-redux";
import {
  createSuggesterParamFrom,
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

  const refreshOptions = async () => {
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
  };

  const debounceRefreshOptions = _.debounce(refreshOptions, 3000);

  const onChange = (_: any, newValue: string | null) => {
    if (newValue !== null) {
      // String quote with double quote to indicate user want the whole phase during search.
      // fire event here before useState update, need to call function in this case
      onTextChange(newValue);
    }
  };

  const onInputChange = (_: any, newInputValue: string) => {
    // If user type anything, then it is not a title search anymore
    onTextChange(newInputValue);
  };
  const onTextChange = (text: string) => {
    dispatch(updateSearchText(text));
    if (text?.length > 2) {
      debounceRefreshOptions().then();
    }
  };

  // Whenever suggestion is closed, clear the options
  useEffect(() => {
    if (!open) {
      setOptions([]);
    }
  }, [open]);

  return (
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
  );
};

export default InputWithSuggester;
