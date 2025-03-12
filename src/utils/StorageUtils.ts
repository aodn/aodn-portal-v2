import { isDraft } from "immer";
import { current } from "@reduxjs/toolkit";
import { SearchResultLayoutEnum } from "../components/common/buttons/ResultListLayoutButton";
import { SortResultEnum } from "../components/common/buttons/ResultListSortButton";

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

/**
 * Interface defining user settings that will be persisted
 */
export interface UserSettings {
  selectedLayout: SearchResultLayoutEnum;
  currentSort: SortResultEnum | undefined;
}

// Storage key for user settings
export const USER_SETTINGS_STORAGE_KEY = "searchPageUserSettings";

/**
 * Saves user settings to localStorage
 * @param settings User settings object to save
 * @returns void
 */
export const saveUserSettings = (settings: UserSettings): void => {
  try {
    localStorage.setItem(USER_SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error("Failed to save user settings to localStorage", e);
  }
};

/**
 * Loads user settings from localStorage
 * @returns UserSettings object or null if not found or invalid
 */
export const loadUserSettings = (): UserSettings | null => {
  try {
    const settingsStr = localStorage.getItem(USER_SETTINGS_STORAGE_KEY);
    if (!settingsStr) return null;

    return JSON.parse(settingsStr) as UserSettings;
  } catch (e) {
    console.error("Failed to parse user settings from localStorage", e);
    return null;
  }
};

/**
 * Updates existing user settings with new values
 * @param settings Partial user settings to update
 * @returns Updated UserSettings object
 */
export const updateUserSettings = (
  settings: Partial<UserSettings>
): UserSettings => {
  // Get current settings or use defaults
  const currentSettings = loadUserSettings() || {
    selectedLayout: SearchResultLayoutEnum.LIST,
    currentSort: undefined,
  };

  // Create new settings object with updated values
  const updatedSettings = {
    ...currentSettings,
    ...settings,
  };

  // Save to localStorage
  saveUserSettings(updatedSettings);

  return updatedSettings;
};

/**
 * Clears all user settings from localStorage
 * @returns void
 */
export const clearUserSettings = (): void => {
  try {
    localStorage.removeItem(USER_SETTINGS_STORAGE_KEY);
  } catch (e) {
    console.error("Failed to clear user settings from localStorage", e);
  }
};
