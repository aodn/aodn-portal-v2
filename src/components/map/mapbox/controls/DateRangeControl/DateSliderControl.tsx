import React from "react";
import mapboxgl, { IControl } from "mapbox-gl";
import { createRoot, Root } from "react-dom/client";
import DateSlider from "./DateSlider";
import {
  DownloadConditionType,
  IDownloadCondition,
  DateRangeCondition,
} from "../../../../../pages/detail-page/context/DownloadDefinitions";
import dayjs from "dayjs";

class DateSliderControlClass implements IControl {
  private container: HTMLDivElement | null = null;
  private readonly minDate: string;
  private readonly maxDate: string;
  private readonly setDownloadConditions: (
    type: DownloadConditionType,
    conditions: IDownloadCondition[]
  ) => void;
  private readonly onDateRangeChange = (dateRangeStamps: number[]) => {
    const start = dayjs(dateRangeStamps[0]).format("MM-YYYY");
    const end = dayjs(dateRangeStamps[1]).format("MM-YYYY");

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

  onAdd(map: mapboxgl.Map): HTMLElement {
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

  onRemove() {
    this.container?.parentNode?.removeChild(this.container);
  }
}
export default DateSliderControlClass;
