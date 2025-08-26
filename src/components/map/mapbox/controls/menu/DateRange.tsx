import React, { useCallback, useRef, useState } from "react";
import {
  DateRangeCondition,
  DownloadConditionType,
  IDownloadCondition,
  IDownloadConditionCallback,
} from "../../../../../pages/detail-page/context/DownloadDefinitions";
import { ControlProps } from "./Definition";
import { Grid, IconButton, Popper, Stack, Typography } from "@mui/material";
import dayjs from "dayjs";
import { dateToValue, valueToDate } from "../../../../../utils/DateUtils";
import PlainSlider from "../../../../common/slider/PlainSlider";
import { dateDefault } from "../../../../common/constants";
import useBreakpoint from "../../../../../hooks/useBreakpoint";
import { padding } from "../../../../../styles/constants";
import { TimeRangeIcon } from "../../../../../assets/map/time_range";
import { switcherIconButtonSx } from "./MenuControl";
import rc8Theme from "../../../../../styles/themeRC8";

interface DateSliderProps {
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

interface DateRangeControlProps extends ControlProps {
  minDate: string;
  maxDate: string;
  getAndSetDownloadConditions: (
    type: DownloadConditionType,
    conditions: IDownloadCondition[]
  ) => IDownloadCondition[];
}

const COMPONENT_ID = "dateslider-daterange-menu-button";
const SLIDER_WIDTH_MOBILE = 254;
const SLIDER_WIDTH_TABLET = 666;
const SLIDER_WIDTH_LAPTOP = 900;
const SLIDER_WIDTH_DESKTOP = 698;
const SLIDER_WIDTH_4K = 850;

const DateSlider: React.FC<DateSliderProps> = ({
  currentMinDate,
  currentMaxDate,
  minDate,
  maxDate,
  onDateRangeChange,
}) => {
  const { isMobile, isTablet, isLaptop, isDesktop, is4K } = useBreakpoint();
  const [dateRangeStamp, setDateRangeStamp] = useState<number[]>([
    dateToValue(
      dayjs(
        currentMinDate ? currentMinDate : minDate,
        dateDefault.SIMPLE_DATE_FORMAT
      )
    ),
    dateToValue(
      dayjs(
        currentMaxDate ? currentMaxDate : maxDate,
        dateDefault.SIMPLE_DATE_FORMAT
      )
    ),
  ]);
  const handleSliderChange = useCallback(
    (_: Event, newValue: number | number[]) => {
      const v = newValue as number[];
      setDateRangeStamp(v);
    },
    []
  );

  return (
    <Grid
      container
      sx={{
        backgroundColor: rc8Theme.palette.primary6,
        borderRadius: "6px",
        display: "flex",
        width: is4K
          ? SLIDER_WIDTH_4K
          : isDesktop
            ? SLIDER_WIDTH_DESKTOP
            : isLaptop
              ? SLIDER_WIDTH_LAPTOP
              : isTablet
                ? SLIDER_WIDTH_TABLET
                : SLIDER_WIDTH_MOBILE,
      }}
      data-testid={COMPONENT_ID}
    >
      <Grid
        item
        xs={12}
        container
        sx={{
          px: padding.medium,
          pt: isMobile || isTablet ? "24px" : padding.small,
        }}
      >
        <Stack
          width="100%"
          direction="row"
          alignItems="center"
          mx={isMobile ? "18px" : "6px"}
          gap="16px"
        >
          <Typography
            sx={{
              ...rc8Theme.typography.title1Medium,
              color: rc8Theme.palette.text1,
              whiteSpace: "nowrap",
              mr: "8px",
              display: isMobile ? "none" : "block",
            }}
          >
            Start Date
          </Typography>
          <PlainSlider
            value={dateRangeStamp}
            min={dateToValue(dayjs(minDate, dateDefault.SIMPLE_DATE_FORMAT))}
            max={dateToValue(dayjs(maxDate, dateDefault.SIMPLE_DATE_FORMAT))}
            onChangeCommitted={onDateRangeChange}
            onChange={handleSliderChange}
            valueLabelDisplay="auto"
            valueLabelFormat={(value: number) =>
              valueToDate(value).format(
                dateDefault.SIMPLE_DATE_FORMAT.replace("-", "/")
              )
            }
          />
          <Typography
            sx={{
              ...rc8Theme.typography.title1Medium,
              color: rc8Theme.palette.text1,
              whiteSpace: "nowrap",
              ml: "8px",
              display: isMobile ? "none" : "block",
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
          mt: isMobile || isTablet ? "2px" : "6px",
          mb: isMobile || isTablet ? "2px" : "6px",
        }}
      >
        <Typography
          sx={{
            ...rc8Theme.typography.body1Medium,
            color: rc8Theme.palette.text1,
          }}
        >
          {minDate.replace("-", "/")}
        </Typography>
        <Typography
          sx={{
            ...rc8Theme.typography.body1Medium,
            color: rc8Theme.palette.text1,
          }}
        >
          {maxDate.replace("-", "/")}
        </Typography>
      </Grid>
    </Grid>
  );
};

const MENU_ID = "daterange-show-hide-menu-button";

const DateRange: React.FC<DateRangeControlProps> = ({
  minDate,
  maxDate,
  getAndSetDownloadConditions,
}) => {
  const { isMobile, isTablet } = useBreakpoint();
  const [open, setOpen] = useState<boolean>(false);
  const anchorRef = useRef(null);
  const [currentMinDate, setCurrentMinDate] = useState<string | undefined>(
    undefined
  );
  const [currentMaxDate, setCurrentMaxDate] = useState<string | undefined>(
    undefined
  );

  const onDateRangeChange = useCallback(
    (
      _: Event | React.SyntheticEvent<Element, Event>,
      dateRangeStamps: number | number[]
    ) => {
      const d = dateRangeStamps as number[];
      const start = dayjs(d[0]).format(dateDefault.SIMPLE_DATE_FORMAT);
      const end = dayjs(d[1]).format(dateDefault.SIMPLE_DATE_FORMAT);

      if (minDate === start && maxDate === end) {
        const prev = getAndSetDownloadConditions(
          DownloadConditionType.DATE_RANGE,
          []
        );
        prev.forEach((p) => {
          const callback: IDownloadConditionCallback =
            p as IDownloadConditionCallback;
          callback.removeCallback?.();
        });
      } else {
        const dateRangeCondition = new DateRangeCondition(
          "date_range",
          start,
          end,
          () => {
            setCurrentMinDate(undefined);
            setCurrentMaxDate(undefined);
          }
        );
        getAndSetDownloadConditions(DownloadConditionType.DATE_RANGE, [
          dateRangeCondition,
        ]);
        setCurrentMinDate(start);
        setCurrentMaxDate(end);
      }
    },
    [maxDate, minDate, getAndSetDownloadConditions]
  );

  return (
    <>
      <IconButton
        data-testid={MENU_ID}
        ref={anchorRef}
        onClick={() => setOpen((prev) => !prev)}
        sx={switcherIconButtonSx(open)}
      >
        <TimeRangeIcon />
      </IconButton>
      <Popper
        open={open}
        anchorEl={anchorRef.current}
        placement="bottom-end"
        disablePortal
        modifiers={[
          {
            name: "offset",
            options: {
              offset: [0, isMobile || isTablet ? 262 : 266], // Add 16px vertical padding from bottom edge
            },
          },
          {
            name: "preventOverflow",
            options: {
              boundariesElement: "viewport", // Constrain to viewport or container
            },
          },
          {
            name: "flip",
            enabled: false, // Prevent flipping to keep at bottom
          },
        ]}
      >
        <DateSlider
          currentMinDate={currentMinDate}
          currentMaxDate={currentMaxDate}
          minDate={minDate}
          maxDate={maxDate}
          onDateRangeChange={onDateRangeChange}
        />
      </Popper>
    </>
  );
};

export default DateRange;
