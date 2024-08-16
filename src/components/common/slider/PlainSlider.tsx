import { Slider, SliderProps, styled } from "@mui/material";
import {
  color,
  fontColor,
  fontSize,
  fontWeight,
} from "../../../styles/constants";

interface PlainSliderProps extends SliderProps {
  isVertical?: boolean;
}

const PlainSlider = styled(
  ({ isVertical = false, ...props }: PlainSliderProps) => <Slider {...props} />
)(({ isVertical }) => ({
  "& .MuiSlider-valueLabel": {
    fontSize: fontSize.info,
    fontWeight: fontWeight.regular,
    color: fontColor.gray.medium,
    backgroundColor: "transparent",
    top: isVertical ? "calc(100% +1px)" : 0,
    left: isVertical ? "calc(100% + 25px)" : "none",
  },

  "& .MuiSlider-track": {
    backgroundColor: color.brightBlue.dark,
    border: "none",
  },
  "& .MuiSlider-rail": {
    backgroundColor: color.gray.light,
  },
  "& .MuiSlider-thumb": {
    backgroundColor: "#FFF",
    width: "18px",
    height: "18px",
    boxShadow: "0px 0px 5px rgba(0, 0, 0, 0.50)",
  },
}));

export default PlainSlider;
