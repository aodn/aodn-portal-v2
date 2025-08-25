import { Slider, SliderProps, styled } from "@mui/material";
import rc8Theme from "../../../styles/themeRC8";

interface PlainSliderProps extends SliderProps {
  isVertical?: boolean;
}

// Move StyledSlider outside and make it dynamic based on props
const StyledSlider = styled(Slider)<PlainSliderProps>(({
  theme,
  isVertical = false,
}) => {
  return {
    "& .MuiSlider-valueLabel": {
      ...rc8Theme.typography.body1Medium,
      backgroundColor: "transparent",
      top: isVertical ? "calc(100% + 1px)" : "calc(100% + 5.5px)",
      left: isVertical ? "calc(100% + 25px)" : "50%",
      transform: isVertical ? "none" : "translateX(-50%)",

      [theme.breakpoints.down("md")]: {
        top: isVertical ? "calc(100% + 1px)" : "-30px", // Above thumb on mobile/tablet
      },
    },
    "& .MuiSlider-thumb:hover .MuiSlider-valueLabel": {
      top: isVertical ? "calc(100% + 1px)" : "calc(100% + 5.5px)",
      left: isVertical ? "calc(100% + 25px)" : "50%",
      transform: isVertical ? "none" : "translateX(-50%)",

      [theme.breakpoints.down("md")]: {
        top: isVertical ? "calc(100% + 1px)" : "-30px",
      },
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
