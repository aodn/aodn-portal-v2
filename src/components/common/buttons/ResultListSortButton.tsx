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
    label: "Relevance",
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

export interface ResultListSortButtonType<T> {
  currentSort: SortResultEnum | undefined;
  onChangeSorting?: (sort: T) => void;
  isIconOnly?: boolean;
}

interface ResultListSortButtonProps<T> extends ResultListSortButtonType<T> {}

const ResultListSortButton: FC<ResultListSortButtonProps<SortResultEnum>> = ({
  currentSort,
  onChangeSorting,
  isIconOnly,
}) => {
  return (
    <IconSelect
      items={SORT_SELECT}
      data-testid="result-sort-button"
      selectName="Sort"
      onSelectCallback={onChangeSorting}
      value={currentSort}
      isIconOnly={isIconOnly}
    />
  );
};

export default ResultListSortButton;
