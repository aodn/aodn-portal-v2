import React, {
  startTransition,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Grid, Stack, Typography } from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";
import {
  dayjsToUnixMs,
  formatDate,
  toAppDayjs,
  unixMsToAppDayjs,
} from "@/utils/DateUtils";
import { dateDefault } from "../constants";
import { portalTheme } from "../../../styles";
import { padding } from "@/styles/constants";
import PlainSlider, { ConcentrationSlider, ThumbType } from "./PlainSlider";
/** Slider mark shape (was imported from a deep MUI path removed in v7). */
interface Mark {
  value: number;
  label?: React.ReactNode;
}

interface DateSliderRangeProps {
  visible?: boolean;
  currentMinDate: string | undefined;
  currentMaxDate: string | undefined;
  minDate: string;
  maxDate: string;
  onDateRangeChange: (
    event: Event | React.SyntheticEvent<Element, Event>,
    value: number | number[]
  ) => void;
}

interface DateSliderPointProps {
  valid_points?: Array<number>;
  onDatePointChange?: (
    event: Event | React.SyntheticEvent<Element, Event> | undefined,
    value: number | number[]
  ) => void;
  /** Merged onto the default overlay container styles. */
  sx?: SxProps<Theme>;
  thumbType?: ThumbType;
}

const COMPONENT_ID = "dateslider-daterange-menu-button";

const sliderCaptionSx = {
  ...portalTheme.typography.body1Medium,
  color: portalTheme.palette.text1,
  whiteSpace: "nowrap",
  // Override default body1 padding so the bar top isn't pushed down
  padding: 0,
} as const;

/** One calendar day in ms — sensible arrow-key step for date timestamps. */
const DAY_MS = 24 * 60 * 60 * 1000;
/** ~one month jump for Shift+Arrow / PageUp / PageDown. */
const MONTH_MS = 30 * DAY_MS;

/**
 * Find the mark closest to `value`. Marks are sorted, so use a binary search.
 * A layer can have tens of thousands of marks, and this runs every time the
 * thumb moves.
 */
const nearestMarkIndex = (marks: number[], value: number): number => {
  if (marks.length === 0) return -1;

  let low = 0;
  let high = marks.length - 1;
  while (low < high) {
    const mid = (low + high) >> 1;
    if (marks[mid] < value) {
      low = mid + 1;
    } else {
      high = mid;
    }
  }

  // `low` is the first mark >= value. The mark before it can be closer.
  const prev = low > 0 ? low - 1 : low;
  return Math.abs(marks[prev] - value) <= Math.abs(marks[low] - value)
    ? prev
    : low;
};

/**
 * Move a raw slider value onto the nearest mark. MUI no longer gets the marks,
 * so the slider moves freely and we snap the value here.
 */
const snapToMark = (marks: number[], value: number): number | undefined => {
  const index = nearestMarkIndex(marks, value);
  return index === -1 ? undefined : marks[index];
};

/** True when `value` is one of the marks. */
const includesMark = (marks: number[], value: number): boolean => {
  const index = nearestMarkIndex(marks, value);
  return index !== -1 && marks[index] === value;
};

/**
 * Get the next or previous mark for arrow key navigation. MUI cannot step
 * between marks on its own, so we do it here.
 */
const stepMarkValue = (
  marks: number[],
  current: number | undefined,
  direction: -1 | 1
): number | undefined => {
  if (marks.length === 0) return current;

  // Start from the nearest mark, then move one step.
  const index = current === undefined ? 0 : nearestMarkIndex(marks, current);

  const next = index + direction;
  if (next < 0 || next >= marks.length) return marks[index] ?? current;
  return marks[next];
};

const DateSliderPoint: React.FC<DateSliderPointProps> = ({
  valid_points,
  onDatePointChange = undefined,
  sx,
  thumbType = ThumbType.CIRCLE,
}) => {
  const sorted_marks: Mark[] = useMemo(() => {
    return [...(valid_points ?? [])]
      .sort((a, b) => a - b)
      .map((v) => ({ value: v }));
  }, [valid_points]);

  const markValues = useMemo(
    () => sorted_marks.map((m) => m.value),
    [sorted_marks]
  );

  const [pickedStamp, setPickedStamp] = useState<number | undefined>(undefined);

  const datePointStamp =
    pickedStamp !== undefined && includesMark(markValues, pickedStamp)
      ? pickedStamp
      : markValues[markValues.length - 1];

  // valid_points often arrive after mount; keep the thumb on a real mark.
  useEffect(() => {
    startTransition(() => {
      if (sorted_marks.length === 0) {
        setPickedStamp(undefined);
        return;
      }
      setPickedStamp((current) =>
        current !== undefined && includesMark(markValues, current)
          ? current
          : sorted_marks[sorted_marks.length - 1].value
      );
    });
  }, [markValues, sorted_marks]);

  const handleSliderChange = useCallback(
    (_: Event, newValue: number | number[]) => {
      const snapped = snapToMark(markValues, newValue as number);
      if (snapped !== undefined) {
        setPickedStamp(snapped);
      }
    },
    [markValues]
  );

  const applyPointValue = useCallback(
    (event: Event | React.SyntheticEvent<Element, Event>, newValue: number) => {
      setPickedStamp(newValue);
      onDatePointChange?.(event, newValue);
    },
    [onDatePointChange]
  );

  // The slider moves freely, so snap the value before sending it out.
  const handleSliderCommit = useCallback(
    (
      event: Event | React.SyntheticEvent<Element, Event>,
      newValue: number | number[]
    ) => {
      const snapped = snapToMark(markValues, newValue as number);
      if (snapped !== undefined) {
        applyPointValue(event, snapped);
      }
    },
    [applyPointValue, markValues]
  );

  /**
   * Move the thumb one mark per arrow key.
   *
   * This runs in the capture phase, above the hidden range input. MUI has its
   * own keydown handler that steps by `step` and sends out a stale value, and
   * it runs before any `onKeyDown` we pass in. So we stop arrow keys here.
   */
  const handleKeyDownCapture = useCallback(
    (event: React.KeyboardEvent) => {
      const direction: -1 | 1 | 0 =
        event.key === "ArrowLeft" || event.key === "ArrowDown"
          ? -1
          : event.key === "ArrowRight" || event.key === "ArrowUp"
            ? 1
            : 0;

      if (direction === 0) return;

      // Stop the key even at the two ends, so MUI never sees it.
      event.preventDefault();
      event.stopPropagation();

      const next = stepMarkValue(markValues, datePointStamp, direction);
      if (next === undefined || next === datePointStamp) return;

      applyPointValue(event, next);
    },
    [applyPointValue, datePointStamp, markValues]
  );

  if (sorted_marks.length === 0) {
    return null;
  }

  return (
    <Grid
      container
      sx={[
        {
          backgroundColor: portalTheme.palette.primary6,
          borderRadius: "6px",
          display: "flex",
          alignItems: "center",
          width: "100%",
          height: portalTheme.spacing(6),
          boxSizing: "border-box",
          mx: "8px",
          overflow: "visible",
          position: "relative",
          zIndex: 2,
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      data-testid={COMPONENT_ID}
      onKeyDownCapture={handleKeyDownCapture}
    >
      <Grid
        container
        sx={{
          px: padding.medium,
          py: 0,
          overflow: "visible",
          alignItems: "center",
        }}
        size={12}
      >
        <Stack width="100%" direction="row" alignItems="center">
          <Stack flexShrink={0} alignItems="flex-start">
            <Typography sx={sliderCaptionSx}>
              Displaying{" "}
              {datePointStamp !== undefined
                ? formatDate(unixMsToAppDayjs(datePointStamp))
                : ""}
            </Typography>
          </Stack>
          <ConcentrationSlider
            // `marks` only draws the rail density. MUI does not get them, so
            // the slider moves freely and `handleSliderChange` snaps the value.
            marks={sorted_marks}
            min={sorted_marks[0].value}
            max={sorted_marks[sorted_marks.length - 1].value}
            value={datePointStamp}
            defaultValue={datePointStamp}
            onChangeCommitted={handleSliderCommit}
            onChange={handleSliderChange}
            valueLabelDisplay="auto"
            valueLabelFormat={(value: number) =>
              formatDate(unixMsToAppDayjs(value))
            }
            thumb={thumbType}
          />
        </Stack>
      </Grid>
    </Grid>
  );
};

/** Epoch ms for {@link dateDefault.min} (1 Jan 1970 UTC). Slider floor. */
const SLIDER_MIN_FLOOR = dayjsToUnixMs(dateDefault.min);

/**
 * Parse a date string to slider epoch ms at **start of day**, never below
 * {@link SLIDER_MIN_FLOOR}. Used for the left thumb / rail min.
 */
const dateStringToSliderMinValue = (date: string): number =>
  Math.max(
    SLIDER_MIN_FLOOR,
    dayjsToUnixMs(toAppDayjs(date, dateDefault.DATE_FORMAT))
  );

/**
 * Parse a date string to slider epoch ms at **end of day**. Used for the right
 * thumb / rail max so a full-coverage selection reaches the right end of the rail
 * (start-of-day on maxDate sits left of `max` and collapses onto the left when
 * min and max share the same calendar day).
 */
const dateStringToSliderMaxValue = (date: string): number =>
  dayjsToUnixMs(toAppDayjs(date, dateDefault.DATE_FORMAT), true);

/** Full-coverage thumb pair for the current rail bounds. */
const fullCoverageRange = (minValue: number, maxValue: number): number[] => [
  minValue,
  maxValue,
];

const DateSliderRange: React.FC<DateSliderRangeProps> = ({
  currentMinDate,
  currentMaxDate,
  minDate,
  maxDate,
  onDateRangeChange,
}) => {
  // Floor dataset min at 1 Jan 1970 so the rail/thumbs never open earlier.
  const minValue = useMemo(
    () => dateStringToSliderMinValue(minDate),
    [minDate]
  );
  // End-of-day so the rail max is after the start-of-day min even on a single day.
  const maxValue = useMemo(
    () => dateStringToSliderMaxValue(maxDate),
    [maxDate]
  );

  /**
   * Day-sized steps need a track at least one day wide. When min/max are the
   * same calendar day, max-min ≈ 86400000−1 &lt; DAY_MS and MUI pins both thumbs
   * to min. Use the full track span as the step so left/right ends are valid.
   */
  const stepMs = useMemo(() => {
    const span = maxValue - minValue;
    if (span <= 0) return DAY_MS;
    return span < DAY_MS ? span : DAY_MS;
  }, [minValue, maxValue]);

  const [dateRangeStamp, setDateRangeStamp] = useState<number[]>(() => {
    if (currentMinDate || currentMaxDate) {
      return [
        dateStringToSliderMinValue(currentMinDate ? currentMinDate : minDate),
        dateStringToSliderMaxValue(currentMaxDate ? currentMaxDate : maxDate),
      ];
    }
    return fullCoverageRange(
      dateStringToSliderMinValue(minDate),
      dateStringToSliderMaxValue(maxDate)
    );
  });

  const applyRangeValue = useCallback(
    (
      event: Event | React.SyntheticEvent<Element, Event>,
      newValue: number[]
    ) => {
      setDateRangeStamp(newValue);
      onDateRangeChange(event, newValue);
    },
    [onDateRangeChange]
  );

  const handleSliderChange = useCallback(
    (_: Event, newValue: number | number[]) => {
      const v = newValue as number[];
      setDateRangeStamp(v);
    },
    []
  );

  /**
   * MUI Slider values are epoch ms; the default step of 1ms makes ArrowLeft/
   * ArrowRight look broken. Native range stepping is also unreliable in some
   * environments, so step the focused thumb here explicitly.
   *
   * Shift+Arrow / PageUp / PageDown are already handled by MUI via shiftStep.
   */
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.defaultPrevented) return;

      const direction: -1 | 1 | 0 =
        event.key === "ArrowLeft" || event.key === "ArrowDown"
          ? -1
          : event.key === "ArrowRight" || event.key === "ArrowUp"
            ? 1
            : 0;

      if (direction === 0) return;

      // Let MUI handle coarse steps (Shift+Arrow, PageUp/PageDown).
      if (
        event.shiftKey ||
        event.key === "PageUp" ||
        event.key === "PageDown"
      ) {
        return;
      }

      const index = Number(
        (event.currentTarget as HTMLInputElement).getAttribute("data-index")
      );
      if (Number.isNaN(index) || index < 0 || index > 1) return;

      const current = dateRangeStamp[index];
      let next = current + direction * stepMs;
      next = Math.min(maxValue, Math.max(minValue, next));

      // Keep thumbs ordered without swapping which one is focused.
      if (index === 0) {
        next = Math.min(next, dateRangeStamp[1]);
      } else {
        next = Math.max(next, dateRangeStamp[0]);
      }

      if (next === current) {
        event.preventDefault();
        return;
      }

      const newRange =
        index === 0 ? [next, dateRangeStamp[1]] : [dateRangeStamp[0], next];

      event.preventDefault();
      event.stopPropagation();
      applyRangeValue(event, newRange);
    },
    [applyRangeValue, dateRangeStamp, maxValue, minValue, stepMs]
  );

  useEffect(() => {
    startTransition(() => {
      if (currentMinDate || currentMaxDate) {
        setDateRangeStamp([
          dateStringToSliderMinValue(currentMinDate ? currentMinDate : minDate),
          dateStringToSliderMaxValue(currentMaxDate ? currentMaxDate : maxDate),
        ]);
      } else {
        // Full coverage: left thumb at start-of-day min, right at end-of-day max
        setDateRangeStamp(fullCoverageRange(minValue, maxValue));
      }
    });
  }, [currentMinDate, currentMaxDate, minDate, maxDate, minValue, maxValue]);

  return (
    <Grid
      container
      sx={{
        backgroundColor: portalTheme.palette.primary6,
        borderRadius: portalTheme.borderRadius.sm,
        display: "flex",
        width: "100%",
        mx: "8px",
        overflow: "visible",
        height: "48px",
      }}
      data-testid={COMPONENT_ID}
    >
      <Grid
        container
        sx={{
          px: padding.medium,
          py: "2px",
          overflow: "visible",
        }}
        size={12}
      >
        <Stack
          width="100%"
          direction="row"
          alignItems="center"
          mx={{ xs: "18px", sm: "6px" }}
          gap="16px"
        >
          <Stack flexShrink={0} alignItems="flex-start">
            <Typography
              sx={{
                ...sliderCaptionSx,
                display: { xs: "none", sm: "block" },
              }}
            >
              Start Date
            </Typography>
            <Typography sx={sliderCaptionSx}>
              {formatDate(unixMsToAppDayjs(minValue))}
            </Typography>
          </Stack>
          <PlainSlider
            value={dateRangeStamp}
            min={minValue}
            max={maxValue}
            // Day steps when the track is ≥1 day; shorter tracks (same calendar
            // day with endOf max) use the full span so both ends are reachable.
            step={stepMs}
            shiftStep={MONTH_MS}
            onChangeCommitted={(_, value) => onDateRangeChange(_, value)}
            onChange={handleSliderChange}
            slotProps={{
              input: {
                onKeyDown: handleKeyDown,
              },
            }}
            valueLabelDisplay="auto"
            valueLabelFormat={(value: number) =>
              formatDate(unixMsToAppDayjs(value))
            }
            sx={{ flex: 1, minWidth: 0 }}
          />
          <Stack flexShrink={0} alignItems="flex-end">
            <Typography
              sx={{
                ...sliderCaptionSx,
                display: { xs: "none", sm: "block" },
              }}
            >
              On going
            </Typography>
            <Typography sx={sliderCaptionSx}>
              {formatDate(unixMsToAppDayjs(maxValue))}
            </Typography>
          </Stack>
        </Stack>
      </Grid>
    </Grid>
  );
};

export { DateSliderPoint, ThumbType };
export default DateSliderRange;
