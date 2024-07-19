import * as React from "react";
import { useCallback, useEffect } from "react";
import Box from "@mui/material/Box";
import { SxProps, Theme } from "@mui/material";
import { dateDefault } from "../constants";
import StyledSlider from "../../../styles/StyledSlider";

interface RangeSliderProps<T> {
  title?: string;
  label?: (value: number, min: number, max: number) => string;
  min?: T;
  max?: T;
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

const NumberRangeSlider: React.FC<NumberRangeSliderProps> = ({
  title = "TODO",
  label = (value: number, min: number, max: number) =>
    "" + mapRangeToRealValue(min, max, value),
  min = Number.MIN_SAFE_INTEGER,
  max = Number.MAX_SAFE_INTEGER,
  start = undefined,
  end = undefined,
  sx,
  onSlideChanged,
}) => {
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
    (
      event: Event | React.SyntheticEvent<Element, Event>,
      value: number | number[]
    ) => {
      const c: number[] = Array.isArray(value) ? value : [value];
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

const DateRangeSlider: React.FC<DateRangeSliderProps> = ({
  title = "TODO",
  label = (value: number, min: number, max: number) =>
    new Date(mapRangeToRealValue(min, max, value)).toLocaleDateString(),
  min = dateDefault["min"],
  max = dateDefault["max"],
  start = dateDefault["min"],
  end = dateDefault["max"],
  onSlideChanged,
}) =>
  NumberRangeSlider({
    title: title,
    label: label,
    min: min.getTime(),
    max: max.getTime(),
    start: start?.getTime(),
    end: end?.getTime(),
    onSlideChanged: onSlideChanged,
  });

export { NumberRangeSlider, DateRangeSlider };
