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
import { Mark } from "@mui/material/Slider/useSlider.types";

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
        item
        xs={12}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        sx={{
          mx: "20px",
          mt: { xs: "2px", md: "6px" },
          mb: { xs: "2px", md: "6px" },
        }}
      >
        <Typography
          sx={{
            ...portalTheme.typography.body1Medium,
            color: portalTheme.palette.text1,
          }}
        >
          Displaying @ {valueToDate(datePointStamp!).toISOString()}
        </Typography>
      </Grid>
      <Grid
        item
        xs={12}
        container
        sx={{
          px: padding.medium,
          pt: { xs: "24px", md: padding.small },
        }}
      >
        <Stack
          width="100%"
          direction="row"
          alignItems="center"
          mx={{ xs: "18px", sm: "6px" }}
          gap="16px"
        >
          <PlainSlider
            step={null} // ← key: disables free sliding
            marks={sorted_marks}
            min={sorted_marks && sorted_marks[0].value}
            max={sorted_marks && sorted_marks[sorted_marks.length - 1].value}
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
            sx={{
              "& .MuiSlider-valueLabel": {
                top: -10, // move above
                transform: "none",
              },
            }}
          />
        </Stack>
      </Grid>
    </Grid>
  );
};

const DateSliderRange: React.FC<DateSliderRangeProps> = ({
  currentMinDate,
  currentMaxDate,
  minDate,
  maxDate,
  onDateRangeChange,
}) => {
  const minValue = useMemo(
    () => dateToValue(dayjs(minDate, dateDefault.DATE_FORMAT)),
    [minDate]
  );
  const maxValue = useMemo(
    () => dateToValue(dayjs(maxDate, dateDefault.DATE_FORMAT)),
    [maxDate]
  );

  const [dateRangeStamp, setDateRangeStamp] = useState<number[]>([
    dateToValue(
      dayjs(currentMinDate ? currentMinDate : minDate, dateDefault.DATE_FORMAT)
    ),
    dateToValue(
      dayjs(currentMaxDate ? currentMaxDate : maxDate, dateDefault.DATE_FORMAT)
    ),
  ]);

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

      const step = DAY_MS;
      const current = dateRangeStamp[index];
      let next = current + direction * step;
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
    [applyRangeValue, dateRangeStamp, maxValue, minValue]
  );

  useEffect(() => {
    startTransition(() => {
      const newDateRangeStamp = [
        dateToValue(
          dayjs(
            currentMinDate ? currentMinDate : minDate,
            dateDefault.DATE_FORMAT
          )
        ),
        dateToValue(
          dayjs(
            currentMaxDate ? currentMaxDate : maxDate,
            dateDefault.DATE_FORMAT
          )
        ),
      ];
      setDateRangeStamp(newDateRangeStamp);
    });
  }, [currentMinDate, currentMaxDate, minDate, maxDate]);

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
        item
        xs={12}
        container
        sx={{
          px: padding.medium,
          pt: { xs: "24px", md: padding.small },
        }}
      >
        <Stack
          width="100%"
          direction="row"
          alignItems="center"
          mx={{ xs: "18px", sm: "6px" }}
          gap="16px"
        >
          <Typography
            sx={{
              ...portalTheme.typography.title1Medium,
              color: portalTheme.palette.text1,
              whiteSpace: "nowrap",
              mr: "8px",
              display: { xs: "none", sm: "block" },
            }}
          >
            Start Date
          </Typography>
          <PlainSlider
            value={dateRangeStamp}
            min={minValue}
            max={maxValue}
            // Values are epoch ms; default step of 1ms makes arrow keys appear broken.
            step={DAY_MS}
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
          />
          <Typography
            sx={{
              ...portalTheme.typography.title1Medium,
              color: portalTheme.palette.text1,
              whiteSpace: "nowrap",
              ml: "8px",
              display: { xs: "none", sm: "block" },
            }}
          >
            On going
          </Typography>
        </Stack>
      </Grid>
      <Grid
        item
        xs={12}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        sx={{
          mx: "20px",
          mt: { xs: "2px", md: "6px" },
          mb: { xs: "2px", md: "6px" },
        }}
      >
        <Typography
          sx={{
            ...portalTheme.typography.body1Medium,
            color: portalTheme.palette.text1,
          }}
        >
          {dayjs(minDate).format(dateDefault.DISPLAY_FORMAT)}
        </Typography>
        <Typography
          sx={{
            ...portalTheme.typography.body1Medium,
            color: portalTheme.palette.text1,
          }}
        >
          {dayjs(maxDate).format(dateDefault.DISPLAY_FORMAT)}
        </Typography>
      </Grid>
    </Grid>
  );
};

export { DateSliderPoint };
export default DateSliderRange;
