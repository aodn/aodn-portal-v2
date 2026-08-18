import { portalTheme } from "../../../styles";
import { Slider, SliderProps, styled, SxProps, Theme } from "@mui/material";

const StyledSlider = styled(Slider)<SliderProps>(({ theme, orientation }) => {
  const isVertical = orientation === "vertical";
  const labelPositioning = {
    top: isVertical ? "calc(100% + 1px)" : "-30px",
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
      ...portalTheme.typography.body2Regular,
      backgroundColor: portalTheme.palette.primary6,
      borderRadius: portalTheme.borderRadius.sm,
      border: `1px solid ${portalTheme.palette.text1}`,
      // No 28px size token; MUI default spacing is 8px → 3.5 = 28px
      height: theme.spacing(3.5),
      boxSizing: "border-box",
      "&::before": {
        display: "none",
      },
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
      backgroundColor: portalTheme.palette.secondary2,
      opacity: 0.7,
      border: "none",
      height: "8px",
    },
    "& .MuiSlider-rail": {
      backgroundColor: portalTheme.palette.primary4,
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

interface PlainSliderProps extends SliderProps {
  sx?: SxProps<Theme>;
}

const PlainSlider = ({ sx, ...props }: PlainSliderProps) => {
  return <StyledSlider sx={{ margin: "0 16px", ...sx }} {...props} />;
};

export default PlainSlider;
