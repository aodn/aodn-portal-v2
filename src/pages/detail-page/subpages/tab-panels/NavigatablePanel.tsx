import { Box, CircularProgress, Grid } from "@mui/material";
import React, {
  createRef,
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import _ from "lodash";
import DetailSubtabBtn from "../../../../components/common/buttons/DetailSubtabBtn";
import VerticalIndicator from "../../../../components/common/indicator/VerticalIndicator";

// the visible height of the navigatable panel. May change according to the design
const PANEL_VISIBLE_HEIGHT = 1480;

// the delay milliseconds for resizing the panel after scrolling. May change in
// the future if users feel it is too slow / too fast.
const RESIZE_DELAY = 300;

const DEBOUNCE_DELAY = 100;

export interface NavigatablePanelChild {
  title: string;
  component: ReactNode;
}

interface NavigatablePanelProps {
  childrenList: NavigatablePanelChild[];
  isLoading: boolean;
}

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

  // For better scrolling animation, resizing happens after scrolling
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

          // Calculate the needed height to scroll to the target position
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
          const ref = getRefBy(index);
          return (
            <Box key={index} ref={ref}>
              {child.component}
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
