import { Map as MapBox } from "mapbox-gl";

export interface ControlProps {
  map?: MapBox;
  onEvent?: (...args: any[]) => void;
}

export type Menus = React.ReactElement<
  ControlProps,
  string | React.JSXElementConstructor<any>
>;

export interface MenuClickedEvent {
  event: MouseEvent;
  component: Menus;
}
