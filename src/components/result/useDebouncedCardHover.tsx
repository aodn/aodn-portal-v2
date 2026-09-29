import { useEffect, useMemo } from "react";
import debounce from "lodash/debounce";

/**
 * Debounces a result card hover callback, cancelling it on unmount.
 */
export const useDebouncedCardHover = <T extends (...args: any[]) => any>(
  onHover: T,
  wait: number
) => {
  const debouncedHover = useMemo(
    () => debounce(onHover, wait),
    [onHover, wait]
  );

  useEffect(() => () => debouncedHover.cancel(), [debouncedHover]);

  return debouncedHover;
};

export default useDebouncedCardHover;
