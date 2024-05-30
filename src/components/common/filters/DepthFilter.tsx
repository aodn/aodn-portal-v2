import { Grid, SxProps, Theme } from "@mui/material";
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
      <Grid container>
        <Grid item xs={8}></Grid>
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
