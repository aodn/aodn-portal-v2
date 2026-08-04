// TODO: this component hasn't integrated in tab-filter yet, wait for ogcapi
import { FC } from "react";
import { Box, Grid, SxProps, Theme } from "@mui/material";
import DepthSlider from "../../common/slider/DepthSlider";
import PlainDropdownMenu from "../../common/dropdown/PlainDropdownMenu";
import { margin } from "@/styles/constants";
import { ParameterState } from "@/app/store/componentParamReducer";

interface DepthFiltersProps {
  filter: ParameterState;
  setFilter: React.Dispatch<React.SetStateAction<ParameterState>>;
  sx?: SxProps<Theme>;
}

const DEPTH_UNITS = [
  "meters",
  "feet",
  "fathoms",
  "centimeters",
  "inches",
  "millimeters",
];

const DepthFilter: FC<DepthFiltersProps> = ({ filter, setFilter, sx }) => {
  // TODO: implement DepthFilter when backend supports this query
  return (
    <Grid container sx={{ ...sx }}>
      <Grid display="flex" justifyContent="end" size={12}>
        <Box sx={{ width: "40%", marginTop: margin.lg }}>
          <PlainDropdownMenu items={DEPTH_UNITS} onSelectCallback={() => {}} />
        </Box>
      </Grid>
      <Grid
        sx={{ marginTop: margin.top, marginBottom: margin.bottom }}
        size={12}
      >
        <DepthSlider filter={filter} setFilter={setFilter} />
      </Grid>
    </Grid>
  );
};

export default DepthFilter;
