import React, {
  startTransition,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import dayjs from "dayjs";
import { Grid, Stack, Typography } from "@mui/material";
import { dateToValue, valueToDate } from "@/utils/DateUtils";
import { dateDefault } from "../constants";
import { portalTheme } from "../../../styles";
import { padding } from "@/styles/constants";
import PlainSlider from "./PlainSlider";

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
}

const COMPONENT_ID = "dateslider-daterange-menu-button";

/** One calendar day in ms — sensible arrow-key step for date timestamps. */
const DAY_MS = 24 * 60 * 60 * 1000;
/** ~one month jump for Shift+Arrow / PageUp / PageDown. */
const MONTH_MS = 30 * DAY_MS;

/**
 * Resolve the next/previous discrete mark for keyboard navigation.
 * MUI's step=null uses step="any" on the native range input, which does not
 * reliably step between marks with ArrowLeft/ArrowRight.
 */
const stepMarkValue = (
  marks: number[],
  current: number | undefined,
  direction: -1 | 1
): number | undefined => {
  if (marks.length === 0) return current;

  let index = current === undefined ? -1 : marks.indexOf(current);
  if (index === -1) {
    // Snap to nearest mark, then step in the requested direction.
    index = marks.reduce(
      (best, value, i) =>
        current !== undefined &&
        Math.abs(value - current) < Math.abs(marks[best] - current)
          ? i
          : best,
      0
    );
  }

  const next = index + direction;
  if (next < 0 || next >= marks.length) return marks[index] ?? current;
  return marks[next];
};

const DateSliderPoint: React.FC<DateSliderPointProps> = ({
  valid_points,
  onDatePointChange = undefined,
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

  const [datePointStamp, setDatePointStamp] = useState<number | undefined>(
    sorted_marks.length > 0
      ? sorted_marks[sorted_marks.length - 1].value
      : undefined
  );

  // valid_points often arrive after mount; keep the thumb on a real mark.
  useEffect(() => {
    startTransition(() => {
      if (sorted_marks.length === 0) {
        setDatePointStamp(undefined);
        return;
      }
      setDatePointStamp((current) =>
        current !== undefined && markValues.includes(current)
          ? current
          : sorted_marks[sorted_marks.length - 1].value
      );
    });
  }, [markValues, sorted_marks]);

  const handleSliderChange = useCallback(
    (_: Event, newValue: number | number[]) => {
      setDatePointStamp(newValue as number);
    },
    []
  );

  const applyPointValue = useCallback(
    (event: Event | React.SyntheticEvent<Element, Event>, newValue: number) => {
      setDatePointStamp(newValue);
      onDatePointChange?.(event, newValue);
    },
    [onDatePointChange]
  );

  // Explicit left/right (and up/down) handling so the thumb steps between
  // discrete valid timestamps instead of relying on native range step="any".
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      const direction: -1 | 1 | 0 =
        event.key === "ArrowLeft" || event.key === "ArrowDown"
          ? -1
          : event.key === "ArrowRight" || event.key === "ArrowUp"
            ? 1
            : 0;

      if (direction === 0) return;

      const next = stepMarkValue(markValues, datePointStamp, direction);
      if (next === undefined || next === datePointStamp) {
        event.preventDefault();
        return;
      }

      event.preventDefault();
      event.stopPropagation();
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
      sx={{
        backgroundColor: portalTheme.palette.primary6,
        borderRadius: "6px",
        display: "flex",
        width: "100%",
        mx: "8px",
      }}
      data-testid={COMPONENT_ID}
    >
      <Grid
        container
        sx={{
          px: padding.medium,
          pt: { xs: "24px", md: padding.small },
          pb: { xs: "2px", md: "6px" },
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
                ...portalTheme.typography.body1Medium,
                color: portalTheme.palette.text1,
                whiteSpace: "nowrap",
                display: { xs: "none", sm: "block" },
              }}
            >
              Displaying
            </Typography>
            <Typography
              sx={{
                ...portalTheme.typography.body1Medium,
                color: portalTheme.palette.text1,
                whiteSpace: "nowrap",
              }}
            >
              {datePointStamp !== undefined
                ? valueToDate(datePointStamp).format(dateDefault.DISPLAY_FORMAT)
                : ""}
            </Typography>
          </Stack>
          <PlainSlider
            step={null} // ← key: disables free sliding
            marks={sorted_marks}
            min={sorted_marks[0].value}
            max={sorted_marks[sorted_marks.length - 1].value}
            value={datePointStamp}
            defaultValue={datePointStamp}
            onChangeCommitted={(event, value) =>
              onDatePointChange?.(event, value)
            }
            onChange={handleSliderChange}
            slotProps={{
              // Keyboard focus is on the hidden range input; handle arrows here
              // so the thumb steps between discrete marks (step=null alone is unreliable).
              input: {
                onKeyDown: handleKeyDown,
              },
            }}
            valueLabelDisplay="auto"
            valueLabelFormat={(value: number) =>
              valueToDate(value).format(dateDefault.DISPLAY_FORMAT)
            }
            sx={{ flex: 1, minWidth: 0 }}
          />
        </Stack>
      </Grid>
    </Grid>
  );
};

/** Epoch ms for {@link dateDefault.min} (1 Jan 1970 local). Slider floor. */
const SLIDER_MIN_FLOOR = dateToValue(dayjs(dateDefault.min));

/**
 * Parse a date string to slider epoch ms at **start of day**, never below
 * {@link SLIDER_MIN_FLOOR}. Used for the left thumb / rail min.
 */
const dateStringToSliderMinValue = (date: string): number =>
  Math.max(SLIDER_MIN_FLOOR, dateToValue(dayjs(date, dateDefault.DATE_FORMAT)));

/**
 * Parse a date string to slider epoch ms at **end of day**. Used for the right
 * thumb / rail max so a full-coverage selection reaches the right end of the rail
 * (start-of-day on maxDate sits left of `max` and collapses onto the left when
 * min and max share the same calendar day).
 */
const dateStringToSliderMaxValue = (date: string): number =>
  dateToValue(dayjs(date, dateDefault.DATE_FORMAT), true);

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
        borderRadius: "6px",
        display: "flex",
        width: "100%",
        mx: "8px",
      }}
      data-testid={COMPONENT_ID}
    >
      <Grid
        container
        sx={{
          px: padding.medium,
          pt: { xs: "24px", md: padding.small },
          pb: { xs: "2px", md: "6px" },
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
                ...portalTheme.typography.body1Medium,
                color: portalTheme.palette.text1,
                whiteSpace: "nowrap",
                display: { xs: "none", sm: "block" },
              }}
            >
              Start Date
            </Typography>
            <Typography
              sx={{
                ...portalTheme.typography.body1Medium,
                color: portalTheme.palette.text1,
                whiteSpace: "nowrap",
              }}
            >
              {valueToDate(minValue).format(dateDefault.DISPLAY_FORMAT)}
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
              valueToDate(value).format(dateDefault.DISPLAY_FORMAT)
            }
            sx={{ flex: 1, minWidth: 0 }}
          />
          <Stack flexShrink={0} alignItems="flex-end">
            <Typography
              sx={{
                ...portalTheme.typography.body1Medium,
                color: portalTheme.palette.text1,
                whiteSpace: "nowrap",
                display: { xs: "none", sm: "block" },
              }}
            >
              On going
            </Typography>
            <Typography
              sx={{
                ...portalTheme.typography.body1Medium,
                color: portalTheme.palette.text1,
                whiteSpace: "nowrap",
              }}
            >
              {valueToDate(maxValue).format(dateDefault.DISPLAY_FORMAT)}
            </Typography>
          </Stack>
        </Stack>
      </Grid>
    </Grid>
  );
};

export { DateSliderPoint };
export default DateSliderRange;
