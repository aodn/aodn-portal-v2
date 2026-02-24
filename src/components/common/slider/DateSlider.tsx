import React, { useCallback, useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import { Grid, Stack, Typography } from "@mui/material";
import { dateToValue, valueToDate } from "../../../utils/DateUtils";
import { dateDefault } from "../constants";
import { portalTheme } from "../../../styles";
import { padding } from "../../../styles/constants";
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

const DateSliderPoint: React.FC<DateSliderPointProps> = ({
  valid_points,
  onDatePointChange = undefined,
}) => {
  const sorted_marks: Mark[] = useMemo(() => {
    return valid_points?.sort((a, b) => a - b).map((v) => ({ value: v })) ?? [];
  }, [valid_points]);

  const [datePointStamp, setDatePointStamp] = useState<number | undefined>(
    sorted_marks?.[sorted_marks?.length - 1].value
  );

  const handleSliderChange = useCallback(
    (_: Event, newValue: number | number[]) => {
      setDatePointStamp(newValue as number);
    },
    []
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
  const [dateRangeStamp, setDateRangeStamp] = useState<number[]>([
    dateToValue(
      dayjs(currentMinDate ? currentMinDate : minDate, dateDefault.DATE_FORMAT)
    ),
    dateToValue(
      dayjs(currentMaxDate ? currentMaxDate : maxDate, dateDefault.DATE_FORMAT)
    ),
  ]);

  const handleSliderChange = useCallback(
    (_: Event, newValue: number | number[]) => {
      const v = newValue as number[];
      setDateRangeStamp(v);
    },
    []
  );

  useEffect(() => {
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
            min={dateToValue(dayjs(minDate, dateDefault.DATE_FORMAT))}
            max={dateToValue(dayjs(maxDate, dateDefault.DATE_FORMAT))}
            onChangeCommitted={(_, value) => onDateRangeChange(_, value)}
            onChange={handleSliderChange}
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
