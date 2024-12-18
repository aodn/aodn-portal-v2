import { FC } from "react";
import { Box, Grid, SxProps, Theme } from "@mui/material";
import DepthSlider from "../../common/slider/DepthSlider";
import PlainDropdownMenu from "../../common/dropdown/PlainDropdownMenu";
import { margin } from "../../../styles/constants";
import { ParameterState } from "../../common/store/componentParamReducer";

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
      <Grid item xs={12} display="flex" justifyContent="end">
        <Box sx={{ width: "40%", marginTop: margin.lg }}>
          <PlainDropdownMenu items={DEPTH_UNITS} onSelectCallback={() => {}} />
        </Box>
      </Grid>
      <Grid
        item
        xs={12}
        sx={{ marginTop: margin.top, marginBottom: margin.bottom }}
      >
        <DepthSlider filter={filter} setFilter={setFilter} />
      </Grid>
    </Grid>
  );
};

export default DepthFilter;
