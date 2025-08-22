import { Slider, SliderProps, styled } from "@mui/material";
import rc8Theme from "../../../styles/themeRC8";
import useBreakpoint from "../../../hooks/useBreakpoint";

interface PlainSliderProps extends SliderProps {
  isVertical?: boolean;
}

const PlainSlider = ({ isVertical = false, ...props }: PlainSliderProps) => {
  const { isMobile, isTablet } = useBreakpoint();

  const StyledSlider = styled(Slider)(({ theme }) => ({
    "& .MuiSlider-valueLabel": {
      ...rc8Theme.typography.body1Medium,
      backgroundColor: "transparent",
      top: isVertical
        ? "calc(100% + 1px)"
        : isMobile || isTablet
          ? "-30px" // Show above the thumb on mobile/tablet
          : "calc(100% + 2px)", // Show below the thumb on desktop
      left: isVertical ? "calc(100% + 25px)" : "50%", // Center horizontally for horizontal slider
      transform: isVertical ? "none" : "translateX(-50%)", // Center the label horizontally
    },

    "& .MuiSlider-track": {
      boxShadow: "0 0 3px 1px rgba(0, 0, 0, 0.10) inset",
      backgroundColor: rc8Theme.palette.primary1,
      opacity: 0.7,
      border: "none",
      height: "8px",
    },
    "& .MuiSlider-rail": {
      backgroundColor: rc8Theme.palette.primary4,
      height: "6px",
    },
    "& .MuiSlider-thumb": {
      backgroundColor: "#FFF",
      width: "23px",
      height: "23px",
      boxShadow: "0px 0px 5px rgba(0, 0, 0, 0.50)",
    },
  }));

  return <StyledSlider {...props} />;
};

export default PlainSlider;
