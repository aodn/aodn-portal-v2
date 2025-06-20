import React, { FC, useCallback, useEffect, useState } from "react";
import {
  Box,
  FormControl,
  FormControlLabel,
  IconButton,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ReplayIcon from "@mui/icons-material/Replay";
import {
  color,
  fontFamily,
  fontSize,
  fontWeight,
  gap,
  padding,
} from "../../styles/constants";
import { marineParkDefault } from "../common/constants";
import { Feature, FeatureCollection, Polygon } from "geojson";
import _ from "lodash";
import {
  ParameterState,
  updateFilterPolygon,
} from "../common/store/componentParamReducer";
import { useAppDispatch } from "../common/store/hooks";
import store, { getComponentState } from "../common/store/store";
import { simplify, booleanEqual } from "@turf/turf";

interface LocationOptionType {
  value: string;
  label: string;
  geo?: FeatureCollection<Polygon>;
}

interface LocationFilterProps {
  handleClosePopup: () => void;
}

const locationOptions: LocationOptionType[] = [];

const DEFAULT_LOCATION = {
  label: "None",
  value: "none",
  geo: undefined,
};
// Given a polygon find the item in the location type option that matches
// the feature geometry
const findMatch = (
  polygon: Feature<Polygon> | undefined,
  locations: LocationOptionType[]
): string => {
  const o = locations.find(
    (l) =>
      l.geo?.features[0] && polygon && booleanEqual(l.geo?.features[0], polygon)
  );
  return o ? o.value : "none";
};

fetch(marineParkDefault.geojson)
  .then((response) => response.json())
  .then((json: FeatureCollection<Polygon>) => {
    // Regroup the Features by name and create a new array or FeatureCollection
    const grouped = _.groupBy(
      json.features,
      (feature) => feature.properties?.RESNAME
    );
    return Object.values(grouped).map<FeatureCollection<Polygon>>(
      (features) => ({
        type: "FeatureCollection",
        features: features as Feature<Polygon>[],
      })
    );
  })
  .then((values: Array<FeatureCollection<Polygon>>) => {
    // Create the drop-down list items
    const l = values
      .map<LocationOptionType>((value) => {
        // simplify the polygon here, otherwise too big of url for query
        value.features[0] = simplify(value.features[0], {
          tolerance: 0.01,
          highQuality: false,
        });
        const option: LocationOptionType = {
          label: value.features[0].properties?.RESNAME,
          value: "" + value.features[0].properties?.OBJECTID,
          geo: value,
        };
        return option;
      })
      .sort((a, b) => a.label.localeCompare(b.label));

    locationOptions.push(DEFAULT_LOCATION);
    locationOptions.push(...l);
  })
  .catch((error) => {
    console.error("Error fetching JSON:", error);
  });

const LocationFilter: FC<LocationFilterProps> = ({ handleClosePopup }) => {
  const dispatch = useAppDispatch();
  const componentParam: ParameterState = getComponentState(store.getState());
  const [selectedOption, setSelectedOption] = useState<string | undefined>(
    "none"
  );

  // TODO: need to update redux as well if ogcapi support this query
  const handleRadioChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const l = locationOptions?.find((o) => o.value === event.target.value);
      if (l && l.geo?.features) {
        // The marineParkDefault is a boundary json so only 1 feature found.
        dispatch(updateFilterPolygon(l.geo.features[0]));
        setSelectedOption(event.target.value);
      } else {
        dispatch(updateFilterPolygon(undefined));
        setSelectedOption(DEFAULT_LOCATION.value);
      }
    },
    [dispatch]
  );

  const handleClear = useCallback(() => {
    dispatch(updateFilterPolygon(undefined));
    setSelectedOption(DEFAULT_LOCATION.value);
  }, [dispatch]);

  const handleClose = useCallback(() => {
    handleClosePopup();
  }, [handleClosePopup]);

  useEffect(() => {
    setSelectedOption((v) => {
      const n = findMatch(componentParam.polygon, locationOptions);
      return v === n ? v : n;
    });
  }, [componentParam.polygon]);

  return (
    <Box
      sx={{
        position: "relative",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        width: "100%",
        padding: padding.large,
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: gap.md,
          right: gap.md,
          zIndex: 2,
        }}
      >
        <IconButton
          onClick={handleClear}
          sx={{
            bgcolor: color.gray.extraLight,
            "&:hover": {
              bgcolor: color.blue.darkSemiTransparent,
            },
          }}
        >
          <ReplayIcon sx={{ fontSize: fontSize.info }} />
        </IconButton>
        <IconButton
          onClick={handleClose}
          sx={{
            bgcolor: color.gray.extraLight,
            "&:hover": {
              bgcolor: color.blue.darkSemiTransparent,
            },
          }}
        >
          <CloseIcon sx={{ fontSize: fontSize.info }} />
        </IconButton>
      </Box>
      <Typography
        pt={padding.large}
        fontSize={fontSize.info}
        fontWeight={fontWeight.bold}
      >
        Australian Marine Parks
      </Typography>
      <FormControl sx={{ maxHeight: "300px", overflowY: "scroll", flex: 1 }}>
        <RadioGroup
          defaultValue={locationOptions[0].value}
          value={selectedOption}
          onChange={handleRadioChange}
        >
          {locationOptions.map((item) => (
            <FormControlLabel
              value={item.value}
              control={<Radio />}
              label={item.label}
              key={item.value}
              data-testid={`radio-${item.label}`}
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
