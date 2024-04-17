import { Box, Grid, SxProps, Theme } from "@mui/material";
import { borderRadius, margin } from "../constants";
import blue from "../colors/blue";
import DepthSlider from "../slider/DepthSlider.tsx";
import PlainDropdownMenu from "../dropdown/PlainDropdownMenu.tsx";

interface DepthFiltersProps {
  sx?: SxProps<Theme>;
}

const DepthFilter = (props: DepthFiltersProps) => {
  const depthUnits = [
    "meters",
    "feet",
    "fathoms",
    "centimeters",
    "inches",
    "millimeters",
  ];
  return (
    <Grid
      container
      sx={{
        backgroundColor: blue["bgParam"],
        border: "none",
        borderRadius: borderRadius["filter"],
        justifyContent: "center",
        minHeight: "90px",
        ...props.sx,
      }}
    >
      <Grid
        container
        sx={{ marginTop: margin["top"], marginBottom: margin["bottom"] }}
      >
        <Grid item xs={2}>
          <Box display="flex" justifyContent="center" alignItems="center">
            Depth
          </Box>
        </Grid>
        <Grid item xs={6}></Grid>
        <Grid item xs={3}>
          <PlainDropdownMenu items={depthUnits} onSelectCallback={() => {}} />
        </Grid>
      </Grid>

      <Grid
        container
        sx={{ marginTop: margin["top"], marginBottom: margin["bottom"] }}
      >
        <Grid item xs={12}>
          <DepthSlider />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default DepthFilter;
