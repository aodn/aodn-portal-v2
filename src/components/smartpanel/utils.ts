import { ItemData, ItemType } from "./constants";

// export const CARD_ID = {
//   GET_START: 1,
//   SURFACE_WAVES: 2,
//   REEF: 4,
//   LOCATION: 5,
//   ADVANCED_SEARCH: 6,
//   TUTORIAL: 7,
//   ALL_TOPICS: 8,
//   OCEAN_BIOTA: 9,
//   EXPLORER_ON_MAP: 10,
//   FISHERY: 11,
//   TOURISM: 12,
//   SATELITE: 3,
// };

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

const calculateTotalColumns = (items: ItemData[]): number => {
  return items.reduce((total, item) => total + getItemCols(item.type), 0);
};

const calculateTotalRows = (items: ItemData[]): number => {
  return items.reduce((total, item) => total + getItemRows(item.type), 0);
};

export const getSmartPanelCols = (items: ItemData[]) => {
  const totalCols = calculateTotalColumns(items);
  const totalRows = calculateTotalRows(items);
  return totalRows % 2 > 1 ? totalCols / 2 + 1 : Math.ceil(totalCols / 2);
};
