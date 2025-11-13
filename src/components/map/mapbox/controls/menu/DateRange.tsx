import React, { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  DateRangeCondition,
  DownloadConditionType,
  IDownloadCondition,
  IDownloadConditionCallback,
} from "../../../../../pages/detail-page/context/DownloadDefinitions";
import { ControlProps } from "./Definition";
import { IconButton, Box } from "@mui/material";
import dayjs from "dayjs";
import { dateDefault } from "../../../../common/constants";
import { TimeRangeIcon } from "../../../../../assets/icons/map/time_range";
import { switcherIconButtonSx } from "./MenuControl";
import DateSlider from "../../../../common/slider/DateSlider";

interface DateRangeControlProps extends ControlProps {
  minDate: string;
  maxDate: string;
  getAndSetDownloadConditions: (
    type: DownloadConditionType,
    conditions: IDownloadCondition[]
  ) => IDownloadCondition[];
  downloadConditions: IDownloadCondition[];
}

const MENU_ID = "daterange-show-hide-menu-button";

const DateRange: React.FC<DateRangeControlProps> = ({
  minDate,
  maxDate,
  getAndSetDownloadConditions,
  downloadConditions,
  map, // Map instance passed through ControlProps via cloneElement
}) => {
  const [open, setOpen] = useState<boolean>(false);
  const anchorRef = useRef(null);
  const [currentMinDate, setCurrentMinDate] = useState<string | undefined>(
    undefined
  );
  const [currentMaxDate, setCurrentMaxDate] = useState<string | undefined>(
    undefined
  );

  // Get the map container DOM element from props
  const mapContainer = map?.getContainer();

  const onDateRangeChange = useCallback(
    (
      _: Event | React.SyntheticEvent<Element, Event>,
      dateRangeStamps: number | number[]
    ) => {
      const d = dateRangeStamps as number[];
      const start = dayjs(d[0]).format(dateDefault.DATE_FORMAT);
      const end = dayjs(d[1]).format(dateDefault.DATE_FORMAT);

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
    [maxDate, minDate, getAndSetDownloadConditions]
  );

  useEffect(() => {
    const dateTime = downloadConditions.filter(
      (condition) => condition.type === DownloadConditionType.DATE_RANGE
    ) as DateRangeCondition[];
    if (dateTime && dateTime.length !== 0) {
      setOpen(true);
      const start = dayjs(dateTime[0].start).format(dateDefault.DATE_FORMAT);
      const end = dayjs(dateTime[0].end).format(dateDefault.DATE_FORMAT);
      setCurrentMinDate(start ?? undefined);
      setCurrentMaxDate(end ?? undefined);
    }
  }, [downloadConditions]);

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

      {open &&
        mapContainer &&
        createPortal(
          <Box
            sx={{
              position: "absolute",
              bottom: "8px",
              left: "0", // Start from left edge of container
              right: "0", // Extend to right edge of container
              pointerEvents: "all",
              // Center content within the full width
              display: "flex",
              justifyContent: "center",
            }}
          >
            <DateSlider
              currentMinDate={currentMinDate}
              currentMaxDate={currentMaxDate}
              minDate={minDate}
              maxDate={maxDate}
              onDateRangeChange={onDateRangeChange}
            />
          </Box>,
          mapContainer
        )}
    </>
  );
};

export default DateRange;
