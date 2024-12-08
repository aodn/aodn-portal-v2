import { OGCCollection } from "../components/common/store/OGCCollectionDefinitions";

const BOOKMARK_IDS_KEY = "bookmark-list";

export const saveBookmarkIdsToStorage = (items: Array<OGCCollection>) => {
  try {
    const ids = items.map((item) => item.id);
    localStorage.setItem(BOOKMARK_IDS_KEY, JSON.stringify(ids));
  } catch (e) {
    console.error("Error saving bookmark ids:", e);
  }
};

export const loadBookmarkIdsFromStorage = (): Array<string> => {
  try {
    const stored = localStorage.getItem(BOOKMARK_IDS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    console.error("Error loading bookmark ids:", e);
    return [];
  }
};
