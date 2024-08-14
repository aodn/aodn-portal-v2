import { FC, useState } from "react";
import { Box, Grid, Stack } from "@mui/material";
import StyledSlider from "../../../styles/StyledSlider";
import SliderLine from "./SliderLine";
import depth_image from "@/assets/images/depth-selector.png";
import {
  fontColor,
  fontFamily,
  fontSize,
  fontWeight,
  padding,
} from "../../../styles/constants";
import { ParameterState } from "../store/componentParamReducer";

interface DepthSliderProps {
  filter: ParameterState;
  setFilter: React.Dispatch<React.SetStateAction<ParameterState>>;
}

const DEPTH_MARKS = [
  {
    value: 0,
    label: "0m",
  },
  {
    value: 500,
    label: "500m",
  },
  {
    value: 1000,
    label: "1000m",
  },
  {
    value: 1500,
    label: "1500m",
  },
  {
    value: 2000,
    label: "2000m",
  },
  {
    value: 2500,
    label: "2500m",
  },
  {
    value: 3000,
    label: ">3000m",
  },
];

const DEFAULT_VALUES = [1000, 2000];

const CONTAINER_HEIGHT = 250;

/**
 * TODO: may need to be refactored to use theme. Currently, all colors are
 * referenced from the design document(in Figma).
 * Parameters including width, height etc. are all hard-coded. Will change in the future.
 * @constructor
 */
const DepthSlider: FC<DepthSliderProps> = ({ filter, setFilter }) => {
  // TODO: implement DepthFilter when backend supports this query
  const [sliderValues, setSliderValues] = useState<number[]>(DEFAULT_VALUES);

  const handleSliderChange = (
    _: Event,
    newValue: number | number[],
    activeThumb: number
  ) => {
    setSliderValues(Array.isArray(newValue) ? newValue : [newValue]);
  };
  const formatLabel = (value: number) => {
    if (value === -1) {
      return <Box>{">3000m"}</Box>;
    }
    return <Box>{3000 - value}m</Box>;
  };

  return (
    <Grid container direction={"row"}>
      <Grid item xs={2}>
        <Stack direction="column" justifyContent="space-between" height="100%">
          {DEPTH_MARKS.map((mark, index) => (
            <Box
              key={index}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: fontSize.label,
                fontFamily: fontFamily.general,
                fontWeight: fontWeight.medium,
                color: fontColor.gray.medium,
              }}
            >
              {mark.label}
            </Box>
          ))}
        </Stack>
      </Grid>
      <Grid
        item
        xs={7}
        sx={{ height: CONTAINER_HEIGHT, paddingX: padding.small }}
      >
        <SliderLine sliderValue={sliderValues[0]} />
        <SliderLine sliderValue={sliderValues[1]} />
        <img
          src={depth_image}
          alt={"Depth"}
          style={{
            objectFit: "fill",
            width: "100%",
            height: "100%",
          }}
        />
      </Grid>
      <Grid item xs={3} sx={{ height: CONTAINER_HEIGHT }}>
        <StyledSlider
          isvertical="true"
          getAriaLabel={() => "depth"}
          orientation="vertical"
          defaultValue={DEFAULT_VALUES}
          valueLabelDisplay="on"
          min={-1}
          max={3000}
          valueLabelFormat={formatLabel}
          onChange={handleSliderChange}
        />
      </Grid>
    </Grid>
  );
};
export default DepthSlider;
