import { Grid, Stack } from "@mui/material";
import TimeRangeIcon from "../../icon/TimeRangeIcon";
import SpatialIcon from "../../icon/SpatialIcon";
import DimensionsIcon from "../../icon/Dimensions";

const ResultPanelIconFilter = () => {
  return (
    <Grid container sx={{ pl: 2 }}>
      <Grid item xs={12}>
        <Stack direction="column" spacing={2}>
          <TimeRangeIcon />
          <SpatialIcon />
          <DimensionsIcon />
        </Stack>
      </Grid>
    </Grid>
  );
};

export default ResultPanelIconFilter;
