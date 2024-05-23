import * as React from "react";
import { useCallback, useEffect } from "react";
import Box from "@mui/material/Box";
import { SxProps, Theme } from "@mui/material";
import { dateDefault } from "../constants";
import StyledSlider from "../../../styles/StyledSlider";

interface RangeSliderProps<T> {
  title: string;
  label: (value: number, min: number, max: number) => string;
  min: T;
  max: T;
  start: T;
  end: T;
  sx?: SxProps<Theme>;
  onSlideChanged: (
    start: number,
    end: number,
    startIndex: number,
    endIndex: number
  ) => void;
}

interface NumberRangeSliderProps extends RangeSliderProps<number> {}

interface DateRangeSliderProps extends RangeSliderProps<Date> {}

/**
 * The range allow value within 0 to 100, so we need to map value if out of boundary
 * @param min
 * @param max
 * @param i
 */
const mapRangeToZeroHundred = (min: number, max: number, i: number): number => {
  if (i === min) {
    return 0;
  } else if (i === max) {
    return 100;
  } else {
    return ((i - min) / (max - min)) * 100;
  }
};
/**
 * Reverse the above
 * @param min
 * @param max
 * @param i
 */
const mapRangeToRealValue = (min: number, max: number, i: number): number => {
  return min + ((max - min) * i) / 100;
};

const NumberRangeSlider = ({
  title,
  label,
  min,
  max,
  start,
  end,
  sx,
  onSlideChanged,
}: NumberRangeSliderProps) => {
  const [value, setValue] = React.useState<number[]>([
    mapRangeToZeroHundred(min, max, min),
    mapRangeToZeroHundred(min, max, max),
  ]);

  useEffect(() => {
    setValue([
      mapRangeToZeroHundred(min, max, start === undefined ? min : start),
      mapRangeToZeroHundred(min, max, end === undefined ? max : end),
    ]);
  }, [start, end, min, max, setValue]);

  const handleChange = useCallback(
    (_: Event, newValue: number | number[]) => {
      setValue(newValue as number[]);
    },
    [setValue]
  );

  const handleChangeCommitted = useCallback(
    (event: Event, newValue: number | number[]) => {
      const c = newValue as number[];
      onSlideChanged(
        mapRangeToRealValue(min, max, c[0]),
        mapRangeToRealValue(min, max, c[1]),
        c[0],
        c[1]
      );
    },
    [min, max, onSlideChanged]
  );

  return (
    <Box sx={sx}>
      <StyledSlider
        getAriaLabel={() => title}
        value={value}
        onChange={handleChange}
        onChangeCommitted={handleChangeCommitted}
        valueLabelDisplay="on"
        getAriaValueText={(v) => label(v, min, max)}
        valueLabelFormat={(v) => label(v, min, max)}
        step={0.01}
      />
    </Box>
  );
};

const DateRangeSlider = (props: DateRangeSliderProps) =>
  NumberRangeSlider({
    title: props.title,
    label: props.label,
    min: props.min.getTime(),
    max: props.max.getTime(),
    start: props.start?.getTime(),
    end: props.end?.getTime(),
    onSlideChanged: props.onSlideChanged,
  });

NumberRangeSlider.defaultProps = {
  title: "TODO",
  label: (value: number, min: number, max: number) =>
    mapRangeToRealValue(min, max, value),
  min: Number.MIN_SAFE_INTEGER,
  max: Number.MAX_SAFE_INTEGER,
  start: undefined,
  end: undefined,
};

DateRangeSlider.defaultProps = {
  title: "TODO",
  label: (value: number, min: number, max: number) =>
    new Date(mapRangeToRealValue(min, max, value)).toLocaleDateString(),
  min: dateDefault["min"],
  max: dateDefault["max"],
  start: undefined,
  end: undefined,
};

export { NumberRangeSlider, DateRangeSlider };
