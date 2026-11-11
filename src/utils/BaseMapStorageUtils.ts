export const getSavedBaseMapId = (storageKey: string): string | null => {
  try {
    return localStorage.getItem(storageKey);
  } catch {
    return null;
  }
};

export const saveBaseMapId = (storageKey: string, id: string): void => {
  try {
    localStorage.setItem(storageKey, id);
  } catch {
    // Preference is a nice-to-have; ignore storage failures.
  }
};
