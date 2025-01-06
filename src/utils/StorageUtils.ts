import { isDraft } from "immer";
import { current } from "@reduxjs/toolkit";

const BOOKMARK_IDS_KEY = "bookmark-list";

export const saveBookmarkIdsToStorage = (items: Array<any>) => {
  try {
    if (!items || items.length === 0) {
      localStorage.removeItem(BOOKMARK_IDS_KEY);
      return;
    }

    // Convert from Immer draft if necessary
    const plainItems = isDraft(items) ? current(items) : items;
    const ids = plainItems.map((item) => item.id);
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
