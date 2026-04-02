import { Box, CircularProgress, Grid, useTheme } from "@mui/material";
import React, {
  FC,
  ReactNode,
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import DetailSubtabBtn from "../../../../components/common/buttons/DetailSubtabBtn";
import useBreakpoint from "../../../../hooks/useBreakpoint";
import AIGenTag from "../../../../components/info/AIGenTag";
import { InfoContentType } from "../../../../components/info/InfoDefinition";

// the visible height of the navigable panel. May change, according to the design
const PANEL_VISIBLE_HEIGHT = 850;

export interface NavigatablePanelChild {
  title: string;
  component: (props: Record<string, any>) => ReactNode;
}

interface NavigatablePanelProps {
  childrenList: NavigatablePanelChild[];
  isLoading: boolean;
  AIGenContent?: InfoContentType;
}

interface VerticalIndicatorProps {
  diamondSize?: number;
  index?: number;
  itemRefs: Array<React.RefObject<HTMLDivElement | null>>;
}

const VerticalIndicator: FC<VerticalIndicatorProps> = ({
  diamondSize = 17,
  index = 0,
  itemRefs,
}) => {
  const [metrics, setMetrics] = useState({ totalHeight: 0, activeY: 0 });
  const theme = useTheme();

  useLayoutEffect(() => {
    const updateMetrics = () => {
      let totalHeight = 0;
      let activeY = 0;

      itemRefs.forEach((ref, i) => {
        const element = ref.current;
        if (!element) return;

        // If this is the active index, find its center point
        if (i === index) {
          activeY = totalHeight + element.offsetHeight / 2;
        }

        totalHeight += element.offsetHeight;
      });

      setMetrics({ totalHeight, activeY });
    };

    // Initialize measurements
    updateMetrics();

    // Observe every item for size changes
    const observers = itemRefs.map((ref) => {
      if (!ref.current) return null;
      const observer = new ResizeObserver(updateMetrics);
      observer.observe(ref.current);
      return observer;
    });

    return () => {
      observers.forEach((obs) => obs?.disconnect());
    };
    // Re-run if the index changes or the refs array changes
  }, [itemRefs, index]);

  const { totalHeight, activeY } = metrics;
  const diamondCenterOffset = diamondSize / 2;

  return (
    <Box
      sx={{
        position: "relative",
        width: `${diamondSize}px`,
        height: `${totalHeight}px`,
      }}
    >
      <svg
        width={diamondSize}
        height={totalHeight}
        style={{ position: "absolute", left: 0 }}
      >
        <line
          x1={diamondSize / 2}
          y1={diamondSize / 2}
          x2={diamondSize / 2}
          y2={totalHeight - diamondSize / 2}
          stroke={theme.palette.grey[500]}
          strokeWidth="1"
        />
        <g
          // Use the calculated activeY from the state
          transform={`translate(0, ${activeY - diamondCenterOffset})`}
          style={{ transition: "transform 0.3s ease-in-out" }}
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
  AIGenContent,
}) => {
  const scrollableSectionRef = useRef<HTMLDivElement | null>(null);
  const basePointRef = useRef<HTMLDivElement | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const { isUnderLaptop } = useBreakpoint();

  // Create an array of refs with the same size as the menu list which is the size of childrenList
  const [menuRefs] = useState<React.RefObject<HTMLDivElement | null>[]>(
    childrenList.map(() => React.createRef())
  );

  // Create an array of refs with the same size as the item list which is size of childrenList
  const [contentRefs] = useState<React.RefObject<HTMLDivElement | null>[]>(
    childrenList.map(() => React.createRef())
  );

  const handleScroll = useCallback(
    (event: React.UIEvent<HTMLDivElement, UIEvent>) => {
      // This is use to update the selectedIndex if user scroll up the childlist
      // panel
      const scrollPosition = event.currentTarget.scrollTop;

      let newIndex = 0;
      let minDiff = Infinity;
      contentRefs.forEach((ref, idx) => {
        if (ref.current) {
          const diff = Math.abs(ref.current.offsetTop - scrollPosition);
          if (diff < minDiff) {
            minDiff = diff;
            newIndex = idx;
          }
        }
      });
      // Must do the set index here otherwise you get multiple update
      // the navigate will trigger scroll, so we end up here
      setSelectedIndex(newIndex);
    },
    [contentRefs]
  );

  const onNavigate = useCallback(
    (index: number) => {
      return () => {
        const ref = contentRefs[index];
        const bpRef = basePointRef.current;
        const ssRef = scrollableSectionRef.current;

        if (ssRef && bpRef && ref?.current) {
          const distance = ref.current.offsetTop;
          // Add height to the base item if needed to make the pane scrollable
          // then scroll to top
          bpRef.style.paddingTop = `${ssRef.clientHeight - ref.current.clientHeight}px`;
          ssRef.scroll({
            top: distance,
            behavior: "smooth",
          });
        }
      };
    },
    [contentRefs]
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
      {!isUnderLaptop && (
        <Grid item md={3}>
          <Grid container wrap="nowrap" direction="row">
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
                    ref={menuRefs[index]}
                  />
                );
              })}
            </Grid>
          </Grid>
          <Grid item md={1} />
        </Grid>
      )}
      <Grid
        item
        xs={12}
        md={9}
        ref={scrollableSectionRef}
        sx={{
          height: PANEL_VISIBLE_HEIGHT + "px",
          overflowY: "auto",
        }}
        onScroll={handleScroll}
        position="relative"
        data-testid="scrollable-section"
      >
        {AIGenContent && (
          <Box
            position="absolute"
            zIndex="2"
            top={0}
            right={8}
            p="4px"
            bgcolor="#fff"
            borderRadius="50%"
          >
            <AIGenTag
              infoContent={{
                title: AIGenContent.title,
                body: AIGenContent.body,
              }}
            />
          </Box>
        )}

        {childrenList.map((child, index) => {
          return (
            <Box
              key={index}
              ref={contentRefs[index]}
              data-testid={`section-box-${index + 1}`} // Add test ID for parent Box
            >
              {child.component({ selected: selectedIndex === index })}
            </Box>
          );
        })}
        <Box ref={basePointRef} />
      </Grid>
    </Grid>
  );
};

export default NavigatablePanel;
