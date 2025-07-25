import React, { FC, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Box } from "@mui/material";

interface VerticalIndicatorProps {
  diamondSize?: number;
  index?: number;
  itemRefs: React.MutableRefObject<
    Array<React.RefObject<HTMLDivElement | null>>
  >;
}

const VerticalIndicator: FC<VerticalIndicatorProps> = ({
  diamondSize = 20,
  index = 0,
  itemRefs,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number>(0);
  const [activeY, setActiveY] = useState<number>(0);

  useLayoutEffect(() => {
    // Dynamic calculate the true height given all the itemRefs
    // useLayoutEffect runs synchronously immediately after React has performed all DOM mutations.
    // This can be useful if you need to make DOM measurements (like getting the scroll position or other
    // styles for an element) and then make DOM mutations or trigger a synchronous re-render by updating state.
    const updateHeight = () => {
      let totalHeight = 0;
      itemRefs.current.forEach((ref) => {
        if (ref.current) {
          totalHeight += ref.current.offsetHeight;
        }
      });
      setHeight(totalHeight);
    };

    // Add resize observers to each item ref to handle size changes
    const resizeObservers: ResizeObserver[] = [];

    if (itemRefs) {
      updateHeight(); // Initial height update

      itemRefs.current.forEach((ref) => {
        if (ref.current) {
          const observer = new ResizeObserver(updateHeight);
          observer.observe(ref.current);
          resizeObservers.push(observer);
        }
      });
    }

    return () => {
      resizeObservers.forEach((observer) => observer.disconnect()); // Cleanup on unmount
    };
  }, [itemRefs]);

  useEffect(() => {
    // Set initial activeY to the middle of the first item
    const target = itemRefs.current[index]?.current;
    if (target) {
      let itemAboveHeight = 0;
      for (let i = 0; i < index; i++) {
        if (itemRefs.current[i].current) {
          const k = itemRefs.current[i].current;
          if (k) {
            itemAboveHeight += k.offsetHeight;
          }
        }
      }
      setActiveY(itemAboveHeight + target.offsetHeight / 2);
    } else {
      // Fallback if first item is not available
      setActiveY(0);
    }
  }, [itemRefs, index]);

  // Diamond height is equal to width (20px by default)
  const diamondCenterOffset = diamondSize / 2;

  return (
    <Box
      ref={containerRef}
      sx={{
        position: "relative",
        width: `${diamondSize}px`,
        height: `${height}px`,
      }}
    >
      <svg
        width={diamondSize}
        height={height}
        style={{ position: "absolute", left: 0 }}
      >
        {/* Full vertical line */}
        <line
          x1={diamondSize / 2}
          y1={0}
          x2={diamondSize / 2}
          y2={height}
          stroke="#bdbdbd"
          strokeWidth="2"
        />
        {/* Diamond positioned with center at activeY */}
        <g
          transform={`translate(0, ${activeY - diamondCenterOffset})`}
          style={{ transition: "transform 0.2s ease" }}
        >
          <polygon
            points={`${diamondSize / 2},0 0,${diamondSize / 2} ${diamondSize / 2},${diamondSize} ${diamondSize},${diamondSize / 2}`}
            fill="#607d8b"
          />
        </g>
      </svg>
    </Box>
  );
};

export default VerticalIndicator;
