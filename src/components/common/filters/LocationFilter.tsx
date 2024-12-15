import { FC, useCallback, useState } from "react";
import {
  Box,
  Button,
  Divider,
  FormControl,
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";
import {
  border,
  color,
  fontFamily,
  fontSize,
  fontWeight,
  margin,
  padding,
} from "../../../styles/constants";
import PlaceIcon from "@mui/icons-material/Place";

interface LocationOptionType {
  value: string;
  label: string;
}

// TODO: the implementation of LocationFilter will together with ogcapi
const LocationOptions: LocationOptionType[] = [
  { value: "worldwide", label: "Worldwide" },
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
  const [selectedOption, setSelectedOption] = useState<string | undefined>(
    LocationOptions[0].value
  );

  const handleRadioChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSelectedOption(event.target.value);
    },
    []
  );

  return (
    <Box>
      <Grid container>
        <Grid
          item
          xs={3}
          display="flex"
          justifyContent="center"
          alignItems="center"
          paddingY={padding.large}
        >
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            height="100%"
            width="100%"
          >
            <Box
              height="100px"
              display="flex"
              flexDirection="column"
              justifyContent="center"
              alignItems="center"
            >
              <PlaceIcon
                color="primary"
                sx={{ fontSize: "50px", height: "50px" }}
              />

              <Typography
                fontSize="20px"
                fontWeight={fontWeight.bold}
                textAlign="center"
              >
                Select
                <br />
                Location
              </Typography>
            </Box>
          </Box>
          <Divider
            sx={{
              borderColor: color.blue.darkSemiTransparent,
            }}
            orientation="vertical"
          />
        </Grid>
        <Grid
          item
          xs={6}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: padding.large,
          }}
        >
          <FormControl
            sx={{ maxHeight: "300px", overflowY: "scroll", flex: 1 }}
          >
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
        </Grid>
        <Grid
          item
          xs={3}
          display="flex"
          flexDirection="column"
          justifyContent="end"
          alignItems="center"
          paddingY={padding.large}
        >
          <Button
            sx={{
              width: "100px",
              marginBottom: margin.lg,
              border: `${border.sm} ${color.blue.darkSemiTransparent}`,
              "&:hover": {
                border: `${border.sm} ${color.blue.darkSemiTransparent}`,
                backgroundColor: color.blue.darkSemiTransparent,
              },
            }}
            onClick={() => {}}
          >
            Clear
          </Button>
          <Button
            sx={{
              width: "100px",
              border: `${border.sm} ${color.blue.darkSemiTransparent}`,
              "&:hover": {
                border: `${border.sm} ${color.blue.darkSemiTransparent}`,
                backgroundColor: color.blue.darkSemiTransparent,
              },
            }}
            onClick={() => {}}
          >
            Apply
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default LocationFilter;
