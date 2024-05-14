import { Box } from "@mui/material";
import * as React from "react";

interface SliderLineProps {
  sliderValue: number;
}

const SliderLine: React.FC<SliderLineProps> = ({ sliderValue }) => {
  return (
    <Box
      sx={{
        position: "relative",
        top: `calc(${((3000 - sliderValue) / 3000) * 100}%)`,
        left: 0,
        right: 0,
        height: "1px",
        backgroundColor: "#FFF",
      }}
    />
  );
};

export default SliderLine;
