import { Box, CircularProgress, Grid } from "@mui/material";
import React, {
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import DetailSubtabBtn from "../../../../components/common/tabs/DetailSubtabBtn";
import _ from "lodash";

interface NavigatablePanelProps {
  childrenList: { title: string; component: ReactNode }[];
  isLoading: boolean;
}

const NavigatablePanel: React.FC<NavigatablePanelProps> = ({
  childrenList,
  isLoading,
}) => {
  const bigPosition = 99999;
  const panelVisibleHeight = 1480;
  const [toScroll, setToScroll] = useState<number | null>(null);
  const scrollableSectionRef = useRef<HTMLDivElement>(null);
  const firstRef = useRef<HTMLDivElement>(null);
  const secondRef = useRef<HTMLDivElement>(null);
  const thirdRef = useRef<HTMLDivElement>(null);
  const fourthRef = useRef<HTMLDivElement>(null);
  const basePointRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState(0);

  const [supplimentaryHeight, setSupplimentaryHeight] = useState(0);

  useEffect(() => {
    if (!toScroll) {
      return;
    }
    scrollableSectionRef.current?.scroll({
      top: toScroll,
      behavior: "smooth",
    });
    setToScroll(null);
  }, [toScroll]);

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

  const debouncee = useRef(
    _.debounce((number) => {
      setPosition(number);
    }, 300)
  ).current;

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
                : bigPosition)
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
                : bigPosition)
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
      setSupplimentaryHeight((prevHeight) => prevHeight + neededHeight);
      setToScroll(targetPosition);
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
        <Grid item md={1} />
        <Grid item container md={11}>
          <Grid item>
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
        </Grid>
      </Grid>
      <Grid
        item
        md={9}
        ref={scrollableSectionRef}
        sx={{ height: panelVisibleHeight + "px", overflowY: "auto" }}
        onScroll={(event) => {
          const scrollPosition = event.currentTarget.scrollTop;
          debouncee(scrollPosition);
        }}
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
