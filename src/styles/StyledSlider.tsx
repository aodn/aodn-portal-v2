import { styled } from "@mui/system";
import Slider from "@mui/material/Slider";

interface StyledSliderProps {
  theme?: any;
  isvertical?: string;
}
const StyledSlider = styled(Slider)<StyledSliderProps>(
  ({ theme, isvertical = undefined }) => ({
    "& .MuiSlider-valueLabel": {
      background: "none",
      color: "black",
      borderRadius: 0,
      padding: 0,
      left: isvertical ? "calc(100% + 25px)" : undefined,
      top: isvertical ? undefined : "calc(100% + 25px)",
    },

    "& .MuiSlider-markLabel": {
      left: isvertical ? "calc(-2200%)" : undefined,
    },

    "& .MuiSlider-mark": {
      display: "none",
    },

    "& .MuiSlider-track": {
      backgroundColor: "#51BCEB",
      border: "none",
      width: isvertical ? "7px" : undefined,
      height: isvertical ? undefined : "7px",
    },
    "& .MuiSlider-rail": {
      backgroundColor: "#BDC7D6",
      width: isvertical ? "5px" : undefined,
      height: isvertical ? undefined : "5px",
    },
    "& .MuiSlider-thumb": {
      backgroundColor: "#FFF",
      width: "22px",
      height: "22px",
      boxShadow: "0px 0px 5px rgba(0, 0, 0, 0.50)",
    },
  })
);

export default StyledSlider;
