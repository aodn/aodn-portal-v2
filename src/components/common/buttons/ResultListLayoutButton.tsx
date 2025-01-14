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
    label: "Full List View",
    icon: ListAndDetailsIcon,
  },
];

export interface ResultListLayoutButtonType<T> {
  currentLayout:
    | Exclude<SearchResultLayoutEnum, SearchResultLayoutEnum.FULL_MAP>
    | undefined;
  onChangeLayout?: (layout: T) => void;
  isIconOnly?: boolean;
}

interface ResultListLayoutButtonProps<T>
  extends ResultListLayoutButtonType<T> {}

const ResultListLayoutButton: FC<
  ResultListLayoutButtonProps<SearchResultLayoutEnum>
> = ({ onChangeLayout, currentLayout, isIconOnly }) => {
  return (
    <IconSelect
      items={MAP_VIEW_SELECT}
      data-testid="result-layout-button"
      selectName="View"
      onSelectCallback={onChangeLayout}
      value={currentLayout}
      isIconOnly={isIconOnly}
    />
  );
};

export default ResultListLayoutButton;
