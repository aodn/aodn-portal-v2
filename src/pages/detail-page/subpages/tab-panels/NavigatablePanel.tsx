import { Box, CircularProgress, Grid } from "@mui/material";
import React, {
  createRef,
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

  // Create an array of refs with the same size as the items list
  const refs = useRef(
    Array(childrenList.length)
      .fill(null)
      .map(() => createRef<HTMLDivElement | null>())
  );

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
  const laybackDeductSize = useCallback((toReSize: number) => {
    setTimeout(() => {
      setSupplimentaryHeight((prevHeight) =>
        prevHeight + toReSize > 0 ? prevHeight + toReSize : 0
      );
    }, RESIZE_DELAY);
  }, []);

  const getRefBy = useCallback((index: number) => refs.current[index], [refs]);

  const debounceScrollHandler = useRef<_.DebouncedFunc<
    (number: any) => void
  > | null>(null);

  useEffect(() => {
    debounceScrollHandler.current = _.debounce((scrollPosition: number) => {
      setPosition(scrollPosition);
      const differenceInPosition = scrollPosition - position;
      if (differenceInPosition < 0) {
        laybackDeductSize(differenceInPosition);
      }
    }, DEBOUNCE_DELAY);

    return () => debounceScrollHandler.current?.cancel();
  }, [laybackDeductSize, position]);

  const handleScroll = (event: React.UIEvent<HTMLDivElement, UIEvent>) => {
    const scrollPosition = event.currentTarget.scrollTop;
    debounceScrollHandler?.current?.(scrollPosition);
  };

  const isPositionInsideBlock = useCallback(
    (position: number, index: number): boolean => {
      // at the beginning, when refs are all null(not initialized yet), border the first one by default
      if (refs.current.some((ref) => !ref.current)) {
        return index === 0;
      }

      const fixedPosition = position + 10;
      if (index === 0) {
        // Start case
        const next = refs.current[1];
        return (
          next &&
          fixedPosition <
            (next?.current?.offsetTop ? next?.current?.offsetTop : 0)
        );
      } else if (index === refs.current.length - 1) {
        // End case
        const last = refs.current[refs.current.length - 1];
        return (
          last &&
          fixedPosition >=
            (last?.current?.offsetTop ? last?.current?.offsetTop : 0)
        );
      } else {
        const self = refs.current[index];
        const next = refs.current[index + 1];
        return (
          fixedPosition >=
            (self?.current?.offsetTop ? self?.current?.offsetTop : 0) &&
          fixedPosition <
            (next?.current?.offsetTop ? next?.current?.offsetTop : BIG_POSITION)
        );
      }
    },
    [refs]
  );

  const onNavigate = useCallback(
    (index: number) => {
      return () => {
        const ref = getRefBy(index);
        if (!scrollableSectionRef.current || !ref?.current) return;
        const targetPosition = ref.current.offsetTop;

        // Calculate the needed height to scroll to the target position
        const bottomHeight = basePointRef.current
          ? basePointRef.current.offsetTop
          : 0;
        const neededHeight =
          targetPosition - (bottomHeight - PANEL_VISIBLE_HEIGHT);

        if (neededHeight >= 0) {
          setSupplimentaryHeight((prevHeight) => prevHeight + neededHeight);
        }
        setScrollDistance(targetPosition);
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
      <Grid item container md={3}>
        <Grid item md={11}>
          {childrenList.map((child, index) => {
            return (
              <DetailSubtabBtn
                key={index}
                title={child.title}
                isBordered={isPositionInsideBlock(position, index)}
                onClick={onNavigate(index)}
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
