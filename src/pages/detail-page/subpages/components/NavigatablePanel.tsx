import { Box, CircularProgress, Grid } from "@mui/material";
import React, { ReactNode, useCallback, useRef, useState } from "react";
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
  const scrollableSectionRef = useRef<HTMLDivElement>(null);
  const firstRef = useRef<HTMLDivElement>(null);
  const secondRef = useRef<HTMLDivElement>(null);
  const thirdRef = useRef<HTMLDivElement>(null);
  const fourthRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState(0);

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
                  navigate={() => {
                    const ref = getRefBy(index);
                    if (!scrollableSectionRef.current || !ref?.current) return;
                    const targetPosition = ref.current.offsetTop;
                    scrollableSectionRef.current.scroll({
                      top: targetPosition,
                      behavior: "smooth",
                    });
                  }}
                />
              );
            })}
          </Grid>
        </Grid>
      </Grid>
      <Grid
        item
        container
        md={9}
        ref={scrollableSectionRef}
        sx={{ height: "500px", overflowY: "auto" }}
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
      </Grid>
    </Grid>
  );
};

export default NavigatablePanel;
