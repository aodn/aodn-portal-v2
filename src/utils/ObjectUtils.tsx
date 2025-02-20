import { merge } from "lodash";

const groupBy = <T, K extends keyof T>(
  array: T[],
  key: K
): Record<string, T[]> => {
  return array.reduce(
    (acc, item) => {
      const groupKey = String(item[key]);
      (acc[groupKey] = acc[groupKey] || []).push(item);
      return acc;
    },
    {} as Record<string, T[]>
  );
};

const mergeWithDefaults = <T extends object>(
  defaults: T,
  props?: Partial<T>
): T => {
  return merge({}, defaults, props);
};

export { mergeWithDefaults, groupBy };
