import React from "react";
import dayjs, { Dayjs } from "dayjs";
import { Box, Stack, Typography } from "@mui/material";
import BaseConditionCard from "./BaseConditionCard";
import {
  DateRangeCondition,
  DownloadConditionType,
} from "../../../context/DownloadDefinitions";
import PlainDatePicker from "../../../../../components/common/datetime/PlainDatePicker";
import { DEFAULT_DATE_PICKER_SLOT } from "../../../../../components/common/datetime/datePickerSlots";
import { portalTheme } from "../../../../../styles";
import { CalendarIcon } from "../../../../../assets/icons/search/calendar";
import { TimeRangeTooltipIcon } from "../../../../../assets/icons/map/tooltip_time_range";
import { dateDefault } from "../../../../../components/common/constants";

const formatOrEmpty = (d: Dayjs | null): string =>
  d?.isValid() ? d.format("YYYY-MM-DD") : "";

const datePickerSx = {
  border: "none",
  borderRadius: "6px",
  boxShadow: "1px 1px 4px 0 rgba(0, 0, 0, 0.10)",
  "& input": {
    ...portalTheme.typography.body2Regular,
    color: portalTheme.palette.text1,
  },
} as const;

const datePickerSlotProps = {
  ...DEFAULT_DATE_PICKER_SLOT,
  openPickerIcon: {
    color: portalTheme.palette.secondary2,
    width: 20,
    height: 20,
  },
} as const;

interface DateRangeConditionCardProps {
  dateRangeCondition: DateRangeCondition;
  onChange: (start: string, end: string) => void;
  onRemove?: () => void;
  disable?: boolean;
  minDate?: Dayjs;
  maxDate?: Dayjs;
}

interface DateRowProps {
  label: string;
  value: string;
  onChange: (next: Dayjs | null) => void;
  disabled?: boolean;
  minDate?: Dayjs;
  maxDate?: Dayjs;
}

const DateRow: React.FC<DateRowProps> = ({
  label,
  value,
  onChange,
  disabled,
  minDate,
  maxDate,
}) => (
  <Stack direction="row" alignItems="center" spacing={1} sx={{ width: "100%" }}>
    <Typography
      variant="body1Medium"
      sx={{
        color: portalTheme.palette.text1,
        minWidth: 44,
        display: "flex",
        alignItems: "center",
      }}
    >
      {label}:
    </Typography>
    <PlainDatePicker
      sx={datePickerSx}
      views={["year", "month", "day"]}
      format={dateDefault.DISPLAY_FORMAT}
      value={dayjs(value)}
      minDate={minDate}
      maxDate={maxDate}
      onChange={(date) => onChange(date as Dayjs | null)}
      disabled={disabled}
      slots={{ openPickerIcon: CalendarIcon }}
      slotProps={datePickerSlotProps}
    />
  </Stack>
);

const DateRangeConditionCard: React.FC<DateRangeConditionCardProps> = ({
  onRemove,
  onChange,
  dateRangeCondition,
  disable,
  minDate,
  maxDate,
}) => {
  const { start, end } = dateRangeCondition;

  const sliderAction = (
    <Stack direction="row" alignItems="center" spacing={2}>
      <Box sx={{ "& svg": { width: 32, height: 32 } }}>
        <TimeRangeTooltipIcon />
      </Box>
      <Typography
        variant="body1Medium"
        sx={{ color: portalTheme.palette.text1 }}
      >
        Operate time range slider
      </Typography>
    </Stack>
  );

  return (
    <BaseConditionCard
      id={dateRangeCondition.id}
      type={DownloadConditionType.DATE_RANGE}
      removeCallback={onRemove}
      disable={disable}
      actions={sliderAction}
    >
      <Stack
        direction="column"
        spacing={1}
        sx={{ width: "90%", mx: "auto" }}
        data-testid="date-range-condition-box"
      >
        <DateRow
          label="From"
          value={start}
          disabled={disable}
          minDate={minDate}
          maxDate={dayjs(end)}
          onChange={(next) => {
            if (next?.isValid() && !next.isAfter(dayjs(end))) {
              onChange(formatOrEmpty(next), end);
            }
          }}
        />
        <DateRow
          label="To"
          value={end}
          disabled={disable}
          maxDate={maxDate}
          minDate={dayjs(start)}
          onChange={(next) => {
            if (next?.isValid() && !next.isBefore(dayjs(start))) {
              onChange(start, formatOrEmpty(next));
            }
          }}
        />
      </Stack>
    </BaseConditionCard>
  );
};

export default DateRangeConditionCard;
