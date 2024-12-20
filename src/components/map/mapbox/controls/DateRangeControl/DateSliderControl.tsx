import React from "react";
import mapboxgl, { IControl, Map } from "mapbox-gl";
import { createRoot, Root } from "react-dom/client";
import DateSlider from "./DateSlider";
import {
  DownloadConditionType,
  IDownloadCondition,
  DateRangeCondition,
} from "../../../../../pages/detail-page/context/DownloadDefinitions";
import dayjs from "dayjs";
import { SIMPLE_DATE_FORMAT } from "../../../../../pages/detail-page/subpages/tab-panels/AbstractAndDownloadPanel";
import { safeRemoveControl } from "../../../../../utils/MapUtils";

class DateSliderControlClass implements IControl {
  private container: HTMLDivElement | null = null;
  private readonly minDate: string;
  private readonly maxDate: string;
  private readonly setDownloadConditions: (
    type: DownloadConditionType,
    conditions: IDownloadCondition[]
  ) => void;
  private readonly onDateRangeChange = (dateRangeStamps: number[]) => {
    const start = dayjs(dateRangeStamps[0]).format(SIMPLE_DATE_FORMAT);
    const end = dayjs(dateRangeStamps[1]).format(SIMPLE_DATE_FORMAT);

    if (this.minDate === start && this.maxDate === end) {
      this.setDownloadConditions(DownloadConditionType.DATE_RANGE, []);
      return;
    }

    const dateRangeCondition = new DateRangeCondition(start, end, "date_range");
    this.setDownloadConditions(DownloadConditionType.DATE_RANGE, [
      dateRangeCondition,
    ]);
  };
  private root: Root | null = null;

  constructor(
    minDate: string,
    maxDate: string,
    setDownloadConditions: (
      type: DownloadConditionType,
      conditions: IDownloadCondition[]
    ) => void
  ) {
    this.minDate = minDate;
    this.maxDate = maxDate;
    this.setDownloadConditions = setDownloadConditions;
  }

  onAdd(_: mapboxgl.Map): HTMLElement {
    this.container = document.createElement("div");
    this.container.className = "mapboxgl-ctrl mapboxgl-ctrl-group";
    this.root = createRoot(this.container!);
    this.root.render(
      <DateSlider
        minDate={this.minDate}
        maxDate={this.maxDate}
        onDateRangeChange={this.onDateRangeChange}
      />
    );
    return this.container;
  }

  onRemove(_: Map) {
    safeRemoveControl(this.container, this.root);
  }
}
export default DateSliderControlClass;
