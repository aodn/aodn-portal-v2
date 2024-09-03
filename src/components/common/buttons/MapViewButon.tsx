import GridAndMapIcon from "../../icon/GridAndMapIcon";
import ListAndMapIcon from "../../icon/ListAndMapIcon";
import FullMapViewIcon from "../../icon/FullMapViewIcon";
import IconSelect from "../dropdown/IconSelect";
import { FC } from "react";

export enum SearchResultLayoutEnum {
  GRID = "GRID",
  LIST = "LIST",
  INVISIBLE = "INVISIBLE",
  VISIBLE = "VISIBLE",
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
    value: SearchResultLayoutEnum.INVISIBLE,
    label: "Full Map View",
    icon: FullMapViewIcon,
  },
];

interface MapViewButtonProps<T> {
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
