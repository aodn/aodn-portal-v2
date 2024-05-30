import * as React from "react";
import { Box, Grid } from "@mui/material";
import StyledSlider from "../../../styles/StyledSlider";
import SliderLine from "./SliderLine";
import depth_image from "@/assets/images/depth-selector.png";

/**
 * TODO: may need to be refactored to use theme. Currently, all colors are
 * referenced from the design document(in Figma).
 * Parameters including width, height etc. are all hard-coded. Will change in the future.
 * @constructor
 */
const DepthSlider = () => {
  const defaultValues = [1000, 2000];

  const [sliderValues, setSliderValues] =
    React.useState<number[]>(defaultValues);

  const handleSliderChange = (_: any, newValue: number[]) => {
    setSliderValues(newValue);
  };
  const formatLabel = (value: number) => {
    if (value === -1) {
      return <Box>{">3000m"}</Box>;
    }
    return <Box>{3000 - value}m</Box>;
  };

  const depthMarks = [
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

  return (
    <Grid container direction={"row"}>
      <Grid item xs={1} />
      <Grid item xs={1}>
        {depthMarks.map((mark, index) => (
          <Grid
            item
            xs={12}
            key={index}
            sx={{
              height: `${100 / depthMarks.length}%`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {mark.label}
          </Grid>
        ))}
      </Grid>
      <Grid item xs={8} sx={{ height: 300, paddingLeft: 2, paddingRight: 2 }}>
        <SliderLine sliderValue={sliderValues[0]} />
        <SliderLine sliderValue={sliderValues[1]} />
        <img
          src={depth_image}
          alt={"Depth"}
          style={{ width: "100%", height: "100%" }}
        />
      </Grid>
      <Grid item xs={2} sx={{ height: 300 }}>
        <StyledSlider
          isvertical="true"
          getAriaLabel={() => "depth"}
          orientation="vertical"
          // getAriaValueText={valuetext}
          defaultValue={defaultValues}
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
