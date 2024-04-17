import StyledTextField from "./StyledTextField.tsx";
import { Autocomplete } from "@mui/material";
import React, { useEffect, useState } from "react";
import axios from "axios";

interface InputWithSuggesterProps {
  // may have filter values here
  textValue: string;
  onInputChangeCallback: (chosenOption: string) => void;
  handleEnterPressed?: (
    event: React.KeyboardEvent<HTMLTextAreaElement>
  ) => void;
}

/**
 * Customized input box with suggester. If more customization is needed, please
 * do as the below nullable props.
 * @param inputValue value of the input box.
 * @param onInputChangeCallback used to pass changed input value to parent.
 * @param handleEnterPressed handle the event when users press the ENTER on keyboard.
 * have default empty implementation. Can be overridden.
 * @constructor
 */
const InputWithSuggester: React.FC<InputWithSuggesterProps> = ({
  textValue,
  onInputChangeCallback,
  handleEnterPressed = () => {},
}) => {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<readonly string[]>([]);
  const onChange = (_: any, newValue: string | null) => {
    if (newValue !== null) {
      // String quote with double quote to indicate user want the whole phase during search.
      // fire event here before useState update, need to call function in this case
      onInputChangeCallback(newValue);
    }
  };
  const onInputChange = (_: any, newInputValue: string) => {
    // If user type anything, then it is not a title search anymore
    onInputChangeCallback(newInputValue);
  };
  // Whenever suggestion is closed, clear the options
  useEffect(() => {
    if (!open) {
      setOptions([]);
    }
  }, [open]);

  // Whenever user type, refresh options from server
  useEffect(() => {
    const refreshOptions = async (value: string) => {
      try {
        const response = await axios.get("/api/v1/ogc/ext/autocomplete", {
          params: {
            input: value,
          },
        });

        const d = response.data;
        setOptions(d);
        setOpen(d.length > 0);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    refreshOptions(textValue);
  }, [textValue]);

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
      getOptionLabel={(option) => option}
      options={options}
      value={textValue}
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
