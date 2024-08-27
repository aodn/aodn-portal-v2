// All the utils are based on const SMART_PANEL_ROWS = 2
import {
  SMART_PANEL_CARD_SIZE,
  SMART_PANEL_GAP,
  ItemData,
  ItemType,
} from "./constants";

export const getItemRows = (type: ItemType): number => {
  switch (type) {
    case ItemType.Small:
    case ItemType.Medium:
      return 1;
    case ItemType.Large:
      return 2;
    default:
      return 1;
  }
};

export const getItemCols = (type: ItemType): number => {
  switch (type) {
    case ItemType.Small:
      return 1;
    case ItemType.Medium:
    case ItemType.Large:
      return 2;
    default:
      return 1;
  }
};

export const calculateTotalCols = (items: ItemData[]): number => {
  // Count the number of each card type
  const cardCounts = items.reduce(
    (counts, item) => {
      counts[item.type]++;
      return counts;
    },
    { [ItemType.Large]: 0, [ItemType.Medium]: 0, [ItemType.Small]: 0 }
  );

  let totalCols = 0;

  // Calculate cols for large cards
  totalCols += cardCounts[ItemType.Large] * 2;

  // Calculate cols for medium cards
  totalCols += Math.floor(cardCounts[ItemType.Medium] / 2) * 2;

  // Handle remaining medium card and small cards
  let remainingSmallCards = cardCounts[ItemType.Small];
  if (cardCounts[ItemType.Medium] % 2 > 0 && remainingSmallCards >= 2) {
    totalCols += 2;
    remainingSmallCards -= 2;
  } else if (cardCounts[ItemType.Medium] % 2 > 0) {
    totalCols += 2;
  }

  // Handle remaining small cards
  if (remainingSmallCards > 0) {
    totalCols += Math.ceil(remainingSmallCards / 2);
  }

  return totalCols;
};

export const calculateImageListWidth = (items: ItemData[]): number => {
  const totalCols = calculateTotalCols(items);
  // Calculate width based on total columns, card size, and gaps
  return totalCols * SMART_PANEL_CARD_SIZE + (totalCols - 1) * SMART_PANEL_GAP;
};
