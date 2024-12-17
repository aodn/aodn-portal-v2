import { FC, useCallback, useState } from "react";
import {
  Box,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import { fontFamily, fontSize, padding } from "../../../styles/constants";

interface LocationOptionType {
  value: string;
  label: string;
}

// TODO: fetch from ogcapi or align with ogcapi keywords
const LocationOptions: LocationOptionType[] = [
  { value: "ArafuraSea", label: "Arafura Sea(NT)" },
  { value: "CoralSea", label: "Coral Sea (QLD)" },
  { value: "GreatAustralianBight", label: "Great Australian Bight" },
  { value: "GreatBarrierReef", label: "Great Barrier Reef (QLD)" },
  { value: "TasmanSeaNSW", label: "Tasman Sea (NSW)" },
  { value: "TasmanSeaTAS", label: "Tasman Sea (TAS)" },
  { value: "TasmanSeaVIC", label: "Tasman Sea (VIC)" },
  { value: "TimorSea", label: "Timor Sea (NT)" },
  { value: "TorresStrait", label: "Torres Strait (QLD)" },
];

interface LocationFilterProps {}

const LocationFilter: FC<LocationFilterProps> = () => {
  // TODO: need to initialize the sate from redux
  const [selectedOption, setSelectedOption] = useState<string | undefined>(
    LocationOptions[0].value
  );

  // TODO: need to update redux as well if ogcapi support this query
  const handleRadioChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSelectedOption(event.target.value);
    },
    []
  );

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        padding: padding.large,
      }}
    >
      <FormControl sx={{ maxHeight: "300px", overflowY: "scroll", flex: 1 }}>
        <RadioGroup
          defaultValue={LocationOptions[0].value}
          value={selectedOption}
          onChange={handleRadioChange}
        >
          {LocationOptions.map((item) => (
            <FormControlLabel
              value={item.value}
              control={<Radio />}
              label={item.label}
              key={item.value}
              sx={{
                ".MuiFormControlLabel-label": {
                  fontFamily: fontFamily.general,
                  fontSize: fontSize.info,
                  padding: 0,
                },
              }}
            />
          ))}
        </RadioGroup>
      </FormControl>
    </Box>
  );
};

export default LocationFilter;
