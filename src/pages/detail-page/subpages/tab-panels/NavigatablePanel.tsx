import { Box, CircularProgress, Grid } from "@mui/material";
import React, {
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import DetailSubtabBtn from "../../../../components/common/buttons/DetailSubtabBtn";
import _ from "lodash";

// a big number which is obviously bigger than all possible positions
const BIG_POSITION = 99999;

// the visible height of the navigatable panel. May change according to the design
const PANEL_VISIBLE_HEIGHT = 1480;

// the delay milliseconds for resizing the panel after scrolling. May change in
// the future if users feel it is too slow / too fast.
const RESIZE_DELAY = 400;

interface NavigatablePanelProps {
  childrenList: { title: string; component: ReactNode }[];
  isLoading: boolean;
}

const NavigatablePanel: React.FC<NavigatablePanelProps> = ({
  childrenList,
  isLoading,
}) => {
  const [scrollDistance, setScrollDistance] = useState<number | null>(null);
  const scrollableSectionRef = useRef<HTMLDivElement | null>(null);
  const firstRef = useRef<HTMLDivElement | null>(null);
  const secondRef = useRef<HTMLDivElement | null>(null);
  const thirdRef = useRef<HTMLDivElement | null>(null);
  const fourthRef = useRef<HTMLDivElement | null>(null);
  const basePointRef = useRef<HTMLDivElement | null>(null);
  const [position, setPosition] = useState(0);

  const [supplimentaryHeight, setSupplimentaryHeight] = useState(0);

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
  const lateResize = useCallback((toReSize: number) => {
    setTimeout(() => {
      setSupplimentaryHeight((prevHeight) => prevHeight + toReSize);
    }, RESIZE_DELAY);
  }, []);

  const getRefBy = useCallback((index: number) => {
    switch (index) {
      case 0:
        return firstRef;
      case 1:
        return secondRef;
      case 2:
        return thirdRef;
      case 3:
        return fourthRef;
    }
  }, []);

  const debounceScrollHandler = useRef<_.DebouncedFunc<
    (number: any) => void
  > | null>(null);

  useEffect(() => {
    debounceScrollHandler.current = _.debounce((scrollPosition: number) => {
      setPosition(scrollPosition);
    }, 300);

    return () => debounceScrollHandler.current?.cancel();
  }, []);

  const handleScroll = (event: React.UIEvent<HTMLDivElement, UIEvent>) => {
    const scrollPosition = event.currentTarget.scrollTop;
    debounceScrollHandler?.current?.(scrollPosition);
  };

  const isPositionInsideBlock = useCallback(
    (position: number, index: number): boolean => {
      // at the beginning, when refs are all null(not initialized yet), border the first one by default
      if (
        !firstRef.current &&
        !secondRef.current &&
        !thirdRef.current &&
        !fourthRef.current
      ) {
        return index === 0;
      }

      const fixedPosition = position + 10;
      switch (index) {
        case 0:
          return (
            fixedPosition <
            (secondRef?.current?.offsetTop ? secondRef?.current?.offsetTop : 0)
          );
        case 1:
          return (
            fixedPosition >=
              (secondRef?.current?.offsetTop
                ? secondRef?.current?.offsetTop
                : 0) &&
            fixedPosition <
              (thirdRef?.current?.offsetTop
                ? thirdRef?.current?.offsetTop
                : BIG_POSITION)
          );
        case 2:
          return (
            fixedPosition >=
              (thirdRef?.current?.offsetTop
                ? thirdRef?.current?.offsetTop
                : 0) &&
            fixedPosition <
              (fourthRef?.current?.offsetTop
                ? fourthRef?.current?.offsetTop
                : BIG_POSITION)
          );
        case 3:
          return (
            fixedPosition >=
            (fourthRef?.current?.offsetTop ? fourthRef?.current?.offsetTop : 0)
          );
        default:
          return false;
      }
    },
    []
  );

  const onNavigate = (index: number) => {
    return () => {
      const ref = getRefBy(index);
      if (!scrollableSectionRef.current || !ref?.current) return;
      const targetPosition = ref.current.offsetTop;

      // Calculate the needed height to scroll to the target position
      const currentScrollHeight = basePointRef.current
        ? basePointRef.current.offsetTop
        : 0;
      const visibleHeight = scrollableSectionRef.current.clientHeight;
      const neededHeight =
        targetPosition - (currentScrollHeight - visibleHeight);
      if (neededHeight >= 0) {
        setSupplimentaryHeight((prevHeight) => prevHeight + neededHeight);
      } else {
        lateResize(neededHeight);
      }
      setScrollDistance(targetPosition);
    };
  };

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
      <Grid item container md={3}>
        <Grid item md={11}>
          {childrenList.map((child, index) => {
            return (
              <DetailSubtabBtn
                key={index}
                title={child.title}
                isBordered={isPositionInsideBlock(position, index)}
                navigate={onNavigate(index)}
              />
            );
          })}
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
        <Box sx={{ height: `${supplimentaryHeight}px` }} />
        <Box ref={basePointRef} />
      </Grid>
    </Grid>
  );
};

export default NavigatablePanel;
