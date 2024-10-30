import { FC } from "react";
import GridAndMapIcon from "../../icon/GridAndMapIcon";
import ListAndMapIcon from "../../icon/ListAndMapIcon";
import FullMapViewIcon from "../../icon/FullMapViewIcon";
import IconSelect from "../dropdown/IconSelect";
import ListAndDetailsIcon from "../../icon/ListAndDetailsIcon";

export enum SearchResultLayoutEnum {
  GRID = "GRID",
  LIST = "LIST",
  FULL_MAP = "FULL_MAP",
  FULL_LIST = "FULL_LIST",
}

const MAP_VIEW_SELECT = [
  {
    value: SearchResultLayoutEnum.LIST,
    label: "List and Map",
    icon: ListAndMapIcon,
  },
  {
    value: SearchResultLayoutEnum.GRID,
    label: "Grid and Map",
    icon: GridAndMapIcon,
  },
  {
    value: SearchResultLayoutEnum.FULL_MAP,
    label: "Full Map View",
    icon: FullMapViewIcon,
  },
  // TODO: Implement 'List and Details' once designed finished
  {
    value: SearchResultLayoutEnum.FULL_LIST,
    label: "List and Details",
    icon: ListAndDetailsIcon,
  },
];

export interface MapViewButtonProps<T> {
  currentLayout: Exclude<
    SearchResultLayoutEnum,
    SearchResultLayoutEnum.FULL_MAP
  >;
  onChangeLayout: (layout: T) => void;
}

const MapViewButton: FC<MapViewButtonProps<SearchResultLayoutEnum>> = ({
  onChangeLayout,
}) => {
  return (
    <IconSelect
      items={MAP_VIEW_SELECT}
      selectName="View"
      onSelectCallback={onChangeLayout}
    />
  );
};

export default MapViewButton;
