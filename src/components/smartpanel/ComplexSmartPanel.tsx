import * as React from "react";
import { Grid, Box, Divider, SxProps, Theme, IconButton } from "@mui/material";
import { useCallback, useRef } from "react";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { margin } from "../../styles/constants";

interface ComplexSmartPanelProps {
  columns?: number;
  rows?: number;
  height?: string;
  bottomDivider?: boolean;
  gridColumns?: number;
  sx?: SxProps<Theme>;
}
const defaultProps = {
  columns: 9,
  rows: 2,
  gridColumns: 8,
  height: "95px",
  bottomDivider: false,
};

const ComplexSmartPanel = (
  props: React.PropsWithChildren<ComplexSmartPanelProps> = defaultProps
) => {
  const boxRef = useRef<HTMLDivElement>(null);

  const scroll = useCallback(
    (scrollOffset: number) => {
      if (boxRef && boxRef.current) {
        boxRef.current.scrollTo({
          left: boxRef.current.scrollLeft + scrollOffset,
          behavior: "smooth",
        });
      }
    },
    [boxRef]
  );

  return (
    <Grid container>
      <Grid item xs={12}>
        {
          // Create a container inside the item which occupy all area, then
          // set justify content to center, now within the container set a smaller
          // item so that the item is center in the container
          // The minWidth may need to calculate instead of hardcode
        }
        <Grid container>
          <Grid
            item
            xs={1}
            sx={{
              display: "flex",
              justifyContent: "start",
              alignItems: "center",
            }}
          >
            <Box>
              <IconButton
                onClick={() => scroll(-500)}
                sx={{ backgroundColor: "#7ba0b6" }}
              >
                <ArrowBackIosNewIcon
                  sx={{ pr: "4px", height: 38, width: 38, color: "white" }}
                />
              </IconButton>
            </Box>
          </Grid>
          <Grid item xs={10}>
            <Box ref={boxRef} sx={{ overflow: "hidden" }}>
              <Box
                display="grid"
                minWidth="1200px"
                marginTop={margin["tripleTop"]}
                marginBottom={margin["tripleBottom"]}
                gridTemplateColumns={"repeat(" + props.columns + ", 1fr)"}
                gridTemplateRows={
                  "repeat(" + props.rows + ", " + props.height + ")"
                }
                gap={3}
                sx={props.sx}
              >
                {props.children}
              </Box>
            </Box>
          </Grid>
          <Grid
            item
            xs={1}
            sx={{
              display: "flex",
              justifyContent: "end",
              alignItems: "center",
            }}
          >
            <Box>
              <IconButton
                onClick={() => scroll(500)}
                sx={{ backgroundColor: "#7ba0b6" }}
              >
                <ArrowForwardIosIcon
                  sx={{ pl: "4px", height: 38, width: 38, color: "white" }}
                />
              </IconButton>
            </Box>
            {props.bottomDivider && (
              <Grid item xs={8}>
                <Divider sx={{ borderBottomWidth: 5 }} />
              </Grid>
            )}
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default ComplexSmartPanel;
