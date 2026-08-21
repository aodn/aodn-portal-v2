import { useMemo } from "react";
import { portalTheme } from "../../../styles";
import { Slider, SliderProps, styled, SxProps, Theme } from "@mui/material";

enum ThumbType {
  DIAMOND = "diamond",
  CIRCLE = "circle",
}

interface PlainSliderProps extends SliderProps {
  sx?: SxProps<Theme>;
}

interface ConcentrationSliderProps extends SliderProps {
  sx?: SxProps<Theme>;
  thumb?: ThumbType;
}

const RAIL_IDLE = "rgba(0,0,0,0.04)";
const DENSITY_COLOR = "#2E6F9E";
/** Cap CSS color-stops. Firefox can crash on huge / non-monotonic gradients. */
const MAX_DENSITY_BARS = 192;

const formatPercent = (value: number) =>
  Math.min(100, Math.max(0, value)).toFixed(3);

/** Diamond thumb for the single-point time slider (range slider stays circular). */
const diamondThumbSx: SxProps<Theme> = {
  flex: 1,
  minWidth: 0,
  "& .MuiSlider-thumb": {
    width: 20,
    height: 20,
    backgroundColor: "transparent",
    boxShadow: "none",
    "&::before": {
      width: 16,
      height: 16,
      borderRadius: "3px",
      backgroundColor: portalTheme.palette.secondary2,
      border: "3px solid #FFF",
      boxSizing: "border-box",
      transform: "rotate(45deg)",
      boxShadow: "0px 0px 3px rgba(0, 0, 0, 0.50)",
    },
  },
};
/**
 * CSS linear-gradient of barcode-style density marks along the slider rail.
 * It chopped the rail to MAX_DENSITY_BARS of bucket, if values there it will
 * set a deeper color. The reason is, if we put a very large number of
 * array, the linear-gradient will crash the browser.
 */
const createDensityGradient = (
  marks: SliderProps["marks"],
  min = 0,
  max = 100
): string => {
  const range = max - min;
  if (!(range > 0) || !Array.isArray(marks) || marks.length === 0) {
    return `linear-gradient(to right, ${RAIL_IDLE} 0%, ${RAIL_IDLE} 100%)`;
  }

  const occupied = new Uint8Array(MAX_DENSITY_BARS);
  for (const mark of marks) {
    const t = (mark.value - min) / range;
    if (!Number.isFinite(t) || t < 0 || t > 1) continue;
    occupied[Math.min(MAX_DENSITY_BARS - 1, Math.floor(t * MAX_DENSITY_BARS))] =
      1;
  }

  const binWidth = 100 / MAX_DENSITY_BARS;
  const gradientStops: string[] = [`${RAIL_IDLE} 0%`];

  let i = 0;
  while (i < MAX_DENSITY_BARS) {
    if (!occupied[i]) {
      i += 1;
      continue;
    }
    const runStart = i;
    while (i < MAX_DENSITY_BARS && occupied[i]) i += 1;
    const start = runStart * binWidth;
    const end = Math.min(100, i * binWidth);

    gradientStops.push(`${RAIL_IDLE} ${formatPercent(start)}%`);
    gradientStops.push(`${DENSITY_COLOR} ${formatPercent(start)}%`);
    gradientStops.push(`${DENSITY_COLOR} ${formatPercent(end)}%`);
    gradientStops.push(`${RAIL_IDLE} ${formatPercent(end)}%`);
  }

  gradientStops.push(`${RAIL_IDLE} 100%`);
  return `linear-gradient(to right, ${gradientStops.join(", ")})`;
};

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
      overflow: "visible",
      whiteSpace: "nowrap",
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

const PlainSlider = ({ sx, ...props }: PlainSliderProps) => {
  return (
    <StyledSlider
      sx={[{ margin: "0 16px" }, ...(Array.isArray(sx) ? sx : [sx])]}
      {...props}
    />
  );
};

const valueLabelOpenSelectors =
  "& .MuiSlider-thumb:hover .MuiSlider-valueLabel, & .MuiSlider-thumb:focus .MuiSlider-valueLabel, & .MuiSlider-thumb.Mui-active .MuiSlider-valueLabel, & .MuiSlider-thumb.Mui-focusVisible .MuiSlider-valueLabel";

/** Keep the popup fully on-screen when the thumb sits at either end. */
const valueLabelEdgeAlign = (
  value: SliderProps["value"],
  min: number,
  max: number
): { left?: number | string; right?: number; transform?: string } => {
  const thumbValue = Array.isArray(value) ? value[value.length - 1] : value;
  const range = max - min;
  if (!(range > 0) || !Number.isFinite(Number(thumbValue))) return {};
  const t = (Number(thumbValue) - min) / range;
  if (t >= 0.9) {
    return { left: "auto", right: 0, transform: "none" };
  }
  if (t <= 0.1) {
    return { left: 0, transform: "none" };
  }
  return {};
};

const ConcentrationSlider = ({
  marks,
  min = 0,
  max = 100,
  thumb = ThumbType.CIRCLE,
  sx,
  value,
  ...props
}: ConcentrationSliderProps) => {
  const gradientStr = useMemo(
    () => createDensityGradient(marks, Number(min), Number(max)),
    [marks, min, max]
  );
  const edgeAlign = valueLabelEdgeAlign(value, Number(min), Number(max));

  return (
    <PlainSlider
      min={min}
      max={max}
      marks={marks}
      value={value}
      sx={[
        {
          overflow: "visible",
          "& .MuiSlider-thumb": {
            overflow: "visible",
          },
          "& .MuiSlider-rail": {
            height: 8,
            borderRadius: 2,
            border: "1px solid #B0B0B0",
            backgroundColor: "transparent",
            backgroundImage: gradientStr,
            opacity: 1,
          },
          "& .MuiSlider-track": {
            height: 8,
            backgroundColor: "transparent",
            backgroundImage: "none",
            boxShadow: "none",
            border: "none",
            opacity: 0,
          },
          "& .MuiSlider-mark": {
            display: "none",
          },
          "& .MuiSlider-valueLabel": edgeAlign,
          [valueLabelOpenSelectors]: edgeAlign,
        },
        thumb === ThumbType.DIAMOND ? diamondThumbSx : false,
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...props}
    />
  );
};

export { ConcentrationSlider, createDensityGradient, ThumbType };
export default PlainSlider;
