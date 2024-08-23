import {
  FormControl,
  Grid,
  IconButton,
  InputBase,
  MenuItem,
  Paper,
  Select,
  styled,
  SxProps,
  Theme,
  Typography,
} from "@mui/material";
import MapListToggleButton, {
  MapListToggleButtonProps,
} from "../buttons/MapListToggleButton";
import SortButton, { SortButtonProps } from "../buttons/SortButton";
import { FC } from "react";

const SlimSelect = styled(InputBase)(() => ({
  "& .MuiInputBase-input": {
    border: "none",
  },
}));

interface ResultPanelSimpleFilterProps
  extends MapListToggleButtonProps,
    SortButtonProps {
  count: number;
  total: number;
  sx?: SxProps<Theme>;
}

const ResultPanelSimpleFilter: FC<ResultPanelSimpleFilterProps> = ({
  count,
  total,
  sx,
  onChangeLayout,
  onChangeSorting,
}) => {
  return (
    <Grid sx={sx} padding={1} container justifyContent="center">
      <Grid item xs={6} sx={{ pb: 1 }}>
        <Paper
          variant="outlined"
          component="form"
          sx={{
            p: "2px 4px",
            display: "flex",
            alignItems: "center",
            width: { md: "250px" },
          }}
        >
          <Typography>
            Showing 1-{count} of {total} results
          </Typography>
        </Paper>
      </Grid>
      <Grid item xs={3} sx={{ pb: 1 }}>
        <SortButton onChangeSorting={onChangeSorting} />
      </Grid>
      <Grid item xs={3} sx={{ pb: 1 }}>
        <MapListToggleButton onChangeLayout={onChangeLayout} />
      </Grid>
    </Grid>
  );
};

export default ResultPanelSimpleFilter;
