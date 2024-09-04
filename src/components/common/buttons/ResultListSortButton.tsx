import { FC } from "react";
import IconSelect from "../dropdown/IconSelect";
import RelevancyIcon from "../../icon/RelevancyIcon";
import PopularityIcon from "../../icon/PopularityIcon";
import TittleIcon from "../../icon/TittleIcon";
import ModifiedIcon from "../../icon/ModifiedIcon";

export enum SortResultEnum {
  RELEVANT = "RELEVANT",
  TITLE = "TITLE",
  POPULARITY = "POPULARITY",
  MODIFIED = "MODIFIED",
}

const SORT_SELECT = [
  {
    value: SortResultEnum.RELEVANT,
    label: "Relevancy",
    icon: RelevancyIcon,
  },
  {
    value: SortResultEnum.TITLE,
    label: "Title",
    icon: TittleIcon,
  },
  {
    value: SortResultEnum.POPULARITY,
    label: "Popularity",
    icon: PopularityIcon,
  },
  {
    value: SortResultEnum.MODIFIED,
    label: "Modified",
    icon: ModifiedIcon,
  },
];

interface MapViewButtonProps<T> {
  onChangeSorting: (sort: T) => void;
}

const ResultListSortButton: FC<MapViewButtonProps<SortResultEnum>> = ({
  onChangeSorting,
}) => {
  return (
    <IconSelect
      items={SORT_SELECT}
      selectName="Sort"
      onSelectCallback={onChangeSorting}
    />
  );
};

export default ResultListSortButton;
