import { IControl, Map as MapboxMap } from "mapbox-gl";
import React, { useContext, useEffect, useState } from "react";
import { createRoot, Root } from "react-dom/client";
import DateRange, { DateRangeProps } from "./menu/DateRange";
import MapContext from "../MapContext";

class DateRangeControlClass implements IControl {
  private container: HTMLDivElement | null = null;
  private root: Root | null = null;
  private props: DateRangeProps;

  constructor(props: DateRangeProps) {
    this.props = props;
  }

  redraw(props: DateRangeProps) {
    this.props = props;
    this.root?.render(<DateRange {...this.props} />);
  }

  onAdd(map: MapboxMap): HTMLElement {
    this.container = document.createElement("div");
    this.container.className = "mapboxgl-ctrl";
    this.root = createRoot(this.container!);
    const newProps = { ...this.props, map };
    this.root.render(<DateRange {...newProps} />);
    return this.container;
  }

  onRemove(_: MapboxMap): void {
    if (this.container?.parentNode) {
      setTimeout(() => {
        this.container?.parentNode?.removeChild(this.container);
        this.container = null;
        this.root?.unmount();
      });
    }
  }

  getDefaultPosition(): string {
    return "top-right";
  }
}

const DateRangeControl = (props: DateRangeProps) => {
  const { map } = useContext(MapContext);
  const [control, setControl] = useState<DateRangeControlClass | null>(null);

  useEffect(() => {
    if (map === null) return;
    setControl((prev) => {
      if (!prev) {
        const n = new DateRangeControlClass(props);
        map?.addControl(n, "top-right");
        return n;
      }
      return prev;
    });
  }, [map, props]);

  useEffect(() => {
    if (control && map) {
      const newProps = { ...props, map };
      control.redraw(newProps);
    }
  }, [props, control, map]);

  return <React.Fragment />;
};

export default DateRangeControl;
