import { useMemo, useEffect } from "react";
import debounce from "lodash/debounce";

export const useDebounce = <T extends (...args: any[]) => any>(
  callback: T,
  delay: number
) => {
  const debouncedFunction = useMemo(
    () => debounce(callback, delay),
    [callback, delay]
  );

  useEffect(() => {
    return () => {
      debouncedFunction.cancel();
    };
  }, [debouncedFunction]);

  return debouncedFunction;
};
export default useDebounce;
