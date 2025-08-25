import { Slider, SliderProps, styled } from "@mui/material";
import rc8Theme from "../../../styles/themeRC8";

interface PlainSliderProps extends SliderProps {
  isVertical?: boolean;
}

const StyledSlider = styled(Slider)<PlainSliderProps>(({
  theme,
  isVertical = false,
}) => {
  const labelPositioning = {
    top: isVertical ? "calc(100% + 1px)" : "calc(100% + 5.5px)",
    left: isVertical ? "calc(100% + 25px)" : "50%",
    transform: isVertical ? "none" : "translateX(-50%)",
  };

  const labelPositioningMobile = {
    [theme.breakpoints.down("md")]: {
      top: isVertical ? "calc(100% + 1px)" : "-30px",
    },
  };

  return {
    "& .MuiSlider-valueLabel": {
      ...rc8Theme.typography.body1Medium,
      backgroundColor: "transparent",
      ...labelPositioning,
      opacity: 0, // Hide text by default
      ...labelPositioningMobile,
    },
    // Show text on hover, focus, active, and focus-visible states
    "& .MuiSlider-thumb:hover .MuiSlider-valueLabel, & .MuiSlider-thumb:focus .MuiSlider-valueLabel, & .MuiSlider-thumb.Mui-active .MuiSlider-valueLabel, & .MuiSlider-thumb.Mui-focusVisible .MuiSlider-valueLabel":
      {
        opacity: 1,
        ...labelPositioning,
        ...labelPositioningMobile,
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
  };
});

const PlainSlider = ({ isVertical = false, ...props }: PlainSliderProps) => {
  return <StyledSlider isVertical={isVertical} {...props} />;
};

export default PlainSlider;
