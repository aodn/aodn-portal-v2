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

// Need to check later
// const calculateTotalColumns = (items: ItemData[]): number => {
//   return items.reduce((total, item) => total + getItemCols(item.type), 0);
// };

// const calculateTotalRows = (items: ItemData[]): number => {
//   return items.reduce((total, item) => total + getItemRows(item.type), 0);
// };

// export const getSmartPanelCols = (items: ItemData[]) => {
//   const totalCols = calculateTotalColumns(items);
//   const totalRows = calculateTotalRows(items);
//   return Math.ceil((totalCols + totalRows) / 4);
// };
