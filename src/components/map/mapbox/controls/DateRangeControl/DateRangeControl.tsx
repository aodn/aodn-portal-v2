import mapboxgl, { IControl, Map } from "mapbox-gl";
import { createRoot, Root } from "react-dom/client";
import { useContext, useEffect, useState } from "react";
import MapContext from "../../MapContext";
import DateSelectorControlClass from "./DateSelectorControl";

class DateRangeControlClass implements IControl {
  private container: HTMLDivElement | null = null;
  private iconRoot: Root | null = null;
  private map: Map | undefined | null = undefined;

  private setIsShowingDateSelector: () => void;

  constructor(setIsShowingDateSelector: () => void) {
    this.setIsShowingDateSelector = setIsShowingDateSelector;
  }

  onAdd(map: mapboxgl.Map): HTMLElement {
    this.map = map;
    this.container = document.createElement("div");
    this.container.className = "mapboxgl-ctrl-group mapboxgl-ctrl";
    this.iconRoot = createRoot(this.container);
    this.iconRoot.render(<button>daterange</button>);
    this.container.onclick = this.setIsShowingDateSelector;
    return this.container;
  }

  onRemove(map: mapboxgl.Map) {
    this.container?.parentNode?.removeChild(this.container);
    this.map = undefined;
  }
}

const DateRangeControl = ({
  setIsShowingDateSelector,
}: {
  setIsShowingDateSelector: () => void;
}) => {
  const { map } = useContext(MapContext);
  const [_, setDateRangeControl] = useState<DateRangeControlClass | null>(null);
  const [dateSelectorControl, setDateSelectorControl] =
    useState<DateSelectorControlClass>(
      new DateSelectorControlClass("1", "2", () => {})
    );
  const [isShowingSelector, setIsShowingSelector] = useState(false);

  const toggleIsShowingSelector = () => {
    setIsShowingSelector((prev) => !prev);
  };

  useEffect(() => {
    if (isShowingSelector) {
      map?.addControl(dateSelectorControl, "bottom-right");
    } else {
      map?.removeControl(dateSelectorControl);
    }
  }, [dateSelectorControl, isShowingSelector, map]);

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
