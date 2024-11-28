import React from "react";
import mapboxgl, { IControl } from "mapbox-gl";
import { createRoot, Root } from "react-dom/client";
import DateSelector from "./DateSelector";

class DateSelectorControlClass implements IControl {
  private container: HTMLDivElement | null = null;
  private readonly minDate: string;
  private readonly maxDate: string;
  private readonly onSelectorChange: (
    startDate: string,
    endDate: string
  ) => void;
  private root: Root | null = null;

  constructor(
    minDate: string,
    maxDate: string,
    onSelectorChange: (startDate: string, endDate: string) => void
  ) {
    this.minDate = minDate;
    this.maxDate = maxDate;
    this.onSelectorChange = onSelectorChange;
  }

  onAdd(map: mapboxgl.Map): HTMLElement {
    this.container = document.createElement("div");
    this.container.className = "mapboxgl-ctrl mapboxgl-ctrl-group";
    this.container.onclick = (e) => {};
    this.root = createRoot(this.container!);
    this.root.render(
      <DateSelector
        minDate={this.minDate}
        maxDate={this.maxDate}
        onSelectorChange={this.onSelectorChange}
      />
    );
    return this.container;
  }

  onRemove() {
    this.container?.parentNode?.removeChild(this.container);
  }
}
export default DateSelectorControlClass;
