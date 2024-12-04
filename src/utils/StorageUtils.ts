import { OGCCollection } from "../components/common/store/OGCCollectionDefinitions";

const BOOKMARK_ITEMS_KEY = "bookmark-items";

export const loadBookmarksFromStorage = (): Array<OGCCollection> => {
  try {
    const stored = localStorage.getItem(BOOKMARK_ITEMS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    console.error("Error loading bookmarks:", e);
    return [];
  }
};

export const saveBookmarksToStorage = (items: Array<OGCCollection>) => {
  try {
    localStorage.setItem(BOOKMARK_ITEMS_KEY, JSON.stringify(items));
  } catch (e) {
    console.error("Error saving bookmarks:", e);
  }
};
