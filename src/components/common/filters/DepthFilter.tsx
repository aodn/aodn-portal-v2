import { Box, Grid, SxProps, Theme } from "@mui/material";
import DepthSlider from "../slider/DepthSlider";
import PlainDropdownMenu from "../dropdown/PlainDropdownMenu";
import { margin } from "../../../styles/constants";

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
    <Grid container sx={{ ...props.sx }}>
      <Grid item xs={12} display="flex" justifyContent="end">
        <Box sx={{ width: "40%" }}>
          <PlainDropdownMenu items={depthUnits} onSelectCallback={() => {}} />
        </Box>
      </Grid>
      <Grid
        item
        xs={12}
        sx={{ marginTop: margin.top, marginBottom: margin.bottom }}
      >
        <DepthSlider />
      </Grid>
    </Grid>
  );
};

export default DepthFilter;
