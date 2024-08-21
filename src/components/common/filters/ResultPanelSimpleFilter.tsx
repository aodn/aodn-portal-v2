import {
  FormControl,
  Grid,
  IconButton,
  InputBase,
  MenuItem,
  Paper,
  Select,
  styled,
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
}

const ResultPanelSimpleFilter: FC<ResultPanelSimpleFilterProps> = ({
  count,
  total,
  onChangeLayout,
  onChangeSorting,
}) => {
  return (
    <Grid container justifyContent="center">
      <Grid container item xs={12} sx={{ pb: 1 }}>
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
        <SortButton onChangeSorting={onChangeSorting} />
        <MapListToggleButton onChangeLayout={onChangeLayout} />
      </Grid>
    </Grid>
  );
};

export default ResultPanelSimpleFilter;
