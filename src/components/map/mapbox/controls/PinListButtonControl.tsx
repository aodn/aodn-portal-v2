import React, { useContext, useEffect, useState } from "react";
import { createRoot, Root } from "react-dom/client";
import { IControl, Map } from "mapbox-gl";
import MapContext from "../MapContext";
import { OGCCollection } from "../../../common/store/OGCCollectionDefinitions";
import PinListButton from "../../../result/PinListButton";

export interface PinListButtonControlProps {
  showList?: boolean;
  pinList?: OGCCollection[] | undefined;
  selectedUuid?: string[];
  setSelectedUuid?: (uuids: Array<string>) => void;
  onRemoveFromPinList?: (idToRemove: string) => void;
}

class PinButtonControlClass implements IControl {
  private container: HTMLDivElement | null = null;
  private root: Root | null = null;
  private props: PinListButtonControlProps;

  constructor(props: PinListButtonControlProps) {
    this.props = props;
  }

  updateProps(props: PinListButtonControlProps) {
    this.props = props;
    this.render();
  }

  private render() {
    if (this.root && this.container) {
      this.root.render(
        <PinListButton
          showList={this.props.showList}
          pinList={this.props.pinList}
          selectedUuid={this.props.selectedUuid}
          setSelectedUuid={this.props.setSelectedUuid}
          onRemoveFromPinList={this.props.onRemoveFromPinList}
        />
      );
    }
  }

  onAdd(_: Map): HTMLElement {
    this.container = document.createElement("div");
    this.container.className = "mapboxgl-ctrl mapboxgl-ctrl-group";
    this.root = createRoot(this.container!);
    this.render();
    return this.container;
  }

  onRemove(_: Map): void {
    if (this.container?.parentNode) {
      // https://github.com/facebook/react/issues/25675#issuecomment-1518272581
      // Keep the old pointer
      setTimeout(() => {
        this.container?.parentNode?.removeChild(this.container);
        this.container = null;
        this.root?.unmount();
      });
    }
  }
}

const PinButtonControl = (props: PinListButtonControlProps) => {
  const { map } = useContext(MapContext);
  const [control, setControl] = useState<PinButtonControlClass | null>(null);

  useEffect(() => {
    if (map === null) return;
    // Only create once
    setControl((prev) => {
      if (!prev) {
        const newControl = new PinButtonControlClass(props);
        map?.addControl(newControl, "top-right");
        return newControl;
      }
      return prev;
    });
  }, [map, props]);

  useEffect(() => control?.updateProps(props), [control, props]);

  return <React.Fragment />;
};

export default PinButtonControl;
