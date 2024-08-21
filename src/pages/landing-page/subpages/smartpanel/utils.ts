import { ItemType } from "./smart-panel-constants";

export const getItemRows = (type: ItemType): number => {
  switch (type) {
    case ItemType.small:
    case ItemType.medium:
      return 1;
    case ItemType.large:
      return 2;
    default:
      return 1;
  }
};

export const getItemCols = (type: ItemType): number => {
  switch (type) {
    case ItemType.small:
      return 1;
    case ItemType.medium:
    case ItemType.large:
      return 2;
    default:
      return 1;
  }
};
