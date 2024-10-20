import { merge } from "lodash";

const mergeWithDefaults = <T extends object>(
  defaults: T,
  props?: Partial<T>
): T => {
  return merge({}, defaults, props);
};

export { mergeWithDefaults };
