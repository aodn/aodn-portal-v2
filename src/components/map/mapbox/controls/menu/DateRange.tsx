import React from "react";
import timeRange from "../../../../../assets/images/time-range.png";
import {
  DownloadConditionType,
  IDownloadCondition,
} from "../../../../../pages/detail-page/context/DownloadDefinitions";
import { ControlProps } from "./Definition";
import { IconButton } from "@mui/material";

interface DateRangeProps extends ControlProps {
  minDate: string;
  maxDate: string;
  onClick: () => void;
  getAndSetDownloadConditions: (
    type: DownloadConditionType,
    conditions: IDownloadCondition[]
  ) => IDownloadCondition[];
}

const COMPONENT_ID = "dateslider-daterange-menu-button";

const MENU_ID = "daterange-show-hide-menu-button";

const DateRange: React.FC<DateRangeProps> = ({ onClick }) => {
  return (
    <IconButton data-testid={MENU_ID} onClick={onClick}>
      <img alt="" src={timeRange} />
    </IconButton>
  );
};

export { MENU_ID, COMPONENT_ID };

export default DateRange;
