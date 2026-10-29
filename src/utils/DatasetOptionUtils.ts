import { SelectItem } from "@/components/common/dropdown/CommonSelect";

const DATASET_KEY_EXTENSION = /\.(zarr|parquet)$/i;

const toOptions = (
  keysOrItems: readonly string[] | readonly SelectItem<string>[],
  extension: RegExp
): SelectItem<string>[] => {
  if (keysOrItems.length === 0 || typeof keysOrItems[0] === "string") {
    return (keysOrItems as readonly string[]).map((key) => ({
      value: key,
      label: key.replace(extension, ""),
    }));
  }
  return (keysOrItems as readonly SelectItem<string>[]).map((item) => ({
    ...item,
  }));
};

// Copy before sorting so the caller's list is not mutated. Sort so a dataset
// name can be chosen to appear first in both the map and download UI.
export const sortDatasetOptions = (
  keysOrItems: readonly string[] | readonly SelectItem<string>[],
  extension: RegExp = DATASET_KEY_EXTENSION
): SelectItem<string>[] =>
  toOptions(keysOrItems, extension).sort((a, b) =>
    a.value < b.value ? -1 : a.value > b.value ? 1 : 0
  );
