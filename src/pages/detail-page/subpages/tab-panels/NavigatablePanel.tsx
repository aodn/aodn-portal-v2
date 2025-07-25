import { Box, CircularProgress, Grid, useTheme } from "@mui/material";
import React, {
  createRef,
  FC,
  ReactNode,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import _ from "lodash";
import DetailSubtabBtn from "../../../../components/common/buttons/DetailSubtabBtn";

// the visible height of the navigatable panel. May change according to the design
const PANEL_VISIBLE_HEIGHT = 1480;

// the delay milliseconds for resizing the panel after scrolling. May change in
// the future if users feel it is too slow / too fast.
const RESIZE_DELAY = 300;

const DEBOUNCE_DELAY = 100;

export interface NavigatablePanelChild {
  title: string;
  component: (props: Record<string, any>) => ReactNode;
}

interface NavigatablePanelProps {
  childrenList: NavigatablePanelChild[];
  isLoading: boolean;
}

interface VerticalIndicatorProps {
  diamondSize?: number;
  index?: number;
  itemRefs: React.MutableRefObject<
    Array<React.RefObject<HTMLDivElement | null>>
  >;
}

const VerticalIndicator: FC<VerticalIndicatorProps> = ({
  diamondSize = 17,
  index = 0,
  itemRefs,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number>(0);
  const [activeY, setActiveY] = useState<number>(0);
  const theme = useTheme();

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
          stroke={theme.palette.grey500}
          strokeWidth="2"
        />
        {/* Diamond positioned with center at activeY */}
        <g
          transform={`translate(0, ${activeY - diamondCenterOffset})`}
          style={{ transition: "transform 0.2s ease" }}
        >
          <polygon
            points={`${diamondSize / 2},0 0,${diamondSize / 2} ${diamondSize / 2},${diamondSize} ${diamondSize},${diamondSize / 2}`}
            fill={theme.palette.primary.main}
          />
        </g>
      </svg>
    </Box>
  );
};

const NavigatablePanel: React.FC<NavigatablePanelProps> = ({
  childrenList,
  isLoading,
}) => {
  const [scrollDistance, setScrollDistance] = useState<number | null>(null);
  const scrollableSectionRef = useRef<HTMLDivElement | null>(null);
  const basePointRef = useRef<HTMLDivElement | null>(null);
  const [position, setPosition] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  const debounceScrollHandler = useRef<_.DebouncedFunc<
    (number: any) => void
  > | null>(null);

  // Create an array of refs with the same size as the menu list which is the size of childrenList
  const menuRefs = useRef(
    Array(childrenList.length)
      .fill(null)
      .map(() => createRef<HTMLDivElement>())
  );

  // Create an array of refs with the same size as the item list which is size of childrenList
  const contentRefs = useRef(
    Array(childrenList.length)
      .fill(null)
      .map(() => createRef<HTMLDivElement | null>())
  );

  const [supplementaryHeight, setSupplementaryHeight] = useState(0);

  useEffect(() => {
    if (!scrollDistance) {
      return;
    }
    scrollableSectionRef.current?.scroll({
      top: scrollDistance,
      behavior: "smooth",
    });
    setScrollDistance(null);
  }, [scrollDistance]);

  // For better-scrolling animation, resizing happens after scrolling
  const laybackDeductSize = useCallback((toReSize: number) => {
    setTimeout(() => {
      setSupplementaryHeight((prevHeight) =>
        prevHeight + toReSize > 0 ? prevHeight + toReSize : 0
      );
    }, RESIZE_DELAY);
  }, []);

  const getRefBy = useCallback(
    (index: number) => contentRefs.current[index],
    [contentRefs]
  );

  useEffect(() => {
    debounceScrollHandler.current = _.debounce((scrollPosition: number) => {
      setPosition((prevPosition) => {
        const difference = scrollPosition - prevPosition;
        if (difference < 0) {
          laybackDeductSize(difference);
        }
        return scrollPosition;
      });
    }, DEBOUNCE_DELAY);

    return () => debounceScrollHandler.current?.cancel();
  }, [laybackDeductSize]);

  const handleScroll = useCallback(
    (event: React.UIEvent<HTMLDivElement, UIEvent>) => {
      const scrollPosition = event.currentTarget.scrollTop;
      debounceScrollHandler?.current?.(scrollPosition);
      // This is use to update the selectedIndex if user scroll up the childlist
      // panel
      let newIndex = 0;
      let minDiff = Infinity;
      contentRefs.current.forEach((ref, idx) => {
        if (ref.current) {
          const diff = Math.abs(ref.current.offsetTop - scrollPosition);
          if (diff < minDiff) {
            minDiff = diff;
            newIndex = idx;
          }
        }
      });
      setSelectedIndex(newIndex);
    },
    []
  );

  const onNavigate = useCallback(
    (index: number) => {
      return () => {
        setSelectedIndex(index);

        const ref = getRefBy(index);
        if (scrollableSectionRef.current && ref?.current) {
          const targetPosition = ref.current.offsetTop;

          // Calculate the necessary height to scroll to the target position
          const bottomHeight = basePointRef.current
            ? basePointRef.current.offsetTop
            : 0;
          const neededHeight =
            targetPosition - (bottomHeight - PANEL_VISIBLE_HEIGHT);

          if (neededHeight >= 0) {
            setSupplementaryHeight((prevHeight) => prevHeight + neededHeight);
          }
          setScrollDistance(targetPosition);
        }
      };
    },
    [getRefBy]
  );

  return isLoading ? (
    <Grid
      container
      sx={{
        display: "flex",
        height: "500px",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <CircularProgress />
    </Grid>
  ) : (
    <Grid container>
      <Grid item container md={3} direction="row">
        <Grid
          container
          wrap="nowrap"
          direction="row" // Ensure buttons stack horizontal
        >
          <Grid item md={1}>
            <VerticalIndicator index={selectedIndex} itemRefs={menuRefs} />
          </Grid>
          <Grid item>
            {childrenList.map((child, index) => {
              return (
                <DetailSubtabBtn
                  key={index}
                  title={child.title}
                  onClick={onNavigate(index)}
                  ref={menuRefs.current[index]}
                />
              );
            })}
          </Grid>
        </Grid>
        <Grid item md={1} />
      </Grid>
      <Grid
        item
        md={9}
        ref={scrollableSectionRef}
        sx={{ height: PANEL_VISIBLE_HEIGHT + "px", overflowY: "auto" }}
        onScroll={handleScroll}
        position="relative"
      >
        {childrenList.map((child, index) => {
          return (
            <Box key={index} ref={getRefBy(index)}>
              {child.component({ selected: selectedIndex === index })}
            </Box>
          );
        })}
        <Box sx={{ height: `${supplementaryHeight}px` }} />
        <Box ref={basePointRef} />
      </Grid>
    </Grid>
  );
};

export default NavigatablePanel;
