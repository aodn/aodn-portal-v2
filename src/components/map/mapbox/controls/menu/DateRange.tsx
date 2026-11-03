import React, {
  useCallback,
  useEffect,
  startTransition,
  useState,
} from "react";
import { createPortal } from "react-dom";
import {
  DateRangeCondition,
  DownloadConditionType,
  IDownloadCondition,
  IDownloadConditionCallback,
} from "@/pages/detail-page/context/DownloadDefinitions";
import { ControlProps } from "./Definition";
import { Box, IconButton, Stack, Typography } from "@mui/material";
import { switcherIconButtonSx } from "./MenuControl";
import MenuHintTooltip from "./MenuHintTooltip";
import { dateDefault } from "@/components/common/constants";
import { dayjsToUnixMs, toAppDayjs, unixMsToAppDayjs } from "@/utils/DateUtils";
import { CalendarIcon } from "@/assets/icons/search/calendar";
import { TimeRangeIcon } from "@/assets/icons/map/time_range";
import DateSlider from "@/components/common/slider/DateSlider";
import PlainDatePicker from "@/components/common/datetime/PlainDatePicker";
import { AppLocalizationProvider } from "@/app/providers/AppLocalizationProvider";
import useBreakpoint from "@/hooks/useBreakpoint";
import { portalTheme } from "@/styles";
import { TimeRangeTooltipIcon } from "@/assets/icons/map/tooltip_time_range";
import MenuTooltip from "./MenuTooltip";

interface DateRangeControlProps extends ControlProps {
  minDate: string;
  maxDate: string;
  getAndSetDownloadConditions: (
    type: DownloadConditionType,
    conditions: IDownloadCondition[]
  ) => IDownloadCondition[];
  downloadConditions: IDownloadCondition[];
  /** Dataset selection generation current when this render happened. */
  selectionGeneration?: number;
  /** Live check against the provider's latest selection generation. */
  isCurrentSelectionGeneration?: (generation: number) => boolean;
}

const MENU_ID = "daterange-show-hide-menu-button";

const DateRange: React.FC<DateRangeControlProps> = ({
  minDate,
  maxDate,
  getAndSetDownloadConditions,
  downloadConditions,
  selectionGeneration = 0,
  isCurrentSelectionGeneration = () => true,
  map, // Map instance passed through ControlProps via cloneElement
}) => {
  const [open, setOpen] = useState<boolean>(false);
  const [openDatePicker, setOpenDatePicker] = useState<"start" | "end" | null>(
    null
  );
  const [showTooltip, setShowTooltip] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [currentMinDate, setCurrentMinDate] = useState<string | undefined>(
    undefined
  );
  const [currentMaxDate, setCurrentMaxDate] = useState<string | undefined>(
    undefined
  );

  const { isMobile } = useBreakpoint();
  const mapContainer = map?.getContainer();
  const startDate = toAppDayjs(
    currentMinDate ?? minDate,
    dateDefault.DATE_FORMAT
  );
  const endDate = toAppDayjs(
    currentMaxDate ?? maxDate,
    dateDefault.DATE_FORMAT
  );

  const dateFieldSlotProps = (endpoint: "start" | "end", label: string) => ({
    textField: {
      onClick: () => setOpenDatePicker(endpoint),
      onKeyDown: (event: React.KeyboardEvent) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          setOpenDatePicker(endpoint);
        }
      },
      inputProps: {
        readOnly: true,
        role: "button",
        "aria-label": label,
        "aria-haspopup": "dialog" as const,
      },
    },
  });

  const handleIconClick = () => {
    setOpen((prev) => !prev);
    setShowTooltip(!open);
  };

  const handleCloseTooltip = useCallback(() => {
    setShowTooltip(false);
  }, []);

  const onDateRangeChange = useCallback(
    (
      _: Event | React.SyntheticEvent<Element, Event>,
      dateRangeStamps: number | number[]
    ) => {
      // DateSlider debounces this callback, so it can fire after the dataset
      // changed. `selectionGeneration` is the value captured when the update
      // was scheduled; drop it if the selection has moved on since, even when
      // the new dataset has the same bounds or its metadata is still loading.
      if (!isCurrentSelectionGeneration(selectionGeneration)) return;

      const d = dateRangeStamps as number[];
      const start = unixMsToAppDayjs(d[0]).format(dateDefault.DATE_FORMAT);
      const end = unixMsToAppDayjs(d[1]).format(dateDefault.DATE_FORMAT);

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
          DownloadConditionType.DATE_RANGE,
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
    [
      maxDate,
      minDate,
      getAndSetDownloadConditions,
      selectionGeneration,
      isCurrentSelectionGeneration,
    ]
  );

  useEffect(() => {
    const dateTime = downloadConditions.filter(
      (condition) => condition.type === DownloadConditionType.DATE_RANGE
    ) as DateRangeCondition[];
    if (dateTime && dateTime.length !== 0) {
      startTransition(() => {
        setOpen(true);
        const start = toAppDayjs(
          dateTime[0].start,
          dateDefault.DATE_FORMAT
        ).format(dateDefault.DATE_FORMAT);
        const end = toAppDayjs(dateTime[0].end, dateDefault.DATE_FORMAT).format(
          dateDefault.DATE_FORMAT
        );
        setCurrentMinDate(start ?? undefined);
        setCurrentMaxDate(end ?? undefined);
      });
    } else {
      startTransition(() => {
        setCurrentMinDate(undefined);
        setCurrentMaxDate(undefined);
      });
    }
  }, [downloadConditions]);

  return (
    <>
      <MenuHintTooltip hint="Subset Time Range" disable={open}>
        <IconButton
          data-testid={MENU_ID}
          ref={setAnchorEl}
          onClick={handleIconClick}
          sx={switcherIconButtonSx(open)}
        >
          <TimeRangeIcon color={open ? "white" : undefined} />
        </IconButton>
      </MenuHintTooltip>

      <MenuTooltip
        open={showTooltip}
        anchorEl={anchorEl}
        title="Time Range"
        description="Select specific date or time range to filter the dataset details."
        icon={<TimeRangeTooltipIcon />}
        onClose={handleCloseTooltip}
        hideIconOnSmallScreen
      />

      {open &&
        mapContainer &&
        createPortal(
          <Box
            sx={{
              position: "absolute",
              bottom: isMobile ? portalTheme.spacing(5) : "30px",
              left: "0", // Start from left edge of container
              right: "0", // Extend to right edge of container
              pointerEvents: "all",
              // Center content within the full width
              display: "flex",
              justifyContent: "center",
            }}
          >
            {isMobile ? (
              <AppLocalizationProvider>
                <Stack
                  direction="row"
                  spacing={0.5}
                  alignItems="center"
                  onPointerDown={(event) => event.stopPropagation()}
                  onTouchStart={(event) => event.stopPropagation()}
                  onClick={(event) => event.stopPropagation()}
                  sx={{
                    width: portalTheme.spacing(35),
                    maxWidth: "calc(100% - 16px)",
                    px: 1.5,
                    height: portalTheme.spacing(5.5),
                    minWidth: 0,
                    borderRadius: portalTheme.spacing(0.75),
                    backgroundColor: portalTheme.palette.background.paper,
                    boxShadow: portalTheme.shadows[1],
                    justifyContent: "center",
                    "& > .MuiTextField-root": {
                      flex: 1,
                      width: 0,
                      minWidth: 0,
                      border: "none",
                      backgroundColor: "transparent",
                    },
                    "& .MuiTextField-root .MuiInputBase-root": {
                      height: portalTheme.spacing(5),
                      p: 0,
                    },
                    "& .MuiTextField-root input": {
                      ...portalTheme.typography.body2Regular,
                      color: portalTheme.palette.text1,
                      cursor: "pointer",
                    },
                    "& .MuiTextField-root input:focus-visible": {
                      outline: `2px solid ${portalTheme.palette.primary.main}`,
                      outlineOffset: "2px",
                      borderRadius: portalTheme.borderRadius.sm,
                    },
                  }}
                >
                  <CalendarIcon
                    aria-hidden="true"
                    width={portalTheme.spacing(2)}
                    height={portalTheme.spacing(2)}
                    color={portalTheme.palette.grey600}
                    style={{ flexShrink: 0 }}
                  />
                  <PlainDatePicker
                    disableOpenPicker
                    open={openDatePicker === "start"}
                    onClose={() => setOpenDatePicker(null)}
                    slotProps={dateFieldSlotProps("start", "Start date")}
                    views={["year", "month", "day"]}
                    format={dateDefault.DISPLAY_FORMAT}
                    value={startDate}
                    minDate={toAppDayjs(minDate, dateDefault.DATE_FORMAT)}
                    maxDate={endDate}
                    onAccept={(date, context) => {
                      if (!date?.isValid() || context.validationError) return;
                      onDateRangeChange(new Event("change"), [
                        dayjsToUnixMs(
                          toAppDayjs(
                            date.format(dateDefault.DATE_FORMAT),
                            dateDefault.DATE_FORMAT
                          )
                        ),
                        dayjsToUnixMs(endDate, true),
                      ]);
                    }}
                  />
                  <Typography
                    aria-hidden="true"
                    sx={{
                      ...portalTheme.typography.body2Regular,
                      color: portalTheme.palette.text1,
                    }}
                  >
                    –
                  </Typography>
                  <PlainDatePicker
                    disableOpenPicker
                    open={openDatePicker === "end"}
                    onClose={() => setOpenDatePicker(null)}
                    slotProps={dateFieldSlotProps("end", "End date")}
                    views={["year", "month", "day"]}
                    format={dateDefault.DISPLAY_FORMAT}
                    value={endDate}
                    minDate={startDate}
                    maxDate={toAppDayjs(maxDate, dateDefault.DATE_FORMAT)}
                    onAccept={(date, context) => {
                      if (!date?.isValid() || context.validationError) return;
                      onDateRangeChange(new Event("change"), [
                        dayjsToUnixMs(startDate),
                        dayjsToUnixMs(
                          toAppDayjs(
                            date.format(dateDefault.DATE_FORMAT),
                            dateDefault.DATE_FORMAT
                          ),
                          true
                        ),
                      ]);
                    }}
                  />
                </Stack>
              </AppLocalizationProvider>
            ) : (
              <DateSlider
                currentMinDate={currentMinDate}
                currentMaxDate={currentMaxDate}
                minDate={minDate}
                maxDate={maxDate}
                onDateRangeChange={onDateRangeChange}
              />
            )}
          </Box>,
          mapContainer
        )}
    </>
  );
};

export default DateRange;
