import {
  FormControl,
  Grid,
  IconButton,
  InputBase,
  MenuItem,
  Paper,
  Select,
  styled,
} from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";

import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
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
    SortButtonProps {}

const ResultPanelSimpleFilter: FC<ResultPanelSimpleFilterProps> = ({
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
            width: { md: "500px" },
          }}
        >
          <IconButton sx={{ p: "10px" }} aria-label="search">
            <ArrowBackIosIcon />
          </IconButton>
          <FormControl fullWidth size="small">
            <Select
              value={1}
              input={<SlimSelect id="select1" name="select1" />}
            >
              <MenuItem value={1}>1-20 on 1258 matching</MenuItem>
            </Select>
          </FormControl>
          <IconButton sx={{ p: "10px" }}>
            <ArrowForwardIosIcon />
          </IconButton>
        </Paper>
        <SortButton onChangeSorting={onChangeSorting} />
        <MapListToggleButton onChangeLayout={onChangeLayout} />
      </Grid>
    </Grid>
  );
};

export default ResultPanelSimpleFilter;
