import { useEffect, useRef, useState } from "react";

interface ElementSize {
  width: number;
  height: number;
}

/**
 * Measures an element with a ResizeObserver.
 *
 * By default, attach the returned `ref` to the element you want measured. Pass
 * `target` instead to measure an element you do not render — one reached
 * through the DOM, say — in which case the returned `ref` goes unused. Because
 * `target` is a dependency, it may resolve after mount (e.g. from a callback
 * ref) and the observer will pick it up when it does.
 */
const useElementSize = (target?: HTMLElement | null) => {
  const elementRef = useRef<HTMLDivElement | null>(null);
  const [size, setSize] = useState<ElementSize>({ width: 0, height: 0 });

  useEffect(() => {
    const element = target ?? elementRef.current;
    if (!element) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        setSize({ width, height });
      }
    });

    observer.observe(element);

    return () => observer.disconnect();
  }, [target]);

  return { ref: elementRef, ...size };
};

export default useElementSize;
