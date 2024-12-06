import mapboxgl, { IControl, Map } from "mapbox-gl";
import { createRoot, Root } from "react-dom/client";
import React, { useContext, useEffect, useMemo, useState } from "react";
import MapContext from "../../MapContext";
import DateSliderControlClass from "./DateSliderControl";
import timeRange from "../../../../../../src/assets/images/time-range.png";
import {
  DownloadConditionType,
  IDownloadCondition,
} from "../../../../../pages/detail-page/context/DownloadDefinitions";

class DateRangeControlClass implements IControl {
  private container: HTMLDivElement | null = null;
  private iconRoot: Root | null = null;
  private map: Map | undefined | null = undefined;

  private readonly setIsShowingDateSelector: () => void;

  constructor(setIsShowingDateSelector: () => void) {
    this.setIsShowingDateSelector = setIsShowingDateSelector;
  }

  onAdd(map: mapboxgl.Map): HTMLElement {
    this.map = map;
    this.container = document.createElement("div");
    this.container.className = "mapboxgl-ctrl-group mapboxgl-ctrl";
    this.iconRoot = createRoot(this.container);
    this.iconRoot.render(
      <button>
        <img alt="" src={timeRange}></img>
      </button>
    );
    this.container.onclick = this.setIsShowingDateSelector;
    return this.container;
  }

  onRemove(_: mapboxgl.Map) {
    this.container?.parentNode?.removeChild(this.container);
    this.map = undefined;
  }
}

interface DateRangeControlProps {
  minDate: string;
  maxDate: string;
  setDownloadConditions: (
    type: DownloadConditionType,
    conditions: IDownloadCondition[]
  ) => void;
}

const DateRangeControl: React.FC<DateRangeControlProps> = ({
  minDate,
  maxDate,
  setDownloadConditions,
}) => {
  const { map } = useContext(MapContext);
  const [_, setDateRangeControl] = useState<DateRangeControlClass | null>(null);
  const dateSliderControl = useMemo(
    () => new DateSliderControlClass(minDate, maxDate, setDownloadConditions),
    [maxDate, minDate, setDownloadConditions]
  );

  const [isShowingSelector, setIsShowingSelector] = useState(false);

  const toggleIsShowingSelector = () => {
    setIsShowingSelector((prev) => !prev);
  };

  useEffect(() => {
    if (isShowingSelector) {
      map?.addControl(dateSliderControl, "bottom-right");
    } else {
      map?.removeControl(dateSliderControl);
    }
  }, [dateSliderControl, isShowingSelector, map]);

  useEffect(() => {
    if (map === null) return;
    setDateRangeControl((prev) => {
      if (!prev) {
        const dateRangeControl = new DateRangeControlClass(
          toggleIsShowingSelector
        );
        map?.addControl(dateRangeControl, "top-right");
        return dateRangeControl;
      }
      return prev;
    });
  }, [map, setIsShowingSelector]);

  return <></>;
};

export default DateRangeControl;
