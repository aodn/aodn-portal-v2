import * as React from "react";
import Slider from "@mui/material/Slider";
import { Box, Grid } from "@mui/material";
import { styled } from "@mui/system";

const StyledSlider = styled(Slider)(({ theme }) => ({
  "& .MuiSlider-valueLabel": {
    // Override the default styles here
    background: "none",
    color: "black",
    borderRadius: 0,
    padding: 0,
    left: "calc(100% + 25px)",
  },

  "& .MuiSlider-markLabel": {
    left: "calc(-2200%)",
  },

  "& .MuiSlider-mark": {
    display: "none",
  },

  "& .MuiSlider-track": {
    backgroundColor: "#51BCEB",
    border: "none",
    width: "7px",
  },
  "& .MuiSlider-rail": {
    backgroundColor: "#BDC7D6",
    width: "5px",
  },
  "& .MuiSlider-thumb": {
    backgroundColor: "#FFF",
    width: "22px",
    height: "22px",
    boxShadow: "0px 0px 5px rgba(0, 0, 0, 0.50)",
  },
}));

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

  const handleSliderChange = (_, newValue) => {
    setSliderValues(newValue);
    console.log("Slider values: ", newValue);
  };
  const formatLabel = (value) => {
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
      <Grid xs={1} />
      <Grid xs={1}>
        {depthMarks.map((mark, index) => (
          <Grid
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
      <Grid xs={8} sx={{ height: 400, paddingLeft: 2, paddingRight: 2 }}>
        <Box
          sx={{
            position: "relative",
            top: `calc(${((3000 - sliderValues[0]) / 3000) * 100}% - 8px)`,
            left: 0,
            right: 0,
            height: "1px",
            backgroundColor: "#FFF",
          }}
        />
        <Box
          sx={{
            position: "relative",
            top: `calc(${((3000 - sliderValues[1]) / 3000) * 100}% - 8px)`,
            left: 0,
            right: 0,
            height: "1px",
            backgroundColor: "#FFF",
          }}
        />
        <img
          src={"src/assets/images/depth-selector.png"}
          alt={"Depth"}
          style={{ width: "100%", height: "100%" }}
        />
      </Grid>
      <Grid container xs={2} sx={{ height: 400 }} spacing={1}>
        <StyledSlider
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
