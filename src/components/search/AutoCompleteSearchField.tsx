import { Tune } from "@mui/icons-material";
import {
  Paper,
  IconButton,
  Divider,
  Button,
  Autocomplete,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useEffect, useState } from "react";
import axios from "axios";
import StyledTextField from "./StyledTextField";

const AutoCompleteSearchField = () => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [options, setOptions] = useState<readonly string[]>([]);
  const loading = open && options.length === 0;

  useEffect(() => {
    if (!loading) {
      return undefined;
    }

    if (inputValue.trim() === "") {
      setOptions(value ? [value] : []);
      return undefined;
    }

    const fetchData = async () => {
      try {
        const response = await axios.get("/api/v1/ogc/ext/autocomplete", {
          params: {
            input: inputValue,
          },
        });
        console.log("response", response);
        setOptions(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [inputValue, loading, value]);

  useEffect(() => {
    if (!open) {
      setOptions([]);
    }
  }, [open]);

  return (
    <Paper sx={{ p: "2px 4px", display: "flex", alignItems: "center" }}>
      <IconButton sx={{ p: "10px" }} aria-label="search">
        <SearchIcon />
      </IconButton>
      <Autocomplete
        id="search"
        fullWidth
        open={open}
        onOpen={() => {
          setOpen(true);
        }}
        onClose={() => {
          setOpen(false);
        }}
        loading={loading}
        getOptionLabel={(option) => option}
        filterOptions={(x) => x}
        options={options}
        autoComplete
        includeInputInList
        filterSelectedOptions
        value={value}
        noOptionsText="No locations"
        onChange={(_, newValue: string | null) => {
          setOptions(newValue ? [newValue, ...options] : options);
          setValue(newValue);
        }}
        onInputChange={(_, newInputValue) => {
          setInputValue(newInputValue);
        }}
        renderInput={(params) => (
          <StyledTextField
            {...params}
            placeholder="Search for open data"
            inputProps={{
              "aria-label": "Search for open data",
              ...params.inputProps,
            }}
          />
        )}
      />
      <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
      <Button
        variant="text"
        sx={{
          //color: grey["searchButtonText"],
          pr: 1,
        }}
        startIcon={<Tune />}
        // onClick={(e) => {
        //   onFilterShowHide(e);
        // }}
      >
        Filters
      </Button>
    </Paper>
  );
};

export default AutoCompleteSearchField;
