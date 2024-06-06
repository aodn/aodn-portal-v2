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
import MapListToggleButton from "../buttons/MapListToggleButton";
import SortButton from "../buttons/SortButton";
import React from "react";

// interface ResultPanelSimpleFilterProps {
//   filterClicked?: (e: React.MouseEvent<HTMLButtonElement>) => void;
// }

const SlimSelect = styled(InputBase)(() => ({
  "& .MuiInputBase-input": {
    border: "none",
  },
}));

const ResultPanelSimpleFilter = () => {
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
        <SortButton />
        <MapListToggleButton />
      </Grid>
    </Grid>
  );
};

export default ResultPanelSimpleFilter;
